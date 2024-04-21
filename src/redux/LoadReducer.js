

const SET_LOADING = 'SET_LOADING'
export const LoadReducer = (state = true, action) => {
    switch (action.type) {
        case SET_LOADING:
            return action.payload
        default:
            return state
    }
}

export const setLoadingAction = (data) => ({type: SET_LOADING, payload: data})