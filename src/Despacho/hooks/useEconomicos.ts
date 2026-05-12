import { useEffect, useState, useCallback } from 'react';
import { getEcoDisponibles } from '../services/despachoEco.services';

export const useEcoDisponibles = () => {
    const [ecoDisponibles, setEcoDisponibles] = useState([]);

    // Lo envolvemos en useCallback para poder llamarlo desde otros componentes
    const cargarEconomicos = useCallback(() => {
        getEcoDisponibles().then((data) => {
            setEcoDisponibles(data);
        });
    }, []);

    useEffect(() => {
        // Carga inicial
        cargarEconomicos();

        // Configurar polling cada 5 segundos
        const interval = setInterval(() => {
            cargarEconomicos();
        }, 3000);

        return () => clearInterval(interval);
    }, [cargarEconomicos]);

    // Ahora exportamos tanto los datos como la función para recargarlos
    return { ecoDisponibles, cargarEconomicos };
}
