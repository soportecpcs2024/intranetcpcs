import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

Modal.setAppElement("#root"); // Establece el elemento de la aplicación para la accesibilidad

const StudentModal = ({
  isOpen,
  onRequestClose,
  student,
  selectedArea,
  updateObservations,
  updateMeta,
  updateReporte
}) => {
  const [observacion, setObservacion] = useState("");
  const [meta, setMeta] = useState("");
  const [reporteEva, setReporteEva] = useState("");

  useEffect(() => {
    if (student && selectedArea) {
      setObservacion(student[`observaciones_${selectedArea}`] || "");
      setMeta(student[`metas_${selectedArea}`] || "");
      setReporteEva(student[`rep_eva_${selectedArea}`] || "");
    }
  }, [student, selectedArea]);

  const handleSave = () => {
    updateObservations(student._id, selectedArea, observacion);
    updateMeta(student._id, selectedArea, meta);
    updateReporte(student._id, selectedArea, reporteEva);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalle del Estudiante"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="modal-body">
        <h2>{student?.nombre}</h2>
        <p>Periodo: {student?.periodo}</p>
        <p>Área: {selectedArea}</p>
        <div>
          <label>
            Observaciones:
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Metas:
            <textarea
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Reporte evaluación:
            <textarea
              value={reporteEva}
              onChange={(e) => setReporteEva(e.target.value)}
            />
          </label>
        </div>
        <button className="modal-body-btn-save" onClick={handleSave}>
          Guardar
        </button>
        <button
          className="modal-body-btn-close"
          type="button"
          onClick={onRequestClose}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default StudentModal;
