let cartId = localStorage.getItem("cartId");
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
    
    const tP = await fetch(`http://localhost:3000/api/cart/total/${cartId}`);
    console.log(tP);
    const tQ = await fetch(`http://localhost:3000/api/cart/total-quantity/${cartId}`);
    const totalQuantity = await tQ.json();
    const totalPrice = await tP.json();

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
        <p>$${product.ProductPrice}</p>
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
      <div class="cart-total"><h3>Total: $${totalPrice} <br>(${totalQuantity} items)</h3></div>
      <div class="cart-checkout"><button onclick="goToCheckout()">Checkout</button></div>
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
  initializeCart();
}

function goToCheckout() {
  window.location.href = "/shopping-cart"; // Redirect to checkout page
}


async function checkout(formData) {

  if (!cartId) {
    alert("Cart ID not found");
    return false;
  }
  const tP = await fetch(`http://localhost:3000/api/cart/total/${cartId}`);
  console.log(tP);
  const tQ = await fetch(`http://localhost:3000/api/cart/total-quantity/${cartId}`);
  const totalQuantity = await tQ.json();
  const totalPrice = await tP.json();
  
  if (!formData.name || !formData.address || !formData.card || !formData.cvv) {
    alert("Please fill in all fields.");
    return { success: false };
  }
  if (formData.card.length < 16) {
    alert("Card number must be 16 digits long.");
    return { success: false };
  }
  if (formData.cvv.length < 3) {
    alert("CVV must be 3 digits long.");
    return { success: false };
  }
  if (formData.address.length < 5) {
    alert("Address must be at least 5 characters long.");
    return { success: false };

  }

  const userId = localStorage.getItem("userId") || 1;
  if (!cartId) {
    alert("Cart ID not found");
    return { success: false };
  }
  const items = await fetch(`http://localhost:3000/api/cart/${cartId}`);
  if (!items.ok) {
    alert("Failed to fetch cart items.");
    return { success: false };
  }
  console.log(items);
  const itemsData = await items.json();
  console.log(itemsData);
  const payload = {
    cartId,
    userId,
    totalPrice,
    totalQuantity,
    shippingAddress: formData.address,
    cardNumber: formData.card,
    cardCV: formData.cvv,
    cartStatus: 'purchased',
    items: itemsData
  };

  try {
    await fetch(`http://localhost:3000/api/checkout/cartId`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    clearCart('purchased'); // Clear the cart after successful checkout
    return { success: true, items: itemsData };
  } catch (error) {
    console.error("Checkout failed:", error);
    alert("Checkout failed. Please try again.");
    return { success: false };

  }
}

//function to clear the cart on the front end
// This function will be called when the cart is cleared on the backend
// and will update the front-end cart display accordingly.  
function clearingFrontEndCart() {
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    cartContainer.innerHTML = "<h2>Your cart is empty.</h2>";
  }
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
    button.addEventListener('click', async function () {
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

            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required><br><br>

            <button type="submit">Submit Order</button>
        </form>
      `;

      const form = document.getElementById("checkout-form");
      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
          name: this.name.value,
          address: this.address.value,
          card: this.card.value,
          cvv: this.cvv.value
        };

        const result = await checkout(formData); // Wait for checkout
        const { items } = result;
        const receiptItems = items; // Format items for receipt
        if (!result.success) return; // Stop if checkout failed

        alert("Order submitted! Thanks, " + formData.name + " 🎉");
        clearingFrontEndCart();
        
        // Generate downloadable receipt
        const receiptContent = `
Order Confirmation

Customer Name: ${formData.name}
Shipping Address: ${formData.address}

Items Ordered: 
${receiptItems}

Payment Method: **** **** **** ${formData.card.slice(-4)}

Thank you for shopping with us!
        `;

        const blob = new Blob([receiptContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "order_receipt.txt";
        link.click();
        URL.revokeObjectURL(url);
      });
    });
  });
});
