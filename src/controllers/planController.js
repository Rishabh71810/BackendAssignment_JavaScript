const planService = require('../services/planService');
const logger = require('../utils/logger');

class PlanController {
  async createPlan(req, res) {
    try {
      const plan = await planService.createPlan(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Plan created successfully',
        data: plan
      });
    } catch (error) {
      logger.error('Error in createPlan:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Plan with this name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to create plan'
      });
    }
  }

  async getAllPlans(req, res) {
    try {
      const filters = {
        isActive: req.query.isActive,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        currency: req.query.currency
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };

      const result = await planService.getAllPlans(filters, pagination);
      
      res.status(200).json({
        success: true,
        data: result.plans,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getAllPlans:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve plans'
      });
    }
  }

  async getPlanById(req, res) {
    try {
      const { id } = req.params;
      const plan = await planService.getPlanById(id);
      
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Plan not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error) {
      logger.error('Error in getPlanById:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve plan'
      });
    }
  }

  async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await planService.updatePlan(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Plan updated successfully',
        data: plan
      });
    } catch (error) {
      logger.error('Error in updatePlan:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Plan with this name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update plan'
      });
    }
  }

  async deletePlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await planService.deletePlan(id);
      
      res.status(200).json({
        success: true,
        message: 'Plan deactivated successfully',
        data: plan
      });
    } catch (error) {
      logger.error('Error in deletePlan:', error);
      
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
        message: 'Failed to delete plan'
      });
    }
  }

  async getActivePlans(req, res) {
    try {
      const plans = await planService.getActivePlans();
      
      res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('Error in getActivePlans:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve active plans'
      });
    }
  }
}

module.exports = new PlanController(); 