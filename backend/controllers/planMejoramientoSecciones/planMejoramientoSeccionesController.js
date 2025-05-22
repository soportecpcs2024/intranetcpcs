const asyncHandler = require('express-async-handler');
const Plan = require('../../models/planMejoramientoSecciones/planMejoramientoSecciones.js');

// @desc    Crear nuevo plan
// @route   POST /api/planes
// @access  Public o Private según necesidad
const crearPlan = asyncHandler(async (req, res) => {
  const plan = new Plan(req.body);
  const nuevoPlan = await plan.save();
  res.status(201).json(nuevoPlan);
});

// @desc    Obtener todos los planes
// @route   GET /api/planes
// @access  Public o Private
const obtenerPlanes = asyncHandler(async (req, res) => {
  const planes = await Plan.find();
  res.json(planes);
});

// @desc    Obtener plan por ID
// @route   GET /api/planes/:id
// @access  Public o Private
const obtenerPlanPorId = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (plan) {
    res.json(plan);
  } else {
    res.status(404);
    throw new Error('Plan no encontrado');
  }
});

// @desc    Actualizar plan
// @route   PUT /api/planes/:id
// @access  Private
const actualizarPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (plan) {
    Object.assign(plan, req.body);
    const planActualizado = await plan.save();
    res.json(planActualizado);
  } else {
    res.status(404);
    throw new Error('Plan no encontrado');
  }
});

// @desc    Eliminar plan
// @route   DELETE /api/planes/:id
// @access  Private
const eliminarPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (plan) {
    await plan.deleteOne();
    res.json({ mensaje: 'Plan eliminado correctamente' });
  } else {
    res.status(404);
    throw new Error('Plan no encontrado');
  }
});

const actualizarPlanPorSeccionYPeriodo = asyncHandler(async (req, res) => {
  const { seccion, periodo, nuevosDatos } = req.body;

  const plan = await Plan.findOne({ seccion, periodo });

  if (plan) {
    Object.assign(plan, nuevosDatos);
    const planActualizado = await plan.save();
    res.json(planActualizado);
  } else {
    res.status(404);
    throw new Error('Plan no encontrado para la sección y período especificados');
  }
});


module.exports = {
  crearPlan,
  obtenerPlanes,
  obtenerPlanPorId,
  actualizarPlan,
  eliminarPlan,
  actualizarPlanPorSeccionYPeriodo
};
