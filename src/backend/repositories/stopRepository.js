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
    speeds,
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

    cache.set(`stop:${stopGtfsId}`, JSON.stringify(stop))

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
const getNextDepartures = async (stopGtfsId, startTime, maxDistance = 250) => {
    const QUERY = gql`
        query stop($id: String!, $startTime: Long, $maxDistance: Int!) {
            stop(id: $id) {
                name
                code
                lat
                lon
                locationType
                transfers(maxDistance: $maxDistance) {
                    stop {
                        name
                        code
                        gtfsId
                        lat
                        lon
                        locationType
                    }
                    distance
                }
                stoptimesForPatterns(
                    numberOfDepartures: 1
                    startTime: $startTime
                    omitNonPickups: true
                ) {
                    pattern {
                        code
                        name
                        headsign
                        route {
                            mode
                        }
                    }
                    stoptimes {
                        scheduledDeparture
                        realtimeDeparture
                        scheduledArrival
                        realtimeArrival
                        realtime
                        serviceDay
                        stopSequence
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
        maxDistance,
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
            const stop = stoptime.trip.stoptimesForDate[stoptime.stopSequence]

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
                mode: route.pattern.route.mode,
                nextStop: {
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
                },
                boardable:
                    stoptime.trip.stoptimesForDate[stoptime.stopSequence - 1]
                        .pickupType,
                unixTimestamps: {
                    scheduledDeparture: stoptime.scheduledDeparture,
                    realtimeDeparture: stoptime.realtimeDeparture,
                    // scheduledArrival: stoptime.scheduledArrival,
                    // realtimeArrival: stoptime.realtimeArrival,
                    serviceDay: stoptime.serviceDay,
                },
            }

            departures.departures = [...departures.departures, facts]
        })
    })
    const transferStops = results.stop.transfers

    transferStops
        .sort((a, b) => a.distance - b.distance)
        .forEach((stop) => {
            const walkTime =
                (stop.distance / 1000 / speeds.WALK) * 60 * 60 * 1000
            const arrivedDate = convertEpochToDate(arrived + 1)
            const safeTime = 2 * 60 * 1000 // 2 minutes
            const afterWalk = new Date(
                arrivedDate.valueOf() + walkTime + safeTime
            )

            const serviceDay = new Date(
                new Date(
                    arrivedDate.getFullYear(),
                    arrivedDate.getMonth(),
                    arrivedDate.getDate()
                ).valueOf() -
                    2 * 60 * 60 * 1000
            )

            const facts = {
                name: `Walk to ${stop.stop.name} ${stop.stop.code} (${stop.stop.gtfsId})`,
                code: 'Walk',
                tripGtfsId: `WALK:${stopGtfsId}:${stop.stop.gtfsId}`,
                headsign: 'Walk',
                realtime: true,
                arrivesAt: convertEpochToDate(arrived + 1),
                realtimeArrivesAt: convertEpochToDate(arrived + 1),
                departuresAt: convertEpochToDate(arrived + 1),
                realtimeDeparturesAt: convertEpochToDate(arrived + 1),
                mode: 'WALK',
                nextStop: {
                    name: stop.stop.name,
                    code: stop.stop.code,
                    gtfsId: stop.stop.gtfsId,
                    coordinates: {
                        latitude: stop.stop.lat,
                        longitude: stop.stop.lon,
                    },
                    locationType: stop.stop.locationType,
                    arrivesAt: afterWalk,
                    realtimeArrivesAt: afterWalk,
                    departuresAt: afterWalk,
                    realtimeDeparturesAt: afterWalk,
                    serviceDay,
                },
                boardable: 'SCHEDULED',
                unixTimestamps: {
                    scheduledDeparture: convertDateToEpoch(arrived),
                    realtimeDeparture: convertDateToEpoch(arrived),
                    // scheduledArrival: stoptime.scheduledArrival,
                    // realtimeArrival: stoptime.realtimeArrival,
                    serviceDay: convertDateToEpoch(serviceDay),
                },
            }
            departures.departures = [...departures.departures, facts]
        })

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

    return departures
}

const getNearestStops = async (lat, lon, maxDistance = 250) => {
    const valid = await cache.check(`nearestStops@${lat};${lon};${maxDistance}`)
    if (valid) {
        const stops = await cache.get(
            `nearestStops@${lat};${lon};${maxDistance}`
        )
        return JSON.parse(stops)
    }

    const QUERY = gql`
        query ($lat: Float!, $lon: Float!, $maxDistance: Int!) {
            nearest(
                lat: $lat
                lon: $lon
                filterByPlaceTypes: STOP
                maxDistance: $maxDistance
            ) {
                edges {
                    node {
                        place {
                            ... on Stop {
                                name
                                code
                                gtfsId
                                lat
                                lon
                                locationType
                                platformCode
                                vehicleMode
                            }
                        }
                        distance
                    }
                }
            }
        }
    `

    const results = await api.request(QUERY, {
        lat,
        lon,
        maxDistance,
    })

    let stops = []

    results.nearest.edges.forEach((node) => {
        stops = [
            ...stops,
            { stop: node.node.place, distance: node.node.distance },
        ]
    })

    cache.set(
        `nearestStops@${lat};${lon};${maxDistance}`,
        JSON.stringify(stops)
    )

    return stops
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
        (value) => value.name.split(' ')[0] === route.split(' ')[0]
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
        converted = [...converted, [point[1], point[0]]]
    })

    cache.set(
        `routeLine:${stop}@${route.split(' ')[0]}`,
        JSON.stringify(converted)
    )

    return converted
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
            const gtfsId = feature.properties.id.split('#')[0].split('GTFS:')[1]
            if (!check.has(gtfsId)) {
                stops.stops = [
                    ...stops.stops,
                    {
                        name: feature.properties.name,
                        code: feature.properties.id.split('#')[1],
                        gtfsId,
                        vehicleMode: feature.properties.addendum.GTFS.modes[0],
                    },
                ]
                check.add(gtfsId)
            }
        } else if (feature.properties.source === 'openstreetmap') {
            const coordsStops = await getNearestStops(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
                1000
            )

            coordsStops.forEach((node) => {
                if (!check.has(node.stop.gtfsId)) {
                    stops.stops = [...stops.stops, node.stop]
                    check.add(node.stop.gtfsId)
                }
            })
        }
    }

    cache.set(`findStopsByText:${searchTerm}`, JSON.stringify(result.data))

    return stops
}

module.exports = {
    getStop,
    getNearestStops,
    getNextDepartures,
    getRouteline,
    findStopsByText,
}
