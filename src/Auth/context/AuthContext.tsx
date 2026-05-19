import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { Usuario } from "../types/auth.types";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const inicializarAuth = () => {
      //SE BUSCA EL TOKEN DESDE LA URL
      const params = new URLSearchParams(window.location.search);
      const tokenUrl = params.get("token");

      // EN CASO DE QUE NO SE ENCUENTRE EN LA URL SE BUSCA DESDE EL STORAGE
      const tokenFinal = tokenUrl || localStorage.getItem("token_sugo");

      if (tokenFinal) {
        try {
          const decoded: Usuario = jwtDecode(tokenFinal);
          const isExpired = (decoded as any).exp * 1000 < Date.now();
          if (isExpired) throw new Error("Token expirado");

          setToken(tokenFinal);
          setUsuario(decoded);
          localStorage.setItem("token_sugo", tokenFinal);

          // LIMPIAMOS EL TOKEN DE LA URL PARA QUE NO SE VEA EN EL FRONT
          if (tokenUrl) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } catch (error) {
          console.error("Token inválido:", error);
          logout();
        }
      }
      setCargando(false);
    };

    inicializarAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token_sugo");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado: !!token,
        cargando,
        logout,
      }}
    >
      {/* LA APP NO SE RENDERIZA HASTA QUE SEPA SI HAY UN USUSARIO O NO*/}
      {!cargando && children}
    </AuthContext.Provider>
  );
};
