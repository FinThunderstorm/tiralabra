const { GraphQLClient, gql } = require('graphql-request')

/**
 * api kääri API-väylän kyselyihin käytettävän GraphQLClient-olion
 */
const api = new GraphQLClient(
    // 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
    'http://tiralabra-otp-hsl:8080/otp/routers/hsl/index/graphql'
)

/**
 * apiHealth käytetään tarkastamaan vastaako API-väylän GraphQL-palvelin kyselyihin
 * @returns {JSON} palauttaa JSON-muotoisen vastauksen, jolla voidaan tarkastaa vastaako API-väylä
 */
const apiHealth = async () => {
    const QUERY = gql`
        query {
            agency(id: "HSL:HSL") {
                name
            }
        }
    `
    const result = await api.request(QUERY)
    console.log('Is GraphQL-server up?', result)
    if (result.agency?.name === undefined) {
        throw new Error('API not ready')
    }
    return 'PONG'
}

module.exports = { api, apiHealth }
