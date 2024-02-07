import { SearchOrderValidationSchema, UpdateBuyerValidationSchema } from '@balcao-de-milhas/validations';
import { useTheme } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Loader, Typography } from '../../components';
import { useAPI } from '../../hooks';

export function ThankYou() {
    const theme = useTheme()

  return (
    <Grid container textAlign="center" height="100vh" justifyContent="center" alignItems="center">
        <Grid item xs={10} sm={8} md={4}>
            <Grid container gap={2}>
                <Grid item xs={12}>
                    <Typography variant='h4' color={theme.palette.primary.main}>
                        Muito obrigado!
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1' color={theme.palette.primary.main}>
                        Seus dados serão analisados e você receberá o resultado em breve.
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  );
}

export default memo(ThankYou);
