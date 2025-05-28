const userService = require('../services/userService');
const logger = require('../utils/logger');

class UserController {
  async register(req, res) {
    try {
      const result = await userService.registerUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      logger.error('Error in register:', error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to register user'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      logger.error('Error in login:', error);
      
      if (error.message.includes('Invalid') || error.message.includes('deactivated')) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to login'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.userId; // From auth middleware
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error in getProfile:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve profile'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.userId; // From auth middleware
      const user = await userService.updateUser(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in updateProfile:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update profile'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.userId; // From auth middleware
      const { currentPassword, newPassword } = req.body;
      
      const result = await userService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in changePassword:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      if (error.message.includes('incorrect')) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to change password'
      });
    }
  }

  async deactivateAccount(req, res) {
    try {
      const userId = req.userId; // From auth middleware
      const user = await userService.deactivateUser(userId);
      
      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in deactivateAccount:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to deactivate account'
      });
    }
  }
}

module.exports = new UserController(); 