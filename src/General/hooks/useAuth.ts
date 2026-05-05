// hooks/useAuth.ts
import { useState } from "react";
import { login } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async (credenciales) => {
    try {
      const data = await login(credenciales);
      const { usuario, token } = data;

      setUser({ name: usuario.name, modulo: usuario.modulo });
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name: usuario.name, modulo: usuario.modulo }),
      );

      if (token) {
        sessionStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  };

  const getUserFromSession = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // Función para obtener usuario desde token en URL
  const getUserFromTokenUrl = (tokenFromUrl: string) => {
    if (tokenFromUrl) {
      console.log("Token detectado:", tokenFromUrl);
      // Guardar el token en sessionStorage
      sessionStorage.setItem("token", tokenFromUrl);

      // Decodificar el JWT para extraer el usuario
      try {
        // Los JWT usan Base64Url, reemplazamos caracteres para que atob() no falle
        const base64Url = tokenFromUrl.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const payload = JSON.parse(jsonPayload);
        console.log("Payload decodificado del token:", payload);

        // Dependiendo de cómo lo envíe PHP, puede estar en payload.data o suelto
        const userData = payload.data || payload;

        setUser({
          name: userData.name || userData.nombre, // por si viene como "nombre"
          modulo: userData.modulo || "Sin módulo",
        });

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            name: userData.name || userData.nombre,
            modulo: userData.modulo || "Sin módulo",
          }),
        );
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return {
    user,
    handleLogin,
    getUserFromSession,
    getUserFromTokenUrl,
    handleLogout,
  };
};
