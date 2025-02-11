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
