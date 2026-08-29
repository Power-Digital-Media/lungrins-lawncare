/* ────────────────────────────────────────────────────────────
 * Lungrin's Lawncare — Service Articles
 * SEO-optimized educational content for lawn care services
 * ──────────────────────────────────────────────────────────── */

export interface ServiceArticle {
  title: string;
  subtitle: string;
  intro: string;
  faqs: { heading: string; body: string }[];
}

const serviceArticles: Record<string, ServiceArticle> = {
  "residential-mowing": {
    title: "Professional Residential Mowing in Flora & Pocahontas, MS",
    subtitle: "Consistent Cuts, Clean Lines, Healthy Turf",
    intro: "A well-maintained lawn starts with a consistent mowing schedule. Residential mowing keeps your turf at the ideal height for Mississippi's warm-season grasses, promotes dense root growth, and eliminates the unkempt look that drives down curb appeal.",
    faqs: [
      {
        heading: "How often should a residential lawn be mowed in Mississippi?",
        body: "During peak growing season (April–October), Mississippi lawns should be mowed <strong>every 7–10 days</strong>. Bermuda and Zoysia grasses grow aggressively in our heat and humidity. Waiting too long leads to scalping, which stresses the turf and invites weeds."
      },
      {
        heading: "What mowing height is best for warm-season Mississippi grass?",
        body: "For Bermuda grass, the ideal height is <strong>1.5 to 2 inches</strong>. For Zoysia and St. Augustine, aim for <strong>2 to 3 inches</strong>. Cutting too low exposes soil to sunlight, encouraging crabgrass and other weeds to take hold."
      }
    ]
  },
  "edging-trimming": {
    title: "Professional Edging & Trimming Services",
    subtitle: "Sharp Borders, Clean Sidewalks, Polished Appearance",
    intro: "Edging and trimming are what separate a good-looking lawn from a great one. Clean edges along driveways, sidewalks, and flower beds create crisp lines that frame the entire property.",
    faqs: [
      {
        heading: "Why is edging important beyond just looks?",
        body: "Edging creates a physical barrier that <strong>prevents grass runners from invading flower beds, sidewalks, and driveways</strong>. Without regular edging, Bermuda grass will creep over concrete and into garden beds within weeks during summer."
      },
      {
        heading: "How often should edging be done?",
        body: "In Mississippi's growing season, edging should be done <strong>every mow cycle</strong>. Skipping edging for even two weeks allows grass to overgrow borders, requiring more aggressive cutting that can damage concrete edges."
      }
    ]
  },
  "pine-straw-installation": {
    title: "Pine Straw Installation & Mulch Bed Services",
    subtitle: "Natural Ground Cover That Protects and Beautifies",
    intro: "Pine straw is Mississippi's preferred ground cover for good reason — it's affordable, natural-looking, and excellent at retaining moisture in our hot summers. Fresh pine straw transforms tired beds into clean, professional landscapes.",
    faqs: [
      {
        heading: "How often should pine straw be replaced?",
        body: "Pine straw should be refreshed <strong>once or twice per year</strong> in Mississippi. The first application in early spring sets the tone for the growing season. A fall touch-up keeps beds looking fresh through winter. Each application should be <strong>3 to 4 inches deep</strong>."
      },
      {
        heading: "Is pine straw better than hardwood mulch for Mississippi landscapes?",
        body: "For most Mississippi landscapes, pine straw is the better choice. It <strong>doesn't float away in heavy rain</strong> like lightweight mulch, it allows water to penetrate to plant roots, and it naturally acidifies soil — which azaleas, camellias, and blueberries love."
      }
    ]
  },
  "gutter-cleaning": {
    title: "Gutter Cleaning & Maintenance",
    subtitle: "Preventing Water Damage Before It Starts",
    intro: "Clogged gutters cause water to overflow against your foundation, rot your fascia boards, and create breeding grounds for mosquitoes. Regular gutter cleaning is one of the most important — and most neglected — maintenance tasks for Mississippi homeowners.",
    faqs: [
      {
        heading: "How often should gutters be cleaned in Mississippi?",
        body: "At minimum, <strong>twice per year</strong> — once in late fall after leaves drop and once in late spring. Properties surrounded by pine trees may need <strong>quarterly cleaning</strong> because pine needles accumulate fast and pack tightly in gutter channels."
      },
      {
        heading: "What happens if gutters aren't cleaned regularly?",
        body: "Clogged gutters cause water to <strong>pool against your foundation</strong>, leading to basement leaks, soil erosion around the home, and even foundation cracking. In Mississippi's heavy rain season, a single clogged downspout can dump hundreds of gallons against your house in one storm."
      }
    ]
  },
  "overgrowth-recovery": {
    title: "Overgrowth Recovery & Property Clearing",
    subtitle: "Reclaiming Neglected Properties One Cut at a Time",
    intro: "When a property has been neglected — whether from vacancy, illness, or just falling behind — the overgrowth can feel overwhelming. Waist-high grass, encroaching brush, and tangled vines don't just look bad; they harbor snakes, rodents, and fire ant colonies.",
    faqs: [
      {
        heading: "Can an overgrown yard be recovered to a normal lawn?",
        body: "Yes. Most overgrown properties can be <strong>fully recovered in 2 to 3 mow cycles</strong>. The first pass knocks everything down to a manageable height. The second pass levels the turf. By the third mow, the lawn is on a normal maintenance schedule."
      },
      {
        heading: "What equipment is needed for heavy overgrowth?",
        body: "Standard riding mowers can't handle waist-high growth. Recovery jobs require <strong>commercial brush cutters, string trimmers, and sometimes bush hog attachments</strong>. The initial clearing is the hardest part — after that, regular mowing keeps it maintained."
      }
    ]
  },
  "bush-hedge-trimming": {
    title: "Bush & Hedge Trimming Services",
    subtitle: "Shaping Shrubs for a Polished, Professional Look",
    intro: "Overgrown bushes and hedges make even a freshly mowed lawn look neglected. Regular trimming keeps shrubs healthy, encourages dense growth, and maintains the clean architectural lines that boost curb appeal.",
    faqs: [
      {
        heading: "When is the best time to trim hedges in Mississippi?",
        body: "The best times are <strong>late spring (after the first flush of growth) and early fall</strong>. Avoid heavy trimming in late summer — the stress combined with Mississippi heat can damage plants. Never trim more than one-third of the shrub's volume at once."
      },
      {
        heading: "How often should hedges be trimmed to stay neat?",
        body: "Fast-growing hedges like privet and ligustrum need trimming <strong>every 4 to 6 weeks</strong> during growing season. Slower species like boxwood and holly can go <strong>2 to 3 months</strong> between trims."
      }
    ]
  },
  "acreage-mowing": {
    title: "Acreage & Large Property Mowing",
    subtitle: "Commercial Equipment for Big Jobs Done Right",
    intro: "Mowing 1, 2, or 5+ acres requires commercial-grade equipment and experience. Standard residential mowers aren't built for large lots — they overheat, leave uneven cuts, and take forever. Professional acreage mowing gets the job done efficiently with clean results.",
    faqs: [
      {
        heading: "What size property requires commercial mowing equipment?",
        body: "Any property <strong>over half an acre</strong> benefits from commercial equipment. Zero-turn mowers with 48\" to 72\" decks cut in a fraction of the time and produce a more even finish than residential mowers."
      },
      {
        heading: "How is pricing determined for large acreage?",
        body: "Acreage pricing is based on <strong>total mowable area, terrain difficulty, and obstacles</strong> (fences, ponds, slopes). A flat 2-acre lot costs less per acre than a 2-acre lot with a pond, fence lines, and tree clusters that require trimming around."
      }
    ]
  }
};

export default serviceArticles;
