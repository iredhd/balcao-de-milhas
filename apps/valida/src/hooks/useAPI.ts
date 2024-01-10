import useAxiosHook, { Options } from 'axios-hooks'
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { configure } from 'axios-hooks';
import Axios, { AxiosError } from 'axios' 
import { enqueueSnackbar } from 'notistack';

const API = Axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`
})

// API.interceptors.request.use((config) => {
    // const token = window.localStorage.getItem('@milestrack/token')

    // if (token) {
    //     (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
    // }

    // return config 
// })

API.interceptors.response.use(success => success, (error: AxiosError<{ message?: string }>) => {
    if ([403, 409].includes(error.response?.status as number)) {
        enqueueSnackbar(error.response?.data.message || 'Erro interno! Entre em contato com o administrador do sistema', {
            variant: 'error'
        })
        
        return Promise.resolve(error)
    }

    return Promise.reject(error)
})

configure({ axios: API, defaultOptions: {
  autoCancel: false
}})

export const useAPI = (params: string | AxiosRequestConfig, options?: Options) => { 
    const config: AxiosRequestConfig = useMemo(() => {
        let newConfig: AxiosRequestConfig = {}

        if (typeof params === "string") {
            newConfig.url = params
        } else {
            newConfig = {
                ...params,
            }
        }

        return {
            ...newConfig
        }
    }, [params])

    return useAxiosHook(config, options)
}