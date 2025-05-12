import { useState, useEffect } from "react";

// import CertificadoEstudiosDocument from "./CertificadoEstudiosDocument";
import { MdOutlineArchive } from "react-icons/md";
// import "./CertificadoEstudios.css";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

import axios from "axios";
import CertificadoEstudios2025 from "./CertificadoEstudios2025";
 

// Componente Principal
const AcumuladosNotas = () => {
  const [numDocumento, setNumDocumento] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
   const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [error, setError] = useState("");
 
   

  // Función para buscar estudiantes por número de documento
  const buscarEstudiantes = async () => {
    if (!numDocumento) {
      setError("Por favor, ingresa un número de documento.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/certificadosestudio/studentsActive/search?Número_de_identificación=${numDocumento}`
      );
      setResultados(response.data); // Suponiendo que la respuesta es un array de resultados
      setNumDocumento(""); // Limpiar el campo de búsqueda
    } catch (err) {
      setError("Hubo un error al buscar los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  console.log("Datos:", resultados);
  // Función para formatear el nombre del archivo
  const generateFileName = (estudiante) => {
    const fullName = `${estudiante.NOMBRE}`.trim(); // Asegúrate de que los campos coincidan con tu estructura
    return `${fullName} certificado de estudio.pdf`;
  };

  const handleCargarDatos = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    
  };

 

 

  return (
    <>
      <div>
        <div className="certificado-content">
          <div>
            <h5>Buscar por documento de identidad:</h5>
            <input
              className="certificado-content-input"
              type="text"
              value={numDocumento}
              onChange={(e) => setNumDocumento(e.target.value)}
              placeholder="Ingresa el número de documento"
            />
          </div>
          <div>
            <button
              className="certificado-content-btn"
              onClick={buscarEstudiantes}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="certificado-content-list">
          {resultados.length > 0 ? (
            <ul>
              {resultados.map((estudiante) => (
                <li key={estudiante.Número_de_identificación}>
                  <div className="certificado-content-resultados">
                    <div>
                      <p>Nombre: {estudiante.NOMBRE}</p>
                      <p>Grado: {estudiante.Grado}</p>
                     
                    </div>
                    <div>
                      <button
                        className="certificado-content-resultados-btn"
                        onClick={() => handleCargarDatos(estudiante)}
                      >
                        Cargar datos
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron estudiantes.</p>
          )}
        </div>
      </div>

      {estudianteSeleccionado && (
        <div>
          <p className="datos-cargados-p">
            Datos cargados
          </p>
          
          <div className="download-container">
            <PDFDownloadLink
              document={
                ["11 A", "11 B", "11 C", "10 A", "10 B", "10 C", "9 A", "9 B", "9 C", "8 A", "8 B", "8 C", "7 A", "7 B", "7 C", "6 A", "6 B", "6 C", "1 A", "1 B", "1 C", "2 A", "2 B", "2 C", "3 A", "3 B", "3 C", "4 A", "4 B", "4 C", "5 A", "5 B", "5 C",  "PRE-JARDIN", "PRE-JARDIN A", "PRE-JARDIN B", "JARDIN", "JARDIN A", "JARDIN B", "TRANSICIÓN", "TRANSICIÓN A", "TRANSICIÓN B"
                  ].includes ? (
                  <CertificadoEstudios2025
                    estudiante={estudianteSeleccionado}
                   
                  />
                ) : (
                  <p>Selecciona un grupo válido para generar el certificado</p>
                )
              }
              fileName={generateFileName(estudianteSeleccionado)}
            >
              {({ loading }) =>
                loading ? (
                  "Cargando certificado..."
                ) : (
                  <div className="download-btn">
                    Descargar Certificado como PDF  
                  </div>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </>
  );
};

export default AcumuladosNotas;
