import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router";
import { Page } from './components/Page';
import TokenViewDashboard from './components/pages/Currency/CurrencyView';
import { ThemeProvider } from '@emotion/react';
import { createMuiTheme, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#D0D0D0',
          '&.Mui-checked': {
            color: '#848484',
            '& .MuiSvgIcon-root': {
              fill: 'white', // Color of the checkmark
            },
          },
        },
      },
    },
  },
});

root.render(
  <BrowserRouter>
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="currencies/:currencyId" element={<Page children={<TokenViewDashboard />} />} />
      </Routes>
    </React.StrictMode>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
