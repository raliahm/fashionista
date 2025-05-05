// Initialize an empty cart
let cart = [];
const storedCart = localStorage.getItem("cart");
if (storedCart) {
  cart = JSON.parse(storedCart);
}

// Function to add items to the cart
function addToCart(product) {
     // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity += 1; // Increase quantity by 1
  } else {
    // Add the product with a starting quantity of 1
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
  updateCartDisplay();
}


// Function to display the cart contents
function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";  // Clear previous cart

  if (cart.length === 0) {
    cartContainer.innerHTML = "<h2>Your cart is empty.</h2>";
    return;
  }

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
     <div class="product-card">
                <img src="${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
               <p>
            <button class="increase" data-index="${index}">+</button> ${item.quantity} <button class="decrease" data-index="${index}">-</button>
            </p>
            </div>
    `;
    cartContainer.appendChild(itemElement);
  });
    totalItems = cart.reduce((sum,item) => sum + item.quantity, 0);

    //show cart count
    const countElement = document.createElement('div');
    countElement.className = 'cart-count';
    countElement.innerHTML = `<h3>Total Cart Items:${totalItems} </h3>`;
    cartContainer.appendChild(countElement);
      // Calculate total once
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price.slice(1)) * item.quantity, 0);
    
    // Create and display the total element
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    cartContainer.appendChild(totalElement);

    const checkout = document.createElement('div');
    checkout.className = 'cart-checkout';
    checkout.innerHTML = `<button id='checkout'>Checkout</button>`;
    cartContainer.appendChild(checkout);

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", () => {
          const index = button.getAttribute("data-index");
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1); // remove item
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
        });
      });
    
      document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", () => {
          const index = button.getAttribute("data-index");
          cart[index].quantity += 1;
          localStorage.setItem("cart", JSON.stringify(cart));

          updateCartDisplay();
        });
      });
      if (!window.location.href.includes("shopping-cart.html")) {
        document.querySelectorAll(".cart-checkout").forEach(button => {
          button.addEventListener("click", () => {
            window.location.href = "shopping-cart.html";
          }); 
        });
      }


}






  

  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
  
    if (path.includes("shopping-cart.html")) {
      // This runs only on shopping cart page
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
  
      updateCartDisplay();
    } else {
        document.getElementById("cart-toggle").addEventListener('click', function () {
            const container = document.querySelector(".container");
            const cartContainer = document.getElementById("cart-container");
            const headerContainer = document.querySelector(".cart-header-container");
        
            if (cartContainer && headerContainer) {
              const isVisible = cartContainer.style.display === "none" || cartContainer.style.display === "";
              cartContainer.style.display = isVisible ? "block" : "none";
              headerContainer.classList.toggle("cart-open");
            }
          });
        
          updateCartDisplay(); // Only run after DOM is ready
    }
});
