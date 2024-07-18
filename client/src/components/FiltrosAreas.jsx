import React from "react";
import Docente from "./Docente";

const FiltrosAreas = ({
  selectedPeriodo,
  setSelectedPeriodo,
  selectedGroup,
  setSelectedGroup,
  selectedScale,
  setSelectedScale,
  selectedArea, // Agregar el estado para el área seleccionada
  setSelectedArea, // Agregar la función para cambiar el área seleccionada
}) => {
  return (
    <div className="content-select">
      <select
        value={selectedPeriodo}
        onChange={(e) => setSelectedPeriodo(e.target.value)}
      >
        <option value="">Periodo</option>
        <option value="PERIODO 1">Periodo 1</option>
        <option value="PERIODO 2">Periodo 2</option>
        <option value="PERIODO 3">Periodo 3</option>
        <option value="PERIODO 4">Periodo 4</option>
      </select>

      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        <option value="">Grupo</option>
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
        <option value="8. A">8. A</option>
        <option value="8. B">8. B</option>
        <option value="8. B1">8. B1</option>
        <option value="8. C">8. C</option>
        <option value="9. A">9. A</option>
        <option value="9. B">9. B</option>
        <option value="10. A">10. A</option>
        <option value="10. B">10. B</option>
        <option value="10. C">10. C</option>
        <option value="11. A">11. A</option>
        <option value="11. B">11. B</option>
      </select>

      <select
        value={selectedScale}
        onChange={(e) => setSelectedScale(e.target.value)}
      >
        <option value="">Niveles</option>
        <option value="DI">DI</option>
        <option value="BÁSICO">BÁSICO</option>
        <option value="DA">DA</option>
        <option value="DS">DS</option>
      </select>

      <select
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
      >
        <option value="">Áreas</option>
        <option value="ciencias_naturales">C. Naturales</option>
        <option value="fisica">Física</option>
        <option value="quimica">Química</option>
        <option value="ciencias_politicas_economicas">C. políticas/económicas</option>
        <option value="ciencias_sociales">C. Sociales</option>
        <option value="civica_y_constitucion">Cívica/constitución</option>
        <option value="educacion_artistica">Ed. artística</option>
        <option value="educacion_cristiana">Ed. cristiana</option>
        <option value="educacion_etica">Ed. ética</option>
        <option value="educacion_fisica">Ed. física</option>
        <option value="filosofia">filosofía</option>
        <option value="idioma_extranjero">Idioma extranjero</option>
        <option value="lengua_castellana">Lengua castellana</option>
        <option value="matematicas">Matemáticas</option>
        <option value="tecnologia">Tecnología</option>
      </select>

      <Docente />
    </div>
  );
};

export default FiltrosAreas;
