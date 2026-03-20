import { useState, useEffect } from "react";

import { obtenerMotivos } from "../services/motivo.services";

export const useMotivo = () => {
  //Tipa el estado como array de Motivo
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    const getMotivos = async () => {
      try {
        const motivosData = await obtenerMotivos();
        setMotivos(motivosData);
      } catch (error) {
        console.error("Error al obtener los motivos:", error);
      }
    };
    getMotivos();
  }, []);

  // Opciones para un select
  const motivosOptions = motivos.map((m: any) => ({
    ...m,
    label: `${m.desc}`,
    value: m,
  }));

  return { motivosOptions };
};
