import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Legend,
} from "recharts";


const CustomTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
        <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#000"
            transform="rotate(-45)"
            fontSize={15}
        >
            {payload.value}
        </text>
    </g>
);

const normalizarPeriodo = (periodo) => {
    if (!periodo) return "";

    const texto = periodo.toString().trim().toUpperCase();
    const numero = texto.match(/\d+/)?.[0];

    return numero ? `PERIODO ${numero}` : texto;
};

const BarChartGrafiasKPI = ({ students = [], selectedGroup, error }) => {
    const filteredStudents = students.filter(
        (student) => student.grupo?.trim() === selectedGroup
    );

    const areaAliases = {
        ciencias_naturales: "C.Naturales",
        fisica: "Física",
        quimica: "Química",
        ciencias_politicas_economicas: "C.Polit-econ",
        ciencias_sociales: "C.Sociales",
        civica_y_constitucion: "Cívica",
        educacion_artistica: "E. Artística",
        educacion_cristiana: "E. Cristiana",
        educacion_etica: "E. Ética",
        educacion_fisica: "E. Física",
        filosofia: "Filosofía",
        idioma_extranjero: "Inglés",
        lengua_castellana: "Lengua",
        matematicas: "Matemáticas",
        tecnologia: "Tecnología",
    };

    const areas = Object.keys(areaAliases);

    const periodos = [
        ...new Set(
            filteredStudents
                .map((student) => normalizarPeriodo(student.periodo))
                .filter(Boolean)
        ),
    ].sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numA - numB;
    });

    const chartData = areas
        .map((area) => {
            const row = {
                area: areaAliases[area],
            };



            periodos.forEach((periodo) => {
                const studentsPeriodo = filteredStudents.filter(
                    (student) => normalizarPeriodo(student.periodo) === periodo
                );

                const valores = studentsPeriodo
                    .map((student) => parseFloat(student[area]))
                    .filter((value) => !isNaN(value) && value > 0);

                const promedio =
                    valores.length > 0
                        ? valores.reduce((acc, value) => acc + value, 0) / valores.length
                        : 0;

                row[periodo] = Number(promedio.toFixed(1));
            });

            return row;
        })
        .filter((row) => periodos.some((periodo) => row[periodo] > 0));

    if (error) return <div>Error: {error}</div>;

    if (periodos.length === 0) {
        return <div>No hay datos para graficar.</div>;
    }

    const getColorPeriodo = (periodo) => {
        const texto = periodo?.toString().trim().toUpperCase();

        if (texto === "PRIMER PERIODO") return "#0e70c5";
        if (texto === "SEGUNDO PERIODO") return "#0c5c10";
        if (texto === "TERCER PERIODO") return "#FB8C00";
        if (texto === "CUARTO PERIODO") return "#E53935";
        if (texto === "QUINTO PERIODO") return "#8E24AA";

        return "#607D8B";
    };




    return (
        <ResponsiveContainer className="barChartDocument" width="100%" height={280}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 5, left: 5, bottom: 80 }}
                barGap={4}
                barCategoryGap={18}

            >
                <XAxis dataKey="area" tick={<CustomTick />} interval={0} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend verticalAlign="top"
                    align="center"
                    height={40} />

                {periodos.map((periodo) => (
                    <Bar
                        key={periodo}
                        name={periodo}
                        dataKey={periodo}
                        fill={getColorPeriodo(periodo)}
                        stroke={getColorPeriodo(periodo)}
                    >
                        <LabelList
                            dataKey={periodo}
                            position="top"
                            fill="#070707"
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold"
                            }}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );

};

export default BarChartGrafiasKPI;