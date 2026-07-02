import { createContext } from "react";
import type { Usuario } from "../types/auth.types";

/**
 * AuthContextType
 * 
 * Interfaz que define las propiedades y métodos expuestos a través del contexto de autenticación.
 */
export interface AuthContextType {
    // Datos del usuario decodificados del token (o null si no está autenticado)
    usuario: Usuario | null;
    // Token JWT de sesión almacenado (o null si no existe)
    token: string | null;
    // Bandera booleana que indica si hay una sesión activa
    estaAutenticado: boolean;
    // Estado de carga inicial que indica si se está verificando el token/sesión al arrancar la app
    cargando: boolean;
    // Función callback para cerrar la sesión y limpiar datos locales
    logout: () => void;
}

/**
 * AuthContext
 * 
 * Contexto de React de uso interno para la autenticación global de la aplicación.
 * Definido en este archivo separado de TypeScript puro para evitar la recreación 
 * del contexto al usar el Hot Module Replacement (HMR) de Vite.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);