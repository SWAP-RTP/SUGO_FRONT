import { useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { Usuario } from "../types/auth.types";
import { AuthContext } from "./AuthContext";

/**
 * AuthProvider
 * 
 * Componente proveedor del contexto de autenticación (React Context).
 * Se encarga de:
 * 1. Inicializar la sesión buscando un token JWT en los parámetros de la URL o en el localStorage.
 * 2. Decodificar la información del usuario desde el JWT.
 * 3. Controlar el estado de carga (`cargando`) para no renderizar la aplicación hasta verificar la sesión.
 * 4. Proveer un método de salida (`logout`) que limpia el almacenamiento local.
 * 
 * Debe envolver a toda la aplicación en el nivel raíz (usualmente en main.tsx).
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado que contiene la información decodificada del usuario
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  // Estado que almacena el string JWT crudo
  const [token, setToken] = useState<string | null>(null);
  // Controla la visualización previa a la carga del estado de sesión
  const [cargando, setCargando] = useState<boolean>(true);

  // Efecto que inicializa la sesión en el montaje inicial del componente
  useEffect(() => {
    const inicializarAuth = () => {
      // SE BUSCA EL TOKEN DESDE LA URL (por ejemplo si viene redireccionado del Login central)
      const params = new URLSearchParams(window.location.search);
      const tokenUrl = params.get("token");

      // EN CASO DE QUE NO SE ENCUENTRE EN LA URL SE BUSCA DESDE EL STORAGE
      const tokenFinal = tokenUrl || localStorage.getItem("token_sugo");

      if (tokenFinal) {
        try {
          // Decodificación del token JWT para extraer la información del usuario
          const decoded: Usuario = jwtDecode(tokenFinal);

          // Verifica si el tiempo de expiración del token ya se cumplió
          const isExpired = (decoded as any).exp * 1000 < Date.now();
          if (isExpired) throw new Error("Token expirado");

          // Establece el token y el usuario en el estado global
          setToken(tokenFinal);
          setUsuario(decoded);
          // Persiste el token en el almacenamiento local del navegador
          localStorage.setItem("token_sugo", tokenFinal);

          // LIMPIAMOS EL TOKEN DE LA URL PARA QUE NO SE VEA EN EL FRONT (evita exposición)
          if (tokenUrl) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } catch (error) {
          // Si el token es inválido o expiró, limpia la sesión
          console.error("Token inválido:", error);
          logout();
        }
      }
      // Indica que la verificación inicial ha terminado
      setCargando(false);
    };

    inicializarAuth();
  }, []);

  /**
   * logout
   * 
   * Limpia toda la información de la sesión local, forzando al usuario
   * a redirigirse al login central.
   */
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
      {/* LA APP NO SE RENDERIZA HASTA QUE SEPA SI HAY UN USUARIO O NO (evita parpadeos o fallas de renderizado) */}
      {!cargando && children}
    </AuthContext.Provider>
  );
};
