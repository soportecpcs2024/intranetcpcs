import PropTypes from "prop-types";

const Filtros_grafica = ({

    selectedGroup,
    setSelectedGroup,

}) => {
    return (
        <div className="content-select">
            <h4>Selecciona un grupo:</h4>
            <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
            >
                <option value="">Grupo</option>
                <option value="1. A">1. A</option>
                <option value="1. B">1. B</option>
                <option value="2. A">2. A</option>
                <option value="2. B">2. B</option>

                <option value="3. A">3. A</option>
                <option value="3. B">3. B</option>
                <option value="4. A">4. A</option>
                <option value="4. B">4. B</option>

                <option value="5. A">5. A</option>
                <option value="5. B">5. B</option>
                <option value="5. C">5. C</option>
                <option value="6. A">6. A</option>
                <option value="6. B">6. B</option>
                <option value="7. A">7. A</option>
                <option value="7. B">7. B</option>
                <option value="8. A">8. A</option>
                <option value="8. B">8. B</option>
                <option value="9. A">9. A</option>
                <option value="9. B">9. B</option>

                <option value="10. A">10. A</option>
                <option value="10. B">10. B</option>
                <option value="10. B1">10. B1</option>
                <option value="11. A">11. A</option>
                <option value="11. B">11. B</option>
            </select>
    </div>
  );
};

Filtros_grafica.propTypes = {
  selectedGroup: PropTypes.string.isRequired,
  setSelectedGroup: PropTypes.func.isRequired,
};

export default Filtros_grafica;


 
