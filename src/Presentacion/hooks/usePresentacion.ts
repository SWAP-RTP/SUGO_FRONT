import { getPresentacionServices } from "../services/presentacion.services";
import { useState, useEffect } from "react";

export const usePresentacion = () => {
  const [presentacion, setPresentacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPresentacion = async () => {
    setLoading(true);

    try {
      const response = await getPresentacionServices();

      setPresentacion(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      console.log("Error al obtener la presentacion" + error);
    }
  };

  useEffect(() => {
    cargarPresentacion();

    const recagarPagina = setInterval(() => {
      cargarPresentacion();
    }, 5000);

    return () => clearInterval(recagarPagina);
  }, []);

  return { presentacion, loading, error, refetch: cargarPresentacion };
};
