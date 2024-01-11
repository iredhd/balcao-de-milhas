import { enqueueSnackbar } from 'notistack';
import React, { memo, useEffect } from 'react';
import { Grid, Loader } from '../../components';
import { useAPI, useQuery } from '../../hooks';
import {HttpStatusCode} from 'axios'
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    idwSDKWeb: any
  }
}

let shouldRenderIdWall = true

export function Verify() {
  const search = useQuery()
  const navigate = useNavigate()
  
  const [updatedVerify, updateVerify] = useAPI({
    url: '/buyer-verification',
    method: 'PUT'
  }, {
    manual: true
  })

  useEffect(() => {
    if (window.idwSDKWeb && shouldRenderIdWall) {
      window.idwSDKWeb({
        token: process.env.REACT_APP_IDWALL_SDK_TOKEN,
        onComplete: async ({ token }: any) => {
          const { status } = await updateVerify({
            data: {
              token: search.get('token'),
              external_id: token
            }
          })

          if (status === HttpStatusCode.NoContent) {
            navigate('/obrigado')
            
            enqueueSnackbar('Validação concluída com sucesso!', {
              variant: 'success',
            })
          }
        },
        onError: () => {
          enqueueSnackbar('Erro interno, entre em contato com administrador do sistema!', {
            variant: 'error'
          })
        }
      });

      shouldRenderIdWall = false
    }
  }, [search, updateVerify])

  if (updatedVerify.loading) {
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
    <Grid container height='100vh'>
      <Grid item xs={12} alignItems='center' justifyContent='center' display='flex'>
        <div data-idw-sdk-web></div>
      </Grid>
    </Grid>
  );
}

export default memo(Verify);
