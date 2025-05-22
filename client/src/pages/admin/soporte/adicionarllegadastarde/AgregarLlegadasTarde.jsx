import  { useState } from 'react';
import { addHours } from 'date-fns';
import './AgregarLlegadasTarde.css';
import { CrearLlegadasTardeData } from "../../../../api/DataApi";

const AgregarLlegadasTarde = () => {
  const [numIdentificacion, setNumIdentificacion] = useState('');
  const [fecha, setFecha] = useState('');
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddFecha = async (e) => {
    e.preventDefault();
    
    const trimmedNumIdentificacion = numIdentificacion.trim();
    const trimmedFecha = fecha.trim();
    
    if (!trimmedFecha || !trimmedNumIdentificacion) {
      setError('Por favor, completa todos los campos.');
      clearMessage();
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const fechaLocal = new Date(trimmedFecha);
    const fechaUtc = addHours(fechaLocal, 5);

    const nuevaLlegada = {
      num_identificacion: trimmedNumIdentificacion,
      fechas: [fechaUtc.toISOString()],
    };

    try {
      await CrearLlegadasTardeData(nuevaLlegada);
      setFechas([...fechas, fechaLocal]);
      setNumIdentificacion('');
      setFecha('');
      setSuccess('Fecha guardada con éxito');
    } catch (err) {
      setError('Error al guardar la fecha');
    } finally {
      setLoading(false);
      clearMessage();
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000); // 4 seconds
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
            onChange={(e) => setNumIdentificacion(e.target.value.trim())}
            required
            placeholder='Ingresa el N° de documento'
          />
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
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      </form>
    </div>
  );
};

export default AgregarLlegadasTarde;
