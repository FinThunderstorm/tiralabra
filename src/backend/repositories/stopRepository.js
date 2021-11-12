const { gql } = require('graphql-request')
const redisClient = require('@backend/redis')
const graphqlClient = require('@backend/graphql')

const { convertEpochToDate } = require('@backend/utils/helpers')
const { cachetime } = require('@backend/config/config')

export default class StopRepository {
    constructor(api, cache) {
        this.api = api ?? redisClient
        this.cache = cache ?? graphqlClient
        this.cachevalid = cachetime ?? 60
    }

    async getStop(stopGtfsId) {
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

        const expires = await this.cache.ttl(`stop:${stopGtfsId}`)

        if (expires < 0) {
            const result = await this.api.request(QUERY, { id: stopGtfsId })

            const stop = {
                name: result.stop.name,
                code: result.stop.code,
                coordinates: {
                    latitude: result.stop.lat,
                    longitude: result.stop.lon,
                },
                locationType: result.stop.locationType,
            }

            await this.cache.set(`stop:${stopGtfsId}`, JSON.stringify(stop))
            await this.cache.expires(`stop:${stopGtfsId}`, this.cachevalid)

            return stop
        }

        const stop = JSON.parse(await this.cache.get(`stop:${stopGtfsId}`))
        return stop
    }

    async getNextDepartures(stopGtfsId) {
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

        const expires = await this.cache.ttl(`departures:${stopGtfsId}`)

        if (expires < 0) {
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
                    departures.departures = departures.departures.concat([
                        facts,
                    ])
                })
            })
            departures.departures = departures.departures.sort(
                (a, b) => a.departuresAt - b.departuresAt
            )

            await this.cache.set(
                `departures:${stopGtfsId}`,
                JSON.stringify(departures)
            )
            await this.cache.expires(
                `departures:${stopGtfsId}`,
                this.cachevalid
            )

            return departures
        }

        const departures = JSON.parse(
            await this.cache.get(`departures:${stopGtfsId}`)
        )
        return departures
    }
}
