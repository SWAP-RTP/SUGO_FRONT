// services/authService.js
export const login = async (credenciales) => {
  try {
    const response = await fetch("http://localhost:8086/auth/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
};
