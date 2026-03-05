import { useState, useEffect } from "react";

//Define el tipo de motivo
type Motivo = {
    id: number;
    nombre: string;
};

export const useMotivoDespacho = () => {
    //Datos simulados
    const motivos_select: Motivo[] = [
        { id: 0, nombre: "Servicio MB" },
        { id: 1, nombre: "Termino de Jornada" },
        { id: 2, nombre: "Falta de combustible" },
        { id: 3, nombre: "Falta de relevo" },
        { id: 4, nombre: "Mantenimiento Correctivo" },
        { id: 5, nombre: "Mantenimiento Preventivo" },
        { id: 6, nombre: "Regreso por Avaluo" },
        { id: 7, nombre: "Resguardo(J)" },
        { id: 8, nombre: "Transferencia Intermodular" }
    ];


    //Tipa el estado como array de Motivo
    const [motivos, setMotivos] = useState<Motivo[]>([]);

    useEffect(() => {
        //Simula carga de datos
        setMotivos(motivos_select);
    }, []);

    // Opciones para un select
    const motivosOptions = motivos.map((motivos) => ({
        ...motivos,
        label: motivos.nombre,
        value: motivos.id
    }));

    return { motivosOptions };
};