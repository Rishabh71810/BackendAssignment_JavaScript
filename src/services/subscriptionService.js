const { Subscription, User, Plan, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class SubscriptionService {
  async createSubscription(subscriptionData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { userId, planId, autoRenew, paymentMethod, metadata } = subscriptionData;

      // Verify user exists
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Verify plan exists and is active
      const plan = await Plan.findByPk(planId, { transaction });
      if (!plan || !plan.isActive) {
        throw new Error('Plan not found or inactive');
      }

      // Check if user already has an active subscription
      const existingSubscription = await Subscription.findOne({
        where: {
          userId,
          status: 'ACTIVE'
        },
        transaction
      });

      if (existingSubscription) {
        throw new Error('User already has an active subscription');
      }

      // Calculate end date
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (plan.duration * 24 * 60 * 60 * 1000));

      // Create subscription
      const subscription = await Subscription.create({
        userId,
        planId,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: autoRenew || false,
        paymentMethod,
        lastPaymentDate: startDate,
        nextBillingDate: autoRenew ? endDate : null,
        metadata: metadata || {}
      }, { transaction });

      await transaction.commit();

      // Return subscription with plan details
      return await this.getSubscriptionById(subscription.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getSubscriptionByUserId(userId) {
    const subscription = await Subscription.findOne({
      where: { userId },
      include: [
        {
          model: Plan,
          as: 'plan'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return subscription;
  }

  async getSubscriptionById(subscriptionId) {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [
        {
          model: Plan,
          as: 'plan'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    return subscription;
  }

  async updateSubscription(userId, updateData) {
    const transaction = await sequelize.transaction();
    
    try {
      const subscription = await Subscription.findOne({
        where: {
          userId,
          status: 'ACTIVE'
        },
        transaction
      });

      if (!subscription) {
        throw new Error('No active subscription found for user');
      }

      // If changing plan, validate new plan
      if (updateData.planId && updateData.planId !== subscription.planId) {
        const newPlan = await Plan.findByPk(updateData.planId, { transaction });
        if (!newPlan || !newPlan.isActive) {
          throw new Error('New plan not found or inactive');
        }

        // Calculate new end date based on new plan duration
        const now = new Date();
        const newEndDate = new Date(now.getTime() + (newPlan.duration * 24 * 60 * 60 * 1000));
        
        updateData.endDate = newEndDate;
        updateData.nextBillingDate = updateData.autoRenew ? newEndDate : null;
      }

      // Update subscription
      await subscription.update(updateData, { transaction });
      await transaction.commit();

      return await this.getSubscriptionById(subscription.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(userId, reason = null) {
    const transaction = await sequelize.transaction();
    
    try {
      const subscription = await Subscription.findOne({
        where: {
          userId,
          status: 'ACTIVE'
        },
        transaction
      });

      if (!subscription) {
        throw new Error('No active subscription found for user');
      }

      await subscription.update({
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
        autoRenew: false
      }, { transaction });

      await transaction.commit();

      return await this.getSubscriptionById(subscription.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async expireSubscriptions() {
    const transaction = await sequelize.transaction();
    
    try {
      const now = new Date();
      
      // Find all active subscriptions that have passed their end date
      const expiredSubscriptions = await Subscription.findAll({
        where: {
          status: 'ACTIVE',
          endDate: {
            [Op.lt]: now
          }
        },
        transaction
      });

      logger.info(`Found ${expiredSubscriptions.length} expired subscriptions`);

      // Update expired subscriptions
      for (const subscription of expiredSubscriptions) {
        await subscription.update({
          status: 'EXPIRED'
        }, { transaction });
        
        logger.info(`Expired subscription ${subscription.id} for user ${subscription.userId}`);
      }

      await transaction.commit();
      return expiredSubscriptions.length;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error expiring subscriptions:', error);
      throw error;
    }
  }
}

module.exports = new SubscriptionService(); 