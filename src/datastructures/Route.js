/**
 * Route-luokkaa käytetään syntyvän reitin mallintamiseen.
 */
module.exports = class Route {
    constructor(stop, time, next) {
        this.stop = stop
        this.time = time ?? 0
        this.next = next ?? null
    }
}
