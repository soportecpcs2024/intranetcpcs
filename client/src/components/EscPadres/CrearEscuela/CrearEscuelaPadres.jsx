import React, { useState } from "react";
import { useEscuelaPadres } from "../../../contexts/EscuelaPadresContext";

import "./CrearEscuelaPadres.css"; // Importa tu CSS aquí

const CrearEscuelaPadres = () => {
  const { crearEscuela } = useEscuelaPadres();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechas, setFechas] = useState([""]);
  const [año, setAño] = useState(new Date().getFullYear());
  const [mensaje, setMensaje] = useState(null);

  const handleFechaChange = (index, value) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index] = value;
    setFechas(nuevasFechas);
  };

  const agregarFecha = () => {
    setFechas([...fechas, ""]);
  };

  const eliminarFecha = (index) => {
    const nuevasFechas = fechas.filter((_, i) => i !== index);
    setFechas(nuevasFechas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechasValidas = fechas.filter((f) => f.trim() !== "");

    if (!nombre || !descripcion || fechasValidas.length === 0 || !año) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      await crearEscuela({
        nombre,
        descripcion,
        fechas: fechasValidas,
        año: parseInt(año),
      });

      setMensaje("✅ Escuela creada exitosamente");
      setNombre("");
      setDescripcion("");
      setFechas([""]);
      setAño(new Date().getFullYear());
    } catch (error) {
      setMensaje("❌ Error al crear la escuela");
    }
  };

  return (
    <div className="crear-escuela-container">
      <h2 className="titulo">Crear Escuela para Padres</h2>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="crear-escuela-form">
        <input
          type="text"
          placeholder="Nombre de la escuela"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input"
          required
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="textarea"
          rows={3}
          required
        />

        <div className="fechas-container">
          <label className="label">Fechas:</label>
          {fechas.map((fecha, index) => (
            <div key={index} className="fecha-row">
              <input
                type="date"
                value={fecha}
                onChange={(e) => handleFechaChange(index, e.target.value)}
                className="input fecha-input"
                required
              />
              {fechas.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarFecha(index)}
                  className="boton-eliminar"
                  title="Eliminar fecha"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <div> <input
          type="number"
          value={año}
          onChange={(e) => setAño(e.target.value)}
          className="input"
          placeholder="Año"
          required
        /></div>
          <div className="btn_agregar_fecha">
            <button
              type="button"
              onClick={agregarFecha}
              className="agregar"
            >
              + Agregar otra fecha
            </button>
          </div>
        </div>

       

        <button type="submit" className="boton-enviar">
          Crear Escuela
        </button>
      </form>
    </div>
  );
};

export default CrearEscuelaPadres;
