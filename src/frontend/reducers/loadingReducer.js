/**
 * loadingReducer huolehtii lataushyrrän esitämisen tlasta käyttöliittymässä
 * @param {boolean} state Reduxin tila, jossa hallinnoidaan lataushyrrän tlaa
 * @param {*} action Reduxin tapahtuma
 * @returns state
 */
const loadingReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return action.data
        case 'GET_LOADING':
            return state
        default:
    }
    return state
}

export default loadingReducer
