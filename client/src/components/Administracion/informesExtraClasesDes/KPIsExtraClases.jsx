// components/KPIsExtraClases.jsx

import React from "react";
import "./informesExtraclases.css";

const KPIsExtraClases = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  // KPI básicos
  const clasesVendidas = data.length;
  

  let totalRecaudado = 0;
  let totalNomina = 0;
  let totalEfectivo = 0;
  let totalDatafono = 0;
  const conteoClases = {};

  data.forEach((factura) => {
    factura.clases.forEach((clase) => {
      const cod = clase.cod;
      conteoClases[cod] = (conteoClases[cod] || 0) + 1;
    });

    totalRecaudado += factura.total;

    const pago = factura.tipoPago?.toLowerCase();
    if (pago === "nómina") totalNomina += factura.total;
    else if (pago === "efectivo") totalEfectivo += factura.total;
    else if (pago === "datáfono") totalDatafono += factura.total;
  });

  // Más y menos vendida
  const entradas = Object.entries(conteoClases);
  const claseMasVendida = entradas.reduce((a, b) => (a[1] > b[1] ? a : b));
  const claseMenosVendida = entradas.reduce((a, b) => (a[1] < b[1] ? a : b));

  const claseMasPopularCod = claseMasVendida?.[0];
  const claseMasPopularVeces = claseMasVendida?.[1];

  const getNombreCodigo = (cod) => {
    switch (cod) {
      case "100":
        return "Inglés";
      case "200":
        return "Iniciación Musical Preescolar";
      case "300":
        return "Piano";
      case "400":
        return "Técnica Vocal";
      case "500":
        return "Guitarra y Bajo";
      case "600":
        return "Batería";
      case "700":
        return "Baloncesto";
      case "800":
        return "Voleibol";
      case "900":
        return "Microfútbol";
      case "1100":
        return "Exploración Motriz y Predeportiva Pre";
      default:
        return `Código: ${cod}`;
    }
  };

  return (
    <div className="kpi-container">
        
      <div className="cardestaditicas">
        <h4>📊 Estadísticas Generales</h4>
        <ul>
          <li>
            📅 Clases vendidas: <strong>{clasesVendidas}</strong>
          </li>
         
          <li>
            💰 Total recaudado:{" "}
            <strong>${totalRecaudado.toLocaleString()}</strong>
          </li>
          <li>
            🧾 Pago por Nómina: <strong>${totalNomina.toLocaleString()}</strong>
          </li>
          <li>
            💵 Pago en Efectivo:{" "}
            <strong>${totalEfectivo.toLocaleString()}</strong>
          </li>
          <li>
            🏧 Pago por Datáfono:{" "}
            <strong>${totalDatafono.toLocaleString()}</strong>
          </li>
          <li>
            ⭐ Clase más popular:{" "}
            <strong>
              {getNombreCodigo(claseMasPopularCod)} ({claseMasPopularVeces}{" "}
              veces)
            </strong>
          </li>
        </ul>
      </div>

      <div className="cardestaditicas">
        <h4>🗂️ Lista de clases:</h4>
        <ul>
          {entradas.map(([cod, cantidad], index) => (
            <li key={index}>
              {getNombreCodigo(cod)} <strong>{cantidad}</strong>{" "}
              ventas
            </li>
          ))}
        </ul>
      </div>

      <div >
        <div className="cardestaditicas">

      
        <h4>🏆 Ventas:</h4>
        <h3>📉 Mas vendida:</h3>
        {claseMasVendida && (
          <p>
            {getNombreCodigo(claseMasVendida[0])} ({claseMasVendida[1]} ventas)
          </p>
        )}

        <h3>📉 Menos vendida:</h3>
        {claseMenosVendida && (
          <p>
            {getNombreCodigo(claseMenosVendida[0])} ({claseMenosVendida[1]}{" "}
            ventas)
          </p>
        )}
      </div>
        </div>
    </div>
  );
};

export default KPIsExtraClases;
