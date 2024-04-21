const SET_USER = 'SET_USER'
export const UserReducer = (state = null, action) => {
    switch (action.type) {
        case SET_USER:
            return action.payload
        default:
            return state
    }
}

export const setUserAction = (payload) => ({type: SET_USER, payload: payload})