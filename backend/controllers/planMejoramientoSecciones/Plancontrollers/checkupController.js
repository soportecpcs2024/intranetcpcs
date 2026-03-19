// controllers/checkupController.js (CommonJS)
// Plan de Mejoramiento - Chequeo Digital (MERN)
// - Autenticación: usa req.user desde tu middleware asureAuth
// - Compatibilidad JWT: soporta payload con _id o user_id
// - Seguridad: el chequeo semanal queda SIEMPRE asociado al usuario logueado
// - Privacidad:
//   - list y dashboardStats retornan SOLO datos del usuario logueado
//   - dashboardInstitucional consolida información global del plan
//
// Mejoras incluidas:
// ✅ Obliga a responder TODAS las preguntas activas del área/periodo
// ✅ Bloquea duplicados (misma pregunta repetida)
// ✅ Valida que todas las questionId pertenezcan a ese plan+area+periodo (anti-fraude)
// ✅ Corrige aggregates con ObjectId
// ✅ Permite dashboard institucional
// ✅ Permite consultar un chequeo semanal puntual

const mongoose = require("mongoose");
const Plan = require("../../../models/planMejoramientoSecciones/PlanModels/planModel.js");
const {
  CheckupQuestion,
} = require("../../../models/planMejoramientoSecciones/PlanModels/checkupQuestionModel.js");
const WeeklyCheckupAnswer = require("../../../models/planMejoramientoSecciones/PlanModels/weeklyCheckupAnswerModel.js");

/**
 * OJO:
 * Si el $lookup falla, revisa en Mongo Compass el nombre real de la colección
 * de preguntas y cambia este valor.
 *
 * Normalmente Mongoose usa plural y minúscula del modelo:
 *  - Modelo: CheckupQuestion -> colección: checkupquestions
 */
const QUESTIONS_COLLECTION = "checkupquestions";

/**
 * Helper: extrae userId del payload del JWT (compatible con varios formatos)
 */
function getUserId(req) {
  if (!req || !req.user) return null;
  return req.user._id || req.user.user_id || req.user.id || null;
}

/**
 * Helper: convierte a ObjectId seguro
 */
function toObjectId(value) {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (!mongoose.Types.ObjectId.isValid(String(value))) return null;
  return new mongoose.Types.ObjectId(String(value));
}

/**
 * Helper: normaliza textos
 */
function normalizeText(value) {
  return String(value || "").trim();
}

/**
 * Helper: convierte cualquier fecha al LUNES de esa semana a las 00:00:00
 */
function toWeekStartMonday(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;

  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 domingo, 1 lunes...
  const diff = day === 0 ? -6 : 1 - day; // mover a lunes
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Helper: trae plan activo si no viene planId
 */
async function resolvePlanId(planId) {
  if (planId) return planId;

  const active = await Plan.findOne({ isActive: true }).select("_id");
  return active ? active._id : null;
}

/**
 * GET /api/checkups/plan-activo
 * Devuelve el plan activo
 */
async function getActivePlan(req, res) {
  try {
    const plan = await Plan.findOne({ isActive: true }).sort({ year: -1 });

    if (!plan) {
      return res.status(404).json({ message: "No hay plan activo" });
    }

    return res.json(plan);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo plan activo",
      error: error.message,
    });
  }
}

/**
 * GET /api/checkups/preguntas?planId=&area=&periodo=
 * Devuelve preguntas activas por plan+área+periodo
 */
async function getQuestions(req, res) {
  try {
    const { planId, area, periodo } = req.query;

    if (!area || !periodo) {
      return res.status(400).json({
        message: "area y periodo son obligatorios",
      });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const questions = await CheckupQuestion.find({
      planId: finalPlanId,
      area: normalizeText(area),
      periodo: Number(periodo),
      isActive: true,
    }).sort({ numero: 1 });

    return res.json(questions);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo preguntas",
      error: error.message,
    });
  }
}

/**
 * POST /api/checkups/plan
 * Crea un plan (multi-año)
 * body: { name, year, isActive?, description? }
 */
async function createPlan(req, res) {
  try {
    const { name, year, isActive = false, description = "" } = req.body;

    if (!name || !year) {
      return res.status(400).json({
        message: "name y year son obligatorios",
      });
    }

    if (isActive === true) {
      await Plan.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );
    }

    const plan = await Plan.create({
      name: normalizeText(name),
      year: Number(year),
      isActive: Boolean(isActive),
      description: normalizeText(description),
    });

    return res.status(201).json(plan);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: "Ya existe un plan para ese año",
      });
    }

    return res.status(500).json({
      message: "Error creando plan",
      error: error.message,
    });
  }
}

/**
 * POST /api/checkups/semanal  (UPsert: crea o actualiza)
 * body: { planId?, area, periodo, weekStart, grupo?, answers[], observaciones?, evidencias? }
 *
 * answers: [{ questionId, score(1..5) }]
 *
 * REGLA: solo usuarios autenticados y el registro queda ligado al usuario logueado.
 */
async function upsertWeeklyCheckup(req, res) {
  try {
    const {
      planId,
      area,
      periodo,
      weekStart,
      grupo = "",
      answers,
      observaciones = "",
      evidencias = [],
    } = req.body;

    if (
      !area ||
      !periodo ||
      !weekStart ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return res.status(400).json({
        message: "area, periodo, weekStart y answers son obligatorios",
      });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const ws = toWeekStartMonday(weekStart);
    if (!ws) {
      return res.status(400).json({ message: "weekStart inválido" });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        message: "No autorizado (token requerido)",
      });
    }

    if (req.user && req.user.active === false) {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    const docenteId = userId;
    const evaluadorId = userId;
    const normalizedArea = normalizeText(area);
    const normalizedGrupo = normalizeText(grupo);

    for (const a of answers) {
      const score = Number(a && a.score);
      if (!a || !a.questionId || Number.isNaN(score) || score < 1 || score > 5) {
        return res.status(400).json({
          message:
            "answers inválidos: cada item debe tener questionId y score entre 1 y 5",
        });
      }
    }

    const totalQuestions = await CheckupQuestion.countDocuments({
      planId: finalPlanId,
      area: normalizedArea,
      periodo: Number(periodo),
      isActive: true,
    });

    const uniqueIds = [...new Set(answers.map((a) => String(a.questionId)))];

    if (uniqueIds.length !== totalQuestions) {
      return res.status(400).json({
        message: `Debe responder todas las preguntas (sin repetir). Esperadas: ${totalQuestions}, recibidas: ${uniqueIds.length}`,
      });
    }

    const objectIds = uniqueIds
      .map((id) => toObjectId(id))
      .filter(Boolean);

    if (objectIds.length !== uniqueIds.length) {
      return res.status(400).json({
        message: "Uno o más questionId no tienen un formato válido",
      });
    }

    const countQ = await CheckupQuestion.countDocuments({
      _id: { $in: objectIds },
      planId: finalPlanId,
      area: normalizedArea,
      periodo: Number(periodo),
      isActive: true,
    });

    if (countQ !== uniqueIds.length) {
      return res.status(400).json({
        message:
          "Algunas preguntas no pertenecen a ese plan/área/periodo o están inactivas",
      });
    }

    const sanitizedAnswers = answers.map((a) => ({
      questionId: toObjectId(a.questionId),
      score: Number(a.score),
    }));

    const doc = await WeeklyCheckupAnswer.findOneAndUpdate(
      {
        planId: finalPlanId,
        docenteId,
        area: normalizedArea,
        periodo: Number(periodo),
        weekStart: ws,
        grupo: normalizedGrupo,
      },
      {
        $set: {
          planId: finalPlanId,
          area: normalizedArea,
          periodo: Number(periodo),
          docenteId,
          evaluadorId,
          grupo: normalizedGrupo,
          weekStart: ws,
          answers: sanitizedAnswers,
          observaciones: normalizeText(observaciones),
          evidencias: Array.isArray(evidencias) ? evidencias : [],
        },
      },
      { new: true, upsert: true }
    );

    return res.json(doc);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: "Ya existe un registro para esa semana (docente/área/periodo/grupo).",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Error guardando chequeo semanal",
      error: error.message,
    });
  }
}

/**
 * GET /api/checkups/semanal/uno?planId=&area=&periodo=&weekStart=&grupo=
 * Devuelve un único chequeo semanal del usuario logueado
 */
async function getWeeklyCheckup(req, res) {
  try {
    const { planId, area, periodo, weekStart, grupo = "" } = req.query;

    if (!area || !periodo || !weekStart) {
      return res.status(400).json({
        message: "area, periodo y weekStart son obligatorios",
      });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        message: "No autorizado (token requerido)",
      });
    }

    const ws = toWeekStartMonday(weekStart);
    if (!ws) {
      return res.status(400).json({ message: "weekStart inválido" });
    }

    const doc = await WeeklyCheckupAnswer.findOne({
      planId: finalPlanId,
      docenteId: userId,
      area: normalizeText(area),
      periodo: Number(periodo),
      weekStart: ws,
      grupo: normalizeText(grupo),
    });

    if (!doc) {
      return res.status(404).json({
        message: "No existe chequeo semanal para esa combinación",
      });
    }

    return res.json(doc);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo chequeo semanal",
      error: error.message,
    });
  }
}

/**
 * GET /api/checkups/semanal?planId=&area=&periodo=&grupo=&from=&to=
 * Lista historial
 *
 * Privacidad:
 * - Retorna SOLO registros del usuario logueado.
 */
async function listWeeklyCheckups(req, res) {
  try {
    const { planId, area, periodo, grupo, from, to } = req.query;

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        message: "No autorizado (token requerido)",
      });
    }

    const filter = {
      planId: finalPlanId,
      docenteId: userId,
    };

    if (area) filter.area = normalizeText(area);
    if (periodo) filter.periodo = Number(periodo);
    if (grupo) filter.grupo = normalizeText(grupo);

    if (from || to) {
      filter.weekStart = {};
      if (from) filter.weekStart.$gte = new Date(from);
      if (to) filter.weekStart.$lte = new Date(to);
    }

    const data = await WeeklyCheckupAnswer.find(filter)
      .sort({ weekStart: -1 })
      .limit(1000);

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error listando chequeos",
      error: error.message,
    });
  }
}

/**
 * GET /api/checkups/dashboard?planId=&area=&periodo=&grupo=&from=&to=
 * Dashboard personal del usuario logueado
 * Devuelve:
 * - avgByQuestion
 * - trend
 * - traffic
 */
async function dashboardStats(req, res) {
  try {
    const { planId, area, periodo, grupo, from, to } = req.query;

    if (!area || !periodo) {
      return res.status(400).json({
        message: "area y periodo son obligatorios",
      });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        message: "No autorizado (token requerido)",
      });
    }

    const planObjectId = toObjectId(finalPlanId);
    const userObjectId = toObjectId(userId);

    if (!planObjectId || !userObjectId) {
      return res.status(400).json({
        message: "planId o userId inválido",
      });
    }

    const match = {
      planId: planObjectId,
      area: normalizeText(area),
      periodo: Number(periodo),
      docenteId: userObjectId,
    };

    if (grupo) match.grupo = normalizeText(grupo);

    if (from || to) {
      match.weekStart = {};
      if (from) match.weekStart.$gte = new Date(from);
      if (to) match.weekStart.$lte = new Date(to);
    }

    const avgByQuestion = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $unwind: "$answers" },
      {
        $lookup: {
          from: QUESTIONS_COLLECTION,
          localField: "answers.questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: "$answers.questionId",
          numero: { $first: "$q.numero" },
          texto: { $first: "$q.texto" },
          avgScore: { $avg: "$answers.score" },
          n: { $sum: 1 },
        },
      },
      { $sort: { numero: 1 } },
    ]);

    const trend = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: "$weekStart",
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const trafficAgg = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: null,
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
          low: { $sum: { $cond: [{ $lte: ["$avgTotal", 2] }, 1, 0] } },
          mid: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$avgTotal", 2] },
                    { $lt: ["$avgTotal", 4] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          high: { $sum: { $cond: [{ $gte: ["$avgTotal", 4] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          n: 1,
          avgTotal: { $ifNull: ["$avgTotal", 0] },
          lowPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$low", "$n"] }, 100] },
            ],
          },
          midPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$mid", "$n"] }, 100] },
            ],
          },
          highPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$high", "$n"] }, 100] },
            ],
          },
        },
      },
    ]);

    const traffic =
      trafficAgg?.[0] || {
        n: 0,
        avgTotal: 0,
        lowPct: 0,
        midPct: 0,
        highPct: 0,
      };

    return res.json({
      avgByQuestion,
      trend,
      traffic,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generando dashboard",
      error: error.message,
    });
  }
}

/**
 * GET /api/checkups/dashboard/institucional?planId=&area=&periodo=&grupo=&from=&to=
 * Dashboard institucional
 * Devuelve:
 * - summary
 * - traffic
 * - trend
 * - avgByQuestion
 * - byGroup
 * - byArea
 */
async function dashboardInstitucional(req, res) {
  try {
    const { planId, area, periodo, grupo, from, to } = req.query;

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({
        message: "planId requerido (no hay plan activo)",
      });
    }

    const planObjectId = toObjectId(finalPlanId);
    if (!planObjectId) {
      return res.status(400).json({
        message: "planId inválido",
      });
    }

    const match = {
      planId: planObjectId,
    };

    if (area) match.area = normalizeText(area);
    if (periodo) match.periodo = Number(periodo);
    if (grupo) match.grupo = normalizeText(grupo);

    if (from || to) {
      match.weekStart = {};
      if (from) match.weekStart.$gte = new Date(from);
      if (to) match.weekStart.$lte = new Date(to);
    }

    const summaryAgg = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: null,
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
          low: { $sum: { $cond: [{ $lte: ["$avgTotal", 2] }, 1, 0] } },
          mid: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$avgTotal", 2] },
                    { $lt: ["$avgTotal", 4] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          high: { $sum: { $cond: [{ $gte: ["$avgTotal", 4] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          n: 1,
          avgTotal: { $ifNull: ["$avgTotal", 0] },
          lowPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$low", "$n"] }, 100] },
            ],
          },
          midPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$mid", "$n"] }, 100] },
            ],
          },
          highPct: {
            $cond: [
              { $eq: ["$n", 0] },
              0,
              { $multiply: [{ $divide: ["$high", "$n"] }, 100] },
            ],
          },
        },
      },
    ]);

    const trend = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: "$weekStart",
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const avgByQuestion = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $unwind: "$answers" },
      {
        $lookup: {
          from: QUESTIONS_COLLECTION,
          localField: "answers.questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: "$answers.questionId",
          numero: { $first: "$q.numero" },
          texto: { $first: "$q.texto" },
          avgScore: { $avg: "$answers.score" },
          n: { $sum: 1 },
        },
      },
      { $sort: { numero: 1 } },
    ]);

    const byGroup = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: "$grupo",
          grupo: { $first: "$grupo" },
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
        },
      },
      { $sort: { avgTotal: -1 } },
    ]);

    const byArea = await WeeklyCheckupAnswer.aggregate([
      { $match: match },
      { $addFields: { avgTotal: { $avg: "$answers.score" } } },
      {
        $group: {
          _id: "$area",
          area: { $first: "$area" },
          n: { $sum: 1 },
          avgTotal: { $avg: "$avgTotal" },
        },
      },
      { $sort: { avgTotal: -1 } },
    ]);

    const summary =
      summaryAgg?.[0] || {
        n: 0,
        avgTotal: 0,
        lowPct: 0,
        midPct: 0,
        highPct: 0,
      };

    return res.json({
      summary,
      traffic: summary,
      trend,
      avgByQuestion,
      byGroup,
      byArea,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generando dashboard institucional",
      error: error.message,
    });
  }
}

module.exports = {
  createPlan,
  getActivePlan,
  getQuestions,
  upsertWeeklyCheckup,
  getWeeklyCheckup,
  listWeeklyCheckups,
  dashboardStats,
  dashboardInstitucional,
};