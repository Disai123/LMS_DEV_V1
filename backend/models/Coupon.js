const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_percentage: {
            type: DataTypes.INTEGER,
            defaultValue: 100,
            allowNull: false
        },
        max_uses: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        uses_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'coupons',
        timestamps: true,
        underscored: true
    });

    Coupon.associate = (models) => {
        Coupon.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan'
        });
    };

    return Coupon;
};
