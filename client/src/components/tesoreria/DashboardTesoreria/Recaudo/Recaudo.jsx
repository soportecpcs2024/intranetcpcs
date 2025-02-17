import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../contexts/RecaudoContext";
import BuscadorEstudiante from "./buscador/BuscadorEstudiante";
import ListaClases from "./ListarClases/ListaClases";
import GenerarFactura from "./GenerarFactura";
import ListarFacturas from "./listarFactura/ListarFacturas";

const Recaudo = () => {
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

  const clasesFiltradas = clases.filter(
    (clase) =>
      clase.nombre !== "Antología" &&
      clase.nombre !== "El arte de ser padres" &&
      clase.nombre !== "Ciberfamilias"
  );

  const handleSelectClase = (clase) => {
    setSelectedClases((prevSelected) =>
      prevSelected.some((c) => c._id === clase._id)
        ? prevSelected.filter((c) => c._id !== clase._id)
        : [...prevSelected, { ...clase, descuento: false }]
    );
  };

  const aplicarDescuento = (claseId) => {
    setSelectedClases((prevSelected) =>
      prevSelected.map((c) =>
        c._id === claseId ? { ...c, descuento: !c.descuento } : c
      )
    );
  };

  const handleTipoPagoChange = (event) => {
    setTipoPago(event.target.value);
    setShowButton(true);
  };

  const generarFacturaLocal = () => {
    if (!estudiante || selectedClases.length === 0 || !tipoPago) {
      alert("Por favor, seleccione un estudiante, clases y tipo de pago.");
      return;
    }

    const nuevaFactura = {
      estudianteId: estudiante,
      clases: selectedClases.map((clase) => {
        const costoAplicado = clase.costoDescuento ?? clase.costo; // Usa costoDescuento si existe, sino costo normal
        return { ...clase, costoAplicado };
      }),
      tipoPago,
      total: selectedClases.reduce(
        (acc, clase) => acc + (clase.costoDescuento ?? clase.costo), // Usa costoDescuento si existe
        0
      ),
    };

    setFacturaActual(nuevaFactura);
    setEstudiantedata(nuevaFactura);
  };

  const handleGuardarFactura = async () => {
    if (!facturaActual) {
      alert("No hay factura para guardar.");
      return;
    }

    const facturaData = {
      estudianteId: facturaActual.estudianteId._id,
      clases: facturaActual.clases.map(({ _id, costoAplicado }) => ({
        claseId: _id,
        costo: costoAplicado, // Se usa el costo aplicado (con o sin descuento)
      })),
      tipoPago: facturaActual.tipoPago,
      total: facturaActual.total,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/recaudo/facturas`,
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
  };

  return (
    <div className="container-recaudo">
      <div className="container-recaudo-box">
        <BuscadorEstudiante
          fetchEstudianteById={fetchEstudianteById}
          setEstudiante={setEstudiante}
          setLoading={setLoading}
          estudiante={estudiante}
        />

        <ListaClases
          clases={clasesFiltradas}
          selectedClases={selectedClases}
          handleSelectClase={handleSelectClase}
          loading={loading}
        />

        <div  className="container-tipopago-flex">
          <div className="container-tipopago">
            <h4>Tipo de Pago :</h4>
            {["Efectivo", "Datáfono", "Nómina"].map((tipo) => (
              <label key={tipo}>
                <input
                  type="radio"
                  value={tipo}
                  checked={tipoPago === tipo}
                  onChange={handleTipoPagoChange}
                />{" "}
                {tipo}
              </label>
            ))}
          </div>

          <div className="container-tipopago-btn">
            {showButton && (
              <button onClick={generarFacturaLocal}>Pre Factura</button>
            )}
          </div>
        </div>
      </div>

      <div className="container-recaudo-box">
        <ListarFacturas ultimaFactura={facturaActual} />

        <div className="container-recaudo-box-save">
          <div>
            <button onClick={handleGuardarFactura}>Guardar Factura</button>
          </div>

          <div>
            {mostrarGenerarFactura && (
              <GenerarFactura
                factura={facturaGuardada}
                estudiante={estudiantedata}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recaudo;
