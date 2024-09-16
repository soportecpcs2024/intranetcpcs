import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./createUnits.css";

const CreateUnits = () => {
  const { products, locations, createUnits, fetchLocations, fetchProducts, loading } = useProducts();
  const [units, setUnits] = useState([{ id_producto: "", location: "", estado: "" }]);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]); // Estado para guardar los códigos QR

  useEffect(() => {
    if (!loading) {
      fetchLocations();
      fetchProducts();
    }
  }, [loading, fetchLocations, fetchProducts]);

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
    setGeneratedQRCodes(generatedQRCodes.filter((_, i) => i !== index)); // Actualiza los QR al eliminar unidades
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createUnits(units);
      // Verifica si la respuesta tiene la propiedad qrCodes
      if (response && response.qrCodes) {
        setGeneratedQRCodes(response.qrCodes);
      } else {
        console.error("La respuesta no contiene 'qrCodes'", response);
        setGeneratedQRCodes([]);
      }
      setUnits([{ id_producto: "", location: "", estado: "" }]); // Resetea el formulario
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
                  {product.name}
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
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.direccion}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <input
              type="text"
              name="estado"
              value={unit.estado}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <button type="button" className="remove-button" onClick={() => removeUnit(index)}>
            Eliminar Unidad
          </button>
          {/* Mostrar el código QR generado */}
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
      <button type="submit" className="submit-button">Crear Unidades</button>
    </form>
  );
};

export default CreateUnits;
