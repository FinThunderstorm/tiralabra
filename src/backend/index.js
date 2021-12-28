require('module-alias/register')
const express = require('express')
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const cache = require('@backend/redis')
const { apiHealth } = require('@backend/graphql')

const StopRepository = require('@repositories/stopRepository')
const PerformanceTest = require('@backend/performanceTest')
const PathFinder = require('@pathfinder/PathFinder')

const app = express()

app.use(cors())
app.use(express.json())

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Reitinhaku API',
        version: '1.0.0',
        description: 'API-dokumentaatio Reitinhaulle',
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Development server',
        },
    ],
}

const options = {
    swaggerDefinition,
    apis: ['./src/backend/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Tarkastaa vastaavatko API-väylä ja välimuisti tehtyihin kyselyihin
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: API-väylän ja välimuistin tila yhteyden onnistuessa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Health check ok!"
 *                 api:
 *                   type: string
 *                   example: "PONG"
 *                 redis:
 *                   type: string
 *                   example: "PONG"
 *       503:
 *         description: palautetaan, jos API-väylä tai välimuisti ei vastaa
 */
app.get('/health', async (req, res) => {
    try {
        const apiStatus = await apiHealth()
        const redisStatus = await cache.test()
        res.status(200).json({
            status: `Health check ok!`,
            api: apiStatus,
            redis: redisStatus,
        })
    } catch (error) {
        console.log('Error:', error)
        res.status(503).end()
    }
})

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Reitinhaku käyttäen PathFinder-luokassa toteutettua A*-algoritmiä
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startStop:
 *                 type: string
 *                 description: Reitinhaun lähtöpysäkin id GTFS-formaatissa
 *                 example: HSL:4620205
 *               endStop:
 *                 type: string
 *                 description: Reitinhaun kohdepysäkki id GTFS-formaatissa
 *                 example: HSL:1240118
 *               uStartTime:
 *                 type: number
 *                 description: Reitinhaun lähtöaika Epoch-formaatissa (millisekunteissa)
 *                 example: 1640686200000
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Reitinhaku onnistui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  to:
 *                    type: object
 *                    description: Reitinhaun kohdepysäkki
 *                    properties:
 *                      name:
 *                        type: string
 *                        description: Pysäkin nimi
 *                        example: Kumpulan kampus
 *                      code:
 *                        type: string
 *                        description: Pysäkin koodi (HSL-muodossa)
 *                        example: H3028
 *                      gtfsId:
 *                        type: string
 *                        description: Pysäkin id GTFS-formaatissa
 *                        example: HSL:1240118
 *                      coordinates:
 *                        type: object
 *                        description: Pysäkin sijainti korodinaateissa
 *                        properties:
 *                          latitude:
 *                            type: number
 *                            description: Koordinaatin leveysaste
 *                            example: 60.203978
 *                          longitude:
 *                            type: number
 *                            description: Koordinaatin pituusaste
 *                            example: 24.965546
 *                      locationType:
 *                        type: string
 *                        description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                        example: STOP
 *                      arrivesAt:
 *                        type: string
 *                        description: Aikataulun mukainen saapumisaika pysäkille
 *                        example: 2021-12-28T10:32:00.000Z
 *                      realtimeArrivesAt:
 *                        type: string
 *                        description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                        example: 2021-12-28T10:32:00.000Z
 *                      departuresAt:
 *                        type: string
 *                        description: Aikataulun mukainen lähtöaika pysäkiltä
 *                        example: 2021-12-28T10:32:00.000Z
 *                      realtimeDeparturesAt:
 *                        type: string
 *                        description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                        example: 2021-12-28T10:32:00.000Z
 *                      serviceDay:
 *                        type: string
 *                        description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                        example: 2021-12-27T22:00:00.000Z
 *                  from:
 *                    type: object
 *                    description: Reitinhaun lähtöpysäkki
 *                    properties:
 *                      name:
 *                        type: string
 *                        description: Pysäkin nimi
 *                        example: Urheilutie
 *                      code:
 *                        type: string
 *                        description: Pysäkin koodi (HSL-muodossa)
 *                        example: V6205
 *                      gtfsId:
 *                        type: string
 *                        description: Pysäkin id GTFS-formaatissa
 *                        example: HSL:4620205
 *                      coordinates:
 *                        type: object
 *                        description: Pysäkin sijainti koordinaateissa
 *                        properties:
 *                          latitude:
 *                            type: number
 *                            description: Koordinaatin leveysaste
 *                            example: 60.29549
 *                          longitude:
 *                            type: number
 *                            description: Koordinaatin pituusaste
 *                            example: 25.0614
 *                      locationType:
 *                        type: string
 *                        description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                        example: STOP
 *                      arrivesAt:
 *                        type: string
 *                        description: Saapumisaika lähtöpysäkille, myös reitinhaun lähtöaika
 *                        example: 2021-12-28T10:10:00.000Z
 *                  arrived:
 *                    type: string
 *                    description: Saapumisaika perille
 *                    example: 2021-12-28T10:32:00.000Z
 *                  startTime:
 *                    type: string
 *                    description: Reitinhaun lähtöaika
 *                    example: 2021-12-28T10:10:00.000Z
 *                  travelTime:
 *                    type: number
 *                    description: Aika-arvio perille millisekunteissa
 *                    example: 1320000
 *                  via:
 *                    type: array
 *                    description: Lista reitillä olevista pysäkeistä
 *                    items:
 *                      type: object
 *                      description: Reitin tiedot pysäkeittäin
 *                      properties:
 *                        stop:
 *                          type: object
 *                          description: Pysäkin tiedot, jolle reitillä on saavuttu
 *                          properties:
 *                            name:
 *                              type: string
 *                              description: Pysäkin nimi
 *                              example: Kumpulan kampus
 *                            code:
 *                              type: string
 *                              description: Pysäkin koodi (HSL-muodossa)
 *                              example: H3028
 *                            gtfsId:
 *                              type: string
 *                              description: Pysäkin id GTFS-formaatissa
 *                              example: HSL:1240118
 *                            coordinates:
 *                              type: object
 *                              description: Pysäkin sijainti korodinaateissa
 *                              properties:
 *                                  latitude:
 *                                    type: number
 *                                    description: Koordinaatin leveysaste
 *                                    example: 60.203978
 *                                  longitude:
 *                                    type: number
 *                                    description: Koordinaatin pituusaste
 *                                    example: 24.965546
 *                            locationType:
 *                              type: string
 *                              description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                              example: STOP
 *                            arrivesAt:
 *                              type: string
 *                              description: Aikataulun mukainen saapumisaika pysäkille
 *                              example: 2021-12-28T10:32:00.000Z
 *                            realtimeArrivesAt:
 *                              type: string
 *                              description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                              example: 2021-12-28T10:32:00.000Z
 *                            departuresAt:
 *                              type: string
 *                              description: Aikataulun mukainen lähtöaika pysäkiltä
 *                              example: 2021-12-28T10:32:00.000Z
 *                            realtimeDeparturesAt:
 *                              type: string
 *                              description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                              example: 2021-12-28T10:32:00.000Z
 *                            serviceDay:
 *                              type: string
 *                              description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                              example: 2021-12-27T22:00:00.000Z
 *                        route:
 *                          type: string
 *                          description: Linja, jolla pysäkille saavuttiin
 *                          example: 721 to Hakaniemi (HSL:1111203)
 *                        travelTime:
 *                          type: number
 *                          description: Aika-arvio matkan kestosta millisekuntteina
 *                          example: 1320000
 *       400:
 *         description: Jos hakuehtoina annetuilla GTFS-muotoisilla id-koodeilla ei löytynyt pysäkkiä tai reittiä ei löytynyt
 *       500:
 *         description: Jokin virhe tapahtui reitinhaun aikana
 */
app.post('/search', async (req, res) => {
    const attributes = req.body
    if (
        attributes.startStop === undefined ||
        attributes.endStop === undefined
    ) {
        res.status(400).end()
        return
    }

    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)

    if (startStop === null || endStop === null) {
        res.status(400).end()
        return
    }

    PathFinder.search(startStop, endStop, attributes.uStartTime).then(
        (searchedRoute) => {
            if (searchedRoute === null) {
                res.status(400).end()
                return
            }
            try {
                const routeJSON = searchedRoute.toJSON()
                res.json(routeJSON)
            } catch (error) {
                console.error(error)
                res.status(500).end()
            }
        }
    )
})

/**
 * @swagger
 * /stop/{stopGtfsId}:
 *   get:
 *     summary: Pysäkin tarkempien tietojen hakeminen
 *     parameters:
 *       - in: path
 *         name: stopGtfsId
 *         required: true
 *         description: Haettavan pysäkin id GTFS-formaatissa
 *         schema:
 *           type: string
 *           example: HSL:1310119
 *     responses:
 *       200:
 *         description: Annetulla id:llä löydetyn pysäkin tiedot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Pysäkin nimi
 *                   example: Koivusaarentie
 *                 code:
 *                   type: string
 *                   description: Pysäkin koodi (HSL-muodossa)
 *                   example: H1039
 *                 gtfsId:
 *                   type: string
 *                   description: Pysäkin id GTFS-formaatissa
 *                   example: HSL:1310119
 *                 coordinates:
 *                   type: object
 *                   description: Pysäkin sijainti koordinaateissa
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: Koordinaatin leveysaste
 *                       example: 60.165174
 *                     longitude:
 *                       type: number
 *                       description: Koordinaatin pituusaste
 *                       example: 24.85844
 *                 locationType:
 *                   type: string
 *                   description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                   example: STOP
 *       400:
 *         description: Pysäkkiä ei ole annetulla id:llä
 */
app.get('/stop/:stopGtfsId', async (req, res) => {
    StopRepository.getStop(req.params.stopGtfsId).then((stop) => {
        if (stop === null) {
            res.status(400).end()
            return
        }
        res.json(stop)
    })
})

/**
 * @swagger
 * /nextDepartures:
 *   post:
 *     summary: Pysäkiltä liikennöivien linjojen seuraavat lähdöt annetulla ajan hetkellä
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stopGtfsId:
 *                 type: string
 *                 description: Reitinhaun lähtöpysäkin id GTFS-formaatissa
 *                 example: HSL:4620205
 *               startTime:
 *                 type: number
 *                 description: Reitinhaun lähtöaika Epoch-formaatissa (millisekunteissa). Antaa oletuksena tämän hetkisen kellonajan. Ajalla 0 saa seuraavat lähdöt tämän hetkisellä kellonajalla.
 *                 example: 1640686200000
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Pysäkin lähtöjen hakeminen onnistui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stop: 
 *                   type: object
 *                   description: Haetun pysäkin tiedot
 *                   properties: 
 *                     name: 
 *                       type: string
 *                       description: Pysäkin nimi
 *                       example: Urheilutie
 *                     code: 
 *                       type: string
 *                       description: Pysäkin koodi (HSL-muodossa)
 *                       example: V6205
 *                     gtfsId: 
 *                       type: string
 *                       description: Pysäkin id GTFS-formaatissa
 *                       example: HSL:4620205
 *                     coordinates: 
 *                       type: object
 *                       description: Pysäkin sijainti korodinaateissa
 *                       properties: 
 *                         latitude: 
 *                           type: number
 *                           description: Koordinaatin leveysaste
 *                           example: 60.29549
 *                         longitude: 
 *                           type: number
 *                           description: Koordinaatin pituusaste
 *                           example: 25.0614
 *                     locationType: 
 *                       type: string
 *                       description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                       example: STOP
 *                 departures: 
 *                   type: array
 *                   description: Lista pysäkiltä lähtevistä linjoista
 *                   items: 
 *                     type: object
 *                     description: Pysäkiltä lähtevän linjan tiedot
 *                     properties: 
 *                       name: 
 *                         type: string
 *                         description: Reitin nimi
 *                         example: 570 to Mellunmäki (M) (HSL:1473180)
 *                       code: 
 *                         type: string
 *                         description: Reitin id GTFS-formaatissa tälle suunnalle
 *                         example: HSL:4570:1:01
 *                       tripGtfsId: 
 *                         type: string
 *                         description: Reitin id GTFS-formaatissa tälle lähdölle
 *                         example: HSL:4570_20211227_Ti_2_1713
 *                       headsign: 
 *                         type: string
 *                         description: Linjakilpi reitillä
 *                         example: Mellunmäki(M)
 *                       realtime: 
 *                         type: boolean
 *                         description: Tosi, mikäli reaaliaikaista aikatietoa on saatavilla kyseiselle linjalle
 *                       arrivesAt: 
 *                         type: string
 *                         description: Aikataulun mukainen saapumisaika pysäkille
 *                         example: 2021-12-28T15:49:00.000Z
 *                       realtimeArrivesAt: 
 *                         type: string
 *                         description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                         example: 2021-12-28T15:49:27.000Z
 *                       departuresAt: 
 *                         type: string
 *                         description: Aikataulun mukainen lähtöaika pysäkiltä
 *                         example: 2021-12-28T15:49:00.000Z
 *                       realtimeDeparturesAt: 
 *                         type: string
 *                         description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                         example: 2021-12-28T15:49:43.000Z
 *                       nextStop: 
 *                         type: object
 *                         description: Haetulla reitilla haettua pysäkkiä seuraava pysäkki
 *                         properties: 
 *                           name: 
 *                             type: string
 *                             description: Pysäkin nimi
 *                             example: Hakintie
 *                           code: 
 *                             type: string
 *                             description: Pysäkin koodi (HSL-muodossa)
 *                             example: V6601
 *                           gtfsId: 
 *                             type: string
 *                             description: Pysäkin id GTFS-formaatissa
 *                             example: HSL:4660201
 *                           coordinates: 
 *                             type: object
 *                             description: Pysäkin sijainti korodinaateissa
 *                             properties: 
 *                               latitude: 
 *                                 type: number
 *                                 description: Koordinaatin leveysaste
 *                                 example: 60.29136
 *                               longitude: 
 *                                 type: number
 *                                 description: Koordinaatin pituusaste
 *                                 example: 25.07367
 *                           locationType: 
 *                             type: string
 *                             description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                             example: STOP
 *                           arrivesAt: 
 *                             type: string
 *                             description: Aikataulun mukainen saapumisaika pysäkille
 *                             example: 2021-12-28T15:51:00.000Z
 *                           realtimeArrivesAt: 
 *                             type: string
 *                             description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                             example: 2021-12-28T15:51:08.000Z
 *                           departuresAt: 
 *                             type: string
 *                             description: Aikataulun mukainen lähtöaika pysäkiltä
 *                             example: 2021-12-28T15:51:00.000Z
 *                           realtimeDeparturesAt: 
 *                             type: string
 *                             description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                             example: 2021-12-28T15:51:16.000Z
 *                           serviceDay: 
 *                             type: string
 *                             description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                             example: 2021-12-27T22:00:00.000Z
 *                       boardable: 
 *                         type: string
 *                         description: Voiko pysäkiltä nousta kyytiin. 'NONE' ilmaisee, ettei pysäkiltä voi noustta kyseisen linjan kyytiin.
 *                         example: SCHEDULED
 *                       unixTimestamps: 
 *                         type: object
 *                         description: Aiemmin ilmotetut ajat API:n tarjoamassa aikaformaatissa
 *                         properties: 
 *                           scheduledDeparture: 
 *                             type: integer
 *                             format: int32
 *                             description: Aikataulun mukainen lähtöaika pysäkiltä Epoch-formaatissa ilman millisekunteja.
 *                             example: 64140
 *                           realtimeDeparture: 
 *                             type: integer
 *                             format: int32
 *                             description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika Epoch-formaatissa ilman millisekunteja.
 *                             example: 64183
 *                           serviceDay: 
 *                             type: integer
 *                             format: int32
 *                             description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0. Epoch-formaatissa ilman millisekunteja.
 *                             example: 1640642400

 *       400:
 *         description: Annetuilla tiedoilla ei löydy lähtöjä
 */
app.post('/nextDepartures', async (req, res) => {
    const attributes = req.body
    StopRepository.getNextDepartures(
        attributes.gtfsId,
        attributes.startTime ?? new Date().valueOf()
    ).then((departures) => {
        if (departures === null) {
            res.status(400).end()
            return
        }
        res.json(departures)
    })
})

/**
 * @swagger
 * /findStops:
 *   post:
 *     summary: Pysäkiltä liikennöivien linjojen seuraavat lähdöt annetulla ajan hetkellä
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: Sijainnin hakuehto
 *                 example: Exactum
 *     produces:
 *       - application/json
 *     responses:
 *       218:
 *         description: Annetulla hakuehdolla löytyi pysäkkejä
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stops:
 *                   type: array
 *                   description: Lista pysäkeistä lähellä annettua hakuehtoa
 *                   items:
 *                     type: object
 *                     description: Yksittäisen pysäkin tiedot
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Pysäkin nimi
 *                         example: A.I. Virtasen aukio
 *                       code:
 *                         type: string
 *                         description: Pysäkin koodi (HSL-muodossa)
 *                         example: H3597
 *                       gtfsId:
 *                         type: string
 *                         description: Pysäkin id GTFS-formaatissa
 *                         example: HSL:1240133
 *                       lat:
 *                         type: number
 *                         description: Pysäkin sijainnin koordinaateissa leveysaste
 *                         example: 60.20488
 *                       lon:
 *                         type: number
 *                         description: Pysäkin sijainnin koordinaateissa pituusaste
 *                         example: 24.96385
 *                       locationType:
 *                         type: string
 *                         description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                         example: STOP
 *                       platformCode:
 *                         type: integer
 *                         format: int32
 *                         description: Laiturinumero
 *                         nullable: true
 *                         example: 1
 *                       vehicleMode:
 *                         type: string
 *                         description: Pysäkiltä kulkevien linjojen tyypit
 *                         example: BUS
 */
app.post('/findStops', async (req, res) => {
    const attributes = req.body

    const textResults = await StopRepository.findStopsByText(
        attributes.searchTerm
    )
    res.status(218).json(textResults)
})

/**
 * @swagger
 * /routeLine:
 *   post:
 *     summary: Reitin kulkema reitti kartalla annetulta pysäkiltä seuraavalle koordinaattipisteinä
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: Sijainnin hakuehto
 *                 example: Exactum
 *     produces:
 *       - application/json
 *     responses:
 *       218:
 *         description: Koordinaattipisteet haetulla reitillä annetulta pysäkiltä seuraavalle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Lista reittipisteitä.
 *               items:
 *                  type: array
 *                  description: Reittipiste, jonka kautta linja kulkee. Muodossa [leveysaste, pituusaste]
 *                  items:
 *                    type: number
 *                  example: [60.295574, 25.061377]
 */
app.post('/routeLine', async (req, res) => {
    const attributes = req.body
    StopRepository.getRouteline(
        attributes.stopGtfsId,
        attributes.time,
        attributes.route
    ).then((result) => {
        res.status(218).json(result)
    })
})

/**
 * @swagger
 * /performanceTest:
 *   post:
 *     summary: Suorituskykytestaus
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startStop:
 *                 type: string
 *                 description: Reitinhaun lähtöpysäkin id GTFS-formaatissa
 *                 example: HSL:4620205
 *               endStop:
 *                 type: string
 *                 description: Reitinhaun kohdepysäkki id GTFS-formaatissa
 *                 example: HSL:1240118
 *               startTime:
 *                 type: string
 *                 description: Reitinhaun lähtöaika lokaalissa ajassa
 *                 example: 2021-12-28T10:00:00.000Z
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Suorituskykytestaus onnistui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 route:
 *                   type: object
 *                   description: Reitinhaun tulos käyttäen välimuistia
 *                   properties:
 *                     to:
 *                       type: object
 *                       description: Reitinhaun kohdepysäkki
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Pysäkin nimi
 *                           example: Kumpulan kampus
 *                         code:
 *                           type: string
 *                           description: Pysäkin koodi (HSL-muodossa)
 *                           example: H3028
 *                         gtfsId:
 *                           type: string
 *                           description: Pysäkin id GTFS-formaatissa
 *                           example: HSL:1240118
 *                         coordinates:
 *                           type: object
 *                           description: Pysäkin sijainti korodinaateissa
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               description: Koordinaatin leveysaste
 *                               example: 60.203978
 *                             longitude:
 *                               type: number
 *                               description: Koordinaatin pituusaste
 *                               example: 24.965546
 *                         locationType:
 *                           type: string
 *                           description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                           example: STOP
 *                         arrivesAt:
 *                           type: string
 *                           description: Aikataulun mukainen saapumisaika pysäkille
 *                           example: 2021-12-28T10:32:00.000Z
 *                         realtimeArrivesAt:
 *                           type: string
 *                           description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                           example: 2021-12-28T10:32:00.000Z
 *                         departuresAt:
 *                           type: string
 *                           description: Aikataulun mukainen lähtöaika pysäkiltä
 *                           example: 2021-12-28T10:32:00.000Z
 *                         realtimeDeparturesAt:
 *                           type: string
 *                           description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                           example: 2021-12-28T10:32:00.000Z
 *                         serviceDay:
 *                           type: string
 *                           description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                           example: 2021-12-27T22:00:00.000Z
 *                     from:
 *                       type: object
 *                       description: Reitinhaun lähtöpysäkki
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Pysäkin nimi
 *                           example: Urheilutie
 *                         code:
 *                           type: string
 *                           description: Pysäkin koodi (HSL-muodossa)
 *                           example: V6205
 *                         gtfsId:
 *                           type: string
 *                           description: Pysäkin id GTFS-formaatissa
 *                           example: HSL:4620205
 *                         coordinates:
 *                           type: object
 *                           description: Pysäkin sijainti koordinaateissa
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               description: Koordinaatin leveysaste
 *                               example: 60.29549
 *                             longitude:
 *                               type: number
 *                               description: Koordinaatin pituusaste
 *                               example: 25.0614
 *                         locationType:
 *                           type: string
 *                           description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                           example: STOP
 *                         arrivesAt:
 *                           type: string
 *                           description: Saapumisaika lähtöpysäkille, myös reitinhaun lähtöaika
 *                           example: 2021-12-28T10:10:00.000Z
 *                     arrived:
 *                       type: string
 *                       description: Saapumisaika perille
 *                       example: 2021-12-28T10:32:00.000Z
 *                     startTime:
 *                       type: string
 *                       description: Reitinhaun lähtöaika
 *                       example: 2021-12-28T10:10:00.000Z
 *                     travelTime:
 *                       type: number
 *                       description: Aika-arvio perille millisekunteissa
 *                       example: 1320000
 *                     via:
 *                       type: array
 *                       description: Lista reitillä olevista pysäkeistä
 *                       items:
 *                         type: object
 *                         description: Reitin tiedot pysäkeittäin
 *                         properties:
 *                           stop:
 *                             type: object
 *                             description: Pysäkin tiedot, jolle reitillä on saavuttu
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: Pysäkin nimi
 *                                 example: Kumpulan kampus
 *                               code:
 *                                 type: string
 *                                 description: Pysäkin koodi (HSL-muodossa)
 *                                 example: H3028
 *                               gtfsId:
 *                                 type: string
 *                                 description: Pysäkin id GTFS-formaatissa
 *                                 example: HSL:1240118
 *                               coordinates:
 *                                 type: object
 *                                 description: Pysäkin sijainti korodinaateissa
 *                                 properties:
 *                                     latitude:
 *                                       type: number
 *                                       description: Koordinaatin leveysaste
 *                                       example: 60.203978
 *                                     longitude:
 *                                       type: number
 *                                       description: Koordinaatin pituusaste
 *                                       example: 24.965546
 *                               locationType:
 *                                 type: string
 *                                 description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                                 example: STOP
 *                               arrivesAt:
 *                                 type: string
 *                                 description: Aikataulun mukainen saapumisaika pysäkille
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               realtimeArrivesAt:
 *                                 type: string
 *                                 description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               departuresAt:
 *                                 type: string
 *                                 description: Aikataulun mukainen lähtöaika pysäkiltä
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               realtimeDeparturesAt:
 *                                 type: string
 *                                 description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               serviceDay:
 *                                 type: string
 *                                 description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                                 example: 2021-12-27T22:00:00.000Z
 *                           route:
 *                             type: string
 *                             description: Linja, jolla pysäkille saavuttiin
 *                             example: 721 to Hakaniemi (HSL:1111203)
 *                           travelTime:
 *                             type: number
 *                             description: Aika-arvio matkan kestosta millisekuntteina
 *                             example: 1320000
 *                 uncachedRoute:
 *                   type: object
 *                   description: Reitinhaun tulos käyttäen välimuistia
 *                   properties:
 *                     to:
 *                       type: object
 *                       description: Reitinhaun kohdepysäkki
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Pysäkin nimi
 *                           example: Kumpulan kampus
 *                         code:
 *                           type: string
 *                           description: Pysäkin koodi (HSL-muodossa)
 *                           example: H3028
 *                         gtfsId:
 *                           type: string
 *                           description: Pysäkin id GTFS-formaatissa
 *                           example: HSL:1240118
 *                         coordinates:
 *                           type: object
 *                           description: Pysäkin sijainti korodinaateissa
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               description: Koordinaatin leveysaste
 *                               example: 60.203978
 *                             longitude:
 *                               type: number
 *                               description: Koordinaatin pituusaste
 *                               example: 24.965546
 *                         locationType:
 *                           type: string
 *                           description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                           example: STOP
 *                         arrivesAt:
 *                           type: string
 *                           description: Aikataulun mukainen saapumisaika pysäkille
 *                           example: 2021-12-28T10:32:00.000Z
 *                         realtimeArrivesAt:
 *                           type: string
 *                           description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                           example: 2021-12-28T10:32:00.000Z
 *                         departuresAt:
 *                           type: string
 *                           description: Aikataulun mukainen lähtöaika pysäkiltä
 *                           example: 2021-12-28T10:32:00.000Z
 *                         realtimeDeparturesAt:
 *                           type: string
 *                           description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                           example: 2021-12-28T10:32:00.000Z
 *                         serviceDay:
 *                           type: string
 *                           description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                           example: 2021-12-27T22:00:00.000Z
 *                     from:
 *                       type: object
 *                       description: Reitinhaun lähtöpysäkki
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Pysäkin nimi
 *                           example: Urheilutie
 *                         code:
 *                           type: string
 *                           description: Pysäkin koodi (HSL-muodossa)
 *                           example: V6205
 *                         gtfsId:
 *                           type: string
 *                           description: Pysäkin id GTFS-formaatissa
 *                           example: HSL:4620205
 *                         coordinates:
 *                           type: object
 *                           description: Pysäkin sijainti koordinaateissa
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               description: Koordinaatin leveysaste
 *                               example: 60.29549
 *                             longitude:
 *                               type: number
 *                               description: Koordinaatin pituusaste
 *                               example: 25.0614
 *                         locationType:
 *                           type: string
 *                           description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                           example: STOP
 *                         arrivesAt:
 *                           type: string
 *                           description: Saapumisaika lähtöpysäkille, myös reitinhaun lähtöaika
 *                           example: 2021-12-28T10:10:00.000Z
 *                     arrived:
 *                       type: string
 *                       description: Saapumisaika perille
 *                       example: 2021-12-28T10:32:00.000Z
 *                     startTime:
 *                       type: string
 *                       description: Reitinhaun lähtöaika
 *                       example: 2021-12-28T10:10:00.000Z
 *                     travelTime:
 *                       type: number
 *                       description: Aika-arvio perille millisekunteissa
 *                       example: 1320000
 *                     via:
 *                       type: array
 *                       description: Lista reitillä olevista pysäkeistä
 *                       items:
 *                         type: object
 *                         description: Reitin tiedot pysäkeittäin
 *                         properties:
 *                           stop:
 *                             type: object
 *                             description: Pysäkin tiedot, jolle reitillä on saavuttu
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: Pysäkin nimi
 *                                 example: Kumpulan kampus
 *                               code:
 *                                 type: string
 *                                 description: Pysäkin koodi (HSL-muodossa)
 *                                 example: H3028
 *                               gtfsId:
 *                                 type: string
 *                                 description: Pysäkin id GTFS-formaatissa
 *                                 example: HSL:1240118
 *                               coordinates:
 *                                 type: object
 *                                 description: Pysäkin sijainti korodinaateissa
 *                                 properties:
 *                                     latitude:
 *                                       type: number
 *                                       description: Koordinaatin leveysaste
 *                                       example: 60.203978
 *                                     longitude:
 *                                       type: number
 *                                       description: Koordinaatin pituusaste
 *                                       example: 24.965546
 *                               locationType:
 *                                 type: string
 *                                 description: Pysäkin tyyppi (yleensä 'STOP', voi olla myös 'STATION', johon kuuluu useita 'STOP')
 *                                 example: STOP
 *                               arrivesAt:
 *                                 type: string
 *                                 description: Aikataulun mukainen saapumisaika pysäkille
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               realtimeArrivesAt:
 *                                 type: string
 *                                 description: Reaaliaikainen saapumisaika pysäkille, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen saapumisaika
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               departuresAt:
 *                                 type: string
 *                                 description: Aikataulun mukainen lähtöaika pysäkiltä
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               realtimeDeparturesAt:
 *                                 type: string
 *                                 description: Reaaliaikainen lähtöaika pysäkiltä, jos reaaliaikaista ei ole saatavilla, tulee aikataulun mukainen lähtöaika
 *                                 example: 2021-12-28T10:32:00.000Z
 *                               serviceDay:
 *                                 type: string
 *                                 description: Päivä, jona linjaa ajetaan. Vastaa lokaalia aikaa, merkitään UTC+0.
 *                                 example: 2021-12-27T22:00:00.000Z
 *                           route:
 *                             type: string
 *                             description: Linja, jolla pysäkille saavuttiin
 *                             example: 721 to Hakaniemi (HSL:1111203)
 *                           travelTime:
 *                             type: number
 *                             description: Aika-arvio matkan kestosta millisekuntteina
 *                             example: 1320000
 *                 took:
 *                   type: object
 *                   description: Suorituskykytestauksen tulokset
 *                   properties:
 *                     uncachedPathfinder:
 *                       type: number
 *                       description: Reitinhaun kesto ilman välimuistia sekunteissa
 *                       example: 5.845262299999595
 *                     pathfinder:
 *                       type: number
 *                       description: Reitinhaun kesto välimuistilla sekunteissa
 *                       example: 0.25410329999029635
 *                     resultText:
 *                       type: string
 *                       description: Suorituskykytestauksen tulosteksti
 *                       example: Uncached took 5.845 seconds and cached PathFinder took 0.254 seconds
 *                     comparation:
 *                       type: string
 *                       description: Suorituskykytestauksen vertailu
 *                       example: Cached PathFinder was 2200.349% faster than uncached PathFinder\n -> Time difference was 5.591 seconds.
 *       500:
 *         description: Suorituskykytestauksessa tapahtui virhe
 */
app.post('/performanceTest', async (req, res) => {
    const attributes = req.body
    const startStop = await StopRepository.getStop(attributes.startStop)
    const endStop = await StopRepository.getStop(attributes.endStop)
    const startTime = new Date(Date.parse(attributes.startTime))

    await cache.flushall()

    console.log('Starting perftest')
    const uncachedPfStart = performance.now()
    PerformanceTest.runPathFinder(startStop, endStop, startTime, 1)
        .then((uncachedPfResult) => {
            const uncachedPfEnd = performance.now()
            PerformanceTest.runPathFinder(startStop, endStop, startTime)
                .then(() => {
                    const pfStart = performance.now()
                    PerformanceTest.runPathFinder(
                        startStop,
                        endStop,
                        startTime,
                        1
                    )
                        .then((pfResult) => {
                            const pfEnd = performance.now()
                            const uncachedPfTook =
                                (uncachedPfEnd - uncachedPfStart) / 1000
                            const pfTook = (pfEnd - pfStart) / 1000
                            const percentage =
                                ((uncachedPfTook - pfTook) / pfTook) * 100
                            const difference = uncachedPfTook - pfTook
                            res.json({
                                route: pfResult,
                                uncachedRoute: uncachedPfResult,
                                took: {
                                    uncachedPathfinder: uncachedPfTook,
                                    pathfinder: pfTook,
                                    resultText: `Uncached took ${uncachedPfTook.toFixed(
                                        3
                                    )} seconds and cached PathFinder took ${pfTook.toFixed(
                                        3
                                    )} seconds`,
                                    comparation: `Cached PathFinder was ${percentage.toFixed(
                                        3
                                    )}% faster than uncached PathFinder\n -> Time difference was ${difference.toFixed(
                                        3
                                    )} seconds.`,
                                },
                            })
                        })
                        .catch((error) => res.status(500).send(error))
                })
                .catch((error) => res.status(500).send(error))
        })
        .catch((error) => res.status(500).send(error))
})

/**
 * @swagger
 * /flushall:
 *   get:
 *     summary: Tyhjentää välimuistista kaikki avain-arvo -parit
 *     responses:
 *       218:
 *         description: Välimuistin tyhjennys onnistui
 */
app.get('/flushall', async (req, res) => {
    const result = await cache.flushall()

    console.log('Result of flushall:', result)

    res.status(218).end()
})

/**
 * @swagger
 * /cache:
 *   get:
 *     summary: Palauttaa välimuistiin tallennetut avain-arvo -part
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Avain-arvo -parien palauttaminen onnistui. Palauttaa JSON-muodossa /stop/{stopGtfsId}, /nextDepartures, /findStops ja /routeLine -tuloksia
 */
app.get('/cache', async (req, res) => {
    const keys = await cache.getAllKeys()

    console.log('Keys in cache:', keys.length)

    const test = await cache.getAllValues(keys)
    const result = test.map((value) => JSON.parse(value))
    const pairs = {}
    for (let i = 0; i < result.length; i += 1) {
        pairs[keys[i]] = result[i]
    }
    res.json(pairs)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})
