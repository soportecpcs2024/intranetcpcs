import React from 'react';

const ListarPromediosGrupos = ({ data }) => {
  // Agrupar por grupo
  const grupos = {};

  data.forEach((item) => {
    const grupo = item.grupo.trim(); // eliminamos espacios extra
    if (!grupos[grupo]) {
      grupos[grupo] = {
        total: 0,
        cantidad: 0,
      };
    }
    grupos[grupo].total += item.promedio;
    grupos[grupo].cantidad += 1;
  });

  const promediosPorGrupo = Object.entries(grupos).map(([grupo, { total, cantidad }]) => ({
    grupo,
    promedio: (total / cantidad).toFixed(2),
  }));

  return (
    <div>
      <h4>Promedio por grupo:</h4>
      <ul>
        {promediosPorGrupo.map(({ grupo, promedio }) => (
          <li key={grupo}>
            <strong>Grupo:</strong> {grupo} — <strong>Promedio:</strong> {promedio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarPromediosGrupos;
