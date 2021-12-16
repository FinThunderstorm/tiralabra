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
        let routeLine = []
        route.data.via.forEach((stop) => {
            routeLine = routeLine.concat([
                [
                    stop.stop.coordinates.latitude,
                    stop.stop.coordinates.longitude,
                ],
            ])
        })
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
