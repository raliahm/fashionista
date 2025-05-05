
  
function renderProduct() {
    const container = document.getElementById('detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
   
    const product = products.find(p => p.name === productName); 
  
    if (product) {
        const card = document.createElement('div');
    card.className = 'product-detail'; 
  
    card.innerHTML = `
      <div class="product-details">
        <img src="${product.img}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p><strong>Price:</strong> ${product.price}</p>
        <p>${product.description}</p>
        <a href="products.html">← Back to Products</a>
      </div>
    `;
    const button = document.createElement('button');
    button.classList.add('add-to-cart-btn');  // Add a class for styling
    button.textContent = 'Add to Cart';
    button.addEventListener('click', () => addToCart(product));  // Add to Cart
    card.appendChild(button); 



    container.appendChild(card);

    }
  

    
  }
 

  renderProduct();