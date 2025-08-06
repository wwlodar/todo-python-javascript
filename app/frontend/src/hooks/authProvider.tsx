import React, { useContext, createContext, useState } from "react";
import { useEffect } from "react";

// Define the context type
type AuthContextType = {
  token: string | null;
  loading: boolean;
  logIn: (token: string | LoginResponse) => void;
  logOut: () => void;
};

// Optional structure of a login response
interface LoginResponse {
  access_token?: string;
  [key: string]: any;
}

const defaultAuthContext: AuthContextType = {
  token: null,
  loading: true,
  logIn: () => {
    // no-op or throw error to warn about usage outside provider
    throw new Error("logIn called outside AuthProvider");
  },
  logOut: () => {
    throw new Error("logOut called outside AuthProvider");
  }
};
// Create the AuthContext
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// AuthProvider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const logIn = (tokenOrResponse: string | LoginResponse): void => {
    const accessToken = typeof tokenOrResponse === "string"
      ? tokenOrResponse
      : tokenOrResponse.access_token;

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
    }
  };

  const logOut = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  if (loading) {
    console.log("Auth is loading...");
  } else if (token) {
    console.log("Current token:", token);
  } else {
    console.log("No token found, user is logged out.");
  }

  const value: AuthContextType = { token, loading, logIn, logOut };
  if (token) {
    console.log("Current token:", token);
  } else {
    console.log("No token found, user is logged out.");
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;