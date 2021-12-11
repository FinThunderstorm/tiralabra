const { convertDateToEpoch } = require('@backend/utils/helpers')
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

    let departuresList = []
    departures.departures.forEach((departure) => {
        const values = {
            name: departure.name,
            code: departure.code,
            tripGtfsId: departure.tripGtfsId,
            headsign: departure.headsign,
            realtime: departure.realtime,
            arrivesAt: new Date(Date.parse(departure.arrivesAt)),
            realtimeArrivesAt: new Date(
                Date.parse(departure.realtimeArrivesAt)
            ),
            departuresAt: new Date(Date.parse(departure.departuresAt)),
            realtimeDeparturesAt: new Date(
                Date.parse(departure.realtimeDeparturesAt)
            ),
            nextStop: null,
            boardable: departure.boardable,
            unixTimestamps: departure.unixTimestamps,
        }
        if (departure.nextStop !== null) {
            values.nextStop = {
                name: departure.nextStop.name,
                code: departure.nextStop.code,
                gtfsId: departure.nextStop.gtfsId,
                coordinates: departure.nextStop.coordinates,
                locationType: departure.nextStop.locationType,
                arrivesAt: new Date(Date.parse(departure.nextStop.arrivesAt)),
                realtimeArrivesAt: new Date(
                    Date.parse(departure.nextStop.realtimeArrivesAt)
                ),
                departuresAt: new Date(
                    Date.parse(departure.nextStop.departuresAt)
                ),
                realtimeDeparturesAt: new Date(
                    Date.parse(departure.nextStop.realtimeDeparturesAt)
                ),
                serviceDay: new Date(Date.parse(departure.nextStop.serviceDay)),
            }
        }
        departuresList = departuresList.concat([values])
    })
    departures.departures = departuresList

    // console.log(`nextDepartures:${stopGtfsId}@${time}`, departures)
    return departures
}

module.exports = {
    getStop,
    getNextDepartures,
}
