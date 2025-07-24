import React, { useContext, useState, useEffect } from "react";
import { TareasContext } from "../../../contexts/TareaContext";
import "./mantenimientos.css";

const SeguimientoMantenimiento = () => {
  const {
    mantenimientos,
    actualizarMantenimiento,
    obtenerMantenimientos,
  } = useContext(TareasContext);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  useEffect(() => {
    obtenerMantenimientos();
  }, []);

  const filtrarMantenimientos = () => {
    return mantenimientos.filter((m) => {
      const cumpleTipo = filtroTipo ? m.tipoMantenimiento === filtroTipo : true;
      const cumpleEstado = filtroEstado ? m.estado === filtroEstado : true;
      const cumpleMes = filtroMes
        ? new Date(m.fechaProgramada).getMonth() + 1 === parseInt(filtroMes)
        : true;
      return cumpleTipo && cumpleEstado && cumpleMes;
    });
  };

  const resumen = {
    total: mantenimientos.length,
    porTipo: {
      Preventivo: mantenimientos.filter((m) => m.tipoMantenimiento === "Preventivo").length,
      Correctivo: mantenimientos.filter((m) => m.tipoMantenimiento === "Correctivo").length,
    },
    porEstado: {
      Pendiente: mantenimientos.filter((m) => m.estado === "Pendiente").length,
      Terminado: mantenimientos.filter((m) => m.estado === "Terminado").length,
    },
  };

  const marcarComoTerminado = async (id) => {
    try {
      await actualizarMantenimiento(id, { estado: "Terminado" });
      await obtenerMantenimientos();
    } catch (error) {
      console.error("Error al marcar como terminado:", error);
    }
  };

  const filtrados = filtrarMantenimientos();

  return (
    <div className="seguimiento-container">
      <h2>Seguimiento de Mantenimientos</h2>

      <div className="filtros">
        <select onChange={(e) => setFiltroTipo(e.target.value)} value={filtroTipo}>
          <option value="">Tipo de mantenimiento</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
        </select>

        <select onChange={(e) => setFiltroEstado(e.target.value)} value={filtroEstado}>
          <option value="">Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Terminado">Terminado</option>
        </select>

        <select onChange={(e) => setFiltroMes(e.target.value)} value={filtroMes}>
          <option value="">Mes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <div className="resumen">
        <p>Total: {resumen.total}</p>
        <p>Preventivos: {resumen.porTipo.Preventivo}</p>
        <p>Correctivos: {resumen.porTipo.Correctivo}</p>
        <p>Pendientes: {resumen.porEstado.Pendiente}</p>
        <p>Terminados: {resumen.porEstado.Terminado}</p>
      </div>

      <table>
        <thead className="tabla-cabecera">
          <tr>
            <th>Título</th>
            <th>Responsable</th>
            <th>Área</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Programado terminar</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((m) => (
            <tr key={m._id}>
              <td data-label="Título">{m.titulo}</td>
              <td data-label="Responsable">{m.responsable}</td>
              <td data-label="Área">{m.area}</td>
              <td data-label="Tipo">{m.tipoMantenimiento}</td>
              <td
                data-label="Estado"
                className={m.estado === "Terminado" ? "estado terminado" : "estado pendiente"}
              >
                {m.estado}
              </td>
              <td data-label="Programado terminar">
                {new Date(m.fechaProgramada).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </td>
              <td data-label="Acción">
                {m.estado === "Pendiente" ? (
                  <button className="btn-fin" onClick={() => marcarComoTerminado(m._id)}>
                    Terminar
                  </button>
                ) : (
                  <span className="terminado">✓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeguimientoMantenimiento;
