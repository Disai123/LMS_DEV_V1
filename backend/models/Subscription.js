const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'cancelled'),
            defaultValue: 'active'
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        payment_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'subscriptions',
        timestamps: true,
        underscored: true
    });

    Subscription.associate = (models) => {
        Subscription.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Subscription.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan'
        });
    };

    return Subscription;
};
