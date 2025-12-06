module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'order_number'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'shipping_address'
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING',
      field: 'payment_status'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'payment_method'
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tracking_number'
    }
  }, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};

