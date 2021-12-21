const redis = require('redis')
const { defaultHost, cachetime } = require('@config/config')

const client = redis.createClient({ url: `redis://${defaultHost}:6379` })
client.on('error', (error) => console.error(error))
;(async () => {
    await client.connect()
})()

const test = async () => {
    const status = await client.ping()
    await console.log(`Is redis cache online? ${status}`)
}

const check = async (key) => {
    const expired = await client.ttl(key)
    return expired > 0
}

const set = async (key, value) => {
    console.log('setting key', key)
    await client.set(key, JSON.stringify(value))
    await client.expire(key, cachetime)
}

const get = async (key) => {
    const value = await client.get(key)
    return JSON.parse(value)
}

const getValid = async (key, value) => {
    if (!check(key)) {
        console.log('problem>', value)
        await set(key, value)
    }
    const retValue = await get(key)
    return retValue
}

const getAllKeys = async () => {
    const keys = await client.keys('*')
    return keys
}

const getAllValues = async (keys) => {
    const values = keys.map((key) => get(key))
    return Promise.all(values)
}

const flushall = async () => {
    const result = await client.sendCommand(['FLUSHALL'])
    console.log('Flushed all', result)
    return result
}

module.exports = {
    test,
    check,
    set,
    get,
    getValid,
    getAllKeys,
    getAllValues,
    flushall,
}
