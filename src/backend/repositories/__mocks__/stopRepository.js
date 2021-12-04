const stopsAndDepartures = require('./stopsAndDepartures.json')

const getStop = (stopGtfsId) => stopsAndDepartures[`stop:${stopGtfsId}`]

const getNextDepartures = (stopGtfsId, startTime) =>
    stopsAndDepartures[`nextDepartures:${stopGtfsId}@${startTime}`]

module.exports = {
    getStop,
    getNextDepartures,
}
