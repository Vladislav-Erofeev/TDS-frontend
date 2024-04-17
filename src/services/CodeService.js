import axios from "axios";

export class CodeService {
    static async saveCode(code) {
        let res = await axios.post(`${process.env.REACT_APP_CLASSIFIER}/codes`, code)
        return res.data
    }

    static async deleteCode(id) {
        await axios.delete(`${process.env.REACT_APP_CLASSIFIER}/codes/${id}`)
    }

    static async getAll() {
        let res = await axios.get(`${process.env.REACT_APP_CLASSIFIER}/codes`)
        return res.data
    }
}