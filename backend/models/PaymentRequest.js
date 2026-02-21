'use strict';

module.exports = (sequelize, DataTypes) => {
    const PaymentRequest = sequelize.define('PaymentRequest', {
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
        transaction_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            allowNull: false
        },
        admin_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        approved_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'payment_requests',
        timestamps: true,
        underscored: true
    });

    PaymentRequest.associate = (models) => {
        PaymentRequest.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        PaymentRequest.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan'
        });
        PaymentRequest.belongsTo(models.User, {
            foreignKey: 'approved_by',
            as: 'approvedByUser'
        });
    };

    return PaymentRequest;
};
