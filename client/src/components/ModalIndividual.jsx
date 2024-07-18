import React, { useState } from "react";
import axios from "axios";

const ModalIndividual = ({
  isOpen,
  onRequestClose,
  student,
  updateStudent,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedObservaciones, setEditedObservaciones] = useState(
    student.observaciones
  );
  const [editedMetas, setEditedMetas] = useState(student.metas);
  const [editedReporteNivelacion, setEditedReporteNivelacion] = useState(
    student.reporte_nivelacion
  );

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/student_notes/${student._id}`,
        {
          observaciones: editedObservaciones,
          metas: editedMetas,
          reporte_nivelacion: editedReporteNivelacion,
        }
      );
      const updatedStudent = response.data; // Suponiendo que el servidor devuelve el estudiante actualizado
      updateStudent(updatedStudent); // Actualizar el estudiante en el estado de DatatableBuscador
      setEditMode(false); // Salir del modo de edición
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const renderValue = (label, value) => {
    if (value === 0) return null;
    return (
      <li className={value < 3 ? "modalInfoIndividual-red-text" : ""}>
        <strong>{label}:</strong> {value}
      </li>
    );
  };

  return (
    <div className={`modalInfoIndividual ${isOpen ? "is-active" : ""}`}>
      <div
        className="modalInfoIndividual-background"
        onClick={onRequestClose}
      ></div>
      <div className="modalInfoIndividual-content">
        <div className="modalInfoIndividual-box">
          <h1 className="modalInfoIndividual-title">{student.nombre}</h1>
          <p>Grupo :{student.grupo} </p>
          <p>Periodo :{student.periodo} </p>
          <p>Puesto :{student.puesto} </p>
          <p>Promedio :{student.promedio} </p>

          <ul>
            {renderValue("Ciencias Naturales", student.ciencias_naturales)}
            {renderValue("Física", student.fisica)}
            {renderValue("Química", student.quimica)}
            {renderValue(
              "Ciencias Políticas Económicas",
              student.ciencias_politicas_economicas
            )}
            {renderValue("Ciencias Sociales", student.ciencias_sociales)}
            {renderValue("Cívica y Constitución",student.civica_y_constitucion)}
            {renderValue("Educación Artística", student.educacion_artistica)}
            {renderValue("Educación Cristiana", student.educacion_cristiana)}
            {renderValue("Educación Ética", student.educacion_etica)}
            {renderValue("Educación Física", student.educacion_fisica)}
            {renderValue("Filosofía", student.filosofia)}
            {renderValue("Idioma Extranjero", student.idioma_extranjero)}
            {renderValue("Lengua Castellana", student.lengua_castellana)}
            {renderValue("Matemáticas", student.matematicas)}
            {renderValue("Tecnología", student.tecnologia)}
          </ul>
          <ul></ul>
        </div>
        <div className="modalInfoIndividual-close">
          <button
            className="modalInfoIndividual-close-btn"
            aria-label="close"
            onClick={onRequestClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalIndividual;
