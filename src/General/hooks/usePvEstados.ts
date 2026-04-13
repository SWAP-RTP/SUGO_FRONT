import { useState, useEffect } from "react";
import { obtenerPvEstados } from "../services/pv_estados.services";

export const usePvEstados = () => {
  const [pvEstados, setPvEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPvEstados = async () => {
      try {
        const data = await obtenerPvEstados();
        setPvEstados(data);
      } catch (error) {
        console.error("Error al obtener pv_estados:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getPvEstados();
  }, []);

  return { pvEstados, loading, error };
};
