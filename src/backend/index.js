require('module-alias/register')
const express = require('express')

const app = express()
// const redis = require('redis')

const StopRepository = require('@repositories/stopRepository')

// 'experimental cachetime >', Math.round(((departures.departures[0].departuresAt - timeNow)/1000)-60)

app.get('/health', (req, res) => {
    res.send('<h1>Health check ok!</h1>')
})

app.get('/testing', async (req, res) => {
    // Kumpulan kampus pohjoiseen HSL:1240103
    // Urheilutie etelään HSL:4620205
    const urheilutieCode = 'HSL:4620205'
    const kumpulaCode = 'HSL:1240103'

    const urheilutie = await StopRepository.getStop(urheilutieCode)
    const kumpula = await StopRepository.getStop(kumpulaCode)

    res.json({ ...kumpula, ...urheilutie })
    // await res.json({distance: distanceBetweenTwoPoints(urheilutie.coordinates, kumpula.coordinates)})
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
