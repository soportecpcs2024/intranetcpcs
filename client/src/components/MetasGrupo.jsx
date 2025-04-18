import React, { useState, useEffect } from 'react';
import { Metas as fetchMetas, updateMetasGrupo } from '../api/dataMetasGrupos'; // Asegúrate de tener la función updateMetas importada
import EditMetasGrupoModal from './EditMetasGrupoModal';

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

  const renderTextWithLineBreaks = (text = '') => {
    return text.split('\n').map((line, index) => (
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
      <h2>Observaciones generales del grupo</h2>
      
        <div className="card_metas">
          <h4>Académicos:</h4>
          <p>{renderTextWithLineBreaks(metasToDisplay.academicos)}</p>
          <h4>Estrategias a implementar para elevar el nivel académico:</h4>
          <p>{renderTextWithLineBreaks(metasToDisplay.estrategiasImplementarAcademico)}</p>
        </div>
         
        {/* <div className="card">
          <h3>Disciplina en el grupo durante el periodo:</h3>
          <p>{renderTextWithLineBreaks(metasToDisplay.disciplinagrupo)}</p>
        </div> */}
     
      <div  >
        <div className="card_metas">
          <h5>Estudiantes con dificultad Disciplinarias:</h5>
          <p>{renderTextWithLineBreaks(metasToDisplay.estudiantesDificultadDisciplinarias)}</p>
        
          <h5>Estudiantes pendientes de procesos Disciplinarios:</h5>
          <p>{renderTextWithLineBreaks(metasToDisplay.estudiantesPendientesDisciplinarios)}</p>
        
          <h5>Estudiantes con sanción por parte del comité:</h5>
          <p>{renderTextWithLineBreaks(metasToDisplay.estudiantesSancionComite)}</p>
        
          <h5>Faltas que más se repiten en el grupo:</h5>
          <p>{renderTextWithLineBreaks(metasToDisplay.faltasRepetidasGrupo)}</p>
        
          <h5>Estrategias a trabajar</h5>
          <p>{renderTextWithLineBreaks(metasToDisplay.estrategiasTrabajar)}</p>
        </div>
      </div>

      <button className="login-button" onClick={() => openEditModal(metasToDisplay)}>Editar</button>

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
