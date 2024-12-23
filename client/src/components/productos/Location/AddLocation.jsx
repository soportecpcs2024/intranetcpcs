import React, { useState, useContext } from "react";
import { useProducts } from "../../../contexts/ProductContext";
import { UserContext } from "../../../contexts/UserContext";
import "./AddLocation.css";

// Función para capitalizar la primera letra de cada palabra
const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AddLocation = () => {
  const { createLocation } = useProducts();
  const [locationData, setLocationData] = useState({
    nombre: "",
    direccion: "",
    otros_detalles: "",
    entregado_por: "",
    recibido_por: "",
    email_recibido_por: "",
    aprobado_por: "",
    estado: "Inactivo",
    fecha_entrega: "",
    fecha_devolucion: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { usuarios } = useContext(UserContext); // Obtén los usuarios del contexto

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? value : prevData.estado) : value,
    }));
  };

  const handleRecibidoPorChange = (e) => {
    const { value } = e.target;
    setLocationData((prevData) => {
      const user = usuarios.find((usuario) => usuario.name === value); // Busca el usuario seleccionado
      console.log(user.name);
      console.log(user.email);

      return {
        ...prevData,
        recibido_por: value,
        email_recibido_por: user.email , // Asigna el email del usuario seleccionado
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { success, error } = await createLocation(locationData);
      if (success) {
        setSuccessMessage("Ubicación creada con éxito.");
        setTimeout(() => {
          setSuccessMessage("");
          setLocationData({
            nombre: "",
            direccion: "",
            otros_detalles: "",
            entregado_por: "",
            recibido_por: "",
            email_recibido_por: "",
            aprobado_por: "",
            estado: "Inactivo",
            fecha_entrega: "",
            fecha_devolucion: "",
          });
        }, 3000);
      } else {
        setErrorMessage(error || "Error al crear la ubicación.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (err) {
      setErrorMessage("Error al crear la ubicación.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div className="add-product-container-location">
      <h3>CREAR UBICACIÓN</h3>
      <form className="add-product-form" onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

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
            <label htmlFor="entregado_por">Asignado por</label>
            <select
              id="entregado_por"
              name="entregado_por"
              value={locationData.entregado_por}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario.name}>
                  {capitalizeWords(usuario.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="location-box">
            <label htmlFor="recibido_por">Recibido por</label>
            <select
              id="recibido_por"
              name="recibido_por"
              value={locationData.recibido_por}
              onChange={handleRecibidoPorChange} // Usamos el manejador específico para este campo
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario.name}>
                  {capitalizeWords(usuario.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="location-box">
            <label htmlFor="aprobado_por">Aprobado por</label>
            <select
              id="aprobado_por"
              name="aprobado_por"
              value={locationData.aprobado_por}
              onChange={handleChange}
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario.name}>
                  {capitalizeWords(usuario.name)}
                </option>
              ))}
            </select>
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
