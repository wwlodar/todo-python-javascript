import { useContext, createContext } from "react";
import {fastapiclient} from '../client'
import {useState} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";


const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const loginAction = (response) => {
    try {
      if (response.data) {
        setUser(response.data.user);
        setToken(response.token);
        localStorage.setItem("token", response.token);
        return;
      }

      } catch (err) {
        console.error(err);
      }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};