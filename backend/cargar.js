const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('./db'); // Asegúrate de que tu archivo db.js esté configurado correctamente
const StudentNotes = require('./models/student_notes_sheet_model'); // Importa tu modelo de notas de estudiantes

// Ruta del archivo CSV
const csvFilePath = path.join(__dirname, '../resultados_periodo2.csv'); // Reemplaza con la ruta correcta a tu archivo CSV

fs.createReadStream(csvFilePath, { encoding: 'utf8' })
  .pipe(csv()) // No es necesario especificar el separador si el CSV usa comas por defecto
  .on('data', async (row) => {
    try {
      // Convertir los valores numéricos de las notas a números
      const numericFields = [
        'puesto',
        'promedio',
        'ciencias_naturales',
        'fisica',
        'quimica',
        'ciencias_politicas_economicas',
        'ciencias_sociales',
        'civica_y_constitucion',
        'educacion_artistica',
        'educacion_cristiana',
        'educacion_etica',
        'educacion_fisica',
        'filosofia',
        'idioma_extranjero',
        'lengua_castellana',
        'matematicas',
        'tecnologia'
      ];

      // Asegurarse de que los campos numéricos sean números
      for (let key in row) {
        if (numericFields.includes(key)) {
          row[key] = parseFloat(row[key]); // Convertir a número
        }
      }

      // Crear un nuevo documento basado en el modelo y guardar en MongoDB
      const newStudentNote = new StudentNotes(row);
      const savedNote = await newStudentNote.save();
      console.log('Documento guardado:', savedNote);
    } catch (err) {
      console.error('Error al guardar el documento:', err);
    }
  })
  .on('end', () => {
    console.log('Proceso de inserción de datos finalizado');
  })
  .on('error', (err) => {
    console.error('Error al leer el archivo CSV:', err);
  });
