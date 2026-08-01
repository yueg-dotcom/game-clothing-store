(function () {
  const STORAGE_KEY = "nova-look-catalog-v1";
  const config = window.NOVA_CONFIG || {};
  const cloudEnabled = Boolean(
    config.supabaseUrl &&
    config.supabasePublishableKey &&
    window.supabase?.createClient,
  );
  const noStoreFetch = (input, init = {}) => fetch(input, { ...init, cache: "no-store" });
  const client = cloudEnabled
    ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
        global: { fetch: noStoreFetch },
      })
    : null;

  const defaults = [
    { id: 1, name: "星轨双马尾", category: "发型", gender: "女性", description: "渐变发梢 · 星光粒子 · 动态发丝", price: 88, originalPrice: 108, stock: 18, badge: "HOT", color: "#eee7ff", image: "", status: "online", visual: { type: "hair", primary: "#7650dc", accent: "#c7f45b", variant: "long" } },
    { id: 2, name: "雾银层次短发", category: "发型", gender: "通用", description: "中性轮廓 · 银灰挑染 · 男女通用", price: 68, originalPrice: null, stock: 42, badge: "NEW", color: "#edf2f6", image: "", status: "online", visual: { type: "hair", primary: "#77808e", accent: "#8be3cd", variant: "short" } },
    { id: 3, name: "暗夜狼尾", category: "发型", gender: "男性", description: "碎发层次 · 紫色挑染 · 轻动态", price: 76, originalPrice: 89, stock: 9, badge: "", color: "#e9e8f8", image: "", status: "online", visual: { type: "hair", primary: "#302d49", accent: "#9a76ff", variant: "long" } },
    { id: 4, name: "星轨漫游者套装", category: "套装", gender: "通用", description: "四件套 · 可拆外套 · 男女通用", price: 188, originalPrice: 228, stock: 13, badge: "编辑推荐", color: "#e9e4ff", image: "", status: "online", visual: { type: "clothes", primary: "#d8ccff", accent: "#6d4ce9", variant: "suit" } },
    { id: 5, name: "月白幻想连衣裙", category: "服装", gender: "女性", description: "月光材质 · 裙摆粒子 · 专属体型", price: 158, originalPrice: null, stock: 27, badge: "NEW", color: "#fcebf2", image: "", status: "online", visual: { type: "clothes", primary: "#f3d7e8", accent: "#a76ce2", variant: "dress" } },
    { id: 6, name: "边境机能夹克", category: "服装", gender: "男性", description: "机能剪裁 · 多层搭配 · 男性体型", price: 139, originalPrice: 169, stock: 36, badge: "", color: "#e7f0eb", image: "", status: "online", visual: { type: "clothes", primary: "#344c4d", accent: "#c7f45b", variant: "suit" } },
    { id: 7, name: "星环耳坠", category: "饰品", gender: "通用", description: "双耳适配 · 微光特效 · 男女通用", price: 49, originalPrice: 59, stock: 64, badge: "", color: "#fff0dd", image: "", status: "online", visual: { type: "accessory", primary: "#f2b84e", accent: "#7755e9", variant: "jewelry" } },
    { id: 8, name: "霓虹心跳面饰", category: "饰品", gender: "女性", description: "面部挂件 · 呼吸灯效 · 女性适配", price: 56, originalPrice: null, stock: 7, badge: "LIMITED", color: "#fbe7ed", image: "", status: "online", visual: { type: "accessory", primary: "#ee6c96", accent: "#ffd461", variant: "jewelry" } },
    { id: 9, name: "黑曜王冠", category: "饰品", gender: "男性", description: "黑曜材质 · 暗紫宝石 · 男性适配", price: 96, originalPrice: 119, stock: 11, badge: "", color: "#e9e6f2", image: "", status: "online", visual: { type: "accessory", primary: "#332747", accent: "#9a75ff", variant: "crown" } },
    { id: 10, name: "极光渐变眼瞳", category: "眼瞳", gender: "通用", description: "双色渐变 · 高光追踪 · 男女通用", price: 39, originalPrice: 49, stock: 83, badge: "HOT", color: "#e4f6f5", image: "", status: "online", visual: { type: "eyes", primary: "#6fd9cb", accent: "#7559de", variant: "soft" } },
    { id: 11, name: "蔷薇红宝石眼瞳", category: "眼瞳", gender: "女性", description: "宝石切面 · 柔光高亮 · 女性适配", price: 45, originalPrice: null, stock: 29, badge: "", color: "#fde8ed", image: "", status: "online", visual: { type: "eyes", primary: "#e86d91", accent: "#ffd4df", variant: "star" } },
    { id: 12, name: "星蚀金瞳", category: "眼瞳", gender: "男性", description: "环形纹理 · 暗金流光 · 男性适配", price: 45, originalPrice: 55, stock: 5, badge: "LIMITED", color: "#f7edda", image: "", status: "online", visual: { type: "eyes", primary: "#d5a64c", accent: "#47341f", variant: "star" } },
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalize(product, index = 0, assignId = true) {
    let category = ["发型", "服装", "套装", "饰品", "眼瞳"].includes(product.category) ? product.category : "服装";
    if (product.name === "星轨漫游者套装" && category === "服装") category = "套装";
    const gender = ["女性", "男性", "通用"].includes(product.gender) ? product.gender : "通用";
    return {
      id: product.id || (assignId ? Date.now() + index : null),
      name: String(product.name || "未命名商品").trim(),
      category,
      gender,
      description: String(product.description || "").trim(),
      price: Math.max(0, Number(product.price) || 0),
      originalPrice: product.originalPrice ? Math.max(0, Number(product.originalPrice) || 0) : null,
      stock: Math.max(0, Math.floor(Number(product.stock) || 0)),
      badge: String(product.badge || "").trim(),
      color: String(product.color || "#eee9ff"),
      image: String(product.image || ""),
      status: product.status === "offline" ? "offline" : "online",
      visual: product.visual || { type: "clothes", primary: "#d8ccff", accent: "#6d4ce9", variant: "suit" },
    };
  }

  function loadLocal() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return clone(defaults);
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return clone(defaults);
      return parsed.map(normalize);
    } catch (error) {
      return clone(defaults);
    }
  }

  function saveLocal(products) {
    const normalized = products.map(normalize);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("nova-catalog-updated", { detail: normalized }));
    return clone(normalized);
  }

  function resetLocal() {
    localStorage.removeItem(STORAGE_KEY);
    const restored = clone(defaults);
    window.dispatchEvent(new CustomEvent("nova-catalog-updated", { detail: restored }));
    return restored;
  }

  function fromRow(row) {
    return normalize({
      id: row.id,
      name: row.name,
      category: row.category,
      gender: row.gender,
      description: row.description,
      price: row.price,
      originalPrice: row.original_price,
      stock: row.stock,
      badge: row.badge,
      color: row.color,
      image: row.image_url,
      status: row.status,
      visual: row.visual,
    });
  }

  function toRow(product, keepId = true) {
    const normalized = normalize(product, 0, false);
    const row = {
      name: normalized.name,
      category: normalized.category,
      gender: normalized.gender,
      description: normalized.description,
      price: normalized.price,
      original_price: normalized.originalPrice,
      stock: normalized.stock,
      badge: normalized.badge,
      color: normalized.color,
      image_url: normalized.image,
      status: normalized.status,
      visual: normalized.visual,
    };
    if (keepId && normalized.id) row.id = normalized.id;
    return row;
  }

  function unwrap(result, fallbackMessage) {
    if (result.error) throw new Error(result.error.message || fallbackMessage);
    return result.data;
  }

  async function load(options = {}) {
    if (!cloudEnabled) return loadLocal();
    let query = client.from("products").select("*").order("id", { ascending: true });
    if (!options.includeOffline) query = query.eq("status", "online");
    const rows = unwrap(await query, "商品加载失败");
    return rows.map(fromRow);
  }

  async function saveProduct(product) {
    if (!cloudEnabled) {
      const products = loadLocal();
      const index = products.findIndex((item) => String(item.id) === String(product.id));
      const normalized = normalize(product, 0, true);
      if (index >= 0) products[index] = normalized;
      else products.unshift(normalized);
      saveLocal(products);
      return normalized;
    }

    const hasId = Boolean(product.id);
    const query = hasId
      ? client.from("products").update(toRow(product, false)).eq("id", product.id)
      : client.from("products").insert(toRow(product, false));
    const row = unwrap(await query.select("*").single(), "商品保存失败");
    return fromRow(row);
  }

  async function removeProduct(id) {
    if (!cloudEnabled) {
      return saveLocal(loadLocal().filter((item) => String(item.id) !== String(id)));
    }
    unwrap(await client.from("products").delete().eq("id", id), "商品删除失败");
    return true;
  }

  async function replaceAll(nextProducts) {
    const normalized = nextProducts.map((product, index) => normalize(product, index, true));
    if (!cloudEnabled) return saveLocal(normalized);

    unwrap(await client.from("products").delete().gt("id", 0), "旧商品清理失败");
    if (!normalized.length) return [];
    const rows = unwrap(
      await client.from("products").insert(normalized.map((product) => toRow(product, false))).select("*"),
      "商品导入失败",
    );
    return rows.map(fromRow);
  }

  async function reset() {
    if (!cloudEnabled) return resetLocal();
    return replaceAll(defaults);
  }

  async function uploadImage(blob, originalName = "product.webp") {
    if (!cloudEnabled) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("无法读取图片"));
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    const extension = originalName.toLowerCase().endsWith(".png") ? "png" : "webp";
    const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    unwrap(
      await client.storage.from("product-images").upload(path, blob, {
        cacheControl: "3600",
        contentType: blob.type || "image/webp",
        upsert: false,
      }),
      "图片上传失败",
    );
    return client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  async function signIn(email, password) {
    if (!cloudEnabled) throw new Error("云端尚未配置");
    return unwrap(await client.auth.signInWithPassword({ email, password }), "登录失败");
  }

  async function requestPasswordReset(email, redirectTo) {
    if (!cloudEnabled) throw new Error("云端尚未配置");
    unwrap(
      await client.auth.resetPasswordForEmail(email, { redirectTo }),
      "重置邮件发送失败",
    );
    return true;
  }

  async function updatePassword(password) {
    if (!cloudEnabled) throw new Error("云端尚未配置");
    unwrap(await client.auth.updateUser({ password }), "密码更新失败");
    return true;
  }

  async function signOut() {
    if (!cloudEnabled) return;
    unwrap(await client.auth.signOut(), "退出登录失败");
  }

  async function getSession() {
    if (!cloudEnabled) return null;
    return unwrap(await client.auth.getSession(), "会话读取失败").session;
  }

  async function isAdmin() {
    if (!cloudEnabled) return true;
    const allowed = unwrap(await client.rpc("is_catalog_admin"), "管理员权限检查失败");
    return allowed === true;
  }

  function isPasswordRecoveryUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return searchParams.get("type") === "recovery" || hashParams.get("type") === "recovery";
  }

  function onAuthStateChange(callback) {
    if (!cloudEnabled) return { data: { subscription: { unsubscribe() {} } } };
    return client.auth.onAuthStateChange(callback);
  }

  function subscribe(callback) {
    if (!cloudEnabled) {
      const localHandler = () => callback();
      window.addEventListener("storage", localHandler);
      window.addEventListener("nova-catalog-updated", localHandler);
      return () => {
        window.removeEventListener("storage", localHandler);
        window.removeEventListener("nova-catalog-updated", localHandler);
      };
    }

    const channel = client
      .channel(`catalog-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "catalog_updates" }, callback)
      .subscribe();
    return () => client.removeChannel(channel);
  }

  window.NovaCatalog = {
    storageKey: STORAGE_KEY,
    defaults: clone(defaults),
    mode: cloudEnabled ? "cloud" : "local",
    isCloud: cloudEnabled,
    hasLocalData: () => Boolean(localStorage.getItem(STORAGE_KEY)),
    loadLocal,
    load,
    save: replaceAll,
    saveProduct,
    removeProduct,
    replaceAll,
    reset,
    uploadImage,
    signIn,
    requestPasswordReset,
    updatePassword,
    signOut,
    getSession,
    isAdmin,
    isPasswordRecoveryUrl,
    onAuthStateChange,
    subscribe,
  };
})();
