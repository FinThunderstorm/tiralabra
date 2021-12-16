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
