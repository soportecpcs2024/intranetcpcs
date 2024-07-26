const StudentCard = ({ student }) => {
  const includedKeys = [
    "ciencias_naturales",
    "fisica",
    "quimica",
    "ciencias_politicas_economicas",
    "ciencias_sociales",
    "civica_y_constitucion",
    "educacion_artistica",
    "educacion_cristiana",
    "educacion_etica",
    "educacion_fisica",
    "filosofia",
    "idioma_extranjero",
    "lengua_castellana",
    "matematicas",
    "tecnologia"
  ];

  return (
    <div className="student-card-deficient">
      <div className="student-card-deficient-title">
        <h2>{student.nombre}</h2>
      </div>
      <div>

    <div className="student-card-deficient-container">

     
       <div className="card-header-deficient">
        <p>Grupo: {student.grupo}</p>
        <p>Periodo: {student.periodo}</p>
        <p>Promedio: {student.promedio}</p>
        <p>Puesto: {student.puesto}</p>
        <div  >
          <div className="card-body-estDificuntades">
            <label htmlFor="">
              <strong>Observaciones :</strong>{" "}
            </label>
            <p className="observaciones-text">
              {student.observaciones || "No hay observaciones disponibles"}
            </p>
          </div>
        </div>
        <div  >
          <div className="card-body">
            <label htmlFor="">
              <strong>Metas :</strong>{" "}
            </label>
            <p className="observaciones-text">
              {student.metas || "No hay metas disponibles"}
            </p>
          </div>
        </div>
        <div  >
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
            {includedKeys.map((key, index) => (
              <tr key={index}>
                <td>
                  <strong>{key.replace("_", " ")}:</strong>
                </td>
                <td className={student[key] < 3 ? "highlight" : ""}>
                  {student[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      
    </div>

     
    </div>
  );
};

export default StudentCard;
