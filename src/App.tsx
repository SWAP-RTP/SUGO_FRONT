import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./General/components/Header";
import { Sugo_main } from "./General/components/Sugo_main";
import { Recepcion } from "./Recepcion";
import { Despacho } from "./Despacho";
import { Presentacion } from "./Presentacion";
import { Rol } from "./Rol";
import { useAuth } from "./General/hooks/useAuth";

export const App = () => {
  const { user, getUserFromTokenUrl, getUserFromSession, handleLogout } =
    useAuth();

  useEffect(() => {
    // Al cargar la app, revisamos si viene un token en la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log(" App cargada. Token desde URL:", token); // Debug

    if (token) {
      console.log("✓ Token detectado en URL, decodificando...");
      // Le pasamos el token directamente a la función
      getUserFromTokenUrl(token);
      // Limpiar la URL para que no quede el token expuesto
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("⚠️ No hay token en URL, buscando en sessionStorage...");
      // Si no viene en la URL, buscamos si ya había sesión guardada
      getUserFromSession();
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Le pasamos el user y la función de logout al Header */}
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Sugo_main />} />
        <Route path="/despacho" element={<Despacho />} />
        <Route path="/recepcion" element={<Recepcion />} />
        <Route path="/presentacion" element={<Presentacion />} />
        <Route path="/rol" element={<Rol />} />
      </Routes>
    </BrowserRouter>
  );
};
