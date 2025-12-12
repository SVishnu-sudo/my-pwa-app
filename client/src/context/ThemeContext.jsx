import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = {
    light: {
      background: '#ffffff',
      text: '#333333',
      primary: '#008DD2', // Blue from Logo
      secondary: '#2CA048', // Green from Logo
      cardBg: '#f8f9fa',
      border: '#e0e0e0'
    },
    dark: {
      background: '#121212',
      text: '#ffffff',
      primary: '#008DD2', // Keep brand blue
      secondary: '#2CA048', // Keep brand green
      cardBg: '#1e1e1e',
      border: '#333333'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};
