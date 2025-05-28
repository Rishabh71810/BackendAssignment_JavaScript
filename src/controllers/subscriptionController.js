const subscriptionService = require('../services/subscriptionService');
const logger = require('../utils/logger');

class SubscriptionController {
  async createSubscription(req, res) {
    try {
      const subscription = await subscriptionService.createSubscription(req.body);
      
      logger.info(`Subscription created: ${subscription.id} for user ${subscription.userId}`);
      
      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: subscription
      });
    } catch (error) {
      logger.error('Error in createSubscription:', error);
      
      if (error.message.includes('not found') || error.message.includes('inactive')) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      if (error.message.includes('already has an active subscription')) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to create subscription'
      });
    }
  }

  async getSubscription(req, res) {
    try {
      const { userId } = req.params;
      const subscription = await subscriptionService.getSubscriptionByUserId(userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'No subscription found for this user'
        });
      }
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Error in getSubscription:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve subscription'
      });
    }
  }

  async updateSubscription(req, res) {
    try {
      const { userId } = req.params;
      const subscription = await subscriptionService.updateSubscription(userId, req.body);
      
      logger.info(`Subscription updated: ${subscription.id} for user ${userId}`);
      
      res.status(200).json({
        success: true,
        message: 'Subscription updated successfully',
        data: subscription
      });
    } catch (error) {
      logger.error('Error in updateSubscription:', error);
      
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
        message: 'Failed to update subscription'
      });
    }
  }

  async cancelSubscription(req, res) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      
      const subscription = await subscriptionService.cancelSubscription(userId, reason);
      
      logger.info(`Subscription cancelled: ${subscription.id} for user ${userId}`);
      
      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: subscription
      });
    } catch (error) {
      logger.error('Error in cancelSubscription:', error);
      
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
        message: 'Failed to cancel subscription'
      });
    }
  }

  // Additional endpoint to get current user's subscription
  async getCurrentUserSubscription(req, res) {
    try {
      const userId = req.userId; // From auth middleware
      const subscription = await subscriptionService.getSubscriptionByUserId(userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'No subscription found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Error in getCurrentUserSubscription:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve subscription'
      });
    }
  }
}

module.exports = new SubscriptionController(); 