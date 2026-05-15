// Profit Overview Page JS (Seller)
function renderProfit() {
  const profitContainer = document.getElementById("profitAmount");
  const breakdownContainer = document.getElementById("salesBreakdown");
  if (!profitContainer) return;

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "seller") {
    profitContainer.innerText = "Unauthorized";
    return;
  }

  const allOrders = getAllOrders();
  const sellerProducts = JSON.parse(localStorage.getItem("products")) || [];
  const sellerProductIds = sellerProducts.map((p) => p.id);

  let totalRevenue = 0;
  let salesBreakdownHtml = "<h3>Recent Sales</h3>";

  const relevantOrders = allOrders.filter((order) =>
    order.items.some((item) => sellerProductIds.includes(item.id))
  );

  if (relevantOrders.length === 0) {
    if (breakdownContainer)
      breakdownContainer.innerHTML = "<p>No sales yet for your products.</p>";
    profitContainer.innerText = "₹0";
    return;
  }

  relevantOrders.forEach((order) => {
    const orderTotal = order.items.reduce((sum, item) => {
      if (sellerProductIds.includes(item.id)) return sum + item.price * item.quantity;
      return sum;
    }, 0);
    totalRevenue += orderTotal;
    salesBreakdownHtml += `
      <div class="sales-item">
        <span>Order #${order.id}</span>
        <span>${new Date(order.date).toLocaleDateString()}</span>
        <span>₹${orderTotal}</span>
      </div>`;
  });

  profitContainer.innerText = `₹${totalRevenue}`;
  if (breakdownContainer) breakdownContainer.innerHTML = salesBreakdownHtml;
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "seller") {
    alert("Seller access required");
    window.location.href = "login.html";
    return;
  }
  renderProfit();
});
