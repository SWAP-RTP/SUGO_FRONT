export interface Permisos {
    crear: boolean;
    consultar: boolean;
    editar: boolean;
    eliminar: boolean;
}

// Opcional: Si los permisos van a estar asociados a un usuario, también podemos definirlo de una vez
export interface Usuario {
    data?: {
        id: number;
        nombre: string;
        modulo: number;
        permisos: Permisos[];
    };
}
