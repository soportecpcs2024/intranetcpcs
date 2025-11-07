const LlegadasTardes = require('../../models/llegadasTardes');
const Usuario = require('../../models/students_datos_globales');

exports.obtenerAsistencias = async (req, res) => {
  try {
    const result = await LlegadasTardes.aggregate([
      {
        $lookup: {
          from: 'students_datos_globales', // Nombre de la colección en MongoDB
          localField: 'num_identificacion',
          foreignField: 'num_identificacion',
          as: 'usuario'
        }
      },
      {
        $unwind: '$usuario' // Descompone el array en documentos individuales
      },
      {
        $project: {
          primer_nombre: '$usuario.primer_nombre',
          segundo_nombre: '$usuario.segundo_nombre',
          primer_apellido: '$usuario.primer_apellido',
          segundo_apellido: '$usuario.segundo_apellido',
          num_identificacion: '$usuario.num_identificacion',
          grupo: '$usuario.grupo',
          grado: '$usuario.grado',
          fechas: '$fechas'
        }
      }
    ]).exec();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

