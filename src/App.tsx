import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./General/components/Header";
import { Sugo_main } from "./General/components/Sugo_main";
import { Recepcion } from "./Recepcion";
import { Despacho } from "./Despacho";
import { Presentacion } from "./Presentacion";
import { Rol } from "./Rol";
import { useAuth } from "./General/hooks/useAuth";
import { ProtectedRoute } from "./Auth/components/ProtectedRoute";
import { Mantenimiento } from "./mantenimiento";

/**
 * App
 * 
 * Componente raíz de enrutamiento de la aplicación (`React Router`).
 * 
 * Funcionalidades principales:
 * 1. Define las rutas del sistema (`/`, `/despacho`, `/recepcion`, `/presentacion`, `/rol`, `/mantenimiento`).
 * 2. Protege todas las vistas envolviéndolas en el middleware `<ProtectedRoute>`, el cual verifica
 *    la sesión JWT y redirige al portal unificado si el token no está presente.
 * 3. Renderiza la barra de navegación superior global `<Header>` pasando los datos de sesión y logout.
 */
export const App = () => {
  // Obtiene los datos del usuario autenticado y la función de cierre de sesión desde el hook global
  const { usuario, logout } = useAuth();

  return (
    <BrowserRouter>
      {/* Barra de navegación principal visible en todas las rutas protegidas */}
      <Header user={usuario} onLogout={logout} />
      
      {/* Definición de las rutas del sistema */}
      <Routes>
        {/* Ruta principal / Home */}
        <Route path="/" element={
          <ProtectedRoute>
            <Sugo_main />
          </ProtectedRoute>} />

        {/* Ruta del módulo de Despacho de Unidades */}
        <Route path="/despacho" element={
          <ProtectedRoute>
            <Despacho />
          </ProtectedRoute>} />

        {/* Ruta del módulo de Recepción de Unidades */}
        <Route path="/recepcion" element={
          <ProtectedRoute>
            <Recepcion />
          </ProtectedRoute>} />

        {/* Ruta del módulo de Hora de Presentación de Operadores */}
        <Route path="/presentacion" element={
          <ProtectedRoute>
            <Presentacion />
          </ProtectedRoute>} />

        {/* Ruta del módulo de Rol de Servicio */}
        <Route path="/rol" element={
          <ProtectedRoute>
            <Rol />
          </ProtectedRoute>} />

        {/* Ruta del módulo de Mantenimiento de Unidades */}
        <Route path="/mantenimiento" element={
          <ProtectedRoute>
            <Mantenimiento />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};
