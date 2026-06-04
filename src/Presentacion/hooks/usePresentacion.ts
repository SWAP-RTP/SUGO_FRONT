import { getPresentacionServices } from "../services/presentacion.services";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../General/hooks/useAuth";

export const usePresentacion = () => {
  const [presentacion, setPresentacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  const cargarPresentacion = useCallback(async () => {
    setLoading(true);

    try {
      const modulo = usuario?.data?.modulo
        ? Number(usuario.data.modulo)
        : undefined;
      const response = await getPresentacionServices(modulo);

      setPresentacion(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      console.log("Error al obtener la presentacion" + error);
    } finally {
      setLoading(false);
    }
  }, [usuario?.data?.modulo]);

  useEffect(() => {
    cargarPresentacion();

    const recagarPagina = setInterval(() => {
      cargarPresentacion();
    }, 2000);

    return () => clearInterval(recagarPagina);
  }, [cargarPresentacion]);

  return { presentacion, loading, error, refetch: cargarPresentacion };
};
