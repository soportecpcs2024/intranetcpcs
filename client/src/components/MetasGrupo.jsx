import React, { useState, useEffect } from "react";
import { Metas as fetchMetas, updateMetasGrupo } from "../api/dataMetasGrupos"; // Asegúrate de tener la función updateMetas importada
import EditMetasGrupoModal from "./EditMetasGrupoModal";

const MetasGrupo = ({ selectedGroup, selectedPeriodo }) => {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);

  useEffect(() => {
    const fetchMetasData = async () => {
      try {
        const data = await fetchMetas(selectedGroup, selectedPeriodo);
        setMetas(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching metas");
        setLoading(false);
      }
    };

    fetchMetasData();
  }, [selectedGroup, selectedPeriodo]);

  const filteredMetas = metas.find(
    (meta) => meta.grupo === selectedGroup && meta.periodo === selectedPeriodo
  );

  const defaultText = "Pendiente...";

  const openEditModal = (grupo) => {
    setSelectedGrupo(grupo);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleUpdateMetas = async (id, updatedMetas) => {
    try {
      const updatedData = await updateMetasGrupo(id, updatedMetas); // Asegúrate de que esta función retorne los datos actualizados
      setMetas((prevMetas) =>
        prevMetas.map((meta) => (meta._id === id ? updatedData : meta))
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating metas:", error);
    }
  };

  const renderTextWithLineBreaks = (text = "") => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const metasToDisplay = filteredMetas || {
    academicos: defaultText,
    estrategiasImplementarAcademico: defaultText,
    disciplinagrupo: defaultText,
    estudiantesDificultadDisciplinarias: defaultText,
    estudiantesPendientesDisciplinarios: defaultText,
    estudiantesSancionComite: defaultText,
    faltasRepetidasGrupo: defaultText,
    estrategiasTrabajar: defaultText,
  };

  return (
    <div className="metas-container">
      <h2>Plan de mejoramiento académico</h2>

      <div className="card_metas">
        <h3 className="subtitulometas">Metas académicas:</h3>
        <div className="text-metas-final">
          <span>{renderTextWithLineBreaks(metasToDisplay.academicos)}</span>
        </div>
        <h3 className="subtitulometas">
          Estrategias a implementar para elevar el nivel académico:
        </h3>
        <div className="text-metas-final">
          <span>
            {renderTextWithLineBreaks(
              metasToDisplay.estrategiasImplementarAcademico
            )}
          </span>
        </div>
      </div>

      <div>
        <h2>Plan de mejoramiento comportamental</h2>
        <div className="card_metas">
          <h3 className="subtitulometas">
            Estudiantes con dificultad Disciplinarias:
          </h3>
          <div className="text-metas-final">
            <span>
              {renderTextWithLineBreaks(
                metasToDisplay.estudiantesDificultadDisciplinarias
              )}
            </span>
          </div>

          <h3 className="subtitulometas">
            Estudiantes pendientes de procesos Disciplinarios:
          </h3>
          <div className="text-metas-final">
            <span>
              {renderTextWithLineBreaks(
                metasToDisplay.estudiantesPendientesDisciplinarios
              )}
            </span>
          </div>

          <h3 className="subtitulometas">
            Estudiantes con sanción por parte del comité:
          </h3>
          <div className="text-metas-final">
            <span>
              {renderTextWithLineBreaks(
                metasToDisplay.estudiantesSancionComite
              )}
            </span>
          </div>

          <h3 className="subtitulometas">
            Faltas que más se repiten en el grupo:
          </h3>
          <div className="text-metas-final">
            <span>
              {renderTextWithLineBreaks(metasToDisplay.faltasRepetidasGrupo)}
            </span>
          </div>

          <h3 className="subtitulometas">Estrategias a trabajar</h3>
          <div className="text-metas-final">
            <span>
              {renderTextWithLineBreaks(metasToDisplay.estrategiasTrabajar)}
            </span>
          </div>
        </div>
      </div>

      <button
        className="login-button"
        onClick={() => openEditModal(metasToDisplay)}
      >
        Editar
      </button>

      {editModalOpen && (
        <EditMetasGrupoModal
          metas={metasToDisplay}
          onClose={closeEditModal}
          onUpdate={handleUpdateMetas}
        />
      )}
    </div>
  );
};

export default MetasGrupo;
