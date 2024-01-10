import { DateTimePicker as MuiDateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { Moment } from 'moment';

export const DateTimePicker = (props: DateTimePickerProps<Moment>) => {
    return <MuiDateTimePicker sx={{ width: '100%' }} {...props}  />
}