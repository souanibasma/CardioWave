import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

const theme: any = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#f5f5f5',
    text: '#212529',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
  },
  spacing: (factor: number) => factor * 8,
};

const ThemeContext = createContext<any>(theme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={theme}>
    <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
  </ThemeContext.Provider>
);