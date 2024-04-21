import {combineReducers, createStore} from "redux";
import {UserReducer} from "./userReducer";
import {LoadReducer} from "./LoadReducer";

const reducer = combineReducers({
    user: UserReducer,
    loading: LoadReducer
})
export const store = createStore(reducer)