import { useEffect, useState, useCallback } from 'react';
import { getEcoDisponibles } from '../services/despachoEco.services';
import { useAuth } from '../../General/hooks/useAuth';

/**
 * useEcoDisponibles
 * 
 * Hook personalizado que gestiona y obtiene la lista de vehículos económicos disponibles,
 * filtrados por el módulo correspondiente al usuario autenticado.
 * Implementa una carga inicial y un polling de actualización automática cada 3 segundos.
 * 
 * @returns {Object} Objeto con las siguientes propiedades:
 *   - ecoDisponibles: Arreglo con la lista de económicos disponibles.
 *   - cargarEconomicos: Función para recargar la lista de económicos de manera manual.
 */
export const useEcoDisponibles = () => {
    // Estado para almacenar la lista de económicos disponibles
    const [ecoDisponibles, setEcoDisponibles] = useState([]);

    // Obtiene la información del usuario autenticado actual
    const { usuario } = useAuth();

    /**
     * cargarEconomicos
     * 
     * Función memorizada con useCallback para realizar la consulta al servicio
     * getEcoDisponibles, filtrando opcionalmente por el módulo del usuario.
     */
    // Lo envolvemos en useCallback para poder llamarlo desde otros componentes
    const cargarEconomicos = useCallback(() => {
        const modulo = usuario?.data?.modulo ? Number(usuario.data.modulo) : undefined;
        getEcoDisponibles(modulo).then((data) => {
            setEcoDisponibles(data);
        });
    }, [usuario?.data?.modulo]);

    /**
     * useEffect para el ciclo de vida del hook:
     * - Dispara la carga inicial al montarse.
     * - Configura un intervalo (polling) de actualización cada 3 segundos.
     * - Limpia el intervalo al desmontar el hook o si cambia la función cargarEconomicos.
     */
    useEffect(() => {
        // Carga inicial
        cargarEconomicos();

        // Configurar polling cada 3 segundos
        const interval = setInterval(() => {
            cargarEconomicos();
        }, 3000);

        return () => clearInterval(interval);
    }, [cargarEconomicos]);

    // Ahora exportamos tanto los datos como la función para recargarlos
    return { ecoDisponibles, cargarEconomicos };
}
