import React, { createContext, useState, useContext } from 'react';


//Creating a hook function for changing themes

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  const toggleTheme = (newTheme) => {
    //setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    setTheme(newTheme)
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);