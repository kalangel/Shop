'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { experienceProgress, useUI } from '@/lib/store';

import heroFront from '@/public/images/hero-front.png';
import heroBack from '@/public/images/hero-back.png';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ExperienceCanvas = dynamic(() => import('@/components/canvas/ExperienceCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-ink" />,
});

const FEATURES = [
  { n: '01', title: 'Premium Cotton', pos: 'left-[8%] top-[30%] md:left-[12%]' },
  { n: '02', title: 'Heavyweight Fabric', pos: 'right-[8%] top-[24%] md:right-[13%]' },
  { n: '03', title: 'Hand Finished', pos: 'left-[10%] bottom-[30%] md:left-[16%]' },
  { n: '04', title: 'Oversized Fit', pos: 'right-[9%] bottom-[24%] md:right-[15%]' },
  { n: '05', title: 'Breathable Material', pos: 'left-1/2 bottom-[12%] -translate-x-1/2' },
];

const introEase = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  const container = useRef<HTMLDivElement>(null);
  const loaded = useUI((s) => s.loaded);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            experienceProgress.value = self.progress;
          },
        },
      });

      tl.to('.js-hero', { opacity: 0, y: -70, duration: 0.11 }, 0.02);
      // the campaign shots part to hand the stage to the 3D piece
      tl.to('.js-hero-front', { yPercent: -12, scale: 1.06, duration: 0.11 }, 0.02);
      tl.to('.js-hero-back', { yPercent: 16, xPercent: -10, duration: 0.11 }, 0.02);

      // pointer parallax over the hero photography
      const fx = gsap.quickTo('.js-hero-front', 'x', { duration: 0.9, ease: 'power3.out' });
      const fy = gsap.quickTo('.js-hero-front', 'y', { duration: 0.9, ease: 'power3.out' });
      const bx = gsap.quickTo('.js-hero-back', 'x', { duration: 1.3, ease: 'power3.out' });
      const by = gsap.quickTo('.js-hero-back', 'y', { duration: 1.3, ease: 'power3.out' });
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        fx(nx * -26);
        fy(ny * -18);
        bx(nx * 40);
        by(ny * 26);
      };
      window.addEventListener('mousemove', onMove, { passive: true });

      // 01 — approach
      tl.fromTo('.js-approach', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05 }, 0.17);
      tl.to('.js-approach', { opacity: 0, y: -40, duration: 0.05 }, 0.29);

      // 02 — deconstruction
      tl.fromTo('.js-explode', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.06 }, 0.38);
      tl.to('.js-explode', { opacity: 0, scale: 1.04, duration: 0.06 }, 0.55);

      // 03 — reveal headline + floating feature labels
      tl.fromTo('.js-reveal-head', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.07 }, 0.73);
      gsap.utils.toArray<HTMLElement>('.js-feature').forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.05, ease: 'power3.out' },
          0.76 + i * 0.028
        );
        tl.fromTo(
          el.querySelector('.js-feature-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.05, ease: 'power3.out' },
          0.765 + i * 0.028
        );
      });

      return () => window.removeEventListener('mousemove', onMove);
    },
    { scope: container }
  );

  return (
    <div ref={container} className="relative h-[650vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ExperienceCanvas />

        {/* ---------- hero ---------- */}
        <div className="js-hero pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          {/* campaign photography — the piece itself, floating */}
          <div className="absolute left-[4%] top-[16%] hidden w-[24vw] max-w-xs md:block lg:left-[12%]">
            <motion.div
              initial={{ opacity: 0, scale: 1.08, rotate: -12 }}
              animate={loaded ? { opacity: 1, scale: 1, rotate: -8 } : {}}
              transition={{ duration: 1.8, ease: introEase, delay: 0.9 }}
            >
              <div className="js-hero-back will-change-transform">
                <div className="animate-drift-slow">
                  <Image
                    src={heroBack}
                    alt="Tee 003 — acid wash, back"
                    priority
                    sizes="24vw"
                    className="h-auto w-full opacity-80 grayscale-[0.2] [filter:drop-shadow(0_40px_50px_rgba(0,0,0,0.6))]"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute left-1/2 top-1/2 w-[78vw] max-w-md -translate-x-1/2 -translate-y-[54%] md:w-[34vw]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1, y: 40 }}
              animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1.8, ease: introEase, delay: 0.6 }}
            >
              <div className="js-hero-front will-change-transform">
                <div className="animate-drift">
                  <Image
                    src={heroFront}
                    alt="Tee 003 — acid wash"
                    priority
                    sizes="(max-width: 768px) 78vw, 34vw"
                    className="h-auto w-full [filter:drop-shadow(0_60px_70px_rgba(0,0,0,0.75))]"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, ease: introEase, delay: 0.2 }}
            className="relative z-20 mb-6 font-sans text-[0.65rem] tracking-wider3 uppercase text-warmgray"
          >
            MONO® — AW26
          </motion.p>
          <h1 className="relative z-20 text-center font-display text-[16vw] leading-[0.9] text-bone md:text-[11vw]">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={loaded ? { y: 0 } : {}}
                transition={{ duration: 1.5, ease: introEase, delay: 0.35 }}
              >
                Future
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block italic"
                initial={{ y: '110%' }}
                animate={loaded ? { y: 0 } : {}}
                transition={{ duration: 1.5, ease: introEase, delay: 0.5 }}
              >
                Essentials
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: introEase, delay: 1 }}
            className="relative z-20 mt-8 font-sans text-xs tracking-wider2 text-silver"
          >
            Minimal clothing designed for everyday.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 1.6 }}
            className="absolute bottom-10 z-20 flex flex-col items-center gap-3"
          >
            <span className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Scroll</span>
            <span className="block h-10 w-px animate-pulse bg-warmgray/60" />
          </motion.div>
        </div>

        {/* ---------- 01 approach ---------- */}
        <div className="js-approach pointer-events-none absolute left-6 top-1/2 z-10 max-w-xs -translate-y-1/2 opacity-0 md:left-16">
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">01 — Construction</p>
          <p className="mt-4 font-display text-3xl leading-tight text-bone md:text-4xl">
            Every seam <span className="italic">considered.</span>
          </p>
          <p className="mt-4 font-sans text-xs leading-relaxed text-warmgray">
            480 gsm loop-back cotton, knitted on vintage looms and garment-dyed for depth.
          </p>
        </div>

        {/* ---------- 02 deconstruction ---------- */}
        <div className="js-explode pointer-events-none absolute inset-x-0 top-[12%] z-10 text-center opacity-0">
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">02 — Anatomy</p>
          <p className="mt-3 font-display text-5xl text-bone md:text-7xl">
            Deconstructed<span className="italic">.</span>
          </p>
          <p className="mt-3 font-sans text-xs tracking-wider2 text-silver">Seven layers. One garment.</p>
        </div>

        {/* ---------- 03 reveal ---------- */}
        <div className="js-reveal-head pointer-events-none absolute inset-x-0 top-[9%] z-10 text-center opacity-0">
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">03 — The Piece</p>
          <p className="mt-3 font-display text-5xl text-bone md:text-7xl">
            Hoodie <span className="italic">001</span>
          </p>
        </div>

        {FEATURES.map((f) => (
          <div key={f.n} className={`js-feature pointer-events-none absolute z-10 opacity-0 ${f.pos}`}>
            <div className="flex items-center gap-3">
              <span className="js-feature-line block h-px w-10 origin-left bg-bone/50" />
              <span className="font-sans text-[0.55rem] tracking-wider2 text-warmgray">{f.n}</span>
            </div>
            <p className="mt-2 font-sans text-xs tracking-wider2 uppercase text-bone">{f.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
