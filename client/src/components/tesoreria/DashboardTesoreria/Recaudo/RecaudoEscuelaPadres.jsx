import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../contexts/RecaudoContext";
import BuscadorEstudiante from "./buscador/BuscadorEstudiante";
import ListaClases from "./ListarClases/ListaClases";
import GenerarFactura from "./GenerarFactura";
import ListarFacturas from "./listarFactura/ListarFacturas";
import ListaClasesEscuelaPadres from "./ListarClases/ListarclasesEscuelaPadres";

const Recaudoep = () => {
    const { clases, fetchEstudianteById } = useRecaudo();
    const [loading, setLoading] = useState(true);
    const [selectedClases, setSelectedClases] = useState([]);
    const [estudiante, setEstudiante] = useState(null);
    const [tipoPago, setTipoPago] = useState("");
    const [showButton, setShowButton] = useState(false);
    const [facturaActual, setFacturaActual] = useState(null);
    const [facturaGuardada, setFacturaGuardada] = useState(null);
    const [estudiantedata, setEstudiantedata] = useState([]);
    const [mostrarGenerarFactura, setMostrarGenerarFactura] = useState(false);
  
    useEffect(() => {
      if (clases.length > 0) {
        setLoading(false);
      }
    }, [clases]);
  
    // Filtrar clases que solo sean "Antología"
    const clasesep = clases.filter(
      (clase) => 
        
        clase.nombre === "El arte de ser padres" || 
        clase.nombre === "Ciberfamilias"
    );
    
  
    return (
      <div className="container-recaudo">
        <div className="container-recaudo-box">
          <BuscadorEstudiante
            fetchEstudianteById={fetchEstudianteById}
            setEstudiante={setEstudiante}
            setLoading={setLoading}
            limpiarBuscador={() => setEstudiante(null)}
            estudiante={estudiante}
          />
  
          <ListaClasesEscuelaPadres
            clases={clasesep} // Solo se pasan las clases de Antología
            selectedClases={selectedClases}
            handleSelectClase={(clase) => {
              setSelectedClases((prevSelected) =>
                prevSelected.some((c) => c._id === clase._id)
                  ? prevSelected.filter((c) => c._id !== clase._id)
                  : [...prevSelected, clase]
              );
            }}
            loading={loading}
          />
  
          <div className="container-tipopago">
            <h4>Tipo de Pago :</h4>
            <label>
              <input
                type="radio"
                value="Efectivo"
                checked={tipoPago === "Efectivo"}
                onChange={(e) => {
                  setTipoPago(e.target.value);
                  setShowButton(true);
                }}
              />{" "}
              Efectivo
            </label>
            <label>
              <input
                type="radio"
                value="Datáfono"
                checked={tipoPago === "Datáfono"}
                onChange={(e) => {
                  setTipoPago(e.target.value);
                  setShowButton(true);
                }}
              />{" "}
              Datáfono
            </label>
            <label>
              <input
                type="radio"
                value="Nómina"
                checked={tipoPago === "Nómina"}
                onChange={(e) => {
                  setTipoPago(e.target.value);
                  setShowButton(true);
                }}
              />{" "}
              Nómina
            </label>
          </div>
          <div className="container-recaudo-btn">
            {showButton && (
              <button onClick={() => {
                if (!estudiante || selectedClases.length === 0 || !tipoPago) {
                  alert("Por favor, seleccione un estudiante, clases y tipo de pago.");
                  return;
                }
                const nuevaFactura = {
                  estudianteId: estudiante,
                  clases: selectedClases,
                  tipoPago,
                  total: selectedClases.reduce((acc, clase) => acc + clase.costo, 0),
                };
                setFacturaActual(nuevaFactura);
                setEstudiantedata(nuevaFactura);
              }}>
                Pre Factura
              </button>
            )}
          </div>
        </div>
  
        <div className="container-recaudo-box">
          <ListarFacturas ultimaFactura={facturaActual} />
          <div className="container-recaudo-box-btn">
            <button onClick={async () => {
              if (!facturaActual) {
                alert("No hay factura para guardar.");
                return;
              }
              try {
                const response = await fetch(
                  `${import.meta.env.VITE_BACKEND_URL}/api/recaudo/facturas`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      estudianteId: facturaActual.estudianteId._id,
                      clases: facturaActual.clases.map(({ _id }) => ({ claseId: _id })),
                      tipoPago: facturaActual.tipoPago,
                    }),
                  }
                );
  
                if (!response.ok) {
                  throw new Error("Error al guardar la factura");
                }
  
                const nuevaFacturaGuardada = await response.json();
                setFacturaGuardada(nuevaFacturaGuardada);
                alert("Factura guardada correctamente");
                setMostrarGenerarFactura(true);
                setFacturaActual(null);
                setSelectedClases([]);
                setEstudiante(null);
                setTipoPago("");
                setShowButton(false);
              } catch (error) {
                alert(error.message);
              }
            }}>
              Guardar Factura
            </button>
          </div>
        </div>
  
        {mostrarGenerarFactura && (
          <GenerarFactura factura={facturaGuardada} estudiante={estudiantedata} />
        )}
      </div>
    );
  };
  
  export default Recaudoep;
  