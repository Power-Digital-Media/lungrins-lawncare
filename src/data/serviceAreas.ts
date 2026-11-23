export interface ServiceAreaHub {
  slug: string;
  town: string;
  cityShort: string;
  county: string;
  zipCodes: string;
  subLabel: string;
  seoTitle: string;
  seoDescription: string;
  heroIntro: string;
  neighborhoods: string[];
  routeNotes: string;
  matchKeywords: string[];
}

export const SERVICE_AREA_HUBS: ServiceAreaHub[] = [
  {
    slug: "flora-ms",
    town: "Flora, MS",
    cityShort: "Flora",
    county: "Madison County",
    zipCodes: "39071",
    subLabel: "Home Base • 39071",
    seoTitle: "Lawn Care & Pine Straw in Flora, MS | Lungrin's Lawncare",
    seoDescription:
      "Owner-operated lawn mowing, rolled longleaf pine straw, flowerbed cleanups & property clearing in Flora, MS (39071). Call Luke Lungrin: (601) 906-1281.",
    heroIntro:
      "Flora is home base for Lungrin's Lawncare. Owner Luke Lungrin runs weekly and bi-weekly residential and acreage mowing, hand-rolled longleaf pine straw installs, flowerbed reclamations, and fence-line clearing across 39071.",
    neighborhoods: [
      "Downtown Flora & Hwy 49 Corridor",
      "Kearney Park & Livingston Road",
      "Cox Ferry Road & Rural Acreage",
      "Anding & West Madison County Estates",
    ],
    routeNotes:
      "Because our shop and trailers roll directly out of Flora, MS every morning, 39071 homeowners get priority route scheduling, fast storm-debris turnarounds, and zero travel surcharges.",
    matchKeywords: ["flora"],
  },
  {
    slug: "pocahontas-ms",
    town: "Pocahontas, MS",
    cityShort: "Pocahontas",
    county: "Hinds County",
    zipCodes: "39072",
    subLabel: "Primary Route & Ponds",
    seoTitle: "Lawn Care & Clearing in Pocahontas, MS | Lungrin's Lawncare",
    seoDescription:
      "Reliable acreage mowing, pond bank clearing, rolled pine straw & bush trimming in Pocahontas, MS along Hwy 49. Call Luke Lungrin at (601) 906-1281.",
    heroIntro:
      "Just minutes south of our Flora headquarters along Highway 49, Pocahontas homeowners and multi-acre homesteads count on Luke Lungrin for steep pond-dam mowing, brush clearing, and crisp residential turf care.",
    neighborhoods: [
      "Pocahontas Mound & Hwy 49 Corridor",
      "limekiln & Old Hwy 49 Homesteads",
      "Private Pond & Pasture Properties",
      "North Hinds County Rural Estates",
    ],
    routeNotes:
      "We run commercial zero-turn mowers and heavy brush-trimming gear through Pocahontas multiple days every week, handling both manicured front beds and multi-acre pond levees.",
    matchKeywords: ["pocahontas"],
  },
  {
    slug: "madison-ms",
    town: "Madison, MS",
    cityShort: "Madison",
    county: "Madison County",
    zipCodes: "39110",
    subLabel: "Annandale • 39110",
    seoTitle: "Lawn Care & Pine Straw in Madison, MS | Lungrin's Lawncare",
    seoDescription:
      "Detail-focused lawn mowing, rolled longleaf pine straw, mulch beds & shrub shaping in Madison, MS (39110) including Annandale. Call (601) 906-1281.",
    heroIntro:
      "From Annandale and Reunion to Mannsdale Road subdivisions, Madison homeowners hire Lungrin's Lawncare for HOA-ready steel-blade edging, deep hand-tucked pine straw borders, and spotless hardscape blow-offs.",
    neighborhoods: [
      "Annandale & Mannsdale Corridor",
      "Reunion & Bozeman Road",
      "Hoy Road & Strawberry Patch Area",
      "Hwy 463 & West Madison Estates",
    ],
    routeNotes:
      "Every Madison visit closes gates securely, blows clippings completely clear of driveways and patios, and keeps flowerbed edges crisp to strict neighborhood standards.",
    matchKeywords: ["madison", "annandale"],
  },
  {
    slug: "gluckstadt-ms",
    town: "Gluckstadt, MS",
    cityShort: "Gluckstadt",
    county: "Madison County",
    zipCodes: "39110",
    subLabel: "Subdivisions & Beds",
    seoTitle: "Lawn Care & Pine Straw in Gluckstadt, MS | Lungrin's",
    seoDescription:
      "Consistent weekly lawn mowing, rolled pine straw, mulch refreshes & hedge trimming across Gluckstadt, MS subdivisions. Call Luke: (601) 906-1281.",
    heroIntro:
      "Gluckstadt's growing neighborhoods between Calhoun Station Parkway, Yandell Road, and Catlett Road rely on consistent weekly turf striping, seasonal bed cleanouts, and clean pine straw installations.",
    neighborhoods: [
      "Calhoun Station & Germantown Area",
      "Yandell Road & Stribling Road",
      "Catlett Road & Bradshaw Subdivisions",
      "Dees Road & North Gluckstadt",
    ],
    routeNotes:
      "Our dedicated Gluckstadt route pairs residential mowing with seasonal spring and fall bed mulching so your curb appeal stays sharp year-round.",
    matchKeywords: ["gluckstadt"],
  },
  {
    slug: "ridgeland-ms",
    town: "Ridgeland, MS",
    cityShort: "Ridgeland",
    county: "Madison County",
    zipCodes: "39157",
    subLabel: "Estates • 39157",
    seoTitle: "Lawn Care & Striping in Ridgeland, MS | Lungrin's Lawncare",
    seoDescription:
      "Commercial-grade turf striping, rolled pine straw, fall leaf cleanups & shrub trimming in Ridgeland, MS (39157). Free estimate: (601) 906-1281.",
    heroIntro:
      "Ridgeland properties demand clean mower patterns, sculpted ornamental hedges, and fresh seasonal beds. Owner Luke Lungrin personally oversees every cut, edge, and leaf-haul in 39157.",
    neighborhoods: [
      "Highland Colony & Lake Harbour",
      "Old Agency Road & Greenwood Estates",
      "Sunnybrook & Pear Orchard",
      "Bridgewater & County Line North",
    ],
    routeNotes:
      "We rotate mowing angles to prevent rutting on irrigated Ridgeland turf and haul away all trimmings, sticks, and bagged leaves the same day.",
    matchKeywords: ["ridgeland"],
  },
  {
    slug: "jackson-ms",
    town: "Jackson, MS",
    cityShort: "Jackson",
    county: "Hinds County",
    zipCodes: "39206 • 39211 • 39213",
    subLabel: "North Jackson Routes",
    seoTitle: "Lawn Care & Cleanups in Jackson, MS | Lungrin's Lawncare",
    seoDescription:
      "Owner-operated lawn care, overgrown fence-line clearing, pine straw & property cleanups in North Jackson, MS. Call Luke Lungrin: (601) 906-1281.",
    heroIntro:
      "Across North Jackson, Eastover, Fondren, and Northwest Hinds corridors, Lungrin's Lawncare handles both routine residential lawn maintenance and heavy overgrown fence-line and flowerbed reclamations.",
    neighborhoods: [
      "North Jackson & Meadowbrook",
      "Eastover & Ridgewood Corridors",
      "Northwest Jackson & Hwy 49 North",
      "Fondren & Belhaven Residential Lots",
    ],
    routeNotes:
      "Whether your Jackson property needs reliable bi-weekly mowing or a one-time overgrown vine, shrub, and debris haul-off, Luke quotes it transparently and shows up on time.",
    matchKeywords: ["jackson"],
  },
  {
    slug: "bentonia-ms",
    town: "Bentonia, MS",
    cityShort: "Bentonia",
    county: "Yazoo County",
    zipCodes: "39040",
    subLabel: "Acreage & Clearing • 39040",
    seoTitle: "Acreage Mowing & Lawn Care in Bentonia, MS | Lungrin's",
    seoDescription:
      "Acreage lawn mowing, fence-line brush clearing, privacy tree beds & pine straw in Bentonia, MS (39040). Call Luke Lungrin at (601) 906-1281.",
    heroIntro:
      "Just north of Flora up Highway 49, Bentonia landowners trust Lungrin's Lawncare for wide-deck acreage mowing, fence-row vine removal, privacy tree bed mulching, and rural driveway edging.",
    neighborhoods: [
      "Bentonia Town & Hwy 49 North",
      "Little Yazoo & Oil Field Road",
      "satartia Road & Rural Homesteads",
      "South Yazoo County Acreage",
    ],
    routeNotes:
      "We bring full-size equipment suited for multi-acre Bentonia lots while delivering the same crisp residential bed detailing around your home and porch.",
    matchKeywords: ["bentonia"],
  },
  {
    slug: "yazoo-county-ms",
    town: "Yazoo County, MS",
    cityShort: "Yazoo County",
    county: "Yazoo County",
    zipCodes: "39040 • 39194",
    subLabel: "Bee Lake & Rural",
    seoTitle: "Lawn Care & Acreage Clearing in Yazoo County, MS | Lungrin's",
    seoDescription:
      "Dependable camp, lakefront, and rural acreage mowing, brush clearing & pine straw across Yazoo County & Bee Lake, MS. Call Luke: (601) 906-1281.",
    heroIntro:
      "From waterfront camps at Bee Lake to rural homesteads across southern Yazoo County, Lungrin's Lawncare keeps weekend retreats, levees, and residential yards trimmed, edged, and storm-ready.",
    neighborhoods: [
      "Bee Lake Waterfront Camps & Lots",
      "Hwy 49 Corridor & Vaughan",
      "Phoenix & Southern Yazoo Homesteads",
      "Rural Hunting & Camp Properties",
    ],
    routeNotes:
      "Out-of-town camp and rural homeowners receive text photo updates after service so you always know your Yazoo County property is clean before the weekend.",
    matchKeywords: ["yazoo", "bee lake", "bentonia"],
  },
];

export function getServiceAreaBySlug(slug: string): ServiceAreaHub | undefined {
  return SERVICE_AREA_HUBS.find((a) => a.slug === slug);
}
