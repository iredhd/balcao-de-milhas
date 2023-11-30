import useAxiosHook, { Options } from 'axios-hooks'
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { configure } from 'axios-hooks';
// import { enqueueSnackbar } from 'notistack';
import Axios, { AxiosError, AxiosHeaders } from 'axios' 

const API = Axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}`
})

API.interceptors.response.use(success => success, (error: AxiosError<{ message?: string }>) => {
    if ([403, 409].includes(error.response?.status as number)) {
        // enqueueSnackbar(error.response?.data.message || 'Erro interno! Entre em contato com o administrador do sistema', {
        //     variant: 'error'
        // })
        
        return Promise.resolve(error)
    }

    // if (error.response?.status === 401) {
    //     // window?.localStorage?.removeItem('@balcao-de-milhas/token')
        
    //     // if (window.location.pathname !== '/' && window.location.pathname !== '/cadastro' && window.location.pathname !== '/esqueci-minha-senha' && window.location.pathname !== '/nova-senha') {
    //     //     window.location.href = '/'
    //     // }
    // }

    return Promise.reject(error)
})
console.log(API)
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