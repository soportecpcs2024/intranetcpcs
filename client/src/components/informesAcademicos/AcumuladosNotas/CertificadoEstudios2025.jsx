import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import ImageLogo from "/logo2025.png";

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
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginTop: 5,
    fontSize: 9,
    marginBottom: 5,
    textAlign: "justify",
    fontWeight: "bold",
  },
  section_plan_estudio: {
    marginTop: 5,
    fontSize: 10,
    marginBottom: 10,
    textAlign: "justify",
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 14,
  },
  view_p: {},
  p: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 3,
  },
  table: {
    marginTop: 3,
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
    marginTop: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer_in: {
    marginTop: 20,
    borderTop: "1px solid #C0C0C0",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },

  footer_principal: {
    position: "absolute",
    top: 220,
    left: 0,
    right: 0,
    display: "flex",
    textAlign: "center",
    fontSize: 12,
    color: "#2595f7",
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

const CertificadoEstudios2025 = ({ estudiante }) => (
  <Document>
    <Page size="A4" style={styles.page}>
    

      <Text
        style={{
          marginTop: 100,
          marginBottom: 50,
          textAlign: "right",
          fontWeight: "bold",
        }}
      >
        DANE 305001019827
      </Text>

      <Text style={{ marginTop: 30, fontSize: 10, textAlign: "justify" }}>
        EL COLEGIO PANAMERICANO COLOMBO SUECO, FILIAL DE LA MISION PANAMERICANA
        DE COLOMBIA, ESTABLECIMIENTO PRIVADO DE CARÁCTER FORMAL APROBADO CON
        RESOLUCION PARA PREESCOLAR 009070 DEL 14 DE SEPTIEMBRE DE 1994, PARA LA
        BASICA PRIMARIA Y SECUNDARIA 000108 DEL 26 DE MARZO DE 1996 Y PARA EL
        NIVEL DE MEDIA ACADÉMICA 4104 DEL 22 DE MAYO DE 2001.{" "}
      </Text>

      <Text
        style={{
          color: "#000000",
          fontWeight: "bold",
          marginTop: 30,
          textAlign: "center",
        }}
      >
        H A C E C O N S T A R:
      </Text>
      {/* Aquí puedes agregar más contenido del certificado usando los datos del estudiante */}
      <Text style={{ marginTop: 40, textAlign: "justify" }}>
       
        <Text style={{ fontWeight: "bold", fontSize: 14, textDecoration: "underline" }}>
          {estudiante.NOMBRE}
        </Text>{" "}
        identificado(a) con{"  "}
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
          {estudiante.Tipo_de_documento}
        </Text>{" "}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          {estudiante.Número_de_identificación}
        </Text>{" "}
        se {"\n"}encuentra cursando el grado{" "}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          {estudiante.Grado}
        </Text>{" "}
        de la sección{" "}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          {estudiante.SECCION}
        </Text>{" "}
        durante el año lectivo 2025.
      </Text>

      <View>
        <Text style={{ marginTop: 90, fontSize: 13 }}>
          Se firma en la ciudad de Medellín a los {new Date().getDate()} días
          del mes de {new Date().toLocaleString("es-ES", { month: "long" })} de{" "}
          {new Date().getFullYear()}.
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 13, marginTop: 20 }}>
          Para cualquier verificación comunicarse al teléfono (604) 442 06 06.
          Ext 505
        </Text>

        <View style={styles.footer}>
          <View style={styles.footer_in}>
            <Text style={styles.p}>Luz Miriyam Botero</Text>
            <Text style={styles.p}>Secretaría Académica</Text>
          </View>
        </View>

        <View style={styles.footer_principal}>
         
        </View>
      </View>
    </Page>
  </Document>
);

export default CertificadoEstudios2025;
