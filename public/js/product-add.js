document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = document.getElementById("add-form");
    const formData = new FormData(form);
  
    try {
      const response = await fetch("http://localhost:3000/api/products/add", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to add product");
  
      alert("Product added successfully!");
      window.location.href = "/product-listing";
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  });
  