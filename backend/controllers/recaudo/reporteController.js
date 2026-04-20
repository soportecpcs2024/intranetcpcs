// controllers/reporteController.js

const ExcelJS = require('exceljs');
const Factura = require('../../models/recaudo/factura');

// Ruta para exportar ventas mensuales
exports.exportarVentasMensuales = async (req, res) => {
  try {
    const facturas = await Factura.find({ fechaCompra: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
      .populate('estudianteId')
      .populate('clases.claseId');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas Mensuales');

    worksheet.columns = [
      { header: 'ID Factura', key: 'idFactura', width: 10 },
      { header: 'Estudiante', key: 'estudiante', width: 30 },
      { header: 'Clase', key: 'clase', width: 20 },
      { header: 'Costo', key: 'costo', width: 10 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Fecha Compra', key: 'fechaCompra', width: 20 },
    ];

    facturas.forEach(factura => {
      factura.clases.forEach(clase => {
        worksheet.addRow({
          idFactura: factura._id,
          estudiante: `${factura.estudianteId.nombre} (${factura.estudianteId.documentoIdentidad})`,
          clase: clase.nombreClase,
          costo: clase.costo,
          total: factura.total,
          fechaCompra: factura.fechaCompra.toLocaleDateString(),
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_mensuales.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generando el reporte', error });
  }
};


// controllers/reporteController.js



// Ruta para exportar ventas mensuales en JSON
exports.exportarVentasMensualesJSON = async (req, res) => {
  try {


    const facturas = await Factura.find()

      .populate('estudianteId')
      .populate('clases.claseId');

    const reporte = facturas.flatMap(factura =>
      factura.clases.map(clase => ({
        idFactura: factura._id,
        nombre: factura.estudianteId ? `${factura.estudianteId.nombre}` : 'Sin estudiante',
        documento: factura.estudianteId ? `${factura.estudianteId.documentoIdentidad}` : 'Sin documento',
        grado: factura.estudianteId ? `${factura.estudianteId.grado}` : 'Sin grado',
        clase: clase.nombreClase || (clase.claseId ? clase.claseId.nombreClase : 'Sin clase'),
        costo: clase.costo || 0,
        total: factura.total,
        tipoPago: factura.tipoPago,
        mesAplicado: factura.mes_aplicado,
        fechaCompra: factura.fechaCompra,
      }))
    );

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte.json');

    res.status(200).send(JSON.stringify({
      ok: true,
      totalRegistros: reporte.length,
      data: reporte
    }, null, 2)); // 👈 ESTE 2 es la clave
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error generando el reporte en JSON',
      error: error.message
    });
  }
};