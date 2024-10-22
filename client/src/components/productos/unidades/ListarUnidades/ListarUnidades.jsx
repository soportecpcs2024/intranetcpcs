import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./ListarUnidades.css";
import ReactPaginate from "react-paginate"; 
import { confirmAlert } from "react-confirm-alert";
import EstadisUnidades from "../estadisticasUnidades/EstadisUnidades";
import BuscarUnidad from "../BuscarUnidad/BuscarUnidad";

const ListarUnidades = () => {
  const { units, loadingUnits, errorUnits, removeUnit, fetchUnits } = useProducts();
  const [formattedUnits, setFormattedUnits] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  // Log the units when they are loaded
  useEffect(() => {
    console.log("Units loaded:", units); // Verifica la carga de las unidades
    if (units) {
      const formatted = units.map((unit) => ({
        ...unit,
        fecha_entrega: unit.fecha_entrega
          ? new Date(unit.fecha_entrega).toLocaleDateString()
          : "N/A",
        fecha_devolucion: unit.fecha_devolucion
          ? new Date(unit.fecha_devolucion).toLocaleDateString()
          : "N/A",
      }));
      setFormattedUnits(formatted);

      // Agrupar unidades por nombre de producto y contar cuántas hay de cada uno
      const stats = formatted.reduce((acc, unit) => {
        const productName = unit.id_producto?.name || "Desconocido";
        if (!acc[productName]) {
          acc[productName] = 0;
        }
        acc[productName] += 1;
        return acc;
      }, {});
      setProductStats(stats);  // Guardar estadísticas de productos
    }
  }, [units]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    // Filtrar unidades basadas en el término de búsqueda
    const filteredUnits = formattedUnits.filter((unit) => {
      const name = unit.id_producto?.subcategory?.toLowerCase() || "";
      const category = unit.id_producto?.category?.toLowerCase() || "";
      const idunit = unit._id?.toLowerCase() || "";
      const locationName = unit.location?.nombre?.toLowerCase() || "";
      const locationAddress = unit.location?.direccion?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        name.includes(searchTermLower) ||
        category.includes(searchTermLower) ||
        idunit.includes(searchTermLower) ||
        locationName.includes(searchTermLower) ||
        locationAddress.includes(searchTermLower)
      );
    });

    console.log("Filtered Units:", filteredUnits); // Verifica los productos que pasan el filtro
    setCurrentItems(filteredUnits.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredUnits.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, formattedUnits, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % formattedUnits.length;
    setItemOffset(newOffset);
  };

  // Force reload of products if needed
  useEffect(() => {
    if (!loadingUnits && units.length === 0) {
      fetchUnits();  // Forzar la recarga de productos si no se están cargando
    }
  }, [loadingUnits, units, fetchUnits]);

  if (loadingUnits) return <div>Cargando...</div>;
  if (errorUnits) return <div>Error al cargar unidades.</div>;

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Eliminar unidad",
      message: "¿Estás seguro de que deseas eliminar esta unidad?",
      buttons: [
        {
          label: "Eliminar",
          onClick: () => {
            removeUnit(id); 
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  return (
    <div className="container">
      <h3>Listar Unidades</h3>
      <div className="container-lis-unit">
        <EstadisUnidades productStats={productStats} />
      </div>
      <div className="container-listUnits-Search">
        <div>
          <BuscarUnidad searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="container-listUnits-Search-ps">
          <div>
            <p>Unidades: </p>
          </div>
          <div>
            <p className="item-count">
              {currentItems.length} de {formattedUnits.length}
            </p>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Producto</th>
            <th>Marca</th>
            <th>Lugar</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((unit) => (
            <tr key={unit._id}>
              <td>{unit._id || "N/A"}</td>
              <td>{unit.id_producto?.subcategory || "N/A"}</td>
              <td>{unit.id_producto?.brand || "N/A"}</td>
              <td>{unit.location?.nombre || "N/A"}</td>
              <td>{unit.location?.direccion || "N/A"}</td>
              <td>{unit.estado || "N/A"}</td>
              <td>
                <div className="icon-container">
                  <Link
                    to={`/admin/administracion/units/${unit._id}`}
                    className="view-icon"
                  >
                    <FaEye size={20} color={"#3498db"} />
                  </Link>
                  <Link
                    to={`/admin/administracion/updateunits/${unit._id}`}
                    className="view-icon"
                  >
                    <FaEdit size={20} color={"green"} />
                  </Link>
                  <Link
                    onClick={() => confirmDelete(unit._id)}
                    className="view-icon"
                  >
                    <FaTrashAlt size={20} color={"red"} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Siguiente"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Anterior"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default ListarUnidades;
