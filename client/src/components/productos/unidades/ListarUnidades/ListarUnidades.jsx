import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../../contexts/ProductContext';
import { Link } from 'react-router-dom'; // Importa Link para las rutas
import { FaEye } from 'react-icons/fa'; // Importa el icono de FontAwesome
import './ListarUnidades.css';

const ListarUnidades = () => {
  const { units, loadingUnits, errorUnits } = useProducts();
  const [formattedUnits, setFormattedUnits] = useState([]);

  useEffect(() => {
    if (units) {
      const formatted = units.map(unit => ({
        ...unit,
        fecha_entrega: unit.fecha_entrega ? new Date(unit.fecha_entrega).toLocaleDateString() : 'N/A',
        fecha_devolucion: unit.fecha_devolucion ? new Date(unit.fecha_devolucion).toLocaleDateString() : 'N/A'
      }));
      setFormattedUnits(formatted);
    }
  }, [units]);

  if (loadingUnits) return <div>Cargando...</div>;
  if (errorUnits) return <div>Error al cargar unidades.</div>;

  return (
    <div className="container">
      <h3>Listar Unidades</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Referencia</th>
            <th>Modelo</th>
            <th>Lugar</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>QR</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {formattedUnits.map(unit => (
            <tr key={unit._id}>
              <td>{unit.id_producto?.name || 'N/A'}</td>
              <td>{unit.id_producto?.brand || 'N/A'}</td>
              <td>{unit.id_producto?.sku || 'N/A'}</td>
              <td>{unit.id_producto?.model || 'N/A'}</td>
              <td>{unit.location?.nombre || 'N/A'}</td>
              <td>{unit.location?.direccion || 'N/A'}</td>
              <td>{unit.estado || 'N/A'}</td>
              <td>
                {unit.qrCode ? (
                  <img src={unit.qrCode} alt="QR Code" className="qr-image" />
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <Link to={`/admin/administracion/units/${unit._id}`} className="view-icon">
                  <FaEye />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarUnidades;
