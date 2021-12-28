/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const PriorityQueue = require('@datastructures/MinHeap')
const StopRepository = require('@repositories/stopRepository')
const Route = require('@datastructures/Route')
const { speeds, distanceBetweenTwoPoints } = require('@helpers')

/**
 * PathFinderin funktioita käytetään reitin hakemiseen kahden pisteen välillä.
 */

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
 * @param {boolean} routesAmount kuinka monta reittiä haetaan
 * @returns {Route} suositeltu reitti Route-oliona.
 */
const search = async (startStop, endStop, uStartTime, routesAmount = 1) => {
    const queue = new PriorityQueue()
    let visited = new Set()
    let routes = []

    const startTime = new Date(uStartTime)
    const from = startStop
    from.arrivesAt = startTime

    const startRoute = new Route(from, 0, startTime, 'start')
    queue.push(startRoute)

    let route = queue.pop()
    let foundRoutes = 0
    // route.stop.gtfsId !== endStop.gtfsId &&
    while (foundRoutes < routesAmount) {
        if (!visited.has(`${route.stop.gtfsId}:${route.route}`)) {
            visited = visited.add(`${route.stop.gtfsId}:${route.route}`)

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

        if (route.stop.gtfsId === endStop.gtfsId) {
            foundRoutes += 1
            routes = [...routes, route]
        }

        route = queue.pop()
    }

    console.log(
        `Route search from ${startStop.code} to ${endStop.code} is ready (${startStop.code} -> ${endStop.code})`
    )

    return routes[0]
}

module.exports = { search, distanceBetweenTwoPoints, heuristic }
