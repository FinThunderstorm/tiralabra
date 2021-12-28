const PathFinder = require('@pathfinder/PathFinder')

/**
 *
 * @param {JSON} from lähtöpysäkki
 * @param {JSON} to kohdepysäkki
 * @param {Number} startTime käyttäjän spesifioima lähtöaika
 * @param {number} routes kuinka monta reittiä haetaan
 * @returns {Route} suositeltu reitti Route-oliona.
 */
const runPathFinder = async (from, to, startTime, routes = 10) => {
    const result = await PathFinder.search(from, to, startTime, routes)
    return result
}

module.exports = {
    runPathFinder,
}
