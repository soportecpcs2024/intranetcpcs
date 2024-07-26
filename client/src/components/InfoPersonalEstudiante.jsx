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

const renderObservations = (student) => {
  const observationFields = [
    { label: "Ciencias Naturales", value: student.observaciones_ciencias_naturales },
    { label: "Ciencias Sociales", value: student.observaciones_ciencias_sociales },
    { label: "Cívica y Constitución", value: student.observaciones_civica_y_constitucion },
    { label: "Educación Artística", value: student.observaciones_educacion_artistica },
    { label: "Educación Cristiana", value: student.observaciones_educacion_cristiana },
    { label: "Educación Ética", value: student.observaciones_educacion_etica },
    { label: "Educación Física", value: student.observaciones_educacion_fisica },
    { label: "Filosofía", value: student.observaciones_filosofia },
    { label: "Idioma Extranjero", value: student.observaciones_idioma_extranjero },
    { label: "Lengua Castellana", value: student.observaciones_lengua_castellana },
    { label: "Matemáticas", value: student.observaciones_matematicas },
    { label: "Tecnología", value: student.observaciones_tecnologia }
  ];

  return (
    <ul>
      {observationFields
        .filter((field) => field.value && field.value !== "Pendiente")
        .map((field, index) => (
          <li key={index}>
            <strong>{field.label}:</strong> {field.value}
          </li>
        ))}
    </ul>
  );
};

const renderMetas = (student) => {
  const metasFields = [
    { label: "Ciencias Naturales", value: student.metas_ciencias_naturales },
    { label: "Ciencias Sociales", value: student.metas_ciencias_sociales },
    { label: "Cívica y Constitución", value: student.metas_civica_y_constitucion },
    { label: "Educación Artística", value: student.metas_educacion_artistica },
    { label: "Educación Cristiana", value: student.metas_educacion_cristiana },
    { label: "Educación Ética", value: student.metas_educacion_etica },
    { label: "Educación Física", value: student.metas_educacion_fisica },
    { label: "Filosofía", value: student.metas_filosofia },
    { label: "Idioma Extranjero", value: student.metas_idioma_extranjero },
    { label: "Lengua Castellana", value: student.metas_lengua_castellana },
    { label: "Matemáticas", value: student.metas_matematicas },
    { label: "Tecnología", value: student.metas_tecnologia }
  ];

  return (
    <ul>
      {metasFields
        .filter((field) => field.value && field.value !== "Pendiente")
        .map((field, index) => (
          <li key={index}>
            <strong>{field.label}:</strong> {field.value}
          </li>
        ))}
    </ul>
  );
};

const renderReport = (student) => {
  const reportFields = [
    { label: "Ciencias Naturales", value: student.rep_eva_ciencias_naturales },
    { label: "Ciencias Sociales", value: student.rep_eva_ciencias_sociales },
    { label: "Cívica y Constitución", value: student.rep_eva_civica_y_constitucion },
    { label: "Educación Artística", value: student.rep_eva_educacion_artistica },
    { label: "Educación Cristiana", value: student.rep_eva_educacion_cristiana },
    { label: "Educación Ética", value: student.rep_eva_educacion_etica },
    { label: "Educación Física", value: student.rep_eva_educacion_fisica },
    { label: "Filosofía", value: student.rep_eva_filosofia },
    { label: "Idioma Extranjero", value: student.rep_eva_idioma_extranjero },
    { label: "Lengua Castellana", value: student.rep_eva_lengua_castellana },
    { label: "Matemáticas", value: student.rep_eva_matematicas },
    { label: "Tecnología", value: student.rep_eva_tecnologia }
  ];

  return (
    <ul>
      {reportFields
        .filter((field) => field.value && field.value !== "Pendiente")
        .map((field, index) => (
          <li key={index}>
            <strong>{field.label}:</strong> {field.value}
          </li>
        ))}
    </ul>
  );
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
      <h2>Informacion estudiante</h2>
      <div className="info-personal-content">
        <div>
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
        <div>
          <div className="card-container">
            <label htmlFor="">
              <strong>Observaciones:</strong>{" "}
            </label>
            <div className="card-body">
              {renderObservations(student)}
            </div>
          </div>
          <div className="card-container">
            <label htmlFor="">
              <strong>Metas:</strong>{" "}
            </label>
            <div className="card-body">
              {renderMetas(student)}
            </div>
          </div>
          <div className="card-container">
            <label htmlFor="">
              <strong>Reporte de evaluación:</strong>{" "}
            </label>
            <div className="card-body">
              {renderReport(student)}
            </div>
          </div>
          
           
        </div>
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
