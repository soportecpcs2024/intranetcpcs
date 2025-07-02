import { useState } from "react";
import { useRecaudo } from "../../../../contexts/RecaudoContext";
import BuscadorEstudiante from "./buscador/BuscadorEstudiante";
import ListaClases from "./ListarClases/ListarClasesAntologia";
import GenerarFactura from "./antologia/GenerarFacturaAntologia";
import ListarFacturas from "./listarFactura/ListarFacturas";
 

const Recaudoep = () => {
  const { clases, fetchEstudianteById } = useRecaudo();
  const [selectedClases, setSelectedClases] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [tipoPago, setTipoPago] = useState("");
  const [facturaActual, setFacturaActual] = useState(null);
  const [facturaGuardada, setFacturaGuardada] = useState(null);
  
  const [mostrarGenerarFactura, setMostrarGenerarFactura] = useState(false);
  const [limpiarCampos, setLimpiarCampos] = useState(false);

  // Filtrar clases que solo sean "Antología"
  const clasesAntologia = clases.filter(
    (clase) => 
      
      clase.nombre === "El arte de ser padres" || 
      clase.nombre === "Ciberfamilias"  ||
      clase.nombre === "Guiando a sus adolescentes" ||
      clase.nombre ==="Mayordomía financiera"
  );

  return (
    <div className="container-recaudo">
      <div className="container-recaudo-box">
        <BuscadorEstudiante
          fetchEstudianteById={fetchEstudianteById}
          setEstudiante={setEstudiante}
          estudiante={estudiante}
           limpiarCampos={limpiarCampos} // Pasamos el estado
        />

        <ListaClases
          clases={clasesAntologia}
          selectedClases={selectedClases}
          handleSelectClase={(clase) => {
            setSelectedClases((prevSelected) =>
              prevSelected.some((c) => c._id === clase._id)
                ? prevSelected.filter((c) => c._id !== clase._id)
                : [...prevSelected, clase]
            );
          }}
        />

        <div className="container-tipopago">
          <h4>Tipo de Pago :</h4>
          {["Efectivo", "Datáfono", "Nómina"].map((metodo) => (
            <label key={metodo}>
              <input
                type="radio"
                value={metodo}
                checked={tipoPago === metodo}
                onChange={(e) => setTipoPago(e.target.value)}
              />{" "}
              {metodo}
            </label>
          ))}
        </div>

        <button
          onClick={() => {
            if (!estudiante || selectedClases.length === 0 || !tipoPago) {
              alert(
                "Por favor, seleccione un estudiante, clases y tipo de pago."
              );
              return;
            }
            setFacturaActual({
              estudianteId: estudiante,
              clases: selectedClases,
              tipoPago,
              total: selectedClases.reduce(
                (acc, clase) => acc + clase.costo,
                0
              ),
            });
          }}
        >
          Pre Factura
        </button>
      </div>

      <div className="container-recaudo-box">
        <ListarFacturas ultimaFactura={facturaActual} />
        <button
          onClick={async () => {
            if (!facturaActual) {
              alert("No hay factura para guardar.");
              return;
            }
            try {
              const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/recaudo/facturas`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    estudianteId: facturaActual.estudianteId?._id,
                    clases: facturaActual.clases.map(({ _id, costo }) => ({
                      claseId: _id,
                      costo,
                    })),
                    tipoPago: facturaActual.tipoPago,
                    total: facturaActual.total,
                  }),
                }
              );

              if (!response.ok) throw new Error("Error al guardar la factura");

              const nuevaFacturaGuardada = await response.json();
              setFacturaGuardada(nuevaFacturaGuardada);
              alert("Factura guardada correctamente");
              setMostrarGenerarFactura(true);

              // Activar la limpieza del input
              setLimpiarCampos(true);

              // Restablecer limpiarCampos a false para futuras limpiezas
              setTimeout(() => setLimpiarCampos(false), 100);
            } catch (error) {
              alert(error.message);
            }
          }}
        >
          Guardar Factura
        </button>

        <div>
          {estudiante && (
            <GenerarFactura
              factura={facturaGuardada}
              estudiante={estudiante}
            />
          )}
        </div>
      </div>
    </div>
  );
};
  
  export default Recaudoep;
  