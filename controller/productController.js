const productModel = require('../models/productModel'); 

exports.getCategories = (req, res) => {
    productModel.getCategories((err, categories) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(categories);
    });
};

exports.getAllProducts = (req, res) => {
    productModel.getAllProducts((err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.getProductsByCategory = (req, res) => {
    const categoryId = req.params.CategoryID;
    productModel.getProductsByCategory(categoryId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    productModel.getProductById(productId, (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(product);
    });
};

exports.addProduct = (req, res) => {
    const newProduct = req.body;
    productModel.addProduct(newProduct, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    productModel.updateProduct(productId, updatedProduct, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    productModel.deleteProduct(productId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.addProductToCart = (req, res) => {
    const { cartId, productId, quantity } = req.body;
    productModel.addProductToCart(cartId, productId, quantity, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
};

exports.getProductsInCart = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getProductsInCart(cartId, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(items);
    });
};

exports.removeProductFromCart = (req, res) => {
    const { cartId, productId } = req.params;
    productModel.removeProductFromCart(cartId, productId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.clearCart = (req, res) => {
    console.log("clear cart called");
    console.log(req.params.cartId);
    console.log(req.params.CartStatus);
    const cartId = req.params.cartId;
    const cartStatus = req.params.CartStatus;
    productModel.clearCart(cartId, cartStatus, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.getCartProductsWithDetails = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartProductsWithDetails(cartId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.getCartProductsWithDetailsAndTotal = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartProductsWithDetailsAndTotal(cartId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.updateProductQuantityInCart = (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    productModel.updateProductQuantityInCart(cartId, productId, quantity, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.addCheckoutRecord = (req, res) => {
    const { cartId, userId, totalPrice, totalQuantity, shippingAddress, cardNumber, cardCV, items  } = req.body;
    console.log(items);
    productModel.addCheckoutRecord(cartId, userId, totalPrice, totalQuantity, shippingAddress, cardNumber, cardCV, items, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
};

exports.searchProductsByKeyword = (req, res) => {
    const keyword = req.params.keyword;
    productModel.searchProductsByKeyword(keyword, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.createCart = (req, res) => {
    const { UserID } = req.body; // userId is passed in the request body

    productModel.createCart(UserID, (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(cart);
    });
};
exports.getCartTotal = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartTotal(cartId, (err, total) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(total);
    });
};

exports.getCartId = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartId(cartId, (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(cart);
    });
};
exports.getCartProducts = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartProducts(cartId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};
exports.getCartProductDetails = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartProductDetails(cartId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};
exports.getCartProductDetailsAndTotal = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartProductDetailsAndTotal(cartId, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};


exports.getCartTotal = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartTotal(cartId, (err, total) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(total);
    });
};

exports.CartByUserId = (req, res) => {
    const userId = req.params.userId;
    productModel.getCartByUserId(userId, (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(cart);
    });
};

exports.filterProductsByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.query;
    productModel.filterProductsByPrice(minPrice, maxPrice, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(products);
    });
};

exports.getCartTotalQuantity = (req, res) => {
    const cartId = req.params.cartId;
    productModel.getCartTotalQuantity(cartId, (err, totalQuantity) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(totalQuantity);
    });
};

exports.getOrderById = (req, res) => {
    const orderId = req.params.orderId;
    productModel.getOrderById(orderId, (err, order) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(order);
    });
};
exports.getAllOrders = (req, res) => {
    productModel.getAllOrders((err, orders) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(orders);
    });
};
exports.getOrdersByUserId = (req, res) => {
    const userId = req.params.userId;
    productModel.getOrdersByUserId(userId, (err, orders) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(orders);
    });
};

exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    productModel.updateOrderStatus(orderId, status, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
}
exports.deleteOrder = (req, res) => {
    const orderId = req.params.orderId;
    productModel.deleteOrder(orderId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};