import { formatCPF, STATUS_OPTIONS, formatCEP } from '@balcao-de-milhas/utils';
import { SearchOrderValidationSchema, UpdateBuyerValidationSchema } from '@balcao-de-milhas/validations';
import { useTheme } from '@mui/material';
import { HttpStatusCode } from 'axios';
import useAxios from 'axios-hooks';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { Fragment, memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Button, Grid, Input, Loader, PhoneInput, Typography } from '../../components';
import { useAPI, useQuery } from '../../hooks';

export function Home() {
    const theme = useTheme()
    const navigate = useNavigate()
    const query = useQuery()

    const [countries] = useAxios('https://restcountries.com/v3.1/all')

    const COUNTRY_OPTIONS: {label: string, value: string}[] = useMemo(() => {
        return (countries.data || []).map((item: { cca2: string, translations: { por: { common: string }}, name: { common: string } }): {value: string, label: string} => ({
            value: item.cca2,
            label: item.translations.por.common || item.name.common
        }))
    }, [countries.data])

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
            document: '',
            address_cep: '',
            address_street: '',
            address_number: '',
            address_neighborhood: '',
            address_complement: '',
            address_city: '',
            address_state: '',
            address_country: 'BR',
            phone_number: ''
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
                navigate(`/validacao?token=${data.token}`)

                enqueueSnackbar('Dados atualizados com sucesso!', {
                    variant: 'success',
                })
            }
        }
    })

    useEffect(() => {
        const transaction = query.get('transaction')

        if (transaction) {
            hpFormik.resetForm({
                values: {
                    transaction
                },

            })
        }
    }, [query])

    useEffect(() => {
        if (searchedOrder.data) {
            buyerFormik.resetForm({
                values: {
                    ...searchedOrder.data.buyer,
                    document: formatCPF(searchedOrder.data.buyer.document || ''),
                    address_cep: formatCEP(searchedOrder.data.buyer.address_cep || ''),
                    address_complement: searchedOrder.data.buyer.address_complement || '',
                    name: searchedOrder.data.buyer.name,
                },
            })
        }
    }, [searchedOrder])

    const cleanCEP = buyerFormik.values.address_cep.replace(/\D/ig, '')
    const country = buyerFormik.values.address_country

    const [cepSearch, searchCEP] = useAxios(`https://viacep.com.br/ws/${cleanCEP}/json/`, {
        manual: true
    })
    useEffect(() => {
        if (cleanCEP.length === 8 && country === 'BR') {
            searchCEP()
        }
    }, [cleanCEP, searchCEP, country])

    useEffect(() => {
        if (cepSearch.data && !cepSearch.loading && !cepSearch.error) {
            buyerFormik.setFieldValue('address_street', cepSearch.data.logradouro || '')
            buyerFormik.setFieldValue('address_city', cepSearch.data.localidade || '')
            buyerFormik.setFieldValue('address_state', cepSearch.data.uf || '')
            buyerFormik.setFieldValue('address_neighborhood', cepSearch.data.bairro || '')
        }
    }, [cepSearch.data])

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
        <Grid item xs={10} sm={8} md={4} pt={6} pb={6}>
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
                            disabled
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
                            disabled
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
                            disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
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
                    <Grid item xs={12}> 
                        <PhoneInput
                            label="Telefone do Titular"
                            inputProps={{
                                name: 'phone_number'
                            }}
                            onChange={value => {
                                buyerFormik.setFieldValue('phone_number', value, true)
                            }}
                            disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                            value={buyerFormik.values.phone_number}
                            onBlur={buyerFormik.handleBlur}
                            error={!!buyerFormik.touched.phone_number && !!buyerFormik.errors.phone_number}
                        />
                    </Grid>
                    <Grid item xs={12}> 
                        <Autocomplete
                            label="País"
                            disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                            onChange={({value}) => {
                                buyerFormik.resetForm({
                                    values: {
                                        ...buyerFormik.values,
                                        address_cep: '',
                                        address_city: '',
                                        address_complement: '',
                                        address_neighborhood: '',
                                        address_number: '',
                                        address_state: '',
                                        address_street: '',
                                        address_country: value as string
                                    },
                                })
                            }}
                            options={COUNTRY_OPTIONS}
                            onBlur={buyerFormik.handleBlur}
                            value={COUNTRY_OPTIONS.find(item => item.value === buyerFormik.values.address_country)}
                            helperText={buyerFormik.touched.address_country && buyerFormik.errors.address_country}
                            error={!!buyerFormik.touched.address_country && !!buyerFormik.errors.address_country}
                        />
                    </Grid>
                        {buyerFormik.values.address_country && (
                        <Fragment>
                            {buyerFormik.values.address_country === 'BR' && (
                            <Grid item xs={12}> 
                                <Input 
                                    label="CEP"
                                    name="address_cep"
                                    onChange={(event) => {
                                        buyerFormik.setFieldValue('address_cep', formatCEP(event.target.value).slice(0, 9))
                                    }}
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onBlur={buyerFormik.handleBlur}
                                    value={buyerFormik.values.address_cep}
                                    helperText={buyerFormik.touched.address_cep && buyerFormik.errors.address_cep}
                                    error={!!buyerFormik.touched.address_cep && !!buyerFormik.errors.address_cep}
                                />
                            </Grid>)}
                            <Grid item xs={12}> 
                                <Input 
                                    label="Logradouro"
                                    name="address_street"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    value={buyerFormik.values.address_street}
                                    helperText={buyerFormik.touched.address_street && buyerFormik.errors.address_street}
                                    onBlur={buyerFormik.handleBlur}
                                    error={!!buyerFormik.touched.address_street && !!buyerFormik.errors.address_street}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="Número"
                                    name="address_number"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    value={buyerFormik.values.address_number}
                                    helperText={buyerFormik.touched.address_number && buyerFormik.errors.address_number}
                                    onBlur={buyerFormik.handleBlur}
                                    error={!!buyerFormik.touched.address_number && !!buyerFormik.errors.address_number}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="Complemento"
                                    name="address_complement"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    value={buyerFormik.values.address_complement}
                                    helperText={buyerFormik.touched.address_complement && buyerFormik.errors.address_complement}
                                    onBlur={buyerFormik.handleBlur}
                                    error={!!buyerFormik.touched.address_complement && !!buyerFormik.errors.address_complement}
                                />
                            </Grid>
                            {buyerFormik.values.address_country !== 'BR' && (<Grid item xs={12}> 
                                <Input 
                                    label="Código Postal"
                                    name="address_cep"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    onBlur={buyerFormik.handleBlur}
                                    value={buyerFormik.values.address_cep}
                                    helperText={buyerFormik.touched.address_cep && buyerFormik.errors.address_cep}
                                    error={!!buyerFormik.touched.address_cep && !!buyerFormik.errors.address_cep}
                                />
                            </Grid>)}
                            <Grid item xs={12}>
                                <Input 
                                    label="Bairro"
                                    name="address_neighborhood"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    value={buyerFormik.values.address_neighborhood}
                                    helperText={buyerFormik.touched.address_neighborhood && buyerFormik.errors.address_neighborhood}
                                    onBlur={buyerFormik.handleBlur}
                                    error={!!buyerFormik.touched.address_neighborhood && !!buyerFormik.errors.address_neighborhood}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="Cidade"
                                    name="address_city"
                                    disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                    onChange={buyerFormik.handleChange}
                                    value={buyerFormik.values.address_city}
                                    helperText={buyerFormik.touched.address_city && buyerFormik.errors.address_city}
                                    onBlur={buyerFormik.handleBlur}
                                    error={!!buyerFormik.touched.address_city && !!buyerFormik.errors.address_city}
                                />
                            </Grid>
                        <Grid item xs={12}>
                            <Input 
                                label="Estado"
                                name="address_state"
                                disabled={searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}
                                onChange={(event) => { 
                                    buyerFormik.setFieldValue('address_state', event.target.value.replace(/[^a-zA-z]/ig, '').toLocaleUpperCase().substring(0, 2), true)
                                }}
                                value={buyerFormik.values.address_state}
                                helperText={buyerFormik.touched.address_state && buyerFormik.errors.address_state}
                                onBlur={buyerFormik.handleBlur}
                                error={!!buyerFormik.touched.address_state && !!buyerFormik.errors.address_state}
                            />
                        </Grid>
                        </Fragment>
                        )}
                    {searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING' ? (<Grid item xs={12} textAlign="left">
                        <Alert color='info' icon={false}>
                            <strong>Validação {['COMPLETED', 'WAITING_MANUAL_ACTION'].includes(searchedOrder.data?.buyer.buyer_verification.status) ? ' em andamento' : 'finalizada'}!</strong>
                            <br /><br />
                            <strong>Status:</strong> {STATUS_OPTIONS.find(item => item.value === searchedOrder.data?.buyer.buyer_verification.status)?.label}
                            
                            {searchedOrder.data?.buyer.buyer_verification.status === 'COMPLETED' && (
                                <Fragment>
                                <br /><br />
                            <span style={{
                                fontStyle: 'italic'
                            }}>Você receberá o resultado por e-mail e o status será <strong>APROVADO</strong> ou <strong>RECUSADO</strong>.</span>
                            </Fragment>)}
                        </Alert>
                    </Grid>) : (
                    <Grid item xs={12} >
                        <Button type='submit' disabled={!buyerFormik.isValid || searchedOrder.data?.buyer.buyer_verification.status !== 'PENDING'}>
                            Confirmar
                        </Button>
                    </Grid>)}
                </Grid>
            </form>
            )}
        </Grid>
    </Grid>
  );
}

export default memo(Home);
