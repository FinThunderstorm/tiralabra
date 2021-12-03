const helpers = require('@helpers')

describe('helpers', () => {
    test('speeds returns right values', () => {
        expect(helpers.speeds.tram).toBe(14)
        expect(helpers.speeds.bus).toBe(20)
        expect(helpers.speeds.mainlineBus).toBe(26)
        expect(helpers.speeds.metro).toBe(44)
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
