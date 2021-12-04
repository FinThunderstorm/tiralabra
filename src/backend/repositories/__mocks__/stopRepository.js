const stopsAndDepartures = require('./stopsAndDepartures.json')

const getStop = (stopGtfsId) => {
    const stop = stopsAndDepartures[`stop:${stopGtfsId}`]
    console.log(`stop:${stopGtfsId}`, stop)
    return stop
}

const getNextDepartures = (stopGtfsId, startTime) => {
    if (typeof startTime !== 'number') {
        startTime = Date.parse(startTime)
    }
    const time = startTime.valueOf()
    const departures =
        stopsAndDepartures[`nextDepartures:${stopGtfsId}@${time}`]
    console.log(`nextDepartures:${stopGtfsId}@${time}`, departures)
    return departures
}

module.exports = {
    getStop,
    getNextDepartures,
}
