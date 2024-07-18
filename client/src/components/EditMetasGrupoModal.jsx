import React, { useState, useEffect } from "react";

const EditMetasGrupoModal = ({ metas, onClose, onUpdate }) => {
  const [updatedMetas, setUpdatedMetas] = useState({ ...metas });

  useEffect(() => {
    setUpdatedMetas({ ...metas });
  }, [metas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMetas((prevMetas) => ({
      ...prevMetas,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(metas._id, updatedMetas);
      onClose();
    } catch (error) {
      console.error("Error updating metas:", error);
    }
  };

  return (
    <div className="metas-container-modal">
      <div className="metas-modal-content">
        <h2>Editar Metas del Grupo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Académicos:</label>
            <textarea
              name="academicos"
              value={updatedMetas.academicos}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estrategias a implementar para elevar el nivel académico:</label>
            <textarea
              name="estrategiasImplementarAcademico"
              value={updatedMetas.estrategiasImplementarAcademico}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Disciplina en el grupo durante el periodo:</label>
            <textarea
              name="disciplinaGrupoPeriodo"
              value={updatedMetas.disciplinaGrupoPeriodo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estudiantes con dificultad Disciplinarias:</label>
            <textarea
              name="estudiantesDificultadDisciplinarias"
              value={updatedMetas.estudiantesDificultadDisciplinarias}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estudiantes pendientes de procesos Disciplinarios:</label>
            <textarea
              name="estudiantesPendientesDisciplinarios"
              value={updatedMetas.estudiantesPendientesDisciplinarios}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estudiantes con sanción por parte del comité:</label>
            <textarea
              name="estudiantesSancionComite"
              value={updatedMetas.estudiantesSancionComite}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Faltas que más se repiten en el grupo:</label>
            <textarea
              name="faltasRepetidasGrupo"
              value={updatedMetas.faltasRepetidasGrupo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estrategias a trabajar:</label>
            <textarea
              name="estrategiasTrabajar"
              value={updatedMetas.estrategiasTrabajar}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMetasGrupoModal;


