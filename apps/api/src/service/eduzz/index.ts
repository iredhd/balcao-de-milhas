import Axios from 'axios'

export const EDUZZ_API = Axios.create({
    baseURL: `https://api2.eduzz.com`
})

// @ts-ignore
EDUZZ_API.interceptors.request.use(async config => {
    const { data } = await Axios.post(`https://api2.eduzz.com/credential/generate_token`, {
        publickey: process.env.EDUZZ_PUBLIC_KEY,
        email: 'contato@estevampelomundo.com.br',
        apikey: process.env.EDUZZ_API_KEY
    })

    return {
        ...config,
        headers: {
            ...config.headers,
            token: `${data.data.token}`
        }
    }
})
