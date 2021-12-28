/**
 * errorReducer huolehtii huomautusviestien tilasta käyttöliittymässä
 * @param {JSON} state Reduxin tila, jossa hallinnoidaan viestien tyyppiä ja sisältöä
 * @param {*} action Reduxin tapahtuma
 * @returns state
 */
const errorReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return action.data
        case 'GET_ERROR':
            return state
        default:
    }
    return state
}

export default errorReducer
