const express = require('express');
const router = express.Router();
const controller = require('../controller/productController');

router.get('/', (req, res) => {
    res.send('Welcome to the Fashionista API!');
  });
router.get('/category', controller.getCategories);
router.get('/product/all', controller.getAllProducts);
router.get('/product/category/:CategoryID', controller.getProductsByCategory);
router.get('/products/filter', controller.filterProductsByPrice);
router.get('/product/:id', controller.getProductById);
router.post('/product/add', controller.addProduct);
router.put('/product/update/:id', controller.updateProduct);
router.delete('/product/delete/:id', controller.deleteProduct);


router.get('/product/search/:keyword', controller.searchProductsByKeyword);
router.delete('/cart/clear/:cartId/:CartStatus', controller.clearCart);
router.post('/cart', controller.createCart);
router.post('/cart/add', controller.addProductToCart);
router.get('/cart/:cartId', controller.getProductsInCart);
router.delete('/cart/delete/:cartId/:productId', controller.removeProductFromCart);
router.get('/cart/total/:cartId', controller.getCartTotal);
router.get('/cart/total-quantity/:cartId', controller.getCartTotalQuantity);
router.get('/cart/details/:cartId', controller.getCartProductsWithDetails);
router.get('/cart/details-total/:cartId', controller.getCartProductsWithDetailsAndTotal);
router.put('/cart/update/:cartId/:productId', controller.updateProductQuantityInCart);

router.post('/checkout/cartId', controller.addCheckoutRecord);

module.exports = router;
