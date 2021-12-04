/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const PriorityQueue = require('@datastructures/MinHeap')
const StopRepository = require('@repositories/stopRepository')
const Route = require('@datastructures/Route')

/**
 * distanceBetweenTwoPoints laskee haversine-funktiolla kahden koordinaattipisteen välisen etäisyyden maapallon pintaa pitkin.
 * Lähde: Chamberlain B, 2001, "Q5.1: What is the best way to calculate the distance between 2 points?", luettu 3.12.2021. Saatavilla: https://web.archive.org/web/20041108132234/http://www.census.gov/cgi-bin/geo/gisfaq?Q5.1
 * @param {JSON} coord1 JSON-objekti, jossa on kentässä latitude leveysaste ja longitude pituusaste.
 * @param {JSON} coord2 JSON-objekti, jossa on kentässä latitude leveysaste ja longitude pituusaste.
 * @returns matka kilometreinä
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

    const queue = new PriorityQueue()
    let visited = []

    const startTime = new Date(uStartTime) ?? new Date()
    const from = startStop
    from.arrivesAt = startTime

    const startRoute = new Route(from, 0, startTime)
    queue.push(startRoute)

    let route = queue.pop()
    let i = 0
    while (route.stop.gtfsId !== endStop.gtfsId) {
        if (visited.indexOf(`${route.stop.gtfsId}:${route.route}`) === -1) {
            // lisätään vierailtuihin
            visited = visited.concat([`${route.stop.gtfsId}:${route.route}`])

            i += 1

            console.log(
                `\nnow checking: ${route.stop.gtfsId} / ${route.stop.name} (${
                    route.stop.code
                }) - arrived with ${
                    route.route ?? ''
                } at ${route.arrived.toUTCString()}`
            )

            const departures = await StopRepository.getNextDepartures(
                route.stop.gtfsId,
                route.arrived
            )

            departures.departures.forEach(async (departure) => {
                // tarkastetaan, ettei ole linjan päätepysäkki tai pysäkiltä ei voi hypätä kyytiin
                if (
                    departure.nextStop !== null &&
                    departure.boardable === true
                ) {
                    const elapsed = departure.departuresAt - startTime
                    const takes =
                        departure.nextStop.arrivesAt - departure.departuresAt
                    const timeAfter =
                        elapsed + takes + heuristic(departure.nextStop, endStop)

                    // prevent to change bus, if departure time is same as arrival time and route is different than current
                    if (
                        departure.departuresAt === route.arrived &&
                        departure.name.split(' ')[0] !== route.route
                    ) {
                        return
                    }

                    console.log(
                        'departuretype for',
                        departure.name,
                        'is',
                        departure.boardable
                    )

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

        if (i === 1000) {
            break
        }

        route = queue.pop()
    }
    console.log(
        `Route search from ${startStop.code} to ${endStop.code} is ready`
    )

    return route
}

module.exports = { search, distanceBetweenTwoPoints, heuristic }
