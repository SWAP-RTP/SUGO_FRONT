const API_URL = import.meta.env.VITE_API_URL;

// function para obtener los economicos disponibles
export const getEcoDisponibles = async () => {
    try{
        const response = await fetch(`${API_URL}/rol_turnos`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error("Error al obtener los economicos disponibles:", error);
        throw error;
    }
};
