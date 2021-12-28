/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import axios from 'axios'

/**
 * routeReducer huolehti reitin tilasta käyttöliittymässä
 * @param {JSON} state Reduxin tila, jossa hallinnoidaan reittiä
 * @param {*} action Reduxin tapahtuma
 * @returns state
 */
const routeReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_ROUTE':
            return action.data
        case 'GET_ROUTE':
            return state
        default:
    }
    return state
}

export default routeReducer

/**
 * formatRouteLine huolehti reittipisteiden muotoilusta
 * @param {string} route Reitti, jolle haetaan reittipisteitä.
 * @returns {JSON} jokaiselle reitille kuljetut reittipisteet
 */
const formatRouteLine = async (route) => {
    const routeLine = {}

    for (let i = route.data.via.length - 1; i > 0; i -= 1) {
        const stop = route.data.via[i]
        const nextStop = route.data.via[i - 1]

        const points = await axios.post('http://localhost:3001/routeLine', {
            stopGtfsId: stop.stop.gtfsId,
            time: 0,
            route: nextStop.route,
        })
        if (points === undefined) {
            return
        }

        if (routeLine[nextStop.route.split(' ')[0]] === undefined) {
            routeLine[nextStop.route.split(' ')[0]] = []
        }

        routeLine[nextStop.route.split(' ')[0]] = routeLine[
            nextStop.route.split(' ')[0]
        ].concat([points.data])
    }
    return routeLine
}

/**
 * findPerformance huolehtii suorituskykytestin toteuttamisesta käyttöliittymän puolella
 * @param {string} startStopGtfsId lähtöpysäkin id GTFS-formaatissa
 * @param {string} endStopGtfsId kohdepysäkin id GTFS-formaatissa
 * @param {string} startTime lähtöaika ISO-muotosessa merkkijonossa
 * @returns Reduxin ymmärtämä dispatch-funktio
 */
export const findPerformance =
    (startStopGtfsId, endStopGtfsId, startTime) => async (dispatch) => {
        dispatch({
            type: 'SET_PERFTESTRESULT',
            data: null,
        })
        dispatch({
            type: 'SET_ROUTE',
            data: null,
        })

        try {
            const result = await axios.post(
                'http://localhost:3001/performanceTest',
                {
                    startStop: startStopGtfsId,
                    endStop: endStopGtfsId,
                    startTime: startTime.toISOString(),
                }
            )

            dispatch({
                type: 'SET_ROUTE',
                data: { route: result.data.route, routeLine: [] },
            })
            dispatch({
                type: 'SET_PERFTESTRESULT',
                data: {
                    took: result.data.took,
                    uncachedRoute: result.data.uncachedRoute,
                },
            })
        } catch {
            console.log('err')
        }
    }

/**
 * findRoute huolehtii reitinhaun toteuttamisesta käyttöliittymän puolella
 * @param {string} startStopGtfsId lähtöpysäkin id GTFS-formaatissa
 * @param {string} endStopGtfsId kohdepysäkin id GTFS-formaatissa
 * @param {string} fStartTime lähtöaika merkkjonona
 * @returns Reduxin ymmärtämä dispatch-funktio
 */
export const findRoute = (startStopGtfsId, endStopGtfsId, fStartTime) => {
    const uStartTime = Date.parse(fStartTime)
    return async (dispatch) => {
        dispatch({
            type: 'SET_LOADING',
            data: true,
        })
        dispatch({
            type: 'SET_ROUTE',
            data: null,
        })

        try {
            const startTime = performance.now()
            const route = await axios.post('http://localhost:3001/search', {
                startStop: startStopGtfsId,
                endStop: endStopGtfsId,
                uStartTime,
            })
            const endTime = performance.now()
            dispatch({
                type: 'SET_ERROR',
                data: {
                    msg: `Route found, formatting... took ${(
                        (endTime - startTime) /
                        1000
                    ).toFixed(1)} seconds`,
                    type: 'success',
                },
            })
            setTimeout(() => {
                dispatch({
                    type: 'SET_ERROR',
                    data: null,
                })
            }, 15000)
            const routeLine = await formatRouteLine(route)

            dispatch({
                type: 'SET_ROUTE',
                data: { route: route.data, routeLine },
            })
            dispatch({
                type: 'SET_LOADING',
                data: false,
            })
        } catch {
            dispatch({
                type: 'SET_ERROR',
                data: {
                    msg: 'Something happened during search, please check your input and try again',
                    type: 'error',
                },
            })
            setTimeout(() => {
                dispatch({
                    type: 'SET_ERROR',
                    data: null,
                })
            }, 10000)
            dispatch({
                type: 'SET_LOADING',
                data: false,
            })
        }
    }
}
