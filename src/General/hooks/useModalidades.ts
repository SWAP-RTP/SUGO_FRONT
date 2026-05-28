import { useState, useEffect, useMemo } from "react";
import { obtenerModalidades } from "../services/modalidades.services";

export const useModalidades = () => {
  // estado para almacenar las modalidades
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    const getModalidades = async () => {
      try {
        const modalidadesData = await obtenerModalidades();
        setModalidades(modalidadesData);
      } catch (error) {
        console.error("Error al obtener las modalidades:", error);
      }
    };
    getModalidades();
  }, []);

  const modalidadesOptions = useMemo(
    () =>
      modalidades.map((m: any) => ({
        ...m,
        label: `${m.servicio_descrip}`,
        value: m.servicio_descrip,
      })),
    [modalidades],
  );

  return { modalidadesOptions };
};
