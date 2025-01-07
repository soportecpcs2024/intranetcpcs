import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuscarGraduado = () => {
  const [numDocumento, setNumDocumento] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para buscar estudiantes por número de documento
  const buscarEstudiantes = async () => {
    if (!numDocumento) {
      setError('Por favor, ingresa un número de documento.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3000/api/actasGrados/studentsGraduate/search?numDocumento=${numDocumento}`);
      setResultados(response.data); // Suponiendo que la respuesta es un array de resultados
    } catch (err) {
      setError('Hubo un error al buscar los estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscador de Estudiantes</h2>
      <input
        type="text"
        value={numDocumento}
        onChange={(e) => setNumDocumento(e.target.value)}
        placeholder="Ingresa el número de documento"
      />
      <button onClick={buscarEstudiantes} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Resultados de búsqueda:</h3>
        {resultados.length > 0 ? (
          <ul>
            {resultados.map((estudiante) => (
              <li key={estudiante.numDocumento}>
                <p>Nombre: {estudiante.nombre}</p>
                <p>Documento: {estudiante.numDocumento}</p>
                {/* Agrega más campos según lo que devuelva la API */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron estudiantes.</p>
        )}
      </div>
    </div>
  );
};

export default BuscarGraduado;
