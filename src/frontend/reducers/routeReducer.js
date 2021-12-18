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
    let routeLine = []

    const firstPath = await axios.post('http://localhost:3001/routeLine', {
        stopGtfsId: route.data.via[route.data.via.length - 1].stop.gtfsId,
        time: 0,
        route: route.data.via[route.data.via.length - 2].route,
    })
    routeLine = routeLine.concat([firstPath.data])

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
        routeLine = routeLine.concat([points.data])
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
    }
}
