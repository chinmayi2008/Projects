const STORAGE_KEY = "fitcheck_state";

const item = (id, name, category, color, formality, comfort, warmth, image = "") => ({
  id,
  name,
  category,
  color,
  formality,
  comfort,
  warmth,
  image,
});

const swipePool = [
  item("swipe_1", "White sneakers", "Shoes", "white", 2, 9, 2, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80"),
  item("swipe_2", "Black jeans", "Bottoms", "black", 4, 7, 5, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80"),
  item("swipe_3", "Grey hoodie", "Tops", "grey", 2, 10, 7, "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"),
  item("swipe_4", "White shirt", "Tops", "white", 7, 6, 4, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80"),
  item("swipe_5", "Black blazer", "Outerwear", "black", 9, 5, 5, "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80"),
  item("swipe_6", "Brown loafers", "Shoes", "brown", 7, 6, 2, "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80"),
  item("swipe_7", "Silver watch", "Accessories", "silver", 7, 9, 0, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80"),
  item("swipe_8", "Blue denim jacket", "Outerwear", "blue", 4, 7, 5, "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80"),
  item("swipe_9", "Black t-shirt", "Tops", "black", 3, 9, 3, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"),
  item("swipe_10", "Blue jeans", "Bottoms", "blue", 3, 8, 5, "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=700&q=80"),
];

const fallbackWardrobe = [
  ...swipePool,
  item("fallback_1", "Black cargos", "Bottoms", "black", 3, 8, 5),
  item("fallback_2", "Beige hoodie", "Outerwear", "beige", 2, 10, 7),
  item("fallback_3", "Black boots", "Shoes", "black", 5, 6, 3),
];

const defaults = {
  descriptions: [],
  wardrobe: [],
  uploadedImages: [],
  detectedItems: [],
  savedFits: [],
  currentGeneratedFits: [],
};

let state = loadState();
let tab = "home";
let wardrobeView = "items";
let categoryFilter = "All";
let swipeIndex = 0;
let deleteConfirm = false;
let showSwipePrompt = false;
let occasion = "birthday dinner";
let styleGoal = "casual but put together";
let weather = "mild";
let descriptionText = "";
let uploadPreview = "";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

    if (!saved) return { ...defaults };

    return {
      descriptions: saved.descriptions || [],
      wardrobe: saved.wardrobe || [],
      uploadedImages: saved.uploadedImages || [],
      detectedItems: saved.detectedItems || [],
      savedFits: saved.savedFits || [],
      currentGeneratedFits: saved.currentGeneratedFits || [],
    };
  } catch {
    return { ...defaults };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pick(items) {
  return items.length ? items[Math.floor(Math.random() * items.length)] : null;
}

function inferCategory(name) {
  const value = name.toLowerCase();

  if (/shoe|sneaker|loafer|boot/.test(value)) return "Shoes";
  if (/jean|cargo|trouser|pant|short/.test(value)) return "Bottoms";
  if (/jacket|blazer|coat|hoodie/.test(value)) return "Outerwear";
  if (/watch|belt|ring|glasses|bag/.test(value)) return "Accessories";

  return "Tops";
}

function inferColor(name) {
  return ["black", "white", "grey", "gray", "blue", "brown", "beige", "green", "red", "pink", "cream", "navy", "silver"]
    .find((color) => name.toLowerCase().includes(color)) || "unknown";
}

function itemFromDescription(name) {
  const category = inferCategory(name);

  return {
    id: uid(),
    name,
    category,
    color: inferColor(name),
    image: "",
    formality: category === "Accessories" ? 6 : category === "Shoes" ? 4 : 4,
    comfort: category === "Accessories" ? 9 : 7,
    warmth: category === "Outerwear" ? 7 : category === "Bottoms" ? 5 : category === "Tops" ? 4 : 2,
    source: "description",
    status: "owned",
  };
}

function categoryGroups(items) {
  return {
    Tops: items.filter((entry) => entry.category === "Tops"),
    Bottoms: items.filter((entry) => entry.category === "Bottoms"),
    Shoes: items.filter((entry) => entry.category === "Shoes"),
    Outerwear: items.filter((entry) => entry.category === "Outerwear"),
    Accessories: items.filter((entry) => entry.category === "Accessories"),
  };
}

function scoreFit(items) {
  const average = (key, fallback) => Math.round(
    items.reduce((sum, entry) => sum + (entry[key] || fallback), 0) / Math.max(items.length, 1)
  );

  const formality = average("formality", 4);
  const comfort = average("comfort", 7);
  const warmth = average("warmth", 4);
  const occasionValue = occasion.toLowerCase();
  const styleValue = styleGoal.toLowerCase();

  let event = 6;

  if (/dinner|birthday|presentation|family/.test(occasionValue)) {
    event = formality >= 6 ? 9 : formality >= 4 ? 7 : 4;
  }

  if (/school|mall|casual|airport|travel/.test(occasionValue)) {
    event = formality <= 5 ? 9 : 6;
  }

  const colors = new Set(items.map((entry) => entry.color).filter((color) => color !== "unknown"));
  const color = colors.size <= 3 ? 9 : colors.size > 4 ? 5 : 8;

  const weatherScore =
    weather === "hot"
      ? warmth <= 4 ? 9 : 4
      : weather === "cold"
        ? warmth >= 6 ? 9 : 4
        : warmth >= 3 && warmth <= 6 ? 9 : 6;

  let overdressed = 2;
  let underdressed = 2;

  if (/dinner|birthday|presentation|family/.test(occasionValue)) {
    underdressed = formality < 4 ? 8 : formality < 6 ? 5 : 2;
    overdressed = formality > 8 ? 5 : 2;
  }

  if (/school|mall|casual|airport|travel/.test(occasionValue)) {
    overdressed = formality > 7 ? 8 : 2;
  }

  let style = 7;

  if (styleValue.includes("comfort") && comfort >= 8) style = 9;
  if (styleValue.includes("put together") && formality >= 5) style = 9;
  if (styleValue.includes("casual") && formality <= 5) style = 9;
  if (styleValue.includes("formal") && formality >= 7) style = 9;

  const total = event + color + weatherScore + comfort + (10 - overdressed) + (10 - underdressed) + style;

  let reason = "Balanced choice for the selected occasion and weather.";

  if (!state.wardrobe.length) reason = "Sample fit generated without saved wardrobe items.";
  if (underdressed >= 6) reason = "Main issue: this may be too casual for the occasion.";
  if (overdressed >= 6) reason = "Main issue: this may feel too dressed up for the setting.";
  if (weatherScore <= 5) reason = "Main issue: the outfit does not match the weather well.";
  if (total >= 60) reason = "Strong fit with good event fit, comfort, weather match, and style balance.";

  return {
    event,
    color,
    weather: weatherScore,
    comfort,
    overdressed,
    underdressed,
    style,
    total,
    reason,
  };
}

function fixText(score) {
  if (score.underdressed >= 6) return "Upgrade one item: use smarter shoes or add a cleaner layer.";
  if (score.overdressed >= 6) return "Relax one item: replace the formal layer or shoes with a cleaner casual option.";
  if (score.weather <= 5) return "Change the layer: lighter for hot weather, warmer for cold weather.";
  if (score.color <= 6) return "Reduce the number of colors and anchor the fit with one neutral item.";

  return "";
}

function generateFits() {
  const source = state.wardrobe.length ? [...state.wardrobe, ...fallbackWardrobe] : fallbackWardrobe;
  const groups = categoryGroups(source);
  const names = [
    "Clean casual",
    "Comfort fit",
    "Smart casual",
    "Layered fit",
    "Minimal fit",
    "Dinner fit",
    "Daily fit",
    "Put-together casual",
  ];

  const signatures = new Set();
  const fits = [];

  for (let attempt = 0; fits.length < 8 && attempt < 160; attempt += 1) {
    const top = pick(shuffle(groups.Tops.length ? groups.Tops : source));
    const bottom = pick(shuffle(groups.Bottoms.length ? groups.Bottoms : source));
    const shoes = pick(shuffle(groups.Shoes.length ? groups.Shoes : source));
    const layer = Math.random() > 0.45 ? pick(shuffle(groups.Outerwear)) : null;
    const accessory = Math.random() > 0.5 ? pick(shuffle(groups.Accessories)) : null;
    const items = [top, bottom, shoes, layer, accessory].filter(Boolean);
    const signature = items.map((entry) => entry.name).sort().join("|");

    if (items.length < 3 || signatures.has(signature)) continue;

    signatures.add(signature);

    const score = scoreFit(items);

    fits.push({
      id: uid(),
      name: pick(names),
      items,
      score,
      fix: fixText(score),
    });
  }

  state.currentGeneratedFits = fits.sort((a, b) => b.score.total - a.score.total);
  showSwipePrompt = state.wardrobe.length < 8;
  persist();
  render();
}

function saveFit(id) {
  const outfit = state.currentGeneratedFits.find((entry) => entry.id === id);

  if (!outfit) return;

  state.savedFits.unshift({
    id: uid(),
    occasion,
    weather,
    outfit,
  });

  persist();
  render();
}

function addDescription() {
  const names = descriptionText
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!names.length) return;

  state.descriptions.unshift({
    id: uid(),
    text: descriptionText,
    itemCount: names.length,
  });

  state.wardrobe.push(...names.map(itemFromDescription));
  descriptionText = "";
  persist();
  render();
}

function swipe(status) {
  const base = swipePool[swipeIndex % swipePool.length];
  swipeIndex += 1;

  if (status !== "no") {
    state.wardrobe.push({
      ...base,
      id: uid(),
      source: "swipe",
      status: status === "similar" ? "similar" : "owned",
    });

    persist();
  }

  render();
}

function removeItem(id) {
  state.wardrobe = state.wardrobe.filter((entry) => entry.id !== id);
  persist();
  render();
}

function deleteWardrobe() {
  if (!deleteConfirm) {
    deleteConfirm = true;
    render();
    return;
  }

  state = { ...defaults };
  deleteConfirm = false;
  categoryFilter = "All";
  persist();
  render();
}

function saveDetectedItems() {
  state.wardrobe.push(...state.detectedItems);
  state.detectedItems = [];
  persist();
  render();
}

function uploadPhotos(files) {
  const selected = Array.from(files || []);

  if (!selected.length) return;

  uploadPreview = URL.createObjectURL(selected[0]);
  state.uploadedImages.push(...selected.map((file) => URL.createObjectURL(file)));

  state.detectedItems.push(
    { ...itemFromDescription("Black hoodie"), id: uid(), source: "photo scan" },
    { ...itemFromDescription("Blue jeans"), id: uid(), source: "photo scan" },
    { ...itemFromDescription("White sneakers"), id: uid(), source: "photo scan" }
  );

  persist();
  render();
}

function boardItem(entry) {
  const visual = entry.image
    ? `<img src="${esc(entry.image)}" alt="${esc(entry.name)}" />`
    : `<div class="fit-placeholder">${esc(entry.color || entry.name)}</div>`;

  return `<div class="fit-board-item">${visual}<span>${esc(entry.name)}</span></div>`;
}

function scoreRow(label, value, risk = false) {
  return `
    <div>
      <div class="score-row"><span>${label}</span><b>${value}/10</b></div>
      <div class="score-bar"><i class="${risk ? "risk" : ""}" style="width:${value * 10}%"></i></div>
    </div>
  `;
}

function fitCard(fit, rank, savedFit = null) {
  const board = fit.items.map(boardItem).join("");

  if (savedFit) {
    return `
      <article class="saved-fit-card">
        <div class="fit-board">${board}</div>
        <div class="saved-fit-body">
          <h3>${esc(fit.name)}</h3>
          <p>${esc(savedFit.occasion)} · ${esc(savedFit.weather)}</p>
          <strong>${fit.score.total}/70</strong>
        </div>
      </article>
    `;
  }

  const needsFix =
    fit.score.underdressed >= 6 ||
    fit.score.overdressed >= 6 ||
    fit.score.weather <= 5 ||
    fit.score.color <= 6;

  return `
    <article class="fit-card">
      <div class="fit-board">${board}</div>
      <div class="fit-body">
        <div class="rank-row"><span>Rank ${rank}</span><strong>${fit.score.total}/70</strong></div>
        <h3>${esc(fit.name)}</h3>
        <p class="reason">${esc(fit.score.reason)}</p>
        <div class="chips">${fit.items.map((entry) => `<span>${esc(entry.name)}</span>`).join("")}</div>
        <div class="score-grid">
          ${scoreRow("Event", fit.score.event)}
          ${scoreRow("Color", fit.score.color)}
          ${scoreRow("Weather", fit.score.weather)}
          ${scoreRow("Comfort", fit.score.comfort)}
          ${scoreRow("Overdressed risk", fit.score.overdressed, true)}
          ${scoreRow("Underdressed risk", fit.score.underdressed, true)}
          ${scoreRow("Style", fit.score.style)}
        </div>
        ${needsFix ? `<div class="fix-box"><strong>Fix</strong><p>${esc(fit.fix)}</p></div>` : ""}
        <button class="save-fit-btn" data-action="save-fit" data-id="${fit.id}">Save this fit</button>
      </div>
    </article>
  `;
}

function homeView() {
  return `
    <section>
      <div class="hero">
        <div>
          <p class="eyebrow">FitCheck</p>
          <h2>Get outfit ideas before uploading your whole closet.</h2>
          <p>Start with descriptions, swipes, or selected photo scans. The app builds wardrobe data gradually.</p>
          <div class="home-actions">
            <button data-tab="descriptions">Add description</button>
            <button class="secondary" data-tab="swipe">Go to swipe</button>
            <button class="secondary" data-tab="generate">Generate fits</button>
          </div>
        </div>
        <div class="quality">
          <span>Wardrobe items saved</span>
          <strong>${state.wardrobe.length}</strong>
          <small>Descriptions, swipe picks, and detected items.</small>
          <button class="${deleteConfirm ? "danger" : "secondary"} clear-btn" data-action="delete-wardrobe">
            ${deleteConfirm ? "Confirm delete all" : "Erase stored wardrobe"}
          </button>
          ${deleteConfirm ? `<small class="warning">Click again to permanently clear saved wardrobe data.</small>` : ""}
        </div>
      </div>
    </section>
  `;
}

function generateView() {
  const content = state.currentGeneratedFits.length
    ? `<div class="fit-grid">${state.currentGeneratedFits.map((fit, index) => fitCard(fit, index + 1)).join("")}</div>`
    : `<div class="panel empty">No fits generated yet.</div>`;

  return `
    <section>
      <header class="page-header">
        <p class="eyebrow">FitCheck prototype</p>
        <h2>Generate fits</h2>
        <p>Generate uses your saved wardrobe when available. If wardrobe is empty, it uses sample basics.</p>
      </header>
      <div class="generate-top">
        <div class="controls">
          <label>Occasion<input id="occasion" value="${esc(occasion)}" /></label>
          <label>Style goal<input id="style-goal" value="${esc(styleGoal)}" /></label>
          <label>Weather
            <select id="weather">
              <option value="hot" ${weather === "hot" ? "selected" : ""}>Hot</option>
              <option value="mild" ${weather === "mild" ? "selected" : ""}>Mild</option>
              <option value="cold" ${weather === "cold" ? "selected" : ""}>Cold</option>
            </select>
          </label>
        </div>
        <div class="generate-actions"><button data-action="generate">Generate 8 fits</button></div>
      </div>
      <h3 class="sub-title">Ranked fits</h3>
      ${content}
    </section>
  `;
}

function descriptionsView() {
  const history = state.descriptions.length
    ? state.descriptions.map((entry) => `<div class="fix-box"><strong>${esc(entry.text)}</strong><p>${entry.itemCount} items added</p></div>`).join("")
    : `<p class="empty">No descriptions added yet.</p>`;

  return `
    <section>
      <header class="page-header">
        <p class="eyebrow">FitCheck prototype</p>
        <h2>Descriptions</h2>
        <p>Type what you own. These items are added into the main wardrobe.</p>
      </header>
      <div class="panel">
        <h3>Add clothes</h3>
        <textarea id="description-input" placeholder="white sneakers, black jeans, grey hoodie, blue cargos...">${esc(descriptionText)}</textarea>
        <div class="generate-actions"><button data-action="add-description">Add</button></div>
      </div>
      <div class="panel"><h3>Description history</h3>${history}</div>
    </section>
  `;
}

function wardrobeItemsView() {
  const categories = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];
  const filtered = categoryFilter === "All"
    ? state.wardrobe
    : state.wardrobe.filter((entry) => entry.category === categoryFilter);

  const grouped = filtered.reduce((result, entry) => {
    if (!result[entry.category]) result[entry.category] = [];
    result[entry.category].push(entry);
    return result;
  }, {});

  const cards = categories.map((category) => {
    const count = category === "All"
      ? state.wardrobe.length
      : state.wardrobe.filter((entry) => entry.category === category).length;

    return `
      <button class="category-card ${categoryFilter === category ? "active" : ""}" data-action="filter" data-category="${category}">
        <strong>${count}</strong>
        <span>${category}</span>
      </button>
    `;
  }).join("");

  const grid = filtered.length
    ? Object.entries(grouped).map(([category, entries]) => `
      <section>
        <h3>${esc(category)}</h3>
        <div class="wardrobe-grid">
          ${entries.map((entry) => `
            <article class="item-card">
              ${entry.image ? `<img src="${esc(entry.image)}" alt="${esc(entry.name)}" />` : `<div class="item-placeholder">${esc(entry.color)}</div>`}
              <h4>${esc(entry.name)}</h4>
              <p>${esc(entry.source || "saved")} · ${esc(entry.status || "owned")}</p>
              <button class="danger" data-action="remove-item" data-id="${entry.id}">Remove</button>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("")
    : `<div class="panel empty">No wardrobe data in this category.</div>`;

  return `<div class="category-grid">${cards}</div><div class="wardrobe-groups">${grid}</div>`;
}

function wardrobeViewHtml() {
  const content = wardrobeView === "items"
    ? wardrobeItemsView()
    : state.savedFits.length
      ? `<div class="saved-fits-grid">${state.savedFits.map((saved) => fitCard(saved.outfit, 0, saved)).join("")}</div>`
      : `<div class="panel empty">No saved fits yet. Generate fits and save the ones you like.</div>`;

  return `
    <section>
      <header class="page-header">
        <p class="eyebrow">FitCheck prototype</p>
        <h2>Wardrobe</h2>
        <p>Everything the app knows about your wardrobe.</p>
      </header>
      <div class="segmented">
        <button class="${wardrobeView === "items" ? "active" : ""}" data-action="wardrobe-view" data-view="items">Wardrobe items</button>
        <button class="${wardrobeView === "saved" ? "active" : ""}" data-action="wardrobe-view" data-view="saved">Saved fits</button>
      </div>
      ${content}
    </section>
  `;
}

function swipeView() {
  const current = swipePool[swipeIndex % swipePool.length];

  return `
    <section>
      <header class="page-header">
        <p class="eyebrow">FitCheck prototype</p>
        <h2>Swipe wardrobe builder</h2>
        <p>Build wardrobe from visual picks.</p>
      </header>
      <div class="swipe-layout">
        <article class="swipe-card">
          <img src="${esc(current.image)}" alt="${esc(current.name)}" />
          <div class="swipe-content">
            <h2>${esc(current.name)}</h2>
            <p>${esc(current.category)} · ${esc(current.color)}</p>
          </div>
        </article>
        <div class="swipe-actions">
          <button class="danger" data-action="swipe" data-status="no">← Don’t have</button>
          <button class="similar" data-action="swipe" data-status="similar">↓ Similar</button>
          <button data-action="swipe" data-status="owned">Have →</button>
        </div>
      </div>
    </section>
  `;
}

function photoView() {
  return `
    <section>
      <header class="page-header">
        <p class="eyebrow">FitCheck prototype</p>
        <h2>Photo Scan</h2>
        <p>Use selected photos first. Full gallery scan is optional later.</p>
      </header>
      <div class="photo-options">
        <div class="panel">
          <h3>Selected photos</h3>
          <p>Upload outfit photos you choose. FitCheck detects clothes from only those photos.</p>
          <input id="photo-input" type="file" accept="image/*" multiple />
          ${uploadPreview ? `<div class="preview"><img src="${uploadPreview}" alt="Uploaded preview" /><div><h4>Detected preview</h4><p>${state.detectedItems.length} items found.</p><button data-action="save-detected">Add detected items</button></div></div>` : ""}
        </div>
        <div class="panel">
          <h3>Full gallery scan</h3>
          <p>Optional scan for outfit photos. Nothing is saved until reviewed.</p>
          <button class="secondary">Mock full scan</button>
        </div>
      </div>
      ${state.detectedItems.length ? `<div class="panel"><h3>Pending detected items</h3><div class="mini-items">${state.detectedItems.map((entry) => `<span>${esc(entry.name)}</span>`).join("")}</div></div>` : ""}
    </section>
  `;
}

function modalHtml() {
  if (!showSwipePrompt) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-box" role="dialog" aria-modal="true">
        <h2>Get better fit options</h2>
        <p>Add more wardrobe items through Swipe so Generate can create more accurate and varied outfits.</p>
        <div class="modal-actions">
          <button data-action="modal-swipe">Go to swipe</button>
          <button class="secondary" data-action="modal-close">Not now</button>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const views = {
    home: homeView,
    wardrobe: wardrobeViewHtml,
    generate: generateView,
    descriptions: descriptionsView,
    swipe: swipeView,
    photo: photoView,
  };

  const app = document.getElementById("app");

  if (!app) {
    console.error("Missing #app element in index.html");
    return;
  }

  app.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">F</div>
          <div>
            <h1>FitCheck</h1>
            <p>Generate. Score. Fix.</p>
          </div>
        </div>
        ${[
          ["home", "Home"],
          ["wardrobe", "Wardrobe"],
          ["generate", "Generate"],
          ["descriptions", "Descriptions"],
          ["swipe", "Swipe"],
          ["photo", "Photo Scan"],
        ].map(([key, label]) => `<button class="nav-button ${tab === key ? "active" : ""}" data-tab="${key}">${label}</button>`).join("")}
      </aside>
      <main class="main">${views[tab]()}</main>
      ${modalHtml()}
    </div>
  `;

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      tab = button.dataset.tab;
      render();
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (action === "delete-wardrobe") {
        deleteWardrobe();
      }

      if (action === "generate") {
        occasion = document.getElementById("occasion").value;
        styleGoal = document.getElementById("style-goal").value;
        weather = document.getElementById("weather").value;
        generateFits();
      }

      if (action === "save-fit") {
        saveFit(button.dataset.id);
      }

      if (action === "add-description") {
        descriptionText = document.getElementById("description-input").value;
        addDescription();
      }

      if (action === "filter") {
        categoryFilter = button.dataset.category;
        render();
      }

      if (action === "wardrobe-view") {
        wardrobeView = button.dataset.view;
        render();
      }

      if (action === "remove-item") {
        removeItem(button.dataset.id);
      }

      if (action === "swipe") {
        swipe(button.dataset.status);
      }

      if (action === "save-detected") {
        saveDetectedItems();
      }

      if (action === "modal-close") {
        showSwipePrompt = false;
        render();
      }

      if (action === "modal-swipe") {
        showSwipePrompt = false;
        tab = "swipe";
        render();
      }
    });
  });

  const upload = document.getElementById("photo-input");

  if (upload) {
    upload.addEventListener("change", (event) => uploadPhotos(event.target.files));
  }
}

render();
