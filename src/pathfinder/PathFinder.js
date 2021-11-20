/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const haversine = require('haversine')
const PriorityQueue = require('@datastructures/PriorityQueue')
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
 * @returns aika-arvio minuutteina
 */
const heuristic = (startStop, endStop) => {
    const distance = distanceBetweenTwoPoints(
        startStop.coordinates,
        endStop.coordinates
    )
    const speed = 20 // bussi 20km/h
    const time = distance / speed
    return time
}

/**
 * PathFinder-luokkaa käytetään reitin hakemiseen kahden pisteen välillä.
 */

/**
 * search-funktiolla haetaan lyhin reitti ajallisesti kahden pysäkin välillä.
 * @param {*} startStop lähtöpysäkki
 * @param {*} endStop kohdepysäkki
 * @returns {Route} suositeltu reitti Route-oliona.
 */
const search = async (startStop, endStop) => {
    console.log('is Pathfinder activated?')
    const queue = new PriorityQueue()
    let visited = []
    queue.push(new Route(startStop, null, 0))

    let route = queue.pop()
    while (route.stop.gtfsId !== endStop.gtfsId) {
        // otetaan seuraava pysäkki
        let ready = false
        // console.log('Jonossa ennen käsittelyä:', queue.length)

        if (visited.indexOf(route.stop.gtfsId) === -1) {
            // lisätään vierailtuihin
            visited = visited.concat([route.stop.gtfsId])
            // pyydetään listaus seuraavista lähdöistä.
            console.log(
                `now checking: ${route.stop.gtfsId} / ${route.stop.name} (${route.stop.code})`
            )
            const departures = await StopRepository.getNextDepartures(
                route.stop.gtfsId
            )
            await departures.departures.forEach(async (departure) => {
                // tarkastetaan, ettei kyseessä ole päättäri -> TODO ratkaista miten jatketaan
                if (departure.nextStop !== null) {
                    const timeAfter =
                        route.time + heuristic(departure.nextStop, endStop)
                    const newRoute = new Route(
                        departure.nextStop,
                        timeAfter,
                        departure.name,
                        route
                    )
                    await queue.push(newRoute)
                }
            })
        }
        if (queue.length > 0) {
            ready = true
        }
        // console.log('Jonossa jälkeen:', queue.length)
        if (ready) {
            route = queue.pop()
        }
    }
    return route
}

module.exports = { search }
