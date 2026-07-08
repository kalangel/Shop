'use client';

import { useRef, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GarmentArt from './GarmentArt';
import type { GarmentCategory } from '@/lib/products';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Frame {
  n: string;
  title: string;
  sub: string;
  category: GarmentCategory;
  bg: string;
  ink: string;
}

const FRAMES: Frame[] = [
  { n: '01', title: 'Stillness', sub: 'Hoodie 001 — Matte Black', category: 'hoodie', bg: 'from-[#232327] to-[#111113]', ink: 'text-fog/90' },
  { n: '02', title: 'Volume', sub: 'Tee 002 — Bone', category: 'tshirt', bg: 'from-[#dcd6c9] to-[#b9b09d]', ink: 'text-ink/80' },
  { n: '03', title: 'Utility', sub: 'Cargo 001 — Warm Gray', category: 'pants', bg: 'from-[#3a3733] to-[#1c1a18]', ink: 'text-fog/90' },
  { n: '04', title: 'Structure', sub: 'Jacket 001 — Silver', category: 'jacket', bg: 'from-[#9fa1a6] to-[#5f6166]', ink: 'text-ink/80' },
  { n: '05', title: 'Ritual', sub: 'Crewneck 001 — Beige', category: 'crewneck', bg: 'from-[#2a2620] to-[#131110]', ink: 'text-fog/90' },
];

/**
 * Horizontal editorial gallery: the section pins while the track
 * scrolls sideways; each frame answers the pointer with parallax.
 */
export default function Lookbook() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current!;
      const getDistance = () => el.scrollWidth - window.innerWidth;

      gsap.to(el, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // frames unmask as they enter from the right
      gsap.utils.toArray<HTMLElement>('.js-frame-inner').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(6% 14% 6% 14%)', scale: 1.08 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: frame,
              containerAnimation: gsap.getTweensOf(el)[0],
              start: 'left 85%',
            },
          }
        );
      });
    },
    { scope: section }
  );

  const onMove = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('.js-frame') as HTMLElement | null;
    if (!target) return;
    const r = target.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(target.querySelector('.js-frame-art'), {
      x: nx * 26,
      y: ny * 26,
      duration: 0.8,
      ease: 'power3.out',
    });
    gsap.to(target.querySelector('.js-frame-caption'), {
      x: nx * -14,
      y: ny * -10,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  return (
    <section ref={section} id="lookbook" className="relative overflow-hidden bg-ink">
      <div className="absolute left-6 top-10 z-10 md:left-12">
        <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Lookbook — AW26</p>
      </div>

      <div ref={track} onMouseMove={onMove} className="flex h-screen w-max items-center gap-[6vw] px-[8vw]">
        <div className="w-[60vw] shrink-0 md:w-[34vw]">
          <h2 className="font-display text-[13vw] leading-[0.95] text-bone md:text-[7vw]">
            Worn, <span className="block italic text-warmgray">not shown.</span>
          </h2>
          <p className="mt-8 max-w-xs font-sans text-xs leading-relaxed text-warmgray">
            Five studies in fabric and light, photographed as objects — the way the pieces exist
            before anyone puts them on.
          </p>
        </div>

        {FRAMES.map((f) => (
          <figure key={f.n} className="js-frame group relative w-[74vw] shrink-0 md:w-[40vw]" data-cursor>
            <div
              className={`js-frame-inner relative aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-br ${f.bg} md:aspect-[4/5]`}
            >
              <div className="animate-drift-slow absolute inset-0 bg-[radial-gradient(40rem_28rem_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
              <div className="js-frame-art absolute inset-0 flex items-center justify-center will-change-transform">
                <GarmentArt category={f.category} className={`h-1/2 w-1/2 ${f.ink} transition-transform duration-700 group-hover:scale-105`} />
              </div>
              <span className={`absolute right-5 top-5 font-sans text-[0.6rem] tracking-wider2 ${f.ink}`}>
                {f.n} / 05
              </span>
            </div>
            <figcaption className="js-frame-caption mt-5 flex items-baseline justify-between will-change-transform">
              <p className="font-display text-3xl italic text-bone md:text-4xl">{f.title}</p>
              <p className="font-sans text-[0.6rem] tracking-wider2 uppercase text-warmgray">{f.sub}</p>
            </figcaption>
          </figure>
        ))}

        <div className="flex w-[40vw] shrink-0 items-center justify-center md:w-[24vw]">
          <p className="font-display text-4xl italic text-warmgray">Fin.</p>
        </div>
      </div>
    </section>
  );
}
