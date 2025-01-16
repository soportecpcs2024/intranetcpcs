import React, { useState, useEffect } from "react";
import CertificadoEstudiosDocument from "./CertificadoEstudiosDocument";

import "./CertificadoEstudios.css";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

 

 

// PDF Document
 
import axios from "axios";
import CertificadoEstudiosDocumentBPrimaria from "./CertificadoEstudiosDocumentBPrimaria";
import CertificadoEstudiosDocumentBSecundaria from "./CertificadoEstudiosDocumentBSecundaria";
import CertificadoEstudiosDocumentPreescolar from "./CertificadoEstudiosDocumentPreescolar";
// Componente Principal
const CertificadoEstudios = () => {
  const [numDocumento, setNumDocumento] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

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
        `${import.meta.env.VITE_BACKEND_URL}/api/actasGrados/studentsGraduate/search?numDocumento=${numDocumento}`
      );
      setResultados(response.data); // Suponiendo que la respuesta es un array de resultados
      setNumDocumento(""); // Limpiar el campo de búsqueda
    } catch (err) {
      setError("Hubo un error al buscar los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el nombre del archivo
  const generateFileName = (estudiante) => {
    const fullName = `${estudiante.nombre}`.trim(); // Asegúrate de que los campos coincidan con tu estructura
    return `${fullName} certificado de estudio.pdf`;
  };

  const grupoSelect = estudianteSeleccionado? estudianteSeleccionado.grupo : null;

  return (
    <>
      <div>
        <h2>Buscar por documento de identidad:</h2>
        <input
          type="text"
          value={numDocumento}
          onChange={(e) => setNumDocumento(e.target.value)}
          placeholder="Ingresa el número de documento"
        />
        <button onClick={buscarEstudiantes} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <h3>Resultados de búsqueda:</h3>
          {resultados.length > 0 ? (
            <ul>
              {resultados.map((estudiante) => (
                <li key={estudiante.numDocumento}>
                  <p>Nombre: {estudiante.nombre}</p>
                  <p>Documento: {estudiante.numDocumento}</p>
                  <button onClick={() => setEstudianteSeleccionado(estudiante)}>
                    Cargar datos
                  </button>
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
     <p>Grupo: {grupoSelect}</p>
     <PDFDownloadLink
       document={
         ["11 A", "11 B", "11 C", "10 A", "10 B", "10 C"].includes(grupoSelect) ? (
           <CertificadoEstudiosDocument estudiante={estudianteSeleccionado} />
         ) : ["9 A", "9 B", "9 C", "8 A", "8 B", "8 C", "7 A", "7 B", "7 C", "6 A", "6 B", "6 C"].includes(grupoSelect) ? (
           <CertificadoEstudiosDocumentBSecundaria estudiante={estudianteSeleccionado} />
         ) : ["1 A", "1 B", "1 C", "2 A", "2 B", "2 C", "3 A", "3 B", "3 C", "4 A", "4 B", "4 C", "5 A", "5 B", "5 C"].includes(grupoSelect) ? (
           <CertificadoEstudiosDocumentBPrimaria estudiante={estudianteSeleccionado} />
         ): ["PRE-JARDIN A", "PRE-JARDIN B", "JARDIN A", "JARDIN B","TRANSICIÓN ","TRANSICIÓN A", "TRANSICIÓN B",].includes(grupoSelect) ? (
          <CertificadoEstudiosDocumentPreescolar estudiante={estudianteSeleccionado} />
           
         ) : (
           <p>Selecciona un grupo válido para generar el certificado</p>
         )
       }
       fileName={generateFileName(estudianteSeleccionado)}
     >
       {({ loading }) =>
         loading ? "Cargando certificado..." : "Descargar Certificado como PDF"
       }
     </PDFDownloadLink>
   </div>
   
    
      )}
    </>
  );
};

export default CertificadoEstudios;
 