let cartId = localStorage.getItem("cartId");

// Create cart if it doesn't exist
async function initializeCart() {
  if (!cartId) {
    const res = await fetch('http://localhost:3000/api/cart', { method: 'POST',
      body: JSON.stringify({ UserID: 1 }), // Assuming a user ID of 1 for demo purposes
      headers: { 'Content-Type': 'application/json' }
     });
    const data = await res.json();
    cartId = data.cartId;
    localStorage.setItem("cartId", cartId);
    updateCartDisplay();
  }
}

initializeCart();

async function addToCart(product) {
  if (!cartId) await initializeCart();

  try {
    // Fetch current cart items
    const res = await fetch(`http://localhost:3000/api/cart/${cartId}`);
    const cartItems = await res.json();

    // Check if product is already in the cart
    const existing = cartItems.find(p => p.ProductID === product.ProductID);

    if (existing) {
      // Update quantity if it already exists
      await updateQuantity(product.ProductID, existing.Quantity + 1);
    } else {
      // Otherwise, add the product to cart
      const payload = {
        cartId,
        productId: product.ProductID,
        quantity: 1
      };

      await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    updateCartDisplay();

  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

async function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartId || !cartContainer) return;

  try {
    // Get cart items
    const res = await fetch(`http://localhost:3000/api/cart/details/${cartId}`);
    const products = await res.json();

    // Get total price and quantity
    const totalRes = await fetch(`http://localhost:3000/api/cart/details-total/${cartId}`);
    const totals = await totalRes.json();

    const totalPrice = totals.totalPrice || 0;
    const totalQuantity = totals.totalQuantity || 0;

    cartContainer.innerHTML = "";

    if (!products.length) {
      cartContainer.innerHTML = "<h2>Your cart is empty.</h2>";
      return;
    }

    // Optional: group products by ID if needed (skip if backend handles it)
    const grouped = products.reduce((acc, p) => {
      if (!acc[p.ProductID]) {
        acc[p.ProductID] = { ...p };
      } else {
        acc[p.ProductID].Quantity += p.Quantity;
      }
      return acc;
    }, {});

    // Display cart items
    Object.values(grouped).forEach(product => {
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${product.ProductImageURL}" alt="${product.ProductName}">
        <h3>${product.ProductName}</h3>
        <p>$${product.ProductPrice.toFixed(2)}</p>
        <p>
          <button onclick="updateQuantity(${product.ProductID}, ${product.Quantity - 1})">-</button>
          ${product.Quantity}
          <button onclick="updateQuantity(${product.ProductID}, ${product.Quantity + 1})">+</button>
          <button onclick="removeFromCart(${product.ProductID})">Remove</button>
        </p>
      `;
      cartContainer.appendChild(item);
    });

    // Show totals
    cartContainer.innerHTML += `
      <div class="cart-total"><h3>Total: $${totalPrice.toFixed(2)} (${totalQuantity} items)</h3></div>
      <div class="cart-checkout"><button onclick="checkout()">Checkout</button></div>
    `;

  } catch (error) {
    console.error("Error updating cart display:", error);
    cartContainer.innerHTML = "<h2>Failed to load cart.</h2>";
  }
}



async function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    await removeFromCart(productId);
    return;
  }
  try{
    
  await fetch(`http://localhost:3000/api/cart/update/${cartId}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });

  updateCartDisplay();
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
  
}


async function removeFromCart(productId) {
  await fetch(`http://localhost:3000/api/cart/delete/${cartId}/${productId}`, {
    method: 'DELETE'
  });

  updateCartDisplay();
}


async function clearCart(cartStatus) {
  await fetch(`http://localhost:3000/api/cart/clear/${cartId}/${cartStatus}`, {
    method: 'DELETE'
  });
  localStorage.removeItem("cartId");
  cartId = null;
  updateCartDisplay();
}


async function checkout() {
  await fetch(`http://localhost:3000/api/checkout/cartId`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartId })
  });

  alert('Checkout complete!');
  clearCart('purchased'); // Optionally clear cart
}


   
document.addEventListener("DOMContentLoaded", function () {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
    updateCartDisplay();

    document.getElementById("cart-toggle").addEventListener('click', function () {
  const cartContainer = document.getElementById("cart-container");
  const headerContainer = document.querySelector(".cart-header-container");

  if (cartContainer && headerContainer) {
    const isVisible = cartContainer.style.display === "none" || cartContainer.style.display === "";
    cartContainer.style.display = isVisible ? "block" : "none";
    headerContainer.classList.toggle("cart-open");
  }
});
});


document.addEventListener('DOMContentLoaded', function () {
document.querySelectorAll(".order").forEach(button => {
  button.addEventListener('click', function () {
    const order = localStorage.getItem("cart");
    if(order == null) {
      alert("Empty cart");
    } else {
      
    
    const cCon = document.querySelector(".cart-checkout-container");
    if (!cCon) return;

    cCon.innerHTML = `
      <h2>Checkout</h2> 
      
      <form id="checkout-form">
        <label for="name">Full Name:</label>
        <input type="text" id="name" name="name" required><br><br>

        <label for="address">Shipping Address:</label>
        <input type="text" id="address" name="address" required><br><br>

        <label for="card">Card Number:</label>
        <input type="text" id="card" name="card" required><br><br>

        <input type="hidden" name="order" value='${order}'>
        <button type="submit">Submit Order</button>
      </form>
    `;
    
    document.getElementById("checkout-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = {
        name: this.name.value,
        address: this.address.value,
        card: this.card.value,
        order: order
      };
      console.log("Form submitted with:", formData);
      // Clear cart
       clearCart('purchased'); // Clear cart after order submission
      localStorage.removeItem("cart");

      // Show success alert
      alert("Order submitted! Thanks, " + formData.name + " 🎉");
      

      // Generate receipt content
      const receiptContent = `
              Order Confirmation

              Customer Name: ${formData.name}
              Shipping Address: ${formData.address}

              Items Ordered:
              ${order}

              Payment Method: **** **** **** ${formData.card.slice(-4)}

              Thank you for shopping with us!
              `;
              // Create downloadable file
      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "order_receipt.txt";
      link.click();
      URL.revokeObjectURL(url); // Clean up
    });
    }
  });

});
});
