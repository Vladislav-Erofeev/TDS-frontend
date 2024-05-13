import axios from "axios";
import {TokenService} from "./TokenService";

export class ProfileService {
    static async getProfile() {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_AUTH_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async register(user) {
        await axios.post(`${process.env.REACT_APP_AUTH_URL}/register`, user)
    }
}