const messages = {
    success: null,
    error: null
}

const SET_SUCCESS = 'SET_SUCCESS'
const SET_ERROR = 'SET_ERROR'

export const messageReducer = (state = messages, action) => {
    switch (action.type) {
        case SET_SUCCESS:
            return {...state, success: action.payload}
        case SET_ERROR:
            return {...state, error: action.payload}
        default:
            return state
    }
}

export const setSuccessAction = (value) => ({type: SET_SUCCESS, payload: value})
export const setErrorAction = (value) => ({type: SET_ERROR, payload: value})