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
