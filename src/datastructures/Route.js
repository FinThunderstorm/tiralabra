/**
 * Route-luokkaa käytetään syntyvän reitin mallintamiseen.
 */
class Route {
    /**
     * Konstruktorille annetaan seuraavat parametrit
     * @param {JSON} stop pysäkki, jossa ollaan viimeisimmäksi käyty
     * @param {int} travelTime vapaaehtoinen, kuinka kauan ollaan matkustettu
     * @param {Date} arrived vapaaehtoinen, milloin reitillä ollaan saavuttu tälle pysäkille∂
     * @param {string} route vapaaehtoinen, reitin tiedot, jolla ollaan saavuttu
     * @param {Route} next vapaaehtoinen, edellinen pysäkki
     */
    constructor(stop, travelTime, arrived, route, next) {
        this.stop = stop
        this.travelTime = travelTime ?? 0
        this.arrived = arrived ?? new Date()
        this.route = route ?? null
        this.next = next ?? null
    }

    valueOf() {
        return this.travelTime
    }

    /**
     * toJSON käytetään reitin havainnollistamiseen JSON-muodossa.
     * @return {JSON} Reitin tiedot JSON-muodossa
     */
    toJSON() {
        const output = {
            to: this.stop,
            from: null,
            arrived: this.arrived,
            startTime: this.arrived,
            travelTime: this.travelTime,
            via: [
                {
                    stop: this.stop,
                    route: this.route,
                    travelTime: this.travelTime,
                },
            ],
        }

        let next = this.next // eslint-disable-line
        while (next !== null) {
            // console.log('next:', next)
            output.via = output.via.concat([
                {
                    stop: next.stop,
                    route: next.route,
                    travelTime: next.travelTime,
                },
            ])
            output.from = next.stop
            output.startTime = next.arrived
            next = next.next
        }

        return output
    }

    toString() {
        return this.route
    }
}

module.exports = Route
