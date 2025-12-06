module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
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
        len: [1, 200]
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
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cartItems',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};

