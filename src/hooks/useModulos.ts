import { useState, useEffect } from "react";

// Define el tipo de módulo
type Modulo = {
  id: number;
  nombre: string;
};

export const useModulos = () => {
  // Datos simulados
  const modulos_select: Modulo[] = [
    { id: 0, nombre: "Oficinas centrales" },
    { id: 1, nombre: "Modulo 1" },
    { id: 2, nombre: "Modulo 2" },
    { id: 3, nombre: "Modulo 3" },
    { id: 4, nombre: "Modulo 4" },
    { id: 5, nombre: "Modulo 5" },
    { id: 6, nombre: "Modulo 6" },
    { id: 7, nombre: "Modulo 7" },
  ];

  // Tipa el estado como array de Modulo
  const [modulos, setModulos] = useState<Modulo[]>([]);

  useEffect(() => {
    // Simula carga de datos
    setModulos(modulos_select);
  }, []);

  // Opciones para un select
  const modulosOptions = modulos.map((modulo) => ({
    ...modulo,
    label: modulo.nombre,
    value: modulo.id,
  }));

  return { modulosOptions };
};
