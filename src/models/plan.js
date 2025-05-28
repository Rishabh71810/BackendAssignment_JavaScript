module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      validate: {
        len: [3, 3]
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in days'
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    maxStorage: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Storage limit in bytes'
    },
    apiCallsLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'API calls per month'
    }
  }, {
    tableName: 'plans',
    timestamps: true,
    indexes: [
      {
        fields: ['isActive']
      },
      {
        fields: ['price']
      }
    ]
  });

  Plan.associate = function(models) {
    Plan.hasMany(models.Subscription, {
      foreignKey: 'planId',
      as: 'subscriptions'
    });
  };

  return Plan;
}; 