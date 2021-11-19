/**
 * Route-luokkaa käytetään syntyvän reitin mallintamiseen.
 */
module.exports = class Route {
    constructor(stop, time, route, next) {
        this.stop = stop
        this.time = time ?? 0
        this.route = route ?? null
        this.next = next ?? null
    }

    /**
     * toJSON käytetään reitin havainnollistamiseen JSON-muodossa.
     * @return {JSON} Reitin tiedot JSON-muodossa
     */
    toJSON() {
        const output = {
            to: this.stop,
            from: null,
            via: [
                {
                    stop: this.stop,
                    route: this.route,
                    time: this.time,
                },
            ],
        }

        let next = this.next // eslint-disable-line
        while (next !== null) {
            console.log('next:', next)
            output.via = output.via.concat([
                {
                    stop: next.stop,
                    route: next.route,
                    time: next.time,
                },
            ])
            output.from = next.stop
            next = next.next
        }

        return output
    }
}
