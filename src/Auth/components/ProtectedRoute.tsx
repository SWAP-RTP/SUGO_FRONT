import { useAuth } from "../../General/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { estaAutenticado, cargando } = useAuth(); //

  if (cargando) return <div>Cargando Sesion...</div>;

  if (!estaAutenticado) {
    window.location.href = "http://10.10.30.28:8086/login.html";
    return null;
  }

  return children;
};
