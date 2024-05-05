import {combineReducers, createStore} from "redux";
import {UserReducer} from "./userReducer";
import {LoadReducer} from "./LoadReducer";
import {messageReducer} from "./messageReducer";

const reducer = combineReducers({
    user: UserReducer,
    loading: LoadReducer,
    messages: messageReducer
})
export const store = createStore(reducer)