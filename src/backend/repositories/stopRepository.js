const { gql } = require('graphql-request')
const api = require('@backend/graphql')

const { convertEpochToDate } = require('@backend/utils/helpers')
const { convertDateToEpoch } = require('../utils/helpers')

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
        gtfsId: stopGtfsId,
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
 * @summary Haetaan jokaisen pysäkiltä lähtevän linjan seuraavan lähdön, sekä niiden tiedot.
 * Esimerkki pysäkin gtfsid:stä: HSL:1240103
 * @param {String} stopGtfsId - pysäkin id GTFS-formaatissa
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

    const arrived = convertDateToEpoch(startTime)
    // console.log('Lähtöaika: ', arrived, convertDateToEpoch(startTime))
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
            stoptime.trip.stoptimes.forEach((stop) => {
                // console.log('loop Stop', stop)
                if (res && check) return
                if (stop.stop.gtfsId === stopGtfsId) {
                    check = true
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
