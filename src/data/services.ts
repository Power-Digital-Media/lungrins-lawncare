import pinsData from "@/data/pins.json";

export interface PinRecord {
  id: string;
  title?: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  detailedExplanation: string;
  images: string[];
  latitude?: number;
  longitude?: number;
  aeoAnswers?: { question: string; answer: string }[];
  clientId?: string;
}

export interface YearRoundServiceHub {
  slug: string;
  shortTitle: string;
  title: string;
  seasonGroup: "fall-winter" | "spring-summer";
  seasonBadge: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroHighlight: string;
  heroIntro: string;
  whySeasonMattersTitle: string;
  whySeasonMattersBody: string;
  checklistTitle: string;
  checklistItems: string[];
  idealForTitle: string;
  idealForItems: string[];
  matchKeywords: string[];
  heroImage: string;
  faqs: { q: string; a: string }[];
}

function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const STATIC_PINS = pinsData as PinRecord[];

const PIN_SLUG_MAP: Map<string, string> = (() => {
  const map = new Map<string, string>();
  const used = new Set<string>();
  for (const pin of STATIC_PINS) {
    const baseTitle = pin.title || `${pin.service} ${pin.location}`;
    const cityPart = pin.location.split(",")[0].trim().toLowerCase();
    const rawSlug = slugifyText(
      baseTitle.toLowerCase().includes(cityPart)
        ? `${baseTitle} ms`
        : `${baseTitle} ${pin.location}`
    );
    let candidate = rawSlug;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = `${rawSlug}-${suffix++}`;
    }
    used.add(candidate);
    map.set(pin.id, candidate);
  }
  return map;
})();

export function getStaticPins(): PinRecord[] {
  return STATIC_PINS;
}

export function getPinSlug(pinOrId: PinRecord | string): string | null {
  const id = typeof pinOrId === "string" ? pinOrId : pinOrId.id;
  return PIN_SLUG_MAP.get(id) || null;
}

export function getPinHref(pinOrId: PinRecord | string, clientId?: string): string {
  const slug = getPinSlug(pinOrId);
  if (slug && !clientId) {
    return `/pins/${slug}/`;
  }
  const id = typeof pinOrId === "string" ? pinOrId : pinOrId.id;
  return `/pin-page/?id=${encodeURIComponent(id)}${clientId ? `&clientId=${encodeURIComponent(clientId)}` : ""}`;
}

export function getStaticPinBySlug(slug: string): PinRecord | undefined {
  for (const pin of STATIC_PINS) {
    if (PIN_SLUG_MAP.get(pin.id) === slug) {
      return pin;
    }
  }
  return undefined;
}

export const YEAR_ROUND_SERVICES: YearRoundServiceHub[] = [
  {
    slug: "pine-straw-mulch-installation",
    shortTitle: "Rolled Pine Straw & Mulch",
    title: "Rolled Longleaf Pine Straw & Hardwood Mulch Installation",
    seasonGroup: "fall-winter",
    seasonBadge: "Peak Fall, Winter & Early Spring Service",
    seoTitle:
      "Pine Straw & Mulch Installation in Madison, Flora & Ridgeland, MS | Lungrin's",
    seoDescription:
      "Hand-tucked rolled longleaf pine straw & mulch installation in Flora, Madison, Annandale, Gluckstadt & Ridgeland, MS. Root weeding included. Call (601) 906-1281.",
    heroHeadline: "Hand-Rolled Longleaf Pine Straw & Mulch Beds Across",
    heroHighlight: "Flora, Madison, Gluckstadt & Ridgeland, MS",
    heroIntro:
      "Pine straw is our #1 requested fall, winter, and pre-spring transformation. Instead of tossing loose bales over weeds, owner Luke Lungrin pulls encroaching grass and weeds first, spades a crisp trench border, spreads a thick 3–4 inch blanket of clean longleaf needles or hardwood mulch, and tightly hand-rolls every concrete and turf edge.",
    whySeasonMattersTitle: "Why Fall & Winter Pine Straw Protects Mississippi Landscapes",
    whySeasonMattersBody:
      "Refreshing pine straw or mulch between October and March insulates shallow azalea, camellia, boxwood, and crape myrtle roots before hard Central Mississippi freezes, locks out winter broadleaf weeds (henbit, chickweed, and annual bluegrass), and gives your front elevation crisp holiday and year-round curb appeal while warm-season turf is dormant.",
    checklistTitle: "Included With Every Pine Straw & Mulch Job",
    checklistItems: [
      "Pre-install flowerbed weed pulling & encroaching grass-runner removal",
      "Clean V-spaded or vertical steel-blade bed border definition",
      "Clean, vibrant longleaf pine straw or dark/black hardwood mulch delivery",
      "Tightly hand-tucked, rolled outer edges that hold firm in heavy MS storms",
      "Full blower cleanup of driveways, brick walkways, porches, and street curbs",
    ],
    idealForTitle: "Popular Projects We Handle",
    idealForItems: [
      "Pre-Thanksgiving & Christmas whole-home curb appeal refreshes",
      "Annandale, Reunion, Gluckstadt & Ridgeland HOA bed standards",
      "Wraparound foundation beds, crape myrtle tree rings & stone gated entrances",
      "February–March pre-spring bed resets before spring growth flushes",
    ],
    matchKeywords: ["pine straw", "mulch", "rolled"],
    heroImage: "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp",
    faqs: [
      {
        q: "When is the best time of year to install pine straw in Central Mississippi?",
        a: "Late fall through winter (October–February) and early spring (March–April) are the two peak windows. A fall/winter application insulates shrub roots against freezes and keeps dormant yards sharp through the holidays, while a spring refresh locks out summer weeds.",
      },
      {
        q: "Why does hand-rolling pine straw edges make such a difference?",
        a: "Loose straw washes onto driveways and lawns during the first heavy Mississippi rainstorm. Tucking and rolling the outer perimeter compresses the needles into a dense, neat border that stays locked against concrete walks and turf edges.",
      },
      {
        q: "Do you pull weeds before putting out fresh pine straw or mulch?",
        a: "Yes. Laying straw on top of tall weeds only hides them for a week. We pull visible weeds and clear grass runners out of the beds first so your new pine straw or mulch stays clean for months.",
      },
      {
        q: "Should I choose longleaf pine straw or hardwood mulch?",
        a: "We install both. Longleaf pine straw knits together on sloped Mississippi beds without floating away in heavy rain and naturally benefits acid-loving plants like azaleas, camellias, and hydrangeas. Dark brown or black hardwood mulch is great for flat architectural beds.",
      },
    ],
  },
  {
    slug: "leaf-removal-winter-yard-cleanup",
    shortTitle: "Fall & Winter Leaf Cleanups",
    title: "Fall & Winter Leaf Removal & Seasonal Yard Cleanups",
    seasonGroup: "fall-winter",
    seasonBadge: "Peak Nov – Feb Winter Cashflow Service",
    seoTitle:
      "Fall & Winter Leaf Removal in Madison, Ridgeland & Flora, MS | Lungrin's",
    seoDescription:
      "Full-yard fall & winter leaf removal, pine needle cleanups, and pre-spring yard resets in Madison, Ridgeland, Gluckstadt, Flora & North Jackson, MS. (601) 906-1281.",
    heroHeadline: "Complete Fall & Winter Leaf Removal & Yard Cleanups in",
    heroHighlight: "Madison, Ridgeland, Gluckstadt & Flora, MS",
    heroIntro:
      "In Central Mississippi, water oaks, pin oaks, sweetgums, and loblolly pines drop heavy layers of leaves and needles from late October all the way through February. Luke clears saturated leaf blankets from turf, flowerbeds, ditches, and driveways—hauling everything off-site or neatly to municipal pickup.",
    whySeasonMattersTitle: "Why Leaving Wet Winter Leaves Hurts Dormant Bermuda & Zoysia",
    whySeasonMattersBody:
      "When thick wet oak leaves sit on dormant Bermuda, Zoysia, or St. Augustine grass through December, January, and February, they block sunlight, trap cold moisture against the crown, and trigger large patch fungus and bare dead spots in April. One thorough winter leaf cleanup protects your turf investment for spring green-up.",
    checklistTitle: "What Our Seasonal Leaf & Winter Cleanup Covers",
    checklistItems: [
      "High-powered backpack blowing out of foundation beds, corners, patios & AC pads",
      "Commercial mulching/collection passes across front, side, and back lawns",
      "Winter fallen branch, sweetgum ball, and matted pine-needle cleanup",
      "Complete trailer haul-away (or neat curbside staging where city pickup applies)",
      "Spotless final blow-off of driveways, sidewalks, decks, and pool surrounds",
    ],
    idealForTitle: "Best Times to Book",
    idealForItems: [
      "November–December oak & hardwood leaf drop cleanouts",
      "January–February winter yard resets & pre-emergent turf prep",
      "Heavily wooded lots in Flora, Madison, Ridgeland & North Jackson",
      "Pairing leaf removal with fresh rolled pine straw in one visit",
    ],
    matchKeywords: ["leaf", "winter", "autumn"],
    heroImage: "/images/jobs/fb-2026/oct25-flora-leaf-cleanup/2.webp",
    faqs: [
      {
        q: "Do you offer leaf cleanups in December, January, and February?",
        a: "Yes—winter is our busiest season for leaf and pine-needle cleanups. Many Mississippi oak trees hold their leaves into December and January, so we run dedicated winter cleanup routes all winter long.",
      },
      {
        q: "Do you haul the leaves away so I don't have 30 bags sitting at the curb?",
        a: "Absolutely. We can load and haul all leaves, twigs, and pine needles completely off your property on our enclosed/sided trailer, or stage them neatly if your neighborhood has scheduled claw pickup.",
      },
      {
        q: "Can you clear leaves out of my flowerbeds and replace pine straw on the same day?",
        a: "Yes, that is our most popular winter combo—blowing old matted oak leaves out of shrub beds, pulling winter weeds, and tucking fresh longleaf pine straw in a single trip.",
      },
    ],
  },
  {
    slug: "pond-bank-fence-line-bush-hogging",
    shortTitle: "Pond, Fence & Brush Clearing",
    title: "Pond Bank, Fence-Line Clearing & Bush Hogging",
    seasonGroup: "fall-winter",
    seasonBadge: "Peak Winter Dormant Clearing + Year-Round",
    seoTitle:
      "Pond Bank, Fence Line Clearing & Bush Hogging in Flora & Madison, MS | Lungrin's",
    seoDescription:
      "Overgrown pond bank clearing, vine-choked fence line reclamation & bush hogging in Flora, Pocahontas, Bentonia, Madison & Jackson, MS. Call (601) 906-1281.",
    heroHeadline: "Pond Perimeter, Fence-Line Brush Clearing & Bush Hogging Across",
    heroHighlight: "Flora, Pocahontas, Bentonia, Madison & Jackson",
    heroIntro:
      "Where standard mowing crews turn around, Luke steps in. We reclaim overgrown pond dams, lake shorelines, vine-covered privacy fences, and waist-high rural lots—cutting through briars, willow saplings, privet, and woody brush and hauling the mess away.",
    whySeasonMattersTitle: "Why Winter (Nov – Mar) Is Prime Brush & Fence-Line Clearing Season",
    whySeasonMattersBody:
      "Late fall and winter are the smartest months in Mississippi to reclaim overgrown fence rows, pond levees, and acreage borders: sap is down, poison ivy leaves have dropped, sightlines to hidden stumps and wire fences are clear, and venomous snakes, wasps, and yellowjackets are dormant—allowing faster, cleaner cuts down to ground level.",
    checklistTitle: "Heavy Clearing Capabilities",
    checklistItems: [
      "360-degree stock pond dam, pier, and lake shoreline brush & sapling clearing",
      "Wood privacy fence & farm-fence vine, briar, and overhanging limb removal",
      "Bush hogging followed by commercial finish-cut mowing for a clean look",
      "Driveway corridor & outbuilding perimeter brush push-backs",
      "Full limb and brush pile loading & off-site trailer disposal",
    ],
    idealForTitle: "Properties We Reclaim",
    idealForItems: [
      "Overgrown stock ponds & piers in Pocahontas, Flora, Bentonia & Yazoo County",
      "Vine-heavy backyard privacy fences in Jackson, Madison, Gluckstadt & Ridgeland",
      "Roadside acreage, pasture edges, hunting camp lanes & vacant lots",
      "Pre-listing real estate acreage cleanups",
    ],
    matchKeywords: ["pond", "fence", "bush hog", "lakefront", "outbuilding"],
    heroImage: "/images/jobs/fb-2026/aug05-pocahontas-pond/3.webp",
    faqs: [
      {
        q: "Is winter a good time to clear overgrown fence lines and pond banks in Mississippi?",
        a: "Winter is actually the best time of year. With summer foliage dropped and wasps/snakes dormant, we can see fence pickets, wire lines, and steep pond-bank grades clearly and cut woody vines and saplings right to the base.",
      },
      {
        q: "Why should vines and limbs be removed from wood privacy fences?",
        a: "Woody vines hold dampness against cedar and pine pickets and add heavy sail weight in winter windstorms, rotting boards and leaning posts years ahead of schedule.",
      },
      {
        q: "Can you bush hog an overgrown lot and also finish-mow it?",
        a: "Yes. On overgrown residential or roadside lots, we knock down the tall stalks with bush-hogging gear first and follow up with commercial zero-turn finish mowers so the lot looks clean and maintained rather than ragged.",
      },
    ],
  },
  {
    slug: "junk-removal-yard-debris-hauling",
    shortTitle: "Junk & Yard Debris Hauling",
    title: "Yard Debris, Brush Pile & Trailer Junk Removal",
    seasonGroup: "fall-winter",
    seasonBadge: "Year-Round & Winter Storm Cleanouts",
    seoTitle:
      "Yard Debris, Brush & Junk Removal in Flora, Madison & Jackson, MS | Lungrin's",
    seoDescription:
      "Fast brush pile haul-away, storm limb cleanup, old raised-bed removal & trailer junk hauling in Flora, Madison, Gluckstadt, Ridgeland & Jackson, MS. (601) 906-1281.",
    heroHeadline: "Brush Piles, Storm Limbs & Trailer Junk Haul-Away in",
    heroHighlight: "Flora, Madison, Ridgeland & North Jackson, MS",
    heroIntro:
      "Got a massive pile of cut limbs, old rotten landscape timbers, storm-downed branches, or backyard clutter sitting on your property? Luke arrives with trailer and compact loader equipment to load everything up, sweep the ground clean, and haul it off-site.",
    whySeasonMattersTitle: "Fast Relief After Pruning, Cleanouts & Mississippi Winter Storms",
    whySeasonMattersBody:
      "Homeowners often spend a weekend trimming limbs or cleaning out a shed only to get stuck with a pile the city claw truck won't touch—or wake up after a Mississippi winter wind or ice front with limbs across the yard. We handle the heavy lifting and disposal so your yard is back to spotless in hours.",
    checklistTitle: "What We Load & Haul Off",
    checklistItems: [
      "Cut tree limbs, storm-downed branches, brush piles & shrub tear-outs",
      "Old rotten railroad ties, timber raised garden beds & soil mound removal",
      "Shed, garage, patio, fence-panel & exterior property cleanouts",
      "Bagged or loose yard waste, old mulch, and landscaping debris",
      "Raked and blower-cleaned ground before we pull out of your driveway",
    ],
    idealForTitle: "Quick Quote Options",
    idealForItems: [
      "Text a photo of your brush or junk pile to (601) 906-1281 for a fast price",
      "Winter storm & wind-event limb cleanups across Madison & Hinds Counties",
      "Rental turnover, estate cleanout & pre-sale exterior decluttering",
      "Dismantling old raised garden beds or landscape borders",
    ],
    matchKeywords: ["debris", "cleanout", "haul", "raised"],
    heroImage: "/images/jobs/fb-2026/jul08-flora-raised-beds/2.webp",
    faqs: [
      {
        q: "Can I text a picture of my brush or junk pile for a quick quote?",
        a: "Yes—that's the fastest way! Text one or two photos of the pile and your town to Luke at (601) 906-1281 and he can usually send back a clear trailer load-out estimate the same day.",
      },
      {
        q: "Do I have to drag the brush to the street first?",
        a: "No. Whether the debris is behind a backyard shed, along a back fence, or stacked by the driveway, we collect, load, and haul it directly from where it sits.",
      },
      {
        q: "Can you remove old wooden raised beds and grade the dirt flat?",
        a: "Yes. We use compact loader equipment to tear out rotten timber beds, haul off excess soil or debris, and smooth the area so grass can fill back in.",
      },
    ],
  },
  {
    slug: "flowerbed-cleanup-shrub-tree-planting",
    shortTitle: "Flowerbed Cleanups & Planting",
    title: "Overgrown Flowerbed Reclamation, Shrub & Privacy Tree Planting",
    seasonGroup: "spring-summer",
    seasonBadge: "Fall Planting Window, Winter Prep & Spring Makeovers",
    seoTitle:
      "Flowerbed Cleanup, Shrub & Privacy Tree Planting in Madison & Flora, MS",
    seoDescription:
      "Overgrown flowerbed weeding, dead shrub removal, new bed turf stripping & privacy tree planting in Flora, Madison, Gluckstadt & Ridgeland, MS. Call (601) 906-1281.",
    heroHeadline: "Overgrown Flowerbed Cleanups, Shrubs & Privacy Trees in",
    heroHighlight: "Flora, Madison, Gluckstadt & Bentonia, MS",
    heroIntro:
      "Overgrown foundation beds can hide a great home. Luke extracts dead or leggy shrubs by the root, strips encroaching Bermuda sod to carve crisp curved beds, plants healthy evergreens and living privacy screens, and finishes with fresh pine straw or mulch.",
    whySeasonMattersTitle: "Did You Know? Fall & Winter Are Ideal for Planting Trees & Shrubs in MS",
    whySeasonMattersBody:
      "While spring brings colorful blooms, horticulturalists across Mississippi recommend October through March for planting shrubs and evergreen privacy trees: cool air reduces transplant shock while warm Southern soil lets roots establish deeply all winter before July heat arrives.",
    checklistTitle: "Complete Bed & Planting Solutions",
    checklistItems: [
      "Hand-pulled root extraction of overgrown weeds, briars & Bermuda runners",
      "Dead or winter-killed foundation shrub digging and root removal",
      "Sod stripping and V-trench edging to create brand-new curved flowerbeds",
      "Ornamental shrub & evergreen living-privacy-fence tree installation",
      "Finished with thick rolled longleaf pine straw or dark hardwood mulch",
    ],
    idealForTitle: "Common Homeowner Requests",
    idealForItems: [
      "Replacing overgrown 20-year-old foundation bushes blocking front windows",
      "Planting evergreen privacy tree rows along acreage boundaries",
      "Reclaiming neglected flowerbeds that grass and weeds have taken over",
      "Seasonal spring & fall curb-appeal bed makeovers",
    ],
    matchKeywords: ["flowerbed", "planting", "privacy", "shrub"],
    heroImage: "/images/jobs/fb-2026/nov10-flora-beds/2.webp",
    faqs: [
      {
        q: "Can shrubs and privacy trees be planted in the fall and winter in Mississippi?",
        a: "Yes—fall and winter (October–March) are actually the best months in Central Mississippi to plant hardy shrubs and evergreen privacy trees so their root systems establish in cool weather before summer heat.",
      },
      {
        q: "Can you dig out dead or overgrown bushes before redoing my beds?",
        a: "Yes. We extract dead or oversized shrubs down to the root ball, haul away all green waste, re-cut clean bed edges, plant new ornamentals if desired, and finish with fresh pine straw or mulch.",
      },
      {
        q: "Can you carve brand-new flowerbeds where there is currently just grass?",
        a: "Absolutely. We strip out the existing turf cleanly, shape smooth architectural curves along your home or walkway, plant your selections, and install tucked borders.",
      },
    ],
  },
  {
    slug: "bush-hedge-trimming",
    shortTitle: "Bush & Hedge Trimming",
    title: "Bush, Hedge & Ornamental Shrub Trimming",
    seasonGroup: "spring-summer",
    seasonBadge: "Late-Winter Rejuvenation Pruning & Spring/Fall Shaping",
    seoTitle:
      "Bush & Hedge Trimming in Madison, Ridgeland, Gluckstadt & Flora, MS | Lungrin's",
    seoDescription:
      "Precision bush sculpting, foundation hedge leveling, winter shrub pruning & 100% clipping haul-away in Madison, Annandale, Ridgeland & Flora, MS. (601) 906-1281.",
    heroHeadline: "Crisp Bush, Hedge & Ornamental Shrub Sculpting Across",
    heroHighlight: "Madison, Annandale, Ridgeland & Flora, MS",
    heroIntro:
      "Unruly hedges quickly crowd walkways and block natural light from front windows. Luke shapes boxwoods, hollies, loropetalums, ligustrums, and foundation evergreens with clean architectural lines—and hauls 100% of trimmings away.",
    whySeasonMattersTitle: "Late-Winter Hard Pruning vs. Warm-Season Detail Shaping",
    whySeasonMattersBody:
      "Late winter (January–February, right before spring bud break) is the safest window in Mississippi for hard size reductions on overgrown hollies, ligustrums, and crape myrtles—while late spring and early fall touch-ups keep hedges tight and polished without heat-stressing the plant.",
    checklistTitle: "Every Shrub & Hedge Service Includes",
    checklistItems: [
      "Level horizontal foundation hedge trimming below window sills",
      "Hand-detailed globe and natural shaping on boxwoods & feature shrubs",
      "Late-winter structural size reduction on overgrown evergreens",
      "Low-hanging ornamental tree & walkway clearance pruning",
      "100% raking, tarping, blowing, and off-site branch/clipping haul-away",
    ],
    idealForTitle: "Shrubs We Maintain Regularly",
    idealForItems: [
      "Boxwoods, Yaupon & Nellie R. Stevens Hollies, Indian Hawthorns & Cleyera",
      "Loropetalum, Ligustrum, Viburnum & Camellia/Azalea post-bloom shaping",
      "Annandale, Reunion, Ridgeland & Gluckstadt front-elevation refreshes",
      "Standalone one-time shrub cleanups or scheduled route add-ons",
    ],
    matchKeywords: ["bush", "hedge", "shrub", "annandale"],
    heroImage: "/images/jobs/fb-2026/sep14-madison-hedge-trim/2.webp",
    faqs: [
      {
        q: "When should overgrown bushes be cut back hard in Mississippi?",
        a: "Late winter (late January through February) is best for major height reductions on hollies, ligustrum, and non-spring-blooming evergreens, right before vigorous March growth fills them back in cleanly. Spring-flowering azaleas should be trimmed right after they finish blooming.",
      },
      {
        q: "Do you clean up all the clippings out of my pine straw and mulch beds?",
        a: "Yes—every time. We tarp around beds where possible, rake and blow clippings clear of your shrubs and walkways, and haul every branch off-site.",
      },
    ],
  },
  {
    slug: "lawn-mowing-edging-striping",
    shortTitle: "Lawn Mowing & Striping",
    title: "Residential Lawn Mowing, 90° Edging & Turf Striping",
    seasonGroup: "spring-summer",
    seasonBadge: "Peak Mar – Oct Weekly & Bi-Weekly Routes",
    seoTitle:
      "Lawn Mowing & Turf Striping in Flora, Madison, Gluckstadt & Ridgeland, MS",
    seoDescription:
      "Owner-operated weekly & bi-weekly lawn mowing, zero-turn striping & 90° steel-blade edging in Flora, Madison, Gluckstadt & Ridgeland, MS. Call (601) 906-1281.",
    heroHeadline: "Owner-Operated Lawn Mowing, 90° Edging & Turf Striping in",
    heroHighlight: "Flora, Madison, Gluckstadt & Ridgeland, MS",
    heroIntro:
      "Tired of rushed 8-minute mow-and-blow crews leaving scalped patches, missed corners, and clippings in your flowerbeds? Owner Luke Lungrin is personally on-site on every route—delivering commercial stripe definition, razor-sharp vertical concrete edges, closed gates, and spotless blow-offs.",
    whySeasonMattersTitle: "Consistent Cuts Build Thicker, Weed-Resistant Mississippi Turf",
    whySeasonMattersBody:
      "Warm-season Bermuda, Zoysia, and St. Augustine grass thrive when mowed consistently every 7–10 days from March through October with sharp commercial blades and alternating mowing angles—preventing tire ruts, stopping grass runners from creeping over concrete, and shading out summer crabgrass.",
    checklistTitle: "Standard on Every Single Mowing Visit",
    checklistItems: [
      "Commercial zero-turn mowing with alternating checkerboard/diagonal stripes",
      "Precision string trimming around fences, trees, mailboxes, and foundations",
      "90-degree vertical steel-blade edging along all sidewalks, curbs & driveways",
      "Careful discharge control so grass clippings stay out of your flowerbeds",
      "Latched backyard gates and thorough blow-off of all concrete & porches",
    ],
    idealForTitle: "Flexible Route Options",
    idealForItems: [
      "Weekly peak-season routes (April–October) for thick, manicured turf",
      "Bi-weekly maintenance schedules & shoulder-season spring/fall cuts",
      "Year-round property care pairing summer mowing with winter leaf & pine straw care",
      "Subdivision homes across Flora, Madison, Gluckstadt, Ridgeland & North Jackson",
    ],
    matchKeywords: ["residential mowing", "striping", "sidewalk", "edging"],
    heroImage: "/images/jobs/fb-2026/jul29-ridgeland-striping/2.webp",
    faqs: [
      {
        q: "Will the same person actually show up to mow my yard each week?",
        a: "Yes. Lungrin's Lawncare is owner-operated by Luke Lungrin—you communicate directly with Luke, and he personally oversees every cut on your property.",
      },
      {
        q: "Do you edge sidewalks and driveways with a metal blade edger every visit?",
        a: "Yes. Vertical steel-blade concrete edging, string trimming, and full driveway/porch blow-offs are included as standard on our mowing visits—never charged as surprise extras.",
      },
      {
        q: "What happens to my lawn service during late fall and winter?",
        a: "As grass goes dormant in November–February, route clients seamlessly shift from weekly mowing to as-needed winter leaf cleanups, shrub pruning, and fresh rolled pine straw—keeping your yard sharp 12 months a year.",
      },
    ],
  },
  {
    slug: "acreage-mowing-overgrowth-recovery",
    shortTitle: "Acreage & Overgrowth Recovery",
    title: "Acreage Mowing & Overgrown Yard Recovery",
    seasonGroup: "spring-summer",
    seasonBadge: "Multi-Acre Estates & Neglected Lot Reclamation",
    seoTitle:
      "Acreage Mowing & Overgrown Yard Cleanup in Flora, Bentonia & Madison County, MS",
    seoDescription:
      "Commercial wide-deck acreage mowing & overgrown grass recovery for 1–10+ acre properties in Flora, Pocahontas, Bentonia, Madison & Yazoo County, MS. (601) 906-1281.",
    heroHeadline: "Wide-Deck Acreage Mowing & Overgrown Lot Recovery Across",
    heroHighlight: "Flora, Pocahontas, Bentonia & Madison County",
    heroIntro:
      "Managing 1, 3, or 10+ acres—or bringing back a yard that got knee-high after rain or vacancy—takes commercial horsepower and patience. Luke brings wide-deck zero-turns and heavy brush gear to cut large homesteads cleanly and recover neglected lawns.",
    whySeasonMattersTitle: "Year-Round Rural Homestead & Vacant Property Maintenance",
    whySeasonMattersBody:
      "Acreage properties need reliable spring/summer turf cutting around trees, barns, driveways, and ponds—plus late-fall/winter knockdown cuts so tall dormant weeds and broom sedge don't turn into unsightly fire or rodent hazards over the winter.",
    checklistTitle: "Acreage & Overgrowth Capabilities",
    checklistItems: [
      "Commercial wide-deck zero-turn mowing for 1 to 10+ acre homesteads & estates",
      "Detailed trimming around barns, outbuildings, culverts, trees & gravel drives",
      "Multi-stage overgrown lawn knockdowns that bring tall yards back to normal turf",
      "Winter dormant pasture/lot knockdowns & pre-sale property cleanups",
      "Optional recurring bi-weekly or monthly rural mowing schedules",
    ],
    idealForTitle: "Properties We Serve",
    idealForItems: [
      "Rural homesteads along Hwy 49, Cox Ferry, Kearney Park, Pocahontas & Bentonia",
      "Multi-acre estates in West Madison County, Ridgeland & Yazoo County",
      "Vacant lots, inherited homes, rental turnovers & HOA violation recoveries",
      "Homeowners tired of spending their entire Saturday on a riding mower",
    ],
    matchKeywords: ["acreage", "overgrowth", "bush hog", "estate"],
    heroImage: "/images/jobs/fb-2026/jun08-flora-turf-care/1.webp",
    faqs: [
      {
        q: "Can you bring a knee-high or waist-high overgrown yard back to a normal lawn?",
        a: "Yes. Depending on height, we knock down heavy growth with brush/high-deck passes first and follow with a clean finish cut—within 2 to 3 cuts, most neglected yards transition right onto a normal lawn schedule.",
      },
      {
        q: "How do you price 1 to 5+ acre properties?",
        a: "Pricing depends on total mowable acreage, slope, and trimming obstacles (fences, trees, pond banks, outbuildings). Call or text Luke at (601) 906-1281 for a free on-site walk-through and exact quote.",
      },
    ],
  },
];

export function getServiceHubBySlug(slug: string): YearRoundServiceHub | undefined {
  return YEAR_ROUND_SERVICES.find((s) => s.slug === slug);
}

export function matchServiceHubForPin(pin: PinRecord): YearRoundServiceHub {
  const hay = `${pin.service} ${pin.title || ""} ${pin.description}`.toLowerCase();
  if (hay.includes("leaf") || hay.includes("winter")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "leaf-removal-winter-yard-cleanup")!;
  }
  if (hay.includes("pond") || hay.includes("fence") || hay.includes("bush hog") || hay.includes("lakefront")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "pond-bank-fence-line-bush-hogging")!;
  }
  if (hay.includes("debris") || hay.includes("cleanout") || hay.includes("raised")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "junk-removal-yard-debris-hauling")!;
  }
  if (hay.includes("planting") || hay.includes("privacy") || hay.includes("flowerbed reclamation")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "flowerbed-cleanup-shrub-tree-planting")!;
  }
  if (hay.includes("bush") || hay.includes("hedge")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "bush-hedge-trimming")!;
  }
  if (hay.includes("pine straw") || hay.includes("mulch")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "pine-straw-mulch-installation")!;
  }
  if (hay.includes("acreage") || hay.includes("overgrowth")) {
    return YEAR_ROUND_SERVICES.find((s) => s.slug === "acreage-mowing-overgrowth-recovery")!;
  }
  return YEAR_ROUND_SERVICES.find((s) => s.slug === "lawn-mowing-edging-striping")!;
}
