import React, { createContext, useState, useCallback } from "react";
import { authService } from "../services/api.service.js";

/**
 * AuthContext - Global authentication state
 * Provides: user, loading, error, login, register, logout
 */
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password, role });

      // Save to localStorage
      if (response.token) localStorage.setItem("token", response.token);
      if (response.id) localStorage.setItem("userId", response.id);
      if (response.name) localStorage.setItem("userName", response.name);
      if (response.role) localStorage.setItem("userRole", response.role);

      setUser({
        id: response.id,
        name: response.name,
        email: email,
        role: response.role,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register handler
   */
  const register = useCallback(async (name, email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({ name, email, password, role });

      // Save to localStorage if response contains session data
      if (response.token) localStorage.setItem("token", response.token);
      if (response.id) localStorage.setItem("userId", response.id);
      if (response.name) localStorage.setItem("userName", response.name);
      if (response.role) localStorage.setItem("userRole", response.role);

      return response;
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
