const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartProduct = sequelize.define('CartProduct', {
    CartProductID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'CartProducts',
    timestamps: false
});

module.exports = CartProduct;
