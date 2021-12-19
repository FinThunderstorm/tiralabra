/* eslint-disable no-await-in-loop */
const axios = require('axios')
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

    if (result.stop === null) {
        return null
    }

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
                    omitNonPickups: true
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
                            stoptimesForDate {
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
        // console.log('Tsek', route)
        route.stoptimes.forEach((stoptime) => {
            let res = null
            let check = false
            let boardable = true
            stoptime.trip.stoptimesForDate.forEach((stop) => {
                if (res && check) return
                if (stop.stop.gtfsId === stopGtfsId) {
                    if (route.pattern.code === 'HSL:1007:1:02') {
                        console.log('ds', route.pattern, stop)
                    }
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
            // if (route.pattern.code === 'HSL:1007:1:02') {
            //     console.log('facts:', facts)
            // }
            departures.departures = departures.departures.concat([facts])
        })
    })
    console.log('before:', departures.departures)
    departures.departures = departures.departures
        .filter(
            (a) =>
                a.realtimeDeparturesAt.valueOf() >=
                Date.parse(startTime).valueOf()
        )
        .sort((a, b) => a.realtimeDeparturesAt - b.realtimeDeparturesAt)

    cache.set(
        `nextDepartures:${stopGtfsId}@${arrived}`,
        JSON.stringify(departures)
    )

    console.log('after:', departures.departures)

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
    const slicedPoints = points.slice(nearestStart.index, nearestNext.index + 1)
    let converted = []
    slicedPoints.forEach((point) => {
        converted = converted.concat([[point[1], point[0]]])
    })

    cache.set(`routeLine:${stop}@${route}`, JSON.stringify(converted))

    return converted
}

const findStopsByName = async (searchTerm) => {
    const valid = await cache.check(`findStopsByName:${searchTerm}`)
    if (valid) {
        const stops = await cache.get(`findStopsByName:${searchTerm}`)
        return JSON.parse(stops)
    }

    const QUERY = gql`
        query ($term: String!) {
            stops(name: $term) {
                name
                code
                gtfsId
                platformCode
                vehicleMode
            }
        }
    `

    const result = await api.request(QUERY, { term: searchTerm })

    cache.set(`findStopsByName:${searchTerm}`, JSON.stringify(result))

    return result
}

const findStopsByCoords = async (lon, lat) => {
    const valid = await cache.check(`findStopsByCoords:${lon};${lat}`)
    if (valid) {
        const stops = await cache.get(`findStopsByCoords:${lon};${lat}`)
        return JSON.parse(stops)
    }

    const QUERY = gql`
        query ($lon: Float!, $lat: Float!) {
            stopsByRadius(lon: $lon, lat: $lat, radius: 500) {
                edges {
                    node {
                        stop {
                            name
                            code
                            gtfsId
                            platformCode
                            vehicleMode
                        }
                        distance
                    }
                }
            }
        }
    `

    const result = await api.request(QUERY, { lon, lat })

    cache.set(`findStopsByCoords:${lon};${lat}`, JSON.stringify(result))

    return result
}

const findStopsByText = async (searchTerm) => {
    const valid = await cache.check(`findStopsByText:${searchTerm}`)
    if (valid) {
        const stops = await cache.get(`findStopsByText:${searchTerm}`)
        return JSON.parse(stops)
    }

    const result = await axios.get(
        'https://api.digitransit.fi/geocoding/v1/search',
        {
            params: {
                text: searchTerm,
                'focus.point.lat': 60.2,
                'focus.point.lon': 24.936,
                sources: 'gtfshsl,osm',
            },
        }
    )

    const check = new Set()
    const stops = {
        stops: [],
    }

    for (let i = 0; i < result.data.features.length; i += 1) {
        const feature = result.data.features[i]
        if (feature.properties.source === 'gtfshsl') {
            console.log(feature.properties.addendum)
            const gtfsId = feature.properties.id.split('#')[0].split('GTFS:')[1]
            if (!check.has(gtfsId)) {
                stops.stops = stops.stops.concat([
                    {
                        name: feature.properties.name,
                        code: feature.properties.id.split('#')[1],
                        gtfsId,
                        vehicleMode: feature.properties.addendum.GTFS.modes[0],
                    },
                ])
                check.add(gtfsId)
            }
        } else if (feature.properties.source === 'openstreetmap') {
            const coordsStops = await findStopsByCoords(
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1]
            )

            coordsStops.stopsByRadius.edges.forEach((node) => {
                if (!check.has(node.node.stop.gtfsId)) {
                    stops.stops = stops.stops.concat([node.node.stop])
                    check.add(node.node.stop.gtfsId)
                }
            })
        }
    }

    /*
    {
        "stops": [
            {
                "name": "Kamppi",
                "gtfsId": "HSL:1040279"
            }
        ]
    }
    */

    cache.set(`findStopsByText:${searchTerm}`, JSON.stringify(result.data))

    return stops
}

module.exports = {
    getStop,
    getNextDepartures,
    getRouteline,
    findStopsByName,
    findStopsByText,
}
