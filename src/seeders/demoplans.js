'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const plans = [
      {
        id: uuidv4(),
        name: 'Basic Plan',
        description: 'Perfect for individuals and small teams getting started',
        price: 9.99,
        currency: 'USD',
        duration: 30,
        features: [
          'Up to 5 users',
          '10GB storage',
          'Basic support',
          '1,000 API calls/month'
        ],
        isActive: true,
        maxUsers: 5,
        maxStorage: 10737418240, // 10GB in bytes
        apiCallsLimit: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Professional Plan',
        description: 'Ideal for growing businesses and teams',
        price: 29.99,
        currency: 'USD',
        duration: 30,
        features: [
          'Up to 25 users',
          '100GB storage',
          'Priority support',
          '10,000 API calls/month',
          'Advanced analytics',
          'Custom integrations'
        ],
        isActive: true,
        maxUsers: 25,
        maxStorage: 107374182400, // 100GB in bytes
        apiCallsLimit: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Enterprise Plan',
        description: 'For large organizations with advanced needs',
        price: 99.99,
        currency: 'USD',
        duration: 30,
        features: [
          'Unlimited users',
          '1TB storage',
          '24/7 dedicated support',
          '100,000 API calls/month',
          'Advanced analytics',
          'Custom integrations',
          'SSO integration',
          'Advanced security features',
          'Custom reporting'
        ],
        isActive: true,
        maxUsers: null, // Unlimited
        maxStorage: 1099511627776, // 1TB in bytes
        apiCallsLimit: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Annual Basic',
        description: 'Basic plan with annual billing (2 months free)',
        price: 99.99,
        currency: 'USD',
        duration: 365,
        features: [
          'Up to 5 users',
          '10GB storage',
          'Basic support',
          '1,000 API calls/month',
          '2 months free'
        ],
        isActive: true,
        maxUsers: 5,
        maxStorage: 10737418240, // 10GB in bytes
        apiCallsLimit: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Free Trial',
        description: '14-day free trial with full access',
        price: 0.00,
        currency: 'USD',
        duration: 14,
        features: [
          'Up to 3 users',
          '5GB storage',
          'Email support',
          '500 API calls/month',
          'All features included'
        ],
        isActive: true,
        maxUsers: 3,
        maxStorage: 5368709120, // 5GB in bytes
        apiCallsLimit: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('plans', plans);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  }
}; 