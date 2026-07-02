import { useState, useEffect, useCallback } from "react";
import { ObtenerRol } from "../services/rol_periodo.services";
import { useAuth } from "../../General/hooks/useAuth";

/**
 * Turno
 * 
 * Interfaz que define los datos de un turno asignado en el Rol de Servicio:
 * @property {number} id - Identificador único del turno.
 * @property {number} id_archivo - Identificador del archivo Excel del cual se originó el rol.
 * @property {string} nombre_ruta - Nombre de la ruta asignada.
 * @property {number} economico - Número económico del vehículo.
 * @property {string} sistema - Sistema o modalidad del servicio.
 * @property {number} primer_t - Credencial del operador asignado al 1° Turno.
 * @property {number} segundo_t - Credencial del operador asignado al 2° Turno.
 * @property {number} tercer_t - Credencial del operador asignado al 3° Turno.
 */
export interface Turno {
    id: number;
    id_archivo: number;
    nombre_ruta: string;
    economico: number;
    sistema: string;
    primer_t: number;
    segundo_t: number;
    tercer_t: number;
}

/**
 * useRolEditar
 * 
 * Custom Hook para consultar y estructurar los turnos del Rol de Servicio vigente,
 * agrupándolos automáticamente por nombre de ruta.
 * 
 * @returns {Object} Un objeto con:
 *   - turnos: Arreglo plano con la totalidad de turnos consultados.
 *   - turnosAgrupados: Diccionario `{ [nombre_ruta]: Turno[] }` con turnos agrupados por ruta.
 *   - loading: Estado booleano de carga activa.
 *   - refetch: Función manual para recargar los datos desde el servidor.
 */
export const useRolEditar = () => {
    // Estado para la lista plana de turnos
    const [turnos, setTurnos] = useState<Turno[]>([]);
    // Estado para la estructura agrupada por nombre_ruta
    const [turnosAgrupados, setTurnosAgrupados] = useState<Record<string, Turno[]>>({});
    // Bandera de carga
    const [loading, setLoading] = useState<boolean>(true);
    // Obtiene los datos del usuario en sesión activa
    const { usuario } = useAuth();

    /**
     * fetchRoles
     * 
     * Función asíncrona memorizada (`useCallback`) que solicita los turnos pertenecientes
     * al módulo del usuario autenticado y los agrupa en un objeto por `nombre_ruta`.
     */
    const fetchRoles = useCallback(async () => {
        if (!usuario || !usuario.data || !usuario.data.modulo) return;
        try {
            setLoading(true);
            const moduloEnviar = Number(usuario.data.modulo);
            // Invoca el servicio de consulta enviando el identificador del módulo
            const data: Turno[] = await ObtenerRol(moduloEnviar);
            setTurnos(data);

            // Agrupa los turnos dinámicamente utilizando reduce según su propiedad nombre_ruta
            const agrupados = data.reduce((acc: Record<string, Turno[]>, turno) => {
                const ruta = turno.nombre_ruta || 'Sin Ruta';
                if (!acc[ruta]) {
                    acc[ruta] = [];
                }
                acc[ruta].push(turno);
                return acc;
            }, {});

            setTurnosAgrupados(agrupados);
        } catch (error) {
            console.error("Error al cargar los roles:", error);
        } finally {
            setLoading(false);
        }
    }, [usuario?.data?.modulo]);

    // Ejecuta la consulta al montar el hook o al cambiar el módulo del usuario
    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return {
        turnos,
        turnosAgrupados,
        loading,
        refetch: fetchRoles
    };
};