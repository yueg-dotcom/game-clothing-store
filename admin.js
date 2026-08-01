const elements = {
  authGate: document.querySelector("#authGate"),
  adminMain: document.querySelector("#adminMain"),
  loginForm: document.querySelector("#loginForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  loginButton: document.querySelector("#loginButton"),
  loginError: document.querySelector("#loginError"),
  logoutButton: document.querySelector("#logoutButton"),
  rows: document.querySelector("#productRows"),
  empty: document.querySelector("#emptyList"),
  search: document.querySelector("#adminSearch"),
  categoryFilter: document.querySelector("#categoryFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  filterResult: document.querySelector("#filterResult"),
  totalStat: document.querySelector("#totalStat"),
  onlineStat: document.querySelector("#onlineStat"),
  offlineStat: document.querySelector("#offlineStat"),
  lowStockStat: document.querySelector("#lowStockStat"),
  addProduct: document.querySelector("#addProduct"),
  editor: document.querySelector("#editor"),
  editorMask: document.querySelector("#editorMask"),
  closeEditor: document.querySelector("#closeEditor"),
  cancelEditor: document.querySelector("#cancelEditor"),
  editorTitle: document.querySelector("#editorTitle"),
  form: document.querySelector("#productForm"),
  editingId: document.querySelector("#editingId"),
  name: document.querySelector("#productName"),
  category: document.querySelector("#productCategory"),
  gender: document.querySelector("#productGender"),
  price: document.querySelector("#productPrice"),
  originalPrice: document.querySelector("#originalPrice"),
  stock: document.querySelector("#productStock"),
  badge: document.querySelector("#productBadge"),
  description: document.querySelector("#productDescription"),
  color: document.querySelector("#productColor"),
  colorText: document.querySelector("#colorText"),
  status: document.querySelector("#productStatus"),
  imageUpload: document.querySelector("#imageUpload"),
  imageUrl: document.querySelector("#imageUrl"),
  imagePreview: document.querySelector("#imagePreview"),
  clearImage: document.querySelector("#clearImage"),
  deleteProduct: document.querySelector("#deleteProduct"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  migrateData: document.querySelector("#migrateData"),
  resetData: document.querySelector("#resetData"),
  dismissNotice: document.querySelector("#dismissNotice"),
  notice: document.querySelector(".local-notice"),
  storageNotice: document.querySelector("#storageNotice"),
  toast: document.querySelector("#adminToast"),
};

const categoryGlyphs = { 发型: "✦", 服装: "◇", 套装: "◈", 饰品: "✧", 眼瞳: "◉" };
let products = [];
let currentImage = "";
let pendingImageBlob = null;
let previewObjectUrl = "";
let adminSubscriptionStarted = false;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message, isError = false) {
  elements.toast.querySelector("p").textContent = message;
  elements.toast.classList.toggle("error", isError);
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function genderLabel(gender) {
  if (gender === "通用") return "男女通用";
  return `${gender}适用`;
}

function genderClass(gender) {
  if (gender === "通用") return "unisex";
  return gender === "女性" ? "female" : "male";
}

function productImage(product) {
  if (product.image) return `<img src="${escapeHTML(product.image)}" alt="" />`;
  return `<span>${categoryGlyphs[product.category] || "◇"}</span>`;
}

function filteredProducts() {
  const keyword = elements.search.value.trim().toLocaleLowerCase("zh-CN");
  const category = elements.categoryFilter.value;
  const status = elements.statusFilter.value;
  return products.filter((product) => {
    const searchTarget = `${product.name}${product.description}${product.category}${product.gender}`.toLocaleLowerCase("zh-CN");
    const categoryMatch = category === "全部" || product.category === category;
    const statusMatch =
      status === "全部" ||
      product.status === status ||
      (status === "low" && product.status === "online" && product.stock <= 10);
    return (!keyword || searchTarget.includes(keyword)) && categoryMatch && statusMatch;
  });
}

function rowTemplate(product) {
  const offline = product.status === "offline";
  const lowStock = product.stock <= 10;
  return `
    <tr class="${offline ? "is-offline" : ""}">
      <td>
        <div class="product-cell">
          <div class="table-image" style="--item-color:${escapeHTML(product.color)}">${productImage(product)}</div>
          <div>
            <strong title="${escapeHTML(product.name)}">${escapeHTML(product.name)}</strong>
            <small>商品 ID：${escapeHTML(product.id)}</small>
          </div>
        </div>
      </td>
      <td><span class="category-chip">${escapeHTML(product.category)}</span></td>
      <td><span class="gender-chip ${genderClass(product.gender)}">${genderLabel(product.gender)}</span></td>
      <td>
        <div class="price-cell">
          <strong>¥ ${Number(product.price).toLocaleString("zh-CN")}</strong>
          ${product.originalPrice ? `<del>¥ ${Number(product.originalPrice).toLocaleString("zh-CN")}</del>` : ""}
        </div>
      </td>
      <td>
        <div class="stock-cell ${lowStock ? "low" : ""}">
          <strong>${product.stock}</strong>
          <small>${product.stock === 0 ? "已售罄" : lowStock ? "库存偏低" : "库存正常"}</small>
        </div>
      </td>
      <td><span class="status-chip ${product.status}">${offline ? "已下架" : "已上架"}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" data-action="toggle" data-id="${escapeHTML(product.id)}">${offline ? "上架" : "下架"}</button>
          <button class="edit-button" type="button" data-action="edit" data-id="${escapeHTML(product.id)}">编辑</button>
        </div>
      </td>
    </tr>`;
}

function render() {
  const filtered = filteredProducts();
  const online = products.filter((product) => product.status === "online").length;
  const offline = products.length - online;
  const lowStock = products.filter((product) => product.status === "online" && product.stock <= 10).length;

  elements.totalStat.textContent = products.length;
  elements.onlineStat.textContent = online;
  elements.offlineStat.textContent = offline;
  elements.lowStockStat.textContent = lowStock;
  elements.filterResult.textContent = `显示 ${filtered.length} / ${products.length} 件商品`;
  elements.rows.innerHTML = filtered.map(rowTemplate).join("");
  elements.empty.hidden = filtered.length > 0;
}

function defaultVisual(category) {
  if (category === "发型") return { type: "hair", primary: "#7650dc", accent: "#c7f45b", variant: "long" };
  if (category === "饰品") return { type: "accessory", primary: "#f2b84e", accent: "#7755e9", variant: "jewelry" };
  if (category === "眼瞳") return { type: "eyes", primary: "#6fd9cb", accent: "#7559de", variant: "soft" };
  return { type: "clothes", primary: "#d8ccff", accent: "#6d4ce9", variant: "suit" };
}

function updatePreview() {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = pendingImageBlob ? URL.createObjectURL(pendingImageBlob) : "";
  const image = previewObjectUrl || currentImage || elements.imageUrl.value.trim();
  elements.imagePreview.innerHTML = image
    ? `<img src="${escapeHTML(image)}" alt="商品图片预览" />`
    : `<span>暂无图片</span>`;
}

function openEditor(product = null) {
  elements.form.reset();
  elements.editingId.value = product ? product.id : "";
  elements.editorTitle.textContent = product ? "编辑商品" : "新增商品";
  elements.deleteProduct.hidden = !product;
  elements.name.value = product?.name || "";
  elements.category.value = product?.category || "服装";
  elements.gender.value = product?.gender || "通用";
  elements.price.value = product?.price ?? "";
  elements.originalPrice.value = product?.originalPrice ?? "";
  elements.stock.value = product?.stock ?? 1;
  elements.badge.value = product?.badge || "";
  elements.description.value = product?.description || "";
  elements.color.value = product?.color || "#eee9ff";
  elements.colorText.value = product?.color || "#eee9ff";
  elements.status.value = product?.status || "online";
  currentImage = product?.image || "";
  pendingImageBlob = null;
  elements.imageUrl.value = currentImage;
  updatePreview();
  elements.editor.classList.add("open");
  elements.editor.setAttribute("aria-hidden", "false");
  document.body.classList.add("editor-open");
  window.setTimeout(() => elements.name.focus(), 250);
}

function closeEditor() {
  elements.editor.classList.remove("open");
  elements.editor.setAttribute("aria-hidden", "true");
  document.body.classList.remove("editor-open");
  elements.imageUpload.value = "";
  pendingImageBlob = null;
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = "";
}

async function reloadProducts() {
  products = await window.NovaCatalog.load({ includeOffline: true });
  render();
}

async function saveProduct(product, message) {
  try {
    const saved = await window.NovaCatalog.saveProduct(product);
    const index = products.findIndex((item) => String(item.id) === String(saved.id));
    if (index >= 0) products[index] = saved;
    else products.unshift(saved);
    render();
    showToast(message);
    return true;
  } catch (error) {
    showToast(error.message || "保存失败，请检查网络后重试", true);
    return false;
  }
}

function productFromForm(existing) {
  const category = elements.category.value;
  const directUrl = elements.imageUrl.value.trim();
  const image = directUrl || currentImage;
  const existingVisual = existing?.visual;
  return {
    id: existing?.id || (window.NovaCatalog.isCloud ? null : Date.now()),
    name: elements.name.value.trim(),
    category,
    gender: elements.gender.value,
    description: elements.description.value.trim(),
    price: Number(elements.price.value),
    originalPrice: elements.originalPrice.value ? Number(elements.originalPrice.value) : null,
    stock: Math.max(0, Math.floor(Number(elements.stock.value))),
    badge: elements.badge.value.trim(),
    color: elements.colorText.value.trim() || elements.color.value,
    image,
    status: elements.status.value,
    visual: existingVisual?.type === defaultVisual(category).type ? existingVisual : defaultVisual(category),
  };
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("请选择图片文件"));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error("原图不能超过 12MB"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("无法读取图片"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("图片格式无法识别"));
      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("图片压缩失败")),
          "image/webp",
          0.82,
        );
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

elements.addProduct.addEventListener("click", () => openEditor());
elements.closeEditor.addEventListener("click", closeEditor);
elements.cancelEditor.addEventListener("click", closeEditor);
elements.editorMask.addEventListener("click", closeEditor);

elements.search.addEventListener("input", render);
elements.categoryFilter.addEventListener("change", render);
elements.statusFilter.addEventListener("change", render);

elements.rows.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const product = products.find((item) => String(item.id) === button.dataset.id);
  if (!product) return;

  if (button.dataset.action === "edit") {
    openEditor(product);
    return;
  }

  button.disabled = true;
  const nextProduct = { ...product, status: product.status === "online" ? "offline" : "online" };
  await saveProduct(nextProduct, nextProduct.status === "online" ? "商品已上架" : "商品已下架");
  button.disabled = false;
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;
  const submitButton = elements.form.querySelector(".save-button");
  submitButton.disabled = true;
  submitButton.textContent = "正在保存…";
  const editingId = elements.editingId.value;
  const index = products.findIndex((product) => String(product.id) === editingId);
  const existing = index >= 0 ? products[index] : null;
  try {
    const nextProduct = productFromForm(existing);
    if (pendingImageBlob) {
      submitButton.textContent = "正在上传图片…";
      nextProduct.image = await window.NovaCatalog.uploadImage(pendingImageBlob, elements.imageUpload.files?.[0]?.name);
    }
    submitButton.textContent = "正在保存…";
    if (await saveProduct(nextProduct, index >= 0 ? "商品修改已保存" : "新商品已添加")) closeEditor();
  } catch (error) {
    showToast(error.message || "保存失败，请稍后重试", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "保存商品";
  }
});

elements.deleteProduct.addEventListener("click", async () => {
  const editingId = elements.editingId.value;
  const product = products.find((item) => String(item.id) === editingId);
  if (!product) return;
  if (!window.confirm(`确定永久删除“${product.name}”吗？如果只是暂时不卖，建议使用下架。`)) return;
  elements.deleteProduct.disabled = true;
  try {
    await window.NovaCatalog.removeProduct(product.id);
    products = products.filter((item) => String(item.id) !== editingId);
    render();
    closeEditor();
    showToast("商品已删除");
  } catch (error) {
    showToast(error.message || "删除失败，请稍后重试", true);
  } finally {
    elements.deleteProduct.disabled = false;
  }
});

elements.color.addEventListener("input", () => {
  elements.colorText.value = elements.color.value;
});

elements.colorText.addEventListener("input", () => {
  if (/^#[0-9a-f]{6}$/i.test(elements.colorText.value)) elements.color.value = elements.colorText.value;
});

elements.imageUrl.addEventListener("input", () => {
  if (elements.imageUrl.value.trim()) {
    currentImage = "";
    pendingImageBlob = null;
  }
  updatePreview();
});

elements.imageUpload.addEventListener("change", async () => {
  const file = elements.imageUpload.files?.[0];
  if (!file) return;
  try {
    elements.imagePreview.innerHTML = "<span>正在压缩…</span>";
    pendingImageBlob = await compressImage(file);
    currentImage = "";
    elements.imageUrl.value = "";
    updatePreview();
    showToast("图片已压缩，保存商品时会上传");
  } catch (error) {
    updatePreview();
    showToast(error.message || "图片处理失败", true);
  }
});

elements.clearImage.addEventListener("click", () => {
  currentImage = "";
  pendingImageBlob = null;
  elements.imageUrl.value = "";
  elements.imageUpload.value = "";
  updatePreview();
});

elements.exportData.addEventListener("click", () => {
  const content = JSON.stringify(products, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `nova-look-products-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("商品备份已导出");
});

elements.importData.addEventListener("change", async () => {
  const file = elements.importData.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed)) throw new Error("备份格式不正确");
    if (!window.confirm(`将导入 ${parsed.length} 件商品并覆盖当前数据，确定继续吗？`)) return;
    products = await window.NovaCatalog.replaceAll(parsed);
    render();
    showToast("商品备份已导入");
  } catch (error) {
    showToast(error.message || "导入失败，请检查备份文件", true);
  } finally {
    elements.importData.value = "";
  }
});

elements.resetData.addEventListener("click", async () => {
  if (!window.confirm("确定恢复为最初的 12 件示例商品吗？当前修改将被覆盖。")) return;
  try {
    products = await window.NovaCatalog.reset();
    render();
    showToast("已恢复示例商品");
  } catch (error) {
    showToast(error.message || "恢复失败，请稍后重试", true);
  }
});

elements.dismissNotice.addEventListener("click", () => {
  elements.notice.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.editor.classList.contains("open")) closeEditor();
});

function showLogin(message = "") {
  elements.authGate.hidden = false;
  elements.adminMain.hidden = true;
  elements.logoutButton.hidden = true;
  elements.loginError.textContent = message;
}

async function showAdmin() {
  elements.authGate.hidden = true;
  elements.adminMain.hidden = false;
  elements.logoutButton.hidden = !window.NovaCatalog.isCloud;
  if (window.NovaCatalog.isCloud) {
    elements.storageNotice.innerHTML = "<strong>云端已连接：</strong>价格、库存和上下架状态会同步到所有访客；图片统一保存在云端。";
    elements.migrateData.hidden = !window.NovaCatalog.hasLocalData();
  }
  await reloadProducts();
  if (window.NovaCatalog.isCloud && !adminSubscriptionStarted) {
    window.NovaCatalog.subscribe(() => reloadProducts().catch(() => {}));
    adminSubscriptionStarted = true;
  }
}

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!elements.loginForm.reportValidity()) return;
  elements.loginButton.disabled = true;
  elements.loginButton.textContent = "正在登录…";
  elements.loginError.textContent = "";
  try {
    await window.NovaCatalog.signIn(elements.loginEmail.value.trim(), elements.loginPassword.value);
    if (!await window.NovaCatalog.isAdmin()) {
      await window.NovaCatalog.signOut();
      throw new Error("这个账号没有商品管理权限");
    }
    elements.loginPassword.value = "";
    await showAdmin();
  } catch (error) {
    showLogin(error.message || "登录失败，请检查邮箱和密码");
  } finally {
    elements.loginButton.disabled = false;
    elements.loginButton.textContent = "登录后台";
  }
});

elements.logoutButton.addEventListener("click", async () => {
  try {
    await window.NovaCatalog.signOut();
  } finally {
    products = [];
    render();
    showLogin();
  }
});

elements.migrateData.addEventListener("click", async () => {
  const localProducts = window.NovaCatalog.loadLocal();
  if (!window.confirm(`将用本机的 ${localProducts.length} 件商品覆盖云端商品，确定继续吗？`)) return;
  elements.migrateData.disabled = true;
  try {
    products = await window.NovaCatalog.replaceAll(localProducts);
    render();
    elements.migrateData.hidden = true;
    showToast("本机商品已迁移到云端");
  } catch (error) {
    showToast(error.message || "迁移失败，请稍后重试", true);
  } finally {
    elements.migrateData.disabled = false;
  }
});

async function initializeAdmin() {
  if (!window.NovaCatalog.isCloud) {
    await showAdmin();
    return;
  }

  try {
    const session = await window.NovaCatalog.getSession();
    if (!session) {
      showLogin();
      return;
    }
    if (!await window.NovaCatalog.isAdmin()) {
      await window.NovaCatalog.signOut();
      showLogin("当前账号没有商品管理权限");
      return;
    }
    await showAdmin();
  } catch (error) {
    showLogin(error.message || "无法连接云端，请检查网络");
  }
}

initializeAdmin();
