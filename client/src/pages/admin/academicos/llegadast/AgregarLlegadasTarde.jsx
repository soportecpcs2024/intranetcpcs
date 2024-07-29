import React, { useState } from 'react';
import { format, addHours } from 'date-fns';
import './AgregarLlegadasTarde.css';
import { crearLlegadasTardeData } from "../../../../api/DataApi";

const AgregarLlegadasTarde = () => {
  const [numIdentificacion, setNumIdentificacion] = useState('');
  const [fecha, setFecha] = useState('');
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddFecha = async (e) => {
    e.preventDefault();
    if (!fecha || !numIdentificacion) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Ajustar la fecha seleccionada a UTC teniendo en cuenta la diferencia horaria de Colombia
    const fechaLocal = new Date(fecha);
    const fechaUtc = addHours(fechaLocal, 5); // Colombia está en UTC-5

    const nuevaLlegada = {
      num_identificacion: numIdentificacion,
      fechas: [fechaUtc.toISOString()],
    };

    try {
      const result = await crearLlegadasTardeData(nuevaLlegada);
      setFechas([...fechas, fechaLocal]);
      setFecha(''); // Limpiar campo de fecha
      setSuccess('Fecha guardada con éxito');
      console.log("Fecha guardada con éxito:", result);
    } catch (err) {
      console.error("Error al guardar la fecha:", err);
      setError('Error al guardar la fecha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agregarLlegadasTarde">
      <h3>Agregar Llegadas Tarde</h3>
      <form onSubmit={handleAddFecha}>
        <div className="form-group">
          <label>Número de Identificación:</label>
          <input
            type="text"
            value={numIdentificacion}
            onChange={(e) => setNumIdentificacion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Agregar Fecha'}
          </button>
        </div>
        <ul>
          {fechas.map((fecha, idx) => (
            <li key={idx}>{format(new Date(fecha), 'dd/MM/yyyy')}</li>
          ))}
        </ul>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default AgregarLlegadasTarde;

