const { GraphQLClient } = require('graphql-request')

const gQLClient = new GraphQLClient(
    // 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
    'http://tiralabra-otp-hsl:8080/otp/routers/hsl/index/graphql'
)

module.exports = gQLClient
