
# Fashionista API

Welcome to the **Fashionista API** — a RESTful service for managing and browsing fashion-related products, especially **nail products**, categories, and shopping carts.

# Start by doing: 
starting server: **npm run start**
setting up databse : **fashionista.db**
---

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### Root

- `GET /`  
  Returns a welcome message.

---

## Categories

### Get All Categories

- `GET /category`  
  Retrieves a list of product categories (e.g., Nail Polish, Nail Tools, Nail Art).

---

## Products

### Get All Products

- `GET /product/all`  
  Returns all products, including nail polishes, tools, and accessories.

### Get Products by Category

- `GET /product/category/:CategoryID`  
  Returns products for a specific category, e.g., nail polish.

### Search Products

- `GET /product/search/:keyword`  
  Returns products matching a keyword in name or description (e.g., "gel nails").

### Get Product by ID

- `GET /product/:id`  
  Returns a single product by its ID.

### Add a New Product

- `POST /product/add`  
  Adds a new product (e.g., nail lacquer).

### Update a Product

- `PUT /product/update/:id`  
  Updates an existing product (price, name, etc.).

### Delete a Product

- `DELETE /product/delete/:id`  
  Deletes a product.

### Filter Products by Price

- `GET /products/filter?minPrice=0&maxPrice=50`  
  Returns products within a price range.

---

## Cart Management

### Create a New Cart

- `POST /cart`  
  Initializes a new cart.

### Add Product to Cart

- `POST /cart/add`  
  Adds a nail product to the cart.

### Get Products in Cart

- `GET /cart/:cartId`  
  Retrieves products added to the cart.

### Remove a Product from Cart

- `DELETE /cart/delete/:cartId/:productId`  
  Removes a specific product from the cart.

### Clear Cart

- `DELETE /cart/clear/:cartId`  
  Removes all items from the cart.

### Get Cart Total

- `GET /cart/total/:cartId`  
  Returns the total cost of all products in the cart.

### Get Cart Details

- `GET /cart/details/:cartId`  
  Returns detailed info of cart items (e.g., nail polish names, images).

### Get Cart Details with Total

- `GET /cart/details-total/:cartId`  
  Returns detailed items + total cost.

### Update Product Quantity in Cart

- `PUT /cart/update/:cartId/:productId`  
  Updates the quantity of a product in the cart.

---

## Checkout

### Submit a Checkout Record

- `POST /checkout/cartId`  
  Finalizes the checkout for a cart containing nail products.

---

## Notes

- Designed especially for managing **nail-related inventory** (nail polish, nail files, brushes, etc.).
- Use this with a modern frontend like React, HTML, or Vue.

---

## Sample Category Response

```json
[
  { "CategoryID": "1", "CategoryName": "Nail Polish" },
  { "CategoryID": "2", "CategoryName": "Nail Tools" }
]
```

## Sample Product Response

```json
{
  "ProductID": "101",
  "ProductName": "Glitter Gel Nail Polish",
  "ProductPrice": 12.99,
  "CategoryID": "1",
  "ProductImageURL": "http://example.com/img/nailpolish.jpg"
}
```

