import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#22315C',
    },
    secondary: {
      main: '#C9962D',
    },
    background: {
      default: '#F6F5F1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Newsreader", serif' },
    h2: { fontFamily: '"Newsreader", serif' },
    h3: { fontFamily: '"Newsreader", serif' },
    h4: { fontFamily: '"Newsreader", serif' },
    h5: { fontFamily: '"Newsreader", serif' },
    h6: { fontFamily: '"Newsreader", serif' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#22315C',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          border: 'none',
          borderRadius: 16,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }
      },
    },
  },
});

export default theme;
