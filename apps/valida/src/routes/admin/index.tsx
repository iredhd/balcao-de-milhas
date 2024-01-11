import { SignInSchema } from '@balcao-de-milhas/validations';
import { Chip, useTheme } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Link, Loader, Table, Typography } from '../../components';
import { useAPI } from '../../hooks';
import moment from 'moment'
import {formatCPF, formatDateTime, STATUS_OPTIONS, getVerificationStatusColor} from '@balcao-de-milhas/utils'

export function Admin() {
    const theme = useTheme()

    const [verifications] = useAPI('/buyer-verification')

    if (verifications.loading) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Loader />
            </div>
        )
    }

  return (
    <Grid container textAlign="center" height="100vh" justifyContent="center" alignItems="center">
        <Grid item xs={10}>
                <Grid container gap={2}>
                <Grid item xs={12}>
                    <Typography variant='h4' color={theme.palette.primary.main}>
                        Balcão de Milhas ®
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Table 
                        columns={[{ field: 'id', headerName: 'ID', width: 50 },
                        { field: 'created_at', headerName: 'Data de Cadastro', flex: 1, valueFormatter: ({value}) => {
                            return formatDateTime(value)
                        } },    
                        { field: 'external_id', headerName: 'IdWall ID', flex: 1 },
                        { field: 'transaction', headerName: 'HP', flex: 1, valueGetter: ({row}) => {
                            return row.buyer.orders.map(({transaction}: {transaction: string}) => transaction).join(', ')
                        } },
                        { field: 'buyer.name', headerName: 'Nome', flex: 1, valueGetter: ({row}) => row.buyer.name},
                        { field: 'buyer.email', headerName: 'E-mail', flex: 1, valueGetter: ({row}) => row.buyer.email, renderCell: ({value}) => (
                            <Link href={`mailto:${value}`}>{value}</Link>
                        )},
                        { field: 'buyer.document', headerName: 'CPF', flex: 1, valueGetter: ({row}) => row.buyer.document, valueFormatter: ({value}) => {
                            return formatCPF(value)
                        }},
                        { field: 'status', headerName: 'Status', flex: 1, valueFormatter: ({value}) => STATUS_OPTIONS.find(item => item.value === value)?.label,
                        renderCell: ({ formattedValue, row }) => {
                            return (
                                <Chip color={getVerificationStatusColor(row.status)} label={formattedValue} />
                            )
                        }, }
                        ]}
                        rows={(verifications.data || [])}
                    />
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  );
}

export default memo(Admin);
