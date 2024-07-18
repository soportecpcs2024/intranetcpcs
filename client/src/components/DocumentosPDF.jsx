import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import BarChartComponentAreasPDF from "../components/BarChartComponentAreasPDF";
import PieChartComponentAreas from "../components/PieChartComponentAreas";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
});

const DocumentosPDF = ({
  filteredStudents,
  selectedGroup,
  selectedPeriodo,
  selectedArea,
  error,
  groupCounts,
  totalFilteredStudents,
  promedioGeneral,
}) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Grupo: {selectedGroup}</Text>
            <Text>Período: {selectedPeriodo}</Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.section}>Promedios por materia:</Text>
            <BarChartComponentAreasPDF
              students={filteredStudents}
              selectedArea={selectedArea}
              selectedGroup={selectedGroup}
              error={error}
            />
          </View>

          <View style={styles.section}>
            <Text>Consolidado de datos:</Text>
            <Text>Número de estudiantes: {totalFilteredStudents}</Text>
            <Text>Promedio general: {promedioGeneral}</Text>
            <Text>Estudiantes con promedio DI: {groupCounts.DI}</Text>
            <Text>Estudiantes con promedio BÁSICO: {groupCounts.BÁSICO}</Text>
            <Text>Estudiantes con promedio DA: {groupCounts.DA}</Text>
            <Text>Estudiantes con promedio DS: {groupCounts.DS}</Text>
          </View>

          <View style={styles.chartContainer}>
            <PieChartComponentAreas
              students={filteredStudents}
              selectedArea={selectedArea}
              error={error}
            />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default DocumentosPDF;
