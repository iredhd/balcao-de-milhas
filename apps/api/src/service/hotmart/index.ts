import Axios from 'axios'

export const HOTMART_API = Axios.create({
    baseURL: `https://developers.hotmart.com/payments/api/v1`
})

// @ts-ignore
HOTMART_API.interceptors.request.use(async config => {
    const { data } = await Axios.post(`https://api-sec-vlc.hotmart.com/security/oauth/token`, undefined, {
        headers: {
            Authorization: `Basic ${process.env.HOTMART_TOKEN}`
        },
        params: {
            grant_type: 'client_credentials',
            client_id: process.env.HOTMART_CLIENT_ID,
            client_secret: process.env.HOTMART_CLIENT_SECRET
        }
    })

    return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${data.access_token}`
        }
    }
})