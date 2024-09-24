import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../../contexts/ProductContext";
import "./UnitDetail.css"; // Asegúrate de que el archivo CSS esté enlazado

const UnitDetail = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const { units, loadingUnits, errorUnits, fetchUnits } = useProducts();
  const [unit, setUnit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (units.length === 0) {
      fetchUnits(); // Llama a fetchUnits para cargar las unidades si no están ya cargadas
    } else {
      const foundUnit = units.find((unit) => unit._id === id); // Busca la unidad por ID
      if (foundUnit) {
        setUnit(foundUnit);
      }
    }
  }, [id, units, fetchUnits]);

  if (loadingUnits) return <div>Loading...</div>;
  if (errorUnits) return <div>Error: {errorUnits.message}</div>;

  const handleBackClick = () => {
    navigate("/admin/administracion/listunit");
  };

  return (
    <div className="unit-detail-container">
      <h2>Detalles de la Unidad</h2>
      {unit ? (
        <>
          <p>
            <strong>Producto:</strong> {unit.id_producto.name}
          </p>
          <p>
            <strong>Ubicación:</strong> {unit.location.direccion}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`unit-status ${unit.estado.toLowerCase()}`}>
              {unit.estado}
            </span>
          </p>
          <p>
            <strong>Responsable:</strong> {unit.recibido_por}
          </p>

          <p>
            <strong>Fecha de entrega:</strong>{" "}
            {new Date(unit.fecha_entrega).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Observaciones:</strong> {unit.observaciones}
          </p>

          <p>
            <strong>ID:</strong>{" "}
            <span className="unit-detail-id">{unit._id}</span>
          </p>
        </>
      ) : (
        <p>Unidad no encontrada.</p>
      )}

      <button className="back-button" onClick={handleBackClick}>
        Volver a la lista
      </button>
    </div>
  );
};

export default UnitDetail;
