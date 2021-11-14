const redis = require('async-redis')
const { defaultHost, cachetime } = require('@backend/config/config')

const client = redis.createClient({ host: defaultHost })
client.on('error', (error) => console.error(error))

const test = async () => {
    const status = await client.ping()
    await console.log(`Is redis cache online? ${status}`)
}

const check = async (key) => {
    const expired = await client.ttl(key)
    return expired < 0
}

const set = async (key, value) => {
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

module.exports = {
    test,
    check,
    set,
    get,
    getValid,
}
