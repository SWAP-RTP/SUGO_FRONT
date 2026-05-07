// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import type { Permisos } from '../types/auth.types';

// import { obtenerPermisosSimulados } from '../services/auth.services';

// // 1. Definimos qué información va a "flotar" por toda nuestra aplicación
// interface AuthContextType {
//     permisos: Permisos[]; // El array de permisos
//     cargando: boolean;    // Para saber si aún estamos "trayendo" los datos
// }

// // 2. Creamos el contexto vacío inicialmente
// export const AuthContext = createContext<AuthContextType>({
//     permisos: [],
//     cargando: true
// });

// // 3. Creamos el componente "Proveedor" que va a envolver nuestra App
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [permisos, setPermisos] = useState<Permisos[]>([]);
//     const [cargando, setCargando] = useState<boolean>(true);

//     // Cuando este proveedor nazca, simulamos que vamos por los permisos
//     useEffect(() => {
//         const cargarPermisos = async () => {
//             try {
//                 const data = await obtenerPermisosSimulados();
//                 setPermisos(data);
//             } catch (error) {
//                 console.error("Error al cargar permisos simulados", error);
//             } finally {
//                 setCargando(false);
//             }
//         };

//         cargarPermisos();
//     }, []);

//     // 4. Todo lo que esté dentro de "value" podrá ser accedido desde cualquier pantalla
//     return (
//         <AuthContext.Provider value={{ permisos, cargando }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
