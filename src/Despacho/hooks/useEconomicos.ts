import { useEffect, useState, useCallback } from 'react';
import { getEcoDisponibles } from '../services/despachoEco.services';
import { useAuth } from '../../General/hooks/useAuth';

export const useEcoDisponibles = () => {
    const [ecoDisponibles, setEcoDisponibles] = useState([]);
    const { usuario } = useAuth();

    // Lo envolvemos en useCallback para poder llamarlo desde otros componentes
    const cargarEconomicos = useCallback(() => {
        const modulo = usuario?.data?.modulo ? Number(usuario.data.modulo) : undefined;
        getEcoDisponibles(modulo).then((data) => {
            setEcoDisponibles(data);
        });
    }, [usuario?.data?.modulo]);

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
