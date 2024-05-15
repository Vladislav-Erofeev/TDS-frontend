const SET_USER = 'SET_USER'

const nullUser = {
    name: '',
    surname: '',
    lastname: '',
    phone: '',
    email: '',
}
export const UserReducer = (state = nullUser, action) => {
    switch (action.type) {
        case SET_USER:
            return action.payload
        default:
            return state
    }
}

export const setUserAction = (payload) => ({type: SET_USER, payload: payload})