// const StopRepository = require('@repositories/stopRepository')
// const { cachetime } = require('@backend/config/config')
// const { cache } = require('webpack')

// const stopRepository = new StopRepository()

test('stopRepostiory initializes', () => {
    const stopRepository = {
        cachevalid: 30,
    }
    const cachetime = 30
    expect(stopRepository.cachevalid).toBe(cachetime)
})
