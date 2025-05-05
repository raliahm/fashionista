let products = [];
let categories = [];
function loadCategories() {
  fetch('http://localhost:3000/api/category')  // Fetching the data
    .then(response => response.json())  // Parsing the JSON from the response
    .then(data => {
      // Formatting the categories data
      categories = data.map(category => ({
        ...category,
      } ));
      console.log(categories); // Log the categories to check them

      if (filterOptions) {
        categories.forEach(type => {
          const label = document.createElement('label');
          label.innerHTML = `
            <input type="checkbox" value="${type.CategoryID}" class="type-filter"> ${type.CategoryName}
          `;
          filterOptions.appendChild(label);
        });

      }
      document.querySelectorAll('.type-filter').forEach(cb => {
        cb.addEventListener('change', filterProducts);
      });
  
    } )
    .catch(error => {
      // Handle errors
      console.error('Error fetching categories:', error);
    });
}
function loadProducts() {
  fetch('http://localhost:3000/api/product/all')  // Fetching the data
    .then(response => response.json())  // Parsing the JSON from the response
    .then(data => {
      // Formatting the products data
      products = data.map(product => ({
        ...product,
        img: product.img || 'default.jpg' // Default image if no image is provided
      }));

      // Log the products to check them
      console.log(products);

      // Call the render function after the products are fetched and formatted
      renderProducts(products);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching products:', error);
    });
}
loadProducts(); // Call the function to load products
loadCategories(); // Call the function to load categories


  const container = document.getElementById('product-container');
  const filterOptions = document.getElementById('filter-options');
  const searchBar = document.getElementById('search-bar');
  let currentCategory = 'all';
 



    function renderProducts(filtered) {
      container.innerHTML = "";
      if (filtered.length === 0) {
        container.innerHTML = "<h2> No products found.</h2>";
        return;
      }
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.ProductImageURL}" alt="${product.ProductName}">
          <h3>${product.ProductName}</h3>
          <p class="price">$ ${product.ProductPrice}</p>
        `;
        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.addEventListener('click', () => addToCart(product));  // Add to Cart
        card.appendChild(button);
        card.onclick = () => {
          // redirect to details page
          window.location.href = `/details?name=${encodeURIComponent(product.ProductName)}`;
        };
    
        container.appendChild(card);
      });
    }
    function goToDetails(productName) {
      window.location.href = `/details?name=${encodeURIComponent(productName)}`;
    }

    
    // Function to filter products based on selected categories and search term
    // and price range
    function filterProducts() {
      const selectedCategoryIds = [...document.querySelectorAll('.type-filter:checked')].map(cb => cb.value);
      const searchTerm = searchBar.value.toLowerCase();
      const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
      let filteredProducts = [];
    
        // Apply search term filter
        if (searchTerm) {
          fetch(`http://localhost:3000/api/product/search/${searchTerm}`)
            .then(response => response.json())
            .then(data => {
              filteredProducts = data; // Set the fetched products based on the search term
            })
            .catch(error => console.error('Error fetching products by search term:', error));
        }
      // Fetch products based on selected categories
      if (selectedCategoryIds.length > 0) {
        const categoryPromises = selectedCategoryIds.map(categoryId => {
          return fetch(`http://localhost:3000/api/product/category/${categoryId}`)
            .then(response => response.json())
            .then(data => {
              filteredProducts = filteredProducts.concat(data); // Combine all categories
            })
            .catch(error => console.error('Error fetching category products:', error));
        });
    
        // After fetching all category-based products, apply the price filter
        Promise.all(categoryPromises).then(() => {
          filterByPrice(filteredProducts, minPrice, maxPrice);
        });
      } else {
        // If no category selected, apply only price filter
        fetch('http://localhost:3000/api/product/all')
          .then(response => response.json())
          .then(data => {
            filterByPrice(data, minPrice, maxPrice);
          })
          .catch(error => console.error('Error fetching all products:', error));
      }

    

    }
    
    // Function to filter products by price using /products/filter API endpoint
    function filterByPrice(products, minPrice, maxPrice) {
      fetch(`http://localhost:3000/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .then(response => response.json())
        .then(filteredByPrice => {
          // Combine products that are filtered by price
          const allFiltered = filteredByPrice.filter(product =>
            products.some(p => p.ProductID === product.ProductID)
          );
          renderProducts(allFiltered); // Render the filtered products
        })
        .catch(error => console.error('Error filtering products by price:', error));
    }
    
    // Function to render products
    function renderProducts(filtered) {
      container.innerHTML = "";
      if (filtered.length === 0) {
        container.innerHTML = "<h2>No products found.</h2>";
        return;
      }
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.ProductImageURL}" alt="${product.ProductName}">
          <h3>${product.ProductName}</h3>
          <p class="price">$ ${product.ProductPrice}</p>
        `;
        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.addEventListener('click', () => addToCart(product));  // Add to Cart
        card.appendChild(button);
        card.onclick = () => {
          // Redirect to details page
          window.location.href = `/details?name=${encodeURIComponent(product.ProductName)}`;
        };
    
        container.appendChild(card);
      });
    }
    
    // Event listeners for filters
    document.querySelectorAll('.type-filter').forEach(cb => {
      cb.addEventListener('change', filterProducts);
    });
    
    searchBar.addEventListener('input', filterProducts);
    document.getElementById('min-price').addEventListener('input', filterProducts);
    document.getElementById('max-price').addEventListener('input', filterProducts);
    

    // Initial render
    renderProducts(products);