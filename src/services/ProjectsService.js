import axios from "axios";
import {TokenService} from "./TokenService";

export class ProjectsService {
    static async getAll() {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async save(project) {
        let token = await TokenService.getAccessToken()
        let res = await axios.post(`${process.env.REACT_APP_PROJECTS_URL}/projects`, project, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    }

    static async getById(id) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }

    static async deleteById(id) {
        let token = await TokenService.getAccessToken()
        await axios.delete(`${process.env.REACT_APP_PROJECTS_URL}/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async generateInviteToken(id) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/projects/${id}/invite_token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    }
}