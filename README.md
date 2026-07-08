# MONO® — Future Essentials

An immersive luxury fashion experience — closer to a digital exhibition than a web store.
Built with Next.js (App Router), React Three Fiber, GSAP and Lenis.

## Experience

1. **Hero** — a procedurally built hoodie floats in a volumetric studio; the camera orbits slowly, fabric breathes via a GLSL vertex displacement, the pointer adds hand-held parallax.
2. **Scroll journey** — one 650vh scroll drives a cinematic camera path: approach → the garment deconstructs into its layers (hood, lining, torso, sleeves, pocket, zipper, stitching, drawcords) → the camera flies between the floating pieces → everything reassembles.
3. **Reveal** — floating feature labels (Premium Cotton, Heavyweight Fabric, Hand Finished, Oversized Fit, Breathable Material) stagger in around the finished piece.
4. **Collection** — twelve generated products with 3D-tilt cards, pointer sheen, magnetic buttons and line-art garment illustrations.
5. **Product pages** — fullscreen interactive viewer per product: rotate/zoom, live colour changes, animated material hotspots, worn ⇄ folded presentation.
6. **Story** — masked typographic manifesto with parallax plates and drifting gradients.
7. **Lookbook** — pinned horizontal editorial gallery with mouse-follow parallax and clip-path reveals.
8. **Footer** — oversized animated logotype.

## Stack

- **Next.js 15 / React 19 / TypeScript**
- **Three.js + React Three Fiber + Drei** — procedural garments, Lightformer studio environment, reflective floor, volumetric spotlight
- **@react-three/postprocessing** — bloom, depth of field, film grain, vignette
- **GSAP + ScrollTrigger** — every scroll-driven timeline
- **Lenis** — smooth scrolling, synced to GSAP's ticker
- **Framer Motion** — preloader, hero intro, product page choreography
- **TailwindCSS** — editorial design system (matte black / bone / warm gray / silver / beige)
- **GLSL** — fabric micro-movement (vertex displacement injected into PBR materials), particle sprites

## Performance

- Canvases are lazy-loaded (`next/dynamic`, no SSR)
- `PerformanceMonitor` lowers DPR and drops post-processing under load; `AdaptiveDpr` tunes resolution
- Procedural environment lighting — no HDR downloads; local `woff2` fonts — no runtime font requests
- Shared materials, allocation-free render-loop math, frustum culling left on

## Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```
