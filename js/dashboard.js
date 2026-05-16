// dashboard.js - only for orders and cart preview (no product grid conflict)

function updateCartPreview() {
  const count = getCartCount();
  const total = getCartTotal();
  const countElem = document.getElementById("cartItemCount");
  const totalElem = document.getElementById("cartTotalPreview");
  if (countElem) countElem.innerText = count;
  if (totalElem) totalElem.innerText = total;
}

function renderMyOrders() {
  const container = document.getElementById("myOrdersList");
  if (!container) return;
  const currentUser = getCurrentUser();
  if (!currentUser) {
    container.innerHTML = "<p>Please login to see orders.</p>";
    return;
  }
  const userOrders = getUserOrders(currentUser.email);
  if (userOrders.length === 0) {
    container.innerHTML =
      "<p>You haven't placed any orders yet. Start shopping above!</p>";
    return;
  }
  container.innerHTML = userOrders
    .map(
      (order) => `
    <div class="order-item">
      <div class="order-header">
        <span>Order #${order.id}</span>
        <span>${new Date(order.date).toLocaleDateString()}</span>
        <span class="order-status">${order.status}</span>
      </div>
      <div class="order-details">Total: ₹${order.total} | Items: ${order.items.length}</div>
      <div class="order-product-list">
        ${order.items.map((item) => `<div>• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</div>`).join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

window.updateCartPreview = updateCartPreview;

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) {
    alert("Please login to access dashboard");
    window.location.href = "login.html";
    return;
  }
  document.getElementById("userGreeting").innerText =
    `Hello, ${user.name}! Start shopping.`;
  updateCartPreview();
  renderMyOrders();
  attachLogout();
});
