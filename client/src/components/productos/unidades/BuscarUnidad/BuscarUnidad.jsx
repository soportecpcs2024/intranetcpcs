import React from 'react';

const BuscarUnidad = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h3>Buscador de Unidades</h3>
      <input 
        type="text" 
        placeholder="Buscar unidad..." 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
    </div>
  );
};

export default BuscarUnidad;
