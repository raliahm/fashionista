const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    OrderID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ShippingAddress: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    CardNumber: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    CardCV: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OrderStatus: {
        type: DataTypes.ENUM('delivered', 'processing', 'shipped', 'cancelled'),
        defaultValue: 'processing'
    }
}, {
    tableName: 'Orders',
    timestamps: true,
    createdAt: 'OrderDate',
    updatedAt: false
});

module.exports = Order;
