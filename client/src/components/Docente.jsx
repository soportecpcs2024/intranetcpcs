import React from 'react';

const Docente = ({ selectedGroup }) => {
  const dr_grup = [
    { "grupo": "1. A", "nombre": "SARA CRYSTAL CANO MOLINA" },
    { "grupo": "1. B", "nombre": "LUISA FERNANDA ARANGO UPEGUI" },
    { "grupo": "1. C", "nombre": "MARIA ALEJANDRA CASTIBLANCO TABARES" },
    { "grupo": "2. A", "nombre": "YULIETH ALEXANDRA GONZALEZ" },
    { "grupo": "2. B", "nombre": "NATALIA ANDREA SEPULVEDA SEPULVEDA" },
    { "grupo": "3. A", "nombre": "LUZ YADIRA RENGIFO PARDO" },
    { "grupo": "3. B", "nombre": "CAROLINA GALLEGO PULGARIN" },
    { "grupo": "3. C", "nombre": "ZAYRA LORENA VILLA CHAVARRIA" },
    { "grupo": "4. A", "nombre": "SULEIMI ANDREA BETANCUR MURCIA" },
    { "grupo": "4. B", "nombre": "ELIANA ANDREA VILLA CHAVARRIA" },
    { "grupo": "5. A", "nombre": "MIRIAM YAMILE TORRES RUIZ" },
    { "grupo": "5. B", "nombre": "YAQUELINE SIERRA RUIZ" },
    { "grupo": "6. A", "nombre": "ALEJANDRA MARIA GOMEZ VALLEJO" },
    { "grupo": "6. B", "nombre": "VANESSA MACHADO AGUIRRE" },
    { "grupo": "7. A", "nombre": "JONATHAN DAVID CARDONA HOYOS" },
    { "grupo": "7. B", "nombre": "ELIZABETH RAMIREZ CARDENAS" },
    { "grupo": "8. A", "nombre": "ANA LILIA PERUGACHE MENESES" },
    { "grupo": "8. B", "nombre": "LAURA NOHELIA RAMIREZ MUÑOZ" },
    { "grupo": "8. B1", "nombre": "CAROLINA JIMENEZ BETANCOURT" },
    { "grupo": "8. C", "nombre": "CAROLINA JIMENEZ BETANCOURT" },
    { "grupo": "9. A", "nombre": "NADIA CAICEDO MOSQUERA" },
    { "grupo": "9. B", "nombre": "EMILIO JOSE RIOS RIOS" },
    { "grupo": "10. A", "nombre": "CARLOS FERNANDO RUGE URIBE" },
    { "grupo": "10. B", "nombre": "DIANA MILENA SALDAÑA HENAO" },
    { "grupo": "10. C", "nombre": "JUAN PABLO LARGO GUZMAN" },
    { "grupo": "11. A", "nombre": "JONATHAN DUQUE ARENAS" },
    { "grupo": "11. B", "nombre": "DORIE ALEJANDRA OSORIO RODRIGUEZ" }
  ];

  const docente = dr_grup.find(d => d.grupo === selectedGroup);

  return (
    <div className='docente'>
      <h3 className='nom-docente'> {docente ? docente.nombre : 'Selecciona un grupo'} </h3>
    </div>
  );
}

export default Docente;

