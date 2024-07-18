import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Importa ClipLoader de react-spinners

const LoadingSpinner = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una carga de datos
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simula 3 segundos de carga
      setLoading(false); // Cambia el estado de carga a false cuando se completa la carga
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ClipLoader className="loader" color={"blue"} loading={loading} size={80}   /> {/* ClipLoader de react-spinners */}
    </div>
  );
};

export default LoadingSpinner;

