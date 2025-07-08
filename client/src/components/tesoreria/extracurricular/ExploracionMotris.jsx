import { useEffect, useState } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";

const ExploracionMotris = () => {
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

  // ✅ Nueva lógica: actualizar base de datos al hacer clic en el checkbox
const handleCheckboxChange = async (facturaId, key) => {
  const nuevoEstado = !asistenciasLocal?.[facturaId]?.[key];

  // 🟢 Calculamos la nueva estructura
  const nuevasAsistencias = {
    ...asistenciasLocal[facturaId],
    [key]: nuevoEstado,
  };

  // 🟢 Actualizamos localmente con la nueva estructura
  setAsistenciasLocal((prev) => ({
    ...prev,
    [facturaId]: nuevasAsistencias,
  }));

  try {
    // 🟢 Enviamos al backend exactamente lo que ya calculamos
    await actualizarAsistenciasFactura(facturaId, {
      asistencias: nuevasAsistencias,
    });
  } catch (error) {
    console.error("Error actualizando la asistencia:", error);
  }
};



  // Filtrar las facturas por el mes seleccionado
  const facturasFiltradas = facturasConAsistencias.filter(
  (factura) =>
    factura.mes_aplicado?.toLowerCase() === mesSeleccionado.toLowerCase() &&
    factura.clases?.[0]?.nombreClase?.toLowerCase() === "exploración motriz y predeportiva pre"
);


  return (
    <div className="extra-container">
      <h2>Toma de asistencia</h2>

      {/* Selector de mes */}
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

      <table className="extra-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Clase</th>
            <th>Mes</th>
            <th>Asistencia 1</th>
            <th>Asistencia 2</th>
            <th>Asistencia 3</th>
            <th>Asistencia 4</th>
          </tr>
        </thead>
        <tbody>
          {facturasFiltradas.map((factura) => (
            <tr key={factura._id}>
              <td>{factura.estudianteId?.nombre || "Desconocido"}</td>
              <td>{factura.clases?.[0]?.nombreClase || "-"}</td>
              <td>{factura.mes_aplicado}</td>
              {["asistencia1", "asistencia2", "asistencia3", "asistencia4"].map((key) => (
                <td key={key}>
                  <input
                    type="checkbox"
                    checked={asistenciasLocal?.[factura._id]?.[key] || false}
                    onChange={() => handleCheckboxChange(factura._id, key)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ExploracionMotris