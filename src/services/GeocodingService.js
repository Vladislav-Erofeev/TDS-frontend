import {TokenService} from "./TokenService";
import axios from "axios";

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
}