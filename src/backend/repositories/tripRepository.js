const { gql } = require('graphql-request')
const api = require('@backend/graphql')

const { convertEpochToDate } = require('@backend/utils/helpers')

// test trip HSL:4570_20211105_Su_2_1750
const getNextStop = async (tripGtfsId, startStopGtfsId) => {
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

    const results = await api.request(GETSTOPS, { id: tripGtfsId })

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
    getNextStop,
}
