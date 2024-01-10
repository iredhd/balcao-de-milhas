import { MenuItem } from '@mui/material'
import TextField, {TextFieldProps} from '@mui/material/TextField'

type InputProps = TextFieldProps & {
    options?: {
        value: number | string
        label: string
    }[]
}

export const Input = (props: InputProps) => {
    if (props.select) {
        return <TextField fullWidth {...props}>
            {
                props.options?.map(option => {
                    return (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    )
                })
            }
        </TextField>
    }

    return <TextField fullWidth {...props} />
}