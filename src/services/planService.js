const { Plan, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class PlanService {
  async createPlan(planData) {
    try {
      const plan = await Plan.create(planData);
      logger.info(`Created new plan: ${plan.name} (${plan.id})`);
      return plan;
    } catch (error) {
      logger.error('Error creating plan:', error);
      throw error;
    }
  }

  async getAllPlans(filters = {}, pagination = {}) {
    try {
      const { isActive, minPrice, maxPrice, currency } = filters;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'ASC' } = pagination;

      const whereClause = {};
      
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }
      
      if (minPrice !== undefined) {
        whereClause.price = { ...whereClause.price, [Op.gte]: minPrice };
      }
      
      if (maxPrice !== undefined) {
        whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };
      }
      
      if (currency) {
        whereClause.currency = currency;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await Plan.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      return {
        plans: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching plans:', error);
      throw error;
    }
  }

  async getPlanById(planId) {
    try {
      const plan = await Plan.findByPk(planId);
      return plan;
    } catch (error) {
      logger.error('Error fetching plan:', error);
      throw error;
    }
  }

  async updatePlan(planId, updateData) {
    try {
      const plan = await Plan.findByPk(planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      await plan.update(updateData);
      logger.info(`Updated plan: ${plan.name} (${plan.id})`);
      
      return plan;
    } catch (error) {
      logger.error('Error updating plan:', error);
      throw error;
    }
  }

  async deletePlan(planId) {
    try {
      const plan = await Plan.findByPk(planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Soft delete by setting isActive to false
      await plan.update({ isActive: false });
      logger.info(`Deactivated plan: ${plan.name} (${plan.id})`);
      
      return plan;
    } catch (error) {
      logger.error('Error deleting plan:', error);
      throw error;
    }
  }

  async getActivePlans() {
    try {
      const plans = await Plan.findAll({
        where: { isActive: true },
        order: [['price', 'ASC']]
      });
      
      return plans;
    } catch (error) {
      logger.error('Error fetching active plans:', error);
      throw error;
    }
  }
}

module.exports = new PlanService(); 