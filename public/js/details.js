function renderProduct() {
  const container = document.getElementById('detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const productID = urlParams.get('id');
  console.log(productID);
  fetch(`http://localhost:3000/api/product/${productID}`)
    .then(response => response.json())
    .then(product => {
      if (!product) {
        container.innerHTML = '<h2>Product not found</h2>';
        return;
      }

      const card = document.createElement('div');
      card.className = 'product-detail';

      card.innerHTML = `
        <div class="product-details">
          <img src="${product.ProductImageURL}" alt="${product.ProductName}" />
          <h2>${product.ProductName}</h2>
          <p><strong>Price:</strong> $${product.ProductPrice}</p>
          <p>${product.ProductDescription}</p>
          <a href="/products">← Back to Products</a>
        </div>
      `;

      const button = document.createElement('button');
      button.classList.add('add-to-cart-btn');
      button.textContent = 'Add to Cart';
      button.addEventListener('click', () => addToCart(product));

      card.appendChild(button);
      container.appendChild(card);
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      container.innerHTML = '<h2>Error loading product.</h2>';
    });
}

renderProduct();



