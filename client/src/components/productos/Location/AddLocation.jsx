import React, { useState } from "react";
import { useProducts } from "../../../contexts/ProductContext";
import './AddLocation.css'; // Asegúrate de importar el archivo CSS

const AddLocation = () => {
  const { createLocation } = useProducts();
  const [locationData, setLocationData] = useState({ 
    nombre: "", 
    direccion: "", 
    otros_detalles: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llama a la función createLocation con los datos del formulario
      await createLocation(locationData);
      // Reinicia los campos del formulario tras la creación exitosa
      setLocationData({ nombre: "", direccion: "", otros_detalles: "" });
    } catch (error) {
      console.error("Error creating location", error);
    }
  };

  return (
    <div className="add-product-container">
      <h3>Add Location</h3>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Nombre"
          value={locationData.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="direccion">Dirección</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Dirección"
          value={locationData.direccion}
          onChange={handleChange}
          required
        />

        <label htmlFor="otros_detalles">Otros Detalles</label>
        <input
          type="text"
          id="otros_detalles"
          name="otros_detalles"
          placeholder="Otros Detalles"
          value={locationData.otros_detalles}
          onChange={handleChange}
        />

        <button className="submit-button" type="submit">Create Location</button>
      </form>
    </div>
  );
};

export default AddLocation;
