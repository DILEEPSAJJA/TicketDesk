import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
                secondary: { main: '#ec4899' },
                background: { default: '#0b0f19', paper: '#111827' },
                text: { primary: '#f3f4f6', secondary: '#9ca3af' },
              }
            : {
                primary: { main: '#4f46e5', light: '#6366f1', dark: '#3730a3' },
                secondary: { main: '#db2777' },
                background: { default: '#f8fafc', paper: '#ffffff' },
                text: { primary: '#1e293b', secondary: '#64748b' },
              }),
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
          h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
          h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
          h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
          h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
          h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
          h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 12,
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
