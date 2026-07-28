export type Property = {
  slug: string;
  name: string;
  town: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  acres: number;
  built: string;
  card: string; // one line on cards
  story: string[]; // detail-page prose
  particulars: [string, string][];
  featured?: boolean;
};

export const properties: Property[] = [
  {
    slug: "thornfield-house",
    name: "Thornfield House",
    town: "Rhinebeck, NY",
    price: 4_850_000,
    beds: 5,
    baths: 4,
    sqft: 6214,
    acres: 14.2,
    built: "1897, renovated 2021",
    card: "A Federal-era house that has been kept, not flipped — fourteen acres, a pond, and original chestnut floors.",
    story: [
      "Thornfield has had four owners in a hundred and twenty years, and it shows in the best way. The chestnut floors have never been sanded thin. The 2021 renovation put in new systems, a kitchen worth cooking in, and glass where the north porch used to be — and stopped there.",
      "The land is the second argument. Fourteen acres running back from Mill Road: a spring-fed pond, a stand of sugar maples that gets tapped every March by the neighbor (an arrangement you can keep or end), and a barn with power and water. Rhinebeck village is six minutes by car; the Amtrak station at Rhinecliff, twelve.",
    ],
    particulars: [
      ["Taxes (2025)", "$38,400"],
      ["Heat", "Geothermal, 2021"],
      ["Water", "Drilled well + spring pond"],
      ["Outbuildings", "Barn, 2,400 sqft, power and water"],
      ["School district", "Rhinebeck CSD"],
      ["To Rhinecliff Amtrak", "12 min"],
    ],
    featured: true,
  },
  {
    slug: "the-glasswing",
    name: "The Glasswing",
    town: "Cold Spring, NY",
    price: 2_975_000,
    beds: 4,
    baths: 3,
    sqft: 3480,
    acres: 6.8,
    built: "2019",
    card: "A glass pavilion set in a birch stand, built by an architect for himself — which is why the details hold up.",
    story: [
      "Architects build differently when it's their own money. The Glasswing is one continuous room folded around a courtyard: white oak, blackened steel, and glass walls that put the birch stand in every sightline. The bedrooms close off; nothing else does.",
      "It sits high on the ridge above Cold Spring, so the light lasts an hour longer than in the village. Radiant floors, a standing-seam roof sized for solar, and a guest wing that has its own entrance and has never once been listed on Airbnb. Metro-North to Grand Central is 70 minutes.",
    ],
    particulars: [
      ["Taxes (2025)", "$29,100"],
      ["Heat", "Radiant, air-source heat pump"],
      ["Construction", "Steel frame, triple-glazed"],
      ["Guest wing", "1 bed, 1 bath, own entrance"],
      ["School district", "Haldane CSD"],
      ["To Cold Spring Metro-North", "8 min"],
    ],
    featured: true,
  },
  {
    slug: "beacon-hollow",
    name: "Beacon Hollow",
    town: "Beacon, NY",
    price: 1_395_000,
    beds: 3,
    baths: 2,
    sqft: 2150,
    acres: 0.4,
    built: "1926",
    card: "A Craftsman four blocks from Main Street with its woodwork intact and a garden that took forty years to grow.",
    story: [
      "Beacon Hollow is the house people mean when they say they want 'an old house done right.' The 1926 woodwork — built-ins, wainscoting, a staircase you'd pay to replicate — was never painted over. The kitchen and both baths were redone in 2022 in a way that argues with none of it.",
      "The garden is the part you can't buy elsewhere: forty years of one owner's attention, peonies to asters, April to October. Four blocks flat walk to Main Street's galleries and the farmers market, ten minutes on foot to the Metro-North platform.",
    ],
    particulars: [
      ["Taxes (2025)", "$14,700"],
      ["Heat", "Gas steam, serviced 2024"],
      ["Roof", "Slate, original, inspected 2023"],
      ["Garage", "Detached, 1 car + workshop"],
      ["School district", "Beacon CSD"],
      ["To Beacon Metro-North", "10 min walk"],
    ],
  },
  {
    slug: "larch-and-stone",
    name: "Larch & Stone",
    town: "Stone Ridge, NY",
    price: 2_240_000,
    beds: 4,
    baths: 3,
    sqft: 3900,
    acres: 11,
    built: "1784, addition 2016",
    card: "A Revolutionary-era stone house with a modern larch addition — two centuries in one roofline, done with restraint.",
    story: [
      "The original 1784 section is local bluestone, two feet thick, cool all summer. The 2016 addition is larch and glass and has the decency to stand slightly apart, connected by a glazed passage — old and new in conversation, neither imitating the other.",
      "Eleven acres of meadow and sugar bush along the Peters Kill, with a swimming hole that the sellers ask you not to put on Instagram. High Falls and its restaurants are seven minutes; the Mohonk trailheads, fifteen. The stone barn holds two cars and a century of good tools, negotiable.",
    ],
    particulars: [
      ["Taxes (2025)", "$21,300"],
      ["Heat", "Heat pump + wood stoves (2)"],
      ["Water", "Drilled well, 2016"],
      ["Frontage", "Peters Kill, approx. 900 ft"],
      ["School district", "Rondout Valley CSD"],
      ["To New Paltz", "20 min"],
    ],
  },
  {
    slug: "quarry-edge-house",
    name: "Quarry Edge House",
    town: "Hudson, NY",
    price: 1_875_000,
    beds: 3,
    baths: 3,
    sqft: 2760,
    acres: 2.3,
    built: "2015",
    card: "A modern house cantilevered over a flooded bluestone quarry — the swimming pool is sixty feet deep and a century old.",
    story: [
      "The quarry stopped working in 1919 and filled with spring water; the house arrived in 2015 and had the sense to hang over the edge rather than crowd it. Concrete, cedar, and a forty-foot wall of glass facing the water. You swim from the deck. In January you skate.",
      "Inside is deliberately simple — three bedrooms, a long open room aimed at the quarry, and a study that could be a fourth bedroom if it weren't such a good study. Warren Street's restaurants and the Amtrak station are eight minutes down the hill.",
    ],
    particulars: [
      ["Taxes (2025)", "$19,800"],
      ["Heat", "Radiant concrete, propane"],
      ["Quarry", "Approx. 60 ft deep, spring-fed"],
      ["Structure", "Engineered cantilever, inspected 2024"],
      ["School district", "Hudson CSD"],
      ["To Hudson Amtrak", "8 min"],
    ],
  },
  {
    slug: "the-meridian",
    name: "The Meridian",
    town: "Millbrook, NY",
    price: 6_400_000,
    beds: 6,
    baths: 7,
    sqft: 8900,
    acres: 40,
    built: "2008",
    card: "Forty acres of Millbrook hunt country: main house, guest cottage, pool, and a six-stall stable with turnout.",
    story: [
      "The Meridian was built in 2008 by owners who had done it twice before and knew exactly what they were correcting: ceilings a foot higher, hallways a foot wider, a kitchen placed so the morning sun lands on the table and not in your eyes. Shingle-style outside, unexpectedly calm inside.",
      "The forty acres are fenced and cross-fenced — six-stall stable, four paddocks, a sand ring, and hacking access to the Millbrook trail system. The guest cottage (two beds, full kitchen) keeps visitors close but not underfoot. The pool sits behind the garden wall, invisible from every window that matters.",
    ],
    particulars: [
      ["Taxes (2025)", "$61,200"],
      ["Heat", "Geothermal, 6 zones"],
      ["Stable", "6 stalls, wash bay, tack room"],
      ["Guest cottage", "2 bed, 1,400 sqft"],
      ["Land", "Fenced, 4 paddocks, sand ring"],
      ["School district", "Millbrook CSD"],
    ],
    featured: true,
  },
];

export const sold: { address: string; town: string; closed: string; note: string }[] = [
  { address: "The Ferry House", town: "Tivoli", closed: "May 2026", note: "6% over ask, 8 days" },
  { address: "Split Rock Farm", town: "Accord", closed: "March 2026", note: "Full ask, 11 days" },
  { address: "44 Livingston St", town: "Kingston", closed: "January 2026", note: "9% over ask, 6 days" },
  { address: "The Beekman Arms Cottage", town: "Rhinebeck", closed: "November 2025", note: "Off-market sale" },
  { address: "Hollow Road Farmhouse", town: "Clinton Corners", closed: "September 2025", note: "Full ask, 14 days" },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const bySlug = (slug: string) => properties.find((p) => p.slug === slug);
