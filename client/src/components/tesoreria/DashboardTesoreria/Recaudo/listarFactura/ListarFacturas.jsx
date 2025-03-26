import React from "react";
import "./listarFactura.css";

const ListarFacturas = ({ ultimaFactura }) => {
  return (
    <div className="container-precargafactura">
      <h2>Precarga de factura: </h2>
      {ultimaFactura ? (
        <div>
          <p>
            <strong>Estudiante :</strong> {ultimaFactura.estudianteId.nombre}
          </p>
          <p>
            <strong>Documento :</strong> {ultimaFactura.estudianteId.documentoIdentidad}
          </p>
          <p>
            <strong>Grado :</strong> {ultimaFactura.estudianteId.grado}
          </p>
          <p>
            <strong>Tipo de Pago:</strong> {ultimaFactura.tipoPago}
          </p>
          <p>
            <strong>Mes aplicado:</strong> {ultimaFactura.mes_aplicado}
          </p>
          <h4>Clases</h4>
          <ul>
            {ultimaFactura.clases.map((clase) => (
              <li className="container-precargafactura-factura" key={clase._id}>
                <div className="container-precargafactura-factura-servicio">
                  <div>
                    <p>
                      <strong>Nombre:</strong> {clase.nombre}
                    </p>
                    <p>
                    <strong>Costo:</strong> ${clase.costo}
                    </p>
                    <p>
                      <strong>Dia:</strong> {clase.dia} {clase.hora}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="total">
            <p className="container-precargafactura-factura-total">
              <strong>Total a pagar :</strong> $ {ultimaFactura.total}
            </p>
          </div>
        </div>
      ) : (
        <p>No hay facturas registradas.</p>
      )}
    </div>
  );
};

export default ListarFacturas;
