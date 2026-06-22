import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../General/hooks/useAuth";
import { obtenerPvEstados, obtenerPvEstadosActivos } from "../../General/services/pv_estados.services";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * usePvEstados
 *
 * Hook que centraliza toda la gestión de datos de pv_estados para el módulo de Despacho.
 *
 * Responsabilidades:
 *  - Cargar la lista completa de registros de despacho del módulo del usuario (pvEstados).
 *  - Cargar la lista de económicos actualmente en despacho activo (activos).
 *  - Ejecutar un polling automático cada 5 segundos para mantener los datos frescos.
 *  - Exponer handleEliminar para borrar un registro de despacho via DELETE al API.
 *
 * @param toast - Referencia al componente Toast de PrimeReact para mostrar notificaciones.
 * @returns { pvEstados, activos, cargarDatos, handleEliminar }
 */

export const usePvEstados = (toast: React.RefObject<any>) => {
    const { usuario } = useAuth();

    // Lista completa de registros de despacho (para la tabla inferior del componente).
    const [pvEstados, setPvEstados] = useState([]);

    // Lista de económicos que actualmente están en despacho activo.
    // Se usa en buscarEconomico para impedir despachar un eco ya activo.
    const [activos, setActivos] = useState<any[]>([]);

    // Número de módulo del usuario logueado. Filtra los datos por módulo.
    const moduloNum = usuario?.data?.modulo
        ? Number(usuario.data.modulo)
        : undefined;

    // Carga en paralelo ambos endpoints del API para optimizar el tiempo de respuesta.
    // Es llamada tanto al montar el componente como cada 5 segundos por el polling.
    const cargarDatos = useCallback(async () => {
        try {
            const [datos, datosActivos] = await Promise.all([
                obtenerPvEstados(moduloNum),
                obtenerPvEstadosActivos(moduloNum),
            ]);
            setPvEstados(datos);
            setActivos(datosActivos);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    }, [moduloNum]);

    // Polling automático: refresca los datos cada 5 segundos
    // para detectar nuevos despachos o cambios en tiempo real.
    useEffect(() => {
        cargarDatos();
        const interval = setInterval(cargarDatos, 5000);
        return () => clearInterval(interval);
    }, [cargarDatos]);

    // Elimina un registro de despacho del API (DELETE /pv_estados/:id)
    // y recarga los datos. Muestra toast de éxito o error según el resultado.
    const handleEliminar = useCallback(
        async (rowData: any) => {
            try {
                const response = await fetch(`${API_URL}/pv_estados/${rowData.id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    toast.current?.show({
                        severity: "success",
                        summary: "Eliminado",
                        detail: "Registro eliminado correctamente",
                    });
                    await cargarDatos();
                }
            } catch {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Hubo un error al eliminar el registro",
                });
            }
        },
        [cargarDatos, toast],
    );

    return { pvEstados, activos, cargarDatos, handleEliminar };
};
