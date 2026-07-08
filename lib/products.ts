export type GarmentCategory =
  | 'hoodie'
  | 'zip-hoodie'
  | 'tshirt'
  | 'crewneck'
  | 'pants'
  | 'shorts'
  | 'jacket'
  | 'cap'
  | 'tote';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Hotspot {
  /** normalized position on the 3D model */
  position: [number, number, number];
  title: string;
  note: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  line: string;
  price: number;
  currency: string;
  description: string;
  detail: string;
  category: GarmentCategory;
  colors: ProductColor[];
  sizes: string[];
  materials: string[];
  hotspots: Hotspot[];
}

const MATTE_BLACK = { name: 'Matte Black', hex: '#1b1b1e' };
const BONE = { name: 'Bone', hex: '#e6e1d6' };
const WARM_GRAY = { name: 'Warm Gray', hex: '#8f8880' };
const SILVER = { name: 'Silver', hex: '#b9b9bd' };
const BEIGE = { name: 'Beige', hex: '#cbbfa9' };
const CLAY = { name: 'Clay', hex: '#9a4d2c' };

export const products: Product[] = [
  {
    id: 1,
    slug: 'hoodie-001',
    name: 'Hoodie 001',
    line: 'Oversized Hoodie',
    price: 240,
    currency: 'EUR',
    description: 'The silhouette that started the studio. Dropped shoulders, double-layered hood, brushed interior.',
    detail:
      'Cut from 480 gsm loop-back cotton and garment-dyed for depth. The 001 falls away from the body with an intentional, architectural drape. Finished by hand in our Porto atelier.',
    category: 'hoodie',
    colors: [MATTE_BLACK, BONE, WARM_GRAY],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['100% organic cotton, 480 gsm', 'Brushed loop-back interior', 'Corozo drawcord tips'],
    hotspots: [
      { position: [0, 1.05, 0.45], title: 'Double Hood', note: 'Self-lined, stands on its own' },
      { position: [0, -0.55, 0.62], title: 'Kangaroo Pocket', note: 'Bar-tacked, hidden stitch' },
      { position: [1.05, 0.2, 0.25], title: 'Drop Shoulder', note: 'Set 6cm past the seam' },
    ],
  },
  {
    id: 2,
    slug: 'hoodie-002',
    name: 'Hoodie 002',
    line: 'Heavyweight Hoodie',
    price: 260,
    currency: 'EUR',
    description: 'Our densest knit. 540 gsm cotton that holds its shape like outerwear.',
    detail:
      'Knitted on vintage looms for a closed, structured face. The 002 is intentionally rigid at first wear and breaks in over years, not weeks. Tonal embroidery at the hem.',
    category: 'hoodie',
    colors: [WARM_GRAY, MATTE_BLACK, BEIGE],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% ring-spun cotton, 540 gsm', 'Loom-knitted body', 'Flatlock seams'],
    hotspots: [
      { position: [0, 0.3, 0.6], title: 'Dense Face', note: '540 gsm closed knit' },
      { position: [0, -1.0, 0.4], title: 'Tonal Mark', note: 'Embroidered, not printed' },
      { position: [-1.05, 0.2, 0.25], title: 'Reinforced Cuff', note: 'Double-turned rib' },
    ],
  },
  {
    id: 3,
    slug: 'tee-001',
    name: 'Tee 001',
    line: 'Basic T-Shirt',
    price: 85,
    currency: 'EUR',
    description: 'A considered basic. Mid-weight jersey with a clean, collar-forward neckline.',
    detail:
      'The everyday tee reduced to what matters: a collar that never twists, a body that never clings. Enzyme-washed for immediate softness.',
    category: 'tshirt',
    colors: [BONE, MATTE_BLACK, SILVER],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['100% combed cotton, 220 gsm', 'Enzyme-washed', 'Ribbed collar, self-fabric'],
    hotspots: [
      { position: [0, 0.85, 0.35], title: 'Set Collar', note: 'Cut on the bias' },
      { position: [0, -0.2, 0.55], title: 'Mid-weight Jersey', note: '220 gsm, opaque' },
    ],
  },
  {
    id: 4,
    slug: 'tee-002',
    name: 'Tee 002',
    line: 'Oversized T-Shirt',
    price: 95,
    currency: 'EUR',
    description: 'A boxier cut with extended shoulders and a wide, open hem.',
    detail:
      'Drafted with a square torso and dropped sleeve for volume without weight. The 002 layers under everything in the collection.',
    category: 'tshirt',
    colors: [MATTE_BLACK, BONE, BEIGE],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% combed cotton, 260 gsm', 'Boxy block pattern', 'Open hem'],
    hotspots: [
      { position: [0.9, 0.5, 0.3], title: 'Extended Shoulder', note: 'Square drafted' },
      { position: [0, -0.9, 0.4], title: 'Open Hem', note: 'Uncuffed, raw drape' },
    ],
  },
  {
    id: 5,
    slug: 'cargo-001',
    name: 'Cargo 001',
    line: 'Cargo Pants',
    price: 210,
    currency: 'EUR',
    description: 'Utility without noise. Six pockets set flush into a straight, fluid leg.',
    detail:
      'Cotton twill with two-way stretch. Every pocket is welt-set so the silhouette stays clean when empty and structured when carried.',
    category: 'pants',
    colors: [WARM_GRAY, MATTE_BLACK, BEIGE],
    sizes: ['28', '30', '32', '34', '36'],
    materials: ['97% cotton, 3% elastane twill', 'Welt-set cargo pockets', 'Adjustable hem tab'],
    hotspots: [
      { position: [0.55, -0.1, 0.35], title: 'Welt Pocket', note: 'Flush when empty' },
      { position: [0.35, -1.3, 0.25], title: 'Hem Tab', note: 'Two-position snap' },
    ],
  },
  {
    id: 6,
    slug: 'sweat-001',
    name: 'Sweatpant 001',
    line: 'Sweatpants',
    price: 160,
    currency: 'EUR',
    description: 'A tailored take on the sweatpant. Pin-tucked front crease, tapered ankle.',
    detail:
      'The same 480 gsm loop-back as Hoodie 001, cut with a permanent front crease. Reads as trousers at three meters, feels like sleep at zero.',
    category: 'pants',
    colors: [MATTE_BLACK, WARM_GRAY, BONE],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['100% organic cotton, 480 gsm', 'Pin-tucked crease', 'Hidden zip pocket'],
    hotspots: [
      { position: [0.35, 0.0, 0.4], title: 'Front Crease', note: 'Heat-set, permanent' },
      { position: [0.5, -1.35, 0.2], title: 'Tapered Ankle', note: 'Ribbed, low profile' },
    ],
  },
  {
    id: 7,
    slug: 'hoodie-003',
    name: 'Zip Hoodie 003',
    line: 'Zip Hoodie',
    price: 270,
    currency: 'EUR',
    description: 'A full-zip layer with a bonded placket and matte hardware.',
    detail:
      'The zip disappears into a bonded placket, so the face reads unbroken. Custom matte-lacquered hardware, double garage at the chin.',
    category: 'zip-hoodie',
    colors: [MATTE_BLACK, WARM_GRAY, SILVER],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% organic cotton, 480 gsm', 'Bonded zip placket', 'Matte lacquered hardware'],
    hotspots: [
      { position: [0, 0.3, 0.62], title: 'Hidden Placket', note: 'Zip reads as a seam' },
      { position: [0, 0.85, 0.5], title: 'Chin Garage', note: 'Doubled, brushed' },
    ],
  },
  {
    id: 8,
    slug: 'crew-001',
    name: 'Crewneck 001',
    line: 'Crewneck',
    price: 180,
    currency: 'EUR',
    description: 'The quiet one. Raglan sleeves, deep ribbed collar, nothing else.',
    detail:
      'A raglan construction removes the shoulder seam entirely — the 001 crewneck drapes as one continuous plane from collar to cuff.',
    category: 'crewneck',
    colors: [BONE, MATTE_BLACK, BEIGE, CLAY],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['100% organic cotton, 440 gsm', 'Raglan construction', 'Deep rib collar'],
    hotspots: [
      { position: [0.6, 0.7, 0.3], title: 'Raglan Seam', note: 'No shoulder break' },
      { position: [0, 0.85, 0.4], title: 'Deep Rib', note: '5cm collar, recovery knit' },
    ],
  },
  {
    id: 9,
    slug: 'shorts-001',
    name: 'Short 001',
    line: 'Shorts',
    price: 120,
    currency: 'EUR',
    description: 'An above-knee short in the studio 480 gsm knit. Heavy fabric, light cut.',
    detail:
      'Cut wide and short so heavyweight fabric can move. Interior drawcord, welt back pocket, no branding on the face.',
    category: 'shorts',
    colors: [WARM_GRAY, MATTE_BLACK, BEIGE],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['100% organic cotton, 480 gsm', 'Interior drawcord', 'Welt back pocket'],
    hotspots: [
      { position: [0.4, -0.3, 0.35], title: 'Wide Leg', note: 'Cut for movement' },
      { position: [0, 0.35, 0.4], title: 'Clean Waist', note: 'Drawcord hidden inside' },
    ],
  },
  {
    id: 10,
    slug: 'jacket-001',
    name: 'Jacket 001',
    line: 'Jacket',
    price: 390,
    currency: 'EUR',
    description: 'A padded shell with a collapsed collar and storm placket. The outer argument.',
    detail:
      'Matte nylon shell over a recycled fill, quilted on the interior only so the face stays uninterrupted. Two-way front zip behind a storm placket.',
    category: 'jacket',
    colors: [MATTE_BLACK, SILVER, BEIGE],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['Matte recycled nylon shell', '120 g recycled fill', 'Interior-only quilting'],
    hotspots: [
      { position: [0, 0.85, 0.4], title: 'Collapsed Collar', note: 'Wears open or standing' },
      { position: [0, 0.1, 0.62], title: 'Storm Placket', note: 'Two-way zip beneath' },
    ],
  },
  {
    id: 11,
    slug: 'cap-001',
    name: 'Cap 001',
    line: 'Cap',
    price: 60,
    currency: 'EUR',
    description: 'A six-panel cap in washed cotton with a soft, unstructured crown.',
    detail:
      'Pre-washed so it arrives broken-in. Matte metal slider, tonal eyelets, brim curved by hand.',
    category: 'cap',
    colors: [MATTE_BLACK, BONE, CLAY],
    sizes: ['OS'],
    materials: ['100% washed cotton twill', 'Matte metal slider', 'Hand-curved brim'],
    hotspots: [
      { position: [0, 0.4, 0.3], title: 'Soft Crown', note: 'Unstructured, six panel' },
      { position: [0, 0.0, 0.85], title: 'Curved Brim', note: 'Shaped by hand' },
    ],
  },
  {
    id: 12,
    slug: 'tote-001',
    name: 'Tote 001',
    line: 'Tote Bag',
    price: 70,
    currency: 'EUR',
    description: 'A deep canvas tote with an interior sleeve and hidden magnet closure.',
    detail:
      '18 oz canvas that stands upright on its own. Handles are long enough for the shoulder, short enough for the hand.',
    category: 'tote',
    colors: [BONE, MATTE_BLACK, BEIGE],
    sizes: ['OS'],
    materials: ['18 oz cotton canvas', 'Interior laptop sleeve', 'Hidden magnet closure'],
    hotspots: [
      { position: [0, 0.7, 0.2], title: 'Long Handles', note: 'Shoulder or hand' },
      { position: [0, 0.0, 0.35], title: 'Standing Canvas', note: 'Holds its own shape' },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(p: Product): string {
  return `€${p.price}`;
}
