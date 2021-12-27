jest.mock('@backend/repositories/stopRepository')

const PathFinder = require('@pathfinder/PathFinder')

const case1 = require('@pathfinder/tests/results/HSL4620205-HSL1240118.json')
const case2 = require('@pathfinder/tests/results/HSL9650105-HSL4510255.json')
const case3 = require('@pathfinder/tests/results/HSL1361108-HSL1150110.json')
const case4 = require('@pathfinder/tests/results/HSL1431187-HSL1304161.json')
const case5 = require('@pathfinder/tests/results/HSL1020454-HSL1203409.json')
const case6 = require('@pathfinder/tests/results/HSL1240419-HSL1040445.json')
const case7 = require('@pathfinder/tests/results/HSL1431602-HSL1240103.json')
const case8 = require('@pathfinder/tests/results/HSL4610553-HSL1171180.json')
const case9 = require('@pathfinder/tests/results/HSL1201601-HSL1070418.json')
const case10 = require('@pathfinder/tests/results/HSL2314601-HSL1310119.json')

// jest.setTimeout(10 * 60 * 1000)

const kumpulaStop = {
    name: 'Kumpulan kampus',
    code: 'H3029',
    gtfsId: 'HSL:1240103',
    coordinates: {
        latitude: 60.203679,
        longitude: 24.965952,
    },
    locationType: 'STOP',
}

const urheilutieStop = {
    name: 'Urheilutie',
    code: 'V6205',
    gtfsId: 'HSL:4620205',
    coordinates: {
        latitude: 60.29549,
        longitude: 25.0614,
    },
    locationType: 'STOP',
}

const kylasaariStop = {
    name: 'Kyläsaarenkatu',
    code: 'H3020',
    gtfsId: 'HSL:1240102',
    coordinates: {
        latitude: 60.202895,
        longitude: 24.964478,
    },
    locationType: 'STOP',
}

describe('PathFinder', () => {
    test('heuristic calculates correct values between Urheilutie and Kumpula', () => {
        const result3 = PathFinder.heuristic(urheilutieStop, kumpulaStop)
        expect(result3).toBe(2066421.37017701)
    })

    test('heuristic calculates correct values between Kumpula and Kyläsaari', () => {
        const result4 = PathFinder.heuristic(kumpulaStop, kylasaariStop)
        expect(result4).toBe(21461.155134023513)
    })

    test('search works between HSL:4620205 and HSL:1240118', async () => {
        const startStop = {
            name: 'Urheilutie',
            code: 'V6205',
            gtfsId: 'HSL:4620205',
            coordinates: {
                latitude: 60.29549,
                longitude: 25.0614,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Kumpulan kampus',
            code: 'H3028',
            gtfsId: 'HSL:1240118',
            coordinates: {
                latitude: 60.203978,
                longitude: 24.965546,
            },
            locationType: 'STOP',
        }
        const startTime = 1639563300000
        const resultCase1 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase1.toJSONForTests()).toStrictEqual(case1)
    })

    test('search works between HSL:9650105 and HSL:4510255', async () => {
        const startStop = {
            name: 'Kievari',
            code: 'Tu6041',
            gtfsId: 'HSL:9650105',
            coordinates: {
                latitude: 60.398721,
                longitude: 25.02284,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Osuustie',
            code: 'V5155',
            gtfsId: 'HSL:4510255',
            coordinates: {
                latitude: 60.28992,
                longitude: 24.954023,
            },
            locationType: 'STOP',
        }
        const startTime = 1639566300000
        const resultCase2 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase2.toJSONForTests()).toStrictEqual(case2)
    })

    test('search works between HSL:1361108 and HSL:1150110', async () => {
        const startStop = {
            name: 'Maaherrantie',
            code: 'H3076',
            gtfsId: 'HSL:1361108',
            coordinates: {
                latitude: 60.22744,
                longitude: 25.00263,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Haartmaninkatu',
            code: 'H1322',
            gtfsId: 'HSL:1150110',
            coordinates: {
                latitude: 60.19067,
                longitude: 24.90756,
            },
            locationType: 'STOP',
        }
        const startTime = 1639566300000
        const resultCase3 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        // console.log(resultCase1.toJSONForTests())
        expect(resultCase3.toJSONForTests()).toStrictEqual(case3)
    })

    test('search works between HSL:1431187 and HSL:1304161', async () => {
        const startStop = {
            name: 'Herttoniemi (M)',
            code: 'H4006',
            gtfsId: 'HSL:1431187',
            coordinates: {
                latitude: 60.19387,
                longitude: 25.029568,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Munkkivuoren ostosk.',
            code: 'H1432',
            gtfsId: 'HSL:1304161',
            coordinates: {
                latitude: 60.20542,
                longitude: 24.87725,
            },
            locationType: 'STOP',
        }
        const startTime = 1639566000000
        const resultCase4 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase4.toJSONForTests()).toStrictEqual(case4)
    })

    test('search works between HSL:1020454 and HSL:1203409', async () => {
        const startStop = {
            name: 'Rautatieasema',
            code: 'H0302',
            gtfsId: 'HSL:1020454',
            coordinates: {
                latitude: 60.1704,
                longitude: 24.94061,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Länsiterm. T1',
            code: 'H0235',
            gtfsId: 'HSL:1203409',
            coordinates: {
                latitude: 60.15407,
                longitude: 24.919259,
            },
            locationType: 'STOP',
        }
        const startTime = 1640685900000
        const resultCase5 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase5.toJSONForTests()).toStrictEqual(case5)
    })

    test('search works between HSL:1240419 and HSL:1040445', async () => {
        const startStop = {
            name: 'Kumpulan kampus',
            code: 'H0326',
            gtfsId: 'HSL:1240419',
            coordinates: {
                latitude: 60.2031,
                longitude: 24.96565,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Erottaja',
            code: 'H0802',
            gtfsId: 'HSL:1040445',
            coordinates: {
                latitude: 60.16621,
                longitude: 24.94236,
            },
            locationType: 'STOP',
        }
        const startTime = 1640685900000
        const resultCase6 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase6.toJSONForTests()).toStrictEqual(case6)
    })

    test('search works between HSL:1431602 and HSL:1240103', async () => {
        const startStop = {
            name: 'Herttoniemi',
            code: 'H0030',
            gtfsId: 'HSL:1431602',
            coordinates: {
                latitude: 60.194825,
                longitude: 25.030723,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Kumpulan kampus',
            code: 'H3029',
            gtfsId: 'HSL:1240103',
            coordinates: {
                latitude: 60.203679,
                longitude: 24.965952,
            },
            locationType: 'STOP',
        }
        const startTime = 1640685900000
        const resultCase7 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase7.toJSONForTests()).toStrictEqual(case7)
    })

    test('search works between HSL:4610553 and HSL:1171180', async () => {
        const startStop = {
            name: 'Tikkurila',
            code: 'V0618',
            gtfsId: 'HSL:4610553',
            coordinates: {
                latitude: 60.292677,
                longitude: 25.044178,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Ilmalantori',
            code: 'H2087',
            gtfsId: 'HSL:1171180',
            coordinates: {
                latitude: 60.206258,
                longitude: 24.917854,
            },
            locationType: 'STOP',
        }
        const startTime = 1640685600000
        const resultCase8 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase8.toJSONForTests()).toStrictEqual(case8)
    })

    test('search works between HSL:1201601 and HSL:1070418', async () => {
        const startStop = {
            name: 'Ruoholahti',
            code: 'H0015',
            gtfsId: 'HSL:1201601',
            coordinates: {
                latitude: 60.163178,
                longitude: 24.915567,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Kaivopuisto',
            code: 'H0437',
            gtfsId: 'HSL:1070418',
            coordinates: {
                latitude: 60.15956,
                longitude: 24.95505,
            },
            locationType: 'STOP',
        }
        const startTime = 1640686200000
        const resultCase9 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase9.toJSONForTests()).toStrictEqual(case9)
    })

    test('search works between HSL:2314601 and HSL:1310119', async () => {
        const startStop = {
            name: 'Matinkylä',
            code: 'E0011',
            gtfsId: 'HSL:2314601',
            coordinates: {
                latitude: 60.159788,
                longitude: 24.739485,
            },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Koivusaarentie',
            code: 'H1039',
            gtfsId: 'HSL:1310119',
            coordinates: {
                latitude: 60.165174,
                longitude: 24.85844,
            },
            locationType: 'STOP',
        }
        const startTime = 1640686200000
        const resultCase10 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase10.toJSONForTests()).toStrictEqual(case10)
    })

    test('search returns null when no routes between', async () => {
        const startStop = {
            name: 'Kievari',
            code: 'Tu6041',
            gtfsId: 'HSL:9650105',
            coordinates: { latitude: 60.398721, longitude: 25.02284 },
            locationType: 'STOP',
        }
        const endStop = {
            name: 'Upinniemen koulu',
            code: 'Ki1006',
            gtfsId: 'HSL:6100206',
            coordinates: {
                latitude: 60.032892,
                longitude: 24.366045,
            },
            locationType: 'STOP',
        }
        const startTime = 1639566000000
        const resultCase5 = await PathFinder.search(
            startStop,
            endStop,
            startTime
        )

        expect(resultCase5).toBe(undefined)
    })
})
