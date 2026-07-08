'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice, type Product } from '@/lib/products';
import MagneticButton from '@/components/ui/MagneticButton';

const ProductViewer = dynamic(() => import('@/components/canvas/ProductViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0e0e0f]">
      <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Preparing the piece…</p>
    </div>
  ),
});

const easeLuxe = [0.16, 1, 0.3, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, ease: easeLuxe, delay },
});

export default function ProductPageClient({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [folded, setFolded] = useState(false);
  const [inspect, setInspect] = useState(true);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0e0e0f]">
      {/* viewer */}
      <div className="absolute inset-0">
        <ProductViewer product={product} colorHex={color.hex} folded={folded} showHotspots={inspect} />
      </div>

      {/* top bar */}
      <motion.div {...fade(0.1)} className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="link-line pointer-events-auto font-sans text-[0.65rem] tracking-wider2 uppercase text-bone" data-cursor>
          ← MONO®
        </Link>
        <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">
          {String(product.id).padStart(2, '0')} / 12 — {product.line}
        </p>
      </motion.div>

      {/* viewer modes */}
      <motion.div {...fade(0.5)} className="absolute bottom-8 left-6 z-20 flex gap-2 md:left-12">
        {(
          [
            ['Worn', false],
            ['Folded', true],
          ] as const
        ).map(([label, value]) => (
          <button
            key={label}
            onClick={() => setFolded(value)}
            data-cursor
            className={`rounded-full border px-5 py-2.5 font-sans text-[0.6rem] tracking-wider2 uppercase transition-colors duration-500 ${
              folded === value ? 'border-bone bg-bone text-ink' : 'border-bone/25 text-bone hover:border-bone/60'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setInspect((v) => !v)}
          data-cursor
          className={`rounded-full border px-5 py-2.5 font-sans text-[0.6rem] tracking-wider2 uppercase transition-colors duration-500 ${
            inspect ? 'border-bone/60 text-bone' : 'border-bone/25 text-warmgray hover:border-bone/60'
          }`}
        >
          Details {inspect ? 'On' : 'Off'}
        </button>
      </motion.div>

      <motion.p {...fade(0.7)} className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 font-sans text-[0.55rem] tracking-wider3 uppercase text-warmgray md:block">
        Drag to rotate — scroll to zoom
      </motion.p>

      {/* info panel */}
      <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-col justify-end p-6 md:w-[26rem] md:justify-center md:p-12">
        <motion.div {...fade(0.25)}>
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">MONO® — AW26</p>
          <h1 className="mt-3 font-display text-5xl text-bone md:text-6xl">
            {product.name.split(' ')[0]} <span className="italic">{product.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mt-2 font-sans text-lg text-silver">{formatPrice(product)}</p>
        </motion.div>

        <motion.p {...fade(0.4)} className="mt-6 max-w-sm font-sans text-xs leading-relaxed text-warmgray">
          {product.description}
        </motion.p>

        {/* colors */}
        <motion.div {...fade(0.5)} className="mt-8">
          <p className="font-sans text-[0.55rem] tracking-wider2 uppercase text-warmgray">
            Colour — <span className="text-silver">{color.name}</span>
          </p>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c)}
                data-cursor
                aria-label={c.name}
                className={`h-8 w-8 rounded-full border-2 transition-all duration-500 ${
                  color.name === c.name ? 'scale-110 border-bone' : 'border-bone/15 hover:border-bone/50'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </motion.div>

        {/* sizes */}
        <motion.div {...fade(0.6)} className="mt-8">
          <p className="font-sans text-[0.55rem] tracking-wider2 uppercase text-warmgray">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                data-cursor
                className={`min-w-[2.75rem] rounded-sm border px-3 py-2 font-sans text-[0.65rem] tracking-wider transition-colors duration-400 ${
                  size === s ? 'border-bone bg-bone text-ink' : 'border-bone/20 text-silver hover:border-bone/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* materials */}
        <motion.div {...fade(0.7)} className="mt-8 border-t border-bone/10 pt-5">
          <p className="font-sans text-[0.55rem] tracking-wider2 uppercase text-warmgray">Materials</p>
          <ul className="mt-3 space-y-1.5">
            {product.materials.map((m) => (
              <li key={m} className="font-sans text-[0.65rem] text-silver">
                — {m}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade(0.8)} className="mt-10">
          <MagneticButton className="w-full rounded-full border border-bone bg-bone py-4 font-sans text-[0.65rem] tracking-wider2 uppercase text-ink transition-colors duration-500 hover:bg-transparent hover:text-bone">
            Add to Cart — {formatPrice(product)}
          </MagneticButton>
        </motion.div>
      </div>
    </main>
  );
}
