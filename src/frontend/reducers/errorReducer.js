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
