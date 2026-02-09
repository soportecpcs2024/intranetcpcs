import { useMemo, useState } from "react";
import { useNomina } from "../../../contexts/NominaContext";
import "./CargarArchivoExcel.css";

const CargarArchivoExcel = () => {
  const { loading, error, setError, uploadNomina, uploadResult } = useNomina();

  const [file, setFile] = useState(null);
  const [localMsg, setLocalMsg] = useState("");

  const fileMeta = useMemo(() => {
    if (!file) return null;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { name: file.name, sizeMB };
  }, [file]);

  const onPickFile = (e) => {
    setLocalMsg("");
    setError(null);

    const selected = e.target.files?.[0];
    if (!selected) return;

    const extOk = /\.(xlsx|xls)$/i.test(selected.name);
    if (!extOk) {
      setFile(null);
      setError("Solo se permiten archivos Excel (.xlsx, .xls).");
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

  const limpiar = () => {
    setFile(null);
    setLocalMsg("");
    setError(null);
    const input = document.getElementById("nominaExcelInput");
    if (input) input.value = "";
  };

  const subir = async () => {
    setLocalMsg("");
    setError(null);

    if (!file) {
      setError("Selecciona un archivo primero.");
      return;
    }

    const resp = await uploadNomina(file);

    if (resp) {
      // resp puede traer: message, totalInserted, duplicates, etc (según tu backend)
      setLocalMsg(resp?.message || "Archivo cargado correctamente.");
    }
  };

  return (
    <div className="nominaWrap">
      <div className="nominaCard">
        <div className="nominaHeader">
          <div>
            <h1 className="nominaTitle">Contabilidad</h1>
            <p className="nominaSubtitle">
              Carga el Excel de nómina para importar colillas y registros.
            </p>
          </div>
          <span className="nominaBadge">Nómina</span>
        </div>

         <div className="footerNote"></div>

        <div className="nominaGrid">
          <label className={`dropZone ${file ? "dropZoneReady" : ""}`}>
            <input
              id="nominaExcelInput"
              type="file"
              accept=".xlsx,.xls"
              onChange={onPickFile}
              className="fileInput"
              disabled={loading}
              
            />

            <div className="dropContent">
              <div className="iconCircle" aria-hidden="true">
                ⬆️
              </div>

              {!file ? (
                <>
                  <p className="dropTitle">Selecciona tu archivo Excel</p>
                  <p className="dropHint">Formatos permitidos: .xlsx, .xls</p>
                </>
              ) : (
                <>
                  <p className="dropTitle">Archivo listo para importar</p>
                  <p className="dropHint">
                    {fileMeta?.name} · {fileMeta?.sizeMB} MB
                  </p>
                </>
              )}
            </div>
          </label>

          <div className="sideInfo">
            <div className="infoBox">
              <h3>Antes de subir</h3>
              <ul>
                <li>Verifica que el archivo sea el correcto.</li>
                <li>Evita celdas combinadas y formatos raros.</li>
                <li>Procura encabezados claros en la primera fila.</li>
              </ul>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn btnGhost"
                onClick={limpiar}
                disabled={loading}
              >
                Limpiar
              </button>

              <button
                type="button"
                className="btn btnPrimary"
                onClick={subir}
                disabled={loading || !file}
              >
                {loading ? "Cargando..." : "Importar Excel"}
              </button>
            </div>

            {(error || localMsg || uploadResult) && (
              <div
                className={`alert ${
                  error ? "alertError" : "alertOk"
                }`}
                role="alert"
              >
                {error ||
                  localMsg ||
                  uploadResult?.message ||
                  "Proceso completado."}
              </div>
            )}

            {/* ✅ Resumen opcional si tu backend retorna totales */}
            {uploadResult && !error && (
              <div className="resultBox">
                <div className="resultRow">
                  <span className="muted">Resultado</span>
                  <span className="pill">OK</span>
                </div>

                <div className="resultGrid">
                  {"totalRegistros" in uploadResult && (
                    <div className="kpi">
                      <p className="kpiLabel">Total registros</p>
                      <p className="kpiValue">{uploadResult.totalRegistros}</p>
                    </div>
                  )}

                  {"inserted" in uploadResult && (
                    <div className="kpi">
                      <p className="kpiLabel">Insertados</p>
                      <p className="kpiValue">{uploadResult.inserted}</p>
                    </div>
                  )}

                  {"duplicates" in uploadResult && (
                    <div className="kpi">
                      <p className="kpiLabel">Duplicados</p>
                      <p className="kpiValue">{uploadResult.duplicates}</p>
                    </div>
                  )}
                </div>
 
              </div>
            )}
          </div>
        </div>

        <div className="footerNote">
          <span >
            * COLEGIO PANAMERICANO COLOMBO SUECO
          </span>
        </div>
      </div>
    </div>
  );
};

export default CargarArchivoExcel;
