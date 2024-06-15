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

    static async editProfile(user) {
        let token = await TokenService.getAccessToken()
        let res = await axios.post(`${process.env.REACT_APP_AUTH_URL}/profile`, user,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async register(user) {
        await axios.post(`${process.env.REACT_APP_AUTH_URL}/register`, user)
    }

    static async getProfileById(id) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_AUTH_URL}/persons/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }
}