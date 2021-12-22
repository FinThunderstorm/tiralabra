/* eslint-disable */
require('module-alias/register')
const express = require('express')
const cors = require('cors')

const app = express()

const cache = require('@backend/redis')

const StopRepository = require('@repositories/stopRepository')

const PathFinder = require('@pathfinder/PathFinder')
const PerformanceTest = require('@backend/performanceTest')
const { apiHealth } = require('./graphql')

app.use(cors())
app.use(express.json())

app.get('/health', async (req, res) => {
    try {
        const apiStatus = await apiHealth()
        const redisStatus = await cache.test()
        res.status(200).send(
            `<h1>Health check ok! API: ${apiStatus} CACHE: ${redisStatus}</h1>`
        )
    } catch (error) {
        console.log('Error:', error)
        res.status(503).end()
    }
})

app.post('/search', async (req, res) => {
    const attributes = req.body
    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)
    if (startStop === null || endStop === null) {
        res.status(400).end()
        return
    }
    PathFinder.search(startStop, endStop, attributes.uStartTime).then(
        (searchedRoute) => {
            if (searchedRoute === null) {
                res.status(400).end()
                return
            }
            try {
                const routeJSON = searchedRoute.toJSON()
                res.json(routeJSON)
            } catch (error) {
                console.error(error)
                res.status(400).end()
            }
        }
    )
})

app.get('/stop/:stopGtfsId', async (req, res) => {
    StopRepository.getStop(req.params.stopGtfsId).then((stop) => {
        if (stop === null) {
            res.status(400).end()
            return
        }
        res.json(stop)
    })
})

app.get('/getTransferStops/:stopGtfsId', async (req, res) => {
    StopRepository.getTransferStops(req.params.stopGtfsId).then((stops) => {
        if (stops === null) {
            res.status(400).end()
            return
        }
        res.json(stops)
    })
})

app.get('/nextDepartures/:stopGtfsId', async (req, res) => {
    StopRepository.getNextDepartures(req.params.stopGtfsId, new Date()).then(
        (departures) => {
            if (departures === null) {
                res.status(400).end()
                return
            }
            res.json(departures)
        }
    )
})

app.post('/nextDepartures', async (req, res) => {
    const attributes = req.body
    StopRepository.getNextDepartures(
        attributes.gtfsId,
        attributes.startTime
    ).then((departures) => {
        if (departures === null) {
            res.status(400).end()
            return
        }
        res.json(departures)
    })
})

app.post('/findStops', async (req, res) => {
    const attributes = req.body

    const textResults = await StopRepository.findStopsByText(
        attributes.searchTerm
    )
    res.status(218).json(textResults)
})

app.post('/routeLine', async (req, res) => {
    const attributes = req.body
    StopRepository.getRouteline(
        attributes.stopGtfsId,
        attributes.time,
        attributes.route
    ).then((result) => {
        res.status(218).json(result)
    })
})

/* nextStop is gtfsId for nextStop
 * endStop is gtfsId for endStop
 * startTime is given in search, what is time after take a look into route
 * depatrturesAt is time, when leaved stop before nextStop
 * nextStopArrivesAt is time, when arrived from stop before to nextStop
 * */
app.post('/travelTime', async (req, res) => {
    const attributes = req.body

    const nextStop = await StopRepository.getStop(attributes.nextStop)
    const endStop = await StopRepository.getStop(attributes.endStop)

    const elapsed =
        Date.parse(attributes.departuresAt) - Date.parse(attributes.startTime)
    const takes =
        Date.parse(attributes.nextStopArrivesAt) -
        Date.parse(attributes.departuresAt)
    const timeAfter = elapsed + takes + PathFinder.heuristic(nextStop, endStop)

    res.json({
        attributes,
        nextStop,
        endStop,
        timeAfter,
    })
})

app.post('/performanceTest', async (req, res) => {
    const attributes = req.body
    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)
    const startTime = new Date(Date.parse(attributes.startTime))

    await cache.flushall()

    console.log('Starting perftest')
    const uncachedPfStart = performance.now()
    PerformanceTest.runPathFinder(startStop, endStop, startTime)
        .then((uncachedPfResult) => {
            const uncachedPfEnd = performance.now()
            PerformanceTest.runPathFinder(startStop, endStop, startTime)
                .then(() => {
                    PerformanceTest.runPathFinder(startStop, endStop, startTime)
                        .then(() => {
                            PerformanceTest.runPathFinder(
                                startStop,
                                endStop,
                                startTime
                            )
                                .then(() => {
                                    PerformanceTest.runPathFinder(
                                        startStop,
                                        endStop,
                                        startTime
                                    )
                                        .then(() => {
                                            PerformanceTest.runPathFinder(
                                                startStop,
                                                endStop,
                                                startTime
                                            )
                                                .then(() => {
                                                    PerformanceTest.runPathFinder(
                                                        startStop,
                                                        endStop,
                                                        startTime
                                                    )
                                                        .then(() => {
                                                            PerformanceTest.runPathFinder(
                                                                startStop,
                                                                endStop,
                                                                startTime
                                                            )
                                                                .then(() => {
                                                                    const pfStart =
                                                                        performance.now()
                                                                    PerformanceTest.runPathFinder(
                                                                        startStop,
                                                                        endStop,
                                                                        startTime
                                                                    )
                                                                        .then(
                                                                            (
                                                                                pfResult
                                                                            ) => {
                                                                                const pfEnd =
                                                                                    performance.now()
                                                                                const uncachedPfTook =
                                                                                    (uncachedPfEnd -
                                                                                        uncachedPfStart) /
                                                                                    1000
                                                                                const pfTook =
                                                                                    (pfEnd -
                                                                                        pfStart) /
                                                                                    1000
                                                                                const percentage =
                                                                                    ((uncachedPfTook -
                                                                                        pfTook) /
                                                                                        pfTook) *
                                                                                    100
                                                                                const difference =
                                                                                    uncachedPfTook -
                                                                                    pfTook
                                                                                res.json(
                                                                                    {
                                                                                        route: pfResult,
                                                                                        uncachedRoute:
                                                                                            uncachedPfResult,
                                                                                        took: {
                                                                                            uncachedPathfinder:
                                                                                                uncachedPfTook,
                                                                                            pathfinder:
                                                                                                pfTook,
                                                                                            resultText: `Uncached took ${uncachedPfTook.toFixed(
                                                                                                3
                                                                                            )} seconds and cached PathFinder took ${pfTook.toFixed(
                                                                                                3
                                                                                            )} seconds`,
                                                                                            comparation: `Cached PathFinder was ${percentage.toFixed(
                                                                                                3
                                                                                            )}% faster than uncached PathFinder\n -> Time difference was ${difference.toFixed(
                                                                                                3
                                                                                            )} seconds.`,
                                                                                        },
                                                                                    }
                                                                                )
                                                                            }
                                                                        )
                                                                        .catch(
                                                                            (
                                                                                error
                                                                            ) =>
                                                                                res
                                                                                    .status(
                                                                                        218
                                                                                    )
                                                                                    .send(
                                                                                        error
                                                                                    )
                                                                        )
                                                                })
                                                                .catch(
                                                                    (error) =>
                                                                        res
                                                                            .status(
                                                                                218
                                                                            )
                                                                            .send(
                                                                                error
                                                                            )
                                                                )
                                                        })
                                                        .catch((error) =>
                                                            res
                                                                .status(218)
                                                                .send(error)
                                                        )
                                                })
                                                .catch((error) =>
                                                    res.status(218).send(error)
                                                )
                                        })
                                        .catch((error) =>
                                            res.status(218).send(error)
                                        )
                                })
                                .catch((error) => res.status(218).send(error))
                        })
                        .catch((error) => res.status(218).send(error))
                })
                .catch((error) => res.status(218).send(error))
        })
        .catch((error) => res.status(218).send(error))
})

app.get('/flushall', async (req, res) => {
    const result = await cache.flushall()
    console.log('result of flushall', result)
    res.status(218).end()
})

app.get('/cache', async (req, res) => {
    const keys = await cache.getAllKeys()
    console.log('Keys in cache:', keys.length)
    const test = await cache.getAllValues(keys)
    const result = test.map((value) => JSON.parse(value))
    const pairs = {}
    for (let i = 0; i < result.length; i += 1) {
        pairs[keys[i]] = result[i]
    }
    res.json(pairs)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
