// Auth Context for managing authentication state
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import config from "../config";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(config.STORAGE_KEYS.USER);
    const isLoggedIn =
      localStorage.getItem(config.STORAGE_KEYS.LOGGED_IN) === "true";

    if (storedToken && storedUser && isLoggedIn) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);

      if (data.token && data.user) {
        // Save to localStorage
        localStorage.setItem(config.STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(
          config.STORAGE_KEYS.USER,
          JSON.stringify(data.user)
        );
        localStorage.setItem(config.STORAGE_KEYS.LOGGED_IN, "true");

        // Update state
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true, data };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);

      if (data.user) {
        return { success: true, data };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(config.STORAGE_KEYS.USER);
    localStorage.removeItem(config.STORAGE_KEYS.LOGGED_IN);
    localStorage.removeItem(config.STORAGE_KEYS.CART);

    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    authAPI.logout();
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
