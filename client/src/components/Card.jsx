
const StudentCard = ({ student }) => {
  const excludedKeys = ['_id', '__v', 'codigo'];

  return (
    <div className="student-card">
      <div className="card-header">
        <h2>{student.nombre}</h2>
        <p>Grupo: {student.grupo}</p>
        <p>Periodo: {student.periodo}</p>
      </div>
      <div className="card-body">
        <p><strong>Promedio:</strong> {student.promedio}</p>
        <p><strong>Observaciones:</strong> {student.observaciones}</p>
        <p><strong>Metas:</strong> {student.metas}</p>
        <p><strong>Reporte de nivelación:</strong> {student.reporte_nivelacion}</p>
      </div>
      <div className="card-footer">
        <h3>Detalles Académicos</h3>
        <table className="student-table">
          <tbody>
            {Object.keys(student).map((key, index) => (
              !excludedKeys.includes(key) && key !== 'nombre' && key !== 'grupo' && key !== 'periodo' && key !== 'observaciones' && key !== 'metas' && key !== 'reporte_nivelacion' && (
                <tr key={index}>
                  <td><strong>{key.replace('_', ' ')}:</strong></td>
                  <td className={student[key] < 3 ? 'highlight' : ''}>{student[key]}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentCard;
