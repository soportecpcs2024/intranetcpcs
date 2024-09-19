// Cargar las variables de entorno
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('../db'); // Asegúrate de que tu archivo db.js esté configurado correctamente
const StudentNotes = require('../models/student_notes_sheet_model'); // Importa tu modelo de notas de estudiantes

// Ruta del archivo JSON
const jsonFilePath = path.join(__dirname, './data3periodo.json'); // Reemplaza con la ruta correcta a tu archivo JSON

async function cargarDatosDesdeJson() {
  try {
    // Leer el archivo JSON
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const estudiantes = JSON.parse(data);

    // Verificar que los datos sean un array
    if (!Array.isArray(estudiantes)) {
      throw new Error('El archivo JSON no contiene un array.');
    }

    // Guardar los documentos en MongoDB en lotes para evitar problemas de memoria
    const batchSize = 100; // Tamaño del lote
    for (let i = 0; i < estudiantes.length; i += batchSize) {
      const batch = estudiantes.slice(i, i + batchSize);
      try {
        // Guardar el lote de documentos en MongoDB
        await StudentNotes.insertMany(batch);
        console.log(`Lote ${Math.ceil((i + batchSize) / batchSize)} guardado correctamente.`);
      } catch (err) {
        console.error(`Error al guardar el lote ${Math.ceil((i + batchSize) / batchSize)}:`, err);
      }
    }

    console.log('Proceso de inserción de datos finalizado');
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
  }
}

// Ejecuta la función de carga de datos
cargarDatosDesdeJson();

