import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const LOGO_URL =
  "https://res.cloudinary.com/dvugfmopj/image/upload/v1770665378/logo2025_h8wlte.png";

const FIRMA_URL =
  "https://res.cloudinary.com/dvugfmopj/image/upload/v1771268661/FIRMA_ADM_hiubd3.jpg";

const styles = StyleSheet.create({
  page: { padding: 18, fontSize: 10, fontFamily: "Helvetica" },
  card: { border: "1pt solid #111", padding: 10 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: "bold", textAlign: "center", flex: 1 },
  small: { fontSize: 12 },
  line: { height: 1, backgroundColor: "#111", marginVertical: 8 },
  row: { flexDirection: "row", gap: 8 },
  col: { flexGrow: 1 },
  label: { fontSize: 12, fontWeight: "bold" },
  value: { fontSize: 13, marginTop: 2 },
  logo: { width: 50, height: 50 },
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
  firma: {
    marginTop: 10,
    paddingTop: 14,
    borderTop: "1pt solid #111",
    alignItems: "center",
  },
  firmaImg: {
    width: 140,
    height: 60,
    marginTop: 3,
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
  totalRow: { marginTop: 8, paddingTop: 6, borderTop: "1pt solid #111" },
  bigTotal: { marginTop: 6, paddingTop: 8, borderTop: "1pt solid #111" },
  bigTotalText: { fontSize: 12, fontWeight: "bold", textAlign: "right" },
});

export default function ColillaPDF({ data, cedula }) {
  const fecha = String(data?.fechaColilla || data?.fecha || "").slice(0, 10) || "N/A";
  const empleado = data?.nombresYApellidos || "N/A";
  const cargo = data?.cargo || data?.dependencia || "N/A";

  const salario = data?.salarioOrdinario ?? data?.salario ?? 0;
  const auxTransporte = data?.auxTte ?? 0;
  const horasExt = data?.bonifExtras ?? 0;
  const vacaciones = data?.vacaciones ?? 0;
  const otrosIng = data?.otrosPagos ?? 0;

  const epsAfp = data?.epsAfp ?? data?.eps ?? 0;
  const cxp = data?.cxcColeg ?? data?.cxp ?? 0;
  const funeraria = data?.funeraria ?? 0;
  const comfama = data?.librComfama ?? data?.comfama ?? 0;
  const pension = data?.pensHijos ?? 0;
  const otrosEgr = data?.otros ?? 0;

  const totalIngresos =
    toNum(salario) +
    toNum(auxTransporte) +
    toNum(horasExt) +
    toNum(vacaciones) +
    toNum(otrosIng);

  const totalEgresos =
    toNum(epsAfp) +
    toNum(cxp) +
    toNum(funeraria) +
    toNum(comfama) +
    toNum(pension) +
    toNum(otrosEgr);

  const totalConsignado = toNum(
    data?.totalConsignado ?? data?.netoPagar ?? (totalIngresos - totalEgresos)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            {/* ✅ sin hooks: imagen remota directa */}
            {LOGO_URL ? <Image style={styles.logo} src={LOGO_URL} /> : <View style={styles.logo} />}

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
            <View style={styles.col}></View>
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
              <Item label="CxC Colegio" value={cxp} />
              <Item label="Funeraria" value={funeraria} />
              <Item label="Libr. Comfama" value={comfama} />
              <Item label="Pensión Hijos" value={pension} />
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

          <View style={styles.firma}>
            <Text>Firma autorizada</Text>
            {FIRMA_URL ? <Image style={styles.firmaImg} src={FIRMA_URL} /> : null}
          </View>
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
  return Number.isFinite(n) ? n : 0;
}

function formatCOP(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$ 0";
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  } catch {
    return `$ ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }
}
