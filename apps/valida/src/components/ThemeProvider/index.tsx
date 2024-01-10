import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#ebebeb'
    },
    primary: {
      main: '#55bf0a'
    }
  },
})

export const ThemeProvider = ({children}: PropsWithChildren) => {
    return (
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    )
}