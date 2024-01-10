import { Divider } from '@mui/material';
import MuiModal, {ModalProps} from '@mui/material/Modal';
import { Fragment } from 'react';
import { Button } from '../Button';
import { Paper } from '../Paper';
import { Typography } from '../Typography';

export const Modal = (props: ModalProps & {
    title?: string
    onConfirm?: () => void
    confirmLabel?: string
}) => {
    return (
        <MuiModal {...props}>
            <Paper sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: 24,     
            }}>
                {props.title ? (
                <Fragment>
                    <div style={{
                        padding: 15
                    }}>
                        <Typography variant="h6">
                            {props.title}
                        </Typography>
                    </div>
                <Divider />
                </Fragment>
                ) : null}
                <div style={{padding: 15}}>
                    {props.children}
                </div>
                {props.onConfirm ? (
                <Fragment>
                <Divider />
                    <div style={{
                        padding: 15,
                        textAlign: 'center'
                    }}>
                        <Button onClick={props.onConfirm}>{props.confirmLabel}</Button>
                    </div>
                </Fragment>
                ) : null}
            </Paper>
        </MuiModal>
    )
}