import { useMemo, useState } from 'react';
import { useRecaudo } from '../../../../../contexts/RecaudoContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import './Almuerzos.css';
import ListaAlmuerzosVendidos from './ListaAlmuerzosVendidos';

const EstadisticasAlmuerzo = () => {
  const {
    almuerzoFactura = [],
    editarAlmuerzoFactura,
    eliminarAlmuerzoFactura
  } = useRecaudo();
  const [mostrarLista, setMostrarLista] = useState(false);

  const {
    totalSum,
    numeroFacturas,
    almuerzoContador
  } = useMemo(() => {
    let total = 0;
    const contador = {};

    almuerzoFactura.forEach((factura) => {
      total += Number(factura.total) || 0;

      if (Array.isArray(factura.almuerzos)) {
        factura.almuerzos.forEach((item) => {
          const nombre =
            item.almuerzoId?.nombre || 'Desconocido';

          const cantidad = Number(item.cantidad) || 0;

          contador[nombre] =
            (contador[nombre] || 0) + cantidad;
        });
      }
    });

    return {
      totalSum: total,
      numeroFacturas: almuerzoFactura.length,
      almuerzoContador: contador
    };
  }, [almuerzoFactura]);

  const handleDownloadExcel = () => {
    if (almuerzoFactura.length === 0) {
      return;
    }

    const data = almuerzoFactura.map((item) => {
      const nombresAlmuerzos = Array.isArray(item.almuerzos)
        ? item.almuerzos
          .map(
            (almuerzo) =>
              `${almuerzo.almuerzoId?.nombre || 'Desconocido'} x${almuerzo.cantidad || 0
              }`
          )
          .join(', ')
        : 'Sin almuerzos';

      return {
        Estudiante:
          item.estudianteId?.nombre || 'Sin nombre',
        Almuerzos: nombresAlmuerzos,
        Total: Number(item.total) || 0,
        'Tipo de pago': item.tipoPago || 'Sin especificar',
        Fecha: item.fechaCompra
          ? new Date(item.fechaCompra).toLocaleDateString('es-CO')
          : 'Sin fecha',
        'Vendido por': item.vendido || 'Sin especificar'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Almuerzos'
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const fecha = new Date().toISOString().split('T')[0];

    saveAs(blob, `almuerzos_vendidos_${fecha}.xlsx`);
  };


  if (mostrarLista) {
    return (
      <div className="almuerzo-container">
        <button
          type="button"
          className="download-btn"
          onClick={() => setMostrarLista(false)}
        >
          Volver a estadísticas
        </button>

        <ListaAlmuerzosVendidos
          almuerzosVendidos={almuerzoFactura}
          onEditar={editarAlmuerzoFactura}
          onEliminar={eliminarAlmuerzoFactura}
        />
      </div>
    );
  }
  return (
    <div className="almuerzo-container">
      <h2 className="almuerzo-title">
        Estadísticas de Almuerzos
      </h2>

      <div className="almuerzo-stats">
        <p>
          <strong>Total Preventa Almuerzos:</strong>{' '}
          ${totalSum.toLocaleString('es-CO')}
        </p>

        <p>
          <strong>Número de ventas:</strong>{' '}
          {numeroFacturas.toLocaleString('es-CO')}
        </p>
      </div>

      <div className="almuerzo-section">
        <h3>Conteo por tipo de almuerzo</h3>

        {Object.keys(almuerzoContador).length > 0 ? (
          <ul className="almuerzo-list">
            {Object.entries(almuerzoContador).map(
              ([nombre, cantidad]) => (
                <li key={nombre}>
                  <strong>{nombre}:</strong> {cantidad}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No hay almuerzos registrados.</p>
        )}
      </div>

      <div className="almuerzo-section">
        <button
          className="download-btn"
          onClick={handleDownloadExcel}
          disabled={almuerzoFactura.length === 0}
        >
          Descargar Lista
        </button>

      </div>

      <div>

        <div className="almuerzo-section">
          <button
            type="button"
            className="download-btn"
            onClick={() => setMostrarLista(true)}
          >
            Acciones lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasAlmuerzo;