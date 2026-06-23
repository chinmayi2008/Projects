import { useEffect, useMemo, useState } from "react";
import "./App.css";

const swipePool = [
  {
    id: "swipe_1",
    name: "White sneakers",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
    color: "white",
    formality: 2,
    comfort: 9,
    warmth: 2,
    tags: ["clean", "casual", "basic"],
  },
  {
    id: "swipe_2",
    name: "Black jeans",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    color: "black",
    formality: 4,
    comfort: 7,
    warmth: 5,
    tags: ["minimal", "casual", "versatile"],
  },
  {
    id: "swipe_3",
    name: "Grey hoodie",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    color: "grey",
    formality: 2,
    comfort: 10,
    warmth: 7,
    tags: ["comfortable", "casual"],
  },
  {
    id: "swipe_4",
    name: "White shirt",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80",
    color: "white",
    formality: 7,
    comfort: 6,
    warmth: 4,
    tags: ["smart casual", "clean"],
  },
  {
    id: "swipe_5",
    name: "Black blazer",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    color: "black",
    formality: 9,
    comfort: 5,
    warmth: 5,
    tags: ["formal", "sharp"],
  },
  {
    id: "swipe_6",
    name: "Brown loafers",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80",
    color: "brown",
    formality: 7,
    comfort: 6,
    warmth: 2,
    tags: ["smart casual", "dinner"],
  },
  {
    id: "swipe_7",
    name: "Silver watch",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    color: "silver",
    formality: 7,
    comfort: 9,
    warmth: 0,
    tags: ["accessory", "detail"],
  },
  {
    id: "swipe_8",
    name: "Blue denim jacket",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
    color: "blue",
    formality: 4,
    comfort: 7,
    warmth: 5,
    tags: ["casual", "layer"],
  },
  {
    id: "swipe_9",
    name: "Black t-shirt",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    color: "black",
    formality: 3,
    comfort: 9,
    warmth: 3,
    tags: ["basic", "minimal"],
  },
  {
    id: "swipe_10",
    name: "Blue jeans",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80",
    color: "blue",
    formality: 3,
    comfort: 8,
    warmth: 5,
    tags: ["daily", "casual"],
  },
];

const fallbackWardrobe = [
  ...swipePool,
  {
    id: "fallback_1",
    name: "Black cargos",
    category: "Bottoms",
    image: "",
    color: "black",
    formality: 3,
    comfort: 8,
    warmth: 5,
    tags: ["casual", "streetwear"],
  },
  {
    id: "fallback_2",
    name: "Beige hoodie",
    category: "Outerwear",
    image: "",
    color: "beige",
    formality: 2,
    comfort: 10,
    warmth: 7,
    tags: ["casual", "comfortable"],
  },
  {
    id: "fallback_3",
    name: "Black boots",
    category: "Shoes",
    image: "",
    color: "black",
    formality: 5,
    comfort: 6,
    warmth: 3,
    tags: ["smart casual", "winter"],
  },
];

const mockDetectedItems = [
  {
    id: "detected_1",
    name: "Black hoodie",
    category: "Outerwear",
    image: "",
    color: "black",
    formality: 2,
    comfort: 10,
    warmth: 7,
    tags: ["detected", "casual"],
  },
  {
    id: "detected_2",
    name: "Blue jeans",
    category: "Bottoms",
    image: "",
    color: "blue",
    formality: 3,
    comfort: 8,
    warmth: 5,
    tags: ["detected", "casual"],
  },
  {
    id: "detected_3",
    name: "White sneakers",
    category: "Shoes",
    image: "",
    color: "white",
    formality: 2,
    comfort: 9,
    warmth: 2,
    tags: ["detected", "casual"],
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function randomPick(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("loafer") || lower.includes("boot")) return "Shoes";
  if (lower.includes("jean") || lower.includes("cargo") || lower.includes("trouser") || lower.includes("pant") || lower.includes("short")) return "Bottoms";
  if (lower.includes("jacket") || lower.includes("blazer") || lower.includes("coat") || lower.includes("hoodie")) return "Outerwear";
  if (lower.includes("watch") || lower.includes("belt") || lower.includes("ring") || lower.includes("glasses") || lower.includes("bag")) return "Accessories";
  return "Tops";
}

function inferColor(name) {
  const lower = name.toLowerCase();
  const colors = ["black", "white", "grey", "gray", "blue", "brown", "beige", "green", "red", "pink", "cream", "navy", "silver"];
  return colors.find((color) => lower.includes(color)) || "unknown";
}

function itemFromDescription(name) {
  const category = inferCategory(name);
  const color = inferColor(name);

  return {
    id: uid(),
    name,
    category,
    image: "",
    color,
    formality: category === "Accessories" ? 6 : category === "Shoes" ? 4 : 4,
    comfort: category === "Accessories" ? 9 : 7,
    warmth: category === "Outerwear" ? 7 : category === "Tops" ? 4 : category === "Bottoms" ? 5 : 2,
    tags: ["described"],
    source: "description",
    status: "owned",
    similarity: "exact",
  };
}

function categoryGroups(items) {
  return {
    Tops: items.filter((i) => i.category === "Tops"),
    Bottoms: items.filter((i) => i.category === "Bottoms"),
    Shoes: items.filter((i) => i.category === "Shoes"),
    Outerwear: items.filter((i) => i.category === "Outerwear"),
    Accessories: items.filter((i) => i.category === "Accessories"),
  };
}

function scoreOutfit(outfit, occasion, styleGoal, weather, realWardrobeCount) {
  const occasionLower = occasion.toLowerCase();
  const styleLower = styleGoal.toLowerCase();
  const items = outfit.items;

  const avg = (values) => Math.round(values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1));

  const avgFormality = avg(items.map((item) => item.formality || 4));
  const avgComfort = avg(items.map((item) => item.comfort || 7));
  const avgWarmth = avg(items.map((item) => item.warmth || 4));

  let eventFit = 6;
  if (["dinner", "birthday", "presentation", "family"].some((x) => occasionLower.includes(x))) {
    eventFit = avgFormality >= 6 ? 9 : avgFormality >= 4 ? 7 : 4;
  } else if (["school", "mall", "casual", "airport", "travel"].some((x) => occasionLower.includes(x))) {
    eventFit = avgFormality <= 5 ? 9 : 6;
  }

  let colorBalance = 8;
  const colors = items.map((item) => item.color).filter((color) => color !== "unknown");
  const uniqueColors = new Set(colors);
  if (uniqueColors.size <= 3) colorBalance = 9;
  if (uniqueColors.size > 4) colorBalance = 5;

  let weatherFit = 7;
  if (weather === "hot") weatherFit = avgWarmth <= 4 ? 9 : 4;
  if (weather === "mild") weatherFit = avgWarmth >= 3 && avgWarmth <= 6 ? 9 : 6;
  if (weather === "cold") weatherFit = avgWarmth >= 6 ? 9 : 4;

  const comfort = Math.min(10, Math.max(1, avgComfort));

  let overdressedRisk = 2;
  let underdressedRisk = 2;

  if (["dinner", "birthday", "presentation", "family"].some((x) => occasionLower.includes(x))) {
    underdressedRisk = avgFormality < 4 ? 8 : avgFormality < 6 ? 5 : 2;
    overdressedRisk = avgFormality > 8 ? 5 : 2;
  }

  if (["school", "mall", "casual", "airport", "travel"].some((x) => occasionLower.includes(x))) {
    overdressedRisk = avgFormality > 7 ? 8 : 2;
    underdressedRisk = 2;
  }

  let styleMatch = 7;
  if (styleLower.includes("comfort") && comfort >= 8) styleMatch = 9;
  if (styleLower.includes("put together") && avgFormality >= 5) styleMatch = 9;
  if (styleLower.includes("casual") && avgFormality <= 5) styleMatch = 9;
  if (styleLower.includes("formal") && avgFormality >= 7) styleMatch = 9;

  const total =
    eventFit +
    colorBalance +
    weatherFit +
    comfort +
    (10 - overdressedRisk) +
    (10 - underdressedRisk) +
    styleMatch;

  let reason = "Balanced choice for the selected occasion and weather.";
  if (realWardrobeCount === 0) reason = "Sample fit generated without saved wardrobe items.";
  if (underdressedRisk >= 6) reason = "Main issue: this may be too casual for the occasion.";
  if (overdressedRisk >= 6) reason = "Main issue: this may feel too dressed up for the setting.";
  if (weatherFit <= 5) reason = "Main issue: the outfit does not match the weather well.";
  if (total >= 60) reason = "Strong fit with good event fit, comfort, weather match, and style balance.";

  return {
    eventFit,
    colorBalance,
    weatherFit,
    comfort,
    overdressedRisk,
    underdressedRisk,
    styleMatch,
    total,
    displayScore: `${total}/70`,
    reason,
  };
}

function fixText(score) {
  if (score.underdressedRisk >= 6) return "Upgrade one item: use smarter shoes or add a cleaner layer.";
  if (score.overdressedRisk >= 6) return "Relax one item: replace the formal layer or shoes with a cleaner casual option.";
  if (score.weatherFit <= 5) return "Change the layer: lighter for hot weather, warmer for cold weather.";
  if (score.colorBalance <= 6) return "Reduce the number of colors and anchor the fit with one neutral item.";
  return "No major fix needed.";
}

function generateOutfitsFromWardrobe(wardrobe, occasion, styleGoal, weather) {
  const sourceItems = wardrobe.length > 0 ? [...wardrobe, ...fallbackWardrobe] : fallbackWardrobe;
  const groups = categoryGroups(sourceItems);
  const results = [];
  const signatures = new Set();

  const archetypes = [
    { name: "Clean casual", needsLayer: true, needsAccessory: false },
    { name: "Comfort fit", needsLayer: false, needsAccessory: false },
    { name: "Smart casual", needsLayer: false, needsAccessory: true },
    { name: "Layered fit", needsLayer: true, needsAccessory: true },
    { name: "Minimal fit", needsLayer: false, needsAccessory: true },
    { name: "Dinner fit", needsLayer: true, needsAccessory: true },
    { name: "Daily fit", needsLayer: false, needsAccessory: false },
    { name: "Put-together casual", needsLayer: true, needsAccessory: true },
  ];

  const shuffledArchetypes = shuffle(archetypes);

  for (let attempts = 0; results.length < 8 && attempts < 120; attempts++) {
    const archetype = shuffledArchetypes[(results.length + attempts) % shuffledArchetypes.length];

    const top = randomPick(shuffle(groups.Tops.length ? groups.Tops : sourceItems));
    const bottom = randomPick(shuffle(groups.Bottoms.length ? groups.Bottoms : sourceItems));
    const shoes = randomPick(shuffle(groups.Shoes.length ? groups.Shoes : sourceItems));
    const layer = archetype.needsLayer ? randomPick(shuffle(groups.Outerwear.length ? groups.Outerwear : sourceItems)) : null;
    const accessory = archetype.needsAccessory ? randomPick(shuffle(groups.Accessories.length ? groups.Accessories : [])) : null;

    const items = [top, bottom, shoes, layer, accessory].filter(Boolean);

    const names = items.map((item) => item.name);
    const signature = names.sort().join("|");

    if (items.length < 3 || signatures.has(signature)) continue;
    signatures.add(signature);

    const outfit = {
      id: uid(),
      name: archetype.name,
      items,
    };

    const score = scoreOutfit(outfit, occasion, styleGoal, weather, wardrobe.length);

    results.push({
      ...outfit,
      score,
      fix: fixText(score),
    });
  }

  return results.sort((a, b) => b.score.total - a.score.total);
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("fitcheck_state");
    const defaults = {
      descriptions: [],
      wardrobe: [],
      uploadedImages: [],
      detectedItems: [],
      savedFits: [],
      currentGeneratedFits: [],
    };

    if (!saved) return defaults;

    const parsed = JSON.parse(saved);
    return {
      descriptions: parsed.descriptions || [],
      wardrobe: parsed.wardrobe || [],
      uploadedImages: parsed.uploadedImages || [],
      detectedItems: parsed.detectedItems || [],
      savedFits: parsed.savedFits || [],
      currentGeneratedFits: parsed.currentGeneratedFits || [],
    };
  });

  const [occasion, setOccasion] = useState("birthday dinner");
  const [styleGoal, setStyleGoal] = useState("casual but put together");
  const [weather, setWeather] = useState("mild");
  const [descriptionText, setDescriptionText] = useState("");
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [wardrobeView, setWardrobeView] = useState("items");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showSwipePrompt, setShowSwipePrompt] = useState(false);

  useEffect(() => {
    localStorage.setItem("fitcheck_state", JSON.stringify(state));
  }, [state]);

  const wardrobeItems = state.wardrobe;
  const displayedOutfits = state.currentGeneratedFits;

  function generateFits() {
    const generated = generateOutfitsFromWardrobe(wardrobeItems, occasion, styleGoal, weather);
    setState((prev) => ({
      ...prev,
      currentGeneratedFits: generated,
    }));

    if (wardrobeItems.length < 8) {
      setShowSwipePrompt(true);
    }
  }

  function saveFit(outfit) {
    setState((prev) => ({
      ...prev,
      savedFits: [
        {
          id: uid(),
          fitId: outfit.id,
          createdAt: new Date().toISOString(),
          occasion,
          weather,
          outfit,
        },
        ...prev.savedFits,
      ],
    }));
  }

  function addDescription() {
    const names = descriptionText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const newItems = names.map(itemFromDescription);

    setState((prev) => ({
      ...prev,
      descriptions: [
        {
          id: uid(),
          text: descriptionText,
          createdAt: new Date().toISOString(),
          itemCount: names.length,
        },
        ...prev.descriptions,
      ],
      wardrobe: [...prev.wardrobe, ...newItems],
    }));

    setDescriptionText("");
  }

  function addSwipe(status) {
    const base = swipePool[swipeIndex % swipePool.length];

    if (status === "no") {
      setSwipeIndex((prev) => prev + 1);
      return;
    }

    const newItem = {
      ...base,
      id: uid(),
      source: "swipe",
      status: status === "similar" ? "similar" : "owned",
      similarity: status === "similar" ? "similar" : "exact",
    };

    setState((prev) => ({
      ...prev,
      wardrobe: [...prev.wardrobe, newItem],
    }));

    setSwipeIndex((prev) => prev + 1);
  }

  function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    setUploadPreview(previews[0]);

    const detected = mockDetectedItems.map((item) => ({
      ...item,
      id: uid(),
      source: "photo scan",
      status: "owned",
      similarity: "exact",
    }));

    setState((prev) => ({
      ...prev,
      uploadedImages: [...previews, ...prev.uploadedImages],
      detectedItems: [...detected, ...prev.detectedItems],
    }));
  }

  function saveDetectedItems() {
    setState((prev) => ({
      ...prev,
      wardrobe: [...prev.wardrobe, ...prev.detectedItems],
      detectedItems: [],
    }));
  }

  function removeItem(id) {
    setState((prev) => ({
      ...prev,
      wardrobe: prev.wardrobe.filter((item) => item.id !== id),
    }));
  }

  function requestDeleteAll() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    const emptyState = {
      descriptions: [],
      wardrobe: [],
      uploadedImages: [],
      detectedItems: [],
      savedFits: [],
      currentGeneratedFits: [],
    };

    setState(emptyState);
    localStorage.setItem("fitcheck_state", JSON.stringify(emptyState));
    setDeleteConfirm(false);
    setCategoryFilter("All");
  }

  const currentSwipe = swipePool[swipeIndex % swipePool.length];

  const categoryCounts = {
    All: state.wardrobe.length,
    Tops: state.wardrobe.filter((x) => x.category === "Tops").length,
    Bottoms: state.wardrobe.filter((x) => x.category === "Bottoms").length,
    Shoes: state.wardrobe.filter((x) => x.category === "Shoes").length,
    Outerwear: state.wardrobe.filter((x) => x.category === "Outerwear").length,
    Accessories: state.wardrobe.filter((x) => x.category === "Accessories").length,
  };

  const filteredWardrobe =
    categoryFilter === "All"
      ? state.wardrobe
      : state.wardrobe.filter((item) => item.category === categoryFilter);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">F</div>
          <div>
            <h1>FitCheck</h1>
            <p>Generate. Score. Fix.</p>
          </div>
        </div>

        <button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}>Home</button>
        <button className={tab === "wardrobe" ? "active" : ""} onClick={() => setTab("wardrobe")}>Wardrobe</button>
        <button className={tab === "generate" ? "active" : ""} onClick={() => setTab("generate")}>Generate</button>
        <button className={tab === "descriptions" ? "active" : ""} onClick={() => setTab("descriptions")}>Descriptions</button>
        <button className={tab === "swipe" ? "active" : ""} onClick={() => setTab("swipe")}>Swipe</button>
        <button className={tab === "photo" ? "active" : ""} onClick={() => setTab("photo")}>Photo Scan</button>
      </aside>

      <main className="main">
        {tab === "home" && (
          <section>
            <div className="hero">
              <div>
                <p className="eyebrow">FitCheck</p>
                <h2>Get outfit ideas before uploading your whole closet.</h2>
                <p>
                  Start with descriptions, swipes, or selected photo scans. The app builds wardrobe data gradually.
                </p>
                <div className="homeActions">
                  <button onClick={() => setTab("descriptions")}>Add description</button>
                  <button className="secondary" onClick={() => setTab("swipe")}>Go to swipe</button>
                  <button className="secondary" onClick={() => setTab("generate")}>Generate fits</button>
                </div>
              </div>

              <div className="quality">
                <span>Wardrobe items saved</span>
                <strong>{state.wardrobe.length}</strong>
                <small>Descriptions, swipe picks, and detected items.</small>

                <button className={deleteConfirm ? "danger clearBtn" : "secondary clearBtn"} onClick={requestDeleteAll}>
                  {deleteConfirm ? "Confirm delete all" : "Erase stored wardrobe"}
                </button>

                {deleteConfirm && <small className="warning">Click again to permanently clear saved wardrobe data.</small>}
              </div>
            </div>
          </section>
        )}

        {tab === "generate" && (
          <section>
            <PageHeader title="Generate fits" text="Generate uses your saved wardrobe when available. If wardrobe is empty, it uses sample basics." />

            <div className="generateTop">
              <div className="controls">
                <label>
                  Occasion
                  <input value={occasion} onChange={(e) => setOccasion(e.target.value)} />
                </label>

                <label>
                  Style goal
                  <input value={styleGoal} onChange={(e) => setStyleGoal(e.target.value)} />
                </label>

                <label>
                  Weather
                  <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                    <option value="hot">Hot</option>
                    <option value="mild">Mild</option>
                    <option value="cold">Cold</option>
                  </select>
                </label>
              </div>

              <div className="generateActions">
                <button onClick={generateFits}>Generate 8 fits</button>
              </div>
            </div>

            <h3 className="subTitle">Ranked fits</h3>

            {displayedOutfits.length === 0 ? (
              <div className="panel empty">No fits generated yet.</div>
            ) : (
              <div className="grid">
                {displayedOutfits.map((outfit, index) => (
                  <FitCard key={outfit.id} outfit={outfit} rank={index + 1} onSave={saveFit} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "descriptions" && (
          <section>
            <PageHeader title="Descriptions" text="Fastest setup. Type or speak what you own. These items are added into the main wardrobe." />

            <div className="panel">
              <h3>Add clothes</h3>
              <div className="textMicWrap">
                <textarea
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  placeholder="white sneakers, black jeans, grey hoodie, blue cargos..."
                />
                <button className="mic" title="Voice input placeholder">🎙</button>
              </div>

              <button onClick={addDescription}>Add</button>
            </div>

            <div className="panel">
              <h3>Description history</h3>
              {state.descriptions.length === 0 ? (
                <p className="empty">No descriptions added yet.</p>
              ) : (
                <div className="descriptionList">
                  {state.descriptions.map((item) => (
                    <div key={item.id} className="descriptionItem">
                      <p>{item.text}</p>
                      <small>{item.itemCount} items added</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "wardrobe" && (
          <section>
            <PageHeader title="Wardrobe" text="Everything the app knows about your wardrobe." />

            <div className="segmented">
              <button className={wardrobeView === "items" ? "selected" : ""} onClick={() => setWardrobeView("items")}>Wardrobe items</button>
              <button className={wardrobeView === "saved" ? "selected" : ""} onClick={() => setWardrobeView("saved")}>Saved fits</button>
            </div>

            {wardrobeView === "items" && (
              <>
                <div className="sourceGrid clickableGrid">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <button
                      key={category}
                      className={categoryFilter === category ? "sourceBox selectedSource" : "sourceBox"}
                      onClick={() => setCategoryFilter(category)}
                    >
                      <strong>{count}</strong>
                      <span>{category}</span>
                    </button>
                  ))}
                </div>

                <WardrobeGrid items={filteredWardrobe} removeItem={removeItem} />
              </>
            )}

            {wardrobeView === "saved" && (
              <div className="panel">
                {state.savedFits.length === 0 ? (
                  <p className="empty">No saved fits yet. Generate fits and save the ones you like.</p>
                ) : (
                  <div className="savedFitsGrid">
                    {state.savedFits.map((savedFit) => (
                      <SavedFitCard key={savedFit.id} savedFit={savedFit} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {tab === "swipe" && (
          <section>
            <PageHeader title="Swipe wardrobe builder" text="Build wardrobe from visual picks." />

            <div className="swipeLayout">
              <div className="swipeCard">
                <img src={currentSwipe.image} alt={currentSwipe.name} />
                <div className="swipeContent">
                  <h2>{currentSwipe.name}</h2>
                  <p>{currentSwipe.category} · {currentSwipe.color}</p>
                </div>
              </div>

              <div className="swipeActions">
                <button className="danger" onClick={() => addSwipe("no")}>← Don’t have</button>
                <button className="similar" onClick={() => addSwipe("similar")}>↓ Similar</button>
                <button onClick={() => addSwipe("yes")}>Have →</button>
              </div>
            </div>
          </section>
        )}

        {tab === "photo" && (
          <section>
            <PageHeader title="Photo Scan" text="Use selected photos first. Full gallery scan is optional later." />

            <div className="photoOptions">
              <div className="panel">
                <h3>Selected photos</h3>
                <p>Upload outfit photos you choose. FitCheck detects clothes from only those photos.</p>
                <input type="file" accept="image/*" multiple onChange={handleUpload} />

                {uploadPreview && (
                  <div className="preview">
                    <img src={uploadPreview} alt="Uploaded preview" />
                    <div>
                      <h4>Detected preview</h4>
                      <p>{state.detectedItems.length} items found.</p>
                      <button onClick={saveDetectedItems}>Add detected items</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="panel">
                <h3>Full gallery scan</h3>
                <p>Optional scan for outfit photos. Nothing is saved until reviewed.</p>
                <button>Mock full scan</button>
              </div>
            </div>

            {state.detectedItems.length > 0 && (
              <div className="panel">
                <h3>Pending detected items</h3>
                <div className="miniItems">
                  {state.detectedItems.map((item) => (
                    <span key={item.id}>{item.name}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {showSwipePrompt && (
        <div className="modalOverlay" role="presentation">
          <div className="modalBox" role="dialog" aria-modal="true" aria-labelledby="swipe-prompt-title">
            <h2 id="swipe-prompt-title">Get better fit options</h2>
            <p>Add more wardrobe items through Swipe so Generate can create more accurate and varied outfits.</p>
            <div className="modalActions">
              <button
                onClick={() => {
                  setShowSwipePrompt(false);
                  setTab("swipe");
                }}
              >
                Go to swipe
              </button>
              <button className="secondary" onClick={() => setShowSwipePrompt(false)}>Not now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageHeader({ title, text }) {
  return (
    <header className="pageHeader">
      <p className="eyebrow">FitCheck prototype</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}

function FitCard({ outfit, rank, onSave }) {
  const showFix =
    outfit.score.underdressedRisk >= 6 ||
    outfit.score.overdressedRisk >= 6 ||
    outfit.score.weatherFit <= 5 ||
    outfit.score.colorBalance <= 6;

  return (
    <div className="fitCard">
      <div className="fitBoard">
        {outfit.items.map((item) => (
          <div className="fitBoardItem" key={item.id}>
            {item.image ? (
              <img src={item.image} alt={item.name} />
            ) : (
              <div className="fitPlaceholder">{item.color}</div>
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div className="fitBody">
        <div className="rankRow">
          <span>Rank {rank}</span>
          <strong>{outfit.score.displayScore}</strong>
        </div>

        <h3>{outfit.name}</h3>
        <p className="reason">{outfit.score.reason}</p>

        <div className="chips">
          {outfit.items.map((item) => (
            <span key={item.id}>{item.name}</span>
          ))}
        </div>

        <div className="scoreGrid">
          <Score label="Event" value={outfit.score.eventFit} />
          <Score label="Color" value={outfit.score.colorBalance} />
          <Score label="Weather" value={outfit.score.weatherFit} />
          <Score label="Comfort" value={outfit.score.comfort} />
          <Score label="Overdressed" value={outfit.score.overdressedRisk} risk />
          <Score label="Underdressed" value={outfit.score.underdressedRisk} risk />
          <Score label="Style" value={outfit.score.styleMatch} />
        </div>

        {showFix && (
          <div className="fixBox">
            <strong>Fix</strong>
            <p>{outfit.fix}</p>
          </div>
        )}

        {onSave && (
          <button className="saveFitBtn" onClick={() => onSave(outfit)}>Save this fit</button>
        )}
      </div>
    </div>
  );
}

function SavedFitCard({ savedFit }) {
  const { outfit } = savedFit;

  return (
    <div className="savedFitCard">
      <div className="fitBoard">
        {outfit.items.map((item) => (
          <div className="fitBoardItem" key={item.id}>
            {item.image ? (
              <img src={item.image} alt={item.name} />
            ) : (
              <div className="fitPlaceholder">{item.color || item.name}</div>
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div className="savedFitBody">
        <h3>{outfit.name}</h3>
        <p>{savedFit.occasion} · {savedFit.weather}</p>
        <strong>{outfit.score.displayScore}</strong>
      </div>
    </div>
  );
}

function Score({ label, value, risk }) {
  return (
    <div className="scoreItem">
      <div>
        <span>{label}</span>
        <b>{value}/10</b>
      </div>
      <div className="scoreBar">
        <i className={risk ? "risk" : ""} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function WardrobeGrid({ items, removeItem }) {
  const groups = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (items.length === 0) {
    return <div className="panel empty">No wardrobe data in this category.</div>;
  }

  return (
    <div className="wardrobeGroups">
      {Object.entries(groups).map(([category, group]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="wardrobeGrid">
            {group.map((item) => (
              <div className="itemCard" key={item.id}>
                {item.image ? <img src={item.image} alt={item.name} /> : <div className="placeholder">{item.color}</div>}
                <h4>{item.name}</h4>
                <p>{item.source} · {item.status}</p>
                {item.status === "similar" && <small>Similar item owned</small>}
                <button className="small danger" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
