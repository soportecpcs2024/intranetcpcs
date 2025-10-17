import { useState } from "react";
import {
  FaPen,
  FaRuler,
  FaBook,
  FaEraser,
  FaStickyNote,
  FaHighlighter,
  FaPencilAlt,
  FaPaperclip,
  FaClipboard,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import "./TablaProductos.css";

const TablaProductos = () => {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Lapicero azul", referencia: "LP-001", categoria: "Escritura", icono: <FaPen /> },
    { id: 2, nombre: "Regla 30 cm", referencia: "RG-030", categoria: "Otros", icono: <FaRuler /> },
    { id: 3, nombre: "Cuaderno cuadriculado", referencia: "CD-101", categoria: "Papel", icono: <FaBook /> },
    { id: 4, nombre: "Borrador blanco", referencia: "BR-050", categoria: "Otros", icono: <FaEraser /> },
    { id: 5, nombre: "Notas adhesivas", referencia: "NA-200", categoria: "Papel", icono: <FaStickyNote /> },
    { id: 6, nombre: "Marcador amarillo", referencia: "MC-005", categoria: "Escritura", icono: <FaHighlighter /> },
    { id: 7, nombre: "Lápiz No.2", referencia: "LPZ-002", categoria: "Escritura", icono: <FaPencilAlt /> },
    { id: 9, nombre: "Clips metálicos", referencia: "CL-025", categoria: "Otros", icono: <FaPaperclip /> },
    { id: 10, nombre: "Portapapeles", referencia: "PP-100", categoria: "Otros", icono: <FaClipboard /> },
  ]);

  const categorias = [
    { nombre: "Todos", icono: "📦" },
    { nombre: "Escritura", icono: "✏️" },
    { nombre: "Papel", icono: "📄" },
    { nombre: "Otros", icono: "🧷" },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [productoEditando, setProductoEditando] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const productosFiltrados =
    categoriaSeleccionada === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  const manejarAceptar = (producto) => {
    console.log(`✅ Producto: ${producto.nombre}, Cantidad: ${cantidad}`);
    setProductoEditando(null);
    setCantidad(1);
  };

  const manejarCancelar = () => {
    setProductoEditando(null);
    setCantidad(1);
  };

  const manejarEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="productos-container_tabla">
      <h2 className="titulo-papeleria">Productos de Papelería</h2>

      {/* 🔹 Filtro de categorías */}
      <div className="filtro-categorias">
        {categorias.map((cat) => (
          <button
            key={cat.nombre}
            className={`categoria-btn ${categoriaSeleccionada === cat.nombre ? "activo" : ""}`}
            onClick={() => setCategoriaSeleccionada(cat.nombre)}
          >
            <span className="icono-categoria">{cat.icono}</span>
            <span className="nombre-categoria">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* 🔹 Tabla de productos */}
      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Referencia</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id}>
                <td className="icono-columna">{producto.icono}</td>
                <td>{producto.nombre}</td>
                <td>{producto.referencia}</td>
                <td>{producto.categoria}</td>
                <td>
                  {productoEditando === producto.id ? (
                    <div className="acciones-inline">
                      <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        className="input-cantidad"
                      />
                      <button
                        className="btn-aceptar"
                        onClick={() => manejarAceptar(producto)}
                        title="Aceptar"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="btn-cancelar"
                        onClick={manejarCancelar}
                        title="Cancelar"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="acciones-inline">
                      <button
                        className="btn-seleccionar"
                        onClick={() => {
                          setProductoEditando(producto.id);
                          setCantidad(1);
                        }}
                        title="Adicionar productos"
                      >
                        +
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => manejarEliminar(producto.id)}
                        title="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProductos;
