'use client';

import { useRef, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { formatPrice, type Product } from '@/lib/products';
import GarmentArt from './GarmentArt';
import MagneticButton from '@/components/ui/MagneticButton';

const TONES = [
  'from-[#1c1c1f] via-[#232327] to-[#141416]',
  'from-[#201f1d] via-[#2a2823] to-[#161513]',
  'from-[#1d1e21] via-[#26282c] to-[#131417]',
];

/**
 * A gallery plinth rather than a shop tile: 3D tilt following the
 * pointer, a slow zoom on the artwork, and a magnetic call-to-action.
 */
export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const card = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onMove = (e: MouseEvent) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;

    gsap.to(el, {
      rotateY: nx * 10,
      rotateX: -ny * 10,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.to(art.current, { x: nx * -14, y: ny * -14, scale: 1.08, duration: 0.7, ease: 'power3.out' });
    gsap.to(sheen.current, {
      opacity: 0.14,
      x: nx * 120,
      y: ny * 120,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  const onLeave = () => {
    gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });
    gsap.to(art.current, { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.out' });
    gsap.to(sheen.current, { opacity: 0, duration: 0.6 });
  };

  const open = () => router.push(`/product/${product.slug}`);

  return (
    <div
      ref={card}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={open}
      className="group relative will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      data-cursor
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-br ${TONES[index % TONES.length]} shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-shadow duration-700 group-hover:shadow-[0_45px_90px_-25px_rgba(0,0,0,0.85)]`}
      >
        {/* pointer sheen */}
        <div
          ref={sheen}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,242,238,0.5),transparent_60%)] opacity-0"
        />

        <span className="absolute left-4 top-4 font-sans text-[0.55rem] tracking-wider2 text-warmgray">
          {String(product.id).padStart(2, '0')} / {product.line.toUpperCase()}
        </span>

        <div ref={art} className="absolute inset-0 flex items-center justify-center will-change-transform">
          <GarmentArt category={product.category} className="h-3/5 w-3/5 text-fog/85" />
        </div>

        {/* swatches */}
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              className="h-2.5 w-2.5 rounded-full border border-bone/20"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
          <MagneticButton className="rounded-full border border-bone/30 bg-ink/40 px-5 py-2.5 font-sans text-[0.6rem] tracking-wider2 uppercase text-bone backdrop-blur-sm">
            View
          </MagneticButton>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-xl text-bone">{product.name}</h3>
          <p className="mt-0.5 font-sans text-[0.6rem] tracking-wider2 uppercase text-warmgray">
            {product.line}
          </p>
        </div>
        <p className="font-sans text-sm text-silver">{formatPrice(product)}</p>
      </div>
    </div>
  );
}
