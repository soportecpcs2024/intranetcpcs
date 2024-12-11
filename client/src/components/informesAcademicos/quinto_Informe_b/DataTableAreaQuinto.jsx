import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const DatatableAreasQuinto = ({ students, selectedArea, error }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const itemsPerPage = 15; // Número de elementos por página

  // Manejo de cambio de página
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Actualizar los estudiantes filtrados cuando cambia la lista de estudiantes
  useEffect(() => {
    // Filtrar estudiantes con valor en el área seleccionada menor a 4
    const filtered = students.filter(
      (student) => Number(student[selectedArea]) < 4
    );

    // Ordenar los estudiantes alfabéticamente por nombre
    const sortedStudents = [...filtered].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );

    setFilteredStudents(sortedStudents);
    setCurrentPage(0);
  }, [students, selectedArea]);

  // Calcular elementos actuales de la página
  const offset = currentPage * itemsPerPage;
  const currentPageItems = filteredStudents.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="table-container_grafic">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>
              {selectedArea
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((student) => (
            <tr key={student._id}>
              <td>{student.nombre}</td>
              <td className="td-areas">
                {Number(student[selectedArea]).toFixed(2)}
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

export default DatatableAreasQuinto;
