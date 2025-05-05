const User = require('./user');
const Cart = require('./cart');
const CartProduct = require('./cartProduct');
const Product = require('./product');
const Order = require('./order');
const Category = require('./category');

// User Associations
User.hasMany(Cart, { foreignKey: 'UserID' });
Cart.belongsTo(User, { foreignKey: 'UserID' });

// Cart Associations
Cart.hasMany(CartProduct, { foreignKey: 'CartID' });
CartProduct.belongsTo(Cart, { foreignKey: 'CartID' });

// Product Associations
Product.hasMany(CartProduct, { foreignKey: 'ProductID' });
CartProduct.belongsTo(Product, { foreignKey: 'ProductID' });

// Order Associations
Order.belongsTo(Cart, { foreignKey: 'CartID' });
Order.belongsTo(User, { foreignKey: 'UserID' });

// Category Associations
Category.hasMany(Product, { foreignKey: 'CategoryID' });
Product.belongsTo(Category, { foreignKey: 'CategoryID' });

module.exports = { Product, Category };

