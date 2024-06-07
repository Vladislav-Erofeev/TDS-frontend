import axios from "axios";

export class SearchService {
    static async search(query) {
        let res = await axios.get(`http://localhost:8081/search`, {
            params: {
                query: query,
            }
        })
        return res.data
    }

    static async filterSearch(query, codes) {
        let res = await axios.get(`http://localhost:8081/search`, {
            params: {
                query: query,
                codes: codes.join(', ')
            }
        })
        return res.data
    }
}