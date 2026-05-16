// Dashboard JS - Buyer shopping interface + orders

let currentFilterCategory = "all";
let currentPriceRange = "all";

function renderDashboardProducts() {
  const grid = document.getElementById("dashboardProductGrid");
  if (!grid) return;

  let filtered = [...products];

  if (currentFilterCategory !== "all") {
    filtered = filtered.filter((p) => p.category === currentFilterCategory);
  }

  if (currentPriceRange !== "all") {
    if (currentPriceRange === "1000+") {
      filtered = filtered.filter((p) => p.price >= 1000);
    } else {
      const [min, max] = currentPriceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No products found in this range.</p>";
    return;
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" style="object-fit: contain ">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">₹${product.price}</div>
        <div class="product-desc">${product.description}</div>
        <button class="add-to-cart-dash" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".add-to-cart-dash").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      addToCart(id, 1);
      updateCartPreview();
      alert("Added to cart!");
    });
  });
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
      "<p>You haven’t placed any orders yet. Start shopping above!</p>";
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
      <div class="order-details">
        Total: ₹${order.total} | Items: ${order.items.length}
      </div>
      <div class="order-product-list">
        ${order.items.map((item) => `<div>• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</div>`).join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

function updateCartPreview() {
  const count = getCartCount();
  const total = getCartTotal();
  const countElem = document.getElementById("cartItemCount");
  const totalElem = document.getElementById("cartTotalPreview");
  if (countElem) countElem.innerText = count;
  if (totalElem) totalElem.innerText = total;
}

function setupDashboardSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  if (!searchInput || !searchBtn) return;
  const performSearch = () => {
    const term = searchInput.value.toLowerCase();
    const allProducts = products;
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
    const grid = document.getElementById("dashboardProductGrid");
    if (grid) {
      grid.innerHTML = filtered
        .map(
          (product) => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-price">₹${product.price}</div>
            <div class="product-desc">${product.description}</div>
            <button class="add-to-cart-dash" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `,
        )
        .join("");
      document.querySelectorAll(".add-to-cart-dash").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(btn.dataset.id);
          addToCart(id, 1);
          updateCartPreview();
          alert("Added to cart!");
        });
      });
    }
  };
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") performSearch();
  });
}

// dashboard.js – handles user greeting, cart preview, orders, logout, and filters

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
      <div class="order-details">
        Total: ₹${order.total} | Items: ${order.items.length}
      </div>
      <div class="order-product-list">
        ${order.items
          .map(
            (item) =>
              `<div>• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</div>`,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

// Make updateCartPreview available globally for React
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
  renderDashboardProducts();
  renderMyOrders();
  setupDashboardFilters();
  setupDashboardSearch();
  attachLogout();
});
