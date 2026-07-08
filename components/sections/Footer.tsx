'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LETTERS = ['M', 'O', 'N', 'O', '®'];

export default function Footer() {
  const footer = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.js-logo-letter',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.07,
          ease: 'power4.out',
          scrollTrigger: { trigger: footer.current, start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.js-footer-meta',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: footer.current, start: 'top 70%' },
        }
      );
    },
    { scope: footer }
  );

  return (
    <footer ref={footer} className="relative overflow-hidden border-t border-bone/10 bg-ink px-6 pb-10 pt-24 md:px-12 md:pt-36">
      <div className="js-footer-meta grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Studio</p>
          <p className="mt-4 font-sans text-xs leading-relaxed text-silver">
            Rua das Flores 112
            <br />
            4050-262 Porto
            <br />
            Portugal
          </p>
        </div>
        <div>
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Navigate</p>
          <ul className="mt-4 space-y-2">
            {['Collection', 'Story', 'Lookbook'].map((l) => (
              <li key={l}>
                <a href={`/#${l.toLowerCase()}`} className="link-line font-sans text-xs text-silver">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Follow</p>
          <ul className="mt-4 space-y-2">
            {['Instagram', 'Are.na', 'Newsletter'].map((l) => (
              <li key={l}>
                <a href="#" className="link-line font-sans text-xs text-silver">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-[0.6rem] tracking-wider3 uppercase text-warmgray">Enquiries</p>
          <a href="mailto:studio@mono.example" className="link-line mt-4 inline-block font-sans text-xs text-silver">
            studio@mono.example
          </a>
        </div>
      </div>

      {/* animated logotype */}
      <div className="group mt-24 select-none md:mt-36" data-cursor>
        <h2 className="flex justify-between font-display text-[24vw] leading-[0.85] text-bone md:text-[21vw]">
          {LETTERS.map((ch, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="js-logo-letter block transition-transform duration-700 ease-luxe group-hover:-translate-y-[6%] group-hover:italic"
                style={{ transitionDelay: `${i * 45}ms` }}
              >
                {ch}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div className="js-footer-meta mt-14 flex flex-col justify-between gap-4 border-t border-bone/10 pt-6 md:flex-row">
        <p className="font-sans text-[0.6rem] tracking-wider2 uppercase text-warmgray">
          © 2026 MONO Studio — Future Essentials
        </p>
        <p className="font-sans text-[0.6rem] tracking-wider2 uppercase text-warmgray">
          Designed as an exhibition, worn as clothing.
        </p>
      </div>
    </footer>
  );
}
