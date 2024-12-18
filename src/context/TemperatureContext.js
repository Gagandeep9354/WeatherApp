import React, { createContext, useState, useContext } from 'react';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperatureUnit = (unit) => {
    setIsCelsius(!isCelsius);
  };

  return (
    <TemperatureContext.Provider value={{ isCelsius, toggleTemperatureUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};


export const useTemperature = () => {
  return useContext(TemperatureContext);
};
