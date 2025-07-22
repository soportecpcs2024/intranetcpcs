import { useState, useContext } from "react";
import moment from "moment-timezone";

import { TareasContext } from "../../../contexts/TareaContext";
import "../DashboardProgramadorTareas/DashboardProgramadorTareas.css";

const CrearTarea = () => {
  const { crearTarea } = useContext(TareasContext);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaLimite: "",
    responsable: "",
    seccion: "",
    observaciones: "",
    nivelComplejidad: "Baja",
  });

  // ✅ Corrige la visualización en el input eliminando el desfase por zona horaria
  // ✅ No modificamos la fecha aquí, solo la usamos como viene del input
  const formatFechaLocalInput = (fechaStr) => {
    if (!fechaStr) return "";
    return fechaStr; // ✅ usamos directamente el valor YYYY-MM-DD del input
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ formData.fechaLimite es tipo string 'YYYY-MM-DD', así que lo pasamos a moment
    const fechaColombia = moment.tz(
      `${formData.fechaLimite}T23:59:59`,
      "America/Bogota"
    );

    const formDataAjustado = {
      ...formData,
      fechaLimite: fechaColombia.toDate(), // guarda como 23:59:59 hora local
    };

    await crearTarea(formDataAjustado);

    setFormData({
      titulo: "",
      descripcion: "",
      fechaLimite: "",
      responsable: "",
      seccion: "",
      observaciones: "",
      nivelComplejidad: "Baja",
    });
  };

  return (
    <div className="crear-tarea-container">
      <h2 className="form-title">CREAR TAREA</h2>
      <form onSubmit={handleSubmit} className="crear-tarea-form">
        <label htmlFor="titulo" className="label_crear_tarea">
          Tarea:
        </label>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <label htmlFor="descripcion" className="label_crear_tarea">
          Descripción de la tarea:
        </label>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label htmlFor="fechaLimite" className="label_crear_tarea">
          Fecha Finaliza el día:
        </label>
        <input
          type="date"
          name="fechaLimite"
          value={formatFechaLocalInput(formData.fechaLimite)}
          onChange={handleChange}
          required
        />

        <label className="label_crear_tarea">Áreas:</label>
        <div className="radio-group">
          {[
            "Bloque A",
            "Bloque B",
            "Bloque C",
            "Bloque D",
            "Coliseo",
            "Oficinas",
            "Restaurante",
            "Compras",
          ].map((seccion) => (
            <label
              key={seccion}
              className={`radio-button ${
                formData.seccion === seccion ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="seccion"
                value={seccion}
                checked={formData.seccion === seccion}
                onChange={handleChange}
              />
              <span>{seccion}</span>
            </label>
          ))}
        </div>

        <label htmlFor="responsable" className="label_crear_tarea">
          Responsable:
        </label>
        <select
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona encargado</option>
          <option value="KAREN MAYERLYN HERNANDEZ CUERVO">
            KAREN MAYERLYN HERNANDEZ CUERVO
          </option>
          <option value="LINA MARCELA LUJAN DURAN">
            LINA MARCELA LUJAN DURAN
          </option>
          <option value="LINA MARIA MONTOYA GOMEZ">
            LINA MARIA MONTOYA GOMEZ
          </option>
          <option value="MARIA CRISTINA VIDAL ROJAS">
            MARIA CRISTINA VIDAL ROJAS
          </option>
          <option value="MARIA OLIVA CANTOR TIRADO">
            MARIA OLIVA CANTOR TIRADO
          </option>
          <option value="ANTONIO JOSE PEREIRA CHIRINOS">
            ANTONIO JOSE PEREIRA CHIRINOS
          </option>
          <option value="BENITO ANTONIO ARRIETA LOPEZ">
            BENITO ANTONIO ARRIETA LOPEZ
          </option>
          <option value="CARLOS ENRIQUE SOLANO GUEVARA">
            CARLOS ENRIQUE SOLANO GUEVARA
          </option>
          <option value="RUBEN HUMBERTO GOMEZ GIRALDO">
            RUBEN HUMBERTO GOMEZ GIRALDO
          </option>
          <option value="RICHARD ALONSO OSORNO LOPERA">
            RICHARD ALONSO OSORNO LOPERA
          </option>
          <option value="WILTON FABIO MONTOYA">
            RICHARD ALONSO OSORNO LOPERA
          </option>
          <option value="GIOVANNY ESTRADA PEREZ">GIOVANNY ESTRADA PEREZ</option>
        </select>

        <label htmlFor="nivelComplejidad" className="label_crear_tarea">
          Nivel de Complejidad:
        </label>
        <select
          name="nivelComplejidad"
          value={formData.nivelComplejidad}
          onChange={handleChange}
          required
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <button type="submit" className="submit-button">
          Crear Tarea
          
        </button>
      </form>
    </div>
  );
};

export default CrearTarea;
