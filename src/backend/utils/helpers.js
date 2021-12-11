const convertEpochToDate = (epoch) => new Date(epoch * 1000)
const convertDateToEpoch = (date) => Math.floor(date.valueOf() / 1000)

const fixDepartures = (departure) => {
    const departures = departure
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

const speeds = {
    tram: 14,
    bus: 20,
    mainlineBus: 26,
    metro: 44,
}

module.exports = {
    convertEpochToDate,
    convertDateToEpoch,
    speeds,
    fixDepartures,
}
