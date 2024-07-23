// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/api";

const AuthContext = createContext();

export const AuthProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (token) => {
    if (!token) {
      console.error("Token no proporcionado");
      return;
    }
    
    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };
  
  

  const login = async (accessToken, refreshToken) => {
     
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setRefreshToken(refreshToken);
    await fetchUserData(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };


  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh_access_token`, { // Usa la URL relativa
        token: refreshToken, // Asegúrate de que esto coincida con lo que espera el backend
      });
      if (response.data.accessToken) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('token', newAccessToken);
        setToken(newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  };
  

  useEffect(() => {
    if (token) {
      const interval = setInterval(async () => {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Error in interval token refresh:", error);
        }
      }, 15 * 60 * 1000); // Refresh token every 15 minutes
      return () => clearInterval(interval);
    }
  }, [token, refreshToken]);
  

  const data = {
    accessToken: token,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

// Export the AuthContext
export { AuthContext };

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
