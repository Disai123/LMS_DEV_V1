const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define('Plan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'INR'
        },
        features: {
            type: DataTypes.JSON,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        tier_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '0=free, 1=basic, 2=pro'
        }
    }, {
        tableName: 'plans',
        timestamps: true,
        underscored: true
    });

    Plan.associate = (models) => {
        Plan.hasMany(models.Subscription, {
            foreignKey: 'plan_id',
            as: 'subscriptions'
        });
        Plan.hasMany(models.Coupon, {
            foreignKey: 'plan_id',
            as: 'coupons'
        });
    };

    return Plan;
};
