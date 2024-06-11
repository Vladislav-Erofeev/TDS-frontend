import {TokenService} from "./TokenService";
import axios from "axios";
import {fetchEventSource} from "@microsoft/fetch-event-source";

export class GeocodingService {
    static async getAll() {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_GEOCODING_URL}/geocoding`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async search(query) {
        let res = await axios.get(`${process.env.REACT_APP_GEOCODING_URL}/search`, {
            params: {
                query: query,
            }
        })
        return res.data
    }

    static async filterSearch(query, codes) {
        let res = await axios.get(`${process.env.REACT_APP_GEOCODING_URL}/search`, {
            params: {
                query: query,
                codes: codes.join(', ')
            }
        })
        return res.data
    }

    static async createNew(file) {
        let token = await TokenService.getAccessToken()
        let formdata = new FormData()
        formdata.append("file", file)
        let res = await axios.post(`${process.env.REACT_APP_GEOCODING_URL}/geocoding`, formdata, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async openSseStream(callback) {
        let token = await TokenService.getAccessToken()
        await fetchEventSource(`${process.env.REACT_APP_GEOCODING_URL}/geocoding/notification-stream`, {
            method: 'GET',
            mode: 'cors',
            headers: {Authorization: `Bearer ${token}`},
            onmessage: callback
        })
    }

    static async deleteByyId(fileId) {
        let token = await TokenService.getAccessToken()
        await axios.delete(`${process.env.REACT_APP_GEOCODING_URL}/geocoding/${fileId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}