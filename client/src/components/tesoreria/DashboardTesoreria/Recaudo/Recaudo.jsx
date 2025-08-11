import { useState, useEffect } from "react";
import { useRecaudo } from "../../../../contexts/RecaudoContext";
import BuscadorEstudiante from "./buscador/BuscadorEstudiante";
import ListaClases from "./ListarClases/ListaClases";
import GenerarFactura from "./GenerarFactura";
import ListarFacturas from "./listarFactura/ListarFacturas";

const MonthSelector = ({ selectedMonth, setSelectedMonth }) => {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="month-selector">
    <label htmlFor="month">Aplicado al mes de: </label>
    <select
      id="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      <option value="">Selecciona</option>
      {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
      ))}
    </select>
  </div>
  
  );
};

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
  const [limpiarCampos, setLimpiarCampos] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (clases.length > 0) {
      setLoading(false);
    }
  }, [clases]);

  const clasesFiltradas = clases.filter(
    (clase) =>
      clase.nombre !== "Antología" &&
      clase.nombre !== "El arte de ser padres" &&
      clase.nombre !== "Ciberfamilias" &&
      clase.nombre !== "Mayordomía financiera" &&
      clase.nombre !== "Guiando a sus adolescentes" 

  );

  const handleSelectClase = (clase, aplicarDescuento) => {
    setSelectedClases((prevSelected) => {
      const existeClase = prevSelected.find((c) => c._id === clase._id);
  
      if (existeClase) {
        return prevSelected.filter((c) => c._id !== clase._id);
      } else {
        return [...prevSelected, { ...clase, costo: aplicarDescuento ? clase.costo / 2 : clase.costo }];
      }
    });
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
      clases: selectedClases.map((clase) => ({
        _id: clase._id,
        cod: clase.cod,
        nombre: clase.nombre,
        costo: clase.costoAplicado ?? clase.costo,
        dia: clase.dia,
        hora: clase.hora
      })),
      tipoPago,
      total: selectedClases.reduce((acc, clase) => acc + (clase.costoAplicado ?? clase.costo), 0),
      mes_aplicado:selectedMonth
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
      clases: facturaActual.clases.map(({ _id, costo }) => ({ claseId: _id, costo })),
      tipoPago: facturaActual.tipoPago,
      total: facturaActual.total,
      mes_aplicado:selectedMonth
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
      setLimpiarCampos(true);
      setTimeout(() => setLimpiarCampos(false), 100);

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
          limpiarCampos={limpiarCampos}
        />

        <ListaClases
          clases={clasesFiltradas}
          selectedClases={selectedClases}
          handleSelectClase={handleSelectClase}
          loading={loading}
        />

        <div className="container-tipopago-flex">
          <div className="container-tipopago">
            <h4>Tipo de Pago :</h4>
            {["Efectivo", "Datáfono", "Nómina","Banco"].map((tipo) => (
              <label key={tipo}>
                <input
                  type="radio"
                  value={tipo}
                  checked={tipoPago === tipo}
                  onChange={handleTipoPagoChange}
                /> {tipo}
              </label>
            ))}
          </div>

          
          <div>
          <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
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
              <GenerarFactura factura={facturaGuardada} estudiante={estudiantedata} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recaudo;
