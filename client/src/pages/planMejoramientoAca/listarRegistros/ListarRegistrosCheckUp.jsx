import React, { useContext, useEffect, useMemo, useState } from "react";
import { CheckupContext } from "../../../contexts/CheckupContext";
import "./ListarRegistrosCheckUp.css";

const ListarRegistrosCheckUp = () => {
  const { todasRespuestas, listarTodasRespuestas, loading, error } =
    useContext(CheckupContext);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const ITEMS_POR_PAGINA = 15;

  useEffect(() => {
    listarTodasRespuestas();
  }, [listarTodasRespuestas]);

  const calcularPromedio = (answers = []) => {
    if (!answers.length) return "0.00";

    const total = answers.reduce(
      (acc, item) => acc + Number(item.score || 0),
      0
    );

    return (total / answers.length).toFixed(2);
  };

  const datosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return (todasRespuestas || []).filter((item) => {
      return (
        item?.docenteId?.name?.toLowerCase().includes(texto) ||
        item?.docenteId?.email?.toLowerCase().includes(texto) ||
        item?.grupo?.toLowerCase().includes(texto) ||
        item?.area?.toLowerCase().includes(texto) ||
        String(item?.periodo || "").includes(texto)
      );
    });
  }, [todasRespuestas, busqueda]);

  const registrosPorDocente = useMemo(() => {
    const map = {};

    datosFiltrados.forEach((item) => {
      const nombre = item?.docenteId?.name || "Sin docente";
      map[nombre] = (map[nombre] || 0) + 1;
    });

    return Object.entries(map)
      .map(([docente, total]) => ({ docente, total }))
      .sort((a, b) => b.total - a.total);
  }, [datosFiltrados]);

  const totalPaginas = Math.ceil(datosFiltrados.length / ITEMS_POR_PAGINA);

  const registrosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return datosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [datosFiltrados, paginaActual]);

  return (
    <div className="cs-page-list">
      <div className="cs-shell-B">
        <div className="cs-card">
          <h2 className="cs-title">Histórico CheckUp Institucional</h2>

          <input
            className="cs-control"
            type="text"
            placeholder="Buscar por docente, grupo, área o período..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          {loading && (
            <div className="cs-loading-container">
              <div className="cs-spinner"></div>
              <p>Cargando registros institucionales...</p>
            </div>
          )}

          {error && (
            <div className="cs-alert cs-alert-error">
              Error cargando registros.
            </div>
          )}

          {!loading && (
            <>
              <div className="cs-docente-summary">
                {registrosPorDocente.map((item) => (
                  <div className="cs-docente-chip" key={item.docente}>
                    <span>{item.docente}</span>
                    <strong>{item.total}</strong>
                  </div>
                ))}
              </div>

              <div className="cs-table-wrap">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      
                      <th>Área</th>
                      <th>Grupo</th>
                      <th>Período</th>
                      <th>Semana</th>
                      <th>Promedio</th>
                      <th>Respuestas</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registrosPagina.map((item) => (
                      <tr key={item._id}>
                        <td>{item?.docenteId?.name || "Sin docente"}</td>
                        
                        <td>{item.area}</td>
                        <td>{item.grupo}</td>
                        <td>{item.periodo}</td>
                        <td>
                          {new Date(item.weekStart).toLocaleDateString("es-CO")}
                        </td>
                        <td>{calcularPromedio(item.answers)}</td>
                        <td>{item.answers?.length || 0}</td>
                        <td className="observaciones">{item.observaciones || "Sin observaciones"}</td>
                      </tr>
                    ))}

                    {registrosPagina.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>
                          No se encontraron registros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="cs-pagination">
                <button
                  className="cs-btn cs-btn-secondary"
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((prev) => prev - 1)}
                >
                  Anterior
                </button>

                <span>
                  Página {paginaActual} de {totalPaginas || 1}
                </span>

                <button
                  className="cs-btn cs-btn-secondary"
                  disabled={paginaActual === totalPaginas || totalPaginas === 0}
                  onClick={() => setPaginaActual((prev) => prev + 1)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListarRegistrosCheckUp;