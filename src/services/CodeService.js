import axios from "axios";

export class CodeService {
    static async saveCode(code) {
        let res = await axios.post(`${process.env.REACT_APP_CLASSIFIER}/codes`, code)
        return res.data
    }

    static async deleteCode(id) {
        await axios.delete(`${process.env.REACT_APP_CLASSIFIER}/codes/${id}`)
    }
}