import React from 'react';

const FiltroLlegadasTarde = ({
  selectedGroup,
  setSelectedGroup
}) => {
  return (
    <div className="content-select">
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value.trim())}
        className="filter-select"
      >
        <option value="">Todos los Grupos</option>
        <option value="JARDIN">Jardín</option>
        <option value="1. A">1. A</option>
        <option value="1. B">1. B</option>
        <option value="1. C">1. C</option>
        <option value="2. A">2. A</option>
        <option value="2. B">2. B</option>
        <option value="3. A">3. A</option>
        <option value="3. B">3. B</option>
        <option value="3. C">3. C</option>
        <option value="4. A">4. A</option>
        <option value="4. B">4. B</option>
        <option value="5. A">5. A</option>
        <option value="5. B">5. B</option>
        <option value="6. A">6. A</option>
        <option value="6. B">6. B</option>
        <option value="7. A">7. A</option>
        <option value="7. B">7. B</option>
        <option value="OCTAVO A">8. A</option>
        <option value="OCTAVO B">8. B</option>
        <option value="8. B1">8. B1</option>
        <option value="8. C">8. C</option>
        <option value="9. A">9. A</option>
        <option value="9. B">9. B</option>
        <option value="10. A">10. A</option>
        <option value="DECIMO B">10. B</option>
        <option value="10. C">10. C</option>
        <option value="11. A">11. A</option>
        <option value="11. B">11. B</option>
      </select>
    </div>
  );
};

export default FiltroLlegadasTarde;


