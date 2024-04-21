import axios from "axios";

export class AttributeService {
    static async getAll() {
        let res = await axios.get(`${process.env.REACT_APP_CLASSIFIER}/attributes`)
        return res.data
    }

    static async save(attribute) {
        let res = await axios.post(`${process.env.REACT_APP_CLASSIFIER}/attributes`, attribute)
        return res.data
    }
}