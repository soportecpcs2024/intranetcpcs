import React from 'react';

const Docente = ({ selectedGroup }) => {
  const dr_grup = [
    { "grupo": "1. A", "nombre": "SARA CRYSTAL CANO MOLINA" },
    { "grupo": "1. B", "nombre": "ELIZABETH MIRANDA LARA" },
     
    { "grupo": "2. A", "nombre": "MONICA MABEL BRAN NAVARRO" },
    { "grupo": "2. B", "nombre": "YULIETH ALEXANDRA GONZÁLEZ" },
    { "grupo": "2. C", "nombre": "NATALIA SEPULVEDA SEPULVEDA" },

    { "grupo": "3. A", "nombre": "YAMILE ANDREA CHAVARRIA GONZALEZ" },
    { "grupo": "3. B", "nombre": "CAROLINA GALLEGO PULGARIN" },
    
    { "grupo": "4. A", "nombre": "ELIANA ANDREA VILLA CHAVARRÍA" },
    { "grupo": "4. B", "nombre": "ANA CATALINACASTRILLON VILLA" },
    { "grupo": "4. C", "nombre": "ELIANA ANDREA VILLA CHAVARRÍA" },

    { "grupo": "5. A", "nombre": "ELIZABETH JIMÉNEZ BETANCOURT" },
    { "grupo": "5. B", "nombre": "YAQUELINE SIERRA RUIZ" },
    { "grupo": "5. C", "nombre": "VANESSA PERDOMO" },

    { "grupo": "6. A", "nombre": "ELIZABETH RAMÍREZ CÁRDENAS" },
    { "grupo": "6. B", "nombre": "STEFANIA MARÍN CANO" },

    { "grupo": "7. A", "nombre": "VANESSA MACHADO AGUIRRE" },
    { "grupo": "7. B", "nombre": "CAROLINA JIMÉNEZ BETANCOURT" },

    { "grupo": "8. A", "nombre": "ESTEBAN CÁRDENAS JARAMILLO" },
    { "grupo": "8. B", "nombre": "LAURA NOHELIA  RAMÍREZ MUÑOZ" },

    { "grupo": "9. A", "nombre": "NADIA CAICEDO MOSQUERA" },
    { "grupo": "9. B", "nombre": "JONATHAN DAVID CARDONA HOYOS" },
    { "grupo": "9. B1", "nombre": "NADIA CAICEDO MOSQUERA" },

    { "grupo": "10. A", "nombre": "SIMÓN ALEXIS GUERRERO GUTIÉRREZ" },
    { "grupo": "10. B", "nombre": "DIANA MILENA SALDAÑA HENAO" },

    { "grupo": "11. A", "nombre": "DORIÉ ALEJANDRA OSORIO RODRIGUEZ" },
    { "grupo": "11. B", "nombre": "JHONATAN AGUDELO" }
  ];

  const docente = dr_grup.find(d => d.grupo === selectedGroup);

  const capitalizeWords = (text) => {
    return text
      .toLowerCase() // Convierte todo el texto a minúsculas
      .split(' ')    // Divide el texto en palabras por espacio
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Convierte la primera letra de cada palabra a mayúscula
      .join(' ');    // Une las palabras de nuevo en una cadena
  };
  
  return (
    <div className='docente'>
      <h3 className='nom-docente'> {docente ? capitalizeWords( docente.nombre) : 'Selecciona un grupo'} </h3>
    </div>
  );
}

export default Docente;

