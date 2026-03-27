// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { useState } from "react";
// // hooks personalizados
// import { useHook_General } from "../../General/hooks/useHook";

// export const Servicio = () => {
//   const { modalidadesOptions, rutasOptions } = useHook_General();

//   // estado para almacenar la modalidad seleccionada
//   const [modalidadSelect, setModalidadSelect] = useState(null);
//   // estado para las rutas seleccionada
//   const [rutaSelect, setRutaSelect] = useState(null);

//   const ecoDe = [
//     { label: "Planta", value: "Planta" },
//     { label: "Postura", value: "Postura" },
//   ];

//   return (
//     <>
//       {/* primera fila - Credencial y Turno */}
//       <div className="d-flex flex-wrap gap-2 py-2 px-2 justify-content-center">
//         <span className="p-float-label input-servicio">
//           <InputText className="select" />
//           <label htmlFor="credencial">Credencial</label>
//         </span>

//         <span className="p-float-label input-servicio">
//           <InputText className="select" />
//           <label htmlFor="turno">Turno</label>
//         </span>
//       </div>

//       {/* segunda fila - Eco de y No.Extintor */}
//       <div className="d-flex flex-wrap gap-2 mt-3 py-2 px-2 justify-content-center">
//         <span className="p-float-label input-servicio">
//           <Dropdown inputId="dd-ecoDe" className="select" options={ecoDe} />
//           <label htmlFor="dd-ecoDe">Eco de</label>
//         </span>

//         <span className="p-float-label input-servicio">
//           <InputText className="select" />
//           <label htmlFor="extintor">No.Extintor</label>
//         </span>
//       </div>

//       {/* tercera fila - Modalidad y Ruta */}
//       <div className="d-flex flex-wrap gap-2 mt-3 py-2 px-2 justify-content-center">
//         <span className="p-float-label input-servicio">
//           <Dropdown
//             inputId="dd-modalidad"
//             className="select"
//             options={modalidadesOptions}
//             value={modalidadSelect}
//             onChange={(e) => setModalidadSelect(e.value)}
//           />
//           <label htmlFor="dd-modalidad">Modalidad</label>
//         </span>

//         <span className="p-float-label input-servicio">
//           <Dropdown
//             inputId="dd-ruta"
//             className="select"
//             options={rutasOptions}
//             value={rutaSelect}
//             onChange={(e) => setRutaSelect(e.value)}
//           />
//           <label htmlFor="dd-ruta">Ruta</label>
//         </span>
//       </div>

//       {/* cuarta fila - CC y Entrada Operador */}
//       <div className="d-flex flex-wrap gap-2 mt-3 py-2 px-2 justify-content-center">
//         <span className="p-float-label input-servicio">
//           <InputText className="select" />
//           <label htmlFor="cc">CC</label>
//         </span>

//         <span className="p-float-label input-servicio">
//           <InputText className="select" />
//           <label htmlFor="entrada">Entrada Operador</label>
//         </span>
//       </div>
//     </>
//   );
// };
