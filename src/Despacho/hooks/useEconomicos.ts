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
        cargarEconomicos();
    }, [cargarEconomicos]);

    // Ahora exportamos tanto los datos como la función para recargarlos
    return { ecoDisponibles, cargarEconomicos };
}
