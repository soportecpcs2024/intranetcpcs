import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./createUnits.css";

const CreateUnits = () => {
  const { products, locations, createUnits, fetchLocations, loading } =
    useProducts();
  const [units, setUnits] = useState([
    { id_producto: "", location: "", estado: "" },
  ]);

  useEffect(() => {
    if (loading) {
      console.log("Loading products and locations...");
    } else {
      fetchLocations(); // Asegurarse de que las ubicaciones se carguen cuando el componente se monte
    }
  }, [loading, fetchLocations]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newUnits = [...units];
    newUnits[index][name] = value;
    setUnits(newUnits);
  };

  const addUnit = () => {
    setUnits([...units, { id_producto: "", location: "", estado: "" }]);
  };

  const removeUnit = (index) => {
    const newUnits = units.filter((_, i) => i !== index);
    setUnits(newUnits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createUnits(units);
      setUnits([{ id_producto: "", location: "", estado: "" }]);
    } catch (error) {
      console.error("Error al crear unidades:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="form-createUnits" onSubmit={handleSubmit}>
      <h2>Crear Unidades</h2>
      {units.map((unit, index) => (
        <div key={index}>
          <div>
            <label>
              Productos  :
              </label>
              <select
                name="id_producto"
                value={unit.id_producto}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Seleccione un producto</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
          </div>
          <div>
            <label>
              Ubicación :
              <select
                name="location"
                value={unit.location} // Corregido para usar la clave correcta
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Seleccione una ubicación</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Estado:
            <input
              type="text"
              name="estado"
              value={unit.estado}
              onChange={(e) => handleChange(index, e)}
            />
          </label>
          <button type="button" onClick={() => removeUnit(index)}>
            Eliminar Unidad
          </button>
        </div>
      ))}
      <button type="button" onClick={addUnit}>
        Añadir Otra Unidad
      </button>
      <button type="submit">Crear Unidades</button>
    </form>
  );
};

export default CreateUnits;
