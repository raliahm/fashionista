const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    UserPassword: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    LastName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    UserType: {
        type: DataTypes.ENUM('admin', 'shopper'),
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
});

module.exports = User;