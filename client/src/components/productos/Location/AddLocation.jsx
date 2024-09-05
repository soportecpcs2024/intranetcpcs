import React, { useState } from "react";
import { useProducts } from "../../../contexts/ProductContext";
import "./AddLocation.css"; // Asegúrate de importar el archivo CSS

const AddLocation = () => {
  const { createLocation } = useProducts();
  const [locationData, setLocationData] = useState({
    nombre: "",
    direccion: "",
    otros_detalles: "",
    entregado_por: "",
    recibido_por: "",
    aprobado_por: "",
    estado: "Inactivo", // Estado inicializado como "Inactivo" por defecto
    fecha_entrega: "",
    fecha_devolucion: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? value : prevData.estado) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llama a la función createLocation con los datos del formulario
      await createLocation(locationData);
      // Reinicia los campos del formulario tras la creación exitosa
      setLocationData({
        nombre: "",
        direccion: "",
        otros_detalles: "",
        entregado_por: "",
        recibido_por: "",
        aprobado_por: "",
        estado: "Inactivo", // Reinicia el estado a "Inactivo"
        fecha_entrega: "",
        fecha_devolucion: "",
      });
    } catch (error) {
      console.error("Error creating location", error);
    }
  };

  return (
    <div className="add-product-container-location">
      <h3>CREAR UBICACIÓN</h3>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="location-name-estado">
          <div className="boxlocation">
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
          </div>
          <div className="boxlocation">
            <label htmlFor="estado">Estado</label>

            <div className="location-estado">
              <div>
                <input
                  type="checkbox"
                  id="estado_activo"
                  name="estado"
                  value="activo"
                  checked={locationData.estado === "activo"}
                  onChange={handleChange}
                />
                <label htmlFor="estado_activo">Activo</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  id="estado_inactivo"
                  name="estado"
                  value="Inactivo"
                  checked={locationData.estado === "Inactivo"}
                  onChange={handleChange}
                />
                <label htmlFor="estado_inactivo">Inactivo</label>
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="direccion">Ubicación</label>
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

        <div className="location-encargados">
          <div className="location-box">
            <input
              type="text"
              id="entregado_por"
              name="entregado_por"
              placeholder="Asignado por"
              value={locationData.entregado_por}
              onChange={handleChange}
              required
            />
            <label htmlFor="entregado_por">Asignado por</label>
          </div>

          <div className="location-box">
            <input
              type="text"
              id="recibido_por"
              name="recibido_por"
              placeholder="Recibido por"
              value={locationData.recibido_por}
              onChange={handleChange}
            />
            <label htmlFor="recibido_por">Recibido por</label>
          </div>

          <div className="location-box">
            <input
              type="text"
              id="aprobado_por"
              name="aprobado_por"
              placeholder="Aprobado por"
              value={locationData.aprobado_por}
              onChange={handleChange}
            />
            <label htmlFor="aprobado_por">Aprobado por</label>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Crear Ubicación
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
