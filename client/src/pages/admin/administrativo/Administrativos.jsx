import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const verTodosLosProductos = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};

const Administrativos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await verTodosLosProductos();
        setProductos(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching productos');
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Administrativos</h2>
      <div>
        {productos.map(producto => {
          const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/${producto.image.filePath.replace(/\\/g, '/')}`;
          console.log(imageUrl); // Verifica la URL en la consola

          return (
            <div key={producto._id}>
              <h3>{producto.name}</h3>
              <p>{producto.description}</p>
              <p>Categoría: {producto.category}</p>
              <p>Precio: {producto.price}</p>
              <img src={imageUrl} alt={producto.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Administrativos;


