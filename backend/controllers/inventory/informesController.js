const Units = require('../../models/inventory/unitsModels'); // Asegúrate de tener un modelo de Unidades

// Controlador para obtener estadísticas de unidades agrupadas por subcategoría y categoría
const obtenerEstadisticasPorSubcategoria = async (req, res) => {
  try {
    // Agregación para contar unidades por subcategoría y categoría, y calcular el total de precio
    const estadisticas = await Units.aggregate([
      {
        $lookup: {
          from: 'products', // Nombre de la colección de productos
          localField: 'id_producto', // Campo de Units que se unirá
          foreignField: '_id', // Campo de Products para la unión
          as: 'producto_info' // Nombre del nuevo campo que contendrá la información del producto
        }
      },
      {
        $unwind: '$producto_info' // Descomponer el array producto_info
      },
      {
        $group: {
          _id: {
            subcategory: '$producto_info.subcategory', // Agrupa por subcategoría
            category: '$producto_info.category' // Agrupa también por categoría
          },
          totalUnidades: { $sum: 1 }, // Cuenta el total de unidades
          totalPrecio: { $sum: { $multiply: [1, '$producto_info.price'] } } // Suma el total de precio
        }
      },
      {
        $group: {
          _id: '$_id.category', // Agrupa los resultados por categoría
          totalUnidadesPorCategoria: { $sum: '$totalUnidades' }, // Suma las unidades por categoría
          totalPrecioPorCategoria: { $sum: '$totalPrecio' }, // Suma el total de precios por categoría
          subcategorias: {
            $push: {
              subcategoria: '$_id.subcategory',
              totalUnidades: '$totalUnidades',
              totalPrecio: '$totalPrecio'
            }
          } // Incluye la información de las subcategorías en la categoría correspondiente
        }
      },
      {
        $project: {
          categoria: '$_id', // Muestra la categoría
          totalUnidadesPorCategoria: 1, // Incluye el total de unidades por categoría
          totalPrecioPorCategoria: 1, // Incluye el total de precio por categoría
          subcategorias: 1, // Muestra las subcategorías con sus totales
          _id: 0 // Excluye _id del resultado final
        }
      }
    ]);

    res.status(200).json({
      totalCategorias: estadisticas.length, // Número total de categorías
      estadisticas // Devuelve la lista de categorías con sus subcategorías, unidades y total de precios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las estadísticas de unidades por subcategoría y categoría' });
  }
};

module.exports = {
  obtenerEstadisticasPorSubcategoria,
};
