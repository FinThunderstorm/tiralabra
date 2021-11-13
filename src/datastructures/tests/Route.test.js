const Route = require('@datastructures/Route')

const kumpulaStop = {
    name: 'Kumpulan kampus',
    code: 'H3029',
    coordinates: {
        latitude: 60.203679,
        longitude: 24.965952,
    },
    locationType: 'STOP',
}

const kylasaariStop = {
    name: 'Kyläsaarenkatu',
    code: 'H3020',
    coordinates: {
        latitude: 60.202895,
        longitude: 24.964478,
    },
    locationType: 'STOP',
}

describe('Route-object', () => {
    test('Route initializes', () => {
        const route = new Route(kumpulaStop)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.time).toBe(0)
        expect(route.next).toBe(null)
    })
    test('Route takes given time', () => {
        const time = 10
        const route = new Route(kumpulaStop, time)
        expect(route.stop).toBe(kumpulaStop)
        expect(route.time).toBe(time)
        expect(route.next).toBe(null)
    })
    test('Route can have next stop', () => {
        const timeBefore = 15
        const timeAfter = 4
        const routeBefore = new Route(kumpulaStop, timeBefore)
        const route = new Route(kylasaariStop, timeAfter, routeBefore)
        expect(route.stop).toBe(kylasaariStop)
        expect(route.time).toBe(timeAfter)
        expect(route.next).toBe(routeBefore)
    })
})
