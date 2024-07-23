const StudentCard = ({ student }) => {
  const excludedKeys = ["_id", "__v", "codigo"];

  return (
    <div className="student-card-deficient">
      <div className="card-header-deficient">
        <h2>{student.nombre}</h2>
        <p>Grupo: {student.grupo}</p>
        <p>Periodo: {student.periodo}</p>
        <p> Promedio: {student.promedio}</p>
        <p> Puesto: {student.puesto}</p>
        <div className="card-container">
          <div className="card-body">
            <label htmlFor="">
              <strong>Observaciones :</strong>{" "}
            </label>
            <p className="observaciones-text">
              {student.observaciones || "No hay observaciones disponibles"}
            </p>
          </div>
        </div>
        <div className="card-container">
          <div className="card-body">
            <label htmlFor="">
              <strong>Metas :</strong>{" "}
            </label>
            <p className="observaciones-text">
              {student.metas || "No hay metas disponibles"}
            </p>
          </div>
        </div>
        <div className="card-container">
          <div className="card-body">
            <label htmlFor="">
              <strong>Reporte de nivelación:</strong>{" "}
            </label>
            <p className="observaciones-text">
              {student.reporte_nivelacion || "No hay observaciones disponibles"}
            </p>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <h3>Detalles Académicos</h3>
        <table className="student-table">
          <tbody>
            {Object.keys(student).map(
              (key, index) =>
                !excludedKeys.includes(key) &&
                key !== "nombre" &&
                key !== "puesto" &&
                key !== "promedio" &&
                key !== "grupo" &&
                key !== "periodo" &&
                key !== "observaciones" &&
                key !== "metas" &&
                key !== "reporte_nivelacion" && (
                  <tr key={index}>
                    <td>
                      <strong>{key.replace("_", " ")}:</strong>
                    </td>
                    <td className={student[key] < 3 ? "highlight" : ""}>
                      {student[key]}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentCard;
