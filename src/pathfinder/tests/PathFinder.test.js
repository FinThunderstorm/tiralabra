const PathFinder = require('@pathfinder/PathFinder')
const case1 = require('@pathfinder/tests/results/HSL1402157-HSL1320295.json')
const case2 = require('@pathfinder/tests/results/HSL4620205-HSL1240118.json')
const case3 = require('@pathfinder/tests/results/HSL9650105-HSL4510255.json')

jest.mock('@repositories/stopRepository')
jest.setTimeout(10 * 60 * 1000)

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

    test('search works between HSL:1402157 and HSL:1320295', async () => {
        const startStop = {
            name: 'Porvarintie',
            code: 'H3340',
            gtfsId: 'HSL:1402157',
            coordinates: {
                latitude: 60.27136,
                longitude: 25.03385,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Vanha Hämeenkyläntie',
            code: 'H1581',
            gtfsId: 'HSL:1320295',
            coordinates: {
                latitude: 60.24945,
                longitude: 24.83561,
            },
            locationType: 'STOP',
        }
        const startTime = 1638784800000
        const resultCase1 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase1.toJSONForTests()).toStrictEqual(case1)
    })

    test('search works between HSL:4620205 and HSL:1240118', async () => {
        const startStop = {
            name: 'Urheilutie',
            code: 'V6205',
            gtfsId: 'HSL:4620205',
            coordinates: {
                latitude: 60.29549,
                longitude: 25.0614,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Kumpulan kampus',
            code: 'H3028',
            gtfsId: 'HSL:1240118',
            coordinates: {
                latitude: 60.203978,
                longitude: 24.965546,
            },
            locationType: 'STOP',
        }
        const startTime = 1638784800000
        const resultCase2 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase2.toJSONForTests()).toStrictEqual(case2)
    })

    test('search works between HSL:9650105 and HSL:4510255', async () => {
        const startStop = {
            name: 'Kievari',
            code: 'Tu6041',
            gtfsId: 'HSL:9650105',
            coordinates: {
                latitude: 60.398721,
                longitude: 25.02284,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Osuustie',
            code: 'V5155',
            gtfsId: 'HSL:4510255',
            coordinates: {
                latitude: 60.28992,
                longitude: 24.954023,
            },
            locationType: 'STOP',
        }
        const startTime = 1638784800000
        const resultCase3 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase3.toJSONForTests()).toStrictEqual(case3)
    })
})
