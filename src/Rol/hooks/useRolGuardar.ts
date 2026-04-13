import { useState } from "react";

export const useRolesGuardar = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const guardarCabeceraRol = async (datos) => {
    setCargando(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/rol_cabecera_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const resultado = await response.json();
      setCargando(false);
      return resultado;
    } catch (err) {
      setError(err.message);
      setCargando(false);
      throw err;
    }
  };

  return { guardarCabeceraRol, cargando, error };
};
