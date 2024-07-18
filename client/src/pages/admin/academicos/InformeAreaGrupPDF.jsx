import React from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BarChartComponentAreasPDF from "../../../components/BarChartComponentAreasPDF";
import PieChartComponentAreas from "../../../components/PieChartComponentAreas";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
} from "@react-pdf/renderer";

const InformeAreaGrupPDF = () => {
  const location = useLocation();
  const {
    students = [],
    filteredStudents = [],
    error = null,
    selectedGroup = "1. A",
    selectedPeriodo = "PERIODO 1",
    selectedScale = "",
    selectedArea = "ciencias_naturales",
    loading = true,
    groupCounts = { DI: 0, BÁSICO: 0, DA: 0, DS: 0 },
  } = location.state || {};

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalFilteredStudents = filteredStudents.length || 0;
  const totalFilteredPromedio = filteredStudents.reduce(
    (acc, student) => acc + parseFloat(student.promedio || 0),
    0
  );
  const promedioGeneral =
    totalFilteredStudents > 0
      ? (totalFilteredPromedio / totalFilteredStudents).toFixed(1)
      : 0;

  return (
    <PDFViewer width="100%" height="600">
      <Document>
        <Page size="A4" style={{ padding: 20 }}>
          <View>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>Informe del Área</Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Grupo: {selectedGroup}</Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Periodo: {selectedPeriodo}</Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Número de estudiantes: {totalFilteredStudents}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Promedio general: {promedioGeneral}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Estudiantes con promedio DI: {groupCounts.DI}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Estudiantes con promedio BÁSICO: {groupCounts.BÁSICO}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Estudiantes con promedio DA: {groupCounts.DA}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Estudiantes con promedio DS: {groupCounts.DS}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <BarChartComponentAreasPDF
              students={filteredStudents}
              selectedArea={selectedArea}
              selectedGroup={selectedGroup}
              error={error}
            />
          </View>
          <View style={{ marginTop: 20 }}>
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

export default InformeAreaGrupPDF;

