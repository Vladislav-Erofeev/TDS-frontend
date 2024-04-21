import axios from "axios";

export class TokenService {
    static async getAccessToken() {
        if (Math.round(Date.now() / 1000) >= localStorage.getItem('expires')) {
            return await this.refresh()
        }
        return localStorage.getItem('token')
    }

    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        localStorage.removeItem('expires')
        document.location.replace(`${process.env.REACT_APP_SSO_URL}/logout`)
    }

    static async login(code) {
        let res = await axios.post(`${process.env.REACT_APP_AUTH_URL}/oauth2/token`, null, {
            params: {
                "grant_type": 'authorization_code',
                'code': code
            },
            headers: {
                Authorization: `Basic ${btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)}`
            }
        })
        localStorage.setItem('expires', Math.floor(Date.now() / 1000) + res.data.expires_in)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('refresh', res.data.refresh_token)
    }

    static async refresh() {
        let res = await axios.post(`${process.env.REACT_APP_AUTH_URL}/oauth2/token`, null, {
            params: {
                "grant_type": 'refresh_token',
                'refresh_token': localStorage.getItem('refresh')
            },
            headers: {
                Authorization: `Basic ${btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)}`
            }
        })
        let expires = Math.floor(Date.now() / 1000) + res.data.expires_in
        if (expires > localStorage.getItem('expires')) {
            localStorage.setItem('token', res.data.access_token)
            localStorage.setItem('refresh', res.data.refresh_token)
            localStorage.setItem('expires', expires)
            return res.data.access_token
        } else {
            return localStorage.getItem('token')
        }
    }
}
