'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { products } from '@/lib/products';
import ProductCard from './ProductCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Collection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // headline slides in as the section arrives
      gsap.fromTo(
        '.js-collection-title',
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: section.current, start: 'top 75%' },
        }
      );

      // cards rise in a staggered cascade
      gsap.utils.toArray<HTMLElement>('.js-card').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 90, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: (i % 3) * 0.12,
            scrollTrigger: { trigger: el, start: 'top 92%' },
          }
        );
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} id="collection" className="relative bg-ink px-6 py-32 md:px-12 md:py-44">
      <div className="mb-20 flex flex-col justify-between gap-6 md:mb-28 md:flex-row md:items-end">
        <h2 className="js-collection-title font-display text-6xl leading-none text-bone md:text-8xl">
          The <span className="italic">Collection</span>
        </h2>
        <p className="max-w-xs font-sans text-xs leading-relaxed text-warmgray">
          Twelve pieces, one study — weight, drape and restraint. Designed in the studio, finished by
          hand, released without season.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <div key={p.slug} className={`js-card ${i % 3 === 1 ? 'lg:mt-16' : ''}`}>
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
