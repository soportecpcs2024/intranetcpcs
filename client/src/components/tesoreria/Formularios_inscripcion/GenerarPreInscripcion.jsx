import { useState } from "react";
import axios from "axios";
import GenerarReciboFormulario from "./GenerarReciboFormulario";
import "./Admisiones.css";

const GenerarPreInscripcion = () => {
  const [datosFormulario, setDatosFormulario] = useState({
    nombreEstudiante: "",
    gradoPostula: "",
    
    tipoFormulario: "2026",
  });

  const [tipoPago, setTipoPago] = useState("");
  const [formularioGuardado, setFormularioGuardado] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoPago) {
      alert("Por favor selecciona un método de pago.");
      return;
    }

    try {
      const datosCompletos = {
        ...datosFormulario,
        tipoPago,
      };

      const res = await axios.post(
        `${apiBaseUrl}/api/preinscripciones`,
        datosCompletos
      );
      setFormularioGuardado(res.data);
      alert("Formulario guardado y listo para descargar.");

      // ✅ Limpiar campos después del guardado
      setDatosFormulario({
        nombreEstudiante: "",
        gradoPostula: "",
         
        tipoFormulario: "2026",
      });
      setTipoPago("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error al guardar el formulario.");
    }
  };

  return (
    <div className="admisiones-container">
      <div className="tiluto-admisiones-container">
        <h2>Formulario de Admisiones</h2>
      </div>

      <form className="admisiones-form" onSubmit={handleSubmit}>
        <label>Nombre del estudiante</label>
        <input
          type="text"
          name="nombreEstudiante"
          onChange={handleChange}
          value={datosFormulario.nombreEstudiante}
          required
        />

        <label>Grado al que postula</label>
        <input
          type="text"
          name="gradoPostula"
          onChange={handleChange}
          value={datosFormulario.gradoPostula}
          required
        />

        

        <label>Tipo de formulario</label>
        <select
          name="tipoFormulario"
          onChange={handleChange}
          value={datosFormulario.tipoFormulario}
          required
        >
          <option value="2026">2026 - $65.000</option>
          <option value="2025">2025 - $60.000</option>
          <option value="Open House">Open House - $30.000</option>
        </select>

        <div className="container-tipopago">
          <h4>Tipo de Pago:</h4>
          <div className="radio-options">
            {["Efectivo", "Datáfono", "Nómina", "Banco"].map((metodo) => (
              <label key={metodo} className="radio-label">
                <input
                  type="radio"
                  name="tipoPago"
                  value={metodo}
                  checked={tipoPago === metodo}
                  onChange={(e) => setTipoPago(e.target.value)}
                  required
                />
                {metodo}
              </label>
            ))}
          </div>
        </div>

        <button className="boton-guardar" type="submit">
          Guardar
        </button>
      </form>

      {formularioGuardado && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <GenerarReciboFormulario
            data={formularioGuardado}
            onDescargar={() => setFormularioGuardado(null)}
          />
        </div>
      )}
    </div>
  );
};

export default GenerarPreInscripcion;
