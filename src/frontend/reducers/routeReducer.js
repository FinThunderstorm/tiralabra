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
            const route = await axios.post('http://localhost:3001/search', {
                startStop: startStopGtfsId,
                endStop: endStopGtfsId,
                uStartTime,
            })
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
                data: 'Something happened during search, please check your input and try again',
            })
            setTimeout(() => {
                dispatch({
                    type: 'SET_ERROR',
                    data: null,
                })
            }, 5000)
            dispatch({
                type: 'SET_LOADING',
                data: false,
            })
        }
    }
}
