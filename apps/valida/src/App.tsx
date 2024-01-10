import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components';
import Router from './routes';
import { SnackbarProvider } from 'notistack'

function App() {
  return (
    <SnackbarProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
