const helpers = require('@helpers')

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
})
