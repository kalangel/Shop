'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Minimal two-part cursor: a solid dot that snaps to the pointer
 * and a lagging ring that expands over interactive elements.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      gsap.to(ring, {
        scale: target ? 2.2 : 1,
        opacity: target ? 0.9 : 0.5,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.to(dot, { scale: target ? 0.4 : 1, duration: 0.4, ease: 'power3.out' });
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] hidden md:block" aria-hidden>
      <div
        ref={ringRef}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-bone/60 opacity-50"
      />
      <div ref={dotRef} className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-bone" />
    </div>
  );
}
