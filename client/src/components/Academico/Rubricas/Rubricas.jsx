import React, { useContext } from "react";
import RubricasForm from "./RubricasForm";
import { EvaluacionesContext } from "../../../contexts/EvaluacionesContext";

const Rubricas = () => {
  const { evaluaciones } = useContext(EvaluacionesContext);

  return (
    <div className="rubricas-container">
      <RubricasForm />
      {/* <RubricasTable evaluaciones={evaluaciones} /> */}
    </div>
  );
};

export default Rubricas;
