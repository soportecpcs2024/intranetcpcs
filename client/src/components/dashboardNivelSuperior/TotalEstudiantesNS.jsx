const TotalEstudiantesNS = ({ students = [], selectedGroup }) => {
  const uniqueStudents = Array.from(
    new Set(students.map((student) => student.codigo))
  );

  const totalStudents = students.length;
  const totalPromedio = students.reduce(
    (acc, student) => acc + parseFloat(student.promedio),
    0
  );
  const promedioGeneral =
    totalStudents > 0 ? (totalPromedio / totalStudents).toFixed(1) : 0;

  return (
    <div className="div_promedio_grupos-ns">
      <div>
        <div className="promedio_grupos-ns">
          <div>
            <p className="promedio_grupos-ns-grupo">GRUPO: {selectedGroup}</p>
          </div>
          <div>
            <h4 className="promedio_grupos-ns-numero">{uniqueStudents.length}</h4>
          </div>
          <div>
            <p>Estudiantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalEstudiantesNS;
