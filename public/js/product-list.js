document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const activeContainer = document.getElementById('active-products');
        activeContainer.innerHTML = ''; // Clear previous content

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <h3>${product.ProductName}</h3>
                <p><strong>Price:</strong> $${product.Price || 'N/A'}</p>
                <p><strong>Category:</strong> ${product.Category?.CategoryName || 'None'}</p>
                <p><strong>Description:</strong> ${product.Description || 'No description'}</p>
            `;

            activeContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
