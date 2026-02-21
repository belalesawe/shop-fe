"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  LoginRequest,
  RegisterRequest,
  ProfileUpdateRequest,
  AuthState,
} from "@/types/auth";
import * as api from "@/lib/api";

interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdateRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for stored tokens and fetch profile
  useEffect(() => {
    const initAuth = async () => {
      const token = api.getStoredAccessToken();
      if (token) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch {
          // Token invalid or expired; clear it
          api.clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = useCallback(async (request: LoginRequest) => {
    await api.login(request);
    const profile = await api.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  }, []);

  const handleRegister = useCallback(async (request: RegisterRequest) => {
    await api.register(request);
    const profile = await api.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    api.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleUpdateProfile = useCallback(
    async (updates: ProfileUpdateRequest) => {
      const updatedUser = await api.updateProfile(updates);
      setUser(updatedUser);
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
