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

export const formatCPF = (value: string) => {
    return value.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const getVerificationStatusLabel = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'Pendente'
        case 'APPROVED':
            return 'Aprovado'
        case 'COMPLETED':
            return 'Completo'
        case 'DENIED':
            return 'Recusado'
        case 'WAITING_MANUAL_ACTION':
            return 'Aguardando Validação Manual'
        default:
            return ''
    }
}

export const getVerificationStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'warning'
        case 'APPROVED':
            return 'success'
        case 'COMPLETED':
            return 'info'
        case 'DENIED':
            return 'error'
        case 'WAITING_MANUAL_ACTION':
            return 'warning'
        default:
            return undefined
    }
}

export const STATUS_OPTIONS = [
    { value: 'PENDING', label: getVerificationStatusLabel('PENDING') },
    { value: 'COMPLETED', label: getVerificationStatusLabel('COMPLETED') },
    { value: 'DENIED', label: getVerificationStatusLabel('DENIED') },
    { value: 'APPROVED', label: getVerificationStatusLabel('APPROVED') },
    { value: 'WAITING_MANUAL_ACTION', label: getVerificationStatusLabel('WAITING_MANUAL_ACTION') },
]