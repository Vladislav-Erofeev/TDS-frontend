import {store} from "../redux/store";

export function hasRole(...role) {
    let user = store.getState().user
    if (user == null)
        return false
    for (let x of role) {
        if (user.role === x)
            return true
    }
    return false
}