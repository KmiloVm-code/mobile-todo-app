"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: "1",
  name: "María González",
  email: "maria@ejemplo.com",
  preferences: {
    theme: "light",
    notifications: true,
    language: "es",
    defaultView: "all",
  },
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = user !== null;

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple mock authentication
      if (email === "demo@ejemplo.com" && password === "demo123") {
        const userData = { ...mockUser, email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }

      setError("Credenciales incorrectas");
      setIsLoading(false);
      return false;
    } catch (err) {
      setError("Error al iniciar sesión");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if user already exists (simple simulation)
      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        setIsLoading(false);
        return {
          success: false,
          message: "Ya existe una cuenta con este correo electrónico",
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsLoading(false);
        return {
          success: false,
          message: "Por favor ingresa un correo electrónico válido",
        };
      }

      // Validate password length
      if (password.length < 6) {
        setIsLoading(false);
        return {
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        preferences: {
          theme: "light",
          notifications: true,
          language: "es",
          defaultView: "all",
        },
        createdAt: new Date().toISOString(),
      };

      // Save user data
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));

      setIsLoading(false);
      return {
        success: true,
        message: "¡Cuenta creada exitosamente! Bienvenido a TaskFlow",
      };
    } catch (err) {
      setError("Error al crear la cuenta");
      setIsLoading(false);
      return { success: false, message: "Error al crear la cuenta" };
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  const updatePreferences = (newPreferences: Partial<User["preferences"]>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...newPreferences },
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updatePreferences,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
