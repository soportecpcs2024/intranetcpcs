import "./reporteAsistencias.css";

const ReporteAsistencias = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  const clasesAgrupadas = {};
 
  
  data.forEach((item) => {
    const clase = item.clases?.[0]?.nombre || "Sin clase";
    const estudiante = {
      nombreEstudiante: item.nombreEstudiante || "Sin nombre",
      grado: item.estudianteId?.grado?.trim() || "Sin grado",
      asistencias: item.asistencias || {},
      clasenombre: item.clases?.[0]?.nombreClase || "Sin nombre de clase",

    };

    if (!clasesAgrupadas[clase]) {
      clasesAgrupadas[clase] = [];
    }

    clasesAgrupadas[clase].push(estudiante);
  });

  return (
    <div className="reporte-asistencia-container">
      {Object.entries(clasesAgrupadas).map(([claseNombre, estudiantes], index) => {
        const asistenciasPorcentaje = estudiantes.map((est) => {
          const total = Object.values(est.asistencias).filter((a) => a === true).length;
          const porcentaje = Math.round((total / 4) * 100);
          return { ...est, porcentaje };
        });

        const cero = asistenciasPorcentaje.filter((e) => e.porcentaje === 0);
        const completo = asistenciasPorcentaje.filter((e) => e.porcentaje === 100);
        const parcial = asistenciasPorcentaje.filter((e) => e.porcentaje > 0 && e.porcentaje < 100);

        const renderGrupo = (grupo, colorClase, titulo) => (
          <div className="asistencia-columna">
            <h4 className={`titulo-${colorClase}`}>Asistencia {titulo} ({grupo.length})</h4>
            {grupo.map((est, idx) => (
              <div key={idx} className={`asistencia-item ${colorClase}`}>
                <div>
                  <strong>{est.nombreEstudiante}</strong> <br />
                  Grado: {est.grado} <br />
                </div>
                  Clase: {est.clasenombre} <br />
                <div>Asistencia: {est.porcentaje}%</div>
              </div>
            ))}
          </div>
        );

        return (
          <div className="card-clase" key={index}>
            <div className="reporte-asistencia-titulo"><h3>Reporte Asistencias</h3> </div>
            <div className="asistencia-grid">
              {renderGrupo(completo, "verde", "🟢 100%")}
              {renderGrupo(parcial, "amarilla", "🟡 Parcial")}
              {renderGrupo(cero, "roja", "🔴 0%")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReporteAsistencias;
