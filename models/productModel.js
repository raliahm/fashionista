const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/fashionista.db')

module.exports = {
    //get all categories 
    getCategories: (cb) => {
        const sql = 'SELECT * FROM Categories';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //get all products
    getAllProducts: (cb) => {
        const sql = 'SELECT * FROM Products';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },

    //get all products by category
    getProductsByCategory: (CategoryID, cb) => {
        console.log('CategoryID:', CategoryID);
        const sql = 'SELECT * FROM Products WHERE CategoryID = ?';
        db.all(sql, [CategoryID], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                console.log(rows);
                cb(null, rows);
            }
        });
    },
    //get product by id
    getProductById: (id, cb) => {
        const sql = 'SELECT * FROM Products WHERE ProductID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, row);
            }
        });
    },
    //add product
    addProduct: (product, cb) => {
        const sql = 'INSERT INTO Products (ProductName, ProductDescription, ProductImageURL, ProductPrice, CategoryID) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [product.ProductName, product.ProductDescription, product.ProductImageURL, product.ProductPrice, product.CategoryID], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: this.lastID });
            }
        });
    },
    //update product
    updateProduct: (id, product, cb) => {
        const sql = 'UPDATE Products SET ProductName = ?, ProductDescription = ?, ProductImageURL = ?, ProductPrice = ?, CategoryID = ? WHERE ProductID = ?';
        db.run(sql, [product.ProductName, product.ProductDescription, product.ProductImageURL, product.ProductPrice, product.CategoryID, id], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: id });
            }
        });
    },
    //delete product
    deleteProduct: (id, cb) => {
        const sql = 'DELETE FROM Products WHERE ProductID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: id });
            }
        });
    },
    addProductToCart: (cartId, productId, quantity, cb) => {
        const insertSql = 'INSERT INTO CartProducts (CartID, ProductID, Quantity) VALUES (?, ?, ?)';
    
        db.run(insertSql, [cartId, productId, quantity], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                        cb(null, { id: this.lastID, cartId: this.cartId, productId: this.productId, quantity: this.quantity 

                        });
            }    
        });
    },    
    //get all products in cart
    getProductsInCart: (cartId, cb) => {
        const sql = 'SELECT * FROM CartProducts WHERE CartID = ?';
        db.all(sql, [cartId], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //remove product from cart
    removeProductFromCart: (cartId, productId, cb) => {
        const sql = 'DELETE FROM CartProducts WHERE CartID = ? AND ProductID = ?';
        db.run(sql, [cartId, productId], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: productId });
            }
        });
    },
    clearCart: (cartId, CartStatus, cb) => {
        console.log('Clearing cart with ID:', cartId);
        const deleteSql = 'DELETE FROM CartProducts WHERE CartID = ?';
        const updateSql = 'UPDATE Carts SET CartStatus = ? WHERE CartID = ?';
    
        db.run(deleteSql, [cartId], function (err) {
            if (err) {
                console.error(err.message);
                return cb(err, null);
            } else {
                const deletedRows = this.changes;
                console.log(`Deleted ${deletedRows} rows from cart ${cartId}`);
    
                // Now update cart status
                db.run(updateSql, [CartStatus, cartId], function (updateErr) {
                    if (updateErr) {
                        console.error(updateErr.message);
                        return cb(updateErr, null);
                    } else {
                        console.log(`Cart ${cartId} marked as ${CartStatus}`);
                        return cb(null, { cartId, deletedRows, newStatus: CartStatus });
                    }
                });
            }
        });
    },    
    //get all products in cart with product details
    getCartProductsWithDetails: (cartId, cb) => {
        const sql = `SELECT cp.*, p.ProductName, p.ProductDescription, p.ProductImageURL, p.ProductPrice
                     FROM CartProducts cp
                     JOIN Products p ON cp.ProductID = p.ProductID
                     WHERE cp.CartID = ?`;
        db.all(sql, [cartId], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //get all products in cart with product details and total price
    getCartProductsWithDetailsAndTotal: (cartId, cb) => {
        const sql = `SELECT cp.*, p.ProductName, p.ProductDescription, p.ProductImageURL, p.ProductPrice,
                     (cp.Quantity * p.ProductPrice) AS TotalPrice
                     FROM CartProducts cp
                     JOIN Products p ON cp.ProductID = p.ProductID
                     WHERE cp.CartID = ?`;
        db.all(sql, [cartId], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    // update product quantity in cart
    updateProductQuantityInCart: (cartId, productId, quantity, cb) => {
        const sql = 'UPDATE CartProducts SET Quantity = ? WHERE CartID = ? AND ProductID = ?';
        db.run(sql, [quantity, cartId, productId], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: productId });
            }
        });
    },
    //add checkout record
    addCheckoutRecord: (cartId, userId, totalPrice, totalQuantity, shippingAddress, cardNumber, cardCV, items, cb) => {
       
        const insertSql = `
            INSERT INTO Orders (CartID, UserID, ShippingAddress, CardNumber, CardCV, TotalQuantity, TotalPrice, OrderStatus, OrderItems)
            VALUES (?, ?, ?, ?,?, ?, ?, ?,?)
        `;
        const updateSql = 'UPDATE Carts SET CartStatus = ? WHERE CartID = ?';
        
        const itemsString = JSON.stringify(items); // Convert items to a string
        console.log('Items:', itemsString); // Log the items string for debugging
        db.run(
            insertSql,
            [cartId, userId, shippingAddress, cardNumber, cardCV, totalQuantity, totalPrice,  'processing', itemsString],
            function (err) {
                if (err) {
                    console.error(err.message);
                    cb(err, null);
                } else {
                    const orderId = this.lastID;
                    db.run(updateSql, ['purchased', cartId], function (updateErr) {
                        if (updateErr) {
                            console.error(updateErr.message);
                            cb(updateErr, null);
                        } else {
                            cb(null, { orderId, cartStatus: 'purchased' });
                        }
                    });
                }
            }
        );
    },    
    
    //search products by keyword
    searchProductsByKeyword: (keyword, cb) => {
        const sql = 'SELECT * FROM Products WHERE ProductName LIKE ? OR ProductDescription LIKE ?';
        db.all(sql, [`%${keyword}%`, `%${keyword}%`], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //create cart
    createCart: (userId, cb) => {
        const sql = `INSERT INTO Carts (UserID, CartStatus) VALUES (?, ?)`;
        db.run(sql, [userId, 'new'], function (err) {
            if (err) return cb(err, null);
            cb(null, { cartId: this.lastID, status: 'new' });
        });
    },
    //get cart total
    getCartTotal: (cartId, cb) => {
        const sql = `SELECT SUM(cp.Quantity * p.ProductPrice) AS TotalPrice
                     FROM CartProducts cp
                     JOIN Products p ON cp.ProductID = p.ProductID
                     WHERE cp.CartID = ?`;
        db.get(sql, [cartId], (err, row) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, row.TotalPrice);
            }
        });
    },
    //filter products by price range
    filterProductsByPrice: (minPrice, maxPrice, cb) => {
        const sql = 'SELECT * FROM Products WHERE ProductPrice BETWEEN ? AND ?';
        db.all(sql, [minPrice, maxPrice], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //get quantity of products in cart
    getCartTotalQuantity: (cartId, cb) => {
        const sql = 'SELECT SUM(Quantity) AS TotalQuantity FROM CartProducts WHERE CartID = ?';
        db.get(sql, [cartId], (err, row) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, row.TotalQuantity);
            }
        });
    },
    //get order by id
    getOrderById: (orderId, cb) => {
        const sql = 'SELECT * FROM Orders WHERE OrderID = ?';
        db.get(sql, [orderId], (err, row) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, row);
            }
        });
    },
    //get all orders
    getAllOrders: (cb) => {
        const sql = 'SELECT * FROM Orders';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //get orders by user id
    getOrdersByUserId: (userId, cb) => {
        const sql = 'SELECT * FROM Orders WHERE UserID = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, rows);
            }
        });
    },
    //update order status
    updateOrderStatus: (orderId, status, cb) => {
        const sql = 'UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?';
        db.run(sql, [status, orderId], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: orderId });
            }
        });
    },
    //delete order
    deleteOrder: (orderId, cb) => {
        const sql = 'DELETE FROM Orders WHERE OrderID = ?';
        db.run(sql, [orderId], function (err) {
            if (err) {
                console.error(err.message);
                cb(err, null);
            } else {
                cb(null, { id: orderId });
            }
        });
    }
}