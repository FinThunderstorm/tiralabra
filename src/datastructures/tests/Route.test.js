const Route = require('@datastructures/Route')

jest.useFakeTimers('modern').setSystemTime(new Date().getTime())

const kumpulaStop = {
    name: 'Kumpulan kampus',
    code: 'H3029',
    coordinates: {
        latitude: 60.203679,
        longitude: 24.965952,
    },
    locationType: 'STOP',
}

const routeName = '55'

const kylasaariStop = {
    name: 'Kyläsaarenkatu',
    code: 'H3020',
    coordinates: {
        latitude: 60.202895,
        longitude: 24.964478,
    },
    locationType: 'STOP',
}

const timeNow = new Date()
const date = new Date(2021, 1, 1, 12, 0, 0)
const travelTime = 10

describe('Route-object', () => {
    test('Route initializes', () => {
        const route = new Route(kumpulaStop)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.travelTime).toBe(0)
        expect(route.arrived.toISOString()).toBe(timeNow.toISOString())
        expect(route.route).toBe(null)
        expect(route.next).toBe(null)
    })
    test('Route takes given time', () => {
        const route = new Route(kumpulaStop, travelTime)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.travelTime).toBe(travelTime)
        expect(route.arrived.toISOString()).toBe(timeNow.toISOString())
        expect(route.route).toBe(null)
        expect(route.next).toBe(null)
    })
    test('Route can take arrived as Date', () => {
        const route = new Route(kumpulaStop, travelTime, date)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.travelTime).toBe(travelTime)
        expect(route.arrived).toBe(date)
        expect(route.route).toBe(null)
        expect(route.next).toBe(null)
    })
    test('Route can have route info as route', () => {
        const route = new Route(kumpulaStop, travelTime, null, routeName)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.travelTime).toBe(travelTime)
        expect(route.arrived.toISOString()).toBe(timeNow.toISOString())
        expect(route.route).toBe(routeName)
        expect(route.next).toBe(null)
    })
    test('Route can have next stop', () => {
        const timeBefore = 15
        const timeAfter = 4
        const routeBefore = new Route(kumpulaStop, timeBefore)
        const route = new Route(
            kylasaariStop,
            timeAfter,
            date,
            routeName,
            routeBefore
        )
        expect(route.stop).toBe(kylasaariStop)
        expect(route.travelTime).toBe(timeAfter)
        expect(route.arrived).toBe(date)
        expect(route.route).toBe(routeName)
        expect(route.next).toBe(routeBefore)
    })
    test('Route toJSON works', () => {
        const timeBefore = 15
        const timeAfter = 4
        const routeBefore = new Route(kumpulaStop, timeBefore)
        const route = new Route(
            kylasaariStop,
            timeAfter,
            date,
            routeName,
            routeBefore
        )
        const correctVia = [
            {
                stop: {
                    name: 'Kyläsaarenkatu',
                    code: 'H3020',
                    coordinates: {
                        latitude: 60.202895,
                        longitude: 24.964478,
                    },
                    locationType: 'STOP',
                },
                route: '55',
                travelTime: 4,
            },
            {
                stop: {
                    name: 'Kumpulan kampus',
                    code: 'H3029',
                    coordinates: {
                        latitude: 60.203679,
                        longitude: 24.965952,
                    },
                    locationType: 'STOP',
                },
                route: null,
                travelTime: 15,
            },
        ]
        const routeJSON = route.toJSON()
        expect(routeJSON.arrived).toBe(date)
        expect(routeJSON.from).toBe(kumpulaStop)
        expect(routeJSON.to).toBe(kylasaariStop)
        expect(routeJSON.travelTime).toBe(4)
        expect(JSON.stringify(routeJSON.via)).toBe(JSON.stringify(correctVia))
    })

    test('valueOf() should return travelTime', () => {
        const route = new Route(kumpulaStop, travelTime, null, routeName)
        expect(route.valueOf()).toBe(travelTime)
    })

    test('toString() should return routeName', () => {
        const route = new Route(kumpulaStop, travelTime, null, routeName)
        expect(route.toString()).toBe(routeName)
    })
})
