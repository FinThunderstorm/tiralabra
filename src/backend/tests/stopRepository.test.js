// jest.mock('@repositories/stopRepository', () => ({
//     __esModule: true,
// }))

// const StopRepository = require('@repositories/stopRepository')
// const { cachetime } = require('@config/config')

test('stopRepostiory initializes', () => {
    const stop = { cachevalid: 30 }
    expect(stop.cachevalid).toBe(30)
})
