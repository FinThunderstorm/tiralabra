const PathFinder = require('@pathfinder/PathFinder')
const { heuristic, distanceBetweenTwoPoints } = require('../PathFinder')

const kumpulaStop = {
    name: 'Kumpulan kampus',
    code: 'H3029',
    gtfsId: 'HSL:1240103',
    coordinates: {
        latitude: 60.203679,
        longitude: 24.965952,
    },
    locationType: 'STOP',
}

const urheilutieStop = {
    name: 'Urheilutie',
    code: 'V6205',
    gtfsId: 'HSL:4620205',
    coordinates: {
        latitude: 60.29549,
        longitude: 25.0614,
    },
    locationType: 'STOP',
}

const kylasaariStop = {
    name: 'Kyläsaarenkatu',
    code: 'H3020',
    gtfsId: 'HSL:1240102',
    coordinates: {
        latitude: 60.202895,
        longitude: 24.964478,
    },
    locationType: 'STOP',
}

describe('PathFinder', () => {
    test('distanceBetweenTwoPoints Urheilutie and Kumpula works', () => {
        const result = PathFinder.distanceBetweenTwoPoints(
            urheilutieStop.coordinates,
            kumpulaStop.coordinates
        )
        expect(result).toBe(11.48011872320561)
    })

    test('distanceBetweenTwoPoints Kumpula and Kyläsaari works', () => {
        const result2 = PathFinder.distanceBetweenTwoPoints(
            kumpulaStop.coordinates,
            kylasaariStop.coordinates
        )
        expect(result2).toBe(0.11922863963346399)
    })

    test('heuristic calculates correct values between Urheilutie and Kumpula', () => {
        const result3 = PathFinder.heuristic(urheilutieStop, kumpulaStop)
        expect(result3).toBe(2066421.37017701)
    })

    test('heuristic calculates correct values between Kumpula and Kyläsaari', () => {
        const result4 = PathFinder.heuristic(kumpulaStop, kylasaariStop)
        expect(result4).toBe(21461.155134023513)
    })
})
