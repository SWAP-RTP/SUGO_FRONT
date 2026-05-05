import {useEffect, useState} from 'react';
import { getEcoDisponibles } from '../services/despachoEco.services';


export const useEcoDisponibles = () => {
    const [ecoDisponibles, setEcoDisponibles] = useState([]);
    useEffect(() => {
        getEcoDisponibles().then((data) => {
            setEcoDisponibles(data);
        });
    }, []);
    return {ecoDisponibles};
}
