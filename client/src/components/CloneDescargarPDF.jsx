// CloneDescargarPDF.js
import React, { useRef, useEffect } from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import BarChartComponentAreasPDF from "../components/BarChartComponentAreasPDF";
import PieChartComponentAreas from "../components/PieChartComponentAreas";

// Define los estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  item: {
    marginBottom: 5,
  },
  chartContainer: {
    marginBottom: 20,
  }
});

const CloneDescargarPDF = ({
  filteredStudents,
  selectedGroup,
  selectedPeriodo,
  selectedArea,
  error,
  groupCounts,
  totalFilteredStudents,
  promedioGeneral,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && typeof containerRef.current.getBoundingClientRect === 'function') {
      const rect = containerRef.current.getBoundingClientRect();
      console.log(rect);
    } else {
      console.error('containerRef.current no es un elemento válido o no tiene getBoundingClientRect');
    }
  }, []);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Informe por Áreas</Text>
          <Text>Grupo: {selectedGroup}</Text>
          <Text>Periodo: {selectedPeriodo}</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.title}>Promedios por materia</Text>
          <BarChartComponentAreasPDF
            students={filteredStudents}
            selectedArea={selectedArea}
            selectedGroup={selectedGroup}
            error={error}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Consolidado de datos:</Text>
          <View style={styles.item}>
            <Text>Número de estudiantes: {totalFilteredStudents}</Text>
          </View>
          <View style={styles.item}>
            <Text>Promedio general: {promedioGeneral}</Text>
          </View>
          <View style={styles.item}>
            <Text>Estudiantes con promedio DI: {groupCounts.DI}</Text>
          </View>
          <View style={styles.item}>
            <Text>Estudiantes con promedio BÁSICO: {groupCounts.BÁSICO}</Text>
          </View>
          <View style={styles.item}>
            <Text>Estudiantes con promedio DA: {groupCounts.DA}</Text>
          </View>
          <View style={styles.item}>
            <Text>Estudiantes con promedio DS: {groupCounts.DS}</Text>
          </View>
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
  );
};

export default CloneDescargarPDF;