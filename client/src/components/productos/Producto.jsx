// components/Producto.js
import React, { useEffect, useState } from 'react';
import { verTodosLosProductos } from '../../api/DataApi';
import CardProducto from './CardProducto';
import './producto.css'; // Asegúrate de que la ruta sea correcta

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await verTodosLosProductos();
        if (response && response.data) {
          setProductos(response.data);
          console.log(response.data);
        } else {
          setError('No se encontraron productos');
        }
      } catch (error) {
        console.error('Error fetching productos:', error);
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <p className="loading">Cargando productos...</p>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="producto-container">
      {productos.length > 0 ? (
        productos.map(producto => (
          <CardProducto
            key={producto._id}
            name={producto.name || 'Nombre no disponible'}
            sku={producto.sku || 'SKU no disponible'}
            category={producto.category || 'Categoría no disponible'}
            quantity={producto.quantity || 'Cantidad no disponible'}
            price={producto.price || 'Precio no disponible'}
            description={producto.description || 'Descripción no disponible'}
            image={producto.image || {}}
          />
        ))
      ) : (
        <p>No se encontraron productos</p>
      )}
    </div>
  );
};

export default Producto;


