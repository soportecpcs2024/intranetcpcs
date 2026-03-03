import { useContext } from "react";
import { CheckupContext } from "../contexts/CheckupContext.jsx";

export const useCheckup = () => {
  const context = useContext(CheckupContext);

  if (!context) {
    throw new Error("useCheckup debe usarse dentro de <CheckupProvider />");
  }

  return context;
};