      const modeTabs = [
        "Explore UAE Roads",
        "Area Understanding",
        "Route Logic & Reasoning",
        "Learn Common Road Mistakes"
      ];
      const modeCopy = {
        "Explore UAE Roads": "See how main corridors, exits, and interchanges connect across the city.",
        "Area Understanding": "Build a mental map of neighborhoods, landmarks, and road relationships.",
        "Route Logic & Reasoning": "Learn why one route is cleaner, faster, or less confusing than another.",
        "Learn Common Road Mistakes": "Spot lane, exit, and naming mistakes before they happen on the road."
      };
      const viewPresets = [
        { id: "beginner", name: "Beginner view", filters: { showHighways: true, showPrimaryConnectors: false, showSecondaryConnectors: false, showCoreAreas: true, showSecondaryAreas: false }, description: "Start here to understand where Dubai areas sit relative to the main highway skeleton.", useWhen: "You are building a basic mental map of Dubai areas and the main highway skeleton." },
        { id: "road-skeleton", name: "Road skeleton", filters: { showHighways: true, showPrimaryConnectors: false, showSecondaryConnectors: false, showCoreAreas: false, showSecondaryAreas: false }, description: "Use this to understand Dubai's main movement corridors.", useWhen: "You want to focus only on Dubai's main highway movement corridors." },
        { id: "area-connection", name: "Area connection view", filters: { showHighways: true, showPrimaryConnectors: true, showSecondaryConnectors: false, showCoreAreas: true, showSecondaryAreas: false }, description: "Use this to understand how areas connect to highways through connector roads.", useWhen: "You want to understand how areas connect to highways through connector roads." },
        { id: "expanded-dubai", name: "Expanded Dubai view", filters: { showHighways: true, showPrimaryConnectors: true, showSecondaryConnectors: true, showCoreAreas: true, showSecondaryAreas: true }, description: "Use this after the basics to see more important Dubai roads and areas without switching to a full Google Maps-style view.", useWhen: "You understand the basics and want more Dubai context without switching to a full Google Maps-style view." },
        { id: "connector-focus", name: "Connector focus", filters: { showHighways: false, showPrimaryConnectors: true, showSecondaryConnectors: false, showCoreAreas: true, showSecondaryAreas: false, ghostHighways: true }, description: "Use this to study the roads where most local-access confusion begins.", useWhen: "You want to study the connector roads where most local-access confusion begins." }
      ];
      const layerLabels = { showHighways: "Major highways", showPrimaryConnectors: "Primary connectors", showSecondaryConnectors: "Secondary connectors", showCoreAreas: "Core areas", showSecondaryAreas: "Secondary areas" };
      const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
      const highways = [
        "E11 / Sheikh Zayed Road",
        "E44 / Al Khail Road",
        "E311 / Sheikh Mohammed Bin Zayed Road",
        "E611 / Emirates Road",
        "E66 / Dubai-Al Ain Road"
      ];
      const areaNames = ["Dubai Marina", "JLT", "Al Barsha", "JVC", "Downtown Dubai", "Business Bay", "Karama", "Bur Dubai", "Deira", "Mirdif", "Jumeirah", "Umm Suqeim", "Al Quoz", "Dubai Hills", "DIFC", "Trade Centre", "Oud Metha", "Rashidiya", "Dubai Silicon Oasis", "International City"];
      const roads = [
        { id: "e11", code: "E11", name: "Sheikh Zayed Road", category: "highway", priority: "core", type: "Primary coastal highway", whatItDoes: "Acts as Dubai's main central/coastal movement spine.", whatItIs: "Dubai's main central spine. It runs through the city's business and coastal corridor.", whenToUse: "Use it when moving between Dubai Marina, JLT, Business Bay, Downtown, Trade Centre, or when travelling toward Abu Dhabi or Sharjah-side routes.", areasItHelpsWith: ["Dubai Marina", "JLT", "Business Bay", "Downtown Dubai", "Trade Centre", "Deira-side access"], connectsTo: ["Dubai Marina", "JLT", "Business Bay", "Downtown Dubai", "Old Dubai access"], commonConfusion: "Service roads, fast exits, and late lane changes. Being on the correct side early matters more than the final turn.", watchFor: "Service roads, fast exits, and late lane changes. Being on the correct side early matters more than the final turn.", beginnerRule: "If your destination is near E11, decide early whether you need the main highway, the service road, or a connector exit.", lineClass: "road-e11", labelX: 50, labelY: 38, x1: 5, y1: 42, x2: 96, y2: 35 },
        { id: "e44", code: "E44", name: "Al Khail Road", category: "highway", priority: "core", type: "Internal city highway", whatItDoes: "Moves traffic through inland Dubai behind Sheikh Zayed Road.", whatItIs: "A major inland Dubai highway running behind Sheikh Zayed Road.", whenToUse: "Use it when moving through inland Dubai without entering the E11/SZR corridor.", areasItHelpsWith: ["Business Bay", "Al Quoz", "Dubai Hills", "JVC", "Meydan"], connectsTo: ["Business Bay", "Al Quoz", "Dubai Hills", "JVC", "Meydan"], commonConfusion: "Exits can feel indirect because many areas are reached through connector roads rather than direct turns.", watchFor: "Exits can feel indirect because many areas are reached through connector roads rather than direct turns.", beginnerRule: "Before joining Al Khail, know the exit cluster, not just the destination name.", lineClass: "road-e44", labelX: 47, labelY: 56, x1: 17, y1: 61, x2: 82, y2: 58 },
        { id: "e311", code: "E311", name: "Sheikh Mohammed Bin Zayed Road", category: "highway", priority: "core", type: "Inland inter-city highway", whatItDoes: "Works as Dubai's city-side inland bypass for suburban and inter-emirate movement.", whatItIs: "A major inland highway parallel to E11, useful for suburban and inter-emirate movement.", whenToUse: "Use it to avoid central Dubai or to move between inland districts and northern emirates routes.", areasItHelpsWith: ["Mirdif", "International City", "Dubai Silicon Oasis", "JVC-side access", "Sharjah/Ajman direction"], connectsTo: ["Mirdif", "International City", "Dubai Silicon Oasis", "JVC-side access", "Northern Emirates direction"], commonConfusion: "It is easy to confuse with E611 because both feel like outer roads, but E311 is generally closer to city districts.", watchFor: "It is easy to confuse with E611 because both feel like outer roads, but E311 is generally closer to city districts.", beginnerRule: "Think of E311 as the inland city-side bypass. Think of E611 as the farther outer bypass.", lineClass: "road-e311", labelX: 58, labelY: 78, x1: 34, y1: 75, x2: 91, y2: 84 },
        { id: "e611", code: "E611", name: "Emirates Road", category: "highway", priority: "core", type: "Outer bypass highway", whatItDoes: "Acts as Dubai's farther outer bypass for longer-distance and outer-area movement.", whatItIs: "Dubai's outer bypass road, used more for long-distance and outer-area movement.", whenToUse: "Use it when your trip is clearly outer-city, logistics/industrial, or inter-emirate.", areasItHelpsWith: ["Outer Dubai", "Industrial areas", "Northern Emirates direction", "Long-distance bypass trips"], connectsTo: ["Outer Dubai", "Industrial areas", "Northern Emirates direction"], commonConfusion: "It can take you too far outside the city if your destination is actually inside Dubai.", watchFor: "It can take you too far outside the city if your destination is actually inside Dubai.", beginnerRule: "Do not pick E611 just because it looks fast. Use it only when the destination is genuinely outer-Dubai or beyond.", lineClass: "road-e611", labelX: 31, labelY: 73, x1: 1, y1: 75, x2: 55, y2: 73 },
        { id: "e66", code: "E66", name: "Dubai-Al Ain Road", category: "highway", priority: "core", type: "Regional inland highway", whatItDoes: "Connects Dubai toward Al Ain and inland south-east districts.", whatItIs: "A regional road connecting Dubai toward Al Ain and inland south-east districts.", whenToUse: "Use it for Dubai Silicon Oasis, Academic City, Outlet Mall side, or Al Ain direction.", areasItHelpsWith: ["Dubai Silicon Oasis", "Academic City", "Nad Al Sheba-side access", "Al Ain direction"], connectsTo: ["Dubai Silicon Oasis", "Academic City", "Al Ain direction"], commonConfusion: "It is not a central Dubai road. Joining it accidentally can pull you away from the city core.", watchFor: "It is not a central Dubai road. Joining it accidentally can pull you away from the city core.", beginnerRule: "Use E66 when you are intentionally going inland or toward Al Ain, not for normal central Dubai movement.", lineClass: "road-e66", labelX: 69, labelY: 69, x1: 61, y1: 56, x2: 77, y2: 93 }
      ];
      const connectorRoads = [
        { id: "d61", code: "D61", name: "Hessa Street", shortName: "Hessa", category: "primaryConnector", priority: "core", type: "Cross-city connector", whatItDoes: "Connects New Dubai areas toward inland residential districts.", whenToUse: "Use it when moving between Dubai Marina/JLT side, Al Barsha, JVC, Sports City, and inland Dubai.", areasItHelpsWith: ["Dubai Marina side", "JLT side", "Al Barsha", "JVC", "Sports City"], connectsTo: ["E11", "E44", "E311"], commonConfusion: "Several exits and access roads branch off quickly around Al Barsha and JVC.", beginnerRule: "Use Hessa when crossing from New Dubai/coastal side toward inland residential areas.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }, { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }], lineClass: "connector-line-d61", labelX: 28, labelY: 55, x1: 20, y1: 43, x2: 39, y2: 60 },
        { id: "d63", code: "D63", name: "Umm Suqeim Street", shortName: "Umm Suqeim", category: "primaryConnector", priority: "core", type: "Cross-city connector", whatItDoes: "Connects coast-side Dubai toward Al Barsha, Al Quoz, and Al Khail-side access.", whenToUse: "Use it when moving between Jumeirah/Umm Suqeim side, Mall of the Emirates, Al Barsha, Al Quoz, or Al Khail.", areasItHelpsWith: ["Al Barsha", "Umm Suqeim", "Al Quoz", "Mall of the Emirates side", "Dubai Hills-side access"], connectsTo: ["E11", "E44"], commonConfusion: "The road crosses several corridors, so the issue is choosing the correct side road before the destination.", beginnerRule: "Use D63 when moving across Dubai from coast-side to inland-side.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }], lineClass: "connector-line-d63", labelX: 33, labelY: 45, x1: 32, y1: 41, x2: 45, y2: 60 },
        { id: "d89", code: "D89", name: "Airport Road", shortName: "Airport Rd", category: "primaryConnector", priority: "core", type: "Airport-side connector", whatItDoes: "Serves Deira, Dubai Airport, Rashidiya, and Mirdif-side movement.", whenToUse: "Use it when travelling toward Dubai Airport, Deira, Mirdif, or airport-side Dubai.", areasItHelpsWith: ["Deira", "Mirdif", "Dubai Airport", "Rashidiya"], connectsTo: ["E11", "E311"], commonConfusion: "Airport-side lanes split quickly toward terminals, Deira, Sharjah-side roads, or Mirdif.", beginnerRule: "Before joining Airport Road, know whether you are going airport-side, Deira-side, or Mirdif-side.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }], lineClass: "connector-line-d89", labelX: 82, labelY: 53, x1: 76, y1: 38, x2: 90, y2: 61 },
        { id: "d75", code: "D75", name: "Sheikh Rashid Road", shortName: "Rashid Rd", category: "primaryConnector", priority: "core", type: "Old Dubai connector", whatItDoes: "Links Bur Dubai, Karama, Oud Metha, and routes toward Deira or central Dubai.", whenToUse: "Use it when moving around Bur Dubai, Karama, Oud Metha, or Creek-side access.", areasItHelpsWith: ["Karama", "Bur Dubai", "Oud Metha", "Deira-side access"], connectsTo: ["E11", "Old Dubai connectors"], commonConfusion: "Old Dubai has dense local roads, bridge choices, and short decision points.", beginnerRule: "Use the main connector first, then enter smaller old-Dubai roads late.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }], lineClass: "connector-line-d75", labelX: 73, labelY: 36, x1: 65, y1: 37, x2: 83, y2: 39 },
        { id: "d71", code: "D71", name: "Financial Centre Road", shortName: "Financial Ctr", category: "primaryConnector", priority: "core", type: "Central Dubai connector", whatItDoes: "Connects E11/SZR-side movement to Downtown, Dubai Mall, DIFC, and Business Bay access.", whenToUse: "Use it when moving between Sheikh Zayed Road, Downtown Dubai, Dubai Mall, DIFC, or Business Bay.", areasItHelpsWith: ["Downtown Dubai", "Business Bay", "DIFC", "Dubai Mall"], connectsTo: ["E11", "E44"], commonConfusion: "Dubai Mall and Downtown access loops are not interchangeable once you enter them.", beginnerRule: "Know whether you need Dubai Mall, Boulevard, DIFC, or Business Bay before entering the loop.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }], lineClass: "connector-line-d71", labelX: 56, labelY: 44, x1: 54, y1: 39, x2: 63, y2: 58 },
        { id: "d83", code: "D83", name: "Tripoli Street", shortName: "Tripoli", category: "secondaryConnector", priority: "secondary", type: "Inland connector", whatItDoes: "Supports Mirdif, Warqa, and airport/inland Dubai movement.", whenToUse: "Use it when moving between Mirdif-side areas and inland Dubai corridors.", areasItHelpsWith: ["Mirdif", "Warqa", "Airport-side Dubai", "E311-side access"], connectsTo: ["E311", "Airport-side roads"], commonConfusion: "It feels separate from central Dubai, so SZR/E11-based orientation does not help much.", beginnerRule: "Think of Tripoli Street as an airport/inland connector, not a central-city road.", relatedRoads: [{ code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }], lineClass: "secondary-connector-line-d83", labelX: 86, labelY: 66, x1: 79, y1: 62, x2: 93, y2: 77 },
        { id: "d92", code: "D92", name: "Al Wasl Road", shortName: "Al Wasl", category: "secondaryConnector", priority: "secondary", type: "Coastal city connector", whatItDoes: "Supports movement through Jumeirah, Al Wasl, Safa, and coastal-side Dubai.", whenToUse: "Use it when travelling along the Jumeirah/Al Wasl side instead of using Sheikh Zayed Road.", areasItHelpsWith: ["Jumeirah", "Umm Suqeim", "Al Wasl", "Safa", "Downtown-side access"], connectsTo: ["D94", "D63", "D71", "E11-side access"], commonConfusion: "It runs close to coastal areas but does not behave like a fast highway.", beginnerRule: "Use Al Wasl Road for local coastal-side movement, not long-distance Dubai movement.", relatedRoads: [{ code: "D94", label: "Jumeirah Beach Road", roadId: "d94", roadType: "secondaryConnector", available: true }, { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d92", labelX: 47, labelY: 34, x1: 34, y1: 35, x2: 66, y2: 33 },
        { id: "d94", code: "D94", name: "Jumeirah Beach Road", shortName: "Beach Rd", category: "secondaryConnector", priority: "secondary", type: "Coastal access road", whatItDoes: "Runs along the Jumeirah/coastal side and supports beach, residential, and local access.", whenToUse: "Use it for Jumeirah, Umm Suqeim, beach-side destinations, and local coastal movement.", areasItHelpsWith: ["Jumeirah", "Umm Suqeim", "Dubai Marina-side coastal movement"], connectsTo: ["D92", "D63", "coastal access roads"], commonConfusion: "It can look close to destinations but is slower and more local than the main highway network.", beginnerRule: "Use Jumeirah Beach Road for local coast-side access, not fast cross-city travel.", relatedRoads: [{ code: "D92", label: "Al Wasl Road", roadId: "d92", roadType: "secondaryConnector", available: true }, { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d94", labelX: 42, labelY: 27, x1: 28, y1: 29, x2: 61, y2: 27 },
        { id: "d78", code: "D78", name: "Oud Metha Road", shortName: "Oud Metha", category: "secondaryConnector", priority: "secondary", type: "Old Dubai connector", whatItDoes: "Connects Oud Metha, Karama, Bur Dubai, and routes toward Healthcare City and Creek-side areas.", whenToUse: "Use it for movement around Karama, Oud Metha, Bur Dubai, and old-Dubai access.", areasItHelpsWith: ["Karama", "Oud Metha", "Bur Dubai", "Healthcare City"], connectsTo: ["D75", "D89", "old Dubai connectors"], commonConfusion: "Nearby areas are close together but access roads split quickly.", beginnerRule: "In old Dubai, use the bigger connector first, then enter local streets late.", relatedRoads: [{ code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }, { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d78", labelX: 73, labelY: 28, x1: 70, y1: 32, x2: 80, y2: 46 },
        { id: "d85", code: "D85", name: "Baniyas Road", shortName: "Baniyas", category: "secondaryConnector", priority: "secondary", type: "Deira / creek-side road", whatItDoes: "Supports Deira and Creek-side movement around older Dubai.", whenToUse: "Use it when moving within Deira or along the Creek-side network.", areasItHelpsWith: ["Deira", "Creek-side Dubai", "Al Rigga-side access"], connectsTo: ["D89", "D75", "Creek crossings"], commonConfusion: "Small roads, creek crossings, and dense traffic make direction choices important.", beginnerRule: "For Deira, first decide creek-side, airport-side, or Sharjah-side.", relatedRoads: [{ code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true }, { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d85", labelX: 84, labelY: 22, x1: 79, y1: 28, x2: 93, y2: 31 },
        { id: "d70", code: "D70", name: "Al Meydan Road", shortName: "Meydan", category: "secondaryConnector", priority: "secondary", type: "Central / inland connector", whatItDoes: "Connects Business Bay, Meydan, Nad Al Sheba-side movement, and inland central Dubai.", whenToUse: "Use it for Meydan, Nad Al Sheba, and routes between central Dubai and inland districts.", areasItHelpsWith: ["Meydan", "Business Bay", "Nad Al Sheba"], connectsTo: ["E44", "D71", "E66-side movement"], commonConfusion: "It can pull users away from central Dubai if they are not aiming for Meydan or inland access.", beginnerRule: "Use Meydan Road when your destination is central-inland, not when you need coastal or old-Dubai access.", relatedRoads: [{ code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }, { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d70", labelX: 64, labelY: 59, x1: 60, y1: 52, x2: 73, y2: 70 },
        { id: "d54", code: "D54", name: "Zabeel Road", shortName: "Zabeel", category: "secondaryConnector", priority: "secondary", type: "Central Dubai connector", whatItDoes: "Supports movement around Zabeel, Trade Centre, Karama-side access, and central Dubai.", whenToUse: "Use it for central Dubai movement between old Dubai, Trade Centre, and Zabeel-side areas.", areasItHelpsWith: ["Trade Centre", "Zabeel", "Karama", "DIFC-side access"], connectsTo: ["E11", "D75", "D71"], commonConfusion: "Central Dubai roads are close together but often separated by interchanges and one-way access.", beginnerRule: "In central Dubai, identify the side of the interchange before following the final pin.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }, { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }], lineClass: "secondary-connector-line-d54", labelX: 69, labelY: 35, x1: 65, y1: 34, x2: 76, y2: 39 },
        { id: "d57", code: "D57", name: "Al Qudra Road", shortName: "Qudra", category: "secondaryConnector", priority: "secondary", type: "Outer / desert-side connector", whatItDoes: "Connects inland residential areas toward Dubai Studio City, Arabian Ranches, and desert-side routes.", whenToUse: "Use it for Dubai Studio City, Arabian Ranches, Al Qudra-side movement, and outer residential areas.", areasItHelpsWith: ["Motor City", "Sports City", "Arabian Ranches", "Studio City", "Al Qudra-side access"], connectsTo: ["E611", "E311", "E44-side access"], commonConfusion: "It feels far from central Dubai and can create long detours if selected accidentally.", beginnerRule: "Use Al Qudra Road only when your destination is clearly outer/inland residential or desert-side.", relatedRoads: [{ code: "E611", label: "E611", roadId: "e611", roadType: "highway", available: true }, { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }, { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }], lineClass: "secondary-connector-line-d57", labelX: 39, labelY: 88, x1: 26, y1: 82, x2: 55, y2: 92 }
      ];
      const areas = [
        { id: "dubai-marina", name: "Dubai Marina", x: 17, y: 34, width: 10, height: 7, howToThink: "A dense coastal district beside Sheikh Zayed Road, close to JLT and JBR.", mainRoadAccess: ["E11 / Sheikh Zayed Road"], connectors: ["Marina access roads", "JBR-side roads", "Interchange access from SZR"], driverConfusion: "Drivers often confuse Marina, JBR, and JLT because they sit close together but use different access patterns.", beginnerRule: "Know whether your destination is Marina-side, JBR-side, or JLT-side before leaving E11." },
        { id: "jlt", name: "JLT", x: 23, y: 44, width: 9, height: 7, howToThink: "A cluster-based district opposite Dubai Marina, accessed mainly from Sheikh Zayed Road.", mainRoadAccess: ["E11 / Sheikh Zayed Road"], connectors: ["JLT cluster roads", "DMCC access roads"], driverConfusion: "Entering the wrong cluster loop can waste time even after reaching the correct area.", beginnerRule: "Find the cluster first. Then follow the internal route." },
        { id: "al-barsha", name: "Al Barsha", x: 37, y: 50, width: 12, height: 8, howToThink: "An inland-west Dubai area around Mall of the Emirates, sitting between E11, Umm Suqeim Street, Hessa Street, and Al Khail-side access.", mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"], connectors: ["Umm Suqeim Street", "Hessa Street"], driverConfusion: "The main issue is service-road access near Mall of the Emirates and choosing the wrong side of Al Barsha.", beginnerRule: "Decide your approach first: E11 side, Al Khail side, Hessa side, or Umm Suqeim side." },
        { id: "jvc", name: "JVC", x: 40, y: 66, width: 11, height: 9, howToThink: "An inland residential area reached through connector roads rather than one simple main entrance.", mainRoadAccess: ["E44 / Al Khail Road", "E311 / Sheikh Mohammed Bin Zayed Road"], connectors: ["Hessa Street", "Al Khail access roads"], driverConfusion: "JVC has multiple gates and circular internal movement, so the wrong entry can create a long loop.", beginnerRule: "Choose the entry based on where you are coming from, not just the destination pin." },
        { id: "downtown", name: "Downtown Dubai", x: 61, y: 36, width: 12, height: 8, howToThink: "A central landmark district around Dubai Mall and Burj Khalifa, connected to both E11 and Al Khail-side roads.", mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"], connectors: ["Financial Centre Road", "Dubai Mall access roads", "Business Bay access roads"], driverConfusion: "The confusing part is not reaching Downtown. It is choosing the right Dubai Mall, Boulevard, or tower access loop.", beginnerRule: "Know whether you are going to Dubai Mall, Boulevard, DIFC-side, or Business Bay-side." },
        { id: "business-bay", name: "Business Bay", x: 61, y: 49, width: 12, height: 8, howToThink: "A central business district between Downtown, Sheikh Zayed Road, the canal, and Al Khail Road.", mainRoadAccess: ["E11 / Sheikh Zayed Road", "E44 / Al Khail Road"], connectors: ["Al Khail Road", "Financial Centre Road", "Business Bay internal roads"], driverConfusion: "Many destinations are close on the map but separated by canal-side roads, tower access roads, and one-way movements.", beginnerRule: "Check whether the destination is SZR-side, canal-side, or Al Khail-side before entering." },
        { id: "karama", name: "Karama", x: 75, y: 38, width: 10, height: 7, howToThink: "A dense older central Dubai area near Bur Dubai and Oud Metha.", mainRoadAccess: ["Oud Metha Road", "Sheikh Khalifa Bin Zayed Street", "Sheikh Rashid Road"], connectors: ["Oud Metha Road", "Al Mankhool-side access", "Bur Dubai connectors"], driverConfusion: "Small internal roads and parking access can make the final part harder than the main trip.", beginnerRule: "Use the bigger connector road first. Enter the small streets late." },
        { id: "bur-dubai", name: "Bur Dubai", x: 78, y: 29, width: 12, height: 8, howToThink: "An older central district connected to Karama, Deira, Oud Metha, and the Creek-side road network.", mainRoadAccess: ["Sheikh Rashid Road", "Oud Metha Road", "Al Mankhool Road"], connectors: ["Creek crossing routes", "Karama connectors", "Oud Metha access"], driverConfusion: "Drivers often mix up Bur Dubai, Karama, Oud Metha, and Deira-side access.", beginnerRule: "First decide which side of the Creek or old-Dubai network you need." },
        { id: "deira", name: "Deira", x: 86, y: 31, width: 14, height: 9, howToThink: "An older Dubai district on the Creek and airport side, with dense roads and several bridge/crossing choices.", mainRoadAccess: ["Airport Road", "Baniyas Road", "E11-side access"], connectors: ["Al Maktoum Bridge routes", "Airport Road", "Creek-side roads"], driverConfusion: "The main confusion is choosing the wrong bridge, creek crossing, or airport-side direction.", beginnerRule: "Before entering Deira, know whether you are going creek-side, airport-side, or Sharjah-side." },
        { id: "mirdif", name: "Mirdif", x: 88, y: 67, width: 12, height: 9, howToThink: "An inland residential area near airport-side Dubai, away from the central E11/SZR corridor.", mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road", "Airport Road"], connectors: ["Tripoli Street", "Airport Road", "Mirdif internal roads"], driverConfusion: "It is easy to confuse Mirdif routes with airport, Mushrif, or Rashidiya-side roads.", beginnerRule: "Think of Mirdif as airport/inland Dubai, not central Dubai." }
      ];
      const areaRelatedRoads = {
        "dubai-marina": [
          { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }
        ],
        jlt: [
          { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }
        ],
        "al-barsha": [
          { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
          { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
          { code: "D61", label: "Hessa Street", roadId: "d61", roadType: "connector", available: true },
          { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }
        ],
        jvc: [
          { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
          { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
          { code: "D61", label: "Hessa Street", roadId: "d61", roadType: "connector", available: true }
        ],
        downtown: [
          { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
          { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
          { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
        ],
        "business-bay": [
          { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true },
          { code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true },
          { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }
        ],
        karama: [
          { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
          { code: "D78", label: "Oud Metha Road", roadId: null, available: false }
        ],
        "bur-dubai": [
          { code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true },
          { code: "D78", label: "Oud Metha Road", roadId: null, available: false },
          { code: "D92", label: "Al Mankhool / Jumeirah-side access", roadId: null, available: false }
        ],
        deira: [
          { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
          { code: "D85", label: "Baniyas Road", roadId: null, available: false },
          { code: "E11", label: "E11-side access", roadId: "e11", roadType: "highway", available: true }
        ],
        mirdif: [
          { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true },
          { code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true },
          { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "connector", available: true }
        ]
      };
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
        { id: "jumeirah", name: "Jumeirah", priority: "secondary", x: 48, y: 28, width: 18, height: 8, howToThink: "A coastal-side residential and lifestyle corridor between beach-side roads and inland city connectors.", mainRoadAccess: ["D92 / Al Wasl Road", "D94 / Jumeirah Beach Road"], connectors: ["D63 / Umm Suqeim Street", "D92 / Al Wasl Road"], nearbyAreas: ["Umm Suqeim", "Al Wasl", "Downtown-side access"], driverConfusion: "It is easy to stay on a slow coastal road when a connector would be cleaner.", beginnerRule: "Use Jumeirah roads for local coastal access, not fast cross-city movement.", relatedRoads: [{ code: "D92", label: "Al Wasl Road", roadId: "d92", roadType: "secondaryConnector", available: true }, { code: "D94", label: "Jumeirah Beach Road", roadId: "d94", roadType: "secondaryConnector", available: true }, { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }] },
        { id: "umm-suqeim", name: "Umm Suqeim", priority: "secondary", x: 36, y: 31, width: 11, height: 6, howToThink: "A coast-to-inland hinge area between Jumeirah, Al Barsha, and Al Quoz.", mainRoadAccess: ["D63 / Umm Suqeim Street", "E11-side access"], connectors: ["Umm Suqeim Street", "Al Wasl Road"], nearbyAreas: ["Jumeirah", "Al Barsha", "Al Quoz"], driverConfusion: "The name appears on both coast-side and inland movement, so it is easy to choose the wrong side.", beginnerRule: "Use D63 when crossing between coast-side Dubai and inland Dubai.", relatedRoads: [{ code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }, { code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }] },
        { id: "al-quoz", name: "Al Quoz", priority: "secondary", x: 48, y: 51, width: 10, height: 7, howToThink: "An inland mixed industrial and local-access area between Al Barsha, Business Bay, and Al Khail.", mainRoadAccess: ["E44 / Al Khail Road", "D63 / Umm Suqeim Street"], connectors: ["Umm Suqeim Street", "Al Khail access roads"], nearbyAreas: ["Al Barsha", "Business Bay", "Dubai Hills"], driverConfusion: "Industrial-area access roads can be indirect and may not connect the way they look on a map.", beginnerRule: "Use the main connector first, then solve the internal access road.", relatedRoads: [{ code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }, { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }] },
        { id: "dubai-hills", name: "Dubai Hills", priority: "secondary", x: 47, y: 66, width: 11, height: 7, howToThink: "An inland planned area reached through Al Khail-side movement and local access roads.", mainRoadAccess: ["E44 / Al Khail Road", "Umm Suqeim Street-side access"], connectors: ["Al Khail access roads", "Umm Suqeim Street"], nearbyAreas: ["Al Barsha", "Al Quoz", "JVC"], driverConfusion: "The destination can be close to Al Khail but still require a specific access loop.", beginnerRule: "Do not leave the main road until you know the correct community-side access.", relatedRoads: [{ code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }, { code: "D63", label: "Umm Suqeim Street", roadId: "d63", roadType: "connector", available: true }] },
        { id: "difc", name: "DIFC", priority: "secondary", x: 66, y: 34, width: 8, height: 5, howToThink: "A central business district beside E11 and close to Downtown and Trade Centre.", mainRoadAccess: ["E11 / Sheikh Zayed Road", "Financial Centre Road"], connectors: ["Financial Centre Road", "SZR service roads"], nearbyAreas: ["Downtown Dubai", "Trade Centre", "Business Bay"], driverConfusion: "Tower access and service-road choice matter more than the final pin.", beginnerRule: "Know whether you need DIFC, Downtown, or Trade Centre before leaving E11.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "D71", label: "Financial Centre Road", roadId: "d71", roadType: "connector", available: true }] },
        { id: "trade-centre", name: "Trade Centre", priority: "secondary", x: 70, y: 34, width: 9, height: 5, howToThink: "A central E11 landmark area between DIFC, Downtown access, and Old Dubai movement.", mainRoadAccess: ["E11 / Sheikh Zayed Road"], connectors: ["SZR service roads", "World Trade Centre access roads"], nearbyAreas: ["DIFC", "Downtown Dubai", "Karama"], driverConfusion: "It is easy to overshoot the correct side of E11 or enter the wrong service road.", beginnerRule: "Pick the correct side of Sheikh Zayed Road before the final approach.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }] },
        { id: "oud-metha", name: "Oud Metha", priority: "secondary", x: 76, y: 45, width: 9, height: 6, howToThink: "An Old Dubai connector area between Karama, Bur Dubai, and Creek-side movement.", mainRoadAccess: ["Sheikh Rashid Road", "Oud Metha Road"], connectors: ["Sheikh Rashid Road", "Oud Metha Road"], nearbyAreas: ["Karama", "Bur Dubai", "Deira"], driverConfusion: "Short local decisions happen quickly around hospitals, schools, and Creek crossings.", beginnerRule: "Use the larger Old Dubai connector first, then enter local roads late.", relatedRoads: [{ code: "D75", label: "Sheikh Rashid Road", roadId: "d75", roadType: "connector", available: true }] },
        { id: "rashidiya", name: "Rashidiya", priority: "secondary", x: 87, y: 57, width: 10, height: 6, howToThink: "An airport-side area between Deira, Mirdif, Airport Road, and inland movement.", mainRoadAccess: ["Airport Road", "E311-side access"], connectors: ["Airport Road", "Tripoli Street"], nearbyAreas: ["Mirdif", "Deira", "International City"], driverConfusion: "Airport, Deira, and Mirdif movements split close together.", beginnerRule: "Decide whether you are airport-side, Deira-side, or Mirdif-side before the split.", relatedRoads: [{ code: "D89", label: "Airport Road", roadId: "d89", roadType: "connector", available: true }, { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "secondaryConnector", available: true }] },
        { id: "dubai-silicon-oasis", name: "Dubai Silicon Oasis", priority: "secondary", x: 73, y: 86, width: 13, height: 7, howToThink: "An inland south-east area connected more to E311/E66 logic than central Dubai.", mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road", "E66 / Dubai-Al Ain Road"], connectors: ["E311 access roads", "E66 access roads"], nearbyAreas: ["International City", "Mirdif", "Academic City-side areas"], driverConfusion: "It can feel close to city Dubai on the map but behaves like an inland-area route.", beginnerRule: "Think inland first: E311/E66 matter more than E11.", relatedRoads: [{ code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }, { code: "E66", label: "E66", roadId: "e66", roadType: "highway", available: true }] },
        { id: "international-city", name: "International City", priority: "secondary", x: 83, y: 65, width: 18, height: 10, howToThink: "An inland east Dubai area connected through E311-side and airport/inland movement.", mainRoadAccess: ["E311 / Sheikh Mohammed Bin Zayed Road"], connectors: ["E311 access roads", "Tripoli Street-side movement"], nearbyAreas: ["Mirdif", "Rashidiya", "Dubai Silicon Oasis"], driverConfusion: "Cluster access and inland approaches can make the final part feel indirect.", beginnerRule: "Use E311 as the main anchor, then solve the cluster-side access.", relatedRoads: [{ code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }, { code: "D83", label: "Tripoli Street", roadId: "d83", roadType: "secondaryConnector", available: true }] },
        { id: "meydan", name: "Meydan", priority: "secondary", x: 61, y: 64, width: 16, height: 11, howToThink: "A central-inland area connected to Business Bay, Al Khail, and inland Dubai.", mainRoadAccess: ["E44 / Al Khail Road", "D70 / Al Meydan Road"], connectors: ["D70 / Al Meydan Road"], nearbyAreas: ["Business Bay", "Al Quoz", "Nad Al Sheba"], driverConfusion: "It feels close to Downtown, but access often works through inland connectors.", beginnerRule: "Think of Meydan as central-inland, not Downtown-side.", relatedRoads: [{ code: "E44", label: "E44", roadId: "e44", roadType: "highway", available: true }, { code: "D70", label: "Al Meydan Road", roadId: "d70", roadType: "secondaryConnector", available: true }] },
        { id: "jebel-ali", name: "Jebel Ali", priority: "secondary", x: 11, y: 74, width: 18, height: 10, howToThink: "A south-west Dubai area connected to industrial, port, free zone, and Abu Dhabi-side movement.", mainRoadAccess: ["E11 / Sheikh Zayed Road", "E311 / Sheikh Mohammed Bin Zayed Road"], connectors: ["Jebel Ali access roads", "port/free zone roads"], nearbyAreas: ["Dubai Marina", "Dubai South-side routes", "Abu Dhabi direction"], driverConfusion: "Industrial/free-zone access roads are not always interchangeable.", beginnerRule: "For Jebel Ali, know whether you need port, free zone, residential, or Abu Dhabi-side access.", relatedRoads: [{ code: "E11", label: "E11", roadId: "e11", roadType: "highway", available: true }, { code: "E311", label: "E311", roadId: "e311", roadType: "highway", available: true }] }
      ];
      areas.forEach((area) => {
        area.priority = area.priority || "core";
        area.nearbyAreas = area.nearbyAreas || areaNearbyAreas[area.id] || [];
        area.relatedRoads = areaRelatedRoads[area.id] || [];
      });
      areas.push(...secondaryAreas);
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
      areas.forEach((area) => {
        area.region = area.region || areaRegions[area.id] || "Dubai";
      });
      const routeModeTitle = "Route Logic & Reasoning";
      const routeLogics = [
        {
          id: "al-barsha-downtown",
          title: "Al Barsha → Downtown Dubai",
          fromAreaId: "al-barsha",
          toAreaId: "downtown",
          involvedRoadIds: ["e11", "e44"],
          involvedConnectorIds: ["d63", "d71"],
          roadChips: [{ code: "E11", id: "e11", type: "highway" }, { code: "E44", id: "e44", type: "highway" }, { code: "D63", id: "d63", type: "connector" }, { code: "D71", id: "d71", type: "connector" }],
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
          roadChips: [{ code: "E11", id: "e11", type: "highway" }, { code: "D89", id: "d89", type: "connector" }],
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
          roadChips: [{ code: "E11", id: "e11", type: "highway" }, { code: "E44", id: "e44", type: "highway" }, { code: "D63", id: "d63", type: "connector" }, { code: "D75", id: "d75", type: "connector" }],
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
          roadChips: [{ code: "E44", id: "e44", type: "highway" }, { code: "D61", id: "d61", type: "connector" }, { code: "D71", id: "d71", type: "connector" }],
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
          roadChips: [{ code: "E311", id: "e311", type: "highway" }, { code: "E44", id: "e44", type: "highway" }, { code: "E11", id: "e11", type: "highway" }, { code: "D83", id: "d83", type: "connector" }, { code: "D89", id: "d89", type: "connector" }],
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
        { id: "jumeirah-al-barsha", title: "Jumeirah → Al Barsha", fromAreaId: "jumeirah", toAreaId: "al-barsha", involvedRoadIds: ["e11", "e44"], involvedConnectorIds: ["d63", "d92", "d94"], roadChips: [{ code: "D94", id: "d94", type: "secondaryConnector" }, { code: "D92", id: "d92", type: "secondaryConnector" }, { code: "D63", id: "d63", type: "connector" }, { code: "E11", id: "e11", type: "highway" }, { code: "E44", id: "e44", type: "highway" }], whatYouAreDoing: "Moving from the coast-side Jumeirah corridor toward inland-west Dubai.", routeShape: "Coast-side area → local coastal connector → D63 cross-city connector → Al Barsha access side.", mainRouteIdea: "Use Jumeirah-side roads only as local feeders, then switch to D63 or the relevant highway corridor before the final Al Barsha side.", roadChoice: "D92/D94 are local coastal choices. D63 is the clearer cross-city mental anchor toward Al Barsha, with E11 or E44 useful depending on your start side.", criticalDecision: "Decide early whether you are staying local on the coast or crossing inland through D63.", commonMistake: "Staying on slow coastal roads too long, then trying to cut inland late.", beginnerRule: "For Jumeirah to Al Barsha, use coastal roads to leave the area, not as the whole route." },
        { id: "dso-downtown", title: "Dubai Silicon Oasis → Downtown Dubai", fromAreaId: "dubai-silicon-oasis", toAreaId: "downtown", involvedRoadIds: ["e66", "e44"], involvedConnectorIds: ["d71"], roadChips: [{ code: "E66", id: "e66", type: "highway" }, { code: "E44", id: "e44", type: "highway" }, { code: "D71", id: "d71", type: "connector" }], whatYouAreDoing: "Moving from inland south-east Dubai toward the central landmark/business district.", routeShape: "Inland south-east area → regional/inland highway → central access connector → Downtown loop.", mainRouteIdea: "Use E66/E44 as the inland movement anchors before solving Downtown's final access loop.", roadChoice: "E66 helps leave Dubai Silicon Oasis, while E44 helps align with central Dubai. D71 becomes relevant near Downtown/DIFC access.", criticalDecision: "Shift from inland highway thinking to Downtown access-loop thinking before the final approach.", commonMistake: "Treating Downtown as a single pin and entering the wrong mall, boulevard, or DIFC-side access.", beginnerRule: "From DSO to Downtown, first solve the inland corridor, then solve the final access loop." }
      );
      const routeLogicRelations = {
        "al-barsha-downtown": { relatedAreaIds: ["al-barsha", "downtown"], relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d63", "d71"], relatedSecondaryConnectorIds: [] },
        "dubai-marina-deira": { relatedAreaIds: ["dubai-marina", "deira"], relatedRoadIds: ["e11"], relatedConnectorIds: ["d89"], relatedSecondaryConnectorIds: [] },
        "karama-al-barsha": { relatedAreaIds: ["karama", "al-barsha"], relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d75", "d63"], relatedSecondaryConnectorIds: [] },
        "jvc-business-bay": { relatedAreaIds: ["jvc", "business-bay"], relatedRoadIds: ["e44"], relatedConnectorIds: ["d61", "d71"], relatedSecondaryConnectorIds: [] },
        "mirdif-dubai-marina": { relatedAreaIds: ["mirdif", "dubai-marina"], relatedRoadIds: ["e311", "e44", "e11"], relatedConnectorIds: ["d89"], relatedSecondaryConnectorIds: ["d83"] },
        "jumeirah-al-barsha": { relatedAreaIds: ["jumeirah", "umm-suqeim", "al-barsha"], relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d63"], relatedSecondaryConnectorIds: ["d92", "d94"] },
        "dso-downtown": { relatedAreaIds: ["dubai-silicon-oasis", "downtown"], relatedRoadIds: ["e66", "e44"], relatedConnectorIds: ["d71"], relatedSecondaryConnectorIds: [] }
      };
      routeLogics.forEach((route) => {
        const relation = routeLogicRelations[route.id] || {};
        route.relatedAreaIds = relation.relatedAreaIds || [route.fromAreaId, route.toAreaId].filter(Boolean);
        route.relatedRoadIds = relation.relatedRoadIds || route.involvedRoadIds || [];
        route.relatedConnectorIds = relation.relatedConnectorIds || [];
        route.relatedSecondaryConnectorIds = relation.relatedSecondaryConnectorIds || [];
      });
      function getRouteExamplesForItem(itemType, itemId) {
        return routeLogics.filter((route) => {
          if (itemType === "area") return route.relatedAreaIds.includes(itemId) || route.fromAreaId === itemId || route.toAreaId === itemId;
          if (itemType === "road") return route.relatedRoadIds.includes(itemId) || route.involvedRoadIds.includes(itemId);
          if (itemType === "connector") return route.relatedConnectorIds.includes(itemId) || route.involvedConnectorIds.includes(itemId);
          if (itemType === "secondaryConnector") return route.relatedSecondaryConnectorIds.includes(itemId);
          return false;
        });
      }
      const mistakeModeTitle = "Learn Common Road Mistakes";
      const roadMistakes = [
        { id: "service-road-confusion", title: "Service road confusion", shortLabel: "Service roads", relatedRoadIds: ["e11"], relatedConnectorIds: ["d63", "d71"], relatedAreaIds: ["al-barsha", "business-bay", "dubai-marina", "jlt"], whatHappens: "You are close to the destination, but you are on the wrong road layer: main road instead of service road, or service road instead of main road.", whyItHappens: "Dubai often separates fast highway movement from local building or mall access. The road beside your destination may not be reachable from your current lane.", usuallyHappensAround: ["E11 / Sheikh Zayed Road", "Mall of the Emirates side", "Business Bay", "Dubai Marina", "JLT"], howToAvoid: "Check early whether the destination needs main-road access, service-road access, or a connector exit.", beginnerRule: "In Dubai, being on the correct road layer matters before the final turn." },
        { id: "missing-exits", title: "Missing exits", shortLabel: "Missed exits", relatedRoadIds: ["e11", "e44", "e311"], relatedConnectorIds: ["d61", "d63", "d71"], relatedAreaIds: ["al-barsha", "downtown", "business-bay", "jvc"], whatHappens: "You miss one exit and the next legal correction takes much longer than expected.", whyItHappens: "Major roads have fast traffic, separated lanes, and exits that often require early positioning.", usuallyHappensAround: ["E11", "Al Khail Road", "Al Barsha", "Downtown Dubai", "JVC"], howToAvoid: "Think one or two exits ahead. Move gradually instead of waiting for the last instruction.", beginnerRule: "Treat exits as early decisions, not last-second turns." },
        { id: "wrong-highway-choice", title: "Wrong highway choice", shortLabel: "Wrong highway", relatedRoadIds: ["e11", "e44", "e311", "e611"], relatedConnectorIds: [], relatedAreaIds: ["jvc", "mirdif", "business-bay", "dubai-marina"], whatHappens: "The route still works, but it sends you too far inside, too far outside, or through a more confusing corridor.", whyItHappens: "Dubai has parallel highways that look interchangeable on a map but serve different movement patterns.", usuallyHappensAround: ["E11", "E44", "E311", "E611"], howToAvoid: "Choose the road based on the kind of trip: central, inland, outer bypass, or regional.", beginnerRule: "E11 is central/coastal, E44 is inland city, E311 is inland bypass, E611 is outer bypass." },
        { id: "e311-vs-e611", title: "E311 vs E611 confusion", shortLabel: "E311 vs E611", relatedRoadIds: ["e311", "e611"], relatedConnectorIds: [], relatedAreaIds: ["mirdif", "jvc"], whatHappens: "You choose the farther outer road when you actually need the city-side inland road, or vice versa.", whyItHappens: "Both roads feel like large inland highways, but E311 is generally closer to city districts while E611 is farther outside.", usuallyHappensAround: ["Mirdif", "JVC-side access", "outer Dubai", "northern emirates routes"], howToAvoid: "Ask whether your destination is still part of city Dubai or genuinely outside/outer Dubai.", beginnerRule: "E311 is the inland city-side bypass. E611 is the farther outer bypass." },
        { id: "late-lane-changes", title: "Late lane changes", shortLabel: "Late lanes", relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d63", "d71"], relatedAreaIds: ["downtown", "business-bay", "al-barsha"], whatHappens: "You realize too late that the correct exit or split is on another side of the road.", whyItHappens: "Large interchanges and multi-lane roads require positioning before the instruction feels urgent.", usuallyHappensAround: ["E11 interchanges", "Downtown access", "Business Bay", "Mall of the Emirates side"], howToAvoid: "Move across lanes gradually when the destination is several minutes away, not when the exit is immediate.", beginnerRule: "Lane planning starts before the map says turn." },
        { id: "wrong-area-side", title: "Wrong side of an area", shortLabel: "Wrong area side", relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d61", "d63", "d71"], relatedAreaIds: ["al-barsha", "business-bay", "downtown", "jvc", "dubai-marina", "jlt"], whatHappens: "You reach the correct area but enter from the wrong side, creating loops, U-turns, or service-road confusion.", whyItHappens: "Many Dubai areas are split by highways, canals, loops, clusters, or one-way access patterns.", usuallyHappensAround: ["Al Barsha", "JVC", "Business Bay", "Downtown Dubai", "Dubai Marina", "JLT"], howToAvoid: "Before entering the area, identify which side your destination belongs to.", beginnerRule: "For complex areas, the correct side matters as much as the correct area." },
        { id: "creek-crossing-confusion", title: "Old Dubai / Creek crossing confusion", shortLabel: "Creek crossings", relatedRoadIds: ["e11"], relatedConnectorIds: ["d75", "d89"], relatedAreaIds: ["deira", "bur-dubai", "karama"], whatHappens: "You head toward Old Dubai but choose the wrong creek crossing, bridge direction, or airport-side approach.", whyItHappens: "Bur Dubai, Karama, Deira, Oud Metha, and airport-side routes are close together but rely on different crossings and connectors.", usuallyHappensAround: ["Deira", "Bur Dubai", "Karama", "Airport Road", "Creek-side roads"], howToAvoid: "Decide first whether you need Deira side, Bur Dubai side, airport side, or Sharjah side.", beginnerRule: "Old Dubai routing starts with the correct side of the Creek." },
        { id: "mall-access-loops", title: "Mall and tower access loops", shortLabel: "Access loops", relatedRoadIds: ["e11", "e44"], relatedConnectorIds: ["d63", "d71"], relatedAreaIds: ["downtown", "business-bay", "al-barsha"], whatHappens: "You are near the destination but enter the wrong parking, tower, mall, or boulevard loop.", whyItHappens: "Large destinations often have multiple access loops that are not interchangeable once you enter them.", usuallyHappensAround: ["Dubai Mall", "Downtown Dubai", "Business Bay", "Mall of the Emirates"], howToAvoid: "Check the destination side and access type before entering the final loop.", beginnerRule: "For malls and towers, final access is its own mini-route." }
      ];
      const mistakeRouteExamples = {
        "service-road-confusion": ["al-barsha-downtown", "dubai-marina-deira"],
        "missing-exits": ["al-barsha-downtown", "jvc-business-bay"],
        "creek-crossing-confusion": ["dubai-marina-deira", "karama-al-barsha"]
      };
      roadMistakes.forEach((mistake) => {
        mistake.routeExampleIds = mistakeRouteExamples[mistake.id] || [];
      });

      const root = document.getElementById("root");
      let screen = "landing";
      let selectedTab = modeTabs[0];
      let selectedRoad = null;
      let selectedConnectorRoad = null;
      let selectedArea = null;
      let selectedRouteLogic = null;
      let selectedMistake = null;
      let selectedMapMode = "roads";
      let mapZoom = 1;
      let mapPan = { x: 0, y: 0 };
      let selectedViewPresetId = "beginner";
      let userChoseViewPreset = false;
      let mapFilters = { ...viewPresets.find((preset) => preset.id === selectedViewPresetId).filters };
      let showMoreOptions = false;
      let dragState = null;

      function applyViewPreset(presetId, markAsUserChoice = false) {
        const preset = viewPresets.find((item) => item.id === presetId);
        if (!preset) return;

        selectedViewPresetId = preset.id;
        mapFilters = { ...preset.filters };

        if (markAsUserChoice) {
          userChoseViewPreset = true;
        }
      }

      function visibleLayerText() {
        const visibleLayers = Object.entries(mapFilters)
          .filter(([layerName, isVisible]) => Object.prototype.hasOwnProperty.call(layerLabels, layerName) && isVisible)
          .map(([layerName]) => layerLabels[layerName]);

        return visibleLayers.length ? visibleLayers.join(", ") : "No layers selected";
      }

      function shouldShowHighway(road) {
        return mapFilters.showHighways && road.category === "highway";
      }

      function shouldShowGhostHighway(road) {
        return !mapFilters.showHighways && mapFilters.ghostHighways && road.category === "highway";
      }

      function shouldShowConnector(road) {
        return (road.category === "primaryConnector" && mapFilters.showPrimaryConnectors) ||
          (road.category === "secondaryConnector" && mapFilters.showSecondaryConnectors) ||
          Boolean(selectedRouteLogic?.involvedConnectorIds.includes(road.id)) ||
          Boolean(selectedMistake?.relatedConnectorIds.includes(road.id));
      }

      function shouldShowArea(area) {
        return (area.priority === "core" && mapFilters.showCoreAreas) ||
          (area.priority === "secondary" && mapFilters.showSecondaryAreas) ||
          Boolean(area.id === selectedRouteLogic?.fromAreaId || area.id === selectedRouteLogic?.toAreaId) ||
          Boolean(selectedMistake?.relatedAreaIds.includes(area.id));
      }

      function selectRoad(road) {
        console.log("Selected road:", road);
        selectedMapMode = "roads";
        selectedRoad = road;
        selectedConnectorRoad = null;
        selectedArea = null;
        selectedRouteLogic = null;
        selectedMistake = null;
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function selectConnectorRoad(road) {
        console.log("Selected connector road:", road);
        selectedMapMode = "roads";
        selectedConnectorRoad = road;
        selectedRoad = null;
        selectedArea = null;
        selectedRouteLogic = null;
        selectedMistake = null;
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function selectArea(area) {
        console.log("Selected area:", area);
        selectedMapMode = "areas";
        selectedArea = area;
        selectedRoad = null;
        selectedConnectorRoad = null;
        selectedRouteLogic = null;
        selectedMistake = null;
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function selectRouteLogic(route) {
        selectedMapMode = "routes";
        selectedRouteLogic = route;
        selectedRoad = null;
        selectedConnectorRoad = null;
        selectedArea = null;
        selectedMistake = null;
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function openRouteExample(route) {
        selectedTab = routeModeTitle;
        selectedMapMode = "routes";
        selectedRouteLogic = route;
        selectedRoad = null;
        selectedConnectorRoad = null;
        selectedArea = null;
        selectedMistake = null;
        applyViewPreset(route.relatedSecondaryConnectorIds?.length ? "expanded-dubai" : "area-connection", true);
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function selectMistake(mistake) {
        selectedMapMode = "mistakes";
        selectedMistake = mistake;
        selectedRoad = null;
        selectedConnectorRoad = null;
        selectedArea = null;
        selectedRouteLogic = null;
        renderMap();
        scrollToInfoPanelIfNeeded();
      }

      function changeMapMode(title) {
        selectedTab = title;

        if (title === routeModeTitle) {
          applyViewPreset("area-connection");
          selectRouteLogic(selectedRouteLogic || routeLogics[0]);
          return;
        }

        if (title === mistakeModeTitle) {
          applyViewPreset("area-connection");
          selectMistake(selectedMistake || roadMistakes[0]);
          return;
        }

        if (!userChoseViewPreset) {
          applyViewPreset(title === "Area Understanding" ? "beginner" : "road-skeleton");
        }

        selectedRouteLogic = null;
        selectedMistake = null;
        renderMap();
      }

      function scrollToInfoPanelIfNeeded() {
        window.setTimeout(() => {
          const infoPanel = document.querySelector(".info-panel");
          const mapCard = document.querySelector(".dubai-map-card");

          if (!infoPanel || !mapCard) return;

          const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;
          const infoRect = infoPanel.getBoundingClientRect();
          const mapRect = mapCard.getBoundingClientRect();
          const infoIsBelowMap = infoRect.top >= mapRect.bottom - 8;

          if (isMobileOrTablet || infoIsBelowMap) {
            infoPanel.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 0);
      }

      function renderRelatedRoads(area) {
        return `<section class="info-section"><h3>Related roads</h3><div class="related-road-list">${area.relatedRoads.map((relatedRoad) => `<button key="${area.id}-${relatedRoad.code}-${relatedRoad.label}" class="related-road-pill ${relatedRoad.available ? "" : "disabled"}" data-related-road="${relatedRoad.roadId || ""}" data-road-type="${relatedRoad.roadType || "highway"}" ${relatedRoad.available ? "" : "disabled"} title="${relatedRoad.available ? `View ${relatedRoad.label}` : `${relatedRoad.label} coming next`}" aria-label="${relatedRoad.available ? `View ${relatedRoad.label}` : `${relatedRoad.label} coming next`}"><strong>${relatedRoad.code}</strong><span>${relatedRoad.label}</span></button>`).join("")}</div></section>`;
      }

      function renderConnectorRelatedRoads(road) {
        return `<section class="info-section"><h3>Related roads</h3><div class="related-road-list">${road.relatedRoads.map((relatedRoad) => `<button key="${road.id}-${relatedRoad.code}-${relatedRoad.label}" class="related-road-pill" data-related-road="${relatedRoad.roadId}" data-road-type="${relatedRoad.roadType || "highway"}" title="View ${relatedRoad.label}" aria-label="View ${relatedRoad.label}"><strong>${relatedRoad.code}</strong><span>${relatedRoad.label}</span></button>`).join("")}</div></section>`;
      }

      function renderRouteExamples(itemType, itemId, routes = null) {
        const examples = routes || getRouteExamplesForItem(itemType, itemId);
        return `<section class="info-section route-example-section"><h3>Route logic examples</h3>${examples.length ? `<div class="route-example-list">${examples.map((route) => `<button class="route-example-card" data-route-example="${route.id}"><strong>${route.title}</strong><span>View route logic</span></button>`).join("")}</div>` : `<p class="empty-route-examples">No route examples added yet for this item.</p>`}</section>`;
      }

      function renderRouteLogicInfo(route) {
        return `<div class="route-logic-selector" aria-label="Preset route selector">${routeLogics.map((preset) => `<button class="route-logic-button ${route.id === preset.id ? "selected" : ""}" data-route-logic="${preset.id}"><span>${preset.title}</span></button>`).join("")}</div><p class="eyebrow">Route Logic</p><h2>${route.title}</h2><div class="route-road-pills" aria-label="Likely roads involved">${route.roadChips.map((chip) => `<button data-route-chip="${chip.id}" data-road-type="${chip.type}">${chip.code}</button>`).join("")}</div><div class="detail-block"><span>What you are doing</span><strong>${route.whatYouAreDoing}</strong></div><div class="detail-block"><span>Route shape</span><strong>${route.routeShape}</strong></div><div class="detail-block"><span>Main route idea</span><strong>${route.mainRouteIdea}</strong></div><div class="detail-block"><span>Road choice</span><strong>${route.roadChoice}</strong></div><div class="detail-block"><span>Critical decision</span><strong>${route.criticalDecision}</strong></div><div class="detail-block"><span>Common mistake</span><strong>${route.commonMistake}</strong></div><div class="detail-block"><span>Beginner rule</span><strong>${route.beginnerRule}</strong></div><div class="info-pill">Showing preset route reasoning</div>`;
      }

      function renderMistakeInfo(mistake) {
        const relatedRoads = mistake.relatedRoadIds.map((id) => roads.find((road) => road.id === id)).filter(Boolean);
        const relatedConnectors = mistake.relatedConnectorIds.map((id) => connectorRoads.find((road) => road.id === id)).filter(Boolean);
        const relatedAreas = mistake.relatedAreaIds.map((id) => areas.find((area) => area.id === id)).filter(Boolean);
        const routeExamples = mistake.routeExampleIds.map((id) => routeLogics.find((route) => route.id === id)).filter(Boolean);
        const chips = [
          ...relatedRoads.map((road) => `<button data-mistake-chip="${road.id}" data-road-type="highway">${road.code}</button>`),
          ...relatedConnectors.map((road) => `<button data-mistake-chip="${road.id}" data-road-type="connector">${road.code}</button>`),
          ...relatedAreas.map((area) => `<button data-mistake-chip="${area.id}" data-road-type="area">${area.name}</button>`)
        ].join("");

        return `<div class="route-logic-selector" aria-label="Common mistake selector">${roadMistakes.map((item) => `<button class="route-logic-button ${mistake.id === item.id ? "selected" : ""}" data-road-mistake="${item.id}"><span>${item.shortLabel}</span></button>`).join("")}</div><p class="eyebrow">Common Road Mistake</p><h2>${mistake.title}</h2><div class="route-road-pills" aria-label="Related roads and areas">${chips}</div><div class="detail-block"><span>What happens</span><strong>${mistake.whatHappens}</strong></div><div class="detail-block"><span>Why it happens</span><strong>${mistake.whyItHappens}</strong></div><div class="detail-block"><span>Usually happens around</span><strong>${mistake.usuallyHappensAround.join(", ")}</strong></div><div class="detail-block"><span>How to avoid it</span><strong>${mistake.howToAvoid}</strong></div><div class="detail-block"><span>Beginner rule</span><strong>${mistake.beginnerRule}</strong></div>${renderRouteExamples("mistake", mistake.id, routeExamples)}<div class="info-pill">Showing mistake pattern</div>`;
      }

      function renderInfoPanel() {
        if (selectedTab === routeModeTitle && selectedRouteLogic) {
          return renderRouteLogicInfo(selectedRouteLogic);
        }

        if (selectedTab === mistakeModeTitle && selectedMistake) {
          return renderMistakeInfo(selectedMistake);
        }

        if (selectedRoad) {
          return `<p class="eyebrow">Road Detail</p><h2>${selectedRoad.code} / ${selectedRoad.name}</h2><div class="detail-block"><span>What this road does</span><strong>${selectedRoad.whatItDoes}</strong></div><div class="detail-block"><span>When to use it</span><strong>${selectedRoad.whenToUse}</strong></div><div class="detail-block"><span>Areas it helps with</span><strong>${selectedRoad.areasItHelpsWith.join(", ")}</strong></div><div class="detail-block"><span>Connects to</span><strong>${selectedRoad.connectsTo.join(", ")}</strong></div><div class="detail-block"><span>Common confusion</span><strong>${selectedRoad.commonConfusion}</strong></div><div class="detail-block"><span>Beginner rule</span><strong>${selectedRoad.beginnerRule}</strong></div>${renderRouteExamples("road", selectedRoad.id)}<div class="info-pill">Showing road detail</div>`;
        }

        if (selectedConnectorRoad) {
          return `<p class="eyebrow">Connector Road Detail</p><h2>${selectedConnectorRoad.code} / ${selectedConnectorRoad.name}</h2><div class="detail-block"><span>What this road does</span><strong>${selectedConnectorRoad.whatItDoes}</strong></div><div class="detail-block"><span>When to use it</span><strong>${selectedConnectorRoad.whenToUse}</strong></div><div class="detail-block"><span>Areas it helps with</span><strong>${selectedConnectorRoad.areasItHelpsWith.join(", ")}</strong></div><div class="detail-block"><span>Connects to</span><strong>${selectedConnectorRoad.connectsTo.join(", ")}</strong></div><div class="detail-block"><span>Common confusion</span><strong>${selectedConnectorRoad.commonConfusion}</strong></div><div class="detail-block"><span>Beginner rule</span><strong>${selectedConnectorRoad.beginnerRule}</strong></div>${renderConnectorRelatedRoads(selectedConnectorRoad)}${renderRouteExamples(selectedConnectorRoad.category === "secondaryConnector" ? "secondaryConnector" : "connector", selectedConnectorRoad.id)}<div class="info-pill">Showing connector road detail</div>`;
        }

        if (selectedArea) {
          return `<p class="eyebrow">Area Detail</p><h2>${selectedArea.name}</h2><div class="region-pill">Region: ${selectedArea.region}</div><div class="detail-block"><span>Region / orientation</span><strong>${selectedArea.region}</strong></div><div class="detail-block"><span>How to think about this area</span><strong>${selectedArea.howToThink}</strong></div><div class="detail-block"><span>Main road access</span><strong>${selectedArea.mainRoadAccess.join(", ")}</strong></div><div class="detail-block"><span>Useful connectors</span><strong>${selectedArea.connectors.join(", ")}</strong></div><div class="detail-block"><span>Nearby areas</span><strong>${selectedArea.nearbyAreas.join(", ")}</strong></div><div class="detail-block"><span>What usually confuses drivers</span><strong>${selectedArea.driverConfusion}</strong></div><div class="detail-block"><span>Beginner rule</span><strong>${selectedArea.beginnerRule}</strong></div>${renderRelatedRoads(selectedArea)}${renderRouteExamples("area", selectedArea.id)}<div class="info-pill">Showing area detail</div>`;
        }

        return `<p class="eyebrow">Selection details</p><h2>Select a road or area</h2><p>Click a highway, connector road, or area zone to see how it connects to Dubai.</p>`;
      }

      function renderLanding() {
        root.innerHTML = `
          <main class="app-shell">
            <section class="hero-section">
              <div class="hero-copy">
                <p class="eyebrow">UAE road explainer app</p>
                <h1>Understand UAE roads before you enter the map.</h1>
                <p class="hero-text">A simple learning layer for UAE roads, areas, route logic, and the common decisions drivers need to make with confidence.</p>
                <div class="hero-actions"><button class="primary-button" data-open-map>Open Map</button><a class="secondary-link" href="#mvp">View MVP coverage</a></div>
              </div>
              <div class="hero-panel" aria-label="Current app preview">
                <div class="mini-map"><span class="road-line road-line-main"></span><span class="road-line road-line-cross"></span><span class="road-line road-line-arc"></span><span class="map-pin map-pin-one"></span><span class="map-pin map-pin-two"></span><span class="map-pin map-pin-three"></span></div>
                <div class="panel-stat-grid"><div><strong>5</strong><span>highways</span></div><div><strong>10</strong><span>areas</span></div><div><strong>4</strong><span>modes</span></div></div>
              </div>
            </section>
            <section class="workspace-grid" aria-label="Road explainer controls">
              <div class="control-panel"><div class="section-heading"><p class="eyebrow">Choose emirate</p><h2>Start with Dubai</h2></div><div class="emirate-grid">${emirates.map((name, index) => `<button class="emirate-button ${index === 0 ? "selected" : ""}" ${index ? "disabled" : ""}><span>${name}</span><small>${index ? "Coming soon" : "Available"}</small></button>`).join("")}</div></div>
              <div class="control-panel"><div class="section-heading"><p class="eyebrow">Learning mode</p><h2>Pick what you want to understand</h2></div><div class="mode-list">${modeTabs.map((title) => `<button class="mode-button ${title === selectedTab ? "selected" : ""}" data-tab="${title}"><span>${title}</span><small>${modeCopy[title]}</small></button>`).join("")}</div></div>
              <aside class="summary-card"><p class="eyebrow">Current selection</p><h2>Dubai</h2><div class="summary-row"><span>Mode</span><strong>${selectedTab}</strong></div><div class="summary-row"><span>Coverage</span><strong>Dubai MVP</strong></div><p>${modeCopy[selectedTab]}</p><button class="primary-button full-width" data-open-map>Open Map</button></aside>
            </section>
            <section class="mvp-section" id="mvp"><div class="section-heading"><p class="eyebrow">MVP coverage</p><h2>Dubai highways and areas included first</h2></div><div class="mvp-grid"><div class="mvp-list"><h3>Dubai highways</h3><ul>${highways.map((item) => `<li>${item}</li>`).join("")}</ul></div><div class="mvp-list"><h3>Dubai areas</h3><ul class="area-list">${areaNames.map((item) => `<li>${item}</li>`).join("")}</ul></div></div></section>
          </main>
        `;
        root.querySelectorAll("[data-open-map]").forEach((button) => button.addEventListener("click", () => {
          screen = "map";
          if (selectedTab === routeModeTitle || selectedTab === mistakeModeTitle) applyViewPreset("area-connection");
          else applyViewPreset("beginner");
          if (selectedTab === routeModeTitle && !selectedRouteLogic) selectedRouteLogic = routeLogics[0];
          if (selectedTab === mistakeModeTitle && !selectedMistake) selectedMistake = roadMistakes[0];
          renderMap();
        }));
        root.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => { selectedTab = button.dataset.tab; renderLanding(); }));
      }

      function renderMap() {
        const activeRouteLogic = selectedTab === routeModeTitle ? selectedRouteLogic : null;
        const activeMistake = selectedTab === mistakeModeTitle ? selectedMistake : null;
        const selectedViewPreset = viewPresets.find((preset) => preset.id === selectedViewPresetId) || viewPresets[0];
        root.innerHTML = `
          <main class="map-screen">
            <header class="map-header"><button class="back-button" data-back>Back</button><div><p class="eyebrow">Dubai MVP map</p><h1>Dubai Road Explorer</h1></div></header>
            <nav class="map-tabs" aria-label="Map modes">${modeTabs.map((title) => `<button class="map-tab ${title === selectedTab ? "selected" : ""}" data-tab="${title}">${title}</button>`).join("")}</nav>
            <section class="map-layout">
              <div class="dubai-map-card">
                <div class="map-card-header"><div><p class="eyebrow">Simplified Dubai map</p><h2>${selectedTab}</h2></div><span>${modeCopy[selectedTab]}</span></div>
                <div class="view-preset-panel" aria-label="Map view presets"><div class="view-preset-buttons">${viewPresets.map((preset) => `<button class="view-preset-button ${selectedViewPresetId === preset.id ? "selected" : ""}" data-view-preset="${preset.id}"><span>${preset.name}</span><small>${preset.description}</small></button>`).join("")}</div><div class="view-explanation-card"><strong>${selectedViewPreset.name}</strong><span>Visible: ${visibleLayerText()}</span><span>Use this when: ${selectedViewPreset.useWhen}</span></div></div>
                <div class="map-helper-row"><p>Click a highway, connector road, or area zone. Details appear below.</p><div class="map-tool-row"><div class="zoom-controls" aria-label="Map zoom controls"><button data-zoom="out">-</button><span>${Math.round(mapZoom * 100)}%</span><button data-zoom="in">+</button><button data-zoom="reset">Reset</button></div><div class="more-menu"><button class="more-button" data-more-toggle>More</button>${showMoreOptions ? `<div class="more-panel" role="dialog" aria-label="Map layer options"><label><input type="checkbox" data-map-filter="showHighways" ${mapFilters.showHighways ? "checked" : ""}><span>Major highways</span></label><label><input type="checkbox" data-map-filter="showPrimaryConnectors" ${mapFilters.showPrimaryConnectors ? "checked" : ""}><span>Primary connectors</span></label><label><input type="checkbox" data-map-filter="showSecondaryConnectors" ${mapFilters.showSecondaryConnectors ? "checked" : ""}><span>Secondary connectors</span></label><label><input type="checkbox" data-map-filter="showCoreAreas" ${mapFilters.showCoreAreas ? "checked" : ""}><span>Core areas</span></label><label><input type="checkbox" data-map-filter="showSecondaryAreas" ${mapFilters.showSecondaryAreas ? "checked" : ""}><span>Secondary areas</span></label></div>` : ""}</div></div></div>
                <div class="map-legend" aria-label="Map legend"><span><b class="legend-road"></b> Major highways</span><span><b class="legend-connector"></b> Primary connectors</span>${mapFilters.showSecondaryConnectors || selectedViewPresetId === "expanded-dubai" ? `<span><b class="legend-secondary-connector"></b> Secondary connectors</span>` : ""}<span><b class="legend-zone"></b> Core areas</span>${mapFilters.showSecondaryAreas || selectedViewPresetId === "expanded-dubai" ? `<span><b class="legend-secondary-zone"></b> Secondary areas</span>` : ""}<span><b class="legend-selected"></b> Selected</span><span><b class="legend-direction"></b> Orientation guide</span></div>
                <div class="dubai-map-canvas" aria-label="Clickable Dubai roads and areas">
                  <div class="sea-guide" aria-hidden="true"><span>Arabian Gulf / coast side</span></div>
                  <div class="orientation-layer" aria-hidden="true">
                    <span class="region-label coast-label">Arabian Gulf / coast side</span>
                    <span class="region-label inland-label">Inland Dubai</span>
                    <span class="region-label old-dubai-label">Old Dubai / Creek side</span>
                    <span class="region-label new-dubai-label">New Dubai corridor</span>
                    <span class="region-label airport-label">Airport / Mirdif side</span>
                  </div>
                  <div class="direction-anchor-layer" aria-hidden="true">
                    <span class="direction-anchor anchor-abu-dhabi">Abu Dhabi direction</span>
                    <span class="direction-anchor anchor-sharjah">Sharjah / Northern Emirates direction</span>
                    <span class="direction-anchor anchor-al-ain">Al Ain / inland direction</span>
                    <span class="direction-anchor anchor-coast">Coast side</span>
                    <span class="direction-anchor anchor-inland">Inland side</span>
                  </div>
                  <div class="map-content-layer" style="transform: translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom}); transform-origin: center;">
                    <svg class="dubai-map-svg" viewBox="0 0 100 100" role="img" aria-label="Simplified road map of Dubai">
	                      <path class="coast-shape" d="M4 29 C13 34, 23 31, 34 31 C45 31, 55 30, 66 29 C77 28, 86 30, 97 28"></path>
	                      <path class="creek-shape" d="M78 28 C82 32, 82 37, 79 42 C77 47, 80 52, 85 54"></path>
	                      ${roads.filter(shouldShowGhostHighway).map((item) => `<line class="map-road ghost-road ${item.lineClass}" x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}"></line>`).join("")}
	                      ${connectorRoads.filter(shouldShowConnector).map((item) => {
                          const routeInvolved = Boolean(activeRouteLogic?.involvedConnectorIds.includes(item.id) || activeRouteLogic?.relatedConnectorIds.includes(item.id) || activeRouteLogic?.relatedSecondaryConnectorIds.includes(item.id));
                          const mistakeInvolved = Boolean(activeMistake?.relatedConnectorIds.includes(item.id));
                          const selected = item.id === selectedConnectorRoad?.id || routeInvolved || mistakeInvolved;
                          const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                          const secondaryClass = item.category === "secondaryConnector" ? "secondary-connector-line" : "";
                          return `<line class="connector-line ${secondaryClass} ${item.lineClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-connector" : ""} ${routeDimmed ? "route-dimmed" : ""}" x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}" role="button" aria-label="View ${item.code} ${item.name}" data-connector-road-line="${item.id}"></line>`;
                        }).join("")}
	                      ${roads.filter(shouldShowHighway).map((item) => {
                          const routeInvolved = Boolean(activeRouteLogic?.involvedRoadIds.includes(item.id) || activeRouteLogic?.relatedRoadIds.includes(item.id));
                          const mistakeInvolved = Boolean(activeMistake?.relatedRoadIds.includes(item.id));
                          const selected = item.id === selectedRoad?.id || routeInvolved || mistakeInvolved;
                          const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                          return `<line class="map-road ${item.lineClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-road" : ""} ${routeDimmed ? "route-dimmed" : ""}" x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}" role="button" aria-label="View ${item.code} ${item.name}" data-road-line="${item.id}"></line>`;
                        }).join("")}
	                    </svg>
	                    ${areas.filter(shouldShowArea).map((item) => {
                        const routeStart = item.id === activeRouteLogic?.fromAreaId;
                        const routeDestination = item.id === activeRouteLogic?.toAreaId;
                        const routeRelated = Boolean(activeRouteLogic?.relatedAreaIds.includes(item.id));
                        const mistakeInvolved = Boolean(activeMistake?.relatedAreaIds.includes(item.id));
                        const selected = item.id === selectedArea?.id || routeStart || routeDestination || routeRelated || mistakeInvolved;
                        const routeDimmed = Boolean(activeRouteLogic && !routeRelated && !routeStart && !routeDestination);
                        return `<button class="area-zone ${item.priority === "secondary" ? "secondary-area-zone" : ""} ${selected ? "selected" : ""} ${routeStart ? "route-start-area" : ""} ${routeDestination ? "route-destination-area" : ""} ${routeRelated ? "route-related-area" : ""} ${mistakeInvolved ? "mistake-related-area" : ""} ${(activeMistake && !mistakeInvolved) || routeDimmed ? "route-dimmed" : ""}" style="left: ${item.x}%; top: ${item.y}%; width: ${item.width}%; height: ${item.height}%;" data-area="${item.id}"><span class="area-boundary"></span><span class="area-dot"></span><strong>${item.name}</strong></button>`;
                      }).join("")}
	                    ${roads.filter(shouldShowHighway).map((item) => {
                        const routeInvolved = Boolean(activeRouteLogic?.involvedRoadIds.includes(item.id) || activeRouteLogic?.relatedRoadIds.includes(item.id));
                        const mistakeInvolved = Boolean(activeMistake?.relatedRoadIds.includes(item.id));
                        const selected = item.id === selectedRoad?.id || routeInvolved || mistakeInvolved;
                        const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                        return `<button class="road-label-button ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-road" : ""} ${routeDimmed ? "route-dimmed" : ""}" style="left: ${item.labelX}%; top: ${item.labelY}%;" data-road="${item.id}" aria-label="View ${item.code} ${item.name}"><span>${item.code}</span></button>`;
                      }).join("")}
	                    ${connectorRoads.filter(shouldShowConnector).map((item) => {
                        const routeInvolved = Boolean(activeRouteLogic?.involvedConnectorIds.includes(item.id) || activeRouteLogic?.relatedConnectorIds.includes(item.id) || activeRouteLogic?.relatedSecondaryConnectorIds.includes(item.id));
                        const mistakeInvolved = Boolean(activeMistake?.relatedConnectorIds.includes(item.id));
                        const selected = item.id === selectedConnectorRoad?.id || routeInvolved || mistakeInvolved;
                        const routeDimmed = Boolean((activeRouteLogic || activeMistake) && !routeInvolved && !mistakeInvolved);
                        const secondaryClass = item.category === "secondaryConnector" ? "secondary-connector-label" : "";
                        return `<button class="connector-label ${secondaryClass} ${selected ? "selected" : ""} ${routeInvolved ? "route-involved-connector" : ""} ${routeDimmed ? "route-dimmed" : ""}" style="left: ${item.labelX}%; top: ${item.labelY}%;" data-connector-road="${item.id}" aria-label="View ${item.code} ${item.name}"><span>${item.code}</span><strong>${item.shortName}</strong></button>`;
                      }).join("")}
	                  </div>
	                  <div class="compass-indicator" aria-label="Compass"><span class="compass-n">N</span><span class="compass-e">E</span><span class="compass-s">S</span><span class="compass-w">W</span><span class="compass-needle"></span></div>
	                  ${selectedRoad || selectedConnectorRoad || selectedArea || activeRouteLogic || activeMistake ? `<button class="details-loaded-hint" data-details-below>Details below ↓</button>` : ""}
                </div>
              </div>
              <aside class="info-panel" data-selection-mode="${selectedMapMode}">
                ${renderInfoPanel()}
              </aside>
            </section>
          </main>
        `;
        root.querySelector("[data-back]").addEventListener("click", () => { screen = "landing"; renderLanding(); });
        root.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => changeMapMode(button.dataset.tab)));
        root.querySelectorAll("[data-view-preset]").forEach((button) => button.addEventListener("click", () => {
          applyViewPreset(button.dataset.viewPreset, true);
          renderMap();
        }));
        root.querySelectorAll("[data-route-logic]").forEach((button) => button.addEventListener("click", () => {
          const route = routeLogics.find((item) => item.id === button.dataset.routeLogic);
          selectRouteLogic(route);
        }));
        root.querySelectorAll("[data-road-mistake]").forEach((button) => button.addEventListener("click", () => {
          const mistake = roadMistakes.find((item) => item.id === button.dataset.roadMistake);
          selectMistake(mistake);
        }));
        root.querySelectorAll("[data-mistake-chip]").forEach((button) => button.addEventListener("click", () => {
          selectedMapMode = button.dataset.roadType === "area" ? "areas" : "roads";
          selectedRouteLogic = null;
          selectedMistake = null;
          if (button.dataset.roadType === "area") {
            selectedArea = areas.find((item) => item.id === button.dataset.mistakeChip);
            selectedRoad = null;
            selectedConnectorRoad = null;
        } else if (button.dataset.roadType === "connector" || button.dataset.roadType === "secondaryConnector") {
            selectedConnectorRoad = connectorRoads.find((item) => item.id === button.dataset.mistakeChip);
            selectedRoad = null;
            selectedArea = null;
          } else {
            selectedRoad = roads.find((item) => item.id === button.dataset.mistakeChip);
            selectedConnectorRoad = null;
            selectedArea = null;
          }
          renderMap();
          scrollToInfoPanelIfNeeded();
        }));
        root.querySelectorAll("[data-route-chip]").forEach((button) => button.addEventListener("click", () => {
          const source = button.dataset.roadType === "connector" || button.dataset.roadType === "secondaryConnector" ? connectorRoads : roads;
          const road = source.find((item) => item.id === button.dataset.routeChip);
          if (!road) return;
          selectedMapMode = "roads";
          selectedMistake = null;
          selectedArea = null;
          selectedRouteLogic = null;
          if (button.dataset.roadType === "connector" || button.dataset.roadType === "secondaryConnector") {
            selectedConnectorRoad = road;
            selectedRoad = null;
          } else {
            selectedRoad = road;
            selectedConnectorRoad = null;
          }
          renderMap();
          scrollToInfoPanelIfNeeded();
        }));
        root.querySelectorAll("[data-road]").forEach((button) => button.addEventListener("click", () => {
          const road = roads.find((item) => item.id === button.dataset.road);
          selectRoad(road);
        }));
        root.querySelectorAll("[data-road-line]").forEach((line) => line.addEventListener("click", () => {
          const road = roads.find((item) => item.id === line.dataset.roadLine);
          selectRoad(road);
        }));
        root.querySelectorAll("[data-connector-road]").forEach((button) => button.addEventListener("click", () => {
          const road = connectorRoads.find((item) => item.id === button.dataset.connectorRoad);
          selectConnectorRoad(road);
        }));
        root.querySelectorAll("[data-connector-road-line]").forEach((line) => line.addEventListener("click", () => {
          const road = connectorRoads.find((item) => item.id === line.dataset.connectorRoadLine);
          selectConnectorRoad(road);
        }));
        root.querySelectorAll("[data-area]").forEach((button) => button.addEventListener("click", () => {
          const area = areas.find((item) => item.id === button.dataset.area);
          selectArea(area);
        }));
        root.querySelectorAll("[data-route-example]").forEach((button) => button.addEventListener("click", () => {
          const route = routeLogics.find((item) => item.id === button.dataset.routeExample);
          if (route) openRouteExample(route);
        }));
        root.querySelectorAll("[data-related-road]").forEach((button) => button.addEventListener("click", () => {
          const source = button.dataset.roadType === "connector" || button.dataset.roadType === "secondaryConnector" ? connectorRoads : roads;
          const road = source.find((item) => item.id === button.dataset.relatedRoad);
          if (!road) return;
          selectedMapMode = "roads";
          if (button.dataset.roadType === "connector" || button.dataset.roadType === "secondaryConnector") {
            selectedConnectorRoad = road;
            selectedRoad = null;
          } else {
            selectedRoad = road;
            selectedConnectorRoad = null;
          }
          selectedArea = null;
          selectedRouteLogic = null;
          selectedMistake = null;
          renderMap();
          scrollToInfoPanelIfNeeded();
        }));
        const detailsButton = root.querySelector("[data-details-below]");
        if (detailsButton) {
          detailsButton.addEventListener("click", () => {
            document.querySelector(".info-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
        const moreButton = root.querySelector("[data-more-toggle]");
        if (moreButton) {
          moreButton.addEventListener("click", () => {
            showMoreOptions = !showMoreOptions;
            renderMap();
          });
        }
        root.querySelectorAll("[data-map-filter]").forEach((input) => {
          input.addEventListener("change", () => {
            mapFilters[input.dataset.mapFilter] = input.checked;
            renderMap();
          });
        });
        const mapCanvas = root.querySelector(".dubai-map-canvas");
        const mapContentLayer = root.querySelector(".map-content-layer");
        const updateMapPan = () => {
          if (!mapContentLayer) return;
          mapContentLayer.style.transform = `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`;
        };
        if (mapCanvas) {
          mapCanvas.addEventListener("pointerdown", (event) => {
            if (event.target.closest("button, input, label")) return;
            dragState = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              originX: mapPan.x,
              originY: mapPan.y
            };
            mapCanvas.classList.add("dragging");
            mapCanvas.setPointerCapture?.(event.pointerId);
          });
          mapCanvas.addEventListener("pointermove", (event) => {
            if (!dragState) return;
            mapPan = {
              x: dragState.originX + event.clientX - dragState.startX,
              y: dragState.originY + event.clientY - dragState.startY
            };
            updateMapPan();
          });
          const endDrag = (event) => {
            if (dragState?.pointerId === event.pointerId) {
              mapCanvas.releasePointerCapture?.(event.pointerId);
            }
            dragState = null;
            mapCanvas.classList.remove("dragging");
          };
          mapCanvas.addEventListener("pointerup", endDrag);
          mapCanvas.addEventListener("pointercancel", endDrag);
        }
        root.querySelector("[data-zoom='in']").addEventListener("click", () => { mapZoom = Math.min(1.6, Number((mapZoom + 0.1).toFixed(1))); renderMap(); });
        root.querySelector("[data-zoom='out']").addEventListener("click", () => { mapZoom = Math.max(0.8, Number((mapZoom - 0.1).toFixed(1))); renderMap(); });
        root.querySelector("[data-zoom='reset']").addEventListener("click", () => { mapZoom = 1; mapPan = { x: 0, y: 0 }; renderMap(); });
      }

      renderLanding();
