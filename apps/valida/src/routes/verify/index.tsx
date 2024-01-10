import React, { memo, useEffect } from 'react';
import { Grid } from '../../components';

declare global {
  interface Window {
    idwSDKWeb: any
  }
}

let shouldRenderIdWall = true

export function Verify() {
  useEffect(() => {
    if (window.idwSDKWeb && shouldRenderIdWall) {
      window.idwSDKWeb({
        token: process.env.REACT_APP_IDWALL_SDK_TOKEN,
        onRender: () => {
          console.log('it renders!');
        },
        onComplete: ({ token }: any) => {
          console.log('SDK Token', token);
        },
        onError: (error: any) => {
          alert(error);
        }
      });

      shouldRenderIdWall = false
    }
  }, [])

  return (
    <Grid container height='100vh'>
      <Grid item xs={12} alignItems='center' justifyContent='center' display='flex'>
        <div data-idw-sdk-web></div>
      </Grid>
    </Grid>
  );
}

export default memo(Verify);
