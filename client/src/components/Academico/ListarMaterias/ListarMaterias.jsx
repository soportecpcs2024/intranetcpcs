import React from "react";

const ListarMaterias = ({ dataMaterias }) => {
  // Diccionario de alias para nombres de materias
  const aliasMaterias = {
    ciencias_naturales: "Ciencias Naturales.",
    ciencias_sociales: "Ciencias Sociales.",
    civica_y_constitucion: "Cívica y Constitución.",
    educacion_artistica: "Educación Artistica",
    educacion_cristiana: "Educación Cristiana",
    educacion_etica: "Ed. Ética",
    educacion_fisica: "Ed. Física",
    idioma_extranjero: "Inglés",
    lengua_castellana: "Lengua Castellana",
    matematicas: "Matematicas",
    tecnologia: "Tecnología",
    fisica: "Física",
    quimica: "Química",
    filosofia: "Filosofía",
    // Puedes agregar más alias aquí si lo necesitas
  };

  return (
    <div className="promedios-container">
    {Object.keys(dataMaterias).map((grupo) => (
      <div key={grupo} className="grupo-card">
        <h5>Grupo: {grupo}</h5>
        <ul>
          {Object.entries(dataMaterias[grupo]).map(([materia, promedio]) => (
            <li key={materia}>
              {aliasMaterias[materia] || materia}: <strong>{promedio}</strong>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
  
  );
};

export default ListarMaterias;
