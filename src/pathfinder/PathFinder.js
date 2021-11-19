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
    console.log('coord1 >', coord1)
    console.log('coord2 >', coord2)
    return haversine(coord1, coord2)
}

/**
 * Käytetään heuristisen aika-arvion laskemiseen lähtöpysäköiltä kohdepysäkille.
 * @summary Laskee tällä hetkellä heuristisen aika-arvion maapallon pintaa viivasuoraa etäisyyttä pysäkkien välillä hyödyntäen. Tällä hetkellä käyttää vain bussin keskimääräistä nopeutta HSL-liikenteessä.
 * @param {Stop} startStop lähtöpysäkki
 * @param {Stop} endStop kohdepysäkki
 * @returns aika-arvio minuutteina
 */
const heurestic = (startStop, endStop) => {
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
class PathFinder {
    constructor() {
        this.queue = new PriorityQueue()
        this.visited = []
    }

    /**
     * search-funktiolla haetaan lyhin reitti ajallisesti kahden pysäkin välillä.
     * @param {*} startStop lähtöpysäkki
     * @param {*} endStop kohdepysäkki
     * @returns {Route} suositeltu reitti Route-oliona.
     */
    async search(startStop, endStop) {
        this.queue.push(new Route())
        const time = heurestic(startStop, endStop)
        while (this.queue.length > 0) {
            const stop = this.queue.pop()
            if (this.visited.indexOf(stop.gtfsId) === -1) {
                this.visited = this.visited.concat([stop.gtfsId])
                const departures = StopRepository.getNextDepartures(stop.gtfsId)
                console.log(departures)
                departures.departures.array.forEach((departure) => {
                    console.log(departure, time)
                })
            }
        }
    }
}

module.exports = PathFinder
