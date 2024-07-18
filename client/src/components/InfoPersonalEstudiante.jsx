import React, { useRef } from "react";
import html2canvas from "html2canvas";
import "./InfoPersonalEstudiante.css"; // Importa tu archivo de estilos CSS

const renderValue = (label, value) => {
  if (value === 0 || value === undefined) {
    return null;
  }

  let content;
  if (value < 3) {
    content = (
      <div className="perdida-container">
        <p>
          <strong>{label}:</strong> {value}
        </p>
        <p className="perdida">Perdida</p>
      </div>
    );
  } else {
    content = (
      <p>
        <strong>{label}:</strong> {value}
      </p>
    );
  }

  return content;
};

const InfoPersonalEstudiante = ({ student }) => {
  const componentRef = useRef(null);

  const handleDownloadImage = () => {
    if (!componentRef.current) return;

    html2canvas(componentRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "informacion_estudiante.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  if (!student) {
    return (
      <div className="info-personal-container">
        <p className="no-student">No hay estudiante seleccionado aún!</p>
      </div>
    );
  }

  return (
    <div className="info-personal-container" ref={componentRef}>
      <div className="info-personal-content">
        <h2>Informacion estudiante</h2>
        
        {renderValue("Nombre", student.nombre)}
        {renderValue("Grupo", student.grupo)}
        {renderValue("Periodo", student.periodo)}
        {renderValue("Promedio", student.promedio)}
        {renderValue("Ciencias Naturales", student.ciencias_naturales)}
        {renderValue("Física", student.fisica)}
        {renderValue("Química", student.quimica)}
        {renderValue(
          "Ciencias Políticas Económicas",
          student.ciencias_politicas_economicas
        )}
        {renderValue("Ciencias Sociales", student.ciencias_sociales)}
        {renderValue("Cívica y Constitución", student.civica_y_constitucion)}
        {renderValue("Educación Artística", student.educacion_artistica)}
        {renderValue("Educación Cristiana", student.educacion_cristiana)}
        {renderValue("Educación Ética", student.educacion_etica)}
        {renderValue("Educación Física", student.educacion_fisica)}
        {renderValue("Filosofía", student.filosofia)}
        {renderValue("Idioma Extranjero", student.idioma_extranjero)}
        {renderValue("Lengua Castellana", student.lengua_castellana)}
        {renderValue("Matemáticas", student.matematicas)}
        {renderValue("Tecnología", student.tecnologia)}
      </div>
      <div className="info-personal-actions">
        <button
          className="info-personal-container-btn"
          onClick={handleDownloadImage}
        >
          Descargar como imagen
        </button>
      </div>
    </div>
  );
};

export default InfoPersonalEstudiante;
