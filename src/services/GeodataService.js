import axios from "axios";
import {TokenService} from "./TokenService";

export class GeodataService {
    static async save(object) {
        let token = await TokenService.getAccessToken()
        await axios.post(`${process.env.REACT_APP_GEODATA_URL}/objects`, object, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async getAll() {
        let res = await axios.get(`${process.env.REACT_APP_GEODATA_URL}/objects`)
        return res.data
    }
}