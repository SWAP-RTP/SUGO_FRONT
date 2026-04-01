import { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.css";
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import "../css/Datatables.css";

DataTable.use(DT);
interface DatatablesProps {
    data: any[];
    columns: any[];
}
export const Datatables = ({ data, columns }: DatatablesProps) => {
    const [tableData, settableData] = useState(data || []);
    useEffect(() => {
        settableData(data || []);
    }, [data]);

    return (
        <div className="contenedor-tabla">
            <DataTable
                data={tableData}
                columns={columns}
                className="display nowrap"
                options={{
                    responsive: {
                        details: {
                            type: 'column',
                            target: 0
                        }
                    },
                    columnDefs: [{ className: 'dtr-control', orderable: false, targets: 0 }],
                    autoWidth: false,
                    language: {
                        search: "Buscar:",
                        lengthMenu: "_MENU_"
                    }
                }}
            />
        </div>
    );
}
