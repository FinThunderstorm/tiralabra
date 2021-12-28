const redis = require('redis')
const { defaultHost, cachetime } = require('@config/config')

const client = redis.createClient({ url: `redis://${defaultHost}:6379` })
client.on('error', (error) => console.error(error))
;(async () => {
    await client.connect()
})()

/**
 * test tarkastaa vastaako välimuisti kyselyihin
 * @returns {string} palauttaa PONG mikäli välimuisti vastaa kyselyihin
 */
const test = async () => {
    const status = await client.ping()
    await console.log(`Is redis cache online? ${status}`)
    return status
}

/**
 * check käytetään tarkastamaan, onko annetulla avaimella välimuistiin tallennettu tieto vanhentunutta
 * @param {string} key avain, jolla välimuistiin on tallennettu tietoa
 * @returns {boolean} palauttaa true, jos välimuistissa oleva tieto ei ole vanhentunutta.
 */
const check = async (key) => {
    const expired = await client.ttl(key)
    return expired > 0
}

/**
 * set käytetään tiedon tallentamiseen välimuistiin
 * @param {string} key avain, jolle tieto tallennetaan välimuistiin
 * @param {JSON} value JSON-muotoinen arvo, joka tallennetaan välimuistin annetun avaimen taakse
 * @param {?number} valid aika sekunteissa, jonka välimuistiin tallennettu tieto on voimassa
 */
const set = async (key, value, valid = cachetime) => {
    await client.json.set(key, '.', value)
    await client.expire(key, valid)
}

/**
 * get käytetään tiedon noutamiseen välimuistista annetulla avaimella
 * @param {string} key avan, jolle tieto on tallennettu välimuistiin
 * @returns {JSON} palauttaa JSON-muotoisen arvon, joka oli tallennettuna avaimen taakse.
 */
const get = async (key) => {
    const value = await client.json.get(key)
    return value
}

/**
 * getAllKeys palauttaa listana kaikkien välimuistiin tallennetut avaimet
 * @returns {string[]} lista kaikista avaimista välimuistissa
 */
const getAllKeys = async () => {
    const keys = await client.keys('*')
    return keys
}

/**
 * getAllValues käytetään listan avaimia muuttamiseen niden arvoiksi.
 * @param {string[]} keys lista avaimista, joille haetaan arvot
 * @returns JSON[] lista arvoista. Arvon indeksi vastaa parametrinä annetun avaimen indeksiä.
 */
const getAllValues = async (keys) => {
    const values = keys.map((key) => get(key))
    return Promise.all(values)
}

/**
 * flushall tyhjentää välimuistista kaikki avain-arvo -parit.
 * @returns {string} palauttaa OK, jos välimuistin tyhjennys onnistui
 */
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
    getAllKeys,
    getAllValues,
    flushall,
}
