import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#2e7d5b' },
        secondary: { main: '#5c6bc0' },
        background: { default: '#f4f6f5', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#66c29a' },
        secondary: { main: '#9fa8da' },
        background: { default: '#101412', paper: '#181d1b' },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'outlined' },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
  },
})
