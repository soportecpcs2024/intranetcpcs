import { Document, Text, Page, StyleSheet, Image} from '@react-pdf/renderer';
import BarChartComponentAreasPDF from "../components/BarChartComponentAreasPDF";
import PieChartComponentAreasPDF from "../components/PieChartComponentAreasPDF";
// import { Document, Text, Page, StyleSheet, Image} from '@react-pdf/renderer'

const DescargarPdf = ({
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
    <div>
      <div className="dashboard_div-doc-header">
        <div>
          <h2>
            Grupo : <span className="doc-span">{selectedGroup}</span>
          </h2>
        </div>
        <div>
          <h2>
            <span className="doc-span">{selectedPeriodo}</span>
          </h2>
        </div>
      </div>
      <div className="BarChartComponent_pdf">
        <h2 className="info-title">Promedios por materia:</h2>
        <BarChartComponentAreasPDF
          students={filteredStudents}
          selectedArea={selectedArea}
          selectedGroup={selectedGroup}
          error={error}
        />
      </div>

      <div className="prom_tables-container">
        <div className="box_prom_tables-doc">
          <div className="info-card">
            <h2 className="info-title">Consolidado de datos:</h2>
            <div className="info-list">
              <li className="info-item">
                Número de estudiantes:{" "}
                <span className="info-value">{totalFilteredStudents}</span>
              </li>
              <li className="info-item">
                Promedio general:{" "}
                <span className="info-value">{promedioGeneral}</span>
              </li>
              <li className="info-item">
                Estudiantes con promedio DI{" "}
                <span className="info-value">{groupCounts.DI}</span>
              </li>
              <li className="info-item">
                Estudiantes con promedio BÁSICO{" "}
                <span className="info-value">{groupCounts.BÁSICO} </span>
              </li>
              <li className="info-item">
                Estudiantes con promedio DA{" "}
                <span className="info-value">{groupCounts.DA}</span>
              </li>
              <li className="info-item">
                Estudiantes con promedio DS{" "}
                <span className="info-value">{groupCounts.DS}</span>
              </li>
            </div>
          </div>
        </div>

        <div className="box_prom_tables-doc">
          <PieChartComponentAreasPDF
            students={filteredStudents}
            selectedArea={selectedArea}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DescargarPdf;




