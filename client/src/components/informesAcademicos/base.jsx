import React, { useState, useEffect } from "react";
 
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

 

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 40,
  },
  title: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  escala: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
    fontSize: 10,
    marginBottom: 5,
    textAlign: "justify",
    fontWeight: "bold",
  },
  section_plan_estudio: {
    marginTop: 10,
    fontSize: 10,
    marginBottom: 10,
    textAlign: "justify",
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  view_p: {
    marginTop: 10,
  },
  p: {
    fontWeight: "bold",
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  table: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    border: "1px solid #C0C0C0", // Borde externo de la tabla
  },
  tableHeader: {
    flexDirection: "row",

    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    textAlign: "center",
    fontSize: 8,
  },
  areaCell: {
    flex: 4,
    textAlign: "center",
    fontSize: 8,

    padding: 2,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 80,
  },

  footer: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer_in: {
    borderTop: "1px solid #C0C0C0",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },

  footer_principal: {
    position: "absolute",
    top: 115,
    left: 0,
    right: 0,
    display: "flex",
    textAlign: "center",
    fontSize: 12,
    color: "#6ec4fe",
    justifyContent: "center",
    fontWeight: "bold",
  },
  // ... other styles
  membrete_header: {
    display: "flex",
    textAlign: "right", // Align text to the right
    flexDirection: "column",

    fontSize: 10,
    alignItems: "flex-end", // Align the content to the right
    padding: 5, // Optional: adds padding for spacing around the text
  },
});

// PDF Document
const CertificadoEstudiosDocument = ({ estudiante }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#b4dffc",
          borderRadius: 4,
          border: "1px solid #40a3e6",
          marginBottom: 10,
        }}
      >
        <Image style={styles.image} src="/logo.png" />

        <View style={styles.membrete_header}>
          <View>
            <Text>Carrera 83 N° 78-30 Medellín -Colombia</Text>
          </View>
          <View>
            <Text>PBX: 604 442 0606</Text>
          </View>
          <View>
            <Text>Email:info@colombosueco.com</Text>
          </View>
          <View>
            <Text>www.colombosueco.com</Text>
          </View>
        </View>
      </View>

      <View>
        <Text
          style={{
            color: "#000000",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          COLEGIO COLOMBO SUECO
        </Text>
        <Text style={styles.subtitle}>
          DANE: 30500119827 - RESOLUCION: 009070
        </Text>
        <Text
          style={{
            color: "#000000",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          CERTIFICADO DESEMPEÑO
        </Text>
      </View>

      <Text style={styles.section}>
        LOS SUSCRITOS RECTOR Y SECRETARIA DEL COLEGIO PANAMERICANO COLOMBO
        SUECO, FILIAL DE LA MISION PANAMERICANA DE COLOMBIA, ESTABLECIMIENTO
        PRIVADO DE CARÁCTER FORMAL APROBADO CON RESOLUCION PARA PREESCOLAR
        009070 DESDE DEL 14 DE SEPTIEMBRE DE 1994, PARA LA BASICA PRIMARIA Y
        SECUNDARIA 000108 DESDE EL 26 DE MARZO DE 1996 Y PARA EL NIVEL DE MEDIA
        ACADÉMICA 4104 DESDE EL 22 DE MAYO DE 2001, EMANADAS DE LA SECRETARIA DE
        EDUCACION Y CULTURA DE ANTIOQUIA.
      </Text>
      <View style={styles.row}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          DANE 30500119827
        </Text>
        <Text>CERTIFICA QUE</Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          Certificado Nº 427
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
          fontSize: 9,
          marginBottom: 5,
          textAlign: "justify",
          fontWeight: "bold",
        }}
      >
        Que {estudiante?.nombre}, identificado con T. I. Nº.{" "} {estudiante?.numDocumento} de PENDIENTE, cursó y aprobó en este establecimiento educativo, los estudios correspondientes al grado {" "}
        {estudiante.grupo} de Básica Secundaria. Para el año lectivo {estudiante.añoLectivo}. Matrícula Nº. {estudiante.codigoMatricula} y
        folio del libro de calificaciones Nº. {estudiante.folio}
      </Text>

      {/* Tabla de Desempeño */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            AREA/MATERIA
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            HS
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            NOTA
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            DESEMPEÑO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            C.NATURALES Y EDUCACION AMBIENTAL
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            4
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.naturalesYEducacionAmbiental}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.naturalesYEducacionAmbiental;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            CIENCIAS SOCIALES (HIST, GEOG, CONST, DEMOC)
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            4
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.cienciasSociales}
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.cienciasSociales;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}></View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            EDUCACIÓN FÍSICA, RECREACIÓN Y DEPORTES
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.educacionFisicaYRecreacionYDeportes}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.educacionFisicaYRecreacionYDeportes;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            HUMANIDADES LENGUA CASTELLANA E IDIOMA EXTRANJERO
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.humanidadesLenguaCastellanaEIdiomaExtranjero}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor =
                estudiante.humanidadesLenguaCastellanaEIdiomaExtranjero;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            LENGUA CASTELLANA
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.lenguaCastellana}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.lenguaCastellana;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            IDIOMA EXTRANJERO (INGLES)
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.idiomaExtranjeroIngles}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.idiomaExtranjeroIngles;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            MATEMATICAS
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.matematicas}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.matematicas;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            TECNOLOGIA E INFORMATICA
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.tecnologiaEInformatica}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.tecnologiaEInformatica;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            ED. ETICA Y VALORES
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            2
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.educacionEticaYValores}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.educacionEticaYValores;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            CÍVICA Y CONSTITUCIÓN
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            1
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.civicaYConstitucion}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.civicaYConstitucion;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 4,
              border: "1px solid #C0C0C0",
              textAlign: "left",
              paddingLeft: 5,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            ED.ARTISTICA Y CULTURAL
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            2
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {estudiante.educacionArtisticaYCultural}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {(() => {
              const valor = estudiante.educacionArtisticaYCultural;
              if (valor >= 1.0 && valor <= 2.9) return "BAJO";
              if (valor >= 3.0 && valor <= 3.9) return "BÁSICO";
              if (valor >= 4.0 && valor <= 4.5) return "ALTO";
              if (valor >= 4.6 && valor <= 5.0) return "SUPERIOR";
              return "";
            })()}
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 9,
          marginBottom: 5,
          textAlign: "justify",
          fontWeight: "bold",
        }}
      >
        Plan de estudios aprobado según la Ley General de Educación (Ley 115 de
        febrero 8 de 1994) y su Decreto Reglamentario 1860 del 3 de Agosto de
        1994. De la Jornada y el Horario, según Artículo 57 del decreto 1860.
        Evaluación según el Decreto 1290 de 2009 y la Resolución Rectoral No 417
        del 30 de noviembre de 2009. Dado en MEDELLÍN el 28/10/2024.
      </Text>
      <Text style={styles.escala}>Escala valorativa nacional:</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            DESEMPENO SUPERIO
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            DESEMPENO ALTO
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            DESEMPENO BASICO
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            DESEMPENO BAJO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            4.6 a 5.0
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            4.0 a 4.5
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            3.0 a 3.9
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              flex: 1,
              border: "1px solid #C0C0C0",
              textAlign: "center",
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            1.0 a 2.9
          </Text>
        </View>
      </View>

      <View style={styles.view_p}>
        <Text style={styles.p}>
          Se firma en la ciudad de Medellín a los {new Date().getDate()} días
          del mes de {new Date().toLocaleString("es-ES", { month: "long" })} de{" "}
          {new Date().getFullYear()}.
        </Text>
        <Text style={styles.p}>
          Para cualquier verificación comunicarse al teléfono (604) 442 06 06.
          Ext 505
        </Text>

        <View style={styles.footer}>
          <View style={styles.footer_in}>
            <Text style={styles.p}>{estudiante.rector}</Text>
            <Text style={styles.p}>Rector(a)</Text>
            <Text style={styles.p}>
              C.C {estudiante.ccRector} de {estudiante.ciudadExpedicionRector}
            </Text>
          </View>

          <View style={styles.footer_in}>
            <Text style={styles.p}>{estudiante.secretaria}</Text>
            <Text style={styles.p}>Secretaría Académica</Text>
            <Text style={styles.p}>
              C.C {estudiante.ccSecretaria} de{" "}
              {estudiante.ciudadExpedicionSecretaria}
            </Text>
          </View>
        </View>

        <View style={styles.footer_principal}>
          <View>
            <Text>
              FILIAL DE LA MISION PANAMERICANA DE COLOMBIA - FUNDADO EN EL 1994
            </Text>
          </View>

          <View>
            <Text>PERSONERIA JURIDICA ESPECIAL 867 DE 1996</Text>
          </View>

          <View>
            <Text>NIT.860.007.390-1</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
import axios from "axios";
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
        <PDFDownloadLink
          document={
            <CertificadoEstudiosDocument estudiante={estudianteSeleccionado} />
          }
          fileName={generateFileName(estudianteSeleccionado)}
        >
          {({ loading }) =>
            loading ? "Cargando certificado..." : "Descargar Certificado de como PDF"
          }
        </PDFDownloadLink>
      )}
    </>
  );
};

export default CertificadoEstudios;
 