import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Crear el contexto para las estadísticas de productos
const ProductStatisticsContext = createContext();

// Proveedor del contexto
export const ProductStatisticsProvider = ({ children }) => {
  const [statistics, setStatistics] = useState(null);
  const [loadingStatistics, setLoadingStatistics] = useState(true);
  const [errorStatistics, setErrorStatistics] = useState(null);

  // Función para obtener las estadísticas de productos
  const fetchProductStatistics = useCallback(async () => {
    setLoadingStatistics(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/informes/estadisticas`);
      setStatistics(response.data);
      setErrorStatistics(null); // Resetear el error si se obtiene una respuesta exitosa
    } catch (error) {
      console.error("Error fetching product statistics", error);
      setErrorStatistics(error);
      setStatistics(null); // Limpiar estadísticas si ocurre un error
    } finally {
      setLoadingStatistics(false);
    }
  }, []);

  // Ejecutar la función de obtención al montar el componente
  useEffect(() => {
    fetchProductStatistics();
  }, [fetchProductStatistics]);

  return (
    <ProductStatisticsContext.Provider
      value={{
        statistics,
        loadingStatistics,
        errorStatistics,
        fetchProductStatistics,
      }}
    >
      {children}
    </ProductStatisticsContext.Provider>
  );
};

// Hook para acceder al contexto
export const useProductStatistics = () => {
  return useContext(ProductStatisticsContext);
};
