const { convertDateToEpoch, fixDepartures } = require('@backend/utils/helpers')
const stopsAndDepartures = require('./stopsAndDepartures.json')

const getStop = (stopGtfsId) => {
    const stop = stopsAndDepartures[`stop:${stopGtfsId}`]
    console.log(`stop:${stopGtfsId}`, stop)
    return {
        name: stop.name,
        code: stop.code,
        gtfsId: stop.gtfsId,
        coordinates: stop.coordinates,
        locationType: stop.locationType,
        arrivesAt: new Date(Date.parse(stop.arrivesAt)),
    }
}

const getNextDepartures = (stopGtfsId, startTime) => {
    // if (typeof startTime !== 'number') {
    const time = convertDateToEpoch(new Date(Date.parse(startTime)))
    // }
    // console.log(`asked with nextDepartures:${stopGtfsId}@${time}`)
    const departures =
        stopsAndDepartures[`nextDepartures:${stopGtfsId}@${time}`]

    if (departures === undefined) {
        return undefined
    }

    return fixDepartures(departures)
}

module.exports = {
    getStop,
    getNextDepartures,
}
