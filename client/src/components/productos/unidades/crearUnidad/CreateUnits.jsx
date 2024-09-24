import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
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

  const [units, setUnits] = useState([
    {
      id_producto: "",
      location: "",
      estado: "Inactivo",
      fecha_entrega: "",
      fecha_devolucion: "",
      entregado_por: "",
      recibido_por: "",
      aprobado_por: "",
      observaciones: "",
    },
  ]);

  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);

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
      newUnits[index].estado = value;
    } else {
      newUnits[index][name] = value;
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
        aprobado_por: "",
        observaciones: "",
      },
    ]);
  };

  const removeUnit = (index) => {
    const newUnits = units.filter((_, i) => i !== index);
    setUnits(newUnits);
    setGeneratedQRCodes(generatedQRCodes.filter((_, i) => i !== index));
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
          aprobado_por: "",
          observaciones: "",
        },
      ]);
    } catch (error) {
      console.error("Error al crear unidades:", error);
    }
  };

  const sortedLocations = [...locations].sort((a, b) => {
    const nameA = a.direccion.toLowerCase();
    const nameB = b.direccion.toLowerCase();
    return nameA.localeCompare(nameB);
  });

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
              <input
                type="text"
                name="entregado_por"
                value={unit.entregado_por}
                onChange={(e) => handleChange(index, e)}
              />
              <label>Responsable:</label>
              <input
                type="text"
                name="recibido_por"
                value={unit.recibido_por}
                onChange={(e) => handleChange(index, e)}
              />
              <label>Aprobado por:</label>
              <input
                type="text"
                name="aprobado_por"
                value={unit.aprobado_por}
                onChange={(e) => handleChange(index, e)}
              />
            </div>

            <div className="box">
              <label>Fecha entrega:</label>
              <input
                type="date"
                name="fecha_entrega"
                className="box"
                value={unit.fecha_entrega}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado:</label>
            <div className="location-estado">
              <div>
                <input
                  type="checkbox"
                  id={`estado_activo_${index}`}
                  name="estado"
                  value="activo"
                  checked={unit.estado === "activo"}
                  onChange={(e) => handleChange(index, e)}
                />
                <label htmlFor={`estado_activo_${index}`}>Activo</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  id={`estado_inactivo_${index}`}
                  name="estado"
                  value="Inactivo"
                  checked={unit.estado === "Inactivo"}
                  onChange={(e) => handleChange(index, e)}
                />
                <label htmlFor={`estado_inactivo_${index}`}>De baja</label>
              </div>
            </div>
            <div>
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                name="observaciones"
                value={unit.observaciones}
                onChange={(e) => handleChange(index, e)}
                rows="4" // puedes ajustar el número de filas según lo que necesites
                cols="50" // puedes ajustar el número de columnas también
              />
            </div>
          </div>

          <button
            type="button"
            className="remove-button"
            onClick={() => removeUnit(index)}
          >
            Eliminar Unidad
          </button>

          {generatedQRCodes[index] && (
            <div className="qr-code">
              <img src={generatedQRCodes[index]} alt="QR Code" />
            </div>
          )}
        </div>
      ))}

      <button type="button" className="add-button" onClick={addUnit}>
        Añadir Otra Unidad
      </button>
      <button type="submit" className="submit-button">
        Crear Unidades
      </button>
    </form>
  );
};

export default CreateUnits;
