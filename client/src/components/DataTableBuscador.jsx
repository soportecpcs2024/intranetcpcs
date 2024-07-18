import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { AiOutlineEye } from "react-icons/ai";

const DatatableBuscador = ({ students, selectedArea, error, onStudentSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const itemsPerPage = 25; // Número de elementos por página

  useEffect(() => {
    setFilteredStudents(students);
    setCurrentPage(0);
  }, [students]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const currentPageItems = filteredStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleEditClick = (student) => {
    onStudentSelect(student);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Promedio</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((student, index) => (
            <tr key={index}>
              <td>{student.nombre}</td>
              <td>{student.grupo}</td>
              <td>{student.promedio.toFixed(2)}</td>
              <td className="see-icons">
                <AiOutlineEye className="see-icons" onClick={() => handleEditClick(student)} />
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
    </div>
  );
};

export default DatatableBuscador;
