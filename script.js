// ========== CART FUNCTIONS ==========
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart`);
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const totalEl = document.getElementById("total");
  const purchaseBtn = document.getElementById("purchase-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartItems.innerHTML = "";
    totalEl.textContent = "";
    if (purchaseBtn) purchaseBtn.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div style="flex: 1;"><img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px;"></div>
      <div style="flex: 2; text-align: center;"><strong>${item.name}</strong><br>₹${item.price}</div>
      <div style="flex: 1; text-align: right;"><button class="remove-button" onclick="removeFromCart(${index})">Remove</button></div>
    `;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.style.marginBottom = "15px";
    cartItems.appendChild(div);
    total += item.price;
  });

  totalEl.textContent = "Total: ₹" + total;
  if (purchaseBtn) purchaseBtn.style.display = "block";
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ========== CHECKOUT FLOW ==========
function showAddressForm() {
  const addressDiv = document.getElementById("address-form");
  const saved = JSON.parse(localStorage.getItem("address"));
  if (saved) {
    addressDiv.innerHTML = `
      <h2>Saved Address</h2>
      <p><strong>${saved.name}</strong><br>
      ${saved.mobile}, ${saved.flat}, ${saved.locality}, ${saved.city}, ${saved.state} - ${saved.pincode}<br>
      ${saved.country} <br> Landmark: ${saved.landmark}</p>
      <button class="add-button" onclick="showNewAddressForm()">Add New Address</button>
      <button class="add-button" onclick="placeOrder()">Deliver Here</button>
    `;
  } else {
    showNewAddressForm();
  }
}

function showNewAddressForm() {
  const addressDiv = document.getElementById("address-form");
  addressDiv.innerHTML = `
    <h2>Enter Delivery Address</h2>
    <input id="name" placeholder="Recipient Name">
    <input id="mobile" placeholder="Mobile Number">
    <input id="flat" placeholder="Flat/House Number">
    <input id="locality" placeholder="Colony/Street/Locality">
    <input id="pincode" placeholder="Pincode">
    <input id="city" placeholder="City">
    <input id="state" placeholder="State">
    <input id="country" placeholder="Country">
    <input id="landmark" placeholder="Landmark">
    <button class="add-button" onclick="saveAddress()">Save and Deliver Here</button>
  `;
}

function saveAddress() {
  const address = {
    name: document.getElementById("name").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    flat: document.getElementById("flat").value.trim(),
    locality: document.getElementById("locality").value.trim(),
    pincode: document.getElementById("pincode").value.trim(),
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    country: document.getElementById("country").value.trim(),
    landmark: document.getElementById("landmark").value.trim(),
  };

  if (Object.values(address).some(val => !val)) {
    alert("Please fill all address fields");
    return;
  }

  localStorage.setItem("address", JSON.stringify(address));
  placeOrder();
}

// ========== FINAL ORDER ==========
function placeOrder() {
  const address = JSON.parse(localStorage.getItem("address"));
  const cart = JSON.parse(localStorage.getItem("cart"));

  let order = `
New Order from Skyway Health Food:

Customer: ${address.name}
Mobile: ${address.mobile}
Address: ${address.flat}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}
Landmark: ${address.landmark}
fetch("https://formsubmit.co/ajax/stavlinsv@gmail.com", {

Payment Method: Cash on Delivery
Ordered Items:
`;

  cart.forEach(item => {
    order += `- ${item.name} (₹${item.price})\n`;
  });

  order += `\nTotal: ₹${cart.reduce((sum, item) => sum + item.price, 0)}`;

  // Simulate order
  console.log(order);
  alert("Order Placed Successfully via Cash on Delivery!");

  // Clear cart
  localStorage.removeItem("cart");
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("total").textContent = "";
  document.getElementById("cart-empty").style.display = "block";
  document.getElementById("purchase-btn").style.display = "none";
  document.getElementById("address-form").innerHTML = "";
}

// ========== INIT ==========
if (window.location.pathname.includes("cart.html")) {
  window.onload = renderCart;
}
