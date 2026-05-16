// ========== COMMON UTILITIES FOR STUDENT ESSENTIALS STORE ==========

// ---------- PRODUCTS DATABASE (sample) ----------
const sampleProducts = [
  {
    id: 1,
    name: "Premium Notebook",
    category: "stationary",
    price: 99,
    stock: 50,
    description: "200 pages, hardcover",
    image: "assets/notebook.png",
    seller: "seller@example.com",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    category: "gadgets",
    price: 499,
    stock: 20,
    description: "Ergonomic, 2.4GHz",
    image: "assets/wirelessMouse.png",
    seller: "seller@example.com",
  },
  {
    id: 3,
    name: "Laptop Stand",
    category: "accessories",
    price: 799,
    stock: 15,
    description: "Aluminum foldable",
    image: "assets/laptopStand.png",
    seller: "seller@example.com",
  },
  {
    id: 4,
    name: "Calculus Textbook",
    category: "study",
    price: 450,
    stock: 10,
    description: "For engineering students",
    image: "assets/calculus.png",
    seller: "seller@example.com",
  },
  {
    id: 5,
    name: "Pen Set (5 pcs)",
    category: "stationary",
    price: 49,
    stock: 100,
    description: "Smooth writing",
    image: "assets/penSet.png",
    seller: "seller@example.com",
  },
  {
    id: 6,
    name: "USB-C Hub",
    category: "gadgets",
    price: 1299,
    stock: 8,
    description: "7-in-1 adapter",
    image: "assets/usbC.png",
    seller: "seller@example.com",
  },
];
// Load products from localStorage or use sample
let products = JSON.parse(localStorage.getItem("products")) || sampleProducts;

// ========== CUSTOM EVENT FOR PRODUCT CHANGES ==========
function notifyProductsChanged() {
  window.dispatchEvent(new Event("products-changed"));
}

// Modify saveProducts() to dispatch the event
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  notifyProductsChanged();
}

// ---------- USER MANAGEMENT ----------
let users = JSON.parse(localStorage.getItem("users")) || [];

function registerUser(name, email, password, role) {
  if (users.find((u) => u.email === email)) return false;
  users.push({
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function loginUser(email, password) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  return null;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
}

function updateUserName(email, newName) {
  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex !== -1) {
    users[userIndex].name = newName;
    localStorage.setItem("users", JSON.stringify(users));
    const current = getCurrentUser();
    if (current && current.email === email) {
      current.name = newName;
      localStorage.setItem("currentUser", JSON.stringify(current));
    }
  }
}

function resetUserPassword(email, newPassword) {
  const user = users.find((u) => u.email === email);
  if (user) {
    user.password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }
  return false;
}

// ---------- CART MANAGEMENT ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId, quantity = 1) {
  // Check if user is logged in
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert("Please login to add items to cart");
    window.location.href = "pages/login.html";
    return false;
  }

  const product = products.find((p) => p.id == productId);
  if (!product) return false;
  const existing = cart.find((item) => item.id == productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCountDisplay();
  return true;
}
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id != productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCountDisplay();
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find((i) => i.id == productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCountDisplay();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCountDisplay() {
  const countElem = document.getElementById("cartCount");
  if (countElem) countElem.innerText = getCartCount();
}

function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCountDisplay();
}

// ---------- PURCHASE HISTORY (orders) ----------
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function placeOrder() {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  if (cart.length === 0) return false;
  const order = {
    id: Date.now(),
    userId: currentUser.email,
    items: [...cart],
    total: getCartTotal(),
    date: new Date().toISOString(),
    status: "delivered",
  };
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  // Reduce stock for each product (simulate)
  cart.forEach((cartItem) => {
    const prod = products.find((p) => p.id === cartItem.id);
    if (prod) {
      prod.stock -= cartItem.quantity;
    }
  });
  saveProducts();
  clearCart();
  return order;
}

function getUserOrders(email) {
  return orders.filter((o) => o.userId === email);
}

// For seller profit calculation
function getAllOrders() {
  return orders;
}

// ---------- SELLER PRODUCT MANAGEMENT ----------
function addProduct(product) {
  const newId = products.length
    ? Math.max(...products.map((p) => p.id)) + 1
    : 7;
  const newProduct = { id: newId, ...product };
  products.push(newProduct);
  saveProducts();
}

function updateProduct(productId, updatedData) {
  const index = products.findIndex((p) => p.id == productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveProducts();
  }
}

function deleteProduct(productId) {
  products = products.filter((p) => p.id != productId);
  saveProducts();
}

// ---------- UI HELPERS ----------
function renderProductGrid(category = "all") {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  let filtered = [...products];
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }
  grid.innerHTML = filtered
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" style="object-fit: contain">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">₹${product.price}</div>
        <div class="product-desc">${product.description}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");

  // Attach event listeners to Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id, 1);
      alert("Added to cart!");
    });
  });
}

function setupCategoryFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      renderProductGrid(category);
    });
  });
}

function setupSearch() {
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
    const grid = document.getElementById("productGrid");
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
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `,
        )
        .join("");
      document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(btn.dataset.id);
          addToCart(id, 1);
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

function attachLogout() {
  const logoutBtns = document.querySelectorAll(
    "#logoutBtn, #logoutBtnSidebar, #logoutFeedback, #logoutQuery, #logoutSeller",
  );
  logoutBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
        window.location.href = "../index.html";
      });
    }
  });
}

function highlightSidebarActiveLink() {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".sidebar a[href]").forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage && linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  highlightSidebarActiveLink();
});

// ------------------------------------------------------------
// INITIALIZE LOCALSTORAGE WITH SAMPLE PRODUCTS IF EMPTY
// ------------------------------------------------------------
if (
  !localStorage.getItem("products") ||
  JSON.parse(localStorage.getItem("products")).length === 0
) {
  console.log("Initializing sample products into localStorage...");
  saveProducts(); // this will store the current `products` array (which currently holds sampleProducts)
}

// ========== INITIALIZE SAMPLE DATA ==========
(function initData() {
  if (!localStorage.getItem("products")) {
    console.log("No products found in localStorage. Saving sample products...");
    saveProducts();
  } else {
    const existing = JSON.parse(localStorage.getItem("products"));
    if (existing.length === 0) {
      console.log("Products array empty. Re-initializing with samples...");
      saveProducts();
    }
  }
})();
