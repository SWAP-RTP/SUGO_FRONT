import type { JSX } from "react";
import { useAuth } from "../../General/hooks/useAuth";

/**
 * ProtectedRoute
 * 
 * Componente Wrapper de enrutamiento que protege rutas privadas.
 * Evalúa si hay una sesión activa y redirige al portal de Login centralizado
 * en caso de que el usuario no esté autenticado.
 * 
 * @param {JSX.Element} children - Los componentes hijos a renderizar si se cumple la autenticación.
 */
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // Extrae el estado de autenticación y bandera de carga desde el hook useAuth
  const { estaAutenticado, cargando } = useAuth();

  // Mientras se valida el token o sesión inicial, muestra pantalla de espera
  if (cargando) return <div>Cargando Sesion...</div>;

  // Si no está autenticado, realiza redirección forzada al Login central
  if (!estaAutenticado) {
    window.location.href = "http://10.10.30.28:8086/login.html";
    return null;
  }

  // Si está autenticado, permite ver la ruta correspondiente
  return children;
};
