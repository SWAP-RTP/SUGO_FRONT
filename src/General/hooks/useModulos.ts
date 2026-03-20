import { useState, useEffect } from "react";
// servicios
import { obtenerModulos } from "../services/modulo.services";

export const useModulos = () => {
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const getModulos = async () => {
      try {
        const modulosData = await obtenerModulos();
        setModulos(modulosData);
      } catch (error) {
        console.error("Error al obtener los módulos:", error);
      }
    };

    getModulos();
  }, []);

  const modulosOptions = modulos.map((m: any) => ({
    ...m,
    label: `${m.descripcion}`,
    value: m.id,
  }));

  return { modulosOptions };
};
