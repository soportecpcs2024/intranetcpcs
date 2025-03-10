
const FiltroLlegadasTarde = ({
  selectedGroup,
  setSelectedGroup
}) => {
  return (
    <div className="content-select">
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value.trim())}
        className="filter-select-llegadas"
      >
        <option value="">Selecciona el grupos</option>
        <option value="PRE-JARDIN">Pre Jardín</option>
        <option value="JARDIN">Jardín</option>
        <option value="TRANSICION A">Transición A</option>
        <option value="TRANSICION B">transición B</option>
        <option value="PRIMERO A">1. A</option>
        <option value="PRIMERO B">1. B</option>

        <option value="SEGUNDO A">2. A</option>
        <option value="SEGUNDO B">2. B</option>
        <option value="SEGUNDO C">2. C</option>

        <option value="TERCERO A">3. A</option>
        <option value="TERCERO B">3. B</option>
        
        <option value="CUARTO A">4. A</option>
        <option value="CUARTO B">4. B</option>
        <option value="CUARTO C">4. C</option>

        <option value="QUINTO A">5. A</option>
        <option value="QUINTO B">5. B</option>

        <option value="SEXTO A">6. A</option>
        <option value="SEXTO B">6. B</option>

        <option value="SEPTIMO A">7. A</option>
        <option value="SEPTIMO B">7. B</option>

        <option value="OCTAVO A">8. A</option>
        <option value="OCTAVO B">8. B</option>
       


        
        <option value="NOVENO A">9. A</option>
        <option value="NOVENO B">9. B</option>
        <option value="NOVENO C">9. C</option>
        <option value="NOVENO B1">9. B1</option>

        <option value="DECIMO A">10. A</option>
        <option value="DECIMO B">10. B</option>

        
        <option value="ONCE A">11. A</option>
        <option value="ONCE B">11. B</option>
      </select>
    </div>
  );
};

export default FiltroLlegadasTarde;


