import { useState, useEffect, useMemo } from "react";

import {
  obtenerMotivos,
  obtenerMotivosRecepcion,
} from "../services/motivo.services";

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
  const motivosOptions = useMemo(
    () =>
      motivos.map((m: any) => ({
        ...m,
        label: `${m.desc}`,
        value: m,
      })),
    [motivos],
  );

  return { motivosOptions };
};

// RECEPCION

export const useMotivoRecepcion = () => {
  //Tipa el estado como array de Motivo
  const [motivosRecepcion, setMotivosRecepcion] = useState([]);

  useEffect(() => {
    const getMotivosRecepcion = async () => {
      try {
        const motivosDataRecepcion = await obtenerMotivosRecepcion();
        setMotivosRecepcion(motivosDataRecepcion);
      } catch (error) {
        console.error("Error al obtener los motivos:", error);
      }
    };
    getMotivosRecepcion();
  }, []);

  // Opciones para un select
  const motivosOptionsRecepcion = useMemo(
    () =>
      motivosRecepcion.map((m: any) => ({
        ...m,
        label: `${m.desc}`,
        value: m,
      })),
    [motivosRecepcion],
  );

  return { motivosOptionsRecepcion };
};
