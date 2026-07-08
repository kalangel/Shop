'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import gsap from 'gsap';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

/**
 * Wraps its children in a magnetic field — the element leans toward
 * the pointer and settles back with an elastic release.
 */
export default function MagneticButton({ children, className = '', strength = 0.35, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: 'power3.out' });
    gsap.to(inner.current, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.5, ease: 'power3.out' });
  };

  const onLeave = () => {
    gsap.to([ref.current, inner.current], {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.35)',
    });
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
      data-cursor
    >
      <span ref={inner} className="inline-block">
        {children}
      </span>
    </button>
  );
}
