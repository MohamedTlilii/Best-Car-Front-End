
import React, { useState, ReactNode, useEffect } from "react";

interface StoreContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export const StoreContext = React.createContext<StoreContextType>({
  isLoggedIn: false,
  setIsLoggedIn: (v) => {},
});

interface AppContextProps {
  children: ReactNode;
}

export const AppContext = ({ children }: AppContextProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <StoreContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </StoreContext.Provider>
  );
};
