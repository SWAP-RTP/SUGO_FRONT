import { useMemo, useEffect, useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
import "../css/Datatables.css";

// Inicializa el componente de DataTables React con los plugins de Bootstrap 5
DataTable.use(DT);

/**
 * Propiedades del componente Datatables.
 */
interface DatatablesProps {
  // Datos a listar en la tabla
  data: any[];
  // Columnas definidas con sus propiedades
  columns: any[];
  // Callback opcional invocado al hacer clic en el botón de eliminar una fila
  onEliminar?: (rowData: any) => void;
}

/**
 * Datatables
 * 
 * Componente genérico que envuelve la librería DataTables.net para React,
 * agregándole estilos de Bootstrap 5, soporte responsivo de columnas,
 * y un botón dinámico de eliminación con delegación de eventos nativos.
 * 
 * @param {DatatablesProps} props - Propiedades recibidas por el componente.
 */
export const Datatables = ({ data, columns, onEliminar }: DatatablesProps) => {
  // Referencia para interactuar directamente con el objeto API de DataTables
  const tableRef = useRef<any>(null);
  // Referencia al contenedor HTML para delegación de eventos y re-dimensionamiento
  const contenedorRef = useRef<HTMLDivElement>(null);

  /**
   * Manejo delegado de eventos de clic.
   * 
   * Dado que DataTables renderiza botones de forma imperativa (en strings de HTML),
   * no podemos adjuntar listeners de React directamente (`onClick`).
   * Usamos delegación de eventos en el contenedor raíz buscando la clase `.btn-eliminar`.
   */
  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const handleClick = (e: MouseEvent) => {
      // Busca si el elemento cliqueado (o sus padres) posee la clase del botón de eliminación
      const btnEliminar = (e.target as HTMLElement).closest(".btn-eliminar");
      if (!btnEliminar) return;

      // Obtiene la instancia API de DataTable
      const dt = tableRef.current?.dt();
      if (!dt) return;

      // Obtiene el nodo tr (fila) correspondiente al botón cliqueado
      const fila = (btnEliminar as HTMLElement).closest("tr");
      // Extrae la data asociada a la fila en el modelo de DataTables
      const rowData = dt.row(fila).data();
      
      // Invoca el callback pasándole la información de la fila
      onEliminar?.(rowData);
    };

    // Añade el escucha de eventos de clic
    contenedor.addEventListener("click", handleClick);
    
    // Limpia el listener al desmontar el componente o cambiar el callback de eliminación
    return () => contenedor.removeEventListener("click", handleClick);
  }, [onEliminar]);

  /**
   * columnaBoton
   * 
   * Agrega dinámicamente al final de las columnas del usuario una columna de "ACCION"
   * para alojar el botón de eliminación y el disparador de expansión en dispositivos móviles.
   */
  const columnaBoton = useMemo(
    () => [
      ...columns,
      {
        title: "ACCION",
        data: null,
        orderable: false,
        className: "celda-acciones",
        responsivePriority: 1, // Mantiene la columna visible en tamaños móviles
        render: function () {
          return `
                    <div class="contenedor-acciones">
                        <button class="btn-eliminar" title="Eliminar" id="btn-eliminar">
                            <i class="pi pi-trash"></i>
                        </button>
                        <span class="control-expandir"></span>
                    </div>
                `;
        },
      },
    ],
    [columns],
  );

  // Memoriza los datos para evitar re-renderizados innecesarios de la librería
  const memoData = useMemo(() => data, [JSON.stringify(data)]);
  
  // Opciones de configuración de la instancia de DataTables
  const memoOptions = useMemo(
    () => ({
      ordering: false, // Desactiva la ordenación por columnas
      autoWidth: false, // Desactiva el cálculo de anchos automático de celdas
      responsive: {
        details: {
          type: "column",
          target: ".control-expandir", // Define qué elemento dispara la visualización responsiva
        },
      },
      columnDefs: [
        { targets: 0, responsivePriority: 2 },
        { targets: -1, responsivePriority: 1, width: "50px" },
        { targets: "_all", defaultContent: "", responsivePriority: 10 },
      ],
      width: "100%",
      language: {
        search: "Buscar:",
        lengthMenu: "_MENU_",
      },
    }),
    [],
  );

  /**
   * Efecto para ajustar el ancho y recalculación responsiva de columnas
   * cuando el tamaño de la pantalla del navegador cambia.
   */
  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        try {
          const dt = tableRef.current.dt();
          dt.responsive.recalc(); // Recalcula las columnas visibles/ocultas responsivas
          dt.columns.adjust(); // Reajusta el ancho de las columnas
        } catch (err) {
          console.log("Esperando a que la tabla cargue...");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <div className="contenedor-tabla" ref={contenedorRef}>
      <DataTable
        ref={tableRef}
        data={memoData}
        columns={columnaBoton}
        className="display nowrap"
        options={memoOptions}
      />
    </div>
  );
};
