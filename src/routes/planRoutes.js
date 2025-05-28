const express = require('express');
const planController = require('../controllers/planController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const { planSchemas, paramSchemas, querySchemas } = require('../validators');
const Joi = require('joi');

const router = express.Router();

// Combined query schema for plans
const planQuerySchema = Joi.object({
  ...querySchemas.pagination.describe().keys,
  ...querySchemas.planFilters.describe().keys
});

// Public routes (no authentication required)
router.get('/',
  validateQuery(planQuerySchema),
  planController.getAllPlans
);

router.get('/active',
  planController.getActivePlans
);

router.get('/:id',
  validateParams(paramSchemas.uuid),
  planController.getPlanById
);

// Protected routes (require authentication)
router.post('/',
  authenticateToken,
  validateBody(planSchemas.create),
  planController.createPlan
);

router.put('/:id',
  authenticateToken,
  validateParams(paramSchemas.uuid),
  validateBody(planSchemas.update),
  planController.updatePlan
);

router.delete('/:id',
  authenticateToken,
  validateParams(paramSchemas.uuid),
  planController.deletePlan
);

module.exports = router; 