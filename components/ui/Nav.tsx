'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUI } from '@/lib/store';

const links = [
  { href: '/#collection', label: 'Collection' },
  { href: '/#story', label: 'Story' },
  { href: '/#lookbook', label: 'Lookbook' },
];

export default function Nav() {
  const loaded = useUI((s) => s.loaded);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={loaded ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="fixed inset-x-0 top-0 z-[90] mix-blend-difference"
    >
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 text-bone">
        <Link href="/" className="font-sans text-sm font-medium tracking-wider3 uppercase" data-cursor>
          MONO<sup className="text-[0.5rem]">®</sup>
        </Link>

        <ul className="hidden gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-line font-sans text-[0.7rem] tracking-wider2 uppercase">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button className="link-line font-sans text-[0.7rem] tracking-wider2 uppercase" data-cursor>
          Cart (0)
        </button>
      </nav>
    </motion.header>
  );
}
