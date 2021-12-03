/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const haversine = require('haversine')
const PriorityQueue = require('@datastructures/MinHeap')
const StopRepository = require('@repositories/stopRepository')
const Route = require('@datastructures/Route')

/**
 * distanceBetweenTwoPoints laskee haversine-funktiolla kahden koordinaattipisteen välisen etäisyyden maapallon pintaa pitkin.
 * TODO: toteuta kaavan laskutoimitukset itse korvaamalla valmis kirjasto.
 * @param {JSON} coord1 JSON-objekti, jossa on kentässä latitude leveysaste ja longitude pituusaste.
 * @param {JSON} coord2 JSON-objekti, jossa on kentässä latitude leveysaste ja longitude pituusaste.
 * @returns matka kilometreinä
 */
const distanceBetweenTwoPoints = (coord1, coord2) => {
    // console.log('coord1 >', coord1)
    // console.log('coord2 >', coord2)
    const distance = haversine(coord1, coord2)
    return distance
}

/**
 * Käytetään heuristisen aika-arvion laskemiseen lähtöpysäköiltä kohdepysäkille.
 * @summary Laskee tällä hetkellä heuristisen aika-arvion maapallon pintaa viivasuoraa etäisyyttä pysäkkien välillä hyödyntäen. Tällä hetkellä käyttää vain bussin keskimääräistä nopeutta HSL-liikenteessä.
 * @param {Stop} startStop lähtöpysäkki
 * @param {Stop} endStop kohdepysäkki
 * @returns aika-arvio millisekunteissa (yhteensopivuus Date-olion kanssa)
 */
const heuristic = (startStop, endStop) => {
    const distance = distanceBetweenTwoPoints(
        startStop.coordinates,
        endStop.coordinates
    )
    const speed = 20 // bussi 20km/h
    const time = distance / speed
    return time * 60 * 60 * 1000
}

/**
 * PathFinder-luokkaa käytetään reitin hakemiseen kahden pisteen välillä.
 */

/**
 * search-funktiolla haetaan lyhin reitti ajallisesti kahden pysäkin välillä.
 * @param {*} startStop lähtöpysäkki
 * @param {*} endStop kohdepysäkki
 * @param {*} uStartTime vapaaehtoinen, käyttäjän spesifioima lähtöaika
 * @returns {Route} suositeltu reitti Route-oliona.
 */
const search = async (startStop, endStop, uStartTime) => {
    console.log('is Pathfinder activated?')

    const queue = new PriorityQueue((a, b) => a.travelTime - b.travelTime)

    const from = startStop

    let visited = []
    console.log('uStartTime', uStartTime)
    const startTime = new Date(uStartTime) ?? new Date()
    console.log('startTime', startTime)
    from.arrivesAt = startTime
    const startRoute = new Route(from, 0, startTime)
    queue.push(startRoute)

    let route = queue.pop()

    while (route.stop.gtfsId !== endStop.gtfsId) {
        if (visited.indexOf(`${route.stop.gtfsId}:${route.route}`) === -1) {
            // lisätään vierailtuihin
            visited = visited.concat([`${route.stop.gtfsId}:${route.route}`])

            console.log(
                `\nnow checking: ${route.stop.gtfsId} / ${route.stop.name} (${
                    route.stop.code
                }) - arrived with ${
                    route.route ?? ''
                } at ${route.arrived.toUTCString()}`
            )
            console.log('queue:', queue.arr.slice(0, 10).toString())

            const departures = await StopRepository.getNextDepartures(
                route.stop.gtfsId,
                route.arrived
            )

            // .filter((a) => Date.parse(a.departuresAt) >= Date.parse(route.arrived))
            departures.departures.forEach(async (departure) => {
                // tarkastetaan, ettei ole linjan päätepysäkki
                if (departure.nextStop !== null) {
                    const elapsed = departure.departuresAt - startTime
                    const takes =
                        departure.nextStop.arrivesAt - departure.departuresAt
                    const timeAfter =
                        elapsed + takes + heuristic(departure.nextStop, endStop)

                    const newRoute = new Route(
                        departure.nextStop,
                        timeAfter,
                        departure.nextStop.arrivesAt,
                        departure.name.split(' ')[0],
                        route
                    )

                    queue.push(newRoute)
                }
            })
        }
        if (queue.length === 0) {
            break
        }
        console.log('queue:', queue.arr.slice(0, 10).toString())
        route = queue.pop()
    }
    console.log(
        `Route search from ${startStop.code} to ${endStop.code} is ready`
    )

    return route
}

module.exports = { search }
