import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { FaEye, FaEdit } from "react-icons/fa";
import StudentModal from "./StudentModal";
import axios from 'axios';
import { CiEdit } from "react-icons/ci";

const DatatableAreas = ({ students, selectedArea, error }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 15; // Número de elementos por página

  const allAreas = [
    "ciencias_naturales",
    "fisica",
    "quimica",
    "ciencias_politicas_economicas",
    "ciencias_sociales",
    "educacion_cristiana",
    "educacion_etica",
    "educacion_fisica",
    "filosofia",
    "idioma_extranjero",
    "lengua_castellana",
    "matematicas",
    "tecnologia",
  ];

  const selectedAreas = selectedArea ? [selectedArea] : allAreas;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    setFilteredStudents(students);
    setCurrentPage(0);
  }, [students]);

  const offset = currentPage * itemsPerPage;
  const currentPageItems = filteredStudents.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedStudent(null);
  };

  const updateObservations = async (id, newObservations, newMetas, newRepNivelacion) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observaciones: newObservations, metas: newMetas, reporte_nivelacion: newRepNivelacion })
      });
      const updatedStudent = await response.json();
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, observaciones: newObservations, metas: newMetas, reporte_nivelacion: newRepNivelacion } : student
        )
      );
    } catch (error) {
      console.error('Error updating observations:', error);
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            {selectedAreas.map((area, index) => (
              <th key={index}>{area.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</th>
            ))}
            <th>Observaciones</th>
            <th>Metas</th>
            <th>Rep. Nivelación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((student, index) => (
            <tr key={index}>
              <td>{student.nombre}</td>
              <td className="td-areas">{student.grupo}</td>
              {selectedAreas.map((area, idx) => (
                <td className="td-areas" key={idx}>{Number(student[area]).toFixed(2)}</td>
              ))}
              <td>{student.observaciones}</td>
              <td>{student.metas}</td>
              <td>{student.reporte_nivelacion}</td>
              <td className="td-areas">
                
                <CiEdit className="edit-icons" onClick={() => openModal(student)}/>
               
                 
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
        />
      )}
    </div>
  );
};

export default DatatableAreas;
