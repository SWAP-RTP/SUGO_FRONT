import { FormularioDespacho } from "./components/FormularioDespacho";

/**
 * Despacho
 * 
 * Componente contenedor y vista principal del módulo de Despacho.
 * Se encarga de instanciar y renderizar el formulario general de despacho.
 */
export const Despacho = () => {
  return (
    <>
      {/* Componente que gestiona el layout, catálogo y formulario de la jornada de despacho */}
      <FormularioDespacho />
    </>
  );
};
