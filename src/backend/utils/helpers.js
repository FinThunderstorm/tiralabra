const convertEpochToDate = (epoch) => new Date(epoch * 1000)
const convertDateToEpoch = (date) => Math.floor(date.valueOf() / 1000)

const fixDepartures = (departured) => {
    const departures = departured
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

    return departures
}

const speeds = {
    TRAM: 14,
    BUS: 20,
    mainlineBus: 26,
    SUBWAY: 44,
    WALK: 5,
    RAIL: 54,
    FERRY: 17,
}

/**
 * distanceBetweenTwoPoints laskee haversine-funktiolla kahden koordinaattipisteen
 * välisen etäisyyden maapallon pintaa pitkin.
 * Lähde: Chamberlain B, 2001, "Q5.1: What is the best way to calculate the distance
 *        between 2 points?", luettu 3.12.2021.
 *        Saatavilla: https://web.archive.org/web/20041108132234/http://www.census.gov/cgi-bin/geo/gisfaq?Q5.1
 *
 * @param {JSON} coord1 JSON-objekti, jossa on kentässä latitude leveysaste
 *                      ja longitude pituusaste.
 * @param {JSON} coord2 JSON-objekti, jossa on kentässä latitude leveysaste
 *                      ja longitude pituusaste.
 * @returns {Number} matka kilometreinä
 */
const distanceBetweenTwoPoints = (coord1, coord2) => {
    const lonDiff =
        coord2.longitude * (Math.PI / 180) - coord1.longitude * (Math.PI / 180)
    const latDiff =
        coord2.latitude * (Math.PI / 180) - coord1.latitude * (Math.PI / 180)

    const haversine =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(coord1.latitude * (Math.PI / 180)) *
            Math.cos(coord2.latitude * (Math.PI / 180)) *
            Math.sin(lonDiff / 2) ** 2
    const invertHaversine = 2 * Math.asin(Math.min(1, Math.sqrt(haversine)))
    const earthRadius = 6367
    const distance = earthRadius * invertHaversine
    return distance
}

module.exports = {
    convertEpochToDate,
    convertDateToEpoch,
    speeds,
    fixDepartures,
    distanceBetweenTwoPoints,
}
