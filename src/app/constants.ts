import { createTheme } from '@mui/material/styles';

export const API_BASE = window.location.href.indexOf('://localhost') > 0 ? `http://localhost:8080/` : `https://api.rathnas.com/`

const theme = createTheme({
  palette: {
    primary: {
      main: '#d96c0e',
    },
    secondary: {
      main: '#16968d',
    },
  },
})