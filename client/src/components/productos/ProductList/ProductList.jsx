import React, { useState, useEffect } from "react";
import { SpinnerImg } from "../Loader/Loader";
import "./productList.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../Search/Search";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useProducts } from "../../../contexts/ProductContext";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { products, loading, error, fetchProducts, removeProduct } = useProducts(); 
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts(); // Asegúrate de que la lista de productos se obtenga desde la base de datos al cargar el componente
  }, []);

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Eliminar Producto",
      message: "¿Estás seguro de que deseas eliminar este producto?",
      buttons: [
        {
          label: "Eliminar",
          onClick: () => {
            removeProduct(id);
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  // Paginación
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(
      products
        .filter((product) =>
          (product.name.toLowerCase().includes(search.toLowerCase()) ||
           product.category.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(itemOffset, endOffset)
    );
    setPageCount(
      Math.ceil(
        products.filter((product) =>
          (product.name.toLowerCase().includes(search.toLowerCase()) ||
           product.category.toLowerCase().includes(search.toLowerCase()))
        ).length / itemsPerPage
      )
    );
  }, [itemOffset, itemsPerPage, products, search]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  // Función para formatear valores en pesos colombianos
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  if (loading) {
    return <SpinnerImg />;
  }

  if (error) {
    return <p>Error loading products: {error.message}</p>;
  }

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventario de Productos</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        <div className="table">
          {!loading && products.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Precio und</th>
                  <th>Stock</th>
                  <th>Valor total</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;

                  // Convertir price y quantity a números y calcular el totalValue
                  const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
                  const parsedQuantity = parseInt(quantity, 10);
                  const totalValue = parsedPrice * parsedQuantity;

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{name}</td>
                      <td>{category}</td>
                      <td>{formatCurrency(parsedPrice)}</td>
                      <td>{parsedQuantity}</td>
                      <td>{formatCurrency(totalValue)}</td>
                      <td className="link-icons">
                        <span className="">
                          <Link to={`/admin/administracion/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/admin/administracion/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
    </div>
  );
};

export default ProductList;
