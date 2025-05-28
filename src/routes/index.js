const express = require('express');
const userRoutes = require('./userRoutes');
const planRoutes = require('./planRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');

const router = express.Router();

// API version prefix
router.use('/v1/users', userRoutes);
router.use('/v1/plans', planRoutes);
router.use('/v1/subscriptions', subscriptionRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    title: 'Subscription Microservice API',
    version: '1.0.0',
    description: 'A microservice for managing user subscriptions in a SaaS platform',
    endpoints: {
      users: {
        'POST /api/v1/users/register': 'Register a new user',
        'POST /api/v1/users/login': 'Login user',
        'GET /api/v1/users/profile': 'Get user profile (requires auth)',
        'PUT /api/v1/users/profile': 'Update user profile (requires auth)',
        'PUT /api/v1/users/change-password': 'Change password (requires auth)',
        'DELETE /api/v1/users/deactivate': 'Deactivate account (requires auth)'
      },
      plans: {
        'GET /api/v1/plans': 'Get all plans with filtering and pagination',
        'GET /api/v1/plans/active': 'Get all active plans',
        'GET /api/v1/plans/:id': 'Get plan by ID',
        'POST /api/v1/plans': 'Create new plan (requires auth)',
        'PUT /api/v1/plans/:id': 'Update plan (requires auth)',
        'DELETE /api/v1/plans/:id': 'Deactivate plan (requires auth)'
      },
      subscriptions: {
        'POST /api/v1/subscriptions': 'Create new subscription (requires auth)',
        'GET /api/v1/subscriptions/me': 'Get current user subscription (requires auth)',
        'GET /api/v1/subscriptions/:userId': 'Get user subscription by user ID (requires auth)',
        'PUT /api/v1/subscriptions/:userId': 'Update user subscription (requires auth)',
        'DELETE /api/v1/subscriptions/:userId': 'Cancel user subscription (requires auth)'
      }
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>'
    }
  });
});

module.exports = router; 