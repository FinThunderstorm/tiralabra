require('module-alias/register')
const express = require('express')
const app = express()
const redis = require('redis')
const client = require('@backend/redis')

const {
    getNextDepartures,
    getNextStopForTrip,
    getStop,
} = require('./components/stop')
const distanceBetweenTwoPoints = require('../pathfinder/PathFinder')

const CACHETIME = 30
// 'experimental cachetime >', Math.round(((departures.departures[0].departuresAt - timeNow)/1000)-60)

app.get('/health', (req, res) => {
    res.send('<h1>Health check ok!</h1>')
})

app.get('/testing', async (req, res) => {
    // Kumpulan kampus pohjoiseen HSL:1240103
    // Urheilutie etelään HSL:4620205
    const stop = 'HSL:4620205'

    const expires = await client.ttl(`departures:${stop}`)
    console.log('expires >', expires)
    if (expires < 0) {
        const departures = await getNextDepartures(stop)
        await client.set(`departures:${stop}`, JSON.stringify(departures))
        await client.expire(`departures:${stop}`, CACHETIME)
    }

    const test = await client.get(`departures:${stop}`)

    const stopXcode = 'HSL:4620205'
    const stopYcode = 'HSL:1240103'
    const stopXexpires = await client.ttl(`stop:${stopXcode}`)

    if (stopXexpires < 0) {
        const stopXobj = await getStop(stopXcode)
        const stopYobj = await getStop(stopYcode)

        await client.set(`stop:${stopXcode}`, JSON.stringify(stopXobj))
        await client.set(`stop:${stopYcode}`, JSON.stringify(stopYobj))
        await client.expire(`stop:${stopXcode}`, CACHETIME)
        await client.expire(`stop:${stopYcode}`, CACHETIME)
    }

    const stopX = JSON.parse(await client.get(`stop:${stopXcode}`))
    const stopY = JSON.parse(await client.get(`stop:${stopYcode}`))

    console.log('StopX >', stopX)
    console.log('StopY >', stopY)
    const distanceBetween = distanceBetweenTwoPoints(
        stopX.coordinates,
        stopY.coordinates
    )

    res.json({ distance: distanceBetween })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
