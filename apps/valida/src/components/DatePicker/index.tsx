import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Moment } from 'moment';

export const DatePicker = (props: DatePickerProps<Moment>) => {
    return <MuiDatePicker sx={{ width: '100%' }} {...props}  />
}