import { useState, useContext } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearTarea(formData);
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
      <h2 className="form-title">Crear Nueva Tarea</h2>
      <form onSubmit={handleSubmit} className="crear-tarea-form">
        <label htmlFor="titulo">Tarea:</label>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <label htmlFor="descripcion">Descripción de la tarea:</label>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label htmlFor="fechaLimite">Fecha terminación:</label>
        <input
          type="date"
          name="fechaLimite"
          value={formData.fechaLimite}
          onChange={handleChange}
          required
        />

        <label>Sección:</label>
        <div className="radio-group">
          {["preescolar", "primaria", "secundaria", "media"].map((seccion) => (
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
              {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
            </label>
          ))}
        </div>

        <label htmlFor="responsable">Responsable:</label>
        <input
          type="text"
          name="responsable"
          placeholder="Responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
        />

        <label htmlFor="observaciones">Observaciones:</label>
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={formData.observaciones}
          onChange={handleChange}
        />

        <label htmlFor="nivelComplejidad">Nivel de Complejidad:</label>
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
