import axios from "axios";

export class SearchService {
    static async search(query) {
        let res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: query,
                format: 'geojson'
            }
        })
        return res.data
    }

}