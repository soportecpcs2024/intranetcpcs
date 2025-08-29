import React, { useState } from "react";
import axios from "axios";
import { criteriosActividad1 } from "./criterios"; // 👈 exportaste los arrays a un archivo aparte
import "./Rubricas.css";

const RubricasForm = ({ onSuccess }) => {
  const [nombre, setNombre] = useState(""); 
  const [cargo, setCargo] = useState(""); 
  const [respuestas, setRespuestas] = useState({});
  const [observaciones, setObservaciones] = useState("");

  const handleChange = (criterio, valor) => {
    setRespuestas({ ...respuestas, [criterio]: valor });
  };

  const validarFormulario = () => {
    const todasActividades = [...criteriosActividad1];

    for (let criterio of todasActividades) {
      if (!respuestas[criterio.nombre]) {
        alert(`⚠️ Falta responder el criterio: "${criterio.nombre}"`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const payload = {
      nombre,
      cargo,
      respuestas: {
        autoevaluacion: Object.entries(respuestas).map(([criterio, valor]) => ({
          criterio,
          valor,
        })),
        coevaluacion: [], 
        heteroevaluacion: [], 
      },
      observaciones,
    };

    try {
      await axios.post(
        "http://localhost:3000/api/evaluacionRubricas",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("✅ Evaluación guardada con éxito");

      // limpiar formulario después de guardar
      setNombre("");
      setCargo("");
      setRespuestas({});
      setObservaciones("");

      onSuccess(); // refrescar lista
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar la evaluación");
    }
  };

  const renderCriterios = (criterios) =>
    criterios.map((criterioObj) => (
      <div className="criterios" key={criterioObj.nombre}>
        <div className="div_titulo">
          <h4 className="titulo_criterio">{criterioObj.titulo}</h4>
        </div>
        <h4 className="nombre_criterio">{criterioObj.nombre}</h4>
        <div className="criterios_radio">
          {[4, 3, 2, 1].map((valor) => (
            <label key={valor}>
              <input
                type="radio"
                name={criterioObj.nombre}
                value={valor}
                checked={respuestas[criterioObj.nombre] === valor}
                onChange={() => handleChange(criterioObj.nombre, valor)}
                required
              />
              <span>
                {valor} - {criterioObj.descripciones[valor]}
              </span>
            </label>
          ))}
        </div>
      </div>
    ));

  return (
    <form className="criterios_formularios" onSubmit={handleSubmit}>
      <div>
        <h1 className="h1_rubrica">Rúbrica de Evaluación</h1>
        <h1 className="h1_programa">Programa de Misiones</h1>

        <div className="escala">
          <h4>Escala de valoración</h4>
          <p>4 = Excelente</p>
          <p>3 = Bueno</p>
          <p>2 = Aceptable</p>
          <p>1 = Deficiente</p>
        </div>

        <div className="div_aviso">
          <h5 className="aviso">Todos los campos son obligatorios</h5>
        </div>

        {/* 🔹 Nuevos campos */}
        <h3>
          <input
            className="usuario"
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            className="usuario"
            type="text"
            placeholder="Tu cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
          />
        </h3>
      </div>

      <div>{renderCriterios(criteriosActividad1)}</div>

      <textarea
        placeholder="Observaciones (opcional)"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
      />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default RubricasForm;
