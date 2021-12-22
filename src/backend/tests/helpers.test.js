const helpers = require('@helpers')

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

describe('helpers', () => {
    test('speeds returns right values', () => {
        expect(helpers.speeds.TRAM).toBe(14)
        expect(helpers.speeds.BUS).toBe(20)
        expect(helpers.speeds.mainlineBus).toBe(26)
        expect(helpers.speeds.WALK).toBe(5)
        expect(helpers.speeds.SUBWAY).toBe(44)
        expect(helpers.speeds.RAIL).toBe(54)
        expect(helpers.speeds.FERRY).toBe(17)
    })
    test('convertEpochToDate converts correctly', () => {
        const epoch = 1609502400
        const date = new Date('2021-01-01T12:00:00.000Z')
        const result = helpers.convertEpochToDate(epoch)
        expect(result.toString()).toBe(date.toString())
    })
    test('convertDateToEpoch converts correctly', () => {
        const epoch = 1609502400
        const date = new Date('2021-01-01T12:00:00.000Z')
        const result = helpers.convertDateToEpoch(date)
        expect(result).toBe(epoch)
    })

    test('distanceBetweenTwoPoints Urheilutie and Kumpula works', () => {
        const result = helpers.distanceBetweenTwoPoints(
            urheilutieStop.coordinates,
            kumpulaStop.coordinates
        )
        expect(result).toBe(11.48011872320561)
    })

    test('distanceBetweenTwoPoints Kumpula and Kyläsaari works', () => {
        const result2 = helpers.distanceBetweenTwoPoints(
            kumpulaStop.coordinates,
            kylasaariStop.coordinates
        )
        expect(result2).toBe(0.11922863963346399)
    })
})
