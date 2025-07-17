import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";
import { SiGoogleclassroom, SiMdbook } from "react-icons/si";
import { LiaWpforms } from "react-icons/lia";
import { GiLovers, GiMeal } from "react-icons/gi";
import { useRecaudo } from "../../../contexts/RecaudoContext";
 

const InformeClasesExtracurriculares = () => {
  const { facturas } = useRecaudo();
  const [facturasPorCod, setFacturasPorCod] = useState({});

  // Agrupar facturas por cod y guardar campos específicos
  const agruparFacturasPorCod = () => {
    if (!facturas || facturas.length === 0) {
      alert("No hay facturas disponibles.");
      return;
    }

    const agrupado = {};

    facturas.forEach((factura) => {
      factura.clases.forEach((clase) => {
        const cod = clase.cod;

        if (!agrupado[cod]) {
          agrupado[cod] = [];
        }

        agrupado[cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          grado: factura.estudianteId?.grado || "N/A",
          total: factura.total,
          tipoPago: factura.tipoPago,
        });
      });
    });

    setFacturasPorCod(agrupado);
  };

  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-division">
        

       
      

          <div className="informes-container">
            <div className="informes-lista-titulo">
              <h5>Procesar información</h5>
            </div>

            <ul className="informes-lista">
              <li>
                <button
                  className="informe-item btn-excel"
                  onClick={agruparFacturasPorCod}
                >
                  Agrupar por Código
                </button>
              </li>
            </ul>
          </div>
      
      </header>

      <main className="content-academico">
        <Outlet />

        {/* Vista previa del agrupamiento */}
        {Object.keys(facturasPorCod).length > 0 && (
          <div className="preview-cod">
            <h3>Facturas agrupadas por código</h3>
            {Object.entries(facturasPorCod).map(([cod, items]) => (
              <div key={cod}>
                <h4>Código: {cod}</h4>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      {item.estudiante} | {item.grado} | ${item.total} | {item.tipoPago}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};



export default InformeClasesExtracurriculares