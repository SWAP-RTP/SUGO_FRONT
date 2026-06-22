/**
 * useColumnasDespacho
 *
 * Hook que define la configuración de columnas para la tabla DataTables
 * del historial de despachos realizados.
 *
 * - La columna ECO muestra el número económico con formato visual verde
 *   cuando el registro es de tipo Despacho (eco_estatus === 1).
 * - La columna RUTA resuelve el id numérico a nombre legible usando rutasOptions.
 * - Las columnas EDO.ECO y TIPO DE REGISTRO aplican badges de color.
 *
 * @param rutasOptions - Lista de rutas disponibles para resolver id → nombre.
 * @returns { columnas } - Array de configuración de columnas para DataTables.
 */
export const useColumnasDespacho = (rutasOptions: any[]) => {
    const columnas = [
        {
            title: "ECO",
            data: "economico",
            responsivePriority: 1,
            render: (data: any, type: any, row: any) => {
                const estatus = row?.eco_estatus;
                const isDespacho = estatus === 1 || estatus === "1";
                if (isDespacho) {
                    return `<span style="color: #065f46; font-weight: bold; background-color: #d1fae5; padding: 2px 6px; border-radius: 4px; border: 1px dashed #34d399;">${data}</span>`;
                }
                return data;
            },
        },
        { title: "Hora", data: "hora", responsivePriority: 0 },
        { title: "Fecha", data: "fecha", responsivePriority: 0 },
        { title: "MODULO", data: "id_modulo", responsivePriority: 2 },
        {
            title: "EDO.ECO",
            data: "tipo_eco",
            responsivePriority: 3,
            render: (data: any) => {
                if (data === 1 || data === "1") return "Planta";
                if (data === 2 || data === "2") return "Postura";
                return "";
            },
        },
        {
            title: "TIPO DE REGISTRO",
            data: "eco_estatus",
            responsivePriority: 5,
            render: (data: any) => {
                if (data === 1 || data === "1")
                    return `<span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #a7f3d0;">Despacho</span>`;
                if (data === 2 || data === "2")
                    return `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #fecaca;">Recepción</span>`;
                return "";
            },
        },
        { title: "MOTIVO", data: "detalleMotivo.desc", responsivePriority: 6 },
        {
            title: "RUTA",
            data: "id_ruta",
            responsivePriority: 7,
            render: (data: any) => {
                if (!data) return "";
                const opt = rutasOptions.find(
                    (r: any) => String(r.value) === String(data),
                );
                return opt ? opt.label : data;
            },
        },
        { title: "CC", data: "cc", responsivePriority: 7 },
        { title: "MODALIDAD", data: "id_modalidad", responsivePriority: 8 },
        { title: "OPERADOR", data: "credencial", responsivePriority: 9 },
        { title: "TURNO", data: "turno", responsivePriority: 10 },
        { title: "EXTINTOR", data: "extintor_1", responsivePriority: 11 },
    ];

    return { columnas };
};
