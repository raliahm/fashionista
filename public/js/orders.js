document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
  });
  
  async function fetchOrders() {
    try {
      const res = await fetch("http://localhost:3000/api/orders/all");
      const orders = await res.json();
      displayOrders(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }
  
  async function displayOrders(orders) {
    const container = document.getElementById("order-container");
    container.innerHTML = "";
  
    if (orders.length === 0) {
      container.innerHTML = "<p>No orders available.</p>";
      return;
    }
  
    await Promise.all(orders.map(async (order) => {
        const card = document.createElement("div");
        card.className = "order-card";
    
        let itemsHTML = "<li>No items</li>";
        try {
          const items = JSON.parse(order.OrderItems);
          const itemHtmlArray = await Promise.all(items.map(displayOrderItem));
          itemsHTML = `<ul class="order-items">${itemHtmlArray.join("")}</ul>`;
        } catch (err) {
          console.error("Error parsing or displaying order items", err);
        }
    
        card.innerHTML = `
          <h3>Order ID: ${order.OrderID}</h3>
          <p><strong>User ID:</strong> ${order.UserID}</p>
          <p><strong>Total Price:</strong> $${order.TotalPrice}</p>
          <p><strong>Total Quantity:</strong> ${order.TotalQuantity}</p>
          <p><strong>Shipping Address:</strong> ${order.ShippingAddress}</p>
          <p><strong>Card Number:</strong> **** **** **** ${order.CardNumber.slice(-4)}</p>
          <p><strong>Order Date:</strong> ${order.OrderDate}</p>
          <p><strong>Status:</strong></p>
          <select data-id="${order.OrderID}" class="status-select">
            <option value="pending" ${order.OrderStatus === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="shipped" ${order.OrderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.OrderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.OrderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <h4>Order Items</h4>
          ${itemsHTML}
          <button class="update-btn" data-id="${order.OrderID}">Update</button>
          <button class="delete-btn" data-id="${order.OrderID}">Delete</button>
        `;
    
        container.appendChild(card);
      }));
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          if (confirm("Are you sure you want to delete this order?")) {
            await deleteOrder(id);
          }
        });
      });
      document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const status = document.querySelector(`.status-select[data-id="${id}"]`).value;
          await updateOrderStatus(id, status);
        });
      });
  
  
 
     
  }


  
  async function updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/update/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
  
      if (!res.ok) throw new Error("Failed to update order");
      alert("Order status updated.");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Error updating order status.");
    }
  }
  
  async function deleteOrder(orderId) {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/delete/${orderId}`, {
        method: "DELETE"
      });
  
      if (!res.ok) throw new Error("Failed to delete order");
      alert("Order deleted.");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Error deleting order.");
    }
  }

  async function displayOrderItem(item) {
    try {
      const res = await fetch(`http://localhost:3000/api/product/${item.ProductID}`);
      const product = await res.json();
  
      return `
    
          <img src="${product.ProductImageURL}" alt="${product.ProductName}" class="order-product-image" />
          <div class="order-item-details">
            <p><strong>${product.ProductName}</strong></p>
            <p>Quantity: ${item.Quantity}</p>
          </div>
        
      `;
    } catch (err) {
      console.error(`Failed to load product ${item.ProductID}`, err);
      return `<li class="order-item">Product ID ${item.ProductID} (failed to load)</li>`;
    }
  }
  
 