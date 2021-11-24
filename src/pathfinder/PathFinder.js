/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const haversine = require('haversine')
const PriorityQueue = require('@datastructures/PriorityQueue')
const StopRepository = require('@repositories/stopRepository')
const Route = require('@datastructures/Route')
const Logger = require('./Logger')

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
    const log = new Logger()
    const queue = new PriorityQueue()
    let visited = []
    const startTime = uStartTime ?? new Date()
    // console.log('Lähtöaika:', startTime.toUTCString())
    const startRoute = new Route(startStop, 0, startTime)
    queue.push(startRoute)
    log.add({ msg: 'added startRoute', data: startRoute })

    let route = queue.pop()
    while (route.stop.gtfsId !== endStop.gtfsId) {
        // otetaan seuraava pysäkki
        log.add({ msg: 'popped route from queue', data: route })
        let ready = false
        // console.log('Jonossa ennen käsittelyä:', queue.length)

        if (visited.indexOf(`${route.stop.gtfsId}:${route.route}`) === -1) {
            // lisätään vierailtuihin
            visited = visited.concat([`${route.stop.gtfsId}:${route.route}`])
            // pyydetään listaus seuraavista lähdöistä.
            console.log(
                `\nnow checking: ${route.stop.gtfsId} / ${route.stop.name} (${
                    route.stop.code
                }) - arrived with ${
                    route.route ?? ''
                } at ${route.arrived.toUTCString()}`
            )
            log.add({
                msg: 'added to not visited',
                data: `${route.stop.gtfsId}:${route.route}`,
            })
            const departures = await StopRepository.getNextDepartures(
                route.stop.gtfsId,
                route.arrived
            )
            log.add({ msg: `asked next departures for stop`, data: departures })
            await departures.departures.forEach(async (departure) => {
                // tarkastetaan, ettei kyseessä ole päättäri -> TODO ratkaista miten jatketaan
                // console.log(
                //     ` - route ${
                //         departure.name.split(' ')[0]
                //     }  departures at ${departure.departuresAt.toUTCString()}`
                // )
                if (departure.nextStop !== null) {
                    const elapsed = departure.departuresAt - startTime
                    const takes =
                        departure.nextStop.arrivesAt - departure.departuresAt
                    const timeAfter =
                        elapsed + takes + heuristic(departure.nextStop, endStop)
                    // console.log(
                    //     'kulunut aikaa lähdöstä:',
                    //     Math.round(elapsed / (1000 * 60)),
                    //     '- seuraavalle pysäkille:',
                    //     Math.round(takes / (1000 * 60)),
                    //     '- Arvioitu aika loppuun',
                    //     Math.round(
                    //         heuristic(departure.nextStop, endStop) / (1000 * 60)
                    //     )
                    // )

                    const newRoute = new Route(
                        departure.nextStop,
                        timeAfter,
                        departure.arrivesAt,
                        departure.name.split(' ')[0],
                        route
                    )
                    log.add({ msg: 'added new Route to queue', data: newRoute })
                    await queue.push(newRoute)
                }
            })
        }
        if (queue.length > 0) {
            log.add({ msg: 'Still left in queue', data: queue.length })
            ready = true
        }
        // console.log('Jonossa jälkeen:', queue.length)
        if (ready) {
            route = queue.pop()
        }
    }
    console.log(
        `Route search from ${startStop.code} to ${endStop.code} is ready`
    )
    log.add({
        msg: `Route search from ${startStop.code} to ${endStop.code} is ready`,
        data: route,
    })
    return [route, log]
}

module.exports = { search }
