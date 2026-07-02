import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../General/hooks/useAuth";
import { obtenerPvEstados_Recepcion } from "../../General/services/pv_estados.services";
const API_URL = import.meta.env.VITE_API_URL;

/**
 * usePvEstados
 * 
 * Hook personalizado para la gestión de recepción de estados de vehículos (económicos).
 * Provee la funcionalidad para cargar los registros periódicamente (polling) de acuerdo
 * al módulo del usuario autenticado y permite eliminar registros específicos mostrando notificaciones.
 * 
 * @param {React.RefObject<any>} toast - Referencia al componente Toast para mostrar notificaciones.
 * @returns Un objeto que expone:
 *   - pvEstados: Listado de estados cargados del módulo.
 *   - cargarDatos: Función para refrescar manualmente los datos.
 *   - handleEliminar: Función para realizar el borrado de un registro.
 */
export const usePvEstados = (toast: React.RefObject<any>) => {
    // Obtiene información del usuario autenticado
    const { usuario } = useAuth();

    // Estado para guardar la lista de estados de recepción
    const [pvEstados, setPvEstados] = useState([]);

    // Convierte el módulo del usuario a número si existe
    const moduloNum = usuario?.data?.modulo
        ? Number(usuario.data.modulo)
        : undefined;

    /**
     * cargarDatos
     * 
     * Función memorizada que solicita los estados de recepción asociados al módulo
     * del usuario y los almacena en el estado pvEstados.
     */
    const cargarDatos = useCallback(async () => {
        try {
            const datos = await obtenerPvEstados_Recepcion(moduloNum);
            setPvEstados(datos);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, [moduloNum]);

    /**
     * useEffect para el ciclo de vida del hook:
     * - Carga datos de forma inicial.
     * - Configura un polling recurrente cada 5 segundos.
     * - Limpia el intervalo al desmontar el componente o cambiar la función cargarDatos.
     */
    useEffect(() => {
        cargarDatos();
        const interval = setInterval(() => {
            cargarDatos();
        }, 5000);

        return () => clearInterval(interval);
    }, [cargarDatos]);

    /**
     * handleEliminar
     * 
     * Función memorizada para enviar una solicitud DELETE de eliminación de un registro
     * por su ID, mostrando notificaciones toast de éxito o error.
     * 
     * @param {any} rowData - Datos del registro a eliminar (requiere propiedad 'id').
     */
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
            } catch (err) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Hubo un error al eliminar el registro",
                });
            }
        },
        [cargarDatos],
    );

    // Retorno de variables y manejadores de eventos expuestos por el hook
    return {
        pvEstados,
        cargarDatos,
        handleEliminar
    }
};
