import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { GiTropicalFish } from "react-icons/gi";
import BuscadorEstudiante from "../buscador/BuscadorEstudiante";
import { MdNoFood } from "react-icons/md";
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

  useEffect(() => {
    if (almuerzo.length === 0) {
      console.log("Forzando carga de almuerzos...");
      fetchAlmuerzos();
    }
  }, [almuerzo, fetchAlmuerzos]);

  const handleCantidadChange = (id, cantidad) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: cantidad,
    }));
  };

  const guardarFactura = async () => {
    if (!estudiante) {
      alert("Seleccione un estudiante antes de guardar la factura");
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
      const response = await crearAlmuerzoFactura({
        estudianteId: estudiante._id,
        almuerzos: factura,
      });

      alert("Factura guardada correctamente");
      setSeleccionados({}); // Limpia la selección después de guardar
      setEstudiante(null); // Reiniciar estudiante seleccionado
      setLimpiarCampos(true);

      // Resetear limpiarCampos después de un pequeño retraso
      setTimeout(() => setLimpiarCampos(false), 100);
    } catch (error) {
      console.error(
        "Error al guardar la factura:",
        error?.response?.data || error
      );
      alert("Hubo un error al guardar la factura");
    }
  };
  const calcularTotal = () => {
    const total = Object.entries(seleccionados).reduce((total, [id, cantidad]) => {
      const almuerzoItem = almuerzo.find((item) => item._id === id);
      return total + (almuerzoItem ? almuerzoItem.costo * cantidad : 0);
    }, 0);
  
    return total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };
  
  

  return (
    <div className="container-almuerzo">
      <h2 className="title-almuerzo">Seleccionar Almuerzos</h2>
  
      <BuscadorEstudiante
        fetchEstudianteById={fetchEstudianteById}
        setEstudiante={setEstudiante}
        setLoading={setLoading}
        estudiante={estudiante}
        limpiarCampos={limpiarCampos}
      />
  
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
  
        <div className="almuerzo_btn">
          <div className="almuerzo-totales">
            <div>
              <h3>TOTAL</h3>
            </div>
            <div>
              <h2 className="almuerzo_btn-p">{calcularTotal()}</h2>
            </div>
          </div>
          <div>
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
