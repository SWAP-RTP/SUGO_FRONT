import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ajusta el nombre si no lo renombraste

// Este es nuestro atajo. 
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Un pequeño seguro de vida por si intentas usarlo fuera de la "burbuja"
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    
    return context;
};
