import axios from "axios";

export class GeodataService {
    static async save(object) {
        await axios.post(`${process.env.REACT_APP_GEODATA_URL}/objects`, object)
    }
}