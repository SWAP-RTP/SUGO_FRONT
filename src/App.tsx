import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./General/components/Header";
import { Sugo_main } from "./General/components/Sugo_main";
import { Recepcion } from "./Recepcion";
import { Despacho } from "./Despacho";
import { Presentacion } from "./Presentacion";
import { Rol } from "./Rol";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
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
