// Stock Management Page JS (Seller)
function renderStockTable() {
  const container = document.getElementById("stockTable");
  if (!container) return;

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "seller") {
    container.innerHTML = "<p>Unauthorized access</p>";
    return;
  }

  const allProducts = JSON.parse(localStorage.getItem("products")) || [];

  if (allProducts.length === 0) {
    container.innerHTML = '<p>No products found. <a href="seller-add-item.html">Add your first product</a></p>';
    return;
  }

  let html = `
    <table class="stock-table" style="width:100%;border-collapse:collapse;background:white;border-radius:20px;overflow:hidden">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Category</th><th>Price (₹)</th><th>Stock</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>`;

  allProducts.forEach((product) => {
    html += `
      <tr data-id="${product.id}">
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td style="text-transform:capitalize">${product.category}</td>
        <td>₹${product.price}</td>
        <td><input type="number" class="stock-input" data-id="${product.id}" value="${product.stock}" min="0" style="width:70px;padding:4px;border:1px solid #c8b39a;border-radius:8px"></td>
        <td>
          <button class="edit-stock-btn" data-id="${product.id}">Update</button>
          <button class="delete-product-btn" data-id="${product.id}">Delete</button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  document.querySelectorAll(".edit-stock-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const input = document.querySelector(`.stock-input[data-id='${id}']`);
      const newStock = parseInt(input.value);
      if (isNaN(newStock) || newStock < 0) { alert("Please enter a valid stock number"); return; }
      updateProduct(id, { stock: newStock });
      alert("Stock updated!");
      renderStockTable();
    });
  });

  document.querySelectorAll(".delete-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const product = allProducts.find(p => p.id === id);
      if (confirm(`Delete "${product ? product.name : 'this product'}" permanently?`)) {
        deleteProduct(id);
        renderStockTable();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "seller") {
    alert("Seller access required");
    window.location.href = "login.html";
    return;
  }
  attachLogout();
  renderStockTable();
});
