import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
const NewDatatable = ({ students, error }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const itemsPerPage = 15; // Número de elementos por página
  
    // Función para manejar cambios en la página
    const handlePageClick = (event) => {
      setCurrentPage(event.selected);
    };
  
    // Actualizar los estudiantes filtrados cuando cambia la lista de estudiantes o se aplican filtros
    useEffect(() => {
      setFilteredStudents(students);
      setCurrentPage(0); // Reiniciar la página actual cuando se aplican filtros
    }, [students]);
  
    // Calcular el índice de inicio y fin de la página actual
    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredStudents.slice(offset, offset + itemsPerPage);
  
    // Calcular el número total de páginas basado en la cantidad de estudiantes filtrados
    const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>         
            <th>Puesto</th>
            <th>Promedio</th>
            
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((student, index) => (
            <tr key={index}>
              <td>{student.nombre}</td>
              <td className="td-areas">{student.grupo}</td>
              <td className="td-areas">{student.puesto}</td>
              <td className="td-areas">{(student.promedio * 1).toFixed(2)}</td>
              
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
  )
}

export default NewDatatable

