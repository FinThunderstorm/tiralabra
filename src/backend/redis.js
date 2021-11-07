const redis = require('async-redis')

const client = redis.createClient({host: "172.19.0.2"})
client.on('error', (error) => console.error(error))

module.exports = client
