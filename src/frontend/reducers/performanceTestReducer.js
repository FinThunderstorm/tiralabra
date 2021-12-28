/**
 * performanceTestReducer huolehtii suorituskykytestauksen raporttien tilasta käyttöliittymässä.
 * @param {JSON} state Reduxin tila, jossa hallinnoidaan suorituskykytestin tuloksia
 * @param {*} action Reduxin tapahtuma
 * @returns state
 */
const performanceTestReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_PERFTESTRESULT':
            return action.data
        case 'GET_PERFTESTRESULT':
            return state
        default:
    }
    return state
}

export default performanceTestReducer
