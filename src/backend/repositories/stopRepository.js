const { gql } = require('graphql-request')
const { api } = require('@backend/graphql')
const cache = require('@backend/redis')

const {
    convertEpochToDate,
    convertDateToEpoch,
    fixDepartures,
    distanceBetweenTwoPoints,
} = require('@backend/utils/helpers')

/**
 * Hae pysäkin tiedot API:sta.
 * @summary Käytetään pysäkin tietojen hakemiseen ja parsimiseen Digitransitin API:n tietojen pohjalta.
 * @param {String} stopGtfsId - pysäkin id GTFS-formaatissa
 * @return {JSON} Pysäkin tiedot.
 */
const getStop = async (stopGtfsId) => {
    const valid = await cache.check(`stop:${stopGtfsId}`)
    if (valid) {
        const stop = await cache.get(`stop:${stopGtfsId}`)
        return JSON.parse(stop)
    }

    const QUERY = gql`
        query stop($id: String!) {
            stop(id: $id) {
                name
                code
                lat
                lon
                locationType
            }
        }
    `

    const result = await api.request(QUERY, { id: stopGtfsId })

    const stop = {
        name: result.stop.name,
        code: result.stop.code,
        gtfsId: stopGtfsId,
        coordinates: {
            latitude: result.stop.lat,
            longitude: result.stop.lon,
        },
        locationType: result.stop.locationType,
    }

    await cache.set(`stop:${stopGtfsId}`, JSON.stringify(stop))

    return stop
}
/**
 * Jokaisen pysäkiltä lähtevän linjan seuraava lähtö.
 * @summary Haetaan jokaisen pysäkiltä lähtevän linjan seuraavan lähdön, sekä niiden tiedot.
 * Esimerkki pysäkin gtfsid:stä: HSL:1240103
 * @param {String} stopGtfsId - pysäkin id GTFS-formaatissa
 * @param {Number} startTime - aloitusaika UNIX-formaatissa (millisekuntit mukana)
 * @return {JSON} Pysäkin perustiedot ja seuraava lähtö jokaiselle kulkevalle linjalle lähtöaikajärjestyksessä.
 */
const getNextDepartures = async (stopGtfsId, startTime) => {
    const QUERY = gql`
        query stop($id: String!, $startTime: Long) {
            stop(id: $id) {
                name
                code
                lat
                lon
                locationType
                stoptimesForPatterns(
                    numberOfDepartures: 1
                    startTime: $startTime
                ) {
                    pattern {
                        code
                        name
                        headsign
                    }
                    stoptimes {
                        scheduledDeparture
                        realtimeDeparture
                        scheduledArrival
                        realtimeArrival
                        realtime
                        serviceDay
                        trip {
                            gtfsId
                            routeShortName
                            stoptimes {
                                stop {
                                    code
                                    name
                                    gtfsId
                                    lat
                                    lon
                                    locationType
                                }
                                pickupType
                                scheduledArrival
                                realtimeArrival
                                scheduledDeparture
                                realtimeDeparture
                                serviceDay
                            }
                        }
                    }
                }
            }
        }
    `
    const arrived = convertDateToEpoch(new Date(startTime))

    const valid = await cache.check(`nextDepartures:${stopGtfsId}@${arrived}`)
    if (valid) {
        const stop = await cache.get(`nextDepartures:${stopGtfsId}@${arrived}`)
        return fixDepartures(JSON.parse(stop))
    }

    const results = await api.request(QUERY, {
        id: stopGtfsId,
        startTime: arrived,
    })

    const departures = {}
    departures.stop = {
        name: results.stop.name,
        code: results.stop.code,
        gtfsId: stopGtfsId,
        coordinates: {
            latitude: results.stop.lat,
            longitude: results.stop.lon,
        },
        locationType: results.stop.locationType,
    }
    departures.departures = []
    results.stop.stoptimesForPatterns.forEach((route) => {
        route.stoptimes.forEach((stoptime) => {
            let res = null
            let check = false
            let boardable = true
            stoptime.trip.stoptimes.forEach((stop) => {
                if (res && check) return
                if (stop.stop.gtfsId === stopGtfsId) {
                    check = true
                    if (stop.pickupType === 'NONE') {
                        boardable = false
                    }
                    return
                }
                if (!res && check) {
                    res = {
                        name: stop.stop.name,
                        code: stop.stop.code,
                        gtfsId: stop.stop.gtfsId,
                        coordinates: {
                            latitude: stop.stop.lat,
                            longitude: stop.stop.lon,
                        },
                        locationType: stop.stop.locationType,
                        arrivesAt: convertEpochToDate(
                            stop.scheduledArrival + stoptime.serviceDay
                        ),
                        realtimeArrivesAt: convertEpochToDate(
                            stop.realtimeArrival + stoptime.serviceDay
                        ),
                        departuresAt: convertEpochToDate(
                            stop.scheduledDeparture + stoptime.serviceDay
                        ),
                        realtimeDeparturesAt: convertEpochToDate(
                            stop.realtimeDeparture + stoptime.serviceDay
                        ),
                        serviceDay: convertEpochToDate(stoptime.serviceDay),
                    }
                }
            })
            const facts = {
                name: route.pattern.name,
                code: route.pattern.code,
                tripGtfsId: stoptime.trip.gtfsId,
                headsign: route.pattern.headsign,
                realtime: stoptime.realtime,
                arrivesAt: convertEpochToDate(
                    stoptime.scheduledArrival + stoptime.serviceDay
                ),
                realtimeArrivesAt: convertEpochToDate(
                    stoptime.realtimeArrival + stoptime.serviceDay
                ),
                departuresAt: convertEpochToDate(
                    stoptime.scheduledDeparture + stoptime.serviceDay
                ),
                realtimeDeparturesAt: convertEpochToDate(
                    stoptime.realtimeDeparture + stoptime.serviceDay
                ),
                nextStop: res,
                boardable,
                unixTimestamps: {
                    scheduledDeparture: stoptime.scheduledDeparture,
                    realtimeDeparture: stoptime.realtimeDeparture,
                    // scheduledArrival: stoptime.scheduledArrival,
                    // realtimeArrival: stoptime.realtimeArrival,
                    serviceDay: stoptime.serviceDay,
                },
            }
            departures.departures = departures.departures.concat([facts])
        })
    })
    departures.departures = departures.departures
        .filter((a) => Date.parse(a.departuresAt) >= Date.parse(startTime))
        .sort((a, b) => a.departuresAt - b.departuresAt)

    cache.set(
        `nextDepartures:${stopGtfsId}@${arrived}`,
        JSON.stringify(departures)
    )

    return departures
}

const getRouteline = async (stop, time, route) => {
    const valid = await cache.check(`routeLine:${stop}@${route}`)
    if (valid) {
        const routeLine = await cache.get(`routeLine:${stop}@${route}`)
        return JSON.parse(routeLine)
    }

    if (route === null) {
        return undefined
    }
    const startStop = await getStop(stop)
    const departures = await getNextDepartures(stop, time)
    const nextStop = departures.departures.filter(
        (value) => value.name.split(' ')[0] === route
    )[0]

    if (nextStop === undefined) {
        return undefined
    }

    const QUERY = gql`
        query ($tripId: String!) {
            trip(id: $tripId) {
                routeShortName
                stops {
                    gtfsId
                    lat
                    lon
                }
                geometry
            }
        }
    `

    const startCoords = [
        startStop.coordinates.longitude,
        startStop.coordinates.latitude,
    ]
    const nextCoords = [
        nextStop.nextStop.coordinates.longitude,
        nextStop.nextStop.coordinates.latitude,
    ]
    console.log(startCoords, nextCoords)

    const result = await api.request(QUERY, { tripId: nextStop.tripGtfsId })
    const points = result.trip.geometry

    let nearestStart = {
        point: points[0],
        distance: Number.MAX_VALUE,
        index: 0,
    }
    let nearestNext = { point: points[0], distance: Number.MAX_VALUE, index: 0 }
    for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        const distanceToStart = distanceBetweenTwoPoints(
            { longitude: startCoords[0], latitude: startCoords[1] },
            { longitude: point[0], latitude: point[1] }
        )
        const distanceToNext = distanceBetweenTwoPoints(
            { longitude: nextCoords[0], latitude: nextCoords[1] },
            { longitude: point[0], latitude: point[1] }
        )
        if (distanceToStart < nearestStart.distance) {
            nearestStart = { point, distance: distanceToStart, index: i }
        }
        if (distanceToNext < nearestNext.distance) {
            nearestNext = { point, distance: distanceToNext, index: i }
        }
    }
    console.log(nearestStart, nearestNext)
    const slicedPoints = points.slice(nearestStart.index, nearestNext.index + 1)
    let converted = []
    slicedPoints.forEach((point) => {
        converted = converted.concat([[point[1], point[0]]])
    })

    cache.set(`routeLine:${stop}@${route}`, JSON.stringify(converted))

    return converted
}

module.exports = {
    getStop,
    getNextDepartures,
    getRouteline,
}
