import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: { padding: 18, fontSize: 10, fontFamily: "Helvetica" },
  card: { border: "1pt solid #111", padding: 10 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: "bold", textAlign: "center", flex: 1 },
  small: { fontSize: 9 },
  
  line: { height: 1, backgroundColor: "#111", marginVertical: 8 },
  row: { flexDirection: "row", gap: 8 },
  col: { flexGrow: 1 },
  label: { fontSize: 12, fontWeight: "bold" },
  value: { fontSize: 9, marginTop: 2 },
 
  logo: {
  width: 50,
  height: 50,
},


  sectionHeader: {
    flexDirection: "row",
    borderTop: "1pt solid #111",
    borderBottom: "1pt solid #111",
    marginTop: 10,
  },
  sectionCell: {
    width: "50%",
    paddingVertical: 6,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1pt solid #111",
  },
  sectionCellRight: {
    width: "50%",
    paddingVertical: 6,
    fontWeight: "bold",
    textAlign: "center",
  },

  bodyRow: { flexDirection: "row" },
  half: { width: "50%", padding: 8, borderRight: "1pt solid #111" },
  halfRight: { width: "50%", padding: 8 },

  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  totalRow: { marginTop: 8, paddingTop: 6, borderTop: "1pt solid #111" },

  bigTotal: { marginTop: 6, paddingTop: 8, borderTop: "1pt solid #111" },
  bigTotalText: { fontSize: 12, fontWeight: "bold", textAlign: "right" },

  firma: { marginTop: 18, paddingTop: 14, borderTop: "1pt solid #111", fontSize: 10 },
  
});

export default function ColillaPDF({ data, cedula }) {
  // ✅ Ajusta estos nombres si tu backend usa otros
  const fecha = String(data?.fechaColilla || data?.fecha || "").slice(0, 10) || "N/A";
  const empleado = data?.nombresYApellidos || "N/A";
  const cargo = data?.cargo || data?.dependencia || "N/A";

  // INGRESOS (ejemplos)
  const salario = data?.salarioOrdinario ?? data?.salario ?? 0;
  const auxTransporte = data?.auxTte ?? 0;
  const horasExt = data?.horasExtra ?? 0;
  const vacaciones = data?.vacaciones ?? 0;
  const otrosIng = data?.otrosIngresos ?? data?.otrosPagos ?? 0;

  // EGRESOS (ejemplos)
  const epsAfp = data?.epsAfp ?? data?.eps ?? 0;
  const cxp = data?.cxpColegio ?? data?.cxp ?? 0;
  const funeraria = data?.funeraria ?? 0;
  const comfama = data?.libranzaComfama ?? data?.comfama ?? 0;
  const pension = data?.pension ?? 0;
  const otrosEgr = data?.otrosEgresos ?? 0;

  const totalIngresos =
    toNum(salario) + toNum(auxTransporte) + toNum(horasExt) + toNum(vacaciones) + toNum(otrosIng);

  const totalEgresos =
    toNum(epsAfp) + toNum(cxp) + toNum(funeraria) + toNum(comfama) + toNum(pension) + toNum(otrosEgr);

  const totalConsignado =
    toNum(data?.totalConsignado ?? data?.netoPagar ?? (totalIngresos - totalEgresos));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image style={styles.logo} src="/logo2025.png" />

            <Text style={styles.title}>COMPROBANTE DE PAGO</Text>
            <Text style={styles.small}>Fecha: {fecha}</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>NOMBRE DEL EMPLEADO:</Text>
              <Text style={styles.value}>{empleado}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>N° CÉDULA:</Text>
              <Text style={styles.value}>{cedula || data?.cedula || "N/A"}</Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 8 }]}>
            <View style={styles.col}>
              <Text style={styles.label}>CARGO:</Text>
              <Text style={styles.value}>{cargo}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>PERIODO:</Text>
              <Text style={styles.value}>{data?.periodo || data?.mes || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCell}>INGRESOS</Text>
            <Text style={styles.sectionCellRight}>EGRESOS</Text>
          </View>

          <View style={styles.bodyRow}>
            <View style={styles.half}>
              <Item label="Salario Ordinario" value={salario} />
              <Item label="Aux. Transporte" value={auxTransporte} />
              <Item label="Horas ext / Bonif" value={horasExt} />
              <Item label="Vacaciones" value={vacaciones} />
              <Item label="Otros pagos" value={otrosIng} />

              <View style={styles.totalRow}>
                <Item label="TOTAL" value={totalIngresos} bold />
              </View>
            </View>

            <View style={styles.halfRight}>
              <Item label="EPS/AFP" value={epsAfp} />
              <Item label="CxP Colegio" value={cxp} />
              <Item label="Funeraria" value={funeraria} />
              <Item label="Libr. Comfama" value={comfama} />
              <Item label="Pensión" value={pension} />
              <Item label="Otros" value={otrosEgr} />

              <View style={styles.totalRow}>
                <Item label="TOTAL" value={totalEgresos} bold />
              </View>
            </View>
          </View>

          <View style={styles.bigTotal}>
            <Text style={styles.label}>TOTAL CONSIGNADO</Text>
            <Text style={styles.bigTotalText}>{formatCOP(totalConsignado)}</Text>
          </View>

          <Text style={styles.firma}>FIRMA</Text>
        </View>
      </Page>
    </Document>
  );
}

function Item({ label, value, bold }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
      <Text style={{ fontWeight: bold ? "bold" : "normal" }}>{label}</Text>
      <Text style={{ fontWeight: bold ? "bold" : "normal" }}>{formatCOP(value)}</Text>
    </View>
  );
}

function toNum(v) {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

function formatCOP(value) {
  const n = Number(value);
  if (!isFinite(n)) return "$ 0";
  // React-PDF no soporta Intl en algunos entornos antiguos; pero normalmente funciona.
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  } catch {
    return `$ ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }
}
