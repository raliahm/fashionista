document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCategories();
  });
  
  async function loadProducts() {
    try {
      const response = await fetch("http://localhost:3000/api/product/all");
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }
  
  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:3000/api/category");
      const categories = await response.json();
  
      const categorySelect = document.getElementById("category-filter");
      categorySelect.innerHTML = `<option value="">All</option>`;
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.CategoryID;
        option.textContent = category.CategoryName;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }
  
  async function filterProducts() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value;
  
    let filteredProducts = [];
  
    try {
      if (searchText) {
        // Search by name
        const res = await fetch(`http://localhost:3000/api/product/search/${searchText}`);
        filteredProducts = await res.json();
      } else if (selectedCategory) {
        // Filter by category
        const res = await fetch(`http://localhost:3000/api/product/category/${selectedCategory}`);
        filteredProducts = await res.json();
      } else {
        // Load all products
        const res = await fetch('http://localhost:3000/api/product/all');
        filteredProducts = await res.json();
      }
  
      displayProducts(filteredProducts);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  }
  
  
  function displayProducts(products) {
    const container = document.getElementById("active-products");
    container.innerHTML = "";
  
    if (products.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }
  
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-details">
            <img src="${product.ProductImageURL}" alt="${product.ProductName}" />
            <h2>${product.ProductName}</h2>
            <p><strong>Price:</strong> $${product.ProductPrice}</p>
            <p>${product.ProductDescription}</p>
            <a href="/product-edit?id=${product.ProductID}">Edit</a>
        </div>
      `;
      container.appendChild(card);
    });
  }
