import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router";
import { Page } from './components/Page';
import TokenViewDashboard from './components/pages/Currency/CurrencyView';
import { ThemeProvider } from '@emotion/react';
import { createMuiTheme, createTheme, darkScrollbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { SuperchartTab } from './components/pages/Currency/Tabs/SuperchartTab/SuperchartTab';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  components: {
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       color: 'white',
    //     },
    //   },
    // },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#181818',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#2A2A2A",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          // borderBottomRightRadius: "4px",
          '--TextField-brandBorderColor': '#49454F',
          '--TextField-brandBorderHoverColor': '#49454F',
          '--TextField-brandBorderFocusedColor': 'white',
          '& label': {
            color: '#CDCDCD',
          },
          '& label.Mui-focused': {
            color: '#CDCDCD',
          },
          color: "white",
          '& .MuiInputBase-input': {
            color: 'white',
          },
          '& input:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #2A2A2A inset',
            '-webkit-text-fill-color': 'white',
            'caret-color': 'white',
          },
          '& input:-webkit-autofill:focus': {
            '-webkit-box-shadow': '0 0 0 100px #2A2A2A inset',
            '-webkit-text-fill-color': 'white',
            'caret-color': 'white',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'var(--TextField-brandBorderColor)',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderHoverColor)',
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderFocusedColor)',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
          '& input:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #2A2A2A inset',
            '-webkit-text-fill-color': 'white',
            'caret-color': 'white',
          },
          '& input:-webkit-autofill:focus': {
            '-webkit-box-shadow': '0 0 0 100px #2A2A2A inset',
            '-webkit-text-fill-color': 'white',
            'caret-color': 'white',
          },
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          'svg': {

            fill: "white",
          }
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            borderBottom: '1px solid var(--TextField-brandBorderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '1px solid var(--TextField-brandBorderHoverColor)',
          },
          '&.Mui-focused:after': {
            borderBottom: '1px solid var(--TextField-brandBorderFocusedColor)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottom: '1px solid var(--TextField-brandBorderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '1px solid var(--TextField-brandBorderHoverColor)',
          },
          '&.Mui-focused:after': {
            borderBottom: '1px solid var(--TextField-brandBorderFocusedColor)',
          },
        },
      },
    },
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
  }
});

root.render(
  <BrowserRouter>
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="currencies/:currencyId" element={<Page children={<TokenViewDashboard />} />} />
        <Route path="superchart/:currencyId" element={<div style={{height: "100vh"}}><SuperchartTab fullscreen={true} /></div>} />
      </Routes>
    </React.StrictMode>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
