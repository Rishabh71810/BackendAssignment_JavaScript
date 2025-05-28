const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');
const { validateBody, validateParams } = require('../middleware/validation');
const { subscriptionSchemas, paramSchemas } = require('../validators');

const router = express.Router();

// All subscription routes require authentication
router.use(authenticateToken);

// Create a new subscription
router.post('/',
  validateBody(subscriptionSchemas.create),
  subscriptionController.createSubscription
);

// Get current user's subscription
router.get('/me',
  subscriptionController.getCurrentUserSubscription
);

// Get subscription by user ID
router.get('/:userId',
  validateParams(paramSchemas.userId),
  subscriptionController.getSubscription
);

// Update subscription
router.put('/:userId',
  validateParams(paramSchemas.userId),
  validateBody(subscriptionSchemas.update),
  subscriptionController.updateSubscription
);

// Cancel subscription
router.delete('/:userId',
  validateParams(paramSchemas.userId),
  validateBody(subscriptionSchemas.cancel),
  subscriptionController.cancelSubscription
);

module.exports = router; 