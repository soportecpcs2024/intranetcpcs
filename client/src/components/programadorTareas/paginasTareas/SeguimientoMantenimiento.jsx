import React, { useContext, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { TareasContext } from "../../../contexts/TareaContext";
import "./mantenimientos.css";

const ITEMS_PER_PAGE = 20;

const SeguimientoMantenimiento = () => {
  const {
    mantenimientos,
    actualizarMantenimiento,
    obtenerMantenimientos,
  } = useContext(TareasContext);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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

  const filtrados = filtrarMantenimientos();

  // Paginación
  const pageCount = Math.ceil(filtrados.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = filtrados.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
        <thead>
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
          {currentItems.map((m) => (
            <tr key={m._id}>
              <td>{m.titulo}</td>
              <td>{m.responsable}</td>
              <td>{m.area}</td>
              <td>{m.tipoMantenimiento}</td>
              <td className={m.estado === "Terminado" ? "estado terminado" : "estado pendiente"}>
                {m.estado}
              </td>
              <td>
                {new Date(m.fechaProgramada).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </td>
              <td>
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

      {/* Paginación */}
      <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Siguiente →"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"paginacion"}
        activeClassName={"paginacion-activa"}
        previousClassName={"paginacion-prev"}
        nextClassName={"paginacion-next"}
      />
    </div>
  );
};

export default SeguimientoMantenimiento;
