'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Cinematic manifesto: huge typography revealed through masks,
 * floating gradient plates drifting at different scroll speeds,
 * and a slowly moving ambient background.
 */
export default function Story() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // masked line-by-line reveal of the manifesto
      gsap.utils.toArray<HTMLElement>('.js-line').forEach((line) => {
        gsap.fromTo(
          line,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: { trigger: line.parentElement, start: 'top 85%' },
          }
        );
      });

      // floating plates with per-depth parallax
      gsap.utils.toArray<HTMLElement>('.js-plate').forEach((el) => {
        const depth = Number(el.dataset.depth ?? 1);
        gsap.fromTo(
          el,
          { yPercent: 24 * depth, rotate: depth * 1.5 },
          {
            yPercent: -24 * depth,
            rotate: -depth * 1.5,
            ease: 'none',
            scrollTrigger: {
              trigger: section.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      // clip-mask opening of the wide image band
      gsap.fromTo(
        '.js-band',
        { clipPath: 'inset(18% 32% 18% 32%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.js-band',
            start: 'top 90%',
            end: 'top 25%',
            scrub: true,
          },
        }
      );

      // background hue drifts with scroll
      gsap.to('.js-story-bg', {
        backgroundPosition: '80% 60%',
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} id="story" className="relative overflow-hidden py-40 md:py-64">
      {/* ambient moving gradient */}
      <div
        className="js-story-bg absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(90rem 60rem at 20% 30%, #17171a 0%, #0c0c0c 55%), radial-gradient(60rem 40rem at 80% 80%, #171512 0%, transparent 60%)',
          backgroundSize: '160% 160%',
          backgroundPosition: '20% 30%',
        }}
      />

      {/* floating plates */}
      <div
        className="js-plate animate-drift absolute left-[6%] top-[16%] h-52 w-40 rounded-sm bg-gradient-to-b from-[#2a2a2e] to-[#151517] opacity-70 md:h-72 md:w-56"
        data-depth="1.4"
      />
      <div
        className="js-plate animate-drift-slow absolute right-[8%] top-[34%] h-40 w-32 rounded-sm bg-gradient-to-b from-[#28251f] to-[#141311] opacity-60 md:h-60 md:w-44"
        data-depth="0.8"
      />
      <div
        className="js-plate animate-drift absolute bottom-[14%] left-[16%] h-32 w-48 rounded-sm bg-gradient-to-r from-[#202023] to-[#121214] opacity-50 md:h-44 md:w-64"
        data-depth="1.1"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <p className="mb-16 font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">
          The Studio — Manifesto
        </p>

        <h2 className="font-display text-[11.5vw] leading-[1.02] text-bone md:text-[7.5vw]">
          <span className="block overflow-hidden pb-1">
            <span className="js-line block">We don&apos;t design</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="js-line block">
              for seasons<span className="italic">.</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="js-line block text-warmgray">
              We design <span className="italic text-bone">for years.</span>
            </span>
          </span>
        </h2>

        <div className="mt-24 grid gap-12 md:mt-40 md:grid-cols-2">
          <p className="font-sans text-sm leading-loose text-silver md:max-w-sm">
            Every MONO garment begins as a question of weight. How heavy can cotton be before it
            stops moving? How light before it stops mattering? The answer is a small permanent
            collection — cut once, refined forever.
          </p>
          <p className="font-sans text-sm leading-loose text-warmgray md:mt-24 md:max-w-sm">
            No prints. No logos on the face. Nothing that expires. The garment is the statement, the
            fabric is the campaign.
          </p>
        </div>
      </div>

      {/* wide masked band */}
      <div className="js-band relative z-10 mx-auto mt-32 h-[50vh] max-w-[90rem] overflow-hidden rounded-sm md:mt-48 md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#26262b] via-[#1a1a1d] to-[#101012]" />
        <div className="animate-drift-slow absolute inset-0 bg-[radial-gradient(50rem_30rem_at_70%_30%,rgba(203,191,169,0.12),transparent_60%)]" />
        <div className="absolute inset-0 flex items-end justify-between p-8 md:p-14">
          <p className="font-display text-3xl italic text-bone/90 md:text-5xl">Weight is a language.</p>
          <p className="hidden font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray md:block">
            Porto Atelier — 2026
          </p>
        </div>
      </div>
    </section>
  );
}
