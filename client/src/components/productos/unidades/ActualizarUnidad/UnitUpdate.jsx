import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../../contexts/ProductContext";
import "./UnitUpdate.css";

const UnitUpdate = () => {
  const { id } = useParams(); // Get the unit ID from the URL
  const { fetchUnits, updateUnit, loading, error, units, locations } =
    useProducts();
  const [unit, setUnit] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    estado: "Inactivo",
    entregado_por: "",
    recibido_por: "Administración",
    aprobado_por: "Administración",
    fecha_entrega: "",
    observaciones: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && units.length > 0) {
      const foundUnit = units.find((u) => u._id === id);
      if (foundUnit) {
        setUnit(foundUnit);
        setFormData({
          location: foundUnit.location,
          estado: foundUnit.estado,
          entregado_por: foundUnit.entregado_por,
          recibido_por: foundUnit.recibido_por,
          aprobado_por: foundUnit.aprobado_por,
          fecha_entrega: foundUnit.fecha_entrega
            ? new Date(foundUnit.fecha_entrega).toISOString().split("T")[0]
            : "",
          observaciones: foundUnit.observaciones,
        });
      }
    } else {
      fetchUnits();
    }
  }, [id, units, loading, fetchUnits]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUnit = {
      ...formData,
      fecha_entrega: new Date(formData.fecha_entrega).toISOString(),
    };
    await updateUnit(id, updatedUnit); // Wait for the update to complete
    navigate("/admin/administracion/listunit"); // Redirect to ListarUnidades after update
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading unit: {error.message}</p>;
  if (!unit) return <p>Unit not found.</p>;

  // Sort locations for better UX
  const sortedLocations = [...locations].sort((a, b) => {
    const nameA = a.direccion.toLowerCase();
    const nameB = b.direccion.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="unit-update-container">
      <h3>Editar Unidad</h3>
      <form onSubmit={handleSubmit}>
        
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group-unit">
            {key === "location" ? (
              <>
                <label>Ubicación:</label>
                <select name="location" value={value} onChange={handleChange}>
                  <option value="">Seleccione una ubicación</option>
                  {sortedLocations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.direccion}
                    </option>
                  ))}
                </select>
              </>
            ) : key === "estado" ? (
              <>
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                  :
                </label>
                <select
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                >
                  <option value="activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </>
            ) : key === "observaciones" ? (
              <>
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                  :
                </label>
                <textarea
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                  rows="4" // Puedes ajustar el número de filas según tus necesidades
                  style={{ resize: "none", width: "100%" }} // Estilo opcional para el textarea
                />
              </>
            ) : (
              <>
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                  :
                </label>
                <input
                  type={key === "fecha_entrega" ? "date" : "text"}
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        ))}
        <div>
          <button type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default UnitUpdate;
