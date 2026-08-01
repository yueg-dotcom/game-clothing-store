// NOVA LOOK 独立游戏穿搭商品页交互
function hairArt(primary, accent, longHair = false) {
  return `
    <svg viewBox="0 0 260 210" aria-hidden="true">
      <g transform="rotate(-4 130 105)">
        <ellipse cx="130" cy="184" rx="70" ry="12" fill="#392668" opacity=".14"/>
        ${longHair ? `<path d="M73 91c0-49 24-76 57-76s57 27 57 76v89H73V91Z" fill="${primary}"/>` : ""}
        <ellipse cx="130" cy="104" rx="48" ry="60" fill="#f1bca5"/>
        <path d="M75 95c0-53 23-81 57-81 38 0 61 31 56 87-22-8-40-25-51-50-16 28-35 43-62 44Z" fill="${primary}"/>
        <path d="M82 86c-8 45 2 79 21 100-29-9-42-36-39-77l18-23ZM179 85c9 42 3 78-17 101 28-9 42-37 38-79l-21-22Z" fill="${primary}"/>
        <path d="M99 102c7-7 14-7 21 0M141 102c7-7 14-7 21 0" fill="none" stroke="#54386a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="110" cy="111" r="5" fill="${accent}"/><circle cx="151" cy="111" r="5" fill="${accent}"/>
        <path d="M119 137c8 5 15 5 23 0" fill="none" stroke="#b96e78" stroke-width="3" stroke-linecap="round"/>
        <path d="m96 42 9-24 9 24M158 38l8-21 8 21" fill="${accent}" stroke="${primary}" stroke-width="5" stroke-linejoin="round"/>
      </g>
    </svg>`;
}

function clothesArt(primary, accent, dress = false) {
  return `
    <svg viewBox="0 0 260 210" aria-hidden="true">
      <g transform="rotate(4 130 108)">
        <ellipse cx="130" cy="188" rx="79" ry="12" fill="#392668" opacity=".14"/>
        <path d="M94 25c8 13 20 19 36 19s28-6 36-19l30 24-20 29-16-11v${dress ? "52l25 63H75l25-63V67L84 78 64 49l30-24Z" : "109h-26V67L84 78 64 49l30-24Z"}" fill="${primary}"/>
        <path d="M95 26c7 21 18 31 35 31s29-10 36-31" fill="none" stroke="${accent}" stroke-width="7"/>
        <path d="M130 56v${dress ? 101 : 72}" stroke="${accent}" stroke-width="5" opacity=".8"/>
        <path d="M101 91h58M93 124h74" fill="none" stroke="${accent}" stroke-width="4" opacity=".55"/>
        <circle cx="130" cy="78" r="7" fill="${accent}"/>
        ${dress ? `<path d="M88 142h84" stroke="${accent}" stroke-width="7"/>` : `<path d="M104 134v46M156 134v46" stroke="${primary}" stroke-width="24" stroke-linecap="round"/>`}
      </g>
    </svg>`;
}

function accessoryArt(primary, accent, crown = false) {
  return `
    <svg viewBox="0 0 260 210" aria-hidden="true">
      <g transform="rotate(-6 130 105)">
        <ellipse cx="130" cy="181" rx="70" ry="12" fill="#392668" opacity=".14"/>
        ${crown
          ? `<path d="M60 126 46 50l43 32 41-61 41 61 43-32-14 76H60Z" fill="${primary}" stroke="white" stroke-width="8"/><circle cx="89" cy="91" r="8" fill="${accent}"/><circle cx="130" cy="62" r="9" fill="${accent}"/><circle cx="171" cy="91" r="8" fill="${accent}"/>`
          : `<circle cx="130" cy="88" r="57" fill="none" stroke="${primary}" stroke-width="10"/><path d="m130 59 10 23 25 6-19 17 4 26-20-13-20 13 4-26-19-17 25-6 10-23Z" fill="${accent}" stroke="white" stroke-width="5"/><path d="M79 136 57 174M181 136l22 38" stroke="${primary}" stroke-width="9" stroke-linecap="round"/><circle cx="52" cy="181" r="12" fill="${accent}"/><circle cx="208" cy="181" r="12" fill="${accent}"/>`}
      </g>
    </svg>`;
}

function eyesArt(primary, accent, star = false) {
  return `
    <svg viewBox="0 0 260 210" aria-hidden="true">
      <g transform="rotate(3 130 105)">
        <ellipse cx="130" cy="178" rx="82" ry="12" fill="#392668" opacity=".12"/>
        <path d="M24 104c28-38 62-54 106-54s78 16 106 54c-28 38-62 54-106 54S52 142 24 104Z" fill="white" stroke="#352858" stroke-width="6"/>
        <circle cx="130" cy="104" r="51" fill="${primary}"/>
        <circle cx="130" cy="104" r="34" fill="${accent}" opacity=".75"/>
        <circle cx="130" cy="104" r="18" fill="#241a40"/>
        ${star ? `<path d="m130 58 10 28 29 7-23 18 3 30-19-16-19 16 3-30-23-18 29-7 10-28Z" fill="white" opacity=".55"/>` : `<path d="M94 78c12-15 27-21 44-20" fill="none" stroke="white" stroke-width="9" stroke-linecap="round" opacity=".55"/>`}
        <circle cx="151" cy="82" r="8" fill="white" opacity=".8"/>
      </g>
    </svg>`;
}

function productArt(product) {
  if (product.image) {
    return `<img class="uploaded-product-image" src="${product.image}" alt="${product.name}" />`;
  }

  const visual = product.visual || {};
  const primary = visual.primary || "#7650dc";
  const accent = visual.accent || "#c7f45b";
  if (visual.type === "hair") return hairArt(primary, accent, visual.variant === "long");
  if (visual.type === "accessory") return accessoryArt(primary, accent, visual.variant === "crown");
  if (visual.type === "eyes") return eyesArt(primary, accent, visual.variant === "star");
  return clothesArt(primary, accent, visual.variant === "dress");
}

function hydrateCatalog(items) {
  return items.map((product) => ({ ...product, art: productArt(product) }));
}

let products = [];
let catalogRefreshTimer = null;

const state = {
  category: "全部",
  gender: "全部",
  search: "",
  sort: "featured",
  cart: [],
};

const elements = {
  grid: document.querySelector("#productGrid"),
  resultText: document.querySelector("#resultText"),
  tabs: document.querySelector("#categoryTabs"),
  genderTabs: document.querySelector("#genderTabs"),
  search: document.querySelector("#productSearch"),
  sort: document.querySelector("#sortSelect"),
  cartButton: document.querySelector("#cartButton"),
  cartCount: document.querySelector("#cartCount"),
  drawerCount: document.querySelector("#drawerCount"),
  drawer: document.querySelector("#cartDrawer"),
  drawerMask: document.querySelector("#drawerMask"),
  closeCart: document.querySelector("#closeCart"),
  cartItems: document.querySelector("#cartItems"),
  cartTotal: document.querySelector("#cartTotal"),
  drawerFooter: document.querySelector("#drawerFooter"),
  checkout: document.querySelector("#checkoutButton"),
  toast: document.querySelector("#toast"),
  menuButton: document.querySelector("#menuButton"),
  mobileNav: document.querySelector("#mobileNav"),
};

function filteredProducts() {
  const keyword = state.search.trim().toLocaleLowerCase("zh-CN");
  const filtered = products.filter((product) => {
    if (product.status === "offline") return false;
    const matchesCategory = state.category === "全部" || product.category === state.category;
    const matchesGender = state.gender === "全部" || product.gender === state.gender;
    const searchTarget = `${product.name}${product.category}${product.gender}${product.description}`.toLocaleLowerCase("zh-CN");
    return matchesCategory && matchesGender && (!keyword || searchTarget.includes(keyword));
  });

  return [...filtered].sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "stock-desc") return b.stock - a.stock;
    return a.id - b.id;
  });
}

function productCard(product, index) {
  const badgeClass = product.badge === "NEW" ? "is-new" : "";
  const stockClass = product.stock <= 10 ? "is-low" : "";
  const stockText = product.stock === 0 ? "已售罄" : product.stock <= 10 ? `仅剩 ${product.stock} 件` : `库存 ${product.stock} 件`;
  const genderText = product.gender === "通用" ? "男女通用" : `${product.gender}适用`;
  const genderClass = product.gender === "通用" ? "is-unisex" : product.gender === "女性" ? "is-female" : "is-male";
  const originalPrice = product.originalPrice ? `<del>¥${product.originalPrice}</del>` : "";

  return `
    <article class="product-card" style="animation-delay:${index * 0.045}s">
      <div class="product-visual" style="--visual-bg:${product.color}">
        ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ""}
        <span class="stock-badge ${stockClass}">${stockText}</span>
        <div class="product-art">${product.art}</div>
      </div>
      <div class="product-info">
        <div class="product-meta-line">
          <span class="product-category">${product.category}</span>
          <span class="product-gender ${genderClass}">${genderText}</span>
        </div>
        <h3 title="${product.name}">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <div class="price"><small>¥</small>${product.price}${originalPrice}</div>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="将 ${product.name} 加入购物车" ${product.stock === 0 ? "disabled" : ""}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"></path></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const filtered = filteredProducts();
  const categoryText = state.category === "全部" ? "全部类别" : state.category;
  const genderText = state.gender === "全部" ? "全部性别" : state.gender === "通用" ? "男女通用" : `${state.gender}适用`;
  elements.resultText.textContent = `${categoryText} · ${genderText} · 共 ${filtered.length} 件商品`;
  elements.grid.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : `
      <div class="empty-state">
        <span>⌁</span>
        <strong>没有找到相关商品</strong>
        <p>换一个关键词或分类再试试</p>
      </div>
    `;
}

function setCategory(category, shouldScroll = false) {
  state.category = category;
  document.querySelectorAll("#categoryTabs button").forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderProducts();
  if (shouldScroll) {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setGender(gender) {
  state.gender = gender;
  document.querySelectorAll("#genderTabs button").forEach((button) => {
    const active = button.dataset.gender === gender;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
}

function cartQuantity() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showToast(message) {
  elements.toast.querySelector("p").textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || product.status === "offline" || product.stock <= 0) {
    showToast("该商品当前不可购买");
    return;
  }
  const existing = state.cart.find((item) => item.id === productId);
  const currentQuantity = existing?.quantity || 0;

  if (currentQuantity >= product.stock) {
    showToast("已达到当前库存上限");
    return;
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  updateCart();
  showToast(`${product.name} 已加入购物车`);
}

function changeQuantity(productId, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  const product = products.find((productItem) => productItem.id === productId);
  if (!item || !product) return;

  const nextQuantity = item.quantity + delta;
  if (nextQuantity <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== productId);
  } else if (nextQuantity <= product.stock) {
    item.quantity = nextQuantity;
  } else {
    showToast("已达到当前库存上限");
  }
  updateCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  updateCart();
  showToast("商品已移出购物车");
}

function cartItemTemplate(item) {
  const product = products.find((productItem) => productItem.id === item.id);
  return `
    <article class="cart-item">
      <div class="cart-item-art" style="--item-bg:${product.color}">${product.art}</div>
      <div class="cart-item-info">
        <strong>${product.name}</strong>
        <small>${product.category} · ${product.gender === "通用" ? "男女通用" : `${product.gender}适用`}</small>
        <span>¥ ${product.price}</span>
        <div class="quantity-control" aria-label="${product.name} 数量">
          <button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="减少数量">−</button>
          <b>${item.quantity}</b>
          <button type="button" data-quantity="${product.id}" data-delta="1" aria-label="增加数量">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${product.id}" aria-label="移除 ${product.name}">×</button>
    </article>
  `;
}

function updateCart() {
  const quantity = cartQuantity();
  const total = state.cart.reduce((sum, item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  elements.cartCount.textContent = quantity;
  elements.drawerCount.textContent = quantity;
  elements.cartTotal.textContent = `¥ ${total.toLocaleString("zh-CN")}`;
  elements.checkout.disabled = quantity === 0;
  elements.cartItems.innerHTML = state.cart.length
    ? state.cart.map(cartItemTemplate).join("")
    : `
      <div class="empty-cart">
        <span class="empty-cart-icon">⌁</span>
        <strong>购物车还是空的</strong>
        <p>去挑一件让游戏更有趣的装备吧</p>
      </div>
    `;
}

function openCart() {
  elements.drawer.classList.add("is-open");
  elements.drawerMask.classList.add("is-open");
  elements.drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  elements.drawer.classList.remove("is-open");
  elements.drawerMask.classList.remove("is-open");
  elements.drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

elements.tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

elements.genderTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gender]");
  if (button) setGender(button.dataset.gender);
});

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => setCategory(card.dataset.category, true));
});

elements.search.addEventListener("input", () => {
  state.search = elements.search.value;
  renderProducts();
});

elements.sort.addEventListener("change", () => {
  state.sort = elements.sort.value;
  renderProducts();
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

elements.cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.delta));
  }
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

elements.cartButton.addEventListener("click", openCart);
elements.closeCart.addEventListener("click", closeCart);
elements.drawerMask.addEventListener("click", closeCart);

document.querySelector(".search-jump").addEventListener("click", () => {
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => elements.search.focus(), 450);
});

elements.checkout.addEventListener("click", () => {
  showToast("演示页面暂未接入结算功能");
});

elements.menuButton.addEventListener("click", () => {
  const isOpen = elements.mobileNav.classList.toggle("is-open");
  elements.menuButton.classList.toggle("is-open", isOpen);
  elements.menuButton.setAttribute("aria-expanded", String(isOpen));
});

elements.mobileNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  elements.mobileNav.classList.remove("is-open");
  elements.menuButton.classList.remove("is-open");
  elements.menuButton.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    elements.mobileNav.classList.remove("is-open");
    elements.menuButton.classList.remove("is-open");
    elements.menuButton.setAttribute("aria-expanded", "false");
  }
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

async function refreshCatalog(showError = false) {
  window.clearTimeout(catalogRefreshTimer);
  try {
    products = hydrateCatalog(await window.NovaCatalog.load());
  } catch (error) {
    if (showError) {
      elements.resultText.textContent = "商品加载失败";
      elements.grid.innerHTML = `
        <div class="empty-state">
          <span>!</span>
          <strong>暂时无法读取商品</strong>
          <p>请检查网络后刷新页面</p>
        </div>
      `;
    }
    return;
  }
  state.cart = state.cart.filter((cartItem) => products.some((product) => product.id === cartItem.id && product.status === "online"));
  renderProducts();
  updateCart();
  catalogRefreshTimer = window.setTimeout(() => {
    if (!document.hidden) refreshCatalog();
  }, 60000);
}

async function initializeCatalog() {
  elements.resultText.textContent = "正在读取最新商品…";
  elements.grid.innerHTML = `
    <div class="empty-state">
      <span>⌁</span>
      <strong>商品加载中</strong>
      <p>正在同步最新库存与价格</p>
    </div>
  `;
  updateCart();
  await refreshCatalog(true);
  window.NovaCatalog.subscribe(() => refreshCatalog());
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshCatalog();
});

window.addEventListener("pageshow", () => refreshCatalog());
window.addEventListener("focus", () => refreshCatalog());
window.addEventListener("online", () => refreshCatalog(true));

initializeCatalog();
