import currency from 'currency.js'
import moment from 'moment'
export * from './airlines'

export const formatMoney = (value: number) => {
    return currency(value).format({
        symbol: 'R$ ',
        decimal: ',',
        separator: '.'
    })    
}

export const formatDate = (value: Date) => {
    return moment(value).format('DD/MM/YYYY')
}

export const formatDateTime = (value: Date) => {
    return moment(value).format('DD/MM/YYYY HH:mm:ss')
}

export const formatNumber = (value: number) => {
    return Number(value).toLocaleString('pt-BR')
}