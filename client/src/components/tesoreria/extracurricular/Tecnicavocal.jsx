import { useEffect, useState } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";

const Tecnicavocal = () => {
  const {
    facturasConAsistencias,
    fetchFacturasConAsistencias,
    actualizarAsistenciasFactura,
  } = useRecaudo();

  const [asistenciasLocal, setAsistenciasLocal] = useState({});
  const [mesSeleccionado, setMesSeleccionado] = useState("Julio");

  const mesesDelAno = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    fetchFacturasConAsistencias();
  }, [fetchFacturasConAsistencias]);

  useEffect(() => {
    const initial = {};
    facturasConAsistencias.forEach((factura) => {
      initial[factura._id] = { ...factura.asistencias };
    });
    setAsistenciasLocal(initial);
  }, [facturasConAsistencias]);

  const handleCheckboxChange = async (facturaId, key) => {
    const nuevoEstado = !asistenciasLocal?.[facturaId]?.[key];

    const nuevasAsistencias = {
      ...asistenciasLocal[facturaId],
      [key]: nuevoEstado,
    };

    setAsistenciasLocal((prev) => ({
      ...prev,
      [facturaId]: nuevasAsistencias,
    }));

    try {
      await actualizarAsistenciasFactura(facturaId, {
        asistencias: nuevasAsistencias,
      });
    } catch (error) {
      console.error("Error actualizando la asistencia:", error);
    }
  };

  const facturasFiltradas = facturasConAsistencias.filter(
    (factura) =>
      factura.mes_aplicado?.toLowerCase() === mesSeleccionado.toLowerCase() &&
      factura.clases?.[0]?.nombreClase?.toLowerCase() === "tecnica vocal"
  );

  return (
    <div className="extra-container">
      <h2>Toma de asistencia</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrar por mes:</label>
        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="p-2 border rounded"
        >
          {mesesDelAno.map((mes) => (
            <option key={mes} value={mes}>
              {mes}
            </option>
          ))}
        </select>
      </div>

      {facturasFiltradas.map((factura) => (
        <ul key={factura._id} className="lista_extracurricular_pagados">
          <li><strong>Estudiante:</strong> {factura.estudianteId?.nombre || "Desconocido"}</li>
          <li><strong>Grupo :</strong> {factura.estudianteId?.grado || "Desconocido"}</li>
          <li><strong>Clase:</strong> {factura.clases?.[0]?.nombreClase || "-"}</li>
          <li><strong>Mes:</strong> {factura.mes_aplicado}</li>
          <li>
            {["asistencia1", "asistencia2", "asistencia3", "asistencia4"].map((key) => (
              <label key={key} className="ckeck_asistencias">
                <input
                  type="checkbox"
                  checked={asistenciasLocal?.[factura._id]?.[key] || false}
                  onChange={() => handleCheckboxChange(factura._id, key)}
                />
                {key.replace("asistencia", "Asistencia ")}
              </label>
            ))}
          </li>
        </ul>
      ))}
    </div>
  );
};

export default Tecnicavocal;
