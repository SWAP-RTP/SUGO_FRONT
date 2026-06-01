import { useState, useEffect, useCallback } from "react";
import { ObtenerRol } from "../services/rol_periodo.services";
import { useAuth } from "../../General/hooks/useAuth";

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

export const useRolEditar = () => {
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [turnosAgrupados, setTurnosAgrupados] = useState<Record<string, Turno[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { usuario } = useAuth();
    const fetchRoles = useCallback(async () => {
        if (!usuario || !usuario.data || !usuario.data.modulo) return;
        try {
            setLoading(true);
            const moduloEnviar = Number(usuario.data.modulo)
            const data: Turno[] = await ObtenerRol(moduloEnviar);
            setTurnos(data);

            // Agrupar por nombre_ruta
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