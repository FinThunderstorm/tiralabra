const { GraphQLClient, gql } = require('graphql-request')

const api = new GraphQLClient(
    // 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
    'http://tiralabra-otp-hsl:8080/otp/routers/hsl/index/graphql'
)

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
    return result
}

module.exports = { api, apiHealth }
