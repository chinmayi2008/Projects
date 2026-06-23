import { useMemo, useRef, useState } from "react";

const modes = [
  {
    title: "Explore UAE Roads",
    description: "See how main corridors, exits, and interchanges connect across the city."
  },
  {
    title: "Area Understanding",
    description: "Build a mental map of neighborhoods, landmarks, and road relationships."
  },
  {
    title: "Route Logic & Reasoning",
    description: "Learn why one route is cleaner, faster, or less confusing than another."
  },
  {
    title: "Learn Common Road Mistakes",
    description: "Spot lane, exit, and naming mistakes before they happen on the road."
  }
];

const viewPresets = [
  {
    id: "beginner",
    name: "Beginner view",
    filters: {
      showHighways: true,
      showPrimaryConnectors: false,
      showSecondaryConnectors: false,
      showCoreAreas: true,
      showSecondaryAreas: false
    },
    description: "Start here to understand where Dubai areas sit relative to the main highway skeleton.",
    useWhen: "You are building a basic mental map of Dubai areas and the main highway skeleton."
  },
  {
    id: "road-skeleton",
    name: "Road skeleton",
    filters: {
      showHighways: true,
      showPrimaryConnectors: false,
      showSecondaryConnectors: false,
      showCoreAreas: false,
      showSecondaryAreas: false
    },
    description: "Use this to understand Dubai's main movement corridors.",
    useWhen: "You want to focus only on Dubai's main highway movement corridors."
  },
  {
    id: "area-connection",
    name: "Area connection view",
    filters: {
      showHighways: true,
      showPrimaryConnectors: true,
      showSecondaryConnectors: false,
      showCoreAreas: true,
      showSecondaryAreas: false
    },
    description: "Use this to understand how areas connect to highways through connector roads.",
    useWhen: "You want to understand how areas connect to highways through connector roads."
  },
  {
    id: "expanded-dubai",
    name: "Expanded Dubai view",
    filters: {
      showHighways: true,
      showPrimaryConnectors: true,
      showSecondaryConnectors: true,
      showCoreAreas: true,
      showSecondaryAreas: true
    },
    description: "Use this after the basics to see more important Dubai roads and areas without switching to a full Google Maps-style view.",
    useWhen: "You understand the basics and want more Dubai context without switching to a full Google Maps-style view."
  },
  {
    id: "connector-focus",
    name: "Connector focus",
    filters: {
      showHighways: false,
      showPrimaryConnectors: true,
      showSecondaryConnectors: false,
      showCoreAreas: true,
      showSecondaryAreas: false,
      ghostHighways: true
    },
    description: "Use this to study the roads where most local-access confusion begins.",
    useWhen: "You want to study the connector roads where most local-access confusion begins."
  }
];

const layerLabels = {
  showHighways: "Major highways",
  showPrimaryConnectors: "Primary connectors",
  showSecondaryConnectors: "Secondary connectors",
  showCoreAreas: "Core areas",
  showSecondaryAreas: "Secondary areas"
};

const emirates = [
  { name: "Dubai", status: "enabled" },
  { name: "Abu Dhabi", status: "soon" },
  { name: "Sharjah", status: "soon" },
  { name: "Ajman", status: "soon" },
  { name: "Ras Al Khaimah", status: "soon" },
  { name: "Fujairah", status: "soon" },
  { name: "Umm Al Quwain", status: "soon" }
];

const highways = [
  "E11 / Sheikh Zayed Road",
  "E44 / Al Khail Road",
  "E311 / Sheikh Mohammed Bin Zayed Road",
  "E611 / Emirates Road",
  "E66 / Dubai-Al Ain Road"
];

const areas = [
  "Dubai Marina",
  "JLT",
  "Al Barsha",
  "JVC",
  "Downtown Dubai",
  "Business Bay",
  "Karama",
  "Bur Dubai",
  "Deira",
  "Mirdif",
  "Jumeirah",
  "Umm Suqeim",
  "Al Quoz",
  "Dubai Hills",
  "DIFC",
  "Trade Centre",
  "Oud Metha",
  "Rashidiya",
  "Dubai Silicon Oasis",
  "International City"
];

const roadDetails = [
  {
    id: "e11",
    code: "E11",
    name: "Sheikh Zayed Road",
    category: "highway",
    priority: "core",
    type: "Primary coastal highway",
    whatItDoes: "Acts as Dubai's main central/coastal movement spine.",
    whatItIs: "Dubai's main central spine. It runs through the city's business and coastal corridor.",
    whenToUse: "Use it when moving between Dubai Marina, JLT, Business Bay, Downtown, Trade Centre, or when travelling toward Abu Dhabi or Sharjah-side routes.",
    areasItHelpsWith: ["Dubai Marina", "JLT", "Business Bay", "Downtown Dubai", "Trade Centre", "Deira-side access"],
    connectsTo: ["Dubai Marina", "JLT", "Business Bay", "Downtown Dubai", "Old Dubai access"],
    commonConfusion: "Service roads, fast exits, and late lane changes. Being on the correct side early matters more than the final turn.",
    watchFor: "Service roads, fast exits, and late lane changes. Being on the correct side early matters more than the final turn.",
    beginnerRule: "If your destination is near E11, decide early whether you need the main highway, the service road, or a connector exit.",
    lineClass: "road-e11",
    labelX: 50,
    labelY: 38,
    x1: 5,
    y1: 42,
    x2: 96,
    y2: 35
  },
  {
    id: "e44",
    code: "E44",
    name: "Al Khail Road",
    category: "highway",
    priority: "core",
    type: "Internal city highway",
    whatItDoes: "Moves traffic through inland Dubai behind Sheikh Zayed Road.",
    whatItIs: "A major inland Dubai highway running behind Sheikh Zayed Road.",
    whenToUse: "Use it when moving through inland Dubai without entering the E11/SZR corridor.",
    areasItHelpsWith: ["Business Bay", "Al Quoz", "Dubai Hills", "JVC", "Meydan"],
    connectsTo: ["Business Bay", "Al Quoz", "Dubai Hills", "JVC", "Meydan"],
    commonConfusion: "Exits can feel indirect because many areas are reached through connector roads rather than direct turns.",
    watchFor: "Exits can feel indirect because many areas are reached through connector roads rather than direct turns.",
    beginnerRule: "Before joining Al Khail, know the exit cluster, not just the destination name.",
    lineClass: "road-e44",
    labelX: 47,
    labelY: 56,
    x1: 17,
    y1: 61,
    x2: 82,
    y2: 58
  },
  {
    id: "e311",
    code: "E311",
    name: "Sheikh Mohammed Bin Zayed Road",
    category: "highway",
    priority: "core",
    type: "Inland inter-city highway",
    whatItDoes: "Works as Dubai's city-side inland bypass for suburban and inter-emirate movement.",
    whatItIs: "A major inland highway parallel to E11, useful for suburban and inter-emirate movement.",
    whenToUse: "Use it to avoid central Dubai or to move between inland districts and northern emirates routes.",
    areasItHelpsWith: ["Mirdif", "International City", "Dubai Silicon Oasis", "JVC-side access", "Sharjah/Ajman direction"],
    connectsTo: ["Mirdif", "International City", "Dubai Silicon Oasis", "JVC-side access", "Northern Emirates direction"],
    commonConfusion: "It is easy to confuse with E611 because both feel like outer roads, but E311 is generally closer to city districts.",
    watchFor: "It is easy to confuse with E611 because both feel like outer roads, but E311 is generally closer to city districts.",
    beginnerRule: "Think of E311 as the inland city-side bypass. Think of E611 as the farther outer bypass.",
    lineClass: "road-e311",
    labelX: 58,
    labelY: 78,
    x1: 34,
    y1: 75,
    x2: 91,
    y2: 84
  },
  {
    id: "e611",
    code: "E611",
    name: "Emirates Road",
    category: "highway",
    priority: "core",
    type: "Outer bypass highway",
    whatItDoes: "Acts as Dubai's farther outer bypass for longer-distance and outer-area movement.",
    whatItIs: "Dubai's outer bypass road, used more for long-distance and outer-area movement.",
    whenToUse: "Use it when your trip is clearly outer-city, logistics/industrial, or inter-emirate.",
    areasItHelpsWith: ["Outer Dubai", "Industrial areas", "Northern Emirates direction", "Long-distance bypass trips"],
    connectsTo: ["Outer Dubai", "Industrial areas", "Northern Emirates direction"],
    commonConfusion: "It can take you too far outside the city if your destination is actually inside Dubai.",
    watchFor: "It can take you too far outside the city if your destination is actually inside Dubai.",
    beginnerRule: "Do not pick E611 just because it looks fast. Use it only when the destination is genuinely outer-Dubai or beyond.",
    lineClass: "road-e611",
    labelX: 31,
    labelY: 73,
    x1: 1,
    y1: 75,
    x2: 55,
    y2: 73
  },
  {
    id: "e66",
    code: "E66",
    name: "Dubai-Al Ain Road",
    category: "highway",
    priority: "core",
    type: "Regional inland highway",
    whatItDoes: "Connects Dubai toward Al Ain and inland south-east districts.",
    whatItIs: "A regional road connecting Dubai toward Al Ain and inland south-east districts.",
    whenToUse: "Use it for Dubai Silicon Oasis, Academic City, Outlet Mall side, or Al Ain direction.",
    areasItHelpsWith: ["Dubai Silicon Oasis", "Academic City", "Nad Al Sheba-side access", "Al Ain direction"],
    connectsTo: ["Dubai Silicon Oasis", "Academic City", "Al Ain direction"],
    commonConfusion: "It is not a central Dubai road. Joining it accidentally can pull you away from the city core.",
    watchFor: "It is not a central Dubai road. Joining it accidentally can pull you away from the city core.",
    beginnerRule: "Use E66 when you are intentionally going inland or toward Al Ain, not for normal central Dubai movement.",
    lineClass: "road-e66",
    labelX: 69,
    labelY: 69,
    x1: 61,
    y1: 56,
    x2: 77,
    y2: 93
  }
];

const connectorRoads = [
  {
    id: "d61",
    code: "D61",
    name: "Hessa Street",
    shortName: "Hessa",
    category: "primaryConnector",
    priority: "core",
    type: "Cross-city connector",
    whatItDoes: "Connects New Dubai areas toward inland residential districts.",
    whenToUse: "Use it when moving between Dubai Marina/JLT side, Al Barsha, JVC, Sports City, and inland Dubai.",
    areasItHelpsWith: ["Dubai Marina side", "JLT side", "Al Barsha", "JVC", "Sports City"],
    connectsTo: ["E11", "E44", "E311"],
    commonConfusion: "Several exits and access roads branch off quickly around Al Barsha and JVC.",
    beginnerRule: "Use Hessa when crossing from New Dubai/coastal side toward inland residential areas.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }
    ],
    lineClass: "connector-line-d61",
    labelX: 28,
    labelY: 55,
    x1: 20,
    y1: 43,
    x2: 39,
    y2: 60
  },
  {
    id: "d63",
    code: "D63",
    name: "Umm Suqeim Street",
    shortName: "Umm Suqeim",
    category: "primaryConnector",
    priority: "core",
    type: "Cross-city connector",
    whatItDoes: "Connects coast-side Dubai toward Al Barsha, Al Quoz, and Al Khail-side access.",
    whenToUse: "Use it when moving between Jumeirah/Umm Suqeim side, Mall of the Emirates, Al Barsha, Al Quoz, or Al Khail.",
    areasItHelpsWith: ["Al Barsha", "Umm Suqeim", "Al Quoz", "Mall of the Emirates side", "Dubai Hills-side access"],
    connectsTo: ["E11", "E44"],
    commonConfusion: "The road crosses several corridors, so the issue is choosing the correct side road before the destination.",
    beginnerRule: "Use D63 when moving across Dubai from coast-side to inland-side.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }
    ],
    lineClass: "connector-line-d63",
    labelX: 33,
    labelY: 45,
    x1: 32,
    y1: 41,
    x2: 45,
    y2: 60
  },
  {
    id: "d89",
    code: "D89",
    name: "Airport Road",
    shortName: "Airport Rd",
    category: "primaryConnector",
    priority: "core",
    type: "Airport-side connector",
    whatItDoes: "Serves Deira, Dubai Airport, Rashidiya, and Mirdif-side movement.",
    whenToUse: "Use it when travelling toward Dubai Airport, Deira, Mirdif, or airport-side Dubai.",
    areasItHelpsWith: ["Deira", "Mirdif", "Dubai Airport", "Rashidiya"],
    connectsTo: ["E11", "E311"],
    commonConfusion: "Airport-side lanes split quickly toward terminals, Deira, Sharjah-side roads, or Mirdif.",
    beginnerRule: "Before joining Airport Road, know whether you are going airport-side, Deira-side, or Mirdif-side.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }
    ],
    lineClass: "connector-line-d89",
    labelX: 82,
    labelY: 53,
    x1: 76,
    y1: 38,
    x2: 90,
    y2: 61
  },
  {
    id: "d75",
    code: "D75",
    name: "Sheikh Rashid Road",
    shortName: "Rashid Rd",
    category: "primaryConnector",
    priority: "core",
    type: "Old Dubai connector",
    whatItDoes: "Links Bur Dubai, Karama, Oud Metha, and routes toward Deira or central Dubai.",
    whenToUse: "Use it when moving around Bur Dubai, Karama, Oud Metha, or Creek-side access.",
    areasItHelpsWith: ["Karama", "Bur Dubai", "Oud Metha", "Deira-side access"],
    connectsTo: ["E11", "Old Dubai connectors"],
    commonConfusion: "Old Dubai has dense local roads, bridge choices, and short decision points.",
    beginnerRule: "Use the main connector first, then enter smaller old-Dubai roads late.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }
    ],
    lineClass: "connector-line-d75",
    labelX: 73,
    labelY: 36,
    x1: 65,
    y1: 37,
    x2: 83,
    y2: 39
  },
  {
    id: "d71",
    code: "D71",
    name: "Financial Centre Road",
    shortName: "Financial Ctr",
    category: "primaryConnector",
    priority: "core",
    type: "Central Dubai connector",
    whatItDoes: "Connects E11/SZR-side movement to Downtown, Dubai Mall, DIFC, and Business Bay access.",
    whenToUse: "Use it when moving between Sheikh Zayed Road, Downtown Dubai, Dubai Mall, DIFC, or Business Bay.",
    areasItHelpsWith: ["Downtown Dubai", "Business Bay", "DIFC", "Dubai Mall"],
    connectsTo: ["E11", "E44"],
    commonConfusion: "Dubai Mall and Downtown access loops are not interchangeable once you enter them.",
    beginnerRule: "Know whether you need Dubai Mall, Boulevard, DIFC, or Business Bay before entering the loop.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }
    ],
    lineClass: "connector-line-d71",
    labelX: 56,
    labelY: 44,
    x1: 54,
    y1: 39,
    x2: 63,
    y2: 58
  }
];

const secondaryConnectorRoads = [
  {
    id: "d92",
    code: "D92",
    name: "Al Wasl Road",
    shortName: "Al Wasl",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Coastal city connector",
    whatItDoes: "Supports movement through Jumeirah, Al Wasl, Safa, and coastal-side Dubai.",
    whenToUse: "Use it when travelling along the Jumeirah/Al Wasl side instead of using Sheikh Zayed Road.",
    areasItHelpsWith: ["Jumeirah", "Umm Suqeim", "Al Wasl", "Safa", "Downtown-side access"],
    connectsTo: ["D94", "D63", "D71", "E11-side access"],
    commonConfusion: "It runs close to coastal areas but does not behave like a fast highway.",
    beginnerRule: "Use Al Wasl Road for local coastal-side movement, not long-distance Dubai movement.",
    relatedRoads: [
      { code: "D94", label: "Jumeirah Beach Road", roadId: "d94", roadType: "secondaryConnector", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d92",
    labelX: 47,
    labelY: 34,
    x1: 34,
    y1: 35,
    x2: 66,
    y2: 33
  },
  {
    id: "d94",
    code: "D94",
    name: "Jumeirah Beach Road",
    shortName: "Beach Rd",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Coastal access road",
    whatItDoes: "Runs along the Jumeirah/coastal side and supports beach, residential, and local access.",
    whenToUse: "Use it for Jumeirah, Umm Suqeim, beach-side destinations, and local coastal movement.",
    areasItHelpsWith: ["Jumeirah", "Umm Suqeim", "Dubai Marina-side coastal movement"],
    connectsTo: ["D92", "D63", "coastal access roads"],
    commonConfusion: "It can look close to destinations but is slower and more local than the main highway network.",
    beginnerRule: "Use Jumeirah Beach Road for local coast-side access, not fast cross-city travel.",
    relatedRoads: [
      { code: "D92", label: "Al Wasl Road", roadId: "d92", roadType: "secondaryConnector", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d94",
    labelX: 42,
    labelY: 27,
    x1: 28,
    y1: 29,
    x2: 61,
    y2: 27
  },
  {
    id: "d78",
    code: "D78",
    name: "Oud Metha Road",
    shortName: "Oud Metha",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Old Dubai connector",
    whatItDoes: "Connects Oud Metha, Karama, Bur Dubai, and routes toward Healthcare City and Creek-side areas.",
    whenToUse: "Use it for movement around Karama, Oud Metha, Bur Dubai, and old-Dubai access.",
    areasItHelpsWith: ["Karama", "Oud Metha", "Bur Dubai", "Healthcare City"],
    connectsTo: ["D75", "D89", "old Dubai connectors"],
    commonConfusion: "Nearby areas are close together but access roads split quickly.",
    beginnerRule: "In old Dubai, use the bigger connector first, then enter local streets late.",
    relatedRoads: [
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
      { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d78",
    labelX: 73,
    labelY: 28,
    x1: 70,
    y1: 32,
    x2: 80,
    y2: 46
  },
  {
    id: "d85",
    code: "D85",
    name: "Baniyas Road",
    shortName: "Baniyas",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Deira / creek-side road",
    whatItDoes: "Supports Deira and Creek-side movement around older Dubai.",
    whenToUse: "Use it when moving within Deira or along the Creek-side network.",
    areasItHelpsWith: ["Deira", "Creek-side Dubai", "Al Rigga-side access"],
    connectsTo: ["D89", "D75", "Creek crossings"],
    commonConfusion: "Small roads, creek crossings, and dense traffic make direction choices important.",
    beginnerRule: "For Deira, first decide creek-side, airport-side, or Sharjah-side.",
    relatedRoads: [
      { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d85",
    labelX: 84,
    labelY: 22,
    x1: 79,
    y1: 28,
    x2: 93,
    y2: 31
  },
  {
    id: "d70",
    code: "D70",
    name: "Al Meydan Road",
    shortName: "Meydan",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Central / inland connector",
    whatItDoes: "Connects Business Bay, Meydan, Nad Al Sheba-side movement, and inland central Dubai.",
    whenToUse: "Use it for Meydan, Nad Al Sheba, and routes between central Dubai and inland districts.",
    areasItHelpsWith: ["Meydan", "Business Bay", "Nad Al Sheba"],
    connectsTo: ["E44", "D71", "E66-side movement"],
    commonConfusion: "It can pull users away from central Dubai if they are not aiming for Meydan or inland access.",
    beginnerRule: "Use Meydan Road when your destination is central-inland, not when you need coastal or old-Dubai access.",
    relatedRoads: [
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d70",
    labelX: 64,
    labelY: 59,
    x1: 60,
    y1: 52,
    x2: 73,
    y2: 70
  },
  {
    id: "d54",
    code: "D54",
    name: "Zabeel Road",
    shortName: "Zabeel",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Central Dubai connector",
    whatItDoes: "Supports movement around Zabeel, Trade Centre, Karama-side access, and central Dubai.",
    whenToUse: "Use it for central Dubai movement between old Dubai, Trade Centre, and Zabeel-side areas.",
    areasItHelpsWith: ["Trade Centre", "Zabeel", "Karama", "DIFC-side access"],
    connectsTo: ["E11", "D75", "D71"],
    commonConfusion: "Central Dubai roads are close together but often separated by interchanges and one-way access.",
    beginnerRule: "In central Dubai, identify the side of the interchange before following the final pin.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
      { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
    ],
    lineClass: "secondary-connector-line-d54",
    labelX: 69,
    labelY: 35,
    x1: 65,
    y1: 34,
    x2: 76,
    y2: 39
  },
  {
    id: "d57",
    code: "D57",
    name: "Al Qudra Road",
    shortName: "Qudra",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Outer / desert-side connector",
    whatItDoes: "Connects inland residential areas toward Dubai Studio City, Arabian Ranches, and desert-side routes.",
    whenToUse: "Use it for Dubai Studio City, Arabian Ranches, Al Qudra-side movement, and outer residential areas.",
    areasItHelpsWith: ["Motor City", "Sports City", "Arabian Ranches", "Studio City", "Al Qudra-side access"],
    connectsTo: ["E611", "E311", "E44-side access"],
    commonConfusion: "It feels far from central Dubai and can create long detours if selected accidentally.",
    beginnerRule: "Use Al Qudra Road only when your destination is clearly outer/inland residential or desert-side.",
    relatedRoads: [
      { code: "E611", label: "E611", roadId: "e611", roadType: "highway", available: true },
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }
    ],
    lineClass: "secondary-connector-line-d57",
    labelX: 39,
    labelY: 88,
    x1: 26,
    y1: 82,
    x2: 55,
    y2: 92
  },
  {
    id: "d83",
    code: "D83",
    name: "Tripoli Street",
    shortName: "Tripoli",
    category: "secondaryConnector",
    priority: "secondary",
    type: "Inland connector",
    whatItDoes: "Supports Mirdif, Warqa, and airport/inland Dubai movement.",
    whenToUse: "Use it when moving between Mirdif-side areas and inland Dubai corridors.",
    areasItHelpsWith: ["Mirdif", "Warqa", "Airport-side Dubai", "E311-side access"],
    connectsTo: ["E311", "Airport-side roads"],
    commonConfusion: "It feels separate from central Dubai, so SZR/E11-based orientation does not help much.",
    beginnerRule: "Think of Tripoli Street as an airport/inland connector, not a central-city road.",
    relatedRoads: [
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }
    ],
    lineClass: "secondary-connector-line-d83",
    labelX: 86,
    labelY: 66,
    x1: 79,
    y1: 62,
    x2: 93,
    y2: 77
  }
];

const allConnectorRoads = [...connectorRoads, ...secondaryConnectorRoads];

const areaRegions = {
  "dubai-marina": "New Dubai / coast-side corridor",
  jlt: "New Dubai / inland side of E11",
  "al-barsha": "Inland-west Dubai",
  jvc: "Inland-west residential Dubai",
  downtown: "Central Dubai",
  "business-bay": "Central Dubai / canal-side business district",
  karama: "Old-central Dubai",
  "bur-dubai": "Old Dubai / Creek-side",
  deira: "Old Dubai / airport and Creek-side",
  mirdif: "Airport-side / inland Dubai",
  jumeirah: "Coast-side Dubai",
  "umm-suqeim": "Coast-to-inland transition",
  "al-quoz": "Inland industrial/commercial Dubai",
  "dubai-hills": "Inland-west master community",
  meydan: "Central-inland Dubai",
  difc: "Central business corridor",
  "trade-centre": "Central Sheikh Zayed Road corridor",
  "oud-metha": "Old-central Dubai",
  rashidiya: "Airport-side Dubai",
  "dubai-silicon-oasis": "Inland south-east Dubai",
  "international-city": "Inland east Dubai",
  "jebel-ali": "South-west / Abu Dhabi-side Dubai"
};

const areaMarkers = [
  {
    id: "dubai-marina",
    name: "Dubai Marina",
    x: 17,
    y: 34,
    width: 10,
    height: 7,
    howToThink: "A dense coastal district beside Sheikh Zayed Road, close to JLT and JBR.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road"],
    connectors: ["Marina access roads", "JBR-side roads", "Interchange access from SZR"],
    driverConfusion: "Drivers often confuse Marina, JBR, and JLT because they sit close together but use different access patterns.",
    beginnerRule: "Know whether your destination is Marina-side, JBR-side, or JLT-side before leaving E11.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }
    ]
  },
  {
    id: "jlt",
    name: "JLT",
    x: 23,
    y: 44,
    width: 9,
    height: 7,
    howToThink: "A cluster-based district opposite Dubai Marina, accessed mainly from Sheikh Zayed Road.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road"],
    connectors: ["JLT cluster roads", "DMCC access roads"],
    driverConfusion: "Entering the wrong cluster loop can waste time even after reaching the correct area.",
    beginnerRule: "Find the cluster first. Then follow the internal route.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }
    ]
  },
  {
    id: "al-barsha",
    name: "Al Barsha",
    x: 37,
    y: 50,
    width: 12,
    height: 8,
    howToThink: "An inland-west Dubai area around Mall of the Emirates, sitting between E11, Umm Suqeim Street, Hessa Street, and Al Khail-side access.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"],
    connectors: ["Umm Suqeim Street", "Hessa Street"],
    driverConfusion: "The main issue is service-road access near Mall of the Emirates and choosing the wrong side of Al Barsha.",
    beginnerRule: "Decide your approach first: E11 side, Al Khail side, Hessa side, or Umm Suqeim side.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D61", label: "Hessa Street", roadId: "d61", roadType: "connector", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
    ]
  },
  {
    id: "jvc",
    name: "JVC",
    x: 40,
    y: 66,
    width: 11,
    height: 9,
    howToThink: "An inland residential area reached through connector roads rather than one simple main entrance.",
    mainRoadAccess: ["E44 / Al Khail Road", "E311 / Sheikh Mohammed Bin Zayed Road"],
    connectors: ["Hessa Street", "Al Khail access roads"],
    driverConfusion: "JVC has multiple gates and circular internal movement, so the wrong entry can create a long loop.",
    beginnerRule: "Choose the entry based on where you are coming from, not just the destination pin.",
    relatedRoads: [
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
      { code: "D61", label: "Hessa Street", roadId: "d61", roadType: "connector", available: true }
    ]
  },
  {
    id: "downtown",
    name: "Downtown Dubai",
    x: 61,
    y: 36,
    width: 12,
    height: 8,
    howToThink: "A central landmark district around Dubai Mall and Burj Khalifa, connected to both E11 and Al Khail-side roads.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"],
    connectors: ["Financial Centre Road", "Dubai Mall access roads", "Business Bay access roads"],
    driverConfusion: "The confusing part is not reaching Downtown. It is choosing the right Dubai Mall, Boulevard, or tower access loop.",
    beginnerRule: "Know whether you are going to Dubai Mall, Boulevard, DIFC-side, or Business Bay-side.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
    ]
  },
  {
    id: "business-bay",
    name: "Business Bay",
    x: 61,
    y: 49,
    width: 12,
    height: 8,
    howToThink: "A central business district between Downtown, Sheikh Zayed Road, the canal, and Al Khail Road.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"],
    connectors: ["Al Khail Road", "Financial Centre Road", "Business Bay internal roads"],
    driverConfusion: "Many destinations are close on the map but separated by canal-side roads, tower access roads, and one-way movements.",
    beginnerRule: "Check whether the destination is SZR-side, canal-side, or Al Khail-side before entering.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
    ]
  },
  {
    id: "karama",
    name: "Karama",
    x: 75,
    y: 38,
    width: 10,
    height: 7,
    howToThink: "A dense older central Dubai area near Bur Dubai and Oud Metha.",
    mainRoadAccess: ["Oud Metha Road", "Sheikh Khalifa Bin Zayed Street", "Sheikh Rashid Road"],
    connectors: ["Oud Metha Road", "Al Mankhool-side access", "Bur Dubai connectors"],
    driverConfusion: "Small internal roads and parking access can make the final part harder than the main trip.",
    beginnerRule: "Use the bigger connector road first. Enter the small streets late.",
    relatedRoads: [
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
      { code: "D78", label: "Oud Metha Road", roadId: "d78", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "bur-dubai",
    name: "Bur Dubai",
    x: 78,
    y: 29,
    width: 12,
    height: 8,
    howToThink: "An older central district connected to Karama, Deira, Oud Metha, and the Creek-side road network.",
    mainRoadAccess: ["Sheikh Rashid Road", "Oud Metha Road", "Al Mankhool Road"],
    connectors: ["Creek crossing routes", "Karama connectors", "Oud Metha access"],
    driverConfusion: "Drivers often mix up Bur Dubai, Karama, Oud Metha, and Deira-side access.",
    beginnerRule: "First decide which side of the Creek or old-Dubai network you need.",
    relatedRoads: [
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
      { code: "D78", label: "Oud Metha Road", roadId: "d78", roadType: "secondaryConnector", available: true },
      { code: "D92", label: "Al Mankhool / Jumeirah-side access", roadId: null, available: false }
    ]
  },
  {
    id: "deira",
    name: "Deira",
    x: 86,
    y: 31,
    width: 14,
    height: 9,
    howToThink: "An older Dubai district on the Creek and airport side, with dense roads and several bridge/crossing choices.",
    mainRoadAccess: ["Airport Road", "Baniyas Road", "E11-side access"],
    connectors: ["Al Maktoum Bridge routes", "Airport Road", "Creek-side roads"],
    driverConfusion: "The main confusion is choosing the wrong bridge, creek crossing, or airport-side direction.",
    beginnerRule: "Before entering Deira, know whether you are going creek-side, airport-side, or Sharjah-side.",
    relatedRoads: [
      { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
      { code: "D85", label: "Baniyas Road", roadId: "d85", roadType: "secondaryConnector", available: true },
      { code: "E11", label: "E11-side access", roadId: "e11", roadType: "highway", available: true }
    ]
  },
  {
    id: "mirdif",
    name: "Mirdif",
    x: 88,
    y: 67,
    width: 12,
    height: 9,
    howToThink: "An inland residential area near airport-side Dubai, away from the central E11/SZR corridor.",
    mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road", "Airport Road"],
    connectors: ["Tripoli Street", "Airport Road", "Mirdif internal roads"],
    driverConfusion: "It is easy to confuse Mirdif routes with airport, Mushrif, or Rashidiya-side roads.",
    beginnerRule: "Think of Mirdif as airport/inland Dubai, not central Dubai.",
    relatedRoads: [
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
      { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
      { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "secondaryConnector", available: true }
    ]
  }
];

const areaNearbyAreas = {
  "dubai-marina": ["JLT", "Jumeirah Beach Residence", "Jumeirah Lake Towers"],
  jlt: ["Dubai Marina", "Al Barsha", "JVC"],
  "al-barsha": ["Umm Suqeim", "Al Quoz", "Dubai Hills", "JVC"],
  jvc: ["Al Barsha", "Dubai Hills", "Dubai Marina side"],
  downtown: ["Business Bay", "DIFC", "Trade Centre"],
  "business-bay": ["Downtown Dubai", "DIFC", "Al Quoz"],
  karama: ["Bur Dubai", "Oud Metha", "Deira"],
  "bur-dubai": ["Karama", "Oud Metha", "Deira"],
  deira: ["Bur Dubai", "Rashidiya", "Mirdif"],
  mirdif: ["Rashidiya", "Deira", "International City"]
};

const secondaryAreas = [
  {
    id: "jumeirah",
    name: "Jumeirah",
    priority: "secondary",
    x: 48,
    y: 28,
    width: 18,
    height: 8,
    howToThink: "A coastal-side residential and lifestyle corridor between beach-side roads and inland city connectors.",
    mainRoadAccess: ["D92 / Al Wasl Road", "D94 / Jumeirah Beach Road"],
    connectors: ["D63 / Umm Suqeim Street", "D92 / Al Wasl Road"],
    nearbyAreas: ["Umm Suqeim", "Al Wasl", "Downtown-side access"],
    driverConfusion: "It is easy to stay on a slow coastal road when a connector would be cleaner.",
    beginnerRule: "Use Jumeirah roads for local coastal access, not fast cross-city movement.",
    relatedRoads: [
      { code: "D92", label: "Al Wasl Road", roadId: "d92", roadType: "secondaryConnector", available: true },
      { code: "D94", label: "Jumeirah Beach Road", roadId: "d94", roadType: "secondaryConnector", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true },
    ]
  },
  {
    id: "umm-suqeim",
    name: "Umm Suqeim",
    priority: "secondary",
    x: 39,
    y: 36,
    width: 16,
    height: 8,
    howToThink: "A coastal-to-inland transition area connected strongly by Umm Suqeim Street.",
    mainRoadAccess: ["D63 / Umm Suqeim Street", "D92 / Al Wasl Road", "D94 / Jumeirah Beach Road"],
    connectors: ["D63 / Umm Suqeim Street"],
    nearbyAreas: ["Jumeirah", "Al Barsha", "Al Quoz"],
    driverConfusion: "Users confuse coast-side access with inland access toward Al Barsha and Al Quoz.",
    beginnerRule: "Use D63 when moving from Umm Suqeim toward inland Dubai.",
    relatedRoads: [
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true },
      { code: "D92", label: "Al Wasl Road", roadId: "d92", roadType: "secondaryConnector", available: true },
      { code: "D94", label: "Jumeirah Beach Road", roadId: "d94", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "al-quoz",
    name: "Al Quoz",
    priority: "secondary",
    x: 48,
    y: 52,
    width: 16,
    height: 10,
    howToThink: "An inland industrial/commercial area between Al Barsha, Al Khail, and central Dubai.",
    mainRoadAccess: ["E44 / Al Khail Road", "D63 / Umm Suqeim Street"],
    connectors: ["Umm Suqeim Street", "Al Khail access roads"],
    nearbyAreas: ["Al Barsha", "Business Bay", "Dubai Hills"],
    driverConfusion: "Industrial-area access roads can be indirect and may not connect the way they look on a map.",
    beginnerRule: "Use the main connector first, then solve the internal access road.",
    relatedRoads: [
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
    ]
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills",
    priority: "secondary",
    x: 38,
    y: 61,
    width: 15,
    height: 10,
    howToThink: "An inland master community connected through Al Khail and Umm Suqeim-side access.",
    mainRoadAccess: ["E44 / Al Khail Road", "D63 / Umm Suqeim Street"],
    connectors: ["Al Khail access roads", "Umm Suqeim Street"],
    nearbyAreas: ["Al Barsha", "Al Quoz", "JVC"],
    driverConfusion: "The destination can be close to Al Khail but still require a specific access loop.",
    beginnerRule: "Do not leave the main road until you know the correct community-side access.",
    relatedRoads: [
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
    ]
  },
  {
    id: "difc",
    name: "DIFC",
    priority: "secondary",
    x: 64,
    y: 34,
    width: 8,
    height: 5,
    howToThink: "A central business district beside E11 and close to Downtown and Trade Centre.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road", "Financial Centre Road"],
    connectors: ["Financial Centre Road", "SZR service roads"],
    nearbyAreas: ["Downtown Dubai", "Trade Centre", "Business Bay"],
    driverConfusion: "Tower access and service-road choice matter more than the final pin.",
    beginnerRule: "Know whether you need DIFC, Downtown, or Trade Centre before leaving E11.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
    ]
  },
  {
    id: "trade-centre",
    name: "Trade Centre",
    priority: "secondary",
    x: 67,
    y: 31,
    width: 11,
    height: 7,
    howToThink: "A central E11 landmark area between DIFC, Downtown access, and Old Dubai movement.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road"],
    connectors: ["SZR service roads", "World Trade Centre access roads"],
    nearbyAreas: ["DIFC", "Downtown Dubai", "Karama"],
    driverConfusion: "It is easy to overshoot the correct side of E11 or enter the wrong service road.",
    beginnerRule: "Pick the correct side of Sheikh Zayed Road before the final approach.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "D54", label: "Zabeel Road", roadId: "d54", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "oud-metha",
    name: "Oud Metha",
    priority: "secondary",
    x: 74,
    y: 25,
    width: 11,
    height: 7,
    howToThink: "An Old Dubai connector area between Karama, Bur Dubai, and Creek-side movement.",
    mainRoadAccess: ["Sheikh Rashid Road", "Oud Metha Road"],
    connectors: ["Sheikh Rashid Road", "Oud Metha Road"],
    nearbyAreas: ["Karama", "Bur Dubai", "Deira"],
    driverConfusion: "Short local decisions happen quickly around hospitals, schools, and Creek crossings.",
    beginnerRule: "Use the larger Old Dubai connector first, then enter local roads late.",
    relatedRoads: [
      { code: "D78", label: "Oud Metha Road", roadId: "d78", roadType: "secondaryConnector", available: true },
      { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }
    ]
  },
  {
    id: "rashidiya",
    name: "Rashidiya",
    priority: "secondary",
    x: 84,
    y: 45,
    width: 13,
    height: 8,
    howToThink: "An airport-side area between Deira, Mirdif, Airport Road, and inland movement.",
    mainRoadAccess: ["Airport Road", "E311-side access"],
    connectors: ["Airport Road", "Tripoli Street"],
    nearbyAreas: ["Mirdif", "Deira", "International City"],
    driverConfusion: "Airport, Deira, and Mirdif movements split close together.",
    beginnerRule: "Decide whether you are airport-side, Deira-side, or Mirdif-side before the split.",
    relatedRoads: [
      { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
      { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "dubai-silicon-oasis",
    name: "Dubai Silicon Oasis",
    priority: "secondary",
    x: 78,
    y: 72,
    width: 18,
    height: 10,
    howToThink: "An inland south-east area connected more to E311/E66 logic than central Dubai.",
    mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road", "E66 / Dubai-Al Ain Road"],
    connectors: ["E311 access roads", "E66 access roads"],
    nearbyAreas: ["International City", "Mirdif", "Academic City-side areas"],
    driverConfusion: "It can feel close to city Dubai on the map but behaves like an inland-area route.",
    beginnerRule: "Think inland first: E311/E66 matter more than E11.",
    relatedRoads: [
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
      { code: "E66", label: "E66", roadId: "e66", roadType: "highway", available: true }
    ]
  },
  {
    id: "international-city",
    name: "International City",
    priority: "secondary",
    x: 83,
    y: 65,
    width: 18,
    height: 10,
    howToThink: "An inland east Dubai area connected through E311-side and airport/inland movement.",
    mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road"],
    connectors: ["E311 access roads", "Tripoli Street-side movement"],
    nearbyAreas: ["Mirdif", "Rashidiya", "Dubai Silicon Oasis"],
    driverConfusion: "Cluster access and inland approaches can make the final part feel indirect.",
    beginnerRule: "Use E311 as the main anchor, then solve the cluster-side access.",
    relatedRoads: [
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
      { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "meydan",
    name: "Meydan",
    priority: "secondary",
    x: 61,
    y: 64,
    width: 16,
    height: 11,
    howToThink: "A central-inland area connected to Business Bay, Al Khail, and inland Dubai.",
    mainRoadAccess: ["E44 / Al Khail Road", "D70 / Al Meydan Road"],
    connectors: ["D70 / Al Meydan Road"],
    nearbyAreas: ["Business Bay", "Al Quoz", "Nad Al Sheba"],
    driverConfusion: "It feels close to Downtown, but access often works through inland connectors.",
    beginnerRule: "Think of Meydan as central-inland, not Downtown-side.",
    relatedRoads: [
      { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
      { code: "D70", label: "Al Meydan Road", roadId: "d70", roadType: "secondaryConnector", available: true }
    ]
  },
  {
    id: "jebel-ali",
    name: "Jebel Ali",
    priority: "secondary",
    x: 11,
    y: 74,
    width: 18,
    height: 10,
    howToThink: "A south-west Dubai area connected to industrial, port, free zone, and Abu Dhabi-side movement.",
    mainRoadAccess: ["E11 / Sheikh Zayed Road", "E311 / Sheikh Mohammed Bin Zayed Road"],
    connectors: ["Jebel Ali access roads", "port/free zone roads"],
    nearbyAreas: ["Dubai Marina", "Dubai South-side routes", "Abu Dhabi direction"],
    driverConfusion: "Industrial/free-zone access roads are not always interchangeable.",
    beginnerRule: "For Jebel Ali, know whether you need port, free zone, residential, or Abu Dhabi-side access.",
    relatedRoads: [
      { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
      { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }
    ]
  }
];

areaMarkers.forEach((area) => {
  area.priority = area.priority || "core";
  area.region = areaRegions[area.id] || area.region || "Dubai";
  area.nearbyAreas = area.nearbyAreas || areaNearbyAreas[area.id] || [];
});
const allAreas = [...areaMarkers, ...secondaryAreas].map((area) => ({
  ...area,
  region: area.region || areaRegions[area.id] || "Dubai"
}));

const routeModeTitle = "Route Logic & Reasoning";
const mistakeModeTitle = "Learn Common Road Mistakes";

const routeLogics = [
  {
    id: "al-barsha-downtown",
    title: "Al Barsha → Downtown Dubai",
    fromAreaId: "al-barsha",
    toAreaId: "downtown",
    involvedRoadIds: ["e11", "e44"],
    involvedConnectorIds: ["d63", "d71"],
    roadChips: [
      { code: "E11", id: "e11", type: "highway" },
      { code: "E44", id: "e44", type: "highway" },
      { code: "D63", id: "d63", type: "connector" },
      { code: "D71", id: "d71", type: "connector" }
    ],
    whatYouAreDoing: "Moving from inland-west Dubai toward the central landmark/business district.",
    routeShape: "Area → connector road → major highway choice → Downtown access loop.",
    mainRouteIdea: "Use either E11/SZR-side access or Al Khail-side access depending on where in Al Barsha you start.",
    roadChoice: "E11/SZR side works if you are closer to Mall of the Emirates or Sheikh Zayed Road. Al Khail side works if you are already inland or closer to Al Khail.",
    criticalDecision: "Choose early whether you are approaching Downtown from E11/SZR side or Al Khail/Business Bay side.",
    commonMistake: "Following the destination pin too late and entering the wrong Dubai Mall / Boulevard access loop.",
    beginnerRule: "For Downtown, the final access loop matters almost as much as the main highway choice."
  },
  {
    id: "dubai-marina-deira",
    fromAreaId: "dubai-marina",
    toAreaId: "deira",
    title: "Dubai Marina → Deira",
    involvedRoadIds: ["e11"],
    involvedConnectorIds: ["d89"],
    roadChips: [
      { code: "E11", id: "e11", type: "highway" },
      { code: "D89", id: "d89", type: "connector" }
    ],
    whatYouAreDoing: "Moving from the New Dubai coastal corridor toward Old Dubai and the airport-side road network.",
    routeShape: "Coastal/New Dubai corridor → central highway movement → old Dubai / airport-side access.",
    mainRouteIdea: "Stay oriented around E11 first, then understand whether Deira access is creek-side, airport-side, or Sharjah-side.",
    roadChoice: "E11 gives you the long city spine. D89 becomes relevant when the trip shifts toward Deira and airport-side access.",
    criticalDecision: "Decide whether your final Deira approach is creek-side, airport-side, or Sharjah-side before leaving the main corridor.",
    commonMistake: "Treating Deira like a simple final pin and choosing the wrong creek/airport approach.",
    beginnerRule: "For Marina to Deira, first solve the long corridor, then solve the Old Dubai entry."
  },
  {
    id: "karama-al-barsha",
    fromAreaId: "karama",
    toAreaId: "al-barsha",
    title: "Karama → Al Barsha",
    involvedRoadIds: ["e11", "e44"],
    involvedConnectorIds: ["d63", "d75"],
    roadChips: [
      { code: "E11", id: "e11", type: "highway" },
      { code: "E44", id: "e44", type: "highway" },
      { code: "D63", id: "d63", type: "connector" },
      { code: "D75", id: "d75", type: "connector" }
    ],
    whatYouAreDoing: "Moving from dense old/central Dubai toward an inland-west residential and mall-side area.",
    routeShape: "Dense old/central Dubai → main connector/highway → inland-west area.",
    mainRouteIdea: "Exit dense Karama roads using a bigger connector before worrying about the final Al Barsha side.",
    roadChoice: "E11 can work if you are joining the SZR side. E44 and D63 make more sense when the movement is inland or Al Khail-side.",
    criticalDecision: "Choose the larger exit corridor out of Karama before deciding the Al Barsha final side.",
    commonMistake: "Staying on small roads too long or entering the wrong Al Barsha service road.",
    beginnerRule: "From Karama, escape the dense local grid first. Then think about Al Barsha access."
  },
  {
    id: "jvc-business-bay",
    fromAreaId: "jvc",
    toAreaId: "business-bay",
    title: "JVC → Business Bay",
    involvedRoadIds: ["e44"],
    involvedConnectorIds: ["d61", "d71"],
    roadChips: [
      { code: "E44", id: "e44", type: "highway" },
      { code: "D61", id: "d61", type: "connector" },
      { code: "D71", id: "d71", type: "connector" }
    ],
    whatYouAreDoing: "Moving from an inland residential area toward the central business district.",
    routeShape: "Inland residential area → Al Khail-side movement → central business district.",
    mainRouteIdea: "Choose the correct JVC exit first, then use Al Khail/central connectors.",
    roadChoice: "E44 is the main mental anchor. D61 helps you leave JVC cleanly, while D71 helps with central/Downtown-side access.",
    criticalDecision: "Pick the JVC gate and exit direction before thinking about the central Dubai final turn.",
    commonMistake: "Leaving JVC from the wrong gate and creating an unnecessary loop.",
    beginnerRule: "In JVC, the first gate choice can decide whether the whole route feels simple or messy."
  },
  {
    id: "mirdif-dubai-marina",
    fromAreaId: "mirdif",
    toAreaId: "dubai-marina",
    title: "Mirdif → Dubai Marina",
    involvedRoadIds: ["e311", "e11", "e44"],
    involvedConnectorIds: ["d83", "d89"],
    roadChips: [
      { code: "E311", id: "e311", type: "highway" },
      { code: "E44", id: "e44", type: "highway" },
      { code: "E11", id: "e11", type: "highway" },
      { code: "D83", id: "d83", type: "secondaryConnector" },
      { code: "D89", id: "d89", type: "connector" }
    ],
    whatYouAreDoing: "Moving from airport/inland Dubai toward the New Dubai coastal corridor.",
    routeShape: "Airport/inland Dubai → cross-city movement → New Dubai/coastal corridor.",
    mainRouteIdea: "First leave the airport/Mirdif side cleanly, then choose whether to cross via inland highways or central roads.",
    roadChoice: "E311 and E44 are useful inland anchors. E11 becomes useful when you are aligning with the Marina/SZR coastal corridor.",
    criticalDecision: "Choose the cross-city corridor before you are forced into airport-side or central-side roads.",
    commonMistake: "Confusing airport-side roads with central Dubai access, then switching corridors too late.",
    beginnerRule: "For Mirdif to Marina, solve the side of Dubai first, then solve the final coastal access."
  }
];

routeLogics.push(
  {
    id: "jumeirah-al-barsha",
    title: "Jumeirah → Al Barsha",
    fromAreaId: "jumeirah",
    toAreaId: "al-barsha",
    involvedRoadIds: ["e11", "e44"],
    involvedConnectorIds: ["d63", "d92", "d94"],
    roadChips: [
      { code: "D94", id: "d94", type: "secondaryConnector" },
      { code: "D92", id: "d92", type: "secondaryConnector" },
      { code: "D63", id: "d63", type: "connector" },
      { code: "E11", id: "e11", type: "highway" },
      { code: "E44", id: "e44", type: "highway" }
    ],
    whatYouAreDoing: "Moving from the coast-side Jumeirah corridor toward inland-west Dubai.",
    routeShape: "Coast-side area → local coastal connector → D63 cross-city connector → Al Barsha access side.",
    mainRouteIdea: "Use Jumeirah-side roads only as local feeders, then switch to D63 or the relevant highway corridor before the final Al Barsha side.",
    roadChoice: "D92/D94 are local coastal choices. D63 is the clearer cross-city mental anchor toward Al Barsha, with E11 or E44 useful depending on your start side.",
    criticalDecision: "Decide early whether you are staying local on the coast or crossing inland through D63.",
    commonMistake: "Staying on slow coastal roads too long, then trying to cut inland late.",
    beginnerRule: "For Jumeirah to Al Barsha, use coastal roads to leave the area, not as the whole route."
  },
  {
    id: "dso-downtown",
    title: "Dubai Silicon Oasis → Downtown Dubai",
    fromAreaId: "dubai-silicon-oasis",
    toAreaId: "downtown",
    involvedRoadIds: ["e66", "e44"],
    involvedConnectorIds: ["d71"],
    roadChips: [
      { code: "E66", id: "e66", type: "highway" },
      { code: "E44", id: "e44", type: "highway" },
      { code: "D71", id: "d71", type: "connector" }
    ],
    whatYouAreDoing: "Moving from inland south-east Dubai toward the central landmark/business district.",
    routeShape: "Inland south-east area → regional/inland highway → central access connector → Downtown loop.",
    mainRouteIdea: "Use E66/E44 as the inland movement anchors before solving Downtown's final access loop.",
    roadChoice: "E66 helps leave Dubai Silicon Oasis, while E44 helps align with central Dubai. D71 becomes relevant near Downtown/DIFC access.",
    criticalDecision: "Shift from inland highway thinking to Downtown access-loop thinking before the final approach.",
    commonMistake: "Treating Downtown as a single pin and entering the wrong mall, boulevard, or DIFC-side access.",
    beginnerRule: "From DSO to Downtown, first solve the inland corridor, then solve the final access loop."
  }
);

const routeLogicRelations = {
  "al-barsha-downtown": {
    relatedAreaIds: ["al-barsha", "downtown"],
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d63", "d71"],
    relatedSecondaryConnectorIds: []
  },
  "dubai-marina-deira": {
    relatedAreaIds: ["dubai-marina", "deira"],
    relatedRoadIds: ["e11"],
    relatedConnectorIds: ["d89"],
    relatedSecondaryConnectorIds: []
  },
  "karama-al-barsha": {
    relatedAreaIds: ["karama", "al-barsha"],
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d75", "d63"],
    relatedSecondaryConnectorIds: []
  },
  "jvc-business-bay": {
    relatedAreaIds: ["jvc", "business-bay"],
    relatedRoadIds: ["e44"],
    relatedConnectorIds: ["d61", "d71"],
    relatedSecondaryConnectorIds: []
  },
  "mirdif-dubai-marina": {
    relatedAreaIds: ["mirdif", "dubai-marina"],
    relatedRoadIds: ["e311", "e44", "e11"],
    relatedConnectorIds: ["d89"],
    relatedSecondaryConnectorIds: ["d83"]
  },
  "jumeirah-al-barsha": {
    relatedAreaIds: ["jumeirah", "umm-suqeim", "al-barsha"],
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d63"],
    relatedSecondaryConnectorIds: ["d92", "d94"]
  },
  "dso-downtown": {
    relatedAreaIds: ["dubai-silicon-oasis", "downtown"],
    relatedRoadIds: ["e66", "e44"],
    relatedConnectorIds: ["d71"],
    relatedSecondaryConnectorIds: []
  }
};

routeLogics.forEach((route) => {
  const relation = routeLogicRelations[route.id] || {};
  route.relatedAreaIds = relation.relatedAreaIds || [route.fromAreaId, route.toAreaId].filter(Boolean);
  route.relatedRoadIds = relation.relatedRoadIds || route.involvedRoadIds || [];
  route.relatedConnectorIds = relation.relatedConnectorIds || (route.involvedConnectorIds || []).filter((id) => connectorRoads.some((road) => road.id === id));
  route.relatedSecondaryConnectorIds = relation.relatedSecondaryConnectorIds || (route.involvedConnectorIds || []).filter((id) => secondaryConnectorRoads.some((road) => road.id === id));
});

function getRouteExamplesForItem(itemType, itemId) {
  return routeLogics.filter((route) => {
    if (itemType === "area") {
      return route.relatedAreaIds.includes(itemId) || route.fromAreaId === itemId || route.toAreaId === itemId;
    }

    if (itemType === "road") {
      return route.relatedRoadIds.includes(itemId) || route.involvedRoadIds.includes(itemId);
    }

    if (itemType === "connector") {
      return route.relatedConnectorIds.includes(itemId) || route.involvedConnectorIds.includes(itemId);
    }

    if (itemType === "secondaryConnector") {
      return route.relatedSecondaryConnectorIds.includes(itemId);
    }

    return false;
  });
}

const roadMistakes = [
  {
    id: "service-road-confusion",
    title: "Service road confusion",
    shortLabel: "Service roads",
    relatedRoadIds: ["e11"],
    relatedConnectorIds: ["d63", "d71"],
    relatedAreaIds: ["al-barsha", "business-bay", "dubai-marina", "jlt"],
    whatHappens: "You are close to the destination, but you are on the wrong road layer: main road instead of service road, or service road instead of main road.",
    whyItHappens: "Dubai often separates fast highway movement from local building or mall access. The road beside your destination may not be reachable from your current lane.",
    usuallyHappensAround: ["E11 / Sheikh Zayed Road", "Mall of the Emirates side", "Business Bay", "Dubai Marina", "JLT"],
    howToAvoid: "Check early whether the destination needs main-road access, service-road access, or a connector exit.",
    beginnerRule: "In Dubai, being on the correct road layer matters before the final turn."
  },
  {
    id: "missing-exits",
    title: "Missing exits",
    shortLabel: "Missed exits",
    relatedRoadIds: ["e11", "e44", "e311"],
    relatedConnectorIds: ["d61", "d63", "d71"],
    relatedAreaIds: ["al-barsha", "downtown", "business-bay", "jvc"],
    whatHappens: "You miss one exit and the next legal correction takes much longer than expected.",
    whyItHappens: "Major roads have fast traffic, separated lanes, and exits that often require early positioning.",
    usuallyHappensAround: ["E11", "Al Khail Road", "Al Barsha", "Downtown Dubai", "JVC"],
    howToAvoid: "Think one or two exits ahead. Move gradually instead of waiting for the last instruction.",
    beginnerRule: "Treat exits as early decisions, not last-second turns."
  },
  {
    id: "wrong-highway-choice",
    title: "Wrong highway choice",
    shortLabel: "Wrong highway",
    relatedRoadIds: ["e11", "e44", "e311", "e611"],
    relatedConnectorIds: [],
    relatedAreaIds: ["jvc", "mirdif", "business-bay", "dubai-marina"],
    whatHappens: "The route still works, but it sends you too far inside, too far outside, or through a more confusing corridor.",
    whyItHappens: "Dubai has parallel highways that look interchangeable on a map but serve different movement patterns.",
    usuallyHappensAround: ["E11", "E44", "E311", "E611"],
    howToAvoid: "Choose the road based on the kind of trip: central, inland, outer bypass, or regional.",
    beginnerRule: "E11 is central/coastal, E44 is inland city, E311 is inland bypass, E611 is outer bypass."
  },
  {
    id: "e311-vs-e611",
    title: "E311 vs E611 confusion",
    shortLabel: "E311 vs E611",
    relatedRoadIds: ["e311", "e611"],
    relatedConnectorIds: [],
    relatedAreaIds: ["mirdif", "jvc"],
    whatHappens: "You choose the farther outer road when you actually need the city-side inland road, or vice versa.",
    whyItHappens: "Both roads feel like large inland highways, but E311 is generally closer to city districts while E611 is farther outside.",
    usuallyHappensAround: ["Mirdif", "JVC-side access", "outer Dubai", "northern emirates routes"],
    howToAvoid: "Ask whether your destination is still part of city Dubai or genuinely outside/outer Dubai.",
    beginnerRule: "E311 is the inland city-side bypass. E611 is the farther outer bypass."
  },
  {
    id: "late-lane-changes",
    title: "Late lane changes",
    shortLabel: "Late lanes",
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d63", "d71"],
    relatedAreaIds: ["downtown", "business-bay", "al-barsha"],
    whatHappens: "You realize too late that the correct exit or split is on another side of the road.",
    whyItHappens: "Large interchanges and multi-lane roads require positioning before the instruction feels urgent.",
    usuallyHappensAround: ["E11 interchanges", "Downtown access", "Business Bay", "Mall of the Emirates side"],
    howToAvoid: "Move across lanes gradually when the destination is several minutes away, not when the exit is immediate.",
    beginnerRule: "Lane planning starts before the map says turn."
  },
  {
    id: "wrong-area-side",
    title: "Wrong side of an area",
    shortLabel: "Wrong area side",
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d61", "d63", "d71"],
    relatedAreaIds: ["al-barsha", "business-bay", "downtown", "jvc", "dubai-marina", "jlt"],
    whatHappens: "You reach the correct area but enter from the wrong side, creating loops, U-turns, or service-road confusion.",
    whyItHappens: "Many Dubai areas are split by highways, canals, loops, clusters, or one-way access patterns.",
    usuallyHappensAround: ["Al Barsha", "JVC", "Business Bay", "Downtown Dubai", "Dubai Marina", "JLT"],
    howToAvoid: "Before entering the area, identify which side your destination belongs to.",
    beginnerRule: "For complex areas, the correct side matters as much as the correct area."
  },
  {
    id: "creek-crossing-confusion",
    title: "Old Dubai / Creek crossing confusion",
    shortLabel: "Creek crossings",
    relatedRoadIds: ["e11"],
    relatedConnectorIds: ["d75", "d89"],
    relatedAreaIds: ["deira", "bur-dubai", "karama"],
    whatHappens: "You head toward Old Dubai but choose the wrong creek crossing, bridge direction, or airport-side approach.",
    whyItHappens: "Bur Dubai, Karama, Deira, Oud Metha, and airport-side routes are close together but rely on different crossings and connectors.",
    usuallyHappensAround: ["Deira", "Bur Dubai", "Karama", "Airport Road", "Creek-side roads"],
    howToAvoid: "Decide first whether you need Deira side, Bur Dubai side, airport side, or Sharjah side.",
    beginnerRule: "Old Dubai routing starts with the correct side of the Creek."
  },
  {
    id: "mall-access-loops",
    title: "Mall and tower access loops",
    shortLabel: "Access loops",
    relatedRoadIds: ["e11", "e44"],
    relatedConnectorIds: ["d63", "d71"],
    relatedAreaIds: ["downtown", "business-bay", "al-barsha"],
    whatHappens: "You are near the destination but enter the wrong parking, tower, mall, or boulevard loop.",
    whyItHappens: "Large destinations often have multiple access loops that are not interchangeable once you enter them.",
    usuallyHappensAround: ["Dubai Mall", "Downtown Dubai", "Business Bay", "Mall of the Emirates"],
    howToAvoid: "Check the destination side and access type before entering the final loop.",
    beginnerRule: "For malls and towers, final access is its own mini-route."
  }
];

const mistakeRouteExamples = {
  "service-road-confusion": ["al-barsha-downtown", "dubai-marina-deira"],
  "missing-exits": ["al-barsha-downtown", "jvc-business-bay"],
  "creek-crossing-confusion": ["dubai-marina-deira", "karama-al-barsha"]
};

roadMistakes.forEach((mistake) => {
  mistake.routeExampleIds = mistakeRouteExamples[mistake.id] || [];
});

function App() {
  const [selectedEmirate, setSelectedEmirate] = useState("Dubai");
  const [selectedMode, setSelectedMode] = useState(modes[0].title);
  const [screen, setScreen] = useState("landing");

  const selectedModeDetails = useMemo(
    () => modes.find((mode) => mode.title === selectedMode),
    [selectedMode]
  );

  const openMap = () => {
    setScreen("map");
  };

  if (screen === "map") {
    return (
      <DubaiMapScreen
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        onBack={() => setScreen("landing")}
      />
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">UAE road explainer app</p>
          <h1>Understand UAE roads before you enter the map.</h1>
          <p className="hero-text">
            A simple learning layer for UAE roads, areas, route logic, and the common decisions drivers need to make with confidence.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={openMap}>
              Open Map
            </button>
            <a className="secondary-link" href="#mvp">
              View MVP coverage
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Current app preview">
          <div className="mini-map">
            <span className="road-line road-line-main" />
            <span className="road-line road-line-cross" />
            <span className="road-line road-line-arc" />
            <span className="map-pin map-pin-one" />
            <span className="map-pin map-pin-two" />
            <span className="map-pin map-pin-three" />
          </div>
          <div className="panel-stat-grid">
            <div>
              <strong>5</strong>
              <span>highways</span>
            </div>
            <div>
              <strong>10</strong>
              <span>areas</span>
            </div>
            <div>
              <strong>4</strong>
              <span>modes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="workspace-grid" aria-label="Road explainer controls">
        <div className="control-panel">
          <div className="section-heading">
            <p className="eyebrow">Choose emirate</p>
            <h2>Start with Dubai</h2>
          </div>
          <div className="emirate-grid">
            {emirates.map((emirate) => {
              const isEnabled = emirate.status === "enabled";
              const isSelected = selectedEmirate === emirate.name;

              return (
                <button
                  key={emirate.name}
                  className={`emirate-button ${isSelected ? "selected" : ""}`}
                  disabled={!isEnabled}
                  onClick={() => setSelectedEmirate(emirate.name)}
                >
                  <span>{emirate.name}</span>
                  <small>{isEnabled ? "Available" : "Coming soon"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="control-panel">
          <div className="section-heading">
            <p className="eyebrow">Learning mode</p>
            <h2>Pick what you want to understand</h2>
          </div>
          <div className="mode-list">
            {modes.map((mode) => (
              <button
                key={mode.title}
                className={`mode-button ${selectedMode === mode.title ? "selected" : ""}`}
                onClick={() => setSelectedMode(mode.title)}
              >
                <span>{mode.title}</span>
                <small>{mode.description}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="summary-card">
          <p className="eyebrow">Current selection</p>
          <h2>{selectedEmirate}</h2>
          <div className="summary-row">
            <span>Mode</span>
            <strong>{selectedMode}</strong>
          </div>
          <div className="summary-row">
            <span>Coverage</span>
            <strong>Dubai MVP</strong>
          </div>
          <p>{selectedModeDetails.description}</p>
          <button className="primary-button full-width" onClick={openMap}>
            Open Map
          </button>
        </aside>
      </section>

      <section className="mvp-section" id="mvp">
        <div className="section-heading">
          <p className="eyebrow">MVP coverage</p>
          <h2>Dubai highways and areas included first</h2>
        </div>
        <div className="mvp-grid">
          <div className="mvp-list">
            <h3>Dubai highways</h3>
            <ul>
              {highways.map((highway) => (
                <li key={highway}>{highway}</li>
              ))}
            </ul>
          </div>
          <div className="mvp-list">
            <h3>Dubai areas</h3>
            <ul className="area-list">
              {areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function DubaiMapScreen({ selectedMode, onModeChange, onBack }) {
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [selectedConnectorRoad, setSelectedConnectorRoad] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRouteLogic, setSelectedRouteLogic] = useState(() =>
    selectedMode === routeModeTitle ? routeLogics[0] : null
  );
  const [selectedMistake, setSelectedMistake] = useState(() =>
    selectedMode === mistakeModeTitle ? roadMistakes[0] : null
  );
  const [selectedMapMode, setSelectedMapMode] = useState("roads");
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedViewPresetId, setSelectedViewPresetId] = useState(() => {
    if (selectedMode === routeModeTitle || selectedMode === mistakeModeTitle) return "area-connection";
    return "beginner";
  });
  const [userChoseViewPreset, setUserChoseViewPreset] = useState(false);
  const [mapFilters, setMapFilters] = useState(() => {
    if (selectedMode === routeModeTitle || selectedMode === mistakeModeTitle) {
      return viewPresets.find((preset) => preset.id === "area-connection").filters;
    }

    return viewPresets.find((preset) => preset.id === "beginner").filters;
  });
  const infoPanelRef = useRef(null);
  const mapCardRef = useRef(null);
  const dragStartRef = useRef(null);

  const activeMode = modes.find((mode) => mode.title === selectedMode);
  const selectedViewPreset = viewPresets.find((preset) => preset.id === selectedViewPresetId) || viewPresets[0];
  const visibleLayerText = Object.entries(mapFilters)
    .filter(([layerName, isVisible]) => Object.prototype.hasOwnProperty.call(layerLabels, layerName) && isVisible)
    .map(([layerName]) => layerLabels[layerName])
    .join(", ") || "No layers selected";
  const activeRouteLogic = selectedMode === routeModeTitle ? selectedRouteLogic : null;
  const activeMistake = selectedMode === mistakeModeTitle ? selectedMistake : null;
  const hasSelection = Boolean(selectedRoad || selectedConnectorRoad || selectedArea || activeRouteLogic || activeMistake);

  const scrollToInfoPanelIfNeeded = () => {
    window.setTimeout(() => {
      const infoPanel = infoPanelRef.current;
      const mapCard = mapCardRef.current;

      if (!infoPanel || !mapCard) {
        return;
      }

      const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;
      const infoRect = infoPanel.getBoundingClientRect();
      const mapRect = mapCard.getBoundingClientRect();
      const infoIsBelowMap = infoRect.top >= mapRect.bottom - 8;

      if (isMobileOrTablet || infoIsBelowMap) {
        infoPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const selectRoad = (road) => {
    console.log("Selected road:", road);
    setSelectedMapMode("roads");
    setSelectedRoad(road);
    setSelectedConnectorRoad(null);
    setSelectedArea(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    scrollToInfoPanelIfNeeded();
  };

  const selectConnectorRoad = (road) => {
    console.log("Selected connector road:", road);
    setSelectedMapMode("roads");
    setSelectedConnectorRoad(road);
    setSelectedRoad(null);
    setSelectedArea(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    scrollToInfoPanelIfNeeded();
  };

  const selectArea = (area) => {
    console.log("Selected area:", area);
    setSelectedMapMode("areas");
    setSelectedArea(area);
    setSelectedRoad(null);
    setSelectedConnectorRoad(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    scrollToInfoPanelIfNeeded();
  };

  const selectRouteLogic = (route) => {
    setSelectedMapMode("routes");
    setSelectedRouteLogic(route);
    setSelectedRoad(null);
    setSelectedConnectorRoad(null);
    setSelectedArea(null);
    setSelectedMistake(null);
    scrollToInfoPanelIfNeeded();
  };

  const selectMistake = (mistake) => {
    setSelectedMapMode("mistakes");
    setSelectedMistake(mistake);
    setSelectedRoad(null);
    setSelectedConnectorRoad(null);
    setSelectedArea(null);
    setSelectedRouteLogic(null);
    scrollToInfoPanelIfNeeded();
  };

  const openRouteExample = (route) => {
    setSelectedMapMode("routes");
    onModeChange(routeModeTitle);
    setSelectedRouteLogic(route);
    setSelectedRoad(null);
    setSelectedConnectorRoad(null);
    setSelectedArea(null);
    setSelectedMistake(null);

    const needsExpandedView = Boolean(route.relatedSecondaryConnectorIds?.length);
    applyViewPreset(needsExpandedView ? "expanded-dubai" : "area-connection", true);
    scrollToInfoPanelIfNeeded();
  };

  const changeMapMode = (modeTitle) => {
    onModeChange(modeTitle);

    if (modeTitle === routeModeTitle) {
      applyViewPreset("area-connection");
      selectRouteLogic(selectedRouteLogic || routeLogics[0]);
      return;
    }

    if (modeTitle === mistakeModeTitle) {
      applyViewPreset("area-connection");
      selectMistake(selectedMistake || roadMistakes[0]);
      return;
    }

    if (!userChoseViewPreset) {
      applyViewPreset("beginner");
    }

    setSelectedRouteLogic(null);
    setSelectedMistake(null);
  };

  const zoomIn = () => setMapZoom((zoom) => Math.min(1.6, Number((zoom + 0.1).toFixed(1))));
  const zoomOut = () => setMapZoom((zoom) => Math.max(0.8, Number((zoom - 0.1).toFixed(1))));
  const resetZoom = () => {
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
  };

  const toggleMapFilter = (filterName) => {
    setMapFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: !currentFilters[filterName]
    }));
  };

  function applyViewPreset(presetId, markAsUserChoice = false) {
    const preset = viewPresets.find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    setSelectedViewPresetId(preset.id);
    setMapFilters(preset.filters);

    if (markAsUserChoice) {
      setUserChoseViewPreset(true);
    }
  }

  const startMapDrag = (event) => {
    if (event.target.closest("button, input, label")) {
      return;
    }

    setIsDraggingMap(true);
    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: mapPan.x,
      originY: mapPan.y
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const dragMap = (event) => {
    if (!isDraggingMap || !dragStartRef.current) {
      return;
    }

    setMapPan({
      x: dragStartRef.current.originX + event.clientX - dragStartRef.current.startX,
      y: dragStartRef.current.originY + event.clientY - dragStartRef.current.startY
    });
  };

  const endMapDrag = (event) => {
    if (dragStartRef.current?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }

    setIsDraggingMap(false);
    dragStartRef.current = null;
  };

  const shouldShowHighway = (road) => mapFilters.showHighways && road.category === "highway";
  const shouldShowGhostHighway = (road) =>
    !mapFilters.showHighways && mapFilters.ghostHighways && road.category === "highway";
  const shouldShowConnector = (road) =>
    (road.category === "primaryConnector" && mapFilters.showPrimaryConnectors) ||
    (road.category === "secondaryConnector" && mapFilters.showSecondaryConnectors) ||
    Boolean(activeRouteLogic?.involvedConnectorIds.includes(road.id)) ||
    Boolean(activeMistake?.relatedConnectorIds.includes(road.id));
  const shouldShowArea = (area) =>
    (area.priority === "core" && mapFilters.showCoreAreas) ||
    (area.priority === "secondary" && mapFilters.showSecondaryAreas) ||
    Boolean(area.id === activeRouteLogic?.fromAreaId || area.id === activeRouteLogic?.toAreaId) ||
    Boolean(activeMistake?.relatedAreaIds.includes(area.id));

  return (
    <main className="map-screen">
      <header className="map-header">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
        <div>
          <p className="eyebrow">Dubai MVP map</p>
          <h1>Dubai Road Explorer</h1>
        </div>
      </header>

      <nav className="map-tabs" aria-label="Map modes">
        {modes.map((mode) => (
          <button
            key={mode.title}
            className={`map-tab ${selectedMode === mode.title ? "selected" : ""}`}
            onClick={() => changeMapMode(mode.title)}
          >
            {mode.title}
          </button>
        ))}
      </nav>

      <section className="map-layout">
        <div className="dubai-map-card" ref={mapCardRef}>
          <div className="map-card-header">
            <div>
              <p className="eyebrow">Simplified Dubai map</p>
              <h2>{selectedMode}</h2>
            </div>
            <span>{activeMode.description}</span>
          </div>

          <div className="view-preset-panel" aria-label="Map view presets">
            <div className="view-preset-buttons">
              {viewPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={`view-preset-button ${selectedViewPresetId === preset.id ? "selected" : ""}`}
                  onClick={() => applyViewPreset(preset.id, true)}
                >
                  <span>{preset.name}</span>
                  <small>{preset.description}</small>
                </button>
              ))}
            </div>
            <div className="view-explanation-card">
              <strong>{selectedViewPreset.name}</strong>
              <span>Visible: {visibleLayerText}</span>
              <span>Use this when: {selectedViewPreset.useWhen}</span>
            </div>
          </div>

          <div className="map-helper-row">
            <p>Click a highway, connector road, or area zone. Details appear below.</p>
            <div className="map-tool-row">
              <div className="zoom-controls" aria-label="Map zoom controls">
                <button onClick={zoomOut}>-</button>
                <span>{Math.round(mapZoom * 100)}%</span>
                <button onClick={zoomIn}>+</button>
                <button onClick={resetZoom}>Reset</button>
              </div>
              <div className="more-menu">
                <button className="more-button" onClick={() => setShowMoreOptions((isOpen) => !isOpen)}>
                  More
                </button>
                {showMoreOptions && (
                  <div className="more-panel" role="dialog" aria-label="Map layer options">
                    <label>
                      <input
                        type="checkbox"
                        checked={mapFilters.showHighways}
                        onChange={() => toggleMapFilter("showHighways")}
                      />
                      <span>Major highways</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={mapFilters.showPrimaryConnectors}
                        onChange={() => toggleMapFilter("showPrimaryConnectors")}
                      />
                      <span>Primary connectors</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={mapFilters.showSecondaryConnectors}
                        onChange={() => toggleMapFilter("showSecondaryConnectors")}
                      />
                      <span>Secondary connectors</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={mapFilters.showCoreAreas}
                        onChange={() => toggleMapFilter("showCoreAreas")}
                      />
                      <span>Core areas</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={mapFilters.showSecondaryAreas}
                        onChange={() => toggleMapFilter("showSecondaryAreas")}
                      />
                      <span>Secondary areas</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="map-legend" aria-label="Map legend">
            <span><b className="legend-road" /> Major highways</span>
            <span><b className="legend-connector" /> Primary connectors</span>
            {(mapFilters.showSecondaryConnectors || selectedViewPresetId === "expanded-dubai") && (
              <span><b className="legend-secondary-connector" /> Secondary connectors</span>
            )}
            <span><b className="legend-zone" /> Core areas</span>
            {(mapFilters.showSecondaryAreas || selectedViewPresetId === "expanded-dubai") && (
              <span><b className="legend-secondary-zone" /> Secondary areas</span>
            )}
            <span><b className="legend-selected" /> Selected</span>
            <span><b className="legend-direction" /> Orientation guide</span>
          </div>

          <div
            className={`dubai-map-canvas ${isDraggingMap ? "dragging" : ""}`}
            aria-label="Clickable Dubai roads and areas"
            onPointerDown={startMapDrag}
            onPointerMove={dragMap}
            onPointerUp={endMapDrag}
            onPointerCancel={endMapDrag}
          >
            <div className="sea-guide" aria-hidden="true">
              <span>Arabian Gulf / coast side</span>
            </div>
            <div className="orientation-layer" aria-hidden="true">
              <span className="region-label coast-label">Arabian Gulf / coast side</span>
              <span className="region-label inland-label">Inland Dubai</span>
              <span className="region-label old-dubai-label">Old Dubai / Creek side</span>
              <span className="region-label new-dubai-label">New Dubai corridor</span>
              <span className="region-label airport-label">Airport / Mirdif side</span>
            </div>
            <div className="direction-anchor-layer" aria-hidden="true">
              <span className="direction-anchor anchor-abu-dhabi">Abu Dhabi direction</span>
              <span className="direction-anchor anchor-sharjah">Sharjah / Northern Emirates direction</span>
              <span className="direction-anchor anchor-al-ain">Al Ain / inland direction</span>
              <span className="direction-anchor anchor-coast">Coast side</span>
              <span className="direction-anchor anchor-inland">Inland side</span>
            </div>
            <div
              className="map-content-layer"
              style={{
                transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`,
                transformOrigin: "center"
              }}
            >
              <svg className="dubai-map-svg" viewBox="0 0 100 100" role="img" aria-label="Simplified road map of Dubai">
                <path className="coast-shape" d="M4 29 C13 34, 23 31, 34 31 C45 31, 55 30, 66 29 C77 28, 86 30, 97 28" />
                <path className="creek-shape" d="M78 28 C82 32, 82 37, 79 42 C77 47, 80 52, 85 54" />
                {roadDetails.filter(shouldShowGhostHighway).map((road) => (
                  <line
                    key={`ghost-${road.id}`}
                    className={`map-road ghost-road ${road.lineClass}`}
                    x1={road.x1}
                    y1={road.y1}
                    x2={road.x2}
                    y2={road.y2}
                  />
                ))}
                {allConnectorRoads.filter(shouldShowConnector).map((road) => {
                  const routeInvolved = Boolean(activeRouteLogic?.involvedConnectorIds.includes(road.id));
                  const mistakeInvolved = Boolean(activeMistake?.relatedConnectorIds.includes(road.id));
                  const selected = road.id === selectedConnectorRoad?.id || routeInvolved || mistakeInvolved;
                  const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                  const secondaryClass = road.category === "secondaryConnector" ? "secondary-connector-line" : "";

                  return (
                    <line
                      key={road.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${road.code} ${road.name}`}
                      className={`connector-line ${secondaryClass} ${road.lineClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-connector" : ""} ${routeDimmed ? "route-dimmed" : ""}`}
                      x1={road.x1}
                      y1={road.y1}
                      x2={road.x2}
                      y2={road.y2}
                      onClick={() => selectConnectorRoad(road)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectConnectorRoad(road);
                        }
                      }}
                    />
                  );
                })}
                {roadDetails.filter(shouldShowHighway).map((road) => {
                  const routeInvolved = Boolean(activeRouteLogic?.involvedRoadIds.includes(road.id));
                  const mistakeInvolved = Boolean(activeMistake?.relatedRoadIds.includes(road.id));
                  const selected = road.id === selectedRoad?.id || routeInvolved || mistakeInvolved;
                  const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);

                  return (
                    <line
                      key={road.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${road.code} ${road.name}`}
                      className={`map-road ${road.lineClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-road" : ""} ${routeDimmed ? "route-dimmed" : ""}`}
                      x1={road.x1}
                      y1={road.y1}
                      x2={road.x2}
                      y2={road.y2}
                      onClick={() => selectRoad(road)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectRoad(road);
                        }
                      }}
                    />
                  );
                })}
              </svg>

              {allAreas.filter(shouldShowArea).map((area) => {
                const routeStart = area.id === activeRouteLogic?.fromAreaId;
                const routeDestination = area.id === activeRouteLogic?.toAreaId;
                const routeRelated = Boolean(activeRouteLogic?.relatedAreaIds.includes(area.id));
                const mistakeInvolved = Boolean(activeMistake?.relatedAreaIds.includes(area.id));
                const selected =
                  area.id === selectedArea?.id ||
                  routeStart ||
                  routeDestination ||
                  routeRelated ||
                  mistakeInvolved;
                const routeDimmed = Boolean(activeRouteLogic && !routeRelated && !routeStart && !routeDestination);

                return (
                  <button
                    key={area.id}
                    className={`area-zone ${area.priority === "secondary" ? "secondary-area-zone" : ""} ${selected ? "selected" : ""} ${routeStart ? "route-start-area" : ""} ${routeDestination ? "route-destination-area" : ""} ${routeRelated ? "route-related-area" : ""} ${mistakeInvolved ? "mistake-related-area" : ""} ${(activeMistake && !mistakeInvolved) || routeDimmed ? "route-dimmed" : ""}`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      width: `${area.width}%`,
                      height: `${area.height}%`
                    }}
                    onClick={() => selectArea(area)}
                  >
                    <span className="area-boundary" />
                    <span className="area-dot" />
                    <strong>{area.name}</strong>
                  </button>
                );
              })}

              {roadDetails.filter(shouldShowHighway).map((road) => {
                const routeInvolved = Boolean(activeRouteLogic?.involvedRoadIds.includes(road.id));
                const mistakeInvolved = Boolean(activeMistake?.relatedRoadIds.includes(road.id));
                const selected = road.id === selectedRoad?.id || routeInvolved || mistakeInvolved;
                const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);

                return (
                  <button
                    key={road.id}
                    className={`road-label-button ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-road" : ""} ${routeDimmed ? "route-dimmed" : ""}`}
                    style={{ left: `${road.labelX}%`, top: `${road.labelY}%` }}
                    onClick={() => selectRoad(road)}
                    aria-label={`View ${road.code} ${road.name}`}
                  >
                    <span>{road.code}</span>
                  </button>
                );
              })}

              {allConnectorRoads.filter(shouldShowConnector).map((road) => {
                const routeInvolved = Boolean(activeRouteLogic?.involvedConnectorIds.includes(road.id));
                const mistakeInvolved = Boolean(activeMistake?.relatedConnectorIds.includes(road.id));
                const selected = road.id === selectedConnectorRoad?.id || routeInvolved || mistakeInvolved;
                const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                const secondaryClass = road.category === "secondaryConnector" ? "secondary-connector-label" : "";

                return (
                  <button
                    key={road.id}
                    className={`connector-label ${secondaryClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-connector" : ""} ${routeDimmed ? "route-dimmed" : ""}`}
                    style={{ left: `${road.labelX}%`, top: `${road.labelY}%` }}
                    onClick={() => selectConnectorRoad(road)}
                    aria-label={`View ${road.code} ${road.name}`}
                  >
                    <span>{road.code}</span>
                    <strong>{road.shortName}</strong>
                  </button>
                );
              })}
            </div>
            <div className="compass-indicator" aria-label="Compass">
              <span className="compass-n">N</span>
              <span className="compass-e">E</span>
              <span className="compass-s">S</span>
              <span className="compass-w">W</span>
              <span className="compass-needle" />
            </div>
            {hasSelection && (
              <button className="details-loaded-hint" onClick={() => infoPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                Details below ↓
              </button>
            )}
          </div>
        </div>

        <aside className="info-panel" data-selection-mode={selectedMapMode} ref={infoPanelRef}>
          <InfoPanel
            selectedRoad={selectedRoad}
            selectedConnectorRoad={selectedConnectorRoad}
            selectedArea={selectedArea}
            selectedRouteLogic={activeRouteLogic}
            selectedMistake={activeMistake}
            routeLogics={routeLogics}
            roadMistakes={roadMistakes}
            roads={roadDetails}
            connectorRoads={allConnectorRoads}
            setSelectedRoad={setSelectedRoad}
            setSelectedConnectorRoad={setSelectedConnectorRoad}
            setSelectedArea={setSelectedArea}
            setSelectedRouteLogic={setSelectedRouteLogic}
            setSelectedMistake={setSelectedMistake}
            setSelectedMode={setSelectedMapMode}
            selectRouteLogic={selectRouteLogic}
            selectMistake={selectMistake}
            openRouteExample={openRouteExample}
            scrollToInfoPanel={scrollToInfoPanelIfNeeded}
          />
        </aside>
      </section>
    </main>
  );
}

function InfoPanel({
  selectedRoad,
  selectedConnectorRoad,
  selectedArea,
  selectedRouteLogic,
  selectedMistake,
  routeLogics,
  roadMistakes,
  roads,
  connectorRoads,
  setSelectedRoad,
  setSelectedConnectorRoad,
  setSelectedArea,
  setSelectedRouteLogic,
  setSelectedMistake,
  setSelectedMode,
  selectRouteLogic,
  selectMistake,
  openRouteExample,
  scrollToInfoPanel
}) {
  if (selectedRouteLogic) {
    return (
      <RouteLogicInfo
        route={selectedRouteLogic}
        routeLogics={routeLogics}
        roads={roads}
        connectorRoads={allConnectorRoads}
        setSelectedRoad={setSelectedRoad}
        setSelectedConnectorRoad={setSelectedConnectorRoad}
        setSelectedArea={setSelectedArea}
        setSelectedRouteLogic={setSelectedRouteLogic}
        setSelectedMistake={setSelectedMistake}
        setSelectedMode={setSelectedMode}
        selectRouteLogic={selectRouteLogic}
        openRouteExample={openRouteExample}
        scrollToInfoPanel={scrollToInfoPanel}
      />
    );
  }

  if (selectedMistake) {
    return (
      <MistakeInfo
        mistake={selectedMistake}
        roadMistakes={roadMistakes}
        roads={roads}
        connectorRoads={allConnectorRoads}
        areas={allAreas}
        setSelectedRoad={setSelectedRoad}
        setSelectedConnectorRoad={setSelectedConnectorRoad}
        setSelectedArea={setSelectedArea}
        setSelectedRouteLogic={setSelectedRouteLogic}
        setSelectedMistake={setSelectedMistake}
        setSelectedMode={setSelectedMode}
        selectMistake={selectMistake}
        openRouteExample={openRouteExample}
        scrollToInfoPanel={scrollToInfoPanel}
      />
    );
  }

  if (selectedRoad) {
    return <RoadInfo road={selectedRoad} openRouteExample={openRouteExample} />;
  }

  if (selectedConnectorRoad) {
    return (
      <ConnectorRoadInfo
        road={selectedConnectorRoad}
        roads={roads}
        connectorRoads={connectorRoads}
        setSelectedRoad={setSelectedRoad}
        setSelectedConnectorRoad={setSelectedConnectorRoad}
        setSelectedArea={setSelectedArea}
        setSelectedMode={setSelectedMode}
        openRouteExample={openRouteExample}
        scrollToInfoPanel={scrollToInfoPanel}
      />
    );
  }

  if (selectedArea) {
    return (
      <AreaInfo
        area={selectedArea}
        roads={roads}
        connectorRoads={allConnectorRoads}
        setSelectedRoad={setSelectedRoad}
        setSelectedConnectorRoad={setSelectedConnectorRoad}
        setSelectedArea={setSelectedArea}
        setSelectedMode={setSelectedMode}
        openRouteExample={openRouteExample}
        scrollToInfoPanel={scrollToInfoPanel}
      />
    );
  }

  return <DefaultInfo />;
}

function RouteLogicInfo({
  route,
  routeLogics,
  roads,
  connectorRoads,
  setSelectedRoad,
  setSelectedConnectorRoad,
  setSelectedArea,
  setSelectedRouteLogic,
  setSelectedMistake,
  setSelectedMode,
  selectRouteLogic,
  openRouteExample,
  scrollToInfoPanel
}) {
  function handleRoadChipClick(chip) {
    const isConnectorChip = chip.type === "connector" || chip.type === "secondaryConnector";
    const road = isConnectorChip
      ? connectorRoads.find((item) => item.id === chip.id)
      : roads.find((item) => item.id === chip.id);

    if (!road) return;

    if (isConnectorChip) {
      setSelectedConnectorRoad(road);
      setSelectedRoad(null);
    } else {
      setSelectedRoad(road);
      setSelectedConnectorRoad(null);
    }

    setSelectedArea(null);
    setSelectedRouteLogic(null);
    setSelectedMistake?.(null);
    setSelectedMode("roads");
    scrollToInfoPanel?.();
  }

  return (
    <>
      <div className="route-logic-selector" aria-label="Preset route selector">
        {routeLogics.map((preset) => (
          <button
            key={preset.id}
            className={`route-logic-button ${route.id === preset.id ? "selected" : ""}`}
            onClick={() => selectRouteLogic(preset)}
          >
            <span>{preset.title}</span>
          </button>
        ))}
      </div>
      <p className="eyebrow">Route Logic</p>
      <h2>{route.title}</h2>
      <div className="route-road-pills" aria-label="Likely roads involved">
        {route.roadChips.map((chip) => (
          <button key={`${chip.type}-${chip.id}`} onClick={() => handleRoadChipClick(chip)}>
            {chip.code}
          </button>
        ))}
      </div>
      <div className="detail-block">
        <span>What you are doing</span>
        <strong>{route.whatYouAreDoing}</strong>
      </div>
      <div className="detail-block">
        <span>Route shape</span>
        <strong>{route.routeShape}</strong>
      </div>
      <div className="detail-block">
        <span>Main route idea</span>
        <strong>{route.mainRouteIdea}</strong>
      </div>
      <div className="detail-block">
        <span>Road choice</span>
        <strong>{route.roadChoice}</strong>
      </div>
      <div className="detail-block">
        <span>Critical decision</span>
        <strong>{route.criticalDecision}</strong>
      </div>
      <div className="detail-block">
        <span>Common mistake</span>
        <strong>{route.commonMistake}</strong>
      </div>
      <div className="detail-block">
        <span>Beginner rule</span>
        <strong>{route.beginnerRule}</strong>
      </div>
      <div className="info-pill">Showing preset route reasoning</div>
    </>
  );
}

function MistakeInfo({
  mistake,
  roadMistakes,
  roads,
  connectorRoads,
  areas,
  setSelectedRoad,
  setSelectedConnectorRoad,
  setSelectedArea,
  setSelectedRouteLogic,
  setSelectedMistake,
  setSelectedMode,
  selectMistake,
  openRouteExample,
  scrollToInfoPanel
}) {
  const relatedRoads = mistake.relatedRoadIds
    .map((id) => roads.find((road) => road.id === id))
    .filter(Boolean);
  const relatedConnectors = mistake.relatedConnectorIds
    .map((id) => connectorRoads.find((road) => road.id === id))
    .filter(Boolean);
  const relatedAreas = mistake.relatedAreaIds
    .map((id) => areas.find((area) => area.id === id))
    .filter(Boolean);
  const routeExamples = (mistake.routeExampleIds || [])
    .map((id) => routeLogics.find((route) => route.id === id))
    .filter(Boolean);

  function openHighway(road) {
    setSelectedRoad(road);
    setSelectedConnectorRoad(null);
    setSelectedArea(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    setSelectedMode("roads");
    scrollToInfoPanel?.();
  }

  function openConnector(road) {
    setSelectedConnectorRoad(road);
    setSelectedRoad(null);
    setSelectedArea(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    setSelectedMode("roads");
    scrollToInfoPanel?.();
  }

  function openArea(area) {
    setSelectedArea(area);
    setSelectedRoad(null);
    setSelectedConnectorRoad(null);
    setSelectedRouteLogic(null);
    setSelectedMistake(null);
    setSelectedMode("areas");
    scrollToInfoPanel?.();
  }

  return (
    <>
      <div className="route-logic-selector" aria-label="Common mistake selector">
        {roadMistakes.map((item) => (
          <button
            key={item.id}
            className={`route-logic-button ${mistake.id === item.id ? "selected" : ""}`}
            onClick={() => selectMistake(item)}
          >
            <span>{item.shortLabel}</span>
          </button>
        ))}
      </div>
      <p className="eyebrow">Common Road Mistake</p>
      <h2>{mistake.title}</h2>
      <div className="route-road-pills" aria-label="Related roads and areas">
        {relatedRoads.map((road) => (
          <button key={road.id} onClick={() => openHighway(road)}>
            {road.code}
          </button>
        ))}
        {relatedConnectors.map((road) => (
          <button key={road.id} onClick={() => openConnector(road)}>
            {road.code}
          </button>
        ))}
        {relatedAreas.map((area) => (
          <button key={area.id} onClick={() => openArea(area)}>
            {area.name}
          </button>
        ))}
      </div>
      <div className="detail-block">
        <span>What happens</span>
        <strong>{mistake.whatHappens}</strong>
      </div>
      <div className="detail-block">
        <span>Why it happens</span>
        <strong>{mistake.whyItHappens}</strong>
      </div>
      <div className="detail-block">
        <span>Usually happens around</span>
        <strong>{mistake.usuallyHappensAround.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>How to avoid it</span>
        <strong>{mistake.howToAvoid}</strong>
      </div>
      <div className="detail-block">
        <span>Beginner rule</span>
        <strong>{mistake.beginnerRule}</strong>
      </div>
      <RouteExampleList routes={routeExamples} openRouteExample={openRouteExample} />
      <div className="info-pill">Showing mistake pattern</div>
    </>
  );
}

function DefaultInfo() {
  return (
    <>
      <p className="eyebrow">Selection details</p>
      <h2>Select a road or area</h2>
      <p>Click a highway, connector road, or area zone to see how it connects to Dubai.</p>
    </>
  );
}

function RouteExampleList({ itemType, itemId, routes, openRouteExample }) {
  const examples = routes || getRouteExamplesForItem(itemType, itemId);

  return (
    <section className="info-section route-example-section">
      <h3>Route logic examples</h3>
      {examples.length ? (
        <div className="route-example-list">
          {examples.map((route) => (
            <button key={route.id} className="route-example-card" onClick={() => openRouteExample?.(route)}>
              <strong>{route.title}</strong>
              <span>View route logic</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-route-examples">No route examples added yet for this item.</p>
      )}
    </section>
  );
}

function RoadInfo({ road, openRouteExample }) {
  return (
    <>
      <p className="eyebrow">Road Detail</p>
      <h2>
        {road.code} / {road.name}
      </h2>
      <div className="detail-block">
        <span>What this road does</span>
        <strong>{road.whatItDoes}</strong>
      </div>
      <div className="detail-block">
        <span>When to use it</span>
        <strong>{road.whenToUse}</strong>
      </div>
      <div className="detail-block">
        <span>Areas it helps with</span>
        <strong>{road.areasItHelpsWith.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Connects to</span>
        <strong>{road.connectsTo.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Common confusion</span>
        <strong>{road.commonConfusion}</strong>
      </div>
      <div className="detail-block">
        <span>Beginner rule</span>
        <strong>{road.beginnerRule}</strong>
      </div>
      <RouteExampleList itemType="road" itemId={road.id} openRouteExample={openRouteExample} />
      <div className="info-pill">Showing road detail</div>
    </>
  );
}

function ConnectorRoadInfo({ road, roads, connectorRoads, setSelectedRoad, setSelectedConnectorRoad, setSelectedArea, setSelectedMode, openRouteExample, scrollToInfoPanel }) {
  function handleRelatedRoadClick(relatedRoad) {
    if (!relatedRoad.available || !relatedRoad.roadId) return;

    const isConnector = relatedRoad.roadType === "connector" || relatedRoad.roadType === "secondaryConnector";
    const targetRoad = isConnector
      ? connectorRoads.find((item) => item.id === relatedRoad.roadId)
      : roads.find((item) => item.id === relatedRoad.roadId);

    if (!targetRoad) return;

    if (isConnector) {
      setSelectedConnectorRoad(targetRoad);
      setSelectedRoad(null);
    } else {
      setSelectedRoad(targetRoad);
      setSelectedConnectorRoad(null);
    }
    setSelectedArea(null);
    setSelectedMode("roads");
    scrollToInfoPanel?.();
  }

  return (
    <>
      <p className="eyebrow">Connector Road Detail</p>
      <h2>
        {road.code} / {road.name}
      </h2>
      <div className="detail-block">
        <span>What this road does</span>
        <strong>{road.whatItDoes}</strong>
      </div>
      <div className="detail-block">
        <span>When to use it</span>
        <strong>{road.whenToUse}</strong>
      </div>
      <div className="detail-block">
        <span>Areas it helps with</span>
        <strong>{road.areasItHelpsWith.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Connects to</span>
        <strong>{road.connectsTo.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Common confusion</span>
        <strong>{road.commonConfusion}</strong>
      </div>
      <div className="detail-block">
        <span>Beginner rule</span>
        <strong>{road.beginnerRule}</strong>
      </div>
      <section className="info-section">
        <h3>Related roads</h3>
        <div className="related-road-list">
          {road.relatedRoads.map((relatedRoad) => (
            <button
              key={`${road.id}-${relatedRoad.code}-${relatedRoad.label}`}
              className="related-road-pill"
              onClick={() => handleRelatedRoadClick(relatedRoad)}
              title={`View ${relatedRoad.label}`}
              aria-label={`View ${relatedRoad.label}`}
            >
              <strong>{relatedRoad.code}</strong>
              <span>{relatedRoad.label}</span>
            </button>
          ))}
        </div>
      </section>
      <RouteExampleList
        itemType={road.category === "secondaryConnector" ? "secondaryConnector" : "connector"}
        itemId={road.id}
        openRouteExample={openRouteExample}
      />
      <div className="info-pill">Showing connector road detail</div>
    </>
  );
}

function AreaInfo({ area, roads, connectorRoads, setSelectedRoad, setSelectedConnectorRoad, setSelectedArea, setSelectedMode, openRouteExample, scrollToInfoPanel }) {
  function handleRelatedRoadClick(relatedRoad) {
    if (!relatedRoad.available || !relatedRoad.roadId) return;

    const isConnector = relatedRoad.roadType === "connector" || relatedRoad.roadType === "secondaryConnector";
    const road = isConnector
      ? connectorRoads.find((item) => item.id === relatedRoad.roadId)
      : roads.find((item) => item.id === relatedRoad.roadId);

    if (!road) return;

    if (isConnector) {
      setSelectedConnectorRoad(road);
      setSelectedRoad(null);
    } else {
      setSelectedRoad(road);
      setSelectedConnectorRoad(null);
    }

    setSelectedArea(null);
    setSelectedMode("roads");
    scrollToInfoPanel?.();
  }

  return (
    <>
      <p className="eyebrow">Area Detail</p>
      <h2>{area.name}</h2>
      <div className="region-pill">Region: {area.region}</div>
      <div className="detail-block">
        <span>Region / orientation</span>
        <strong>{area.region}</strong>
      </div>
      <div className="detail-block">
        <span>How to think about this area</span>
        <strong>{area.howToThink}</strong>
      </div>
      <div className="detail-block">
        <span>Main road access</span>
        <strong>{area.mainRoadAccess.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Useful connectors</span>
        <strong>{area.connectors.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>Nearby areas</span>
        <strong>{area.nearbyAreas.join(", ")}</strong>
      </div>
      <div className="detail-block">
        <span>What usually confuses drivers</span>
        <strong>{area.driverConfusion}</strong>
      </div>
      <div className="detail-block">
        <span>Beginner rule</span>
        <strong>{area.beginnerRule}</strong>
      </div>
      <section className="info-section">
        <h3>Related roads</h3>
        <div className="related-road-list">
          {area.relatedRoads.map((relatedRoad) => (
            <button
              key={`${area.id}-${relatedRoad.code}-${relatedRoad.label}`}
              className={`related-road-pill ${relatedRoad.available ? "" : "disabled"}`}
              onClick={() => handleRelatedRoadClick(relatedRoad)}
              disabled={!relatedRoad.available}
              title={relatedRoad.available ? `View ${relatedRoad.label}` : `${relatedRoad.label} coming next`}
              aria-label={relatedRoad.available ? `View ${relatedRoad.label}` : `${relatedRoad.label} coming next`}
            >
              <strong>{relatedRoad.code}</strong>
              <span>{relatedRoad.label}</span>
            </button>
          ))}
        </div>
      </section>
      <RouteExampleList itemType="area" itemId={area.id} openRouteExample={openRouteExample} />
      <div className="info-pill">Showing area detail</div>
    </>
  );
}

export default App;
