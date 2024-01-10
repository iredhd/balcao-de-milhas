import { TextFieldProps } from '@mui/material'
import MuiAutocomplete from '@mui/material/Autocomplete'
import { SyntheticEvent } from 'react'
import { Input } from '../Input'

interface Option {
    label: string
    value: string | number
}

type AutocompleteProps = Omit<TextFieldProps, "onChange"> & {
    options: Option[]
    label: string
    value?: Option
    onChange: (value: Option) => void
    disabled?: boolean
} 

export const Autocomplete = ({options, label, onChange, value, onBlur, helperText, error, disabled }: AutocompleteProps) => {
    return (
        <MuiAutocomplete
            disablePortal
            options={options}
            disabled={disabled}
            fullWidth
            value={value}
            onChange={(_, newValue) => {
                onChange(newValue)
            }}
            disableClearable
            renderInput={(params) => <Input 
                {...params} 
                onBlur={onBlur}
                helperText={helperText}
                error={error}
                label={label} 
            />}
        />
    )
}