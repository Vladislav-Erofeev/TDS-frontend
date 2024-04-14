import axios from "axios";

export class LayerService{
    static async getAll() {
        let res = await axios.get(`${process.env.REACT_APP_CLASSIFIER}/layers`)
        return res.data
    }

    static async addLayer(layer) {
        let res = await axios.post(`${process.env.REACT_APP_CLASSIFIER}/layers`, layer)
        return res.data
    }

    static async deleteLayer(id) {
        await axios.delete(`${process.env.REACT_APP_CLASSIFIER}/layers/${id}`)
    }

    static async getLayerById(id) {
        let res = await axios.get(`${process.env.REACT_APP_CLASSIFIER}/layers/${id}`)
        return res.data
    }
}