/**
 * useColumnasRecepcion
 *
 * Hook que define la configuración de columnas para la tabla DataTables
 * del historial de recepciones realizadas.
 *
 * - La columna ECO muestra el número económico con formato visual rojo
 *   cuando el registro es de tipo Recepción (eco_estatus === 2).
 * - La columna RUTA resuelve el id numérico a nombre legible usando rutasOptions.
 * - Las columnas EDO.ECO y TIPO DE REGISTRO aplican badges de color.
 *
 * @returns { columnas } - Array de configuración de columnas para DataTables.
 */

import { useMemo } from "react";

export const useColumnasRecepcion = (rutasOptions: any[]) => {
    const columnas = useMemo(() => [
        {
            title: "ECO",
            data: "economico",
            responsivePriority: 1,
            render: (data: any, _type: any, row: any) => {
                const estatus = row?.eco_estatus;
                const isRecepcion = estatus === 2 || estatus === "2";
                if (isRecepcion) {
                    return `<span style="color:#991b1b; font-weight: bold; background-color: #fee2e2; padding: 2px 6px; border-radius: 4px; border: 1px dashed #991b1b;">${data}</span>`;
                }
                return data;
            },
        },
        { title: "HORA", data: "hora", responsivePriority: 0 },
        { title: "FECHA", data: "fecha", responsivePriority: 0 },
        { title: "MODULO", data: "id_modulo", responsivePriority: 2 },
        {
            title: "EDO.ECO",
            data: "tipo_eco",
            responsivePriority: 3,
            render: (data: any) => {
                if (data === 1 || data === "1") {
                    return "Planta";
                } else if (data === 2 || data === "2") {
                    return "Postura";
                }
                return "";
            },
        },
        {
            title: "TIPO DE REGISTRO",
            data: "eco_estatus",
            responsivePriority: 5,
            render: (data: any) => {
                if (data === 1 || data === "1") {
                    return `<span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #a7f3d0;">Despacho</span>`;
                } else if (data === 2 || data === "2") {
                    return `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #fecaca;">Recepción</span>`;
                }
                return "";
            },
        },
        { title: "MOTIVO", data: "detalleMotivo.desc", responsivePriority: 6 },
        { title: "RUTA", data: "nombre_ruta", responsivePriority: 7 },
        { title: "CC", data: "cc", responsivePriority: 7 },
        { title: "MODALIDAD", data: "nombre_modalidad", responsivePriority: 8 },
        { title: "OPERADOR", data: "credencial", responsivePriority: 9 },
        { title: "TURNO", data: "turno", responsivePriority: 10 },
        { title: "EXTINTOR", data: "extintor_1", responsivePriority: 11 }
    ], [rutasOptions]);

    return { columnas };
}