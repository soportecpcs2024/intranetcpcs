import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { MdNoFood } from "react-icons/md";
import BuscadorEstudiante from "../buscador/BuscadorEstudiante";
import "./Almuerzos.css";

const Almuerzos = () => {
  const {
    almuerzo,
    fetchAlmuerzos,
    crearAlmuerzoFactura,
    fetchEstudianteById,
  } = useRecaudo();
  const [seleccionados, setSeleccionados] = useState({});
  const [estudiante, setEstudiante] = useState(null);
  const [limpiarCampos, setLimpiarCampos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const [showButton, setShowButton] = useState(false);

  const [ultimaFactura, setUltimaFactura] = useState(null);

  // Cargar almuerzos si no están en el contexto
  useEffect(() => {
    if (almuerzo.length === 0) {
      fetchAlmuerzos();
    }
  }, [almuerzo, fetchAlmuerzos]);

  // Manejar cambios en la cantidad de almuerzos seleccionados
  const handleCantidadChange = (id, cantidad) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: cantidad,
    }));
  };

 

  // Manejar cambio de tipo de pago y mostrar el botón de Pre Factura
  const handleTipoPagoChange = (event) => {
    setTipoPago(event.target.value);
    setShowButton(true);
  };

  // Calcular el total a pagar
  const calcularTotal = () => {
    const total = Object.entries(seleccionados).reduce(
      (sum, [id, cantidad]) => {
        const almuerzoItem = almuerzo.find((item) => item._id === id);
        return sum + (almuerzoItem ? almuerzoItem.costo * cantidad : 0);
      },
      0
    );

    return total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  // Guardar factura con validaciones
  const guardarFactura = async () => {
    if (!estudiante) {
      alert("Seleccione un estudiante antes de guardar la factura");
      return;
    }

    if (!tipoPago) {
      alert("Seleccione un tipo de pago antes de guardar la factura");
      return;
    }

    const factura = Object.entries(seleccionados)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([id, cantidad]) => ({
        almuerzoId: id,
        cantidad: cantidad,
      }));

    if (factura.length === 0) {
      alert("Seleccione al menos un almuerzo");
      return;
    }

    try {
      await crearAlmuerzoFactura({
        estudianteId: estudiante._id,
        almuerzos: factura,
        tipoPago, // Se incluye el tipo de pago
      });

      alert("Factura guardada correctamente");
      setSeleccionados({});
      setEstudiante(null);
      setTipoPago("");
      setLimpiarCampos(true);
      setShowButton(false);

      setTimeout(() => setLimpiarCampos(false), 100);
    } catch (error) {
      console.error(
        "Error al guardar la factura:",
        error?.response?.data || error
      );
      alert("Hubo un error al guardar la factura");
    }
  };

  return (
    <div className="container-almuerzo">
      <h2 className="title-almuerzo">Seleccionar Almuerzos</h2>

      {/* Buscador de Estudiantes */}
      <BuscadorEstudiante
        fetchEstudianteById={fetchEstudianteById}
        setEstudiante={setEstudiante}
        setLoading={setLoading}
        estudiante={estudiante}
        limpiarCampos={limpiarCampos}
      />

      {/* Lista de Almuerzos */}
      <div className="lista-almuerzos">
        {almuerzo.length > 0 ? (
          almuerzo.map((item) => (
            <div key={item._id} className="almuerzo-item">
              <MdNoFood className="icono-almuerzo" />
              <span className="almuerzo-info">
                {item.nombre} - <strong>${item.costo}</strong>
              </span>
              <input
                type="number"
                min="0"
                className="almuerzo-conteo"
                value={seleccionados[item._id] || 0}
                onChange={(e) =>
                  handleCantidadChange(
                    item._id,
                    parseInt(e.target.value, 10) || 0
                  )
                }
              />
            </div>
          ))
        ) : (
          <p className="texto-vacio">No hay almuerzos disponibles</p>
        )}

        {/* Sección de Totales y Tipo de Pago */}
        <div className="almuerzo_btn">
          <div className="almuerzo-totales">
            <h3>TOTAL</h3>
            <h2 className="almuerzo_btn-p">{calcularTotal()}</h2>
          </div>

          {/* Selección de Tipo de Pago */}
          <div className="container-tipopago-flex">
            <div className="container-tipopago">
              <h4>Tipo de Pago:</h4>
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
          </div>

          <div>
            {/* Botón para Guardar Factura */}
            <button onClick={guardarFactura} className="boton-guardar">
              Guardar Factura
            </button>
          </div>
          
           
        </div>
      </div>
    </div>
  );
};

export default Almuerzos;
