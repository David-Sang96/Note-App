/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const initialToken = JSON.parse(localStorage.getItem("token")) || null;
  const [token, setToken] = useState(initialToken);

  const updateToken = (jwtToken) => {
    const token = JSON.stringify(jwtToken);
    localStorage.setItem("token", token);
    setToken(jwtToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <UserContext.Provider value={{ token, updateToken }}>
      {children}
    </UserContext.Provider>
  );
};
