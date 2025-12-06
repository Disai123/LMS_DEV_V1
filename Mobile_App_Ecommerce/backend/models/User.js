module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // For OAuth users
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.CartItem, {
      foreignKey: 'user_id',
      as: 'cartItems',
      onDelete: 'CASCADE'
    });
  };

  return User;
};

