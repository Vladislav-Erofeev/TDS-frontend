import axios from "axios";
import {TokenService} from "./TokenService";

export class GeodataService {
    static async save(object) {
        let token = await TokenService.getAccessToken()
        let res = await axios.post(`${process.env.REACT_APP_GEODATA_URL}/objects`, object, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async getAll() {
        let res = await axios.get(`${process.env.REACT_APP_GEODATA_URL}/objects`)
        return res.data
    }

    static async getById(id) {
        let res = await axios.get(`${process.env.REACT_APP_GEODATA_URL}/objects/${id}`)
        return res.data
    }

    static async deleteById(id) {
        let token = await TokenService.getAccessToken()
        await axios.delete(`${process.env.REACT_APP_GEODATA_URL}/objects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async setCheckedById(id) {
        let token = await TokenService.getAccessToken()
        await axios.post(`${process.env.REACT_APP_GEODATA_URL}/objects/${id}/check`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async getAllUserObjects() {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_GEODATA_URL}/objects`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                added: true
            }
        })
        return res.data
    }

    static async getAllUncheckedObjects() {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_GEODATA_URL}/objects`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                checked: false
            }
        })
        return res.data
    }
}