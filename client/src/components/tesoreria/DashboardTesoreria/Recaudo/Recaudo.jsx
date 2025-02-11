import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../contexts/RecaudoContext";
import BuscadorEstudiante from "./buscador/BuscadorEstudiante";
import ListaClases from "./ListarClases/ListaClases";
import GenerarFactura from "./GenerarFactura";
import ListarFacturas from "./listarFactura/ListarFacturas";
import GenerarFacturadocumento from "./generarFacturadocumento/GenerarFacturadocumento";

const Recaudo = () => {
  const { clases, fetchEstudianteById } = useRecaudo();
  const [loading, setLoading] = useState(true);
  const [selectedClases, setSelectedClases] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [tipoPago, setTipoPago] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [facturaActual, setFacturaActual] = useState(null);
  const [facturaGuardada, setFacturaGuardada] = useState(null);
  const [estudiantedata, setEstudiantedata] = useState([]); // Estado para mostrar la factura guardada
  const [mostrarGenerarFactura, setMostrarGenerarFactura] = useState(false); // Nuevo estado

  useEffect(() => {
    if (clases.length > 0) {
      setLoading(false);
    }
  }, [clases]);

  const handleSelectClase = (clase) => {
    setSelectedClases((prevSelected) =>
      prevSelected.some((c) => c._id === clase._id)
        ? prevSelected.filter((c) => c._id !== clase._id)
        : [...prevSelected, clase]
    );
  };

  const limpiarClases = () => setSelectedClases([]);
  const limpiarBuscador = () => setEstudiante(null);

  const handleTipoPagoChange = (event) => {
    setTipoPago(event.target.value);
    setShowButton(true);
  };

  // Generar factura localmente antes de enviarla
  const generarFacturaLocal = () => {
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

    setFacturaActual(nuevaFactura); // Se actualiza en la UI inmediatamente
    setEstudiantedata(nuevaFactura);
  };

  const handleGuardarFactura = async () => {
    if (!facturaActual) {
      alert("No hay factura para guardar.");
      return;
    }

    const facturaData = {
      estudianteId: facturaActual.estudianteId._id,
      clases: facturaActual.clases.map(({ _id }) => ({ claseId: _id })),
      tipoPago: facturaActual.tipoPago,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/recaudo/facturas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(facturaData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar la factura");
      }

      const nuevaFacturaGuardada = await response.json();
      setFacturaGuardada(nuevaFacturaGuardada); // Guardar factura en estado

      alert("Factura guardada correctamente");

      // Después de aceptar el alert, mostrar GenerarFactura
      setMostrarGenerarFactura(true);

      // Limpiar los campos después de guardar la factura
      setFacturaActual(null);
      setSelectedClases([]);
      setEstudiante(null);
      setTipoPago("");
      setShowButton(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container-recaudo">
      <div className="container-recaudo-box">
        <BuscadorEstudiante
          fetchEstudianteById={fetchEstudianteById}
          setEstudiante={setEstudiante}
          setLoading={setLoading}
          limpiarBuscador={limpiarBuscador}
          estudiante={estudiante}
        />

        <ListaClases
          clases={clases}
          selectedClases={selectedClases}
          handleSelectClase={handleSelectClase}
          loading={loading}
        />

        <div className="container-tipopago">
          <h4>Tipo de Pago :</h4>
          <label>
            <input
              type="radio"
              value="Efectivo"
              checked={tipoPago === "Efectivo"}
              onChange={handleTipoPagoChange}
            />{" "}
            Efectivo
          </label>
          <label>
            <input
              type="radio"
              value="Transferencia"
              checked={tipoPago === "Transferencia"}
              onChange={handleTipoPagoChange}
            />{" "}
            Transferencia
          </label>
        </div>
        <div className="container-recaudo-btn">
          {showButton && (
            <button onClick={generarFacturaLocal}>Pre Factura</button>
          )}
        </div>
      </div>

      <div className="container-recaudo-box">
        <div>
          <ListarFacturas ultimaFactura={facturaActual} />
        </div>
        <div className="container-recaudo-box-btn">
          <button onClick={handleGuardarFactura}>Guardar Factura</button>
        </div>
      </div>

      <div className="">
        {mostrarGenerarFactura && (
          <GenerarFactura
            factura={facturaGuardada}
            estudiante={estudiantedata}
          />
        )}
      </div>
    </div>
  );
};

export default Recaudo;
