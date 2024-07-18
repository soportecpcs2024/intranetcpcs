const PromedioGrupos = ({ students = [] }) => {
  const uniqueStudents = Array.from(new Set(students.map(student => student.codigo)));

  const totalStudents = students.length;
  const totalPromedio = students.reduce(
    (acc, student) => acc + parseFloat(student.promedio),
    0
  );
  const promedioGeneral =
    totalStudents > 0 ? (totalPromedio / totalStudents).toFixed(1) : 0;

  return (
    <div className="div_promedio_grupos">
      <div className="promedio_grupos">
        <div>
          <h4>{promedioGeneral}</h4>
        </div>
        <div>
          <p>Promedio</p>
        </div>
      </div>
      <div className="promedio_grupos">
        <div>
          <h4>{uniqueStudents.length}</h4>
        </div>
        <div>
          <p>Estudiantes</p>
        </div>
      </div>
    </div>
  );
};

export default PromedioGrupos;

