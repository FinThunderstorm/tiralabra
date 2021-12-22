/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const PriorityQueue = require('@datastructures/MinHeap')
const StopRepository = require('@repositories/stopRepository')
const Route = require('@datastructures/Route')
const { speeds } = require('@helpers')

/**
 * PathFinderin funktioita käytetään reitin hakemiseen kahden pisteen välillä.
 */

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

/**
 * Käytetään heuristisen aika-arvion laskemiseen lähtöpysäköiltä kohdepysäkille.
 * Laskee tällä hetkellä heuristisen aika-arvion maapallon pintaa viivasuoraa
 * etäisyyttä pysäkkien välillä hyödyntäen. Tällä hetkellä käyttää vain bussin
 * keskimääräistä nopeutta HSL-liikenteessä.
 *
 * @param {Stop} startStop lähtöpysäkki
 * @param {Stop} endStop kohdepysäkki
 * @returns aika-arvio millisekunteissa (yhteensopivuus Date-olion kanssa)
 */
const heuristic = (startStop, endStop, mode = 'BUS') => {
    const distance = distanceBetweenTwoPoints(
        startStop.coordinates,
        endStop.coordinates
    )
    const speed = speeds[mode] // bussi 20km/h
    const time = distance / speed
    return time * 60 * 60 * 1000
}

/**
 * search-funktiolla haetaan lyhin reitti ajallisesti kahden pysäkin välillä
 * käyttäen A*-algoritmiä ja minimikekoa prioriteettijonona.
 *
 * @param {JSON} startStop lähtöpysäkki
 * @param {JSON} endStop kohdepysäkki
 * @param {Number} uStartTime käyttäjän spesifioima lähtöaika
 * @param {boolean} cacheMore
 * @returns {Route} suositeltu reitti Route-oliona.
 */
const search = async (startStop, endStop, uStartTime) => {
    const queue = new PriorityQueue()
    // let visited = new Set()
    let visited = []

    const startTime = new Date(uStartTime)
    const from = startStop
    from.arrivesAt = startTime

    const startRoute = new Route(from, 0, startTime, 'start')
    queue.push(startRoute)

    let route = queue.pop()
    while (route.stop.gtfsId !== endStop.gtfsId) {
        // if (!visited.has(`${route.stop.gtfsId}:${route.route}`)) {
        if (visited.indexOf(`${route.stop.gtfsId}:${route.route}`) === -1) {
            // visited = visited.add(`${route.stop.gtfsId}:${route.route}`)
            visited = [...visited, `${route.stop.gtfsId}:${route.route}`]

            const departures = await StopRepository.getNextDepartures(
                route.stop.gtfsId,
                route.arrived
            )

            if (departures !== undefined) {
                departures.departures.forEach((departure) => {
                    // tarkastetaan, ettei ole linjan päätepysäkki tai pysäkiltä ei voi hypätä kyytiin

                    if (
                        departure.nextStop !== null &&
                        departure.boardable !== 'NONE'
                    ) {
                        // fallback for older syntax
                        if (departure.boardable === false) {
                            return
                        }

                        const elapsed =
                            departure.realtimeDeparturesAt - startTime
                        const takes =
                            departure.nextStop.realtimeArrivesAt -
                            departure.realtimeDeparturesAt
                        const timeAfter =
                            elapsed +
                            takes +
                            heuristic(
                                departure.nextStop,
                                endStop,
                                departure.mode
                            )

                        // prevent to change bus, if departure time is same as arrival time and route is different than current
                        if (
                            departure.realtimeDeparturesAt.valueOf() ===
                                route.arrived.valueOf() &&
                            departure.name.split(' ')[0] !==
                                route.route.split(' ')[0]
                        ) {
                            return
                        }

                        const newRoute = new Route(
                            departure.nextStop,
                            timeAfter,
                            departure.nextStop.realtimeArrivesAt,
                            departure.name,
                            route
                        )

                        queue.push(newRoute)
                    }
                })
            }
        }

        if (queue.length === 0) {
            return undefined
        }

        // console.log(queue.toString())

        route = queue.pop()
    }

    console.log(
        `Route search from ${startStop.code} to ${endStop.code} is ready (${startStop.code} -> ${endStop.code})`
    )

    return route
}

module.exports = { search, distanceBetweenTwoPoints, heuristic }
