import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { CiEdit } from "react-icons/ci";
import StudentModal from "./StudentModal";
import axios from 'axios';

const DatatableAreas = ({ students, selectedArea, error }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 12; // Número de elementos por página

  // Manejo de cambio de página
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Actualizar los estudiantes filtrados cuando cambia la lista de estudiantes
useEffect(() => {
  // Ordenar los estudiantes alfabéticamente por nombre
  const sortedStudents = [...students].sort((a, b) => a.nombre.localeCompare(b.nombre));
  setFilteredStudents(sortedStudents);
  setCurrentPage(0);
}, [students]);

  // Calcular elementos actuales de la página
  const offset = currentPage * itemsPerPage;
  const currentPageItems = filteredStudents.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  // Abrir el modal
  const openModal = (student) => {
    setSelectedStudent(student);
    setModalIsOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedStudent(null);
  };

  // Actualizar observaciones en la base de datos y estado
  const updateObservations = async (id, area, newObservation) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes/${id}`, {
        [`observaciones_${area}`]: newObservation
      });
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, [`observaciones_${area}`]: newObservation } : student
        )
      );
    } catch (error) {
      console.error('Error updating observations:', error);
    }
  };

  // Actualizar metas en la base de datos y estado
  const updateMeta = async (id, area, newMeta) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes/${id}`, {
        [`metas_${area}`]: newMeta
      });
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, [`metas_${area}`]: newMeta } : student
        )
      );
    } catch (error) {
      console.error('Error updating metas:', error);
    }
  };

  // Actualizar reporte de evaluación en la base de datos y estado
  const updateReporte = async (id, area, newReporte) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes/${id}`, {
        [`rep_eva_${area}`]: newReporte
      });
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, [`rep_eva_${area}`]: newReporte } : student
        )
      );
    } catch (error) {
      console.error('Error updating reporte:', error);
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>{selectedArea.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</th>
            <th>Observaciones</th>
            <th>Metas</th>
            <th>Reporte evaluación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((student) => (
            <tr key={student._id}>
              <td>{student.nombre}</td>
              <td className="td-areas">{student.grupo}</td>
              <td className="td-areas">{Number(student[selectedArea]).toFixed(2)}</td>
              <td className="td-areas td-areas-data">{student[`observaciones_${selectedArea}`]}</td>
              <td className="td-areas td-areas-data">{student[`metas_${selectedArea}`]}</td>
              <td className="td-areas td-areas-data">{student[`rep_eva_${selectedArea}`]}</td>
              <td className="td-areas">
                <CiEdit className="edit-icons" onClick={() => openModal(student)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && (
        <div className="error-row">
          <p>{error}</p>
        </div>
      )}
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      {selectedStudent && (
        <StudentModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          student={selectedStudent}
          selectedArea={selectedArea}
          updateObservations={updateObservations}
          updateMeta={updateMeta}
          updateReporte={updateReporte}
        />
      )}
    </div>
  );
};

export default DatatableAreas;
