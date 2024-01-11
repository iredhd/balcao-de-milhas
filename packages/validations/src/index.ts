import * as Yup from 'yup'

export const INTERNAL_ERROR = 'Erro interno. Por favor, entre em contato com o suporte.'
export const MUST_BE_VALID_HP = 'Este campo deve ser um HP válido'
export const MUST_BE_VALID_EMAIL = 'Este campo deve ser um e-mail válido'
export const REQUIRED_FIELD = 'Este campo é obrigatório'

export const CreateDeviceValidationSchema = Yup.object({
    build_id: Yup.string().required(),
    device_info: Yup.mixed().required(),
    push_token: Yup.string().nullable().required()
})

export const SearchOrderValidationSchema = Yup.object({
    transaction: Yup.string().test({
        test: value => {
            const hasHP = value?.trim().startsWith('HP')

            if (!hasHP) {
                return false
            }

            const hasNumbers = value?.trim().replace(/\D/ig, '')

            if (!hasNumbers?.length) {
                return false
            }

            return true
        },
        message: MUST_BE_VALID_HP
    }).required(REQUIRED_FIELD)
})

export const UpdateBuyerValidationSchema = Yup.object({
    name: Yup.string().required(REQUIRED_FIELD),
    email: Yup.string().email(MUST_BE_VALID_EMAIL).required(REQUIRED_FIELD),
    document: Yup.string().test({
        message: 'Deve ser um CPF válido',
        test: (value) => {
            const cpf = value?.replace(/[^\d]+/g,'') || ''	
            if (cpf == '') { 
                return false
            }
            
            if (cpf.length != 11 || 
                cpf == "00000000000" || 
                cpf == "11111111111" || 
                cpf == "22222222222" || 
                cpf == "33333333333" || 
                cpf == "44444444444" || 
                cpf == "55555555555" || 
                cpf == "66666666666" || 
                cpf == "77777777777" || 
                cpf == "88888888888" || 
                cpf == "99999999999")
                    return false;	
                    
            let add = 0;	
            for (let i=0; i < 9; i ++)		
                add += parseInt(cpf.charAt(i)) * (10 - i);	
                let rev = 11 - (add % 11);	
                if (rev == 10 || rev == 11)		
                    rev = 0;	
                if (rev != parseInt(cpf.charAt(9)))		
                    return false;
                    
            add = 0;	
            for (let i = 0; i < 10; i ++)		
                add += parseInt(cpf.charAt(i)) * (11 - i);	
            rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)	
                rev = 0;	
            if (rev != parseInt(cpf.charAt(10)))
                return false;		
            return true; 
        }
    }).required(REQUIRED_FIELD),
})

export const UpdateBuyerVerificationValidationSchema = Yup.object({
    external_id: Yup.string().required(REQUIRED_FIELD),
    token: Yup.string().required(REQUIRED_FIELD),
})

export const SignInSchema = Yup.object({
    password: Yup.string().required(REQUIRED_FIELD),
})