const { gql } = require('graphql-request')
const api = require('@backend/graphql')

const { convertEpochToDate } = require('@backend/utils/helpers')

/**
 * Hae pysäkin tiedot API:sta.
 * @summary Käytetään pysäkin tietojen hakemiseen ja parsimiseen Digitransitin API:n tietojen pohjalta.
 * @param {String} stopGtfsId - pysäkin id GTFS-formaatissa
 * @return {JSON} Pysäkin tiedot.
 */
const getStop = async (stopGtfsId) => {
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
        coordinates: {
            latitude: result.stop.lat,
            longitude: result.stop.lon,
        },
        locationType: result.stop.locationType,
    }

    return stop
}
/**
 * Jokaisen pysäkiltä lähtevän linjan 5 seuraavaa lähtöä.
 * @summary Haetaan jokaisen pysäkiltä lähtevän linjan 5 seuraavaa lähtöä, sekä niiden tiedot.
 * @param {String} stopGtfsId - pysäkin id GTFS-formaatissa
 * @return {JSON} Pysäkin perustiedot ja seuraavat 5 lähtöä jokaiselle kulkevalle linjalle lähtöaikajärjestyksessä.
 */
const getNextDepartures = async (stopGtfsId) => {
    const QUERY = gql`
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

    const results = await this.api.request(QUERY, {
        id: stopGtfsId,
    })

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

module.exports = {
    getStop,
    getNextDepartures,
}
