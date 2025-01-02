import React from 'react';
import { useContext, createContext } from "react";
import {useState} from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const loginAction = (response) => {
    console.log(response)
    try {
      if (response.access_token) {
        setToken(response.access_token);
        console.log(response.access_token)
        localStorage.setItem("token", response.access_token);
        return;
      }

      } catch (err) {
        console.error(err);
      }
  };

  const logOut = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};