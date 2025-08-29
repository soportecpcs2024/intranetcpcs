import React, { useEffect, useState } from "react";
import axios from "axios";
import RubricasForm from "./RubricasForm";
import RubricasTable from "./RubricasTable";

const Rubricas = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    obtenerEvaluaciones();
  }, []);

  const obtenerEvaluaciones = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/evaluacionRubricas");
      setEvaluaciones(res.data);
    } catch (err) {
      console.error("Error al obtener evaluaciones:", err);
    }
  };

  return (
    <div className="rubricas-container">
      <RubricasForm onSuccess={obtenerEvaluaciones} />
      {/* <RubricasTable evaluaciones={evaluaciones} /> */}
    </div>
  );
};

export default Rubricas;
