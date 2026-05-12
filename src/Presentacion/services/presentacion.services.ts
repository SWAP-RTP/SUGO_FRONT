// obtenernos la api para usarlar en el front

export const getPresentacionServices = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/hora");
    if (!response) throw new Error("Error al obtener los datos");
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// POST
export const postHoraPresentacion = async (data: any) => {
  try {
    const response = await fetch("http://localhost:3000/api/horaPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al guardar");
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
