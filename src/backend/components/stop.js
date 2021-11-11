const { GraphQLClient } = require('graphql-request')
const { gql } = require('graphql-request')
const client = require('@backend/redis')

const gQLClient = new GraphQLClient(
    'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
)

const getNextDepartures = async (stopGtfsId) => {
    console.log(`Trying to get routes for stop ${stopGtfsId}`)

    // test stop HSL:4620205
    const GETNEXTDEPATURESFORALLROUTESFROMSTOP = gql`
        query stop($id: String!) {
            stop(id: $id) {
                name
                code
                lat
                lon
                locationType
                stoptimesForPatterns(numberOfDepartures: 5) {
                    pattern {
                        code
                        name
                        headsign
                    }
                    stoptimes {
                        scheduledDeparture
                        realtimeDeparture
                        realtime
                        serviceDay
                        trip {
                            gtfsId
                        }
                    }
                }
            }
        }
    `

    const results = await gQLClient.request(
        GETNEXTDEPATURESFORALLROUTESFROMSTOP,
        { id: stopGtfsId }
    )

    const departures = {}
    departures.stop = {
        name: results.stop.name,
        code: results.stop.code,
        coordinates: {
            latitude: results.stop.lat,
            longitude: results.stop.lon,
        },
        locationType: results.stop.locationType,
    }
    departures.departures = []
    results.stop.stoptimesForPatterns.forEach((route) => {
        route.stoptimes.forEach((stoptime) => {
            const facts = {
                name: route.pattern.name,
                code: route.pattern.code,
                tripGtfsId: stoptime.trip.gtfsId,
                headsign: route.pattern.headsign,
                realtime: stoptime.realtime,
                departuresAt: convertEpochToDate(
                    stoptime.scheduledDeparture + stoptime.serviceDay
                ),
                realtimeDeparturesAt: convertEpochToDate(
                    stoptime.realtimeDeparture + stoptime.serviceDay
                ),
                unixTimestamps: {
                    scheduledDeparture: stoptime.scheduledDeparture,
                    realtimeDeparture: stoptime.realtimeDeparture,
                    serviceDay: stoptime.serviceDay,
                },
            }
            departures.departures = departures.departures.concat([facts])
        })
    })
    departures.departures = departures.departures.sort(
        (a, b) => a.departuresAt - b.departuresAt
    )
    return departures
}

const getStop = async (stopGtfsId) => {
    const GETSTOP = gql`
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

    const result = await gQLClient.request(GETSTOP, { id: stopGtfsId })

    const stop = {
        name: result.stop.name,
        code: result.stop.code,
        coordinates: { latitude: result.stop.lat, longitude: result.stop.lon },
        locationType: result.stop.locationType,
    }

    return stop
}

// test trip HSL:4570_20211105_Su_2_1750
const getNextStopForTrip = async (tripGtfsId, startStopGtfsId) => {
    const GETSTOPS = gql`
        query trip($id: String!) {
            trip(id: $id) {
                routeShortName
                tripHeadsign
                stoptimes {
                    stop {
                        code
                        name
                        gtfsId
                        lat
                        lon
                        locationType
                    }
                    scheduledArrival
                    scheduledDeparture
                    serviceDay
                }
            }
        }
    `

    const results = await gQLClient.request(GETSTOPS, { id: tripGtfsId })

    let res = null
    let check = false
    results.trip.stoptimes.forEach((stop) => {
        if (res && check) return
        if (stop.stop.gtfsId === startStopGtfsId) {
            // console.log(`Stop ${stop.stop.gtfsId} === ${startStopGtfsId}`)
            check = true
            return
        }
        if (!res && check) {
            res = {
                route: results.trip.routeShortName,
                headsign: results.trip.tripHeadsign,
                code: stop.stop.code,
                name: stop.stop.name,
                coordinates: {
                    latitude: stop.stop.lat,
                    longitude: stop.stop.lon,
                },
                locationType: stop.stop.locationType,
                gtfsId: stop.stop.gtfsId,
                arrivesAt: convertEpochToDate(
                    stop.scheduledArrival + stop.serviceDay
                ),
                departuresAt: convertEpochToDate(
                    stop.scheduledDeparture + stop.serviceDay
                ),
            }
        }
    })
    return res
}

const convertEpochToDate = (epoch) => new Date(epoch * 1000)

module.exports = {
    getNextDepartures,
    convertEpochToDate,
    getNextStopForTrip,
    getStop,
}

const trashCan = () => {
    const GETROUTES = gql`
        query {
            stop(id: "HSL:4620205") {
                routes {
                    shortName
                    longName
                    patterns {
                        code
                        directionId
                        name
                        headsign
                    }
                }
            }
        }
    `

    const GETNEXTDEPARTURESFORROUTE = gql`
        query {
            stop(id: "HSL:4620205") {
                name
                stopTimesForPattern(
                    id: "HSL:4711:1:01"
                    numberOfDepartures: 10
                ) {
                    scheduledDeparture
                    serviceDay
                }
            }
        }
    `
}
