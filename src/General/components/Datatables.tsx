import { useMemo, useEffect, useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
import "../css/Datatables.css";

DataTable.use(DT);
interface DatatablesProps {
  data: any[];
  columns: any[];
  onEliminar?: (rowData: any) => void;
}

export const Datatables = ({ data, columns, onEliminar }: DatatablesProps) => {
  const tableRef = useRef<any>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  //USEEFFECT PARA EL MANEJO DE EVENTOS EN EL BOTON ELIMINAR
  useEffect(() => {
    const contenedor = contenedorRef.current;
    // console.log("Contenedor de la tabla:", contenedor);//DEBUG ELIMINAR DESPUES
    if (!contenedor) return;

    const handleClick = (e: MouseEvent) => {
      const btnEliminar = (e.target as HTMLElement).closest(".btn-eliminar");
      if (!btnEliminar) return;

      const dt = tableRef.current?.dt();
      if (!dt) return;

      const fila = (btnEliminar as HTMLElement).closest("tr");
      const rowData = dt.row(fila).data();
      // console.log("rowData", rowData);//DEBUG ELIMINAR DESPUES
      onEliminar?.(rowData);
    };

    contenedor.addEventListener("click", handleClick);
    return () => contenedor.removeEventListener("click", handleClick);
  }, [onEliminar]);

  const columnaBoton = useMemo(
    () => [
      ...columns,
      {
        title: "ACCION",
        data: null,
        orderable: false,
        className: "celda-acciones",
        responsivePriority: 1,
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
    [JSON.stringify(columns)],
  );

  const memoData = useMemo(() => data, [JSON.stringify(data)]);
  const memoOptions = useMemo(
    () => ({
      ordering: false,
      autoWidth: false,
      responsive: {
        details: {
          type: "column",
          target: ".control-expandir",
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

  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        try {
          const dt = tableRef.current.dt();
          dt.responsive.recalc();
          dt.columns.adjust();
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
