require('module-alias/register')
const express = require('express')
const app = express()
const redis = require('redis')
const client = require('@backend/redis')

const { getNextDepartures, getNextStopForTrip } = require('./components/stop')

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

    res.json(JSON.parse(test))


})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
