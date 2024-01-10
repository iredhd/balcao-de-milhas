import { SearchOrderValidationSchema, UpdateBuyerValidationSchema } from '@balcao-de-milhas/validations';
import { useTheme } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Loader, Typography } from '../../components';
import { useAPI } from '../../hooks';

export function Home() {
    const theme = useTheme()
    const navigate = useNavigate()

    const [searchedOrder, searchOrder] = useAPI({
        url: '/order/search',
        method: 'GET'
    }, {
        manual: true
    })

    const [updatedBuyer, updateBuyer] = useAPI({
        url: '/buyer',
        method: 'PUT'
    }, {
        manual: true
    })

    const hpFormik = useFormik({
        initialValues: {
            transaction: ''
        },
        validationSchema: SearchOrderValidationSchema,
        validateOnMount: true,
        onSubmit: values => {
            searchOrder({
                params: values
            })
        }
    })
    
    const buyerFormik = useFormik({
        initialValues: {
            name: '',
            email: '',
            document: ''
        },
        validationSchema: UpdateBuyerValidationSchema,
        validateOnMount: true,
        onSubmit: async values => {
            const { data, status } = await updateBuyer({
                url: `/buyer`,
                params: {
                    external_id: searchedOrder.data.buyer.external_id,
                },
                data: values
            })

            if (status === HttpStatusCode.Accepted) {
                enqueueSnackbar('Dados atualizados com sucesso!', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    onClose: (reason) => {
                        navigate(`/validacao?token=${data.token}`)
                    }
                })
            }
        }
    })

    useEffect(() => {
        if (searchedOrder.data) {
            buyerFormik.resetForm({
                values: {
                    name: searchedOrder.data.buyer.name,
                    document: searchedOrder.data.buyer.document,
                    email: searchedOrder.data.buyer.email
                },
            })
        }
    }, [searchedOrder])

    if (searchedOrder.loading || updatedBuyer.loading) {
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
        <Grid item xs={10} sm={8} md={4}>
            {!searchedOrder.data ? (<form onSubmit={hpFormik.handleSubmit}>
                <Grid container gap={2}>
                <Grid item xs={12}>
                    <Typography variant='h4' color={theme.palette.primary.main}>
                        Validação Balcão de Milhas ®
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1' color={theme.palette.primary.main}>
                        Digite o HP da sua compra para iniciar a validação ou consultar o status.
                    </Typography>
                </Grid>
                    <Grid item xs={12}>
                    <Input 
                        label="HP"
                        name="transaction"
                        onChange={hpFormik.handleChange}
                        onBlur={hpFormik.handleBlur}
                        value={hpFormik.values.transaction}
                        helperText={hpFormik.touched.transaction && hpFormik.errors.transaction}
                        error={!!hpFormik.touched.transaction && !!hpFormik.errors.transaction}
                    />
                    </Grid>
                    <Grid item xs={12} >
                        <Button type='submit' disabled={!hpFormik.isValid}>
                            Buscar
                        </Button>
                    </Grid>
                </Grid>
            </form>) : (
                <form onSubmit={buyerFormik.handleSubmit}>
                <Grid container gap={2}>
                <Grid item xs={12}>
                    <Typography variant='h4' color={theme.palette.primary.main}>
                        Validação Balcão de Milhas ®
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1' color={theme.palette.primary.main}>
                        Confirme seus dados para seguir na verificação.
                    </Typography>
                </Grid>
                    <Grid item xs={12}>
                        <Input 
                            label="Nome"
                            name="name"
                            onChange={buyerFormik.handleChange}
                            onBlur={buyerFormik.handleBlur}
                            value={buyerFormik.values.name}
                            helperText={buyerFormik.touched.name && buyerFormik.errors.name}
                            error={!!buyerFormik.touched.name && !!buyerFormik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input 
                            label="E-mail"
                            name="email"
                            onChange={buyerFormik.handleChange}
                            onBlur={buyerFormik.handleBlur}
                            value={buyerFormik.values.email}
                            helperText={buyerFormik.touched.email && buyerFormik.errors.email}
                            error={!!buyerFormik.touched.email && !!buyerFormik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input 
                            label="CPF"
                            name="document"
                            onChange={(event) => {
                                buyerFormik.setFieldValue('document', event.target.value.replace(/\D/g, '')
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                                .replace(/(-\d{2})\d+?$/, '$1'))
                            }}
                            onBlur={buyerFormik.handleBlur}
                            value={buyerFormik.values.document}
                            helperText={buyerFormik.touched.document && buyerFormik.errors.document}
                            error={!!buyerFormik.touched.document && !!buyerFormik.errors.document}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Button type='submit' disabled={!buyerFormik.isValid}>
                            Confirmar
                        </Button>
                    </Grid>
                </Grid>
            </form>
            )}
        </Grid>
    </Grid>
  );
}

export default memo(Home);
