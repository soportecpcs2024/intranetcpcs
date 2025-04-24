import { useEffect, useState } from 'react';
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
 
 
import './Almuerzos.css';

const EstadisticasAlmuerzo = () => {
  const { almuerzoFactura } = useRecaudo();
  const [totalSum, setTotalSum] = useState(0);
  const [numeroFacturas, setNumeroFacturas] = useState(0);
  const [almuerzoContador, setAlmuerzoContador] = useState({});

  useEffect(() => {
    if (almuerzoFactura.length > 0) {
      let total = 0;
      let contador = {};

      almuerzoFactura.forEach(factura => {
        total += factura.total;

        if (Array.isArray(factura.almuerzos)) {
          factura.almuerzos.forEach(item => {
            const nombre = item.almuerzoId?.nombre || 'Desconocido';
            const cantidad = item.cantidad || 0;

            if (contador[nombre]) {
              contador[nombre] += cantidad;
            } else {
              contador[nombre] = cantidad;
            }
          });
        }
      });

      setTotalSum(total);
      setNumeroFacturas(almuerzoFactura.length);
      setAlmuerzoContador(contador);
    }
  }, [almuerzoFactura]);

 
 

  
  const handleDownloadExcel = () => {
    if (almuerzoFactura.length === 0) return;
  
    const data = almuerzoFactura.map(item => {
      const nombresAlmuerzos = item.almuerzos
        .map(a => `${a.almuerzoId?.nombre || 'Desconocido'} x${a.cantidad}`)
        .join(', ');
  
      return {
        Estudiante: item.estudianteId?.nombre || "Sin nombre",
        Almuerzos: nombresAlmuerzos,
        Total: item.total,
        "Tipo de pago": item.tipoPago,
        Fecha: new Date(item.fechaCompra).toLocaleDateString(),
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Almuerzos");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    const fecha = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    saveAs(blob, `almuerzos_vendidos_${fecha}.xlsx`);
  };
  

  return (
    <div className="almuerzo-container">
      <h2 className="almuerzo-title">Estadísticas de Almuerzos</h2>

      <div className="almuerzo-stats">
        <p><strong>Total Preventa Almuerzos:</strong> ${totalSum.toLocaleString()}</p>
        <p><strong>Número de ventas:</strong> {numeroFacturas.toLocaleString()}</p>
      </div>

      <div className="almuerzo-section">
        <h3>Conteo por tipo de almuerzo</h3>
        <ul className="almuerzo-list">
          {Object.entries(almuerzoContador).map(([nombre, cantidad]) => (
            <li key={nombre}>
              <strong>{nombre}:</strong> {cantidad}
            </li>
          ))}
        </ul>
      </div>

      <div className="almuerzo-section">
        <h3>Lista de Almuerzos Vendidos</h3>
        <button className="download-btn" onClick={handleDownloadExcel}>
          Descargar Lista
        </button>
      </div>
    </div>
  );
};

export default EstadisticasAlmuerzo;
