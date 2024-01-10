import { TextFieldProps } from '@mui/material'
import MuiAutocomplete, {AutocompleteProps} from '@mui/material/Autocomplete'
import { Input } from '../Input'
import Chip from '@mui/material/Chip'
import { uniq } from 'lodash'

export interface MultipleAutocompleteOption {
    label: string
    value: string | number
}

export const MultipleAutocomplete = ({options, label, onChange, value, onBlur, helperText, error, disabled }: Omit<AutocompleteProps<MultipleAutocompleteOption, true, false, false>, 'renderInput'> & Pick<TextFieldProps, 'onBlur'> & { label: string, helperText?: string | false, error?: boolean, onChange: (value: MultipleAutocompleteOption[]) => void }) => {
    return (
        <MuiAutocomplete
            multiple
            fullWidth
            value={value}
            onChange={(_, newValue) => {
                const payload = Array.isArray(newValue) ? [
                    ...(value || []),
                    ...newValue
                ] : [
                    ...(value || []),
                    newValue
                ]

                onChange(uniq(payload))
            }}
            options={options}
            getOptionLabel={(option) => option.label}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    onDelete={() => {
                        onChange(value?.filter(item => item.value !== option.value) || [])
                    }}
                />
                ))
            }
            clearIcon={false}
            renderInput={(params) => (
                <Input 
                    {...params} 
                    onBlur={onBlur}
                    helperText={helperText}
                    error={error}
                    label={label} 
                    fullWidth
                />
            )}
        />


        // <MuiAutocomplete
        //     disablePortal
        //     options={options}
        //     disabled={disabled}
        //     fullWidth
        //     value={value}
        //     onChange={(_, newValue) => {
        //         onChange(newValue)
        //     }}
        //     disableClearable
        //     renderInput={(params) => <Input 
        //         {...params} 
        //         onBlur={onBlur}
        //         helperText={helperText}
        //         error={error}
        //         label={label} 
        //     />}
        // />
    )
}