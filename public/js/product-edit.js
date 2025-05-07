  
  document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) {
      alert("Product ID missing from URL.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/product/${productId}`);
      if (!res.ok) throw new Error("Product not found.");
      const product = await res.json();

      document.getElementById("product-id").value = product.ProductID || "";
      document.getElementById("product-name").value = product.ProductName || "";
      document.getElementById("product-description").value = product.ProductDescription || "";
      document.getElementById("product-category").value = product.CategoryID || "";
      document.getElementById("product-image").value = product.ProductImageURL || "";
      document.getElementById("product-price").value = product.ProductPrice || "";
    } catch (err) {
      console.error("Error loading product:", err);
      alert("Failed to load product data.");
    }
  });

  document.getElementById("edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = {
      ProductID: document.getElementById("product-id").value,
      ProductName: document.getElementById("product-name").value,
      ProductDescription: document.getElementById("product-description").value,
      CategoryID: document.getElementById("product-category").value,
      ProductImageURL: document.getElementById("product-image").value,
      ProductPrice: parseFloat(document.getElementById("product-price").value),
    };

    try {
      const res = await fetch(`http://localhost:3000/api/product/update/${product.ProductID}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("Product updated successfully!");
      window.location.href = "/product-listing";
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product.");
    }
  });

  document.getElementById('delete-button').addEventListener('click', function () {
    const productId = document.getElementById('product-id').value;
    if (confirm(`Are you sure you want to delete product ID ${productId}?`)) {
      fetch(`/api/product/delete/${productId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          alert('Product deleted successfully');
          window.location.href = '/product-listing';
        } else {
          alert('Error deleting product');
        }
      });
    }
  });
  