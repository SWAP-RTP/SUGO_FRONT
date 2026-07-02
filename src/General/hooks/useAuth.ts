import { useContext } from "react"
import { AuthContext, type AuthContextType } from "../../Auth/context/AuthContext";

/**
 * useAuth
 * 
 * Hook personalizado que permite acceder fácilmente al contexto de autenticación global (`AuthContext`).
 * Simplifica el consumo del estado de sesión (usuario, token, cargando, etc.) en los componentes hijos.
 * 
 * Incluye una validación de seguridad que lanza un error si el hook es consumido por un componente
 * que no esté envuelto en un `<AuthProvider>`.
 * 
 * @returns {AuthContextType} El objeto de contexto que contiene el estado y funciones de autenticación.
 * @throws {Error} Si se consume fuera de las etiquetas de AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  // Consume la instancia única del contexto de autenticación
  const context = useContext(AuthContext);

  // Validación de seguridad para asegurar la existencia del proveedor en el árbol de componentes
  if (!context) {
    throw new Error("useAuth debe estar dentro de AuthProvider")
  }
  
  return context;
}
