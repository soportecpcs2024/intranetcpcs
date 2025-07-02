import PropTypes from 'prop-types';

const BuscadorEstudiante = ({
  busqueda,
  setBusqueda,
  estudiantes,
  buscarEstudiantes,
  onSelectEstudiante,
}) => {
  return (
    <div className="buscador-estudiante">
      <input
        type="text"
        placeholder="Buscar estudiante por nombre"
        value={busqueda}
        onChange={(e) => {
          const value = e.target.value;
          setBusqueda(value);
          buscarEstudiantes(value);
        }}
      />
      {busqueda && estudiantes.length > 0 && (
        <ul className="resultado-busqueda">
          {estudiantes.map((est) => (
            <li
              key={est._id}
              onClick={() => {
                onSelectEstudiante(est);
                setBusqueda("");
              }}
            >
              {est.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

BuscadorEstudiante.propTypes = {
  busqueda: PropTypes.string.isRequired,
  setBusqueda: PropTypes.func.isRequired,
  estudiantes: PropTypes.array.isRequired,
  buscarEstudiantes: PropTypes.func.isRequired,
  onSelectEstudiante: PropTypes.func.isRequired,
};

export default BuscadorEstudiante;
