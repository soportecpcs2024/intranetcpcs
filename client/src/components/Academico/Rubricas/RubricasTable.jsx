import React from "react";
import "./Rubricas.css";

const RubricasTable = ({ evaluaciones }) => {
  return (
    <div>
      <h3>Evaluaciones Guardadas</h3>
      <table className="rubricas-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Respuestas</th>
            <th>Observaciones</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.length > 0 ? (
            evaluaciones.map((eva, index) => (
              <tr key={eva._id}>
                <td>{index + 1}</td>
                <td>
                  {eva.respuestas.map((r) => (
                    <div key={r._id}>
                      <strong>{r.criterio}:</strong> {r.valor}
                    </div>
                  ))}
                </td>
                <td>{eva.observaciones}</td>
                <td>{new Date(eva.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No hay evaluaciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RubricasTable;
