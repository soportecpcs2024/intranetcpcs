// controllers/checkupController.js (CommonJS)
// Plan de Mejoramiento - Chequeo Digital (MERN)
// - Autenticación: usa req.user desde tu middleware asureAuth
// - Compatibilidad JWT: soporta payload con _id o user_id
// - Seguridad: el chequeo semanal queda SIEMPRE asociado al usuario logueado
// - Privacidad (recomendado): list y dashboard retornan SOLO datos del usuario logueado
//
// Mejoras incluidas:
// ✅ Obliga a responder TODAS las preguntas activas del área/periodo
// ✅ Bloquea duplicados (misma pregunta repetida)
// ✅ Valida que todas las questionId pertenezcan a ese plan+area+periodo (anti-fraude)
// ✅ Mensajes de error más claros

const Plan = require("../../../models/planMejoramientoSecciones/PlanModels/planModel.js");
const { CheckupQuestion } = require("../../../models/planMejoramientoSecciones/PlanModels/checkupQuestionModel.js");
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
 * Tu login actual entrega "user_id" en el access token.
 */
function getUserId(req) {
  if (!req || !req.user) return null;
  return req.user._id || req.user.user_id || req.user.id || null;
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
    if (!plan) return res.status(404).json({ message: "No hay plan activo" });
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo plan activo", error: error.message });
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
      return res.status(400).json({ message: "area y periodo son obligatorios" });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({ message: "planId requerido (no hay plan activo)" });
    }

    const questions = await CheckupQuestion.find({
      planId: finalPlanId,
      area,
      periodo: Number(periodo),
      isActive: true,
    }).sort({ numero: 1 });

    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo preguntas", error: error.message });
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
      return res.status(400).json({ message: "name y year son obligatorios" });
    }

    // Si este plan se marca como activo, desactiva los demás
    if (isActive === true) {
      await Plan.updateMany({ isActive: true }, { $set: { isActive: false } });
    }

    const plan = await Plan.create({
      name: String(name).trim(),
      year: Number(year),
      isActive: Boolean(isActive),
      description: String(description || "").trim(),
    });

    return res.status(201).json(plan);
  } catch (error) {
    // Duplicado por índice único (year)
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Ya existe un plan para ese año" });
    }

    return res.status(500).json({ message: "Error creando plan", error: error.message });
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

    if (!area || !periodo || !weekStart || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "area, periodo, weekStart y answers son obligatorios",
      });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({ message: "planId requerido (no hay plan activo)" });
    }

    const ws = toWeekStartMonday(weekStart);
    if (!ws) return res.status(400).json({ message: "weekStart inválido" });

    // ✅ Solo usuarios autenticados pueden diligenciar
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "No autorizado (token requerido)" });
    }

    // ✅ (Opcional) bloquear usuarios inactivos si el payload lo trae
    // Si tu JWT no incluye "active", este bloque no afecta.
    if (req.user && req.user.active === false) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    // ✅ Forzamos que el chequeo quede a nombre del usuario logueado
    const docenteId = userId;
    const evaluadorId = userId;

    // Validación de scores + estructura
    for (const a of answers) {
      const score = Number(a && a.score);
      if (!a || !a.questionId || Number.isNaN(score) || score < 1 || score > 5) {
        return res.status(400).json({
          message: "answers inválidos: cada item debe tener questionId y score entre 1 y 5",
        });
      }
    }

    // ✅ Total de preguntas activas esperadas
    const totalQuestions = await CheckupQuestion.countDocuments({
      planId: finalPlanId,
      area,
      periodo: Number(periodo),
      isActive: true,
    });

    // ✅ IDs únicos (evita duplicados)
    const uniqueIds = [...new Set(answers.map((a) => String(a.questionId)))];

    if (uniqueIds.length !== totalQuestions) {
      return res.status(400).json({
        message: `Debe responder todas las preguntas (sin repetir). Esperadas: ${totalQuestions}, recibidas: ${uniqueIds.length}`,
      });
    }

    // ✅ Validar que TODAS las questionId pertenezcan a plan+area+periodo activos
    const countQ = await CheckupQuestion.countDocuments({
      _id: { $in: uniqueIds },
      planId: finalPlanId,
      area,
      periodo: Number(periodo),
      isActive: true,
    });

    if (countQ !== uniqueIds.length) {
      return res.status(400).json({
        message: "Algunas preguntas no pertenecen a ese plan/área/periodo o están inactivas",
      });
    }

    // Upsert (1 por semana)
    const doc = await WeeklyCheckupAnswer.findOneAndUpdate(
      { planId: finalPlanId, docenteId, area, periodo: Number(periodo), weekStart: ws, grupo },
      {
        $set: {
          planId: finalPlanId,
          area,
          periodo: Number(periodo),
          docenteId,
          evaluadorId,
          grupo,
          weekStart: ws,
          answers,
          observaciones,
          evidencias,
        },
      },
      { new: true, upsert: true }
    );

    return res.json(doc);
  } catch (error) {
    // Manejo específico de duplicados por índice único
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: "Ya existe un registro para esa semana (docente/área/periodo/grupo).",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Error guardando chequeo semanal", error: error.message });
  }
}

/**
 * GET /api/checkups/semanal?planId=&area=&periodo=&grupo=&from=&to=
 * Lista historial (para tabla)
 *
 * Privacidad (recomendado):
 * - Retorna SOLO registros del usuario logueado.
 */
async function listWeeklyCheckups(req, res) {
  try {
    const { planId, area, periodo, grupo, from, to } = req.query;

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({ message: "planId requerido (no hay plan activo)" });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "No autorizado (token requerido)" });
    }

    const filter = { planId: finalPlanId, docenteId: userId };

    if (area) filter.area = area;
    if (periodo) filter.periodo = Number(periodo);
    if (grupo) filter.grupo = grupo;

    if (from || to) {
      filter.weekStart = {};
      if (from) filter.weekStart.$gte = new Date(from);
      if (to) filter.weekStart.$lte = new Date(to);
    }

    const data = await WeeklyCheckupAnswer.find(filter).sort({ weekStart: -1 }).limit(1000);

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error listando chequeos", error: error.message });
  }
}

/**
 * GET /api/checkups/dashboard?planId=&area=&periodo=&grupo=&from=&to=
 * Devuelve:
 * - avgByQuestion: promedio por pregunta (con texto)
 * - trend: promedio total por semana
 * - traffic: semáforo (bajo/medio/alto) + promedio total global
 *
 * Privacidad (recomendado):
 * - Calcula SOLO sobre registros del usuario logueado.
 */
async function dashboardStats(req, res) {
  try {
    const { planId, area, periodo, grupo, from, to } = req.query;

    if (!area || !periodo) {
      return res.status(400).json({ message: "area y periodo son obligatorios" });
    }

    const finalPlanId = await resolvePlanId(planId);
    if (!finalPlanId) {
      return res.status(400).json({ message: "planId requerido (no hay plan activo)" });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "No autorizado (token requerido)" });
    }

    const match = {
      planId: finalPlanId,
      area,
      periodo: Number(periodo),
      docenteId: userId,
    };

    if (grupo) match.grupo = grupo;

    if (from || to) {
      match.weekStart = {};
      if (from) match.weekStart.$gte = new Date(from);
      if (to) match.weekStart.$lte = new Date(to);
    }

    // A) Promedio por pregunta
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

    // B) Tendencia semanal del promedio total
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

    // C) Semáforo global + promedio total global
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
                { $and: [{ $gt: ["$avgTotal", 2] }, { $lt: ["$avgTotal", 4] }] },
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
      (trafficAgg && trafficAgg[0]) || { n: 0, avgTotal: 0, lowPct: 0, midPct: 0, highPct: 0 };

    return res.json({ avgByQuestion, trend, traffic });
  } catch (error) {
    return res.status(500).json({ message: "Error generando dashboard", error: error.message });
  }
}

module.exports = {
  createPlan,
  getActivePlan,
  getQuestions,
  upsertWeeklyCheckup,
  listWeeklyCheckups,
  dashboardStats,
};
