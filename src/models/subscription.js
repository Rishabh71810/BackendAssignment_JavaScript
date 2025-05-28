module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nextBillingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['planId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['endDate']
      },
      {
        unique: true,
        fields: ['userId', 'status'],
        where: {
          status: 'ACTIVE'
        },
        name: 'unique_active_subscription_per_user'
      }
    ],
    hooks: {
      beforeCreate: (subscription) => {
        if (!subscription.endDate && subscription.Plan) {
          const startDate = subscription.startDate || new Date();
          subscription.endDate = new Date(startDate.getTime() + (subscription.Plan.duration * 24 * 60 * 60 * 1000));
        }
      }
    }
  });

  Subscription.associate = function(models) {
    Subscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Subscription.belongsTo(models.Plan, {
      foreignKey: 'planId',
      as: 'plan'
    });
  };

  // Instance methods
  Subscription.prototype.isExpired = function() {
    return new Date() > this.endDate;
  };

  Subscription.prototype.isActive = function() {
    return this.status === 'ACTIVE' && !this.isExpired();
  };

  Subscription.prototype.daysUntilExpiry = function() {
    const now = new Date();
    const diffTime = this.endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  Subscription.prototype.cancel = function(reason = null) {
    this.status = 'CANCELLED';
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.autoRenew = false;
    return this.save();
  };

  return Subscription;
}; 