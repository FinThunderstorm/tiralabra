const redis = require('async-redis')

const client = redis.createClient({host: "tiralabra-cache"})
client.on('error', (error) => console.error(error))

const test = async () => {
    const status = await client.ping()
    await console.log(`Is redis cache online? ${status}`)
}

test()

module.exports = client
