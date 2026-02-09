import React, { useMemo, useState } from "react";
import { useNomina } from "../../../contexts/NominaContext";
import "./Generar_colilla.css";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ColillaPDF from "../ColillaPDF/ColillaPDF";

const Generar_colilla = () => {
  const {
    loading,
    error,
    setError,
    registrosCedula,
    fetchNominaByCedula,
    clearNomina, // ✅
  } = useNomina();

  const [cedula, setCedula] = useState("");

  const onBuscar = async (e) => {
    e.preventDefault();
    setError(null);

    const value = cedula.trim();
    if (!value) {
      setError("Ingresa una cédula para buscar.");
      return;
    }
    await fetchNominaByCedula(value);
  };

  const onLimpiar = () => {
    setCedula("");
    clearNomina(); // ✅ borra tabla + errores + resultados + registro individual
  };

  const registrosOrdenados = useMemo(() => {
    const arr = Array.isArray(registrosCedula) ? registrosCedula : [];
    return [...arr].sort((a, b) => {
      const da = new Date(a?.fechaColilla || a?.fecha || 0).getTime();
      const db = new Date(b?.fechaColilla || b?.fecha || 0).getTime();
      return db - da;
    });
  }, [registrosCedula]);

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
            <span  >{registrosOrdenados.length} registro(s)</span>
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
                      String(r?.fechaColilla || r?.fecha || "").slice(0, 10) || "N/A";

                    const empleado =
                      r?.nombresYApellidos || r?.empleado || r?.nombre || "N/A";

                    const cargo = r?.cargo || r?.dependencia || "N/A";

                    return (
                      <tr key={r?._id || idx}>
                        <td>{fecha}</td>
                        <td className="strong">{empleado}</td>
                        <td>{cargo}</td>

                        <td className="right">
                          <PDFDownloadLink
                            document={<ColillaPDF data={r} cedula={cedula.trim()} />}
                            fileName={`colilla_${cedula.trim()}_${fecha}.pdf`}
                            className="btn btnSmall btnSoft"
                          >
                            {({ loading: l }) => (l ? "Generando..." : "Descargar")}
                          </PDFDownloadLink>
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
