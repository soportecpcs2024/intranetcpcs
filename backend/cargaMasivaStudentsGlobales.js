const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("./db"); // Asegúrate de que tu archivo db.js esté configurado correctamente
const StudentNotes = require("./models/students_datos_globales"); // Importa tu modelo de notas de estudiantes

// Ruta del archivo CSV
const csvFilePath = path.join(__dirname, "../EstudiantesGlobales.csv"); // Reemplaza con la ruta correcta a tu archivo CSV

fs.createReadStream(csvFilePath, { encoding: "utf8" })
  .pipe(csv()) // No es necesario especificar el separador si el CSV usa comas por defecto
  .on("data", async (row) => {
    try {
      // Convertir los valores numéricos de las notas a números
      const numericFields = [
        "codigo_matricula",
        "primer_nombre",
        "segundo_nombre",
        "primer_apellido",
        "segundo_apellido",
        "tipo_documento",
        "numero_identificacion",
        "municipio_exp_documento",
        "fecha_nacimiento",
        "municipio_nacimiento",
        "telefono",
        "celular",
        "email",
        "direccion",
        "pais",
        "municipio_direccion",
        "barrio_direccion",
        "sexo",
        "estrato",
        "tipo_sangre",
        "eps",
        "ars",
        "grupo_sisben",
        "zona",
        "estado",
        "tiene_subsidio",
        "ips",
        "numero_carnet_sisben",
        "fuente_recursos",
        "madre_cabeza_familia",
        "beneficiario_heroe_nacion",
        "beneficiario_madre_cabeza_familia",
        "beneficiario_veterano_fuerza_publica",
        "proviene_sector_privado",
        "proviene_otro_municipio",
        "institucion_bienestar_origen",
        "poblacion_victima_conflicto",
        "municipio_expulsor",
        "tipo_discapacidad",
        "capacidad_excepcional",
        "etnia",
        "folio",
        "fecha_matricula",
        "sede",
        "formalizada",
        "jornada",
        "grupo",
        "grado",
        "ano_lectivo",
        "nivel",
        "usuario",
        "ultima_fecha_actualizacion",
        "edad",
        "pertenece_regimen_contributivo",
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
      console.log("Documento guardado:", savedNote);
    } catch (err) {
      console.error("Error al guardar el documento:", err);
    }
  })
  .on("end", () => {
    console.log("Proceso de inserción de datos finalizado");
  })
  .on("error", (err) => {
    console.error("Error al leer el archivo CSV:", err);
  });
