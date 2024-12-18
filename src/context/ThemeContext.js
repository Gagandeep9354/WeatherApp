import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(Appearance.getColorScheme() === 'light');

  const toggleTheme = () => {
    setIsLightTheme(prevTheme => !prevTheme);
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsLightTheme(colorScheme === 'light');
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
