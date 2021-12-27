jest.mock('@backend/graphql')
jest.mock('@backend/redis')
const StopRepository = require('@backend/repositories/stopRepository')

describe('StopRepository', () => {
    test('getStop HSL:1240118', async () => {
        const stop = await StopRepository.getStop('HSL:1240118')
        expect(stop).toStrictEqual({
            code: 'H3028',
            coordinates: { latitude: 60.203978, longitude: 24.965546 },
            gtfsId: 'HSL:1240118',
            locationType: 'STOP',
            name: 'Kumpulan kampus',
        })
    })

    test('nextDepartures HSL:1240118', async () => {
        const departures = await StopRepository.getNextDepartures(
            'HSL:4660297',
            new Date(1640685900000),
            250
        )

        expect(departures).toStrictEqual({
            stop: {
                name: 'Kanerva',
                code: 'V6697',
                gtfsId: 'HSL:4660297',
                coordinates: { latitude: 60.2872, longitude: 25.072 },
                locationType: 'STOP',
            },
            departures: [
                {
                    name: 'Walk to Kanerva V6694 (HSL:4660294)',
                    code: 'Walk',
                    tripGtfsId: 'WALK:HSL:4660297:HSL:4660294',
                    headsign: 'Walk',
                    realtime: true,
                    arrivesAt: new Date(Date.parse('2021-12-28T10:05:01.000Z')),
                    realtimeArrivesAt: new Date(
                        Date.parse('2021-12-28T10:05:01.000Z')
                    ),
                    departuresAt: new Date(
                        Date.parse('2021-12-28T10:05:01.000Z')
                    ),
                    realtimeDeparturesAt: new Date(
                        Date.parse('2021-12-28T10:05:01.000Z')
                    ),
                    mode: 'WALK',
                    nextStop: {
                        name: 'Kanerva',
                        code: 'V6694',
                        gtfsId: 'HSL:4660294',
                        coordinates: {
                            latitude: 60.28773,
                            longitude: 25.073433,
                        },
                        locationType: 'STOP',
                        arrivesAt: new Date(
                            Date.parse('2021-12-28T10:08:25.960Z')
                        ),
                        realtimeArrivesAt: new Date(
                            Date.parse('2021-12-28T10:08:25.960Z')
                        ),
                        departuresAt: new Date(
                            Date.parse('2021-12-28T10:08:25.960Z')
                        ),
                        realtimeDeparturesAt: new Date(
                            Date.parse('2021-12-28T10:08:25.960Z')
                        ),
                        serviceDay: new Date(
                            Date.parse('2021-12-27T20:00:00.000Z')
                        ),
                    },
                    boardable: 'SCHEDULED',
                    unixTimestamps: {
                        scheduledDeparture: 1640685,
                        realtimeDeparture: 1640685,
                        serviceDay: 1640635200,
                    },
                },
                {
                    name: '711 to Hakaniemi (HSL:1111203)',
                    code: 'HSL:4711:1:01',
                    tripGtfsId: 'HSL:4711_20211227_Ti_2_1212',
                    headsign: 'Hakaniemi',
                    realtime: false,
                    arrivesAt: new Date(Date.parse('2021-12-28T10:21:00.000Z')),
                    realtimeArrivesAt: new Date(
                        Date.parse('2021-12-28T10:21:00.000Z')
                    ),
                    departuresAt: new Date(
                        Date.parse('2021-12-28T10:21:00.000Z')
                    ),
                    realtimeDeparturesAt: new Date(
                        Date.parse('2021-12-28T10:21:00.000Z')
                    ),
                    mode: 'BUS',
                    nextStop: {
                        name: 'Hovitie',
                        code: 'V6425',
                        gtfsId: 'HSL:4640225',
                        coordinates: {
                            latitude: 60.28286,
                            longitude: 25.06756,
                        },
                        locationType: 'STOP',
                        arrivesAt: new Date(
                            Date.parse('2021-12-28T10:22:00.000Z')
                        ),
                        realtimeArrivesAt: new Date(
                            Date.parse('2021-12-28T10:22:00.000Z')
                        ),
                        departuresAt: new Date(
                            Date.parse('2021-12-28T10:22:00.000Z')
                        ),
                        realtimeDeparturesAt: new Date(
                            Date.parse('2021-12-28T10:22:00.000Z')
                        ),
                        serviceDay: new Date(
                            Date.parse('2021-12-27T22:00:00.000Z')
                        ),
                    },
                    boardable: 'SCHEDULED',
                    unixTimestamps: {
                        scheduledDeparture: 44460,
                        realtimeDeparture: 44460,
                        serviceDay: 1640642400,
                    },
                },
            ],
        })
    })
})
