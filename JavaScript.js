const USD_RATE = 130; // Simple display conversion rate (1 USD = 130 KES)
let currency = "KES";
let activeCategory = "All";
let cart = [];

let products = [
  {
    id: 1,
    name: "Doum Palm Storage Basket",
    category: "Basketry",
    priceKes: 1200,
    producer: "Nadapal Women's Group • Kalobeyei Town",
    phone: "254712340101",
    image:
      "https://images.squarespace-cdn.com/content/v1/60090f5ac671406ff19f3368/1611772246544-LEOJMMMH66ATSHWJU129/image-asset.jpeg"
  },
  {
    id: 2,
    name: "Handmade Beaded Necklace",
    category: "Beadwork",
    priceKes: 850,
    producer: "Lokichar Craft Artisans • KV1",
    phone: "254718901202",
    image:
      "https://i.etsystatic.com/13804941/r/il/c10895/7821683060/il_fullxfull.7821683060_a8kw.jpg"
  },
  {
    id: 3,
    name: "Kitenge Tote Bag",
    category: "Tailoring",
    priceKes: 1100,
    producer: "Amani Tailoring Hub • KV3",
    phone: "254725673404",
    image:
      "https://mawuafrica.com/cdn/shop/files/6Dr1OOUftA_grande.jpg?v=1752139860"
  },
  {
    id: 4,
    name: "Woven Market Basket",
    category: "Basketry",
    priceKes: 1650,
    producer: "Turkana Weavers Collective • Kakuma",
    phone: "254712340101",
    image:
      "https://obakki.com/cdn/shop/files/kitui-39-1200x1200_800x.png?v=1763750518"
  },
  {
    id: 5,
    name: "Raw Wild Honey (500g Jar)",
    category: "Agri-Food",
    priceKes: 750,
    producer: "Natapar Beekeepers • Kalobeyei Host",
    phone: "254727895606",
    image:
      "https://images.squarespace-cdn.com/content/v1/60090f5ac671406ff19f3368/1611772246544-LEOJMMMH66ATSHWJU129/image-asset.jpeg"
  },
  {
    id: 6,
    name: "Beaded Kitenge Clutch",
    category: "Tailoring",
    priceKes: 1450,
    producer: "Joint Tailors & Bead Hub • KV3",
    phone: "254725673404",
    image:
      "https://mawuafrica.com/cdn/shop/files/6Dr1OOUftA_grande.jpg?v=1752139860"
  }
];

function formatPrice(kesAmount) {
  if (currency === "USD") {
    return "$" + (kesAmount / USD_RATE).toFixed(2);
  }
  return "KES " + kesAmount.toLocaleString();
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const query = document.getElementById("search-input").value.trim().toLowerCase();

  const filtered = products.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const text = `${item.name} ${item.category} ${item.producer}`.toLowerCase();
    const matchesSearch = !query || text.includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No products match your filter or search.</p>";
    return;
  }

  grid.innerHTML = filtered
    .map(
      (item) => `
      <article class="product-card">
        <div>
          <img src="${item.image}" alt="${item.name}" />
          <div class="product-body">
            <span class="product-cat">${item.category}</span>
            <h3 class="product-title">${item.name}</h3>
            <p class="product-meta">${item.producer}</p>
            <p class="product-price">${formatPrice(item.priceKes)}</p>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm" type="button" onclick="addToCart(${item.id})">
                Add to Basket
              </button>
              <a
                class="btn btn-outline btn-sm"
                href="https://wa.me/${item.phone}"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((c) => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateBasketUI();
}

function removeFromCart(productId) {
  cart = cart.filter((c) => c.id !== productId);
  updateBasketUI();
}

function updateBasketUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = totalItems;

  const list = document.getElementById("cart-items");
  if (cart.length === 0) {
    list.innerHTML = "<p>Your basket is empty.</p>";
  } else {
    list.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong><br />
            <span>${formatPrice(item.priceKes)} &times; ${item.qty}</span>
          </div>
          <button class="btn btn-outline btn-sm" type="button" onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      `
      )
      .join("");
  }

  const subtotalKes = cart.reduce((sum, item) => sum + item.priceKes * item.qty, 0);
  const shippingKes = Number(document.getElementById("shipping-select").value);
  const totalKes = subtotalKes + shippingKes;

  document.getElementById("cart-subtotal").textContent = formatPrice(subtotalKes);
  document.getElementById("cart-shipping").textContent = formatPrice(shippingKes);
  document.getElementById("cart-total").textContent = formatPrice(totalKes);
}

// Event Listeners
document.getElementById("currency-btn").addEventListener("click", () => {
  currency = currency === "KES" ? "USD" : "KES";
  document.getElementById("currency-btn").textContent = "Currency: " + currency;
  renderProducts();
  updateBasketUI();
});

document.getElementById("search-input").addEventListener("input", renderProducts);

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

document.getElementById("add-product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value;
  const priceKes = Number(document.getElementById("item-price").value);
  const producer = document.getElementById("item-producer").value.trim();
  const phone = document.getElementById("item-phone").value.trim().replace(/\D/g, "");

  if (!name || !priceKes || !producer) return;

  products.unshift({
    id: Date.now(),
    name,
    category,
    priceKes,
    producer,
    phone: phone || "254712340101",
    image:
      "https://images.squarespace-cdn.com/content/v1/60090f5ac671406ff19f3368/1611772246544-LEOJMMMH66ATSHWJU129/image-asset.jpeg"
  });

  e.target.reset();
  renderProducts();
  alert("Demo product added to catalog!");
});

const modal = document.getElementById("cart-modal");
document.getElementById("open-cart-btn").addEventListener("click", () => {
  modal.classList.remove("hidden");
  updateBasketUI();
});
document.getElementById("close-cart-btn").addEventListener("click", () => {
  modal.classList.add("hidden");
});
document.getElementById("close-cart-backdrop").addEventListener("click", () => {
  modal.classList.add("hidden");
});
document.getElementById("shipping-select").addEventListener("change", updateBasketUI);

document.getElementById("checkout-btn").addEventListener("click", () => {
  const phone = document.getElementById("mpesa-phone").value.trim() || "07XX XXX XXX";
  const statusEl = document.getElementById("order-status");
  if (cart.length === 0) {
    statusEl.textContent = "Add at least one item before testing checkout.";
    return;
  }
  statusEl.textContent = `Demo M-Pesa prompt sent to ${phone}. Order recorded for KV3 hub check.`;
});

// Initial Render
renderProducts();
updateBasketUI();