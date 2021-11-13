const { GraphQLClient } = require('graphql-request')
const { gql } = require('graphql-request')
const client = require('@backend/redis')

const gQLClient = new GraphQLClient(
    'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
)

/**
 * HOX HOX! Koodia, jonka sijainti tulee vielä muuttumaan.
 */

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

module.exports = {
    getNextStopForTrip,
}

/**
 * trashCan sisältää käyttökelpoisia queryjä Digitransitin apia vasten, mutta niille ei ole vielä varsinaista käyttötarkoitusta.
 */

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
