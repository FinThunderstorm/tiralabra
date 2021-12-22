/* eslint-disable */
import axios from 'axios'

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

const formatRouteLine = async (route) => {
    let routeLine = {}

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

export const findPerformance = (startStopGtfsId, endStopGtfsId, startTime) => {
    const uStartTime = Date.parse(startTime)
    console.log(uStartTime)
    return async (dispatch) => {
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
                    startTime: '2021-12-22T10:00:00.000Z',
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
}

export const findRoute = (startStopGtfsId, endStopGtfsId, startTime) => {
    const uStartTime = Date.parse(startTime)
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
