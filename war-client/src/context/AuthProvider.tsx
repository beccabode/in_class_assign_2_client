import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId");
  });

  const login = (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}