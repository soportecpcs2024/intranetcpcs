import React, { useEffect, useState } from 'react';
import { useEscuelaPadres } from '../../../contexts/EscuelaPadresContext';
import './HistoricoEP.css';

const HistoricoEP = () => {
  const {
    historicos,
    loading,
    cargarHistoricos,
    buscarHistoricoPorDocumento,
  } = useEscuelaPadres();

  const [documento, setDocumento] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const registrosPorPagina = 10;

  useEffect(() => {
    cargarHistoricos();
  }, []);

  const totalPaginas = Math.ceil(historicos.length / registrosPorPagina);

  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;

  const historicosPaginados = historicos.slice(indicePrimero, indiceUltimo);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setPaginaActual(1);

    if (!documento.trim()) {
      await cargarHistoricos();
      return;
    }

    await buscarHistoricoPorDocumento(documento.trim());
  };

  const limpiarBusqueda = async () => {
    setDocumento('');
    setPaginaActual(1);
    await cargarHistoricos();
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  return (
    <div className="historico-page">
      <div className="historico-header">
        <div>
          <h2>Histórico Escuela de Padres</h2>
          <p>Consulta de certificados, asistencias y escuelas por estudiante.</p>
        </div>

        <div className="historico-counter">
          <span>{historicos.length}</span>
          <small>registros</small>
        </div>
      </div>

      <form className="historico-search" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder="Buscar por documento del estudiante..."
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <button type="submit">Buscar</button>

        <button
          type="button"
          className="btn-clear"
          onClick={limpiarBusqueda}
        >
          Limpiar
        </button>
      </form>

      <div className="historico-table-card">
        {loading ? (
          <div className="historico-empty">Cargando histórico...</div>
        ) : historicos.length === 0 ? (
          <div className="historico-empty">
            No se encontraron registros.
          </div>
        ) : (
          <>
            <div className="historico-table-wrapper">
              <table className="historico-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Documento</th>
                    <th>Grupo</th>
                    <th>Escuela</th>
                    <th>Asistencias</th>
                    <th>Certificado</th>
                    <th>Periodo</th>
                  </tr>
                </thead>

                <tbody>
                  {historicosPaginados.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.estudiante?.nombre}</strong>
                      </td>
                      <td>{item.estudiante?.documento}</td>
                      <td>{item.estudiante?.grupo}</td>
                      <td>{item.escuela?.nombre}</td>
                      <td>
                        <span className="badge-asistencia">
                          {item.asistencias_resumen}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            item.certificadoOtorgado
                              ? 'badge-certificado success'
                              : 'badge-certificado danger'
                          }
                        >
                          {item.certificadoOtorgado
                            ? 'Otorgado'
                            : 'No otorgado'}
                        </span>
                      </td>
                      <td>
                        <span className="badge-periodo">
                          {item.año}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="historico-pagination">
              <button
                type="button"
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>

              <span>
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoricoEP;