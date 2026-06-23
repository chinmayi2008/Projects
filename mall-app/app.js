function normalizeLocation(location) {
  const unit = location.unit ?? {
    x: location.x - (location.w ?? 80) / 2,
    y: location.y - (location.h ?? 34) / 2,
    w: location.w ?? 80,
    h: location.h ?? 34,
    rx: 6,
  };
  const labelPoint = location.labelPoint ?? {
    x: unit.x + unit.w / 2,
    y: unit.y + unit.h / 2,
  };
  const fallbackEntrancePoint = location.entrancePoint ?? edgePointTowardNearestNode(location, labelPoint, unit);
  const accessPoints = (location.accessPoints?.length
    ? location.accessPoints
    : [{ id: "front", point: fallbackEntrancePoint, nearestNodeId: location.nearestNodeId }]
  ).map((accessPoint, index) => ({
    id: accessPoint.id ?? `access-${index + 1}`,
    point: { ...accessPoint.point },
    nearestNodeId: accessPoint.nearestNodeId ?? location.nearestNodeId,
  }));
  const entrancePoint = accessPoints[0]?.point ?? fallbackEntrancePoint;

  Object.assign(location, {
    ...location,
    unit,
    labelPoint,
    entrancePoint,
    accessPoints,
    x: labelPoint.x,
    y: labelPoint.y,
    w: unit.w,
    h: unit.h,
  });
  return location;
}

function parseAppRoute() {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const routeSource = hash || window.location.pathname;
  const [pathPart, queryPart = ""] = routeSource.split("?");
  const pathMatch = pathPart.match(/\/malls\/([^/]+)/);
  const params = new URLSearchParams(queryPart || window.location.search);
  return {
    mallId: params.get("mall") || pathMatch?.[1] || "",
    start: params.get("start") || "",
    destination: params.get("destination") || "",
  };
}

function cloneMallData(data) {
  return {
    ...data,
    floorPlan: { ...data.floorPlan },
    corridors: (data.corridors ?? []).map((corridor) => ({ ...corridor })),
    storeUnits: data.storeUnits.map((store) => ({
      ...store,
      unit: { ...store.unit },
      entrancePoint: store.entrancePoint ? { ...store.entrancePoint } : null,
      accessPoints: store.accessPoints?.map((accessPoint) => ({
        ...accessPoint,
        point: { ...accessPoint.point },
      })) ?? null,
      labelPoint: store.labelPoint ? { ...store.labelPoint } : null,
    })),
    routeNodes: Object.fromEntries(
      Object.entries(data.routeNodes).map(([id, node]) => [id, { ...node }]),
    ),
    routeEdges: data.routeEdges.map((edge) => [...edge]),
  };
}

const routeState = parseAppRoute();
const mallRegistry = window.MALLS || {};
const activeMallId = mallRegistry[routeState.mallId] ? routeState.mallId : "";
const activeMallData = activeMallId ? cloneMallData(mallRegistry[activeMallId]) : null;
let activeLocations = activeMallData?.storeUnits ?? [];
let activeFloorPlan = activeMallData?.floorPlan ?? {};
let activeCorridors = activeMallData?.corridors ?? [];
let activeRouteNodes = activeMallData?.routeNodes ?? {};
let activeRouteEdges = activeMallData?.routeEdges ?? [];

activeLocations.forEach(normalizeLocation);

const nodes = { ...Object.fromEntries(activeLocations.map((location) => [location.id, location])), ...activeRouteNodes };
const selectableTypes = new Set(["anchor", "store", "food", "service", "amenity", "entrance", "parking"]);
const places = activeLocations.filter((location) => selectableTypes.has(location.type) && location.id !== "currentLocation");
const startLocations = activeLocations.filter(
  (location) => selectableTypes.has(location.type),
);

const taskTargets = activeMallData?.taskTargets ?? {};

const homeStage = document.querySelector("#homeStage");
const mapStage = document.querySelector("#mapStage");
const mallCards = document.querySelector("#mallCards");
const mapViewport = document.querySelector("#mapViewport");
const mapCanvas = document.querySelector("#mapCanvas");
const floorPlanLayer = document.querySelector("#floorPlanLayer");
const corridorLayer = document.querySelector("#corridorLayer");
const markersLayer = document.querySelector("#markersLayer");
const routeNodesLayer = document.querySelector("#routeNodesLayer");
const userDot = document.querySelector("#userDot");
const routePath = document.querySelector("#routePath");
const routePathShadow = document.querySelector("#routePathShadow");
const routeStartMarker = document.querySelector("#routeStartMarker");
const routeEndMarker = document.querySelector("#routeEndMarker");
const routeEndPin = document.querySelector("#routeEndPin");
const destinationBubble = document.querySelector("#destinationBubble");
const routeDebug = document.querySelector("#routeDebug");
const nextStep = document.querySelector("#nextStep");
const mallEyebrow = document.querySelector("#mallEyebrow");
const mapTitle = document.querySelector("#mapTitle");
const homeButton = document.querySelector("#homeButton");
const startSelect = document.querySelector("#startSelect");
const destinationSelect = document.querySelector("#destinationSelect");
const categoryList = document.querySelector("#categoryList");
const searchPanel = document.querySelector("#searchPanel");
const destinationTab = document.querySelector("#destinationTab");
const categoriesPanel = document.querySelector("#categoriesPanel");
const categoriesTab = document.querySelector("#categoriesTab");
const mapLegend = document.querySelector("#mapLegend");
const legendClose = document.querySelector("#legendClose");
const legendTab = document.querySelector("#legendTab");

let selectedStartId = activeMallData?.defaultStartId || "mainEntrance";
let selectedDestinationId = "";
let currentRoute = [];
let routeSteps = [];
let activeStepIndex = 0;
let userHasMovedOnRoute = false;
let view = { x: 0, y: 0, scale: 0.82 };
let isDraggingMap = false;
let isDraggingUser = false;
let dragStart = { x: 0, y: 0 };
let viewStart = { x: 0, y: 0 };
let mapPointerStart = { x: 0, y: 0, clientX: 0, clientY: 0 };
let suppressMapDestination = false;

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function edgePointTowardNearestNode(location, labelPoint, unit) {
  const nearestNode = activeRouteNodes?.[location.nearestNodeId];
  if (!unit || !nearestNode) return { ...labelPoint };

  const center = { x: labelPoint.x, y: labelPoint.y };
  const dx = nearestNode.x - center.x;
  const dy = nearestNode.y - center.y;
  const candidates = [];
  const { x, y, w, h } = unit;

  if (dx !== 0) {
    const targetX = dx > 0 ? x + w : x;
    const t = (targetX - center.x) / dx;
    const py = center.y + dy * t;
    if (t >= 0 && py >= y && py <= y + h) candidates.push({ t, x: targetX, y: py });
  }

  if (dy !== 0) {
    const targetY = dy > 0 ? y + h : y;
    const t = (targetY - center.y) / dy;
    const px = center.x + dx * t;
    if (t >= 0 && px >= x && px <= x + w) candidates.push({ t, x: px, y: targetY });
  }

  const edgePoint = candidates.sort((a, b) => a.t - b.t)[0] ?? center;
  return { x: edgePoint.x, y: edgePoint.y };
}

function accessPointsForLocation(location) {
  if (!location.unit || location.id === "currentLocation") {
    const point = { x: location.x, y: location.y };
    return [{
      id: `${location.id}:access`,
      label: location.label,
      point,
      nearestNodeId: nearestRouteNodeId(point),
    }];
  }

  return (location.accessPoints ?? []).map((accessPoint, index) => ({
    id: `${location.id}:${accessPoint.id ?? index}`,
    label: location.label,
    point: accessPoint.point,
    nearestNodeId: accessPoint.nearestNodeId,
  }));
}

function routePointForLocation(location, accessPoint = null) {
  if (accessPoint) {
    return {
      id: accessPoint.id,
      label: location.label,
      x: accessPoint.point.x,
      y: accessPoint.point.y,
    };
  }

  if (!location.unit || location.id === "currentLocation") return location;
  const primaryAccessPoint = accessPointsForLocation(location)[0];
  if (primaryAccessPoint) {
    return {
      id: primaryAccessPoint.id,
      label: location.label,
      x: primaryAccessPoint.point.x,
      y: primaryAccessPoint.point.y,
    };
  }

  console.warn("Missing entrancePoint for store:", location.label);
  return {
    id: `${location.id}:access`,
    label: location.label,
    x: location.x,
    y: location.y,
  };
}

function segmentIntersectsUnit(a, b, unit) {
  const left = unit.x + 1;
  const right = unit.x + unit.w - 1;
  const top = unit.y + 1;
  const bottom = unit.y + unit.h - 1;
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const checks = [
    [-dx, a.x - left],
    [dx, right - a.x],
    [-dy, a.y - top],
    [dy, bottom - a.y],
  ];

  for (const [p, q] of checks) {
    if (p === 0 && q < 0) return false;
    if (p === 0) continue;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
  }
  return t0 < t1;
}

function validateRouteDoesNotCrossStoreUnits(routePoints, startId, destinationId) {
  let isValid = true;
  for (let index = 1; index < routePoints.length; index += 1) {
    const from = getPointById(routePoints[index - 1]);
    const to = getPointById(routePoints[index]);
    for (const store of places) {
      if (store.type === "entrance" || store.type === "parking") continue;
      if (store.id === startId || store.id === destinationId || !store.unit) continue;
      if (segmentIntersectsUnit(from, to, store.unit)) {
        console.warn("Route crosses store unit:", store.label);
        isValid = false;
      }
    }
  }
  return isValid;
}

function angleBetween(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  const abLength = Math.hypot(ab.x, ab.y);
  const bcLength = Math.hypot(bc.x, bc.y);
  if (!abLength || !bcLength) return 0;
  const dot = (ab.x * bc.x + ab.y * bc.y) / (abLength * bcLength);
  return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
}

function segmentCrossesAnyStore(from, to, startId, destinationId) {
  return places.some((store) => {
    if (store.type === "entrance" || store.type === "parking") return false;
    if (store.id === startId || store.id === destinationId || !store.unit) return false;
    return segmentIntersectsUnit(from, to, store.unit);
  });
}

function isRouteNodePoint(point) {
  return Boolean(point?.id && activeRouteNodes[point.id]);
}

function hasDirectRouteEdge(from, to) {
  if (!isRouteNodePoint(from) || !isRouteNodePoint(to)) return false;
  return activeRouteEdges.some(([edgeStart, edgeEnd]) =>
    (edgeStart === from.id && edgeEnd === to.id) ||
    (edgeStart === to.id && edgeEnd === from.id),
  );
}

function countRouteStoreCrossings(routePoints, startId, destinationId) {
  let crossings = 0;
  for (let index = 1; index < routePoints.length; index += 1) {
    const from = getPointById(routePoints[index - 1]);
    const to = getPointById(routePoints[index]);
    for (const store of places) {
      if (store.type === "entrance" || store.type === "parking") continue;
      if (store.id === startId || store.id === destinationId || !store.unit) continue;
      if (segmentIntersectsUnit(from, to, store.unit)) crossings += 1;
    }
  }
  return crossings;
}

function simplifyRoutePoints(points, startId, destinationId, angleToleranceDegrees = 10) {
  if (points.length <= 2) return points;
  const simplified = [points[0]];

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = simplified[simplified.length - 1];
    const current = points[index];
    const next = points[index + 1];
    const turnAngle = angleBetween(previous, current, next);
    const nearlyStraight = Math.abs(180 - turnAngle) <= angleToleranceDegrees || turnAngle <= angleToleranceDegrees;
    if (
      nearlyStraight &&
      hasDirectRouteEdge(previous, next) &&
      !segmentCrossesAnyStore(previous, next, startId, destinationId)
    ) {
      continue;
    }
    simplified.push(current);
  }

  simplified.push(points[points.length - 1]);
  return simplified;
}

function buildGraph() {
  const graph = Object.fromEntries(Object.keys(activeRouteNodes).map((id) => [id, []]));

  for (const [from, to] of activeRouteEdges) {
    const weight = distance(activeRouteNodes[from], activeRouteNodes[to]);
    graph[from].push({ id: to, weight });
    graph[to].push({ id: from, weight });
  }
  return graph;
}

function shortestPath(start, goal) {
  const graph = buildGraph();
  const distances = Object.fromEntries(Object.keys(activeRouteNodes).map((id) => [id, Infinity]));
  const previous = {};
  const queue = new Set(Object.keys(activeRouteNodes));
  distances[start] = 0;

  while (queue.size) {
    const current = [...queue].sort((a, b) => distances[a] - distances[b])[0];
    queue.delete(current);
    if (current === goal) break;

    for (const neighbor of graph[current]) {
      if (!queue.has(neighbor.id)) continue;
      const nextDistance = distances[current] + neighbor.weight;
      if (nextDistance < distances[neighbor.id]) {
        distances[neighbor.id] = nextDistance;
        previous[neighbor.id] = current;
      }
    }
  }

  if (!Number.isFinite(distances[goal])) return { path: [], distance: Infinity };

  const path = [];
  let cursor = goal;
  while (cursor) {
    path.unshift(cursor);
    cursor = previous[cursor];
  }
  return { path, distance: distances[goal] };
}

function mapToScreen(point) {
  const rect = mapViewport.getBoundingClientRect();
  const matrix = new DOMMatrixReadOnly(getComputedStyle(mapCanvas).transform);
  return {
    x: (point.x * matrix.a + matrix.e) - rect.left,
    y: (point.y * matrix.d + matrix.f) - rect.top,
  };
}

function screenToMap(clientX, clientY) {
  const rect = mapViewport.getBoundingClientRect();
  return {
    x: (clientX - rect.left - view.x) / view.scale,
    y: (clientY - rect.top - view.y) / view.scale,
  };
}

function applyView() {
  mapCanvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}

function contentBounds() {
  const points = [];
  for (const location of activeLocations) {
    if (location.unit) {
      points.push(
        { x: location.unit.x, y: location.unit.y },
        { x: location.unit.x + location.unit.w, y: location.unit.y + location.unit.h },
      );
    } else {
      points.push({ x: location.x, y: location.y });
    }
  }
  for (const node of Object.values(activeRouteNodes)) {
    points.push({ x: node.x, y: node.y });
  }

  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function fitMapToViewport(bounds, viewportWidth, viewportHeight, padding = 48) {
  const scaleX = (viewportWidth - padding * 2) / bounds.width;
  const scaleY = (viewportHeight - padding * 2) / bounds.height;
  const scale = Math.max(0.45, Math.min(1.6, Math.min(scaleX, scaleY)));
  const translateX = viewportWidth / 2 - (bounds.x + bounds.width / 2) * scale;
  const translateY = viewportHeight / 2 - (bounds.y + bounds.height / 2) * scale;
  return { scale, translateX, translateY };
}

function resetView() {
  const rect = mapViewport.getBoundingClientRect();
  const fitted = fitMapToViewport(contentBounds(), rect.width, rect.height, rect.width < 720 ? 24 : 48);
  view = { x: fitted.translateX, y: fitted.translateY, scale: fitted.scale };
  applyView();
}

function renderMarkers() {
  markersLayer.innerHTML = "";
  for (const place of places) {
    const node = nodes[place.id];
    const unit = place.unit;
    const button = document.createElement("button");
    button.className = `marker ${place.type} ${categoryClass(place)}`;
    button.type = "button";
    button.dataset.id = place.id;
    button.title = place.label;
    button.style.left = `${unit.x}px`;
    button.style.top = `${unit.y}px`;
    button.style.width = `${unit.w}px`;
    button.style.height = `${unit.h}px`;
    button.style.minHeight = `${unit.h}px`;
    button.style.borderRadius = `${unit.rx ?? 6}px`;
    button.style.setProperty("--label-x", `${node.x - unit.x}px`);
    button.style.setProperty("--label-y", `${node.y - unit.y}px`);
    button.textContent = place.label;
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    button.addEventListener("pointerup", (event) => {
      event.stopPropagation();
      selectDestination(place.id);
    });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectDestination(place.id);
    });
    markersLayer.appendChild(button);
  }
}

function categoryClass(place) {
  const category = place.category.toLowerCase();
  if (place.type === "anchor") return "category-anchor";
  if (place.type === "entrance" || place.type === "parking") return "category-entry";
  if (place.type === "amenity") return "category-amenity";
  if (place.type === "food" || category.includes("food")) return "category-food";
  if (category.includes("health") || category.includes("optical")) return "category-healthcare";
  if (category.includes("jewellery")) return "category-jewellery";
  if (category.includes("fashion") || category.includes("footwear") || category.includes("beauty") || category.includes("perfume")) {
    return "category-fashion";
  }
  return "category-service";
}

function renderFloorPlan() {
  floorPlanLayer.innerHTML = "";
  const order = [
    ["boundary", "floor-shell"],
    ["corridor", "floor-corridor"],
  ];

  for (const [key, className] of order) {
    const pathData = activeFloorPlan[key];
    if (!pathData) continue;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", `floor-shape ${className}`);
    path.setAttribute("d", pathData);
    floorPlanLayer.appendChild(path);
  }
}

function renderCorridors() {
  corridorLayer.innerHTML = "";
  for (const corridor of activeCorridors) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "walkable-corridor");
    path.setAttribute("d", corridor.path);
    path.setAttribute("data-id", corridor.id);
    path.style.strokeWidth = corridor.width ?? 46;
    corridorLayer.appendChild(path);
  }

  if (SHOW_ROUTE_GRAPH || SHOW_GEOMETRY_DEBUG) {
    for (const [from, to] of activeRouteEdges) {
      const start = activeRouteNodes[from];
      const end = activeRouteNodes[to];
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "corridor-band");
      path.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
      corridorLayer.appendChild(path);

      const centerline = document.createElementNS("http://www.w3.org/2000/svg", "path");
      centerline.setAttribute("class", "corridor-center");
      centerline.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
      corridorLayer.appendChild(centerline);
    }
  }

  if (SHOW_ROUTE_GRAPH || SHOW_NODE_CONNECTIONS || SHOW_GEOMETRY_DEBUG) {
    for (const location of places) {
      for (const accessPoint of accessPointsForLocation(location)) {
        const nearestNode = activeRouteNodes[accessPoint.nearestNodeId];
        if (!nearestNode) continue;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "corridor-access");
        path.setAttribute("d", `M ${accessPoint.point.x} ${accessPoint.point.y} L ${nearestNode.x} ${nearestNode.y}`);
        corridorLayer.appendChild(path);

        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("class", "route-access-point");
        dot.setAttribute("cx", accessPoint.point.x);
        dot.setAttribute("cy", accessPoint.point.y);
        dot.setAttribute("r", "4");
        corridorLayer.appendChild(dot);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("class", "route-access-label");
        label.setAttribute("x", accessPoint.point.x + 6);
        label.setAttribute("y", accessPoint.point.y - 6);
        label.textContent = accessPoint.id;
        corridorLayer.appendChild(label);
      }
    }
  }
}

function renderRouteNodes() {
  routeNodesLayer.innerHTML = "";
  if (!SHOW_ROUTE_GRAPH && !SHOW_GEOMETRY_DEBUG && !SHOW_ROUTE_NODES) return;

  for (const [id, node] of Object.entries(activeRouteNodes)) {
    const marker = document.createElement("div");
    marker.className = "route-node";
    marker.style.left = `${node.x}px`;
    marker.style.top = `${node.y}px`;
    marker.innerHTML = `<span>${id} (${node.x},${node.y})</span>`;
    routeNodesLayer.appendChild(marker);
  }
}

function renderOptions() {
  startSelect.innerHTML = startLocations
    .map(
      (location) =>
        `<option value="${location.id}" ${location.id === selectedStartId ? "selected" : ""}>${location.label}</option>`,
    )
    .join("");

  destinationSelect.innerHTML = [
    `<option value="">Choose destination</option>`,
    ...places.map(
      (location) =>
        `<option value="${location.id}" ${location.id === selectedDestinationId ? "selected" : ""}>${location.label}</option>`,
    ),
  ].join("");
}

function renderCategories() {
  const categories = places.reduce((acc, place) => {
    if (!["Entrances", "Parking", "Amenities"].includes(place.category)) {
      acc[place.category] ??= [];
      acc[place.category].push(place.label);
    }
    return acc;
  }, {});

  categoryList.innerHTML = Object.entries(categories)
    .map(
      ([name, items]) => {
        const preview = items.length > 3 ? `${items.slice(0, 3).join(", ")}, ...` : items.join(", ");
        return `
        <article class="category-card">
          <strong>${name}</strong>
          <span>${preview}</span>
        </article>
      `;
      },
    )
    .join("");
}

function pathToSvg(path) {
  return path
    .map((item, index) => {
      const point = getPointById(item);
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");
}

function getPointById(item) {
  if (typeof item === "object") return item;
  const point = nodes[item] || activeRouteNodes[item];
  return point ? { id: item, ...point } : point;
}

function describeRoute(path) {
  if (path.length < 2) return [];

  const steps = [];
  for (let i = 1; i < path.length; i += 1) {
    const from = getPointById(path[i - 1]);
    const to = getPointById(path[i]);
    const meters = Math.max(8, Math.round(distance(from, to) / 5));
    const direction = directionFromVector(to.x - from.x, to.y - from.y);
    const name = to.label;
    const targetText = name.includes("Corridor") || name.includes("Junction")
      ? ""
      : ` toward ${name}`;
    steps.push({
      text: `Head ${direction} for ${meters} meters${targetText}.`,
      from: path[i - 1],
      to: path[i],
      meters,
    });
  }

  const destination = getPointById(path[path.length - 1]).label;
  steps[steps.length - 1] = {
    ...steps[steps.length - 1],
    text: `Continue ${steps[steps.length - 1].meters} meters and arrive at ${destination}.`,
  };
  return steps;
}

function directionFromVector(dx, dy) {
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle > -35 && angle <= 35) return "right";
  if (angle > 35 && angle <= 125) return "down";
  if (angle > 125 || angle <= -125) return "left";
  return "up";
}

function findLocationById(id) {
  return activeLocations.find((location) => location.id === id);
}

function nearestRouteNodeId(point) {
  return Object.entries(activeRouteNodes)
    .sort(([, a], [, b]) => distance(point, a) - distance(point, b))[0][0];
}

function nearestNodeToStart(candidates) {
  const start = findLocationById(selectedStartId);
  if (!start) return candidates[0];
  return candidates.sort((a, b) => distance(start, nodes[a]) - distance(start, nodes[b]))[0];
}

function selectDestination(destinationId) {
  selectedDestinationId = destinationId;
  destinationSelect.value = selectedDestinationId;
  document.querySelectorAll(".marker").forEach((marker) => {
    marker.classList.toggle("selected", marker.dataset.id === destinationId);
  });
  routeToSelected();
  closeDestinationChooser();
}

function bestRouteBetweenLocations(start, destination) {
  const startAccessPoints = accessPointsForLocation(start);
  const destinationAccessPoints = accessPointsForLocation(destination);
  let bestRoute = null;

  for (const startAccess of startAccessPoints) {
    if (!activeRouteNodes[startAccess.nearestNodeId]) continue;
    for (const destinationAccess of destinationAccessPoints) {
      if (!activeRouteNodes[destinationAccess.nearestNodeId]) continue;
      const { path: nodePath, distance: graphDistance } = shortestPath(
        startAccess.nearestNodeId,
        destinationAccess.nearestNodeId,
      );
      if (!nodePath.length || nodePath[nodePath.length - 1] !== destinationAccess.nearestNodeId) continue;

      const startNode = activeRouteNodes[startAccess.nearestNodeId];
      const destinationNode = activeRouteNodes[destinationAccess.nearestNodeId];
      const rawPoints = [
        routePointForLocation(start, startAccess),
        ...nodePath.map((nodeId) => ({ id: nodeId, ...activeRouteNodes[nodeId] })),
        routePointForLocation(destination, destinationAccess),
      ];
      const simplifiedPoints = simplifyRoutePoints(rawPoints, start.id, destination.id);
      const crossings = countRouteStoreCrossings(simplifiedPoints, start.id, destination.id);
      const totalDistance =
        graphDistance +
        distance(startAccess.point, startNode) +
        distance(destinationNode, destinationAccess.point);

      const candidate = {
        nodePath,
        points: simplifiedPoints,
        totalDistance,
        crossings,
        startAccess,
        destinationAccess,
      };

      if (
        !bestRoute ||
        candidate.crossings < bestRoute.crossings ||
        (candidate.crossings === bestRoute.crossings && candidate.totalDistance < bestRoute.totalDistance)
      ) {
        bestRoute = candidate;
      }
    }
  }

  return bestRoute;
}

function routeToSelected() {
  const start = findLocationById(selectedStartId);
  const destination = findLocationById(selectedDestinationId);
  console.log("Selected start:", selectedStartId, start);
  console.log("Selected destination:", selectedDestinationId, destination);
  console.log("Route from/to:", start?.label, destination?.label);
  document.querySelectorAll(".marker").forEach((marker) => {
    marker.classList.toggle("selected", marker.dataset.id === selectedDestinationId);
    marker.classList.toggle("start-selected", marker.dataset.id === selectedStartId);
  });

  if (!start || !destination) {
    clearRoute("Please choose a valid start and destination.");
    return;
  }

  const bestRoute = bestRouteBetweenLocations(start, destination);
  if (!bestRoute) {
    clearRoute("Please choose a valid start and destination.");
    return;
  }

  currentRoute = bestRoute.points;
  console.log("Route node sequence:", bestRoute.nodePath);
  console.log("Route access points:", bestRoute.startAccess.id, bestRoute.destinationAccess.id);
  console.log("Route total distance:", Math.round(bestRoute.totalDistance));
  console.log("Route points:", currentRoute);
  validateRouteDoesNotCrossStoreUnits(currentRoute, start.id, destination.id);
  routeSteps = describeRoute(currentRoute);
  activeStepIndex = 0;
  userHasMovedOnRoute = false;
  routeDebug.textContent = `Routing: ${start.label} (${start.x},${start.y}) -> ${destination.label} (${destination.x},${destination.y})`;
  updateRouteProgress();
}

function clearRoute(message) {
  currentRoute = [];
  routeSteps = [];
  activeStepIndex = 0;
  routePath.setAttribute("d", "");
  routePathShadow.setAttribute("d", "");
  moveRouteMarker(routeStartMarker, null);
  moveRouteMarker(routeEndMarker, null);
  moveDestinationBubble(null);
  moveRouteEndPin(null);
  nextStep.textContent = message;
  routeDebug.textContent = message;
}

function remainingPath() {
  return currentRoute;
}

function updateRouteProgress() {
  if (!currentRoute.length) {
    routePath.setAttribute("d", "");
    routePathShadow.setAttribute("d", "");
    moveRouteMarker(routeStartMarker, null);
    moveRouteMarker(routeEndMarker, null);
    moveDestinationBubble(null);
    moveRouteEndPin(null);
    return;
  }

  const remaining = remainingPath();
  const d = pathToSvg(remaining);
  routePath.setAttribute("d", d);
  routePathShadow.setAttribute("d", d);
  const destination = nodes[selectedDestinationId];
  moveRouteMarker(routeStartMarker, currentRoute[0]);
  moveRouteMarker(routeEndMarker, currentRoute[currentRoute.length - 1]);
  moveDestinationBubble(destination);
  moveRouteEndPin(destination);

  if (activeStepIndex >= currentRoute.length - 1) {
    nextStep.textContent = `You have arrived at ${destination.label}.`;
    return;
  }

  const currentStep = routeSteps[activeStepIndex];
  const nextNode = getPointById(currentRoute[activeStepIndex + 1]);
  const activeStart = selectedStartId === "currentLocation" ? nodes.currentLocation : getPointById(currentRoute[activeStepIndex]);
  const metersLeft = Math.max(0, Math.round(distance(activeStart, nextNode) / 5));
  nextStep.textContent = currentStep
    ? `${currentStep.text.replace(/\d+ meters/, `${metersLeft} meters`)}`
    : "Follow the dotted trail.";
}

function moveRouteMarker(marker, point) {
  marker.setAttribute("cx", point ? point.x : -50);
  marker.setAttribute("cy", point ? point.y : -50);
}

function moveDestinationBubble(point) {
  if (!point) {
    destinationBubble.classList.remove("is-visible");
    destinationBubble.textContent = "";
    return;
  }
  destinationBubble.style.left = `${point.x}px`;
  destinationBubble.style.top = `${point.y}px`;
  destinationBubble.textContent = point.label;
  destinationBubble.classList.add("is-visible");
}

function moveRouteEndPin(point) {
  if (!point) {
    routeEndPin.classList.remove("is-visible");
    return;
  }
  routeEndPin.style.left = `${point.x}px`;
  routeEndPin.style.top = `${point.y}px`;
  routeEndPin.classList.add("is-visible");
}

function requestLocation() {
  if (!navigator.geolocation) {
    nextStep.textContent = "Location is not available in this browser. Drag the red dot instead.";
    return;
  }

  nextStep.textContent = "Requesting location. For this demo, drag the red dot to fine tune your start point.";
  navigator.geolocation.getCurrentPosition(
    () => {
      nextStep.textContent =
        "Location allowed. Indoor accuracy may vary, so this demo keeps the red dot adjustable.";
    },
    () => {
      nodes.currentLocation.x = nodes.mainEntrance.x;
      nodes.currentLocation.y = nodes.mainEntrance.y;
      userDot.style.left = `${nodes.currentLocation.x}px`;
      userDot.style.top = `${nodes.currentLocation.y}px`;
      selectedStartId = "mainEntrance";
      startSelect.value = selectedStartId;
      nextStep.textContent = "Location was not allowed. Starting from Main Entrance.";
      if (selectedDestinationId) routeToSelected();
    },
    { enableHighAccuracy: true, timeout: 6000 },
  );
}

function moveUserTo(point) {
  nodes.currentLocation.x = Math.max(90, Math.min(1110, point.x));
  nodes.currentLocation.y = Math.max(80, Math.min(650, point.y));
  nodes.currentLocation.labelPoint = { x: nodes.currentLocation.x, y: nodes.currentLocation.y };
  nodes.currentLocation.unit = {
    ...nodes.currentLocation.unit,
    x: nodes.currentLocation.x - nodes.currentLocation.unit.w / 2,
    y: nodes.currentLocation.y - nodes.currentLocation.unit.h / 2,
  };
  nodes.currentLocation.nearestNodeId = nearestRouteNodeId(nodes.currentLocation);
  nodes.currentLocation.entrancePoint = { x: nodes.currentLocation.x, y: nodes.currentLocation.y };
  nodes.currentLocation.accessPoints = [{
    id: "front",
    point: { x: nodes.currentLocation.x, y: nodes.currentLocation.y },
    nearestNodeId: nodes.currentLocation.nearestNodeId,
  }];
  userDot.style.left = `${nodes.currentLocation.x}px`;
  userDot.style.top = `${nodes.currentLocation.y}px`;
  selectedStartId = "currentLocation";
  startSelect.value = selectedStartId;
  if (selectedDestinationId) {
    userHasMovedOnRoute = true;
    if (selectedStartId === "currentLocation") routeToSelected();
  }
}

mapViewport.addEventListener("pointerdown", (event) => {
  if (event.target === userDot) return;
  if (event.target.closest(".marker, .map-toolbar, .map-control-stack, .search-panel, .categories-panel, .map-legend")) {
    return;
  }
  suppressMapDestination = closeFloatingPanels(event);
  isDraggingMap = true;
  mapViewport.classList.add("dragging");
  dragStart = { x: event.clientX, y: event.clientY };
  mapPointerStart = {
    x: event.clientX,
    y: event.clientY,
    clientX: event.clientX,
    clientY: event.clientY,
  };
  viewStart = { x: view.x, y: view.y };
  mapViewport.setPointerCapture(event.pointerId);
});

mapViewport.addEventListener("pointermove", (event) => {
  if (!isDraggingMap) return;
  view.x = viewStart.x + event.clientX - dragStart.x;
  view.y = viewStart.y + event.clientY - dragStart.y;
  applyView();
});

mapViewport.addEventListener("pointerup", (event) => {
  const moved = Math.hypot(event.clientX - mapPointerStart.x, event.clientY - mapPointerStart.y);
  isDraggingMap = false;
  mapViewport.classList.remove("dragging");
  if (
    suppressMapDestination ||
    (moved < 6 &&
      event.target.closest(".marker, .map-toolbar, .search-panel, .destination-tab, .categories-panel, .categories-tab"))
  ) {
    suppressMapDestination = false;
    return;
  }
  if (moved < 6) {
    return;
  }
});

userDot.addEventListener("pointerdown", (event) => {
  isDraggingUser = true;
  userDot.setPointerCapture(event.pointerId);
  event.stopPropagation();
});

userDot.addEventListener("pointermove", (event) => {
  if (!isDraggingUser) return;
  moveUserTo(screenToMap(event.clientX, event.clientY));
});

userDot.addEventListener("pointerup", () => {
  isDraggingUser = false;
});

mapViewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08;
  const nextScale = Math.max(0.45, Math.min(1.6, view.scale * zoomFactor));
  const before = screenToMap(event.clientX, event.clientY);
  view.scale = nextScale;
  const rect = mapViewport.getBoundingClientRect();
  view.x = event.clientX - rect.left - before.x * view.scale;
  view.y = event.clientY - rect.top - before.y * view.scale;
  applyView();
});

document.querySelector("#routeButton").addEventListener("click", () => {
  selectedStartId = startSelect.value;
  selectedDestinationId = destinationSelect.value;
  routeToSelected();
  if (selectedDestinationId) closeDestinationChooser();
});

startSelect.addEventListener("change", () => {
  selectedStartId = startSelect.value;
  const start = findLocationById(selectedStartId);
  if (start && selectedStartId !== "currentLocation") {
    nodes.currentLocation.x = start.x;
    nodes.currentLocation.y = start.y;
    userDot.style.left = `${start.x}px`;
    userDot.style.top = `${start.y}px`;
  }
  if (selectedDestinationId) routeToSelected();
});

destinationSelect.addEventListener("change", () => {
  selectedDestinationId = destinationSelect.value;
  document.querySelectorAll(".marker").forEach((marker) => {
    marker.classList.toggle("selected", marker.dataset.id === selectedDestinationId);
  });
  if (selectedDestinationId) routeToSelected();
});

function openDestinationChooser() {
  searchPanel.classList.remove("is-hidden");
  destinationSelect.focus();
}

function closeDestinationChooser() {
  searchPanel.classList.add("is-hidden");
}

destinationTab.addEventListener("click", () => {
  searchPanel.classList.toggle("is-hidden");
  if (!searchPanel.classList.contains("is-hidden")) destinationSelect.focus();
});

function openCategories() {
  categoriesPanel.classList.remove("is-hidden");
}

function closeCategories() {
  categoriesPanel.classList.add("is-hidden");
}

categoriesTab.addEventListener("click", () => {
  categoriesPanel.classList.toggle("is-hidden");
});

legendClose.addEventListener("click", () => {
  mapLegend.classList.add("is-hidden");
});

legendTab.addEventListener("click", () => {
  mapLegend.classList.toggle("is-hidden");
});

function closeFloatingPanels(event) {
  let closedPanel = false;
  if (
    !categoriesPanel.classList.contains("is-hidden") &&
    !categoriesPanel.contains(event.target) &&
    !categoriesTab.contains(event.target)
  ) {
    closeCategories();
    closedPanel = true;
  }

  if (
    !searchPanel.classList.contains("is-hidden") &&
    !searchPanel.contains(event.target) &&
    !destinationTab.contains(event.target)
  ) {
    closeDestinationChooser();
    closedPanel = true;
  }

  if (
    !mapLegend.classList.contains("is-hidden") &&
    !mapLegend.contains(event.target) &&
    !legendTab.contains(event.target)
  ) {
    mapLegend.classList.add("is-hidden");
    closedPanel = true;
  }
  return closedPanel;
}

function mallHref(id) {
  return `#/malls/${id}`;
}

function renderHome() {
  homeStage.classList.remove("is-hidden");
  mapStage.classList.add("is-hidden");
  mallCards.innerHTML = Object.values(mallRegistry)
    .map(({ mallMeta }) => `
      <article class="mall-card">
        <div>
          <span class="status-badge">${mallMeta.status}</span>
          <h2>${mallMeta.name}</h2>
          <p>${mallMeta.description}</p>
        </div>
        <button type="button" data-mall-id="${mallMeta.id}">Open map</button>
      </article>
    `)
    .join("");

  mallCards.querySelectorAll("[data-mall-id]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = `/malls/${button.dataset.mallId}`;
      window.location.reload();
    });
  });
}

function applyQueryRoute() {
  if (routeState.start && findLocationById(routeState.start)) {
    selectedStartId = routeState.start;
  }
  if (routeState.destination && findLocationById(routeState.destination)) {
    selectedDestinationId = routeState.destination;
  }
}

function renderMapApp() {
  homeStage.classList.add("is-hidden");
  mapStage.classList.remove("is-hidden");
  mapTitle.textContent = `Ground Floor - ${activeMallData.mallMeta.name}`;
  mallEyebrow.textContent = activeMallData.mallMeta.name;

  applyQueryRoute();
  renderFloorPlan();
  renderCorridors();
  renderMarkers();
  renderRouteNodes();
  renderOptions();
  renderCategories();
  userDot.style.left = `${nodes.currentLocation.x}px`;
  userDot.style.top = `${nodes.currentLocation.y}px`;
  resetView();

  if (selectedDestinationId) routeToSelected();
}

function initApp() {
  if (!activeMallData) {
    renderHome();
    return;
  }
  renderMapApp();
}

document.querySelectorAll("[data-task]").forEach((button) => {
  button.addEventListener("click", () => {
    const targets = taskTargets[button.dataset.task];
    const target = nearestNodeToStart([...targets]);
    selectDestination(target);
  });
});

document.querySelector("#locateButton").addEventListener("click", requestLocation);
document.querySelector("#resetButton").addEventListener("click", resetView);
document.querySelector("#zoomInButton").addEventListener("click", () => {
  view.scale = Math.min(1.6, view.scale * 1.12);
  applyView();
});
document.querySelector("#zoomOutButton").addEventListener("click", () => {
  view.scale = Math.max(0.45, view.scale * 0.88);
  applyView();
});

window.addEventListener("resize", resetView);

homeButton.addEventListener("click", () => {
  window.location.hash = "";
  window.location.reload();
});

initApp();

if (SHOW_GEOMETRY_DEBUG) {
  document.body.classList.add("geometry-debug");
}

if (SHOW_STORE_BOUNDS) {
  document.body.classList.add("show-store-bounds");
}
