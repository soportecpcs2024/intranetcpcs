import  { useState } from "react";
import { useNomina } from "../../../contexts/NominaContext";
import "./EliminarPorFecha.css";

const EliminarPorFecha = () => {
  const { loading, error, deleteNominaByFecha } = useNomina();

  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleEliminar = async () => {
    setMensaje("");

    if (!fecha) {
      setMensaje("Selecciona una fecha primero.");
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar TODA la nómina del día ${fecha}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    const result = await deleteNominaByFecha(fecha);

    if (result?.eliminados >= 0) {
      setMensaje(`✅ ${result.message} | Eliminados: ${result.eliminados} | Fecha: ${fecha}`);
    }
  };

  return (
    <div className="eliminar-container">
      <div className="eliminar-card">
        <h2>Eliminar Nómina por Fecha</h2>

        <div className="input-group">
          <label>Selecciona la fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="button-group single">
          <button
            className="btn btn-eliminar"
            onClick={handleEliminar}
            disabled={!fecha || loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        {mensaje && <div className="success">{mensaje}</div>}
        {error && <div className="error">{error}</div>}

         
      </div>
    </div>
  );
};

export default EliminarPorFecha;
