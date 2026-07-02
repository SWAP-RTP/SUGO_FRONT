/**
 * Permisos
 * 
 * Interfaz que modela los permisos CRUD básicos asignados a las funcionalidades 
 * o módulos de la aplicación para el usuario.
 */
export interface Permisos {
    // Permiso para crear nuevos registros
    crear: boolean;
    // Permiso para realizar consultas y lectura de información
    consultar: boolean;
    // Permiso para actualizar o modificar registros existentes
    editar: boolean;
    // Permiso para dar de baja o eliminar registros
    eliminar: boolean;
}

/**
 * Usuario
 * 
 * Interfaz que define la estructura del payload de datos del usuario autenticado,
 * comúnmente extraído y decodificado del token JWT.
 */
export interface Usuario {
    data?: {
        // ID único del usuario en el sistema
        id: number;
        // Nombre completo o nombre de usuario
        nombre: string;
        // Módulo asignado al que pertenece el usuario (ej: número de patio)
        modulo: number;
        // Listado de permisos CRUD asignados al perfil del usuario
        permisos: Permisos[];
    };
}
