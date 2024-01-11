import Axios from 'axios'

export const IDWALL_API = Axios.create({
    baseURL: `https://api-v3.idwall.co/maestro`
})

// @ts-ignore
IDWALL_API.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: process.env.ID_WALL_API_TOKEN
        }
    }
})