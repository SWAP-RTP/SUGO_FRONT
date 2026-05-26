import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./General/components/Header";
import { Sugo_main } from "./General/components/Sugo_main";
import { Recepcion } from "./Recepcion";
import { Despacho } from "./Despacho";
import { Presentacion } from "./Presentacion";
import { Rol } from "./Rol";
import { useAuth } from "./General/hooks/useAuth";
import { ProtectedRoute } from "./Auth/components/ProtectedRoute";
import { Mantenimiento } from "./mantenimiento";

export const App = () => {
  const { usuario, logout } = useAuth();

  return (
    <BrowserRouter>
      <Header user={usuario} onLogout={logout} />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Sugo_main />
          </ProtectedRoute>} />
        <Route path="/despacho" element={
          <ProtectedRoute>
            <Despacho />
          </ProtectedRoute>} />
        <Route path="/recepcion" element={
          <ProtectedRoute>
            <Recepcion />
          </ProtectedRoute>} />
        <Route path="/presentacion" element={
          <ProtectedRoute>
            <Presentacion />
          </ProtectedRoute>} />
        <Route path="/rol" element={
          <ProtectedRoute>
            <Rol />
          </ProtectedRoute>} />
        <Route path="/mantenimiento" element={
          <ProtectedRoute>
            <Mantenimiento />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};
