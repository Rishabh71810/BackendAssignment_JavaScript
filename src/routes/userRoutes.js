const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateBody } = require('../middleware/validation');
const { userSchemas } = require('../validators');

const router = express.Router();

// Public routes
router.post('/register', 
  validateBody(userSchemas.register),
  userController.register
);

router.post('/login',
  validateBody(userSchemas.login),
  userController.login
);

// Protected routes (require authentication)
router.get('/profile',
  authenticateToken,
  userController.getProfile
);

router.put('/profile',
  authenticateToken,
  userController.updateProfile
);

router.put('/change-password',
  authenticateToken,
  userController.changePassword
);

router.delete('/deactivate',
  authenticateToken,
  userController.deactivateAccount
);

module.exports = router; 