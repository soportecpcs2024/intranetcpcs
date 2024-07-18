const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('./db'); // Asegúrate de que la configuración de la base de datos sea correcta
const bodyParser = require('body-parser');

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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use(express.static('uploads'));

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

// Rutas para los datos globales
const studentsGlobalRoutes = require('./routes/student_datos_globales_Routes');
app.use('/api/studentGlobal', studentsGlobalRoutes);



const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
