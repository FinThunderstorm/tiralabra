const StopRepository = require('@repositories/stopRepository')
const { cachetime } = require('@backend/config/config')
const { cache } = require('webpack')

const stopRepository = new StopRepository()

test('stopRepostiory initializes', () => {
    expect(stopRepository.cachevalid).toBe(cachetime)
})