const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Plan validation schemas
const planSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).precision(2).required(),
    currency: Joi.string().length(3).uppercase().default('USD'),
    duration: Joi.number().integer().min(1).required(),
    features: Joi.array().items(Joi.string()).default([]),
    maxUsers: Joi.number().integer().min(1).optional(),
    maxStorage: Joi.number().integer().min(0).optional(),
    apiCallsLimit: Joi.number().integer().min(0).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).precision(2).optional(),
    currency: Joi.string().length(3).uppercase().optional(),
    duration: Joi.number().integer().min(1).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
    maxUsers: Joi.number().integer().min(1).optional(),
    maxStorage: Joi.number().integer().min(0).optional(),
    apiCallsLimit: Joi.number().integer().min(0).optional()
  })
};

// Subscription validation schemas
const subscriptionSchemas = {
  create: Joi.object({
    userId: Joi.string().uuid().required(),
    planId: Joi.string().uuid().required(),
    autoRenew: Joi.boolean().default(false),
    paymentMethod: Joi.string().optional(),
    metadata: Joi.object().optional()
  }),

  update: Joi.object({
    planId: Joi.string().uuid().optional(),
    autoRenew: Joi.boolean().optional(),
    paymentMethod: Joi.string().optional(),
    metadata: Joi.object().optional()
  }),

  cancel: Joi.object({
    reason: Joi.string().max(500).optional()
  })
};

// Query parameter validation
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
  }),

  planFilters: Joi.object({
    isActive: Joi.boolean().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).uppercase().optional()
  }),

  subscriptionFilters: Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED').optional(),
    planId: Joi.string().uuid().optional()
  })
};

// UUID parameter validation
const paramSchemas = {
  uuid: Joi.object({
    id: Joi.string().uuid().required()
  }),

  userId: Joi.object({
    userId: Joi.string().uuid().required()
  })
};

module.exports = {
  userSchemas,
  planSchemas,
  subscriptionSchemas,
  querySchemas,
  paramSchemas
}; 