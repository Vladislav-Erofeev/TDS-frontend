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

    static async accessInvite(hash) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/projects/invite`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                token: hash
            }
        })

        return res.data
    }

    static async fetchMessages(projectId) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/messages/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    }

    static async getAllPersonsInProject(projectId) {
        let token = await TokenService.getAccessToken()
        let res = await axios.get(`${process.env.REACT_APP_PROJECTS_URL}/persons/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    }

    static async deletePersonProject(personId, projectId) {
        let token = await TokenService.getAccessToken()
        await axios.delete(`${process.env.REACT_APP_PROJECTS_URL}/persons/${personId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                projectId: projectId
            }
        })
    }
}