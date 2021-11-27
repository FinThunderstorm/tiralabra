require('module-alias/register')
const express = require('express')
const cors = require('cors')
const redis = require('async-redis')

const app = express()
const { defaultHost, cachetime } = require('@config/config')

const cache = redis.createClient({ host: defaultHost })
cache.on('error', (error) => {
    console.error(error)
})

const StopRepository = require('@repositories/stopRepository')

const PathFinder = require('@pathfinder/PathFinder')

// const Route = require('../datastructures/Route')

// 'experimental cachetime >', Math.round(((departures.departures[0].departuresAt - timeNow)/1000)-60)

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.send('<h1>Health check ok!</h1>')
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
    console.log('attr:', attributes.startTime)
    StopRepository.getNextDepartures(
        attributes.gtfsId,
        attributes.startTime
    ).then((departures) => {
        res.json(departures)
    })
})

app.get('/testing', async (req, res) => {
    // Kumpulan kampus pohjoiseen HSL:1240103
    // Urheilutie etelään HSL:4620205
    const urheilutieCode = 'HSL:4620205'
    // const kumpulaCode = 'HSL:1240103'
    // const toinenSavuCode = 'HSL:4520237'
    const kuusikkotieCode = 'HSL:4640213'
    const urheilutie = await StopRepository.getStop(urheilutieCode)
    // const kumpula = await StopRepository.getStop(kumpulaCode)
    // const toinenSavu = await StopRepository.getStop(toinenSavuCode)
    const kuusikkotie = await StopRepository.getStop(kuusikkotieCode)

    // const nextUrheilutie = await StopRepository.getNextDepartures(
    //     urheilutieCode
    // )
    // await res.json(nextUrheilutie)
    // await res.json({distance: distanceBetweenTwoPoints(urheilutie.coordinates, kumpula.coordinates)})
    cache.ttl('route:1').then((expired) => {
        if (expired < 0) {
            console.log('cache is old, refreshing')
            PathFinder.search(urheilutie, kuusikkotie).then((searchedRoute) => {
                // console.log('Searched route:', searchedRoute)
                cache.set('route:1', JSON.stringify(searchedRoute)).then(() => {
                    cache.expire('route:1', Math.round(cachetime / 4))
                    res.json(searchedRoute)
                })
            })
        } else {
            console.log('Was in cache, using that')
            cache
                .get('route:1')
                .then((searchedRoute) => res.json(JSON.parse(searchedRoute)))
        }
    })

    // PathFinder.search(urheilutie, kuusikkotie).then((searchedRoute) => {
    //     console.log('Searched route:', searchedRoute)
    //     res.json(searchedRoute.toJSON())
    // })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
