import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Sugo_main } from "./components/Sugo_main";
import { FormularioRecepcion } from "./Recepcion/FormularioRecepcion";
import { FormularioDespacho } from "./Despacho/FormularioDespacho";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Sugo_main />} />
        <Route path="/despacho" element={<FormularioDespacho />} />
        <Route path="/recepcion" element={<FormularioRecepcion />} />
      </Routes>
    </BrowserRouter>
  );
};
