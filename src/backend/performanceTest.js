const PathFinder = require('@pathfinder/PathFinder')
const { api } = require('@backend/graphql')
const { gql } = require('graphql-request')

const runPathFinder = async (from, to, startTime) => {
    const result = await PathFinder.search(from, to, startTime)
    return result
}

const runOTP = async (from, to, startTime) => {
    const QUERY = gql`
        query plan(
            $fromLat: Float!
            $fromLon: Float!
            $toLat: Float!
            $toLon: Float!
            $date: String
            $time: String
        ) {
            plan(
                from: { lat: $fromLat, lon: $fromLon }
                to: { lat: $toLat, lon: $toLon }
                numItineraries: 1
                transportModes: [{ mode: BUS }, { mode: WALK }]
                date: $date
                time: $time
            ) {
                itineraries {
                    legs {
                        startTime
                        endTime
                        mode
                        trip {
                            gtfsId
                        }
                        duration
                        realTime
                        distance
                        transitLeg
                    }
                }
            }
        }
    `
    const date = startTime.toISOString().split('T')[0]
    const time = startTime.toISOString().split('T')[1].split('.')[0]
    const values = {
        fromLat: from.coordinates.latitude,
        fromLon: from.coordinates.longitude,
        toLat: to.coordinates.latitude,
        toLon: to.coordinates.longitude,
        date,
        time,
    }

    const result = await api.request(QUERY, values)
    return result
}

module.exports = {
    runOTP,
    runPathFinder,
}
