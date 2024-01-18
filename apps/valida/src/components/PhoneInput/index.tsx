import pt from 'react-phone-input-material-ui/lang/pt.json'
import ReactPhoneInput, {PhoneInputProps} from 'react-phone-input-material-ui';
import { Input } from '../Input';

export const PhoneInput = (props: Omit<PhoneInputProps, 'component'> & { label: string, error?: boolean }) => {
    return (
        <ReactPhoneInput
            {...props}
            value={props.value}
            onChange={props.onChange} 
            component={Input}
            localization={pt}
            country="BR"
        />
    )
}
