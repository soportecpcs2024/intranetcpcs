const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('./db'); // Asegúrate de que la configuración de la base de datos sea correcta
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración CORS
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar y usar las rutas de notas de estudiantes
const studentNotesRouter = require('./routes/student_notes_sheet_routes');
app.use('/api/student_notes', studentNotesRouter);

// Importar y usar las rutas de usuarios
const usuarioRouter = require('./routes/usuario');
app.use('/api/usuarios', usuarioRouter);

// Importar y usar las rutas de autenticación
const authRoutes = require("./routes/auth");
app.use('/api/auth', authRoutes);

// Importar y usar las rutas de usuarios
const userRoutes = require("./routes/user");
app.use('/api/users', userRoutes);

// Rutas para los docentes
const docenteRoutes = require('./routes/docenteRoutes');
app.use('/api/docentes', docenteRoutes);

// Rutas para los metas
const metasRoutes = require('./routes/metasGrupoRoutes');
app.use('/api/metas', metasRoutes);

// ----------- Rutas para las llegadas tardías -----------
const llegadasTardeRoutes = require('./routes/llegadasTardesRoutes');
app.use('/api/llegadastarde', llegadasTardeRoutes);

const controlAsisencia = require('./routes/asistenciaDiariaRoutes/asistenciaDiariaRoutes.js'); 
app.use('/api/controlAsistencia', controlAsisencia);


// ------------ Rutas para los datos globales ---------------
const studentsGlobalRoutes = require('./routes/student_datos_globales_Routes');
app.use('/api/studentGlobal', studentsGlobalRoutes);

// Rutas para estudiantes nivel superior
const studentNivelSuperiorRoutes = require('./routes/nivelesSuperioresRoutes');
app.use('/api/ns', studentNivelSuperiorRoutes);

// ------------ Rutas para inventario -------------

// Rutas para los productos
const productRoutes = require('./routes/inventory/productRoutes');
app.use('/api/products', productRoutes);

// Rutas para las unidades de inventario
const unitRoutes = require('./routes/inventory/unitsRoutes');
app.use('/api/units', unitRoutes);

// Rutas para las ubicaciones
const locationRoutes = require('./routes/inventory/locationRoutes');
app.use('/api/location', locationRoutes);


// ------------ Rutas para los informes -------------
const informesRoutes = require('./routes/inventory/informesRoutes');
app.use('/api/informes', informesRoutes);

 
// ------------ Rutas para certificados-------------
const actasGradosroutes = require('./routes/graduadosCpcs/studentGraduateRoutes');
app.use('/api/actasGrados', actasGradosroutes);

const certificadosEstudio = require('./routes/Certificados/certificadosEstudio2025route');
app.use('/api/certificadosEstudio', certificadosEstudio);

const estudiantesActasGrados = require('./routes/Certificados/ActasDeGrado/actasDegradoRoutes');
app.use('/api/estudiantesActasgrado', estudiantesActasGrados);



// ------------ Rutas para extra curriculares y otros -------------

// Importar y usar las rutas de clases extracurriculares
const estudianteRoutesRecaudo = require('./routes/recaudo/estudianteRecaudoRoutes');
app.use('/api/recaudo', estudianteRoutesRecaudo);

const clasesRoutes = require('./routes/recaudo/clasesRoutes');
app.use('/api/recaudo', clasesRoutes);

// Importar y usar las rutas de facturas
const facturasRoutes = require('./routes/recaudo/facturaRoutes');
app.use('/api/recaudo', facturasRoutes);

// Importar y usar las rutas de reportes de ventas
const reporteRoutes = require('./routes/recaudo/reporteRoutes');
app.use('/api/recaudo/reportes', reporteRoutes);


//------------------ Almuerzos ----------------

const almuerzos = require('./routes/recaudo/Almuerzos/almuerzosRoutes');
app.use('/api/recaudo/almuerzos', almuerzos);

const almuerzoFactura = require('./routes/recaudo/Almuerzos/almuerzosFacturaRoutes');
app.use('/api/recaudo/almuerzoFactura', almuerzoFactura);

//------------------ Plan Mejoramiento ----------------

const planMejoramiento = require('./routes/planMejoramientoSeccion/planMejoramientoSeccionesRoutes');
app.use('/api/planMejora', planMejoramiento);


//------------------ Tareas ----------------

const tareas = require('./routes/Tareas/tareasRoutes');
app.use('/api/tareas', tareas);

const mantenimiento = require('./routes/Tareas/mantenimientoRoutes')
app.use('/api/mantenimiento', mantenimiento)

// ---------------- Escuelas de padres ----------------

const epAsistencia = require('./routes/EPadres/asistenciaRoutes');
app.use('/api/epAsistencias', epAsistencia);

const epEscuelas = require('./routes/EPadres/escuelasRoutes');
app.use('/api/epEscuelas', epEscuelas);

const epEstudiantes= require('./routes/EPadres/estudiantesRoutes.js');
app.use('/api/epEstudiantes', epEstudiantes);


// ---------------- asistencias ----------------

const asistenciasExtraCurricular = require('./routes/asistenciasExtraCurricular/asistenciasExtracurricularRoutes');
app.use('/api/asistenciasextra', asistenciasExtraCurricular);


// ---------------- preinscripcion estudiantes ----------------

const preinscripcionEstudiante = require('./routes/recaudo/formularioCompraRoutes');

app. use('/api/preinscripciones', preinscripcionEstudiante);
// ---------------- rubricas  ----------------

const evaluacionrubricas = require('./routes/rubricas/rubricasRoutes');
app. use('/api/evaluacionRubricas', evaluacionrubricas);

// ---------------- Papeleria  ----------------
const papeleria = require('./routes/productosPapeleria/productosPapeleriarouter.js')
app.use('/api/papeleria',papeleria);
 
// ---------------- admisiones   ----------------

// const procesoAdmisiones = require('./routes/admisiones/admisionesEstudianteRoutes');
// app. use('/api/admisiones', procesoAdmisiones);
 

// // ------------ Import Excel (Preview) -------------
// const importExcelRoutes = require("./routes/dataExcel/importExcelRoutes.js");
// app.use("/api/import-excel", importExcelRoutes);



// Configuración y arranque del servidor
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
