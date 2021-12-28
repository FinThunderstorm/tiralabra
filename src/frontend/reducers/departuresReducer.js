import axios from 'axios'

/**
 * departuresReducer huolehtii tietyltä pysäkiltä lähtevien linjojen tietojen säilyttämisestä käyttöliittymässä
 * @param {JSON} state Reduxin tila, jossa hallnnoidaan pysäkiltä lähtevien linjojen tietoja
 * @param {*} action Reduxin tapahtuma
 * @returns state
 */
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

/**
 * setDepartures käytetään käyttölittymästä saadakseen näkyville tietyltä pysäkiltä tietylä ajan hetkellä lähtevät linjat.
 * @param {string} gtfsId pysäkin id GTFS-formaatissa
 * @param {number} startTime lähtöaika pysäkille millisekuntteina
 * @returns {function} Reduxin ymmärtämä dispatch-funktio
 */
export const setDepartures = (gtfsId, startTime) => async (dispatch) => {
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
