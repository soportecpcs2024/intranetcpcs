import React, { useState, useEffect, useContext } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import { UserContext } from "../../../../contexts/UserContext";
import "./createUnits.css";

const CreateUnits = () => {
  const {
    products,
    locations,
    createUnits,
    fetchLocations,
    fetchProducts,
    fetchUnits,
    loading,
  } = useProducts();

  const { usuarios } = useContext(UserContext);

  const [units, setUnits] = useState([
    {
      id_producto: "",
      location: "",
      estado: "Inactivo",
      fecha_entrega: "",
      fecha_devolucion: "",
      entregado_por: "",
      recibido_por: "",
      email_recibido_por: "",
      aprobado_por: "",
      observaciones: "",
    },
  ]);

  useEffect(() => {
    if (!loading) {
      fetchLocations();
      fetchProducts();
    }
  }, [loading, fetchLocations, fetchProducts]);

  const handleChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newUnits = [...units];

    if (type === "checkbox") {
      newUnits[index].estado = checked ? value : "Inactivo";
    } else {
      newUnits[index][name] = value;

      if (name === "recibido_por") {
        const selectedUser = usuarios.find((usuario) => usuario.name === value);
        newUnits[index].email_recibido_por = selectedUser ? selectedUser.email : "";
      }
    }

    setUnits(newUnits);
  };

  const addUnit = () => {
    setUnits([
      ...units,
      {
        id_producto: "",
        location: "",
        estado: "Inactivo",
        fecha_entrega: "",
        fecha_devolucion: "",
        entregado_por: "",
        recibido_por: "",
        email_recibido_por: "",
        aprobado_por: "",
        observaciones: "",
      },
    ]);
  };

  const removeUnit = (index) => {
    const newUnits = units.filter((_, i) => i !== index);
    setUnits(newUnits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createUnits(units);
      await fetchUnits();
      setUnits([
        {
          id_producto: "",
          location: "",
          estado: "Inactivo",
          fecha_entrega: "",
          fecha_devolucion: "",
          entregado_por: "",
          recibido_por: "",
          email_recibido_por: "",
          aprobado_por: "",
          observaciones: "",
        },
      ]);
    } catch (error) {
      console.error("Error al crear unidades:", error);
    }
  };

  const sortedLocations = locations.sort((a, b) =>
    a.direccion.localeCompare(b.direccion)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="form-createUnits" onSubmit={handleSubmit}>
      <h2>Crear Unidades</h2>
      {units.map((unit, index) => (
        <div key={index} className="unit-form-group">
          <div className="form-group">
            <label>Producto:</label>
            <select
              name="id_producto"
              value={unit.id_producto}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Seleccione un producto</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.brand})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ubicación:</label>
            <select
              name="location"
              value={unit.location}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Seleccione una ubicación</option>
              {sortedLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.direccion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-entregas">
            <div className="box">
              <label>Entregado por:</label>
              <select
                name="entregado_por"
                value={unit.entregado_por}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.name}>
                    {usuario.name}
                  </option>
                ))}
              </select>

              <label>Responsable:</label>
              <select
                name="recibido_por"
                value={unit.recibido_por}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.name}>
                    {usuario.name}
                  </option>
                ))}
              </select>

              <label>Aprobado por:</label>
              <select
                name="aprobado_por"
                value={unit.aprobado_por}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario._id} value={usuario.name}>
                    {usuario.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="box">
              <label>Fecha entrega:</label>
              <input
                type="date"
                name="fecha_entrega"
                value={unit.fecha_entrega}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado:</label>
            <div className="location-estado">
              <label>
                <input
                  type="checkbox"
                  name="estado"
                  value="activo"
                  checked={unit.estado === "activo"}
                  onChange={(e) => handleChange(index, e)}
                />
                Activo
              </label>

              <label>
                <input
                  type="checkbox"
                  name="estado"
                  value="Inactivo"
                  checked={unit.estado === "Inactivo"}
                  onChange={(e) => handleChange(index, e)}
                />
                De baja
              </label>
            </div>

            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              name="observaciones"
              value={unit.observaciones}
              onChange={(e) => handleChange(index, e)}
              rows="4"
              cols="50"
            />
          </div>
        </div>
      ))}

      <div className="acciones-crear-unidad">
      <div>
          <button
            type="button"
            className="remove-button"
            onClick={() => removeUnit(index)}
          >
            Eliminar Unidad
          </button>
        </div>
        <button type="button" className="add-button" onClick={addUnit}>
          Añadir Otra Unidad
        </button>
        <button type="submit" className="submit-button">
          Crear Unidades
        </button>
      </div>
    </form>
  );
};

export default CreateUnits;
