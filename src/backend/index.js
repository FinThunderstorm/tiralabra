require('module-alias/register')
const express = require('express')
const cors = require('cors')

const app = express()

const cache = require('@backend/redis')

const StopRepository = require('@repositories/stopRepository')

const PathFinder = require('@pathfinder/PathFinder')
const PerformanceTest = require('@pathfinder/performanceTest')
const { api, apiHealth } = require('./graphql')

// const Route = require('../datastructures/Route')

// 'experimental cachetime >', Math.round(((departures.departures[0].departuresAt - timeNow)/1000)-60)

app.use(cors())
app.use(express.json())

app.get('/health', async (req, res) => {
    try {
        const apiStatus = await apiHealth()
        const redisStatus = await cache.test()
        res.status(200).send('<h1>Health check ok!</h1>')
    } catch (error) {
        console.log('Error:', error)
        res.status(503).end()
    }
})

app.post('/search', async (req, res) => {
    const attributes = req.body
    console.log('attr:', attributes)
    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)
    PathFinder.search(startStop, endStop, attributes.uStartTime).then(
        (searchedRoute) => {
            res.json(searchedRoute.toJSON())
        }
    )
})

app.get('/stop/:stopGtfsId', async (req, res) => {
    StopRepository.getStop(req.params.stopGtfsId).then((stop) => {
        res.json(stop)
    })
})

app.get('/nextDepartures/:stopGtfsId', async (req, res) => {
    StopRepository.getNextDepartures(req.params.stopGtfsId, new Date()).then(
        (departures) => {
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
        res.json(departures)
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
    console.log(attributes)
    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)
    const startTime = new Date(Date.parse(attributes.startTime))

    const otpStart = performance.now()
    PerformanceTest.runOTP(startStop, endStop, startTime)
        .then((otpResult) => {
            const otpEnd = performance.now()
            const pfStart = performance.now()
            PerformanceTest.runPathFinder(startStop, endStop, startTime)
                .then((pfResult) => {
                    const pfEnd = performance.now()
                    const otpTook = (otpEnd - otpStart) / 1000
                    const pfTook = (pfEnd - pfStart) / 1000
                    const percentage = ((pfTook - otpTook) / pfTook) * 100
                    const difference = pfTook - otpTook

                    res.json({
                        results: {
                            otp: otpResult,
                            pathfinder: pfResult,
                        },
                        took: {
                            otp: otpTook,
                            pathfinder: pfTook,
                            resultText: `OTP took ${otpTook.toFixed(
                                3
                            )} seconds and PathFinder took ${pfTook.toFixed(
                                3
                            )} seconds`,
                            comparation: `PathFinder was ${percentage.toFixed(
                                3
                            )}% slower than optimized OpenTripPlanner\n -> Time difference was ${difference.toFixed(
                                3
                            )} seconds.`,
                        },
                    })
                })
                .catch((error) => res.status(218).send(error))
        })
        .catch((error) => res.status(218).send(error))

    // if ('endOtp' !== undefined) {
    //     res.status(418).end()
    // }

    // res.json({ otpRes, endOtp })
})

app.get('/testing', async (req, res) => {
    const keys = await cache.getAllKeys()
    console.log('Keys in cache:', keys.length)
    const test = await cache.getAllValues(keys)
    const result = test.map((value) => JSON.parse(value))
    const pairs = {}
    for (let i = 0; i < result.length; i += 1) {
        pairs[keys[i]] = result[i]
    }
    res.json(pairs)

    // Kumpulan kampus pohjoiseen HSL:1240103
    // Urheilutie etelään HSL:4620205
    // const urheilutieCode = 'HSL:4620205'
    // // const kumpulaCode = 'HSL:1240103'
    // // const toinenSavuCode = 'HSL:4520237'
    // const kuusikkotieCode = 'HSL:4640213'
    // const urheilutie = await StopRepository.getStop(urheilutieCode)
    // // const kumpula = await StopRepository.getStop(kumpulaCode)
    // // const toinenSavu = await StopRepository.getStop(toinenSavuCode)
    // const kuusikkotie = await StopRepository.getStop(kuusikkotieCode)

    // // const nextUrheilutie = await StopRepository.getNextDepartures(
    // //     urheilutieCode
    // // )
    // // await res.json(nextUrheilutie)
    // // await res.json({distance: distanceBetweenTwoPoints(urheilutie.coordinates, kumpula.coordinates)})
    // cache.ttl('route:1').then((expired) => {
    //     if (expired < 0) {
    //         console.log('cache is old, refreshing')
    //         PathFinder.search(urheilutie, kuusikkotie).then((searchedRoute) => {
    //             // console.log('Searched route:', searchedRoute)
    //             cache.set('route:1', JSON.stringify(searchedRoute)).then(() => {
    //                 cache.expire('route:1', Math.round(cachetime / 4))
    //                 res.json(searchedRoute)
    //             })
    //         })
    //     } else {
    //         console.log('Was in cache, using that')
    //         cache
    //             .get('route:1')
    //             .then((searchedRoute) => res.json(JSON.parse(searchedRoute)))
    //     }
    // })

    // PathFinder.search(urheilutie, kuusikkotie).then((searchedRoute) => {
    //     console.log('Searched route:', searchedRoute)
    //     res.json(searchedRoute.toJSON())
    // })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
