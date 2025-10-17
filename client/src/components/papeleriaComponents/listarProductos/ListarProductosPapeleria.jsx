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
} from "react-icons/fa";
import "./ListarProductosPapeleria.css";

const ListarProductosPapeleria = () => {
  const productos = [
    { id: 1, nombre: "Lapicero azul", referencia: "LP-001", categoria: "Escritura", icono: <FaPen /> },
    { id: 2, nombre: "Regla 30 cm", referencia: "RG-030", categoria: "Otros", icono: <FaRuler /> },
    { id: 3, nombre: "Cuaderno cuadriculado", referencia: "CD-101", categoria: "Papel", icono: <FaBook /> },
    { id: 4, nombre: "Borrador blanco", referencia: "BR-050", categoria: "Otros", icono: <FaEraser /> },
    { id: 5, nombre: "Notas adhesivas", referencia: "NA-200", categoria: "Papel", icono: <FaStickyNote /> },
    { id: 6, nombre: "Marcador amarillo", referencia: "MC-005", categoria: "Escritura", icono: <FaHighlighter /> },
    { id: 7, nombre: "Lápiz No.2", referencia: "LPZ-002", categoria: "Escritura", icono: <FaPencilAlt /> },
    { id: 9, nombre: "Clips metálicos", referencia: "CL-025", categoria: "Otros", icono: <FaPaperclip /> },
    { id: 10, nombre: "Portapapeles", referencia: "PP-100", categoria: "Otros", icono: <FaClipboard /> },
  ];

  const categorias = [
    { nombre: "Todos", icono: "📦" },
    { nombre: "Escritura", icono: "✏️" },
    { nombre: "Papel", icono: "📄" },
    { nombre: "Otros", icono: "🧷" },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  const productosFiltrados =
    categoriaSeleccionada === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div className="productos-container">
      <h2 className="titulo-papeleria">Productos de Papelería</h2>

      {/* 🔹 Filtro de categorías */}
      <div className="filtro-categorias">
        {categorias.map((cat) => (
          <button
            key={cat.nombre}
            className={`categoria-btn ${
              categoriaSeleccionada === cat.nombre ? "activo" : ""
            }`}
            onClick={() => setCategoriaSeleccionada(cat.nombre)}
          >
            <span className="icono-categoria">{cat.icono}</span>
            <span className="nombre-categoria">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* 🔹 Grid de productos */}
      <div className="productos-grid">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="producto-card">
            <div className="icono-producto">{producto.icono}</div>
            <h3>{producto.nombre}</h3>
            <p><strong>Ref:</strong> {producto.referencia}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarProductosPapeleria;

