import {store} from "../redux/store";
import moment from "moment/moment";

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

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name) {
    if (name.length == 0)
        return
    return {
        sx: {
            width: '150px',
            height: '150px',
            bgcolor: stringToColor(name),
            fontSize: '40pt',
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

export function isDateCorrect(date) {
    return date.match('[0-9]{2}.[0-9]{2}.[0-9]{4}') && moment(date, 'DD.MM.YYYY').isValid()
}

