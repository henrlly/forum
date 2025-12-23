import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { authApi } from "@/api/auth";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { UserAuth } from "@/types/auth";

export interface AuthContextType {
  user: UserAuth | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => {
      try {
        const res = authApi.getMe();
        return res;
      } catch (_) {
        // 401/403, not logged in
        return null;
      }
    },
    retry: false,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });

  const value = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
