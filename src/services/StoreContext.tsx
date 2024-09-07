import React, { useState, ReactNode } from "react";

// Define the type for the context value
interface StoreContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  
}

// Create the context with the default value as undefined
export const StoreContext = React.createContext<StoreContextType>({
  isLoggedIn: false,
  setIsLoggedIn: (v)=> {
    
  }
});

interface AppContextProps {
  children: ReactNode;
}

export const AppContext = ({ children }: AppContextProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <StoreContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </StoreContext.Provider>
  );
};
