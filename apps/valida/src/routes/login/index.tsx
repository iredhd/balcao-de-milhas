import { SignInSchema } from '@balcao-de-milhas/validations';
import { useTheme } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Loader, Typography } from '../../components';
import { useAPI } from '../../hooks';

export function Login() {
    const theme = useTheme()
    const navigate = useNavigate()

    const [login, loginAction] = useAPI({
        url: '/auth/signin',
        method: 'POST'
    }, {
        manual: true
    })
    const authFormik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: SignInSchema,
        validateOnMount: true,
        onSubmit: async values => {
            const {data} = await loginAction({
                data: values
            })

            if (data?.token) {
                window.localStorage.setItem('@balcao-de-milhas/token', data?.token)
                navigate('/admin')
            }
        }
    })

    if (login.loading) {
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
            <form onSubmit={authFormik.handleSubmit}>
                <Grid container gap={2}>
                <Grid item xs={12}>
                    <Typography variant='h4' color={theme.palette.primary.main}>
                        Painel Administrativo
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1' color={theme.palette.primary.main}>
                        Balcão de Milhas ®
                    </Typography>
                </Grid>
                    <Grid item xs={12}>
                    <Input 
                        label="Senha"
                        name="password"
                        type="password"
                        onChange={authFormik.handleChange}
                        onBlur={authFormik.handleBlur}
                        value={authFormik.values.password}
                        helperText={authFormik.touched.password && authFormik.errors.password}
                        error={!!authFormik.touched.password && !!authFormik.errors.password}
                    />
                    </Grid>
                    <Grid item xs={12} >
                        <Button type='submit' disabled={!authFormik.isValid}>
                            Entrar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    </Grid>
  );
}

export default memo(Login);
