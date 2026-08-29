import React from "react";

export interface ArticleData {
  title: string;
  subtitle: string;
  intro: string;
  sections: {
    heading: string;
    content: React.ReactNode;
  }[];
  scriptureRef?: string;
  scriptureText?: string;
}

export const serviceArticles: Record<string, ArticleData> = {
  "bathroom-remodeling": {
    title: "A Faith-First Guide to Bathroom Remodeling & Subfloor Restoration",
    subtitle: "Stewardship of Your Home's Foundation & Comfort",
    intro: "As believers, we know that stewardship extends to every corner of our lives—including the homes we are blessed to care for. A bathroom remodel is more than an aesthetic upgrade; it is an act of preserving the structural integrity of your household. In bathroom spaces, water can easily seep into hidden crevices, rotting subfloors and compromising structural safety. Operating with absolute integrity, we ensure that every hidden leak is sealed and every rotted board is replaced, working heartily as unto the Lord (Colossians 3:23).",
    scriptureRef: "Luke 6:48",
    scriptureText: "He is like a man building a house, who dug deep and laid the foundation on the rock. And when a flood arose, the stream broke against that house and could not shake it, because it had been well built.",
    sections: [
      {
        heading: "What are the most durable and water-resistant materials for a bathroom remodel?",
        content: (
          <p>
            When remodeling a high-moisture space, choosing the right materials is a key part of wise stewardship. We recommend <strong>porcelain or ceramic tile</strong> for shower walls and floors due to their complete impermeability to water. For cabinetry, we utilize <strong>solid plywood box construction</strong> over particle board, as it holds up significantly better to humidity without swelling. Most importantly, we install <strong>waterproof backing boards</strong> (like cement board or Schluter-Kerdi membranes) behind all tiled areas to ensure water never reaches your home&apos;s timber framing.
          </p>
        )
      },
      {
        heading: "How do you handle hidden subfloor water damage and mold during demolition?",
        content: (
          <p>
            True honesty in contracting means never covering up a problem. During demolition, we thoroughly inspect the plywood subfloor beneath your toilet and tub. If we find water rot or mold, <strong>we cut out the damaged timber</strong>, treat the surrounding floor joists with mold inhibitors, and install new, structurally sound plywood. We refuse to lay new tile over a soft foundation, guaranteeing that your bathroom remains solid and leak-free for decades to come.
          </p>
        )
      }
    ]
  },
  "kitchen-remodeling": {
    title: "Designing the Heart of the Home: Kitchen Remodeling with Integrity",
    subtitle: "Creating Spaces of Fellowship, Stewardship, and Hospitality",
    intro: "The kitchen is the center of family life, fellowship, and hospitality. In Scripture, opening our homes and sharing meals is seen as a beautiful expression of love (Hebrews 13:2). When we remodel a kitchen, we bring this same spirit of service to our craftsmanship. We work to design a space that facilitates connection, honors your household budget, and stands up to daily use through honest craftsmanship and premium wood cabinetry.",
    scriptureRef: "Proverbs 24:3-4",
    scriptureText: "By wisdom a house is built, and by understanding it is established; by knowledge the rooms are filled with all precious and pleasant riches.",
    sections: [
      {
        heading: "How can I design a kitchen layout that maximizes workflow and fellowship?",
        content: (
          <p>
            An efficient kitchen relies on the <strong>&ldquo;work triangle&rdquo; concept</strong>, keeping the distance between your stove, sink, and refrigerator balanced and unobstructed. If space allows, we design <strong>central islands with overhangs</strong> for seating. This allows the kitchen to serve as a functional cooking zone while hosting family members and guests comfortably, making it a true hub of hospitality.
          </p>
        )
      },
      {
        heading: "What is the difference between custom cabinetry and pre-fabricated cabinets?",
        content: (
          <p>
            Custom cabinets are hand-fabricated from <strong>premium solid wood and plywood</strong>, tailored to your kitchen&apos;s exact dimensions to eliminate awkward fillers and maximize every inch of storage. They feature durable dovetail joints and soft-close hardware. Pre-fabricated cabinets are pre-built to standard 3-inch increments, providing a faster, more budget-friendly option while still offering excellent storage efficiency when installed with precision.
          </p>
        )
      }
    ]
  },
  "whole-house-remodeling": {
    title: "Structural Restoration: Whole House Remodeling & Open Layouts",
    subtitle: "Establishing Order, Beauty, and Quality in Every Room",
    intro: "A whole-house remodel is a significant undertaking that requires careful planning, structural expertise, and absolute honesty. Whether we are framing new room additions, removing load-bearing walls for an open floor plan, or installing fresh sheetrock and trim, we treat your home as a sacred trust. Our goal is to establish order and beauty in every room, ensuring your remodeling project is built on a foundation of quality and mutual trust.",
    scriptureRef: "Ezra 5:11",
    scriptureText: "We are the servants of the God of heaven and earth, and we are rebuilding the house that was built many years ago...",
    sections: [
      {
        heading: "What is involved in safely removing a load-bearing wall for an open concept?",
        content: (
          <p>
            Safely removing a load-bearing wall requires <strong>proper structural engineering calculations</strong>. Before removing any studs, we erect a temporary support wall to bear the load of the ceiling or roof joists. We then install a <strong>laminated veneer lumber (LVL) header beam</strong> supported by solid timber columns down to the foundation. This transfers the structural weight safely, allowing you to enjoy a spacious open layout without compromising your home&apos;s safety.
          </p>
        )
      },
      {
        heading: "How do I maintain my remodeling budget without hidden charge orders?",
        content: (
          <p>
            Honest budgeting begins with <strong>thorough initial inspections</strong>. We inspect attic framing, crawlspaces, and drywall interfaces before writing our detailed scope of work. By identifying potential structural issues upfront, we minimize unforeseen challenges. If a hidden issue arises during demolition, we immediately halt, explain the options with clear pricing, and let you decide, ensuring complete transparency and no surprises.
          </p>
        )
      }
    ]
  },
  "painting": {
    title: "The Art of Prep: Flawless Interior & Exterior Painting",
    subtitle: "Renewing Your Home's Beauty with Honest Care",
    intro: "Scripture speaks frequently of renewal and making things clean and beautiful. A fresh coat of paint has the power to transform the mood and appearance of your home, protecting it from Mississippi&apos;s intense sun and rain. However, the true test of an honest painting job lies in the hidden prep work—sanding, caulking, and priming—that most contractors rush through. We commit to thorough prep, ensuring a beautiful and lasting finish.",
    scriptureRef: "Proverbs 12:22",
    scriptureText: "Lying lips are an abomination to the Lord, but those who act faithfully are his delight.",
    sections: [
      {
        heading: "Why is surface preparation the most important part of a paint job?",
        content: (
          <p>
            Paint cannot adhere properly to dirty, peeling, or damp surfaces. Our prep work involves <strong>drywall patching, pressure washing, scraping away loose paint, sanding rough edges, and applying premium primers</strong>. This careful preparation prevents cracking, peeling, and moisture traps, ensuring that your paint job lasts for years rather than failing after the first season.
          </p>
        )
      },
      {
        heading: "What paint finishes (sheens) are best for different rooms in my home?",
        content: (
          <p>
            For high-traffic areas like kitchens, bathrooms, and trim, we use <strong>semi-gloss or satin finishes</strong> because they are highly scrubbable and resist moisture. For living room and bedroom walls, we recommend a <strong>matte or eggshell sheen</strong>, which provides a rich, soft texture and hides minor drywall imperfections beautifully.
          </p>
        )
      }
    ]
  },
  "plumbing": {
    title: "Stewardship of Water: Safe & Durable Plumbing Installations",
    subtitle: "Ensuring Leak-Free Security in Kitchens and Bathrooms",
    intro: "Water is one of our most precious resources, and managing it safely inside your home is a major responsibility. From relocating drain lines during a remodel to installing high-efficiency toilets and faucets, our plumbing work is guided by strict building codes and honest craftsmanship. We use durable materials and double-check every connection to protect your home from hidden water damage.",
    scriptureRef: "Proverbs 11:1",
    scriptureText: "A false balance is an abomination to the Lord, but a just weight is his delight.",
    sections: [
      {
        heading: "Why should I upgrade my plumbing lines during a kitchen or bathroom remodel?",
        content: (
          <p>
            When walls are open during demolition, it is the most cost-effective time to replace <strong>aging copper or galvanized steel pipes</strong> with modern <strong>PEX tubing</strong>. PEX is highly flexible, resists scale build-up, and is much less likely to burst during winter freezes, protecting your home from catastrophic water leaks.
          </p>
        )
      },
      {
        heading: "What causes low water pressure in home showers and sinks, and how is it fixed?",
        content: (
          <p>
            Low water pressure is typically caused by <strong>mineral buildup in faucet aerators</strong>, a failing pressure regulator valve, or corroded galvanized pipes restricting water flow. We diagnose the bottleneck, replace failing valves, and install clean PEX runs to restore strong, steady flow to your showers and sinks.
          </p>
        )
      }
    ]
  },
  "electrical": {
    title: "Let There Be Light: Safe & Code-Compliant Electrical Work",
    subtitle: "Protecting Your Home and Family through Professional Wiring",
    intro: "In the beginning, God said, 'Let there be light' (Genesis 1:3). Light brings safety, warmth, and clarity. Modern electrical systems power our daily lives, but they must be handled with the highest level of safety and technical competence. Whether we are routing wiring for kitchen appliances, mounting ceiling fans, or installing energy-efficient LED lighting arrays, we adhere strictly to the National Electrical Code (NEC) to protect your family.",
    scriptureRef: "Genesis 1:3",
    scriptureText: "And God said, 'Let there be light,' and there was light.",
    sections: [
      {
        heading: "When is it necessary to upgrade my home&apos;s electrical panel?",
        content: (
          <p>
            You should upgrade your electrical panel if you are installing <strong>high-draw appliances</strong> (like central AC, double ovens, or hot tubs), adding a room addition, or if you still have an outdated <strong>fuse box or Federal Pacific panel</strong> (which are known fire hazards). Upgrading to a 200-amp breaker panel ensures stable power flow and modern circuit protection.
          </p>
        )
      },
      {
        heading: "What are the benefits of LED recessed lighting arrays in modern remodels?",
        content: (
          <p>
            LED recessed lighting provides <strong>even, shadow-free illumination</strong> while consuming up to 80% less energy than old incandescent fixtures. They generate minimal heat, lowering your cooling load, and have a lifespan of over 20 years, making them an excellent investment in energy stewardship.
          </p>
        )
      }
    ]
  },
  "flooring": {
    title: "Walk Uprightly: Premium Flooring Installations Built to Last",
    subtitle: "Selecting the Right Foundation for Mississippi Humidity",
    intro: "A firm, level floor is essential for the comfort and safety of your household. In our carpentry work, we take great care in preparing the subfloor before laying down any hardwood, luxury vinyl plank, or laminate. We believe that shortcuts are dishonest, which is why we sand down subfloor joists and secure loose boards to prevent squeaks, ensuring a solid foundation for your daily walk.",
    scriptureRef: "Proverbs 10:9",
    scriptureText: "Whoever walks in integrity walks securely, but he who makes his ways crooked will be found out.",
    sections: [
      {
        heading: "Is Luxury Vinyl Plank (LVP) better than hardwood for Mississippi homes?",
        content: (
          <p>
            In Mississippi&apos;s high humidity, <strong>Luxury Vinyl Plank (LVP)</strong> has become highly popular because it is <strong>100% waterproof and resists expansion and contraction</strong>. While solid hardwood offers unmatched natural beauty and can be refinished, LVP is much more durable for active households with pets, children, and wet areas like kitchens and bathrooms.
          </p>
        )
      },
      {
        heading: "How do you prevent floor squeaks and leveling issues before installation?",
        content: (
          <p>
            Floor squeaks are caused by timber subfloors rubbing against loose nails. Before laying new flooring, we <strong>screw down the plywood subfloor</strong> tightly to the joists and apply self-leveling underlayments to low spots. This prep work creates a perfectly flat, quiet walking surface.
          </p>
        )
      }
    ]
  },
  "tile-service": {
    title: "Crafting in Stone: Custom Tile & Backsplash Installations",
    subtitle: "Precision, Artistry, and Waterproof Protection",
    intro: "Stone and tile installations have been used since biblical times to build beautiful, lasting structures (1 Kings 6). Premium tile work requires high precision and artistic patience. We treat tile work as a fine art, aligning grout lines carefully and applying robust waterproof membranes to guarantee that your custom showers and backsplashes are as durable as they are beautiful.",
    scriptureRef: "Exodus 35:35",
    scriptureText: "He has filled them with skill to do every sort of work done by an engraver or by a designer or by an embroiderer in blue and purple and scarlet yarns and fine twined linen, or by a weaver—by any sort of workman or skilled designer.",
    sections: [
      {
        heading: "Why is specialized waterproofing critical beneath custom shower tiles?",
        content: (
          <p>
            Tile and grout are not waterproof; moisture passes through them over time. We install <strong>Schluter-Kerdi waterproof membranes</strong> or paint-on liquid membranes behind all shower tiles. This seals the drywall studs and subfloor from moisture, preventing rot, structural damage, and mold growth.
          </p>
        )
      },
      {
        heading: "What grout option should I choose for high-use kitchens and bathrooms?",
        content: (
          <p>
            We recommend <strong>epoxy or premium polymer grouts</strong> for high-use areas. Unlike standard cement grout, epoxy grout is non-porous, resists stains and mold, and never needs to be sealed, making kitchen backsplashes and bathroom floors much easier to clean.
          </p>
        )
      }
    ]
  },
  "sheetrock": {
    title: "Smooth Walls, Strong Structures: Sheetrock & Drywall Services",
    subtitle: "Hanging, Mudding, and Taping with Patient Care",
    intro: "Hanging and finishing sheetrock is a craft that requires patience and steady hands. Creating seamless transitions between sheets of drywall is essential for a beautiful paint finish. We take our time through multiple coats of mud and careful sanding, treating your walls with the care they deserve as we work to restore order and beauty to your home.",
    scriptureRef: "Proverbs 24:27",
    scriptureText: "Prepare your work outside; get everything ready for yourself in the field, and after that build your house.",
    sections: [
      {
        heading: "How do you repair a water-damaged ceiling drywall patch seamlessly?",
        content: (
          <p>
            To repair water damage, we cut out the soft sheetrock back to the centers of the ceiling joists. We inspect and seal any leaks, replace insulation, and screw in a new drywall sheet. We then apply <strong>fiberglass joint tape and three thin coats of joint compound</strong>, sanding between coats to blend the patch perfectly with the surrounding ceiling.
          </p>
        )
      },
      {
        heading: "What causes drywall joints to crack, and how do you prevent it?",
        content: (
          <p>
            Drywall cracks are caused by <strong>house settling, timber framing movement, or poor joint taping</strong>. We prevent cracks by using high-strength paper or mesh tape bedded in setting-type compound (&apos;hot mud&apos;) for the first coat, which forms a much stronger chemical bond than standard pre-mixed compounds.
          </p>
        )
      }
    ]
  },
  "insulation": {
    title: "Stewardship of Energy: Attic Insulation & Climate Control",
    subtitle: "Lowering Bills & Protecting Your Family from Mississippi Heat",
    intro: "Proper home insulation is a key aspect of wise financial stewardship. Mississippi summers put a massive load on air conditioning systems. By insulating your attic and sealing air leaks, we create a barrier that keeps your home cool, reduces energy waste, and lowers utility bills, honoring your resources and protecting God's creation.",
    scriptureRef: "Proverbs 21:20",
    scriptureText: "Precious treasure and oil are in a wise man's dwelling, but a foolish man devours it.",
    sections: [
      {
        heading: "What R-value and insulation type is best for Central Mississippi attics?",
        content: (
          <p>
            The Department of Energy recommends an <strong>R-38 to R-60 rating</strong> for attics in our climate zone. We install <strong>blown-in cellulose or fiberglass batts</strong> to achieve this level. Blown-in cellulose is highly effective because it fills small gaps around wiring and framing, creating a tighter seal.
          </p>
        )
      },
      {
        heading: "Can improper attic insulation cause mold and moisture problems?",
        content: (
          <p>
            Yes. If insulation covers your attic&apos;s <strong>soffit vents</strong>, it blocks airflow, trapping hot, humid air inside. We install baffle vents along the roof edges to keep insulation away from vents, ensuring proper ventilation and preventing condensation that leads to wood rot.
          </p>
        )
      }
    ]
  },
  "framing": {
    title: "Framing the Structure: Solid Timber Framing & Rafters",
    subtitle: "Building on a Strong Foundation of Quality Wood Carpentry",
    intro: "Structural framing is the skeleton of your home. It must be straight, plumb, and engineered to support heavy loads. Building with integrity means never using warped wood or weak connections. We select quality timber studs, double-check load paths, and secure headers properly, ensuring that your home is strong enough to withstand severe weather.",
    scriptureRef: "Matthew 7:24",
    scriptureText: "Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock.",
    sections: [
      {
        heading: "How can I tell if an interior wall is load-bearing before removing it?",
        content: (
          <p>
            Load-bearing walls typically run <strong>perpendicular to the floor joists or rafters</strong> above them, and they sit directly over support beams or foundation walls in the crawlspace/basement. We inspect your attic and crawlspace framing to trace load paths before any wall removal.
          </p>
        )
      },
      {
        heading: "What is structural sistering, and when is it used for damaged joists?",
        content: (
          <p>
            Structural sistering involves <strong>bolting a new timber beam directly alongside a damaged or sagging joist</strong>. We use this method to reinforce rotted floor joists or roof rafters, secure them with heavy-duty structural screws, and restore full load-bearing strength.
          </p>
        )
      }
    ]
  },
  "trim": {
    title: "Finishing Touches: Crown Molding, Fascia, & Detailed Trim",
    subtitle: "Refining Your Home's Character with Patient Finish Carpentry",
    intro: "In finish carpentry, details matter. Clean miter joints and smooth trim lines add character and visual order to a home. We approach finish work with patience and precision, ensuring that crown moldings, baseboards, and exterior fascia trim are installed tightly and securely to protect your home&apos;s seams and look beautiful.",
    scriptureRef: "1 Kings 6:35",
    scriptureText: "He carved cherubim and palm trees and open flowers, and he overlaid them with gold evenly applied on the carved work.",
    sections: [
      {
        heading: "What are the best materials for exterior fascia and soffit trim?",
        content: (
          <p>
            For exterior trim, we recommend <strong>rot-resistant PVC trim board or treated lumber wrapped in aluminum coils</strong>. These materials withstand Mississippi humidity and rain, preventing wood rot and eliminating the need for regular repainting.
          </p>
        )
      },
      {
        heading: "Why are my baseboards pulling away from the wall, and how do you fix it?",
        content: (
          <p>
            Baseboards pull away from walls due to <strong>drywall warping, house settling, or nails failing to grab studs</strong>. We fix this by identifying stud locations with sensors, securing the trim with long finish nails directly into the studs, and filling gaps with paintable caulk.
          </p>
        )
      }
    ]
  },
  "skylight-repair-and-replacement": {
    title: "Skylight Flashing & Leak Repair: Bringing in Safe Natural Light",
    subtitle: "Restoring Waterproof Security to Your Overhead Glass",
    intro: "Skylights are beautiful windows to the heavens, but they are highly vulnerable to leaking if their perimeter flashing fails. We inspect, seal, and replace skylights with high-quality units. We ensure that our flashing setups are robust and watertight, letting natural light in while keeping the rain out.",
    scriptureRef: "Proverbs 3:5",
    scriptureText: "Trust in the Lord with all your heart, and do not lean on your own understanding.",
    sections: [
      {
        heading: "Why do skylights leak, and can they be repaired without replacing the unit?",
        content: (
          <p>
            Most leaks are caused by <strong>decayed metal flashing or dried-out rubber sealants</strong> around the glass dome. If the skylight frame and glass are in good condition, we can repair the leak by installing new metal step flashing and sealing it with high-grade butyl caulking.
          </p>
        )
      },
      {
        heading: "What are the benefits of upgrading to energy-efficient glazed skylights?",
        content: (
          <p>
            Modern glazed skylights feature <strong>argon-filled double panes and Low-E coatings</strong>. This reduces solar heat transfer, keeping your home cooler in the summer, and blocks UV rays that fade carpet and furniture, making them an excellent choice for energy stewardship.
          </p>
        )
      }
    ]
  },
  "synthetic-shingles": {
    title: "Investing in Durability: Synthetic Composite Shingles",
    subtitle: "Advanced Materials for Lifetime Home Protection",
    intro: "Synthetic composite shingles are made of engineered polymers that replicate the natural beauty of slate or wood shakes. They offer exceptional durability and require minimal maintenance, making them a wise long-term investment in your home&apos;s protection and value.",
    scriptureRef: "Proverbs 24:3",
    scriptureText: "By wisdom a house is built, and by understanding it is established.",
    sections: [
      {
        heading: "What is the lifespan and wind rating of synthetic shingles?",
        content: (
          <p>
            Premium synthetic shingles carry a <strong>Class 4 impact rating</strong> (highest hail resistance) and wind-uplift ratings up to <strong>110–130 mph</strong>. They are backed by 50-year to lifetime manufacturer warranties, offering long-lasting security.
          </p>
        )
      },
      {
        heading: "How do synthetic composite shingles compare to traditional asphalt shingles?",
        content: (
          <p>
            Synthetic shingles cost more upfront than asphalt shingles but last twice as long, resist fading, and are much less likely to blow off during severe windstorms. They also provide a premium look that enhances your home&apos;s curb appeal.
          </p>
        )
      }
    ]
  },
  "synthetic-slate-roof-installation": {
    title: "The Luxury of Slate Without the Weight: Synthetic Slate Installation",
    subtitle: "Premium Estate Aesthetics with Advanced Structural Engineering",
    intro: "Natural slate roofs are stunning but heavy and brittle. Synthetic slate shingles replicate the chiseled look of real slate using lightweight, impact-resistant polymers. This allows you to achieve a classic estate appearance without reinforcing your home&apos;s wood framing.",
    scriptureRef: "Proverbs 3:21",
    scriptureText: "My son, do not lose sight of these—keep sound wisdom and discretion.",
    sections: [
      {
        heading: "Does synthetic slate require structural roof truss reinforcements?",
        content: (
          <p>
            No. Synthetic slate is <strong>four to five times lighter</strong> than natural slate. It can be installed on standard roof trusses without costly framing reinforcements, saving you money while providing the same premium look.
          </p>
        )
      },
      {
        heading: "How does synthetic slate hold up against extreme hail and wind?",
        content: (
          <p>
            Synthetic slate shingles are highly flexible and carry a <strong>Class 4 impact rating</strong>, meaning they will not crack or shatter under heavy hail. They are designed to interlock tightly, resisting wind uplift during storms.
          </p>
        )
      }
    ]
  },
  "synthetic-tile-roofing": {
    title: "Mediterranean Elegance: Synthetic Spanish Tile Roofing",
    subtitle: "Combining Timeless Aesthetics with Modern Storm Durability",
    intro: "Spanish clay tile roofs offer a warm, classic look but are fragile and heavy. Synthetic Spanish tiles replicate this Mediterranean aesthetic using durable polymer materials that resist cracking, wind damage, and moss growth.",
    scriptureRef: "Psalm 127:1",
    scriptureText: "Unless the Lord builds the house, those who build it labor in vain. Unless the Lord watches over the city, the watchman stays awake in vain.",
    sections: [
      {
        heading: "Will synthetic tile roofing crack under foot traffic or hail?",
        content: (
          <p>
            Unlike real clay tiles, which break easily when walked on or struck by hail, synthetic clay tiles are made of flexible, impact-resistant polymers. They carry a <strong>Class 4 impact rating</strong> and resist damage from foot traffic.
          </p>
        )
      },
      {
        heading: "Is synthetic tile roofing energy-efficient in hot climates?",
        content: (
          <p>
            Yes. The curved design of synthetic Spanish tiles creates an air gap beneath the shingles, allowing air to circulate. This vents solar heat away from your attic, lowering cooling load and AC bills.
          </p>
        )
      }
    ]
  },
  "synthetic-wood-roofing": {
    title: "Rustic Charm without the Rot: Synthetic Cedar Shake Roofing",
    subtitle: "The Warmth of Cedar Shakes with Class A Fire Protection",
    intro: "Natural cedar shakes look beautiful but are susceptible to mold, rot, insect damage, and fire. Synthetic wood shakes replicate the textured wood grain and warm tones of cedar while offering Class A fire ratings and polymer resistance to rot and weathering.",
    scriptureRef: "Proverbs 2:6",
    scriptureText: "For the Lord gives wisdom; from his mouth come knowledge and understanding.",
    sections: [
      {
        heading: "Do synthetic wood shakes require regular staining or sealing?",
        content: (
          <p>
            No. Natural cedar shakes require regular chemical treatments to prevent decay and moss. Synthetic wood shakes require <strong>zero maintenance, sealing, or staining</strong>, and they are UV-stabilized to resist color fading.
          </p>
        )
      },
      {
        heading: "Are synthetic wood shakes fire-resistant?",
        content: (
          <p>
            Yes. Most premium synthetic wood shakes carry a <strong>Class A fire rating</strong>, which is the highest level of fire resistance available for residential roofing, providing peace of mind for your family.
          </p>
        )
      }
    ]
  },
  "residential-roofing": {
    title: "A Guide to Residential Roofing: Protecting Your Home with Integrity",
    subtitle: "Stewardship of Your Family's Shield Against the Elements",
    intro: "A residential roof is more than just shingles and plywood; it is a shield that protects your family, your belongings, and the home God has provided for you. As a faith-first roofing contractor, we believe that roof installations should be done with the highest attention to detail, using premium GAF shingles, and working heartily as unto the Lord (Colossians 3:23). We treat your home as if it were our own, never cutting corners.",
    scriptureRef: "Psalm 91:1-2",
    scriptureText: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the Lord, 'My refuge and my fortress, my God, in whom I trust.'",
    sections: [
      {
        heading: "How can I tell if my residential roof needs repair or a full replacement?",
        content: (
          <p>
            Inspect your ceiling for water spots and look at your shingles from the ground. If you notice curling edges, bald spots (granule loss), or missing shingles, it is a sign of wear. A roof older than 15-20 years with widespread shingle decay typically requires replacement. For minor issues like localized leaks around pipe boots or a few blown-off shingles, a professional repair is often sufficient. We offer honest assessments to avoid unnecessary costs.
          </p>
        )
      },
      {
        heading: "What are the benefits of upgrading to GAF architectural shingles?",
        content: (
          <p>
            GAF Timberline HDZ architectural shingles are thicker and more wind-resistant than standard 3-tab shingles, featuring a multi-dimensional wood-shake look. They come with a Lifetime Limited Warranty and are designed to withstand winds up to 130 mph when installed with certified methods, making them an excellent investment in long-term shelter stewardship.
          </p>
        )
      }
    ]
  },
  "metal-roofing": {
    title: "Strength & Longevity: A Faith-Based Guide to Metal Roofing",
    subtitle: "Stewardship of Lifetime Durability and Energy Efficiency",
    intro: "Investing in a metal roof is a decision of long-term stewardship. Metal roofs are designed to last a lifetime, resisting severe winds, torrential rains, and solar heat. In our metal roof installations, we prioritize concealed-fastener standing seam panels to ensure maximum leak protection. We approach each installation with honesty and craftsmanship, ensuring your home is protected for generations.",
    scriptureRef: "Proverbs 24:3",
    scriptureText: "By wisdom a house is built, and by understanding it is established.",
    sections: [
      {
        heading: "What is the difference between standing seam and exposed fastener metal roofs?",
        content: (
          <p>
            Standing seam metal roofs feature concealed fasteners, meaning the screws are hidden beneath interlocking joints. This prevents water from contacting the screws and seals. Exposed fastener roofs require thousands of screws to be drilled directly through the panels, which require regular maintenance as rubber washers dry out. Standing seam is the gold standard for leak-free durability.
          </p>
        )
      },
      {
        heading: "How does a metal roof improve home energy efficiency in Mississippi?",
        content: (
          <p>
            Metal roofs feature highly reflective coatings that bounce solar heat away from your home rather than absorbing it like dark asphalt shingles. This keeps attics much cooler, reducing the workload on your AC system and saving you money on utility bills—a wise way to steward your monthly resources.
          </p>
        )
      }
    ]
  },
  "storm-damage": {
    title: "Restoring Safety After the Storm: Honest Claims & Quality Repairs",
    subtitle: "Navigating Roof Storm Damage Restoration with Integrity",
    intro: "Severe storms hit Mississippi without warning, leaving homeowners stressed and vulnerable. In the aftermath of wind or hail damage, it is crucial to act quickly to secure your home. We believe in providing honest, transparent damage assessments, helping you navigate your insurance claim truthfully without deceptive high-pressure sales, and restoring your home with premium, weather-resistant materials.",
    scriptureRef: "Proverbs 11:1",
    scriptureText: "A false balance is an abomination to the Lord, but a just weight is his delight.",
    sections: [
      {
        heading: "How do I successfully file an insurance claim for roof storm damage honestly?",
        content: (
          <p>
            First, get a professional roof inspection to document the storm damage with high-resolution photos and a detailed report. File your claim with your provider, supplying the inspection records. We meet with your insurance adjuster on-site to ensure all storm-related damage is accurately identified. Honesty is paramount; we provide truthful, itemized documentation to ensure your claim is processed fairly.
          </p>
        )
      },
      {
        heading: "How can I protect my home immediately after storm damage before repairs begin?",
        content: (
          <p>
            If you have active leaks or exposed decking from blown-off shingles, contact us immediately for emergency tarping. We secure heavy-duty tarps over the damaged areas to prevent water from entering your attic, protecting your ceiling and interior from mold and rot while your insurance claim is processed.
          </p>
        )
      }
    ]
  }
};
