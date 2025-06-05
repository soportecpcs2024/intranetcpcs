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
      <h2 className="form-title">CREAR TAREA</h2>
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

        <label>Áreas:</label>
        <div className="radio-group">
          {[
            "Bloque A",
            "Bloque B",
            "Bloque C",
            "Bloque D",
            "Coliseo",
            "Oficinas",
            "Restaurante",
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

        <label htmlFor="responsable">Responsable:</label>
        <select
          type="text"
          name="responsable"
          placeholder="Responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona empleado</option>
          <option value="ANTONIO JOSE PEREIRA CHIRINOS">
            ANTONIO JOSE PEREIRA CHIRINOS
          </option>
          <option value="BENITO ANTONIO ARRIETA LOPEZ">
            BENITO ANTONIO ARRIETA LOPEZ
          </option>
          <option value="CARLOS ENRIQUE SOLANO GUEVARA">
            CARLOS ENRIQUE SOLANO GUEVARA
          </option>
          <option value="CARLOS ALFREDO MONTOYA">CARLOS ALFREDO MONTOYA</option>
        </select>

        

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
