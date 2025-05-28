import { useState, useContext } from "react";
import { TareasContext } from "../../../contexts/TareaContext";
import "../DashboardProgramadorTareas/DashboardProgramadorTareas.css"; // Importa tu CSS aquí

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
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fechaLimite"
          value={formData.fechaLimite.split("T")[0]}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="responsable"
          placeholder="Responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
        />
        <select
          name="seccion"
          value={formData.seccion}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una sección</option>
          <option value="preescolar">Preescolar</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
          <option value="media">Media</option>
        </select>

        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={formData.observaciones}
          onChange={handleChange}
        />
        <select
          name="nivelComplejidad"
          value={formData.nivelComplejidad}
          onChange={handleChange}
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <button type="submit">Crear Tarea</button>
      </form>
    </div>
  );
};

export default CrearTarea;
