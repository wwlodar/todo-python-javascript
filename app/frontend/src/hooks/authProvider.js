import { useContext, createContext } from "react";
import {fastapiclient} from '../client'
import {useState} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";


const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const loginAction = async (data) => {
    try {
      const response = fastapiclient.login(data.username, data.password)
      const res = await response.json();
      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        return data;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
      return data
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