import * as Yup from 'yup'

export const INTERNAL_ERROR = 'Erro interno. Por favor, entre em contato com o suporte.'

export const CreateDeviceValidationSchema = Yup.object({
    build_id: Yup.string().required(),
    device_info: Yup.mixed().required(),
    push_token: Yup.string().nullable().required()
})