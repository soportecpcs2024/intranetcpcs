import React, { useMemo, useState, useEffect } from "react";
import { useNomina } from "../../../contexts/NominaContext";
import { useAuth } from "../../../contexts/AuthContext";

import "./Generar_colilla.css";

import { pdf } from "@react-pdf/renderer";
import ColillaPDF from "../ColillaPDF/ColillaPDF";

// ✅ Normaliza texto (mayúsculas, sin tildes, sin dobles espacios)
const norm = (v) =>
  String(v ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ");

// ✅ Convierte "NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2" -> "APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2"
const formatearNombre = (nombre) => {
  if (!nombre) return "";
  const partes = String(nombre).trim().split(/\s+/);
  if (partes.length < 2) return norm(nombre);

  const apellidos = partes.slice(-2);
  const nombres = partes.slice(0, -2);
  return norm([...apellidos, ...nombres].join(" "));
};



const Generar_colilla = () => {
  const {
    loading,
    error,
    setError,
    registrosCedula,
    fetchNominaByCedula,
    clearNomina,
  } = useNomina();
  const { user } = useAuth();
  const nombreUsuario = useMemo(() => formatearNombre(user?.name), [user]);


  const [cedula, setCedula] = useState("");
  const [pdfReady, setPdfReady] = useState(false);

  // ✅ para mostrar “Generando...” solo en la fila que se descarga
  const [generatingKey, setGeneratingKey] = useState(null);

  const cedulaTrim = cedula.trim();

  const onBuscar = async (e) => {
    
    e.preventDefault();
    setError(null);
    setPdfReady(false);

    if (!cedulaTrim) {
      setError("Ingresa una cédula para buscar.");
      return;
    }
    await fetchNominaByCedula(cedulaTrim);
    const nombreRegistro = registrosCedula[0]?.nombresYApellidos || "";
   
  };

  const onLimpiar = () => {
    setCedula("");
    setPdfReady(false);
    setGeneratingKey(null);
    clearNomina();
  };

  const registrosOrdenados = useMemo(() => {
    const arr = Array.isArray(registrosCedula) ? registrosCedula : [];
    return [...arr].sort((a, b) => {
      const da = new Date(a?.fechaColilla || a?.fecha || 0).getTime();
      const db = new Date(b?.fechaColilla || b?.fecha || 0).getTime();
      return db - da;
    });
  }, [registrosCedula]);
   // ✅ Validación: comparar nombreUsuario vs nombreRegistro (primer registro)
  useEffect(() => {
    if (!user?.name) return;
    if (!registrosCedula || registrosCedula.length === 0) return;

    const nombreRegistro = norm(registrosCedula[0]?.nombresYApellidos);

    if (!nombreRegistro) {
      clearNomina();
      setError("No fue posible validar el nombre del empleado en la colilla.");
      return;
    }

    if (nombreUsuario !== nombreRegistro) {
      clearNomina();
      setError("El usuario autenticado no coincide con el empleado de la colilla.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosCedula, nombreUsuario, user?.name]);

  // ✅ Espera 3 segundos después de tener resultados
  useEffect(() => {
    if (Array.isArray(registrosCedula) && registrosCedula.length > 0) {
      setPdfReady(false);
      const timer = setTimeout(() => setPdfReady(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setPdfReady(false);
    }
  }, [registrosCedula]);


  const downloadPdf = async ({ r, fecha, rowKey }) => {
    try {
      setError(null);
      setGeneratingKey(rowKey);

      // ✅ genera el PDF "on demand" (muy estable)
      const blob = await pdf(<ColillaPDF data={r} cedula={cedulaTrim} />).toBlob();

      // ✅ descarga sin librerías
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `colilla_${cedulaTrim}_${fecha}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generando PDF:", err);
      setError("Error generando el PDF. Intenta nuevamente.");
    } finally {
      setGeneratingKey(null);
    }
  };

  return (
    <div className="colWrap">
      <div className="colCard">
        <div className="colHeader">
          <div>
            <h1 className="colTitle">Generar colillas</h1>
            <p className="colSub">
              Busca por cédula, revisa los registros y descarga la colilla en PDF.
            </p>
          </div>
          <span className="badge">Nómina</span>
        </div>

        <form className="searchRow" onSubmit={onBuscar}>
          <div className="inputGroup">
            <label className="label">Cédula</label>
            <input
              className="input"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ej: 12345678"
              inputMode="numeric"
            />
          </div>

          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>

          <button
            className="btn btnGhost"
            type="button"
            onClick={onLimpiar}
            disabled={loading}
          >
            Limpiar
          </button>
        </form>

        {error && (
          <div className="alert alertError" role="alert">
            {error}
          </div>
        )}

        <div className="tableCard">
          <div className="tableHeader">
            <h3>Registros encontrados</h3>
            <span>{registrosOrdenados.length} registro(s)</span>
          </div>

          {registrosOrdenados.length === 0 ? (
            <div className="empty">
              <p className="emptyTitle">No hay resultados aún</p>
              <p className="emptyText">
                Escribe una cédula y presiona <b>Buscar</b>.
              </p>
            </div>
          ) : (
            <div className="tableScroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Empleado</th>
                    <th>Cargo</th>
                    <th className="right">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {registrosOrdenados.map((r, idx) => {
                    const fecha =
                      String(r?.fechaColilla || r?.fecha || "").slice(0, 10) ||
                      "N/A";

                    const empleado =
                      r?.nombresYApellidos || r?.empleado || r?.nombre || "N/A";

                    const cargo = r?.cargo || r?.dependencia || "N/A";

                    const rowKey = r?._id || `${fecha}-${idx}`;

                    const disabled =
                      !cedulaTrim || !pdfReady || loading || generatingKey !== null;

                    const isGenerating = generatingKey === rowKey;

                    return (
                      <tr key={rowKey}>
                        <td>{fecha}</td>
                        <td className="strong">{empleado}</td>
                        <td>{cargo}</td>

                        <td className="right">
                          {!cedulaTrim ? (
                            <button className="btn btnSmall btnSoft" disabled>
                              Cargando...
                            </button>
                          ) : !pdfReady ? (
                            <button className="btn btnSmall btnSoft" disabled>
                              Preparando...
                            </button>
                          ) : (
                            <button
                              className="btn btnSmall btnSoft"
                              disabled={disabled}
                              onClick={() => downloadPdf({ r, fecha, rowKey })}
                            >
                              {isGenerating ? "Generando..." : "Descargar"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="footerNote">COLEGIO PANAMERICANO COLOMBO SUECO</div>
      </div>
    </div>
  );
};

export default Generar_colilla;
