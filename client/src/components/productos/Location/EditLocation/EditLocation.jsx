import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext"; // Usa tu contexto para manejar las ubicaciones
import "./EditLocation.css"; // Mantenemos el mismo archivo CSS

const EditLocation = ({ locationId }) => { // locationId se pasa como prop
  const { getLocationById, updateLocation } = useProducts();
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
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensajes de éxito

  // Efecto para cargar los datos de la ubicación por ID
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const location = await getLocationById(locationId); // Cargar la ubicación existente por su ID
        if (location) {
          setLocationData(location); // Actualizar el estado con los datos de la ubicación
        } else {
          setErrorMessage("Ubicación no encontrada.");
        }
      } catch (err) {
        setErrorMessage("Error al cargar la ubicación.");
      }
    };

    loadLocationData();
  }, [locationId, getLocationById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? value : prevData.estado) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpia cualquier mensaje de error previo
    setSuccessMessage(""); // Limpia cualquier mensaje de éxito previo

    try {
      const { success, error } = await updateLocation(locationId, locationData); // Actualizar la ubicación
      if (success) {
        setSuccessMessage('Ubicación actualizada con éxito.');
        // Mantener los datos en el formulario, ya que es una actualización
        setTimeout(() => {
          setSuccessMessage(""); // Limpiar el mensaje de éxito
        }, 3000); // 3000 ms = 3 segundos
      } else {
        setErrorMessage(error || 'Error al actualizar la ubicación.');
        // Limpia el mensaje de error después de 3 segundos
        setTimeout(() => {
          setErrorMessage("");
        }, 3000); // 3000 ms = 3 segundos
      }
    } catch (err) {
      setErrorMessage('Error al actualizar la ubicación.');
      // Limpia el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // 3000 ms = 3 segundos
    }
  };

  return (
    <div className="add-product-container-location">
      <h3>EDITAR UBICACIÓN</h3>
      <form className="add-product-form" onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Mostrar mensaje de error */}
        {successMessage && <div className="success-message">{successMessage}</div>} {/* Mostrar mensaje de éxito */}

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
          Actualizar Ubicación
        </button>
      </form>
    </div>
  );
};

export default EditLocation;
