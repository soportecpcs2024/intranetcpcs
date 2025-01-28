// controllers/facturacion/invoiceController.js
const Invoice = require('../../models/facturacion/Invoice');
const Student = require('../../models/facturacion/Student');

// Crear una nueva factura
const createInvoice = async (req, res) => {
    const { alumnoId, clases, mes } = req.body;

    try {
        // Verificar si ya existe una factura para el mes y el estudiante
        const facturaExistente = await Invoice.findOne({ alumnoId, mes });
        if (facturaExistente) {
            return res.status(400).json({ message: 'Ya existe una factura para este mes.' });
        }

        // Calcular el total de la factura
        const total = clases.reduce((sum, clase) => sum + clase.costo, 0);

        // Crear la factura
        const nuevaFactura = new Invoice({ alumnoId, clases, total, mes });
        await nuevaFactura.save();

        // Actualizar el historial de clases compradas del estudiante
        const updateData = clases.map(clase => ({
            claseId: clase.claseId,
            costo: clase.costo,
            mes
        }));
        await Student.findByIdAndUpdate(alumnoId, {
            $push: { clasesCompradas: { $each: updateData } }
        });

        res.status(201).json({ message: 'Factura creada con éxito.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener facturas por mes
const getInvoicesByMonth = async (req, res) => {
    const { mes } = req.params;

    try {
        const facturas = await Invoice.find({ mes }).populate('alumnoId').populate('clases.claseId');
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Total de clases por tipo en un mes
const getTotalClassesByType = async (req, res) => {
    const { mes, nombre } = req.params;

    try {
        const facturas = await Invoice.find({ mes }).populate('clases.claseId');
        const totalClases = facturas.reduce((sum, factura) => {
            return sum + factura.clases.filter(c => c.claseId.nombre === nombre).length;
        }, 0);

        res.json({ totalClases });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// controllers/facturacion/invoiceController.js

// Obtener las facturas de un alumno por mes
const getStudentInvoicesByMonth = async (req, res) => {
    const { alumnoId, mes } = req.params;

    try {
        // Buscar facturas que coincidan con el alumno y el mes
        const facturas = await Invoice.find({ alumnoId, mes })
            .populate('clases.claseId')
            .populate('alumnoId');

        if (facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas para este alumno en el mes seleccionado.' });
        }

        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    createInvoice,
    getInvoicesByMonth,
    getTotalClassesByType,
    getStudentInvoicesByMonth
};
