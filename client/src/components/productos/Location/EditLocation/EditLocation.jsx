import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../../contexts/ProductContext";
import "./EditLocation.css"; // Asegúrate de importar el archivo CSS

const EditLocation = () => {
  const { id } = useParams();
  const { locations, fetchLocations, updateLocation, loadingLocations, errorLocations } = useProducts();
  const [location, setLocation] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    otros_detalles: "",
    entregado_por: "",
    recibido_por: "",
    aprobado_por: "",
    estado: "activo", // Valor por defecto
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingLocations && locations.length > 0) {
      const foundLocation = locations.find((loc) => loc._id === id);
      if (foundLocation) {
        setLocation(foundLocation);
        setFormData({
          nombre: foundLocation.nombre,
          direccion: foundLocation.direccion,
          otros_detalles: foundLocation.otros_detalles,
          entregado_por: foundLocation.entregado_por,
          recibido_por: foundLocation.recibido_por,
          aprobado_por: foundLocation.aprobado_por,
          estado: foundLocation.estado || "activo", // Asegúrate de establecer un estado por defecto si es necesario
        });
      }
    } else {
      fetchLocations(); // Fetch locations if not already loaded
    }
  }, [id, locations, loadingLocations, fetchLocations]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? value : "inactivo") : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLocation = {
      ...formData,
      estado: formData.estado === "activo" ? "activo" : "inactivo", // Asegurarse de que el estado sea correcto
    };
    updateLocation(id, updatedLocation);
    navigate("/admin/administracion/location_list");
  };

  if (loadingLocations) {
    return <p>Cargando...</p>;
  }

  if (errorLocations) {
    return <p>Error al cargar la ubicación: {errorLocations.message}</p>;
  }

  if (!location) {
    return <p>Ubicación no encontrada.</p>;
  }

  return (
    <div className="add-product-container-location">
      <h3>EDITAR UBICACIÓN</h3>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="location-name-estado">
          <div className="boxlocation">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
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
                  checked={formData.estado === "activo"}
                  onChange={handleChange}
                />
                <label htmlFor="estado_activo">Activo</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="estado_inactivo"
                  name="estado"
                  value="inactivo"
                  checked={formData.estado === "inactivo"}
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
          value={formData.direccion}
          onChange={handleChange}
          required
        />

        <label htmlFor="otros_detalles">Otros Detalles</label>
        <input
          type="text"
          id="otros_detalles"
          name="otros_detalles"
          placeholder="Otros Detalles"
          value={formData.otros_detalles}
          onChange={handleChange}
        />

        <div className="location-encargados">
          <div className="location-box">
            <input
              type="text"
              id="entregado_por"
              name="entregado_por"
              placeholder="Asignado por"
              value={formData.entregado_por}
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
              value={formData.recibido_por}
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
              value={formData.aprobado_por}
              onChange={handleChange}
            />
            <label htmlFor="aprobado_por">Aprobado por</label>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditLocation;
