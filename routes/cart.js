router.post('/:cartId/products', async (req, res) => {
    try {
        const cartProduct = await CartProduct.create({
            CartID: req.params.cartId,
            ProductID: req.body.productId,
            Quantity: req.body.quantity
        });
        res.status(201).json(cartProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Cart with Products
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findByPk(req.params.id, {
            include: [{
                model: CartProduct,
                include: [Product]
            }]
        });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
