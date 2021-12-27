/* eslint-disable */
import axios from 'axios'

const departuresReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_STOP':
            return action.data
        case 'GET_STOP':
            return state
        default:
    }
    return state
}

export default departuresReducer

export const setDepartures = (gtfsId, startTime) => {
    return async (dispatch) => {
        const departures = await axios.post(
            'http://localhost:3001/nextDepartures',
            {
                gtfsId,
                startTime,
            }
        )
        dispatch({
            type: 'SET_STOP',
            data: departures,
        })
        dispatch({
            type: 'SET_LOADING',
            data: false,
        })
    }
}
