'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '@/lib/store';

/**
 * Opening curtain: a counter climbs to 100 while the wordmark
 * settles, then the whole panel lifts away and unlocks the hero.
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const setLoaded = useUI((s) => s.setLoaded);

  useEffect(() => {
    let value = 0;
    const tick = () => {
      value += Math.max(1, Math.round((100 - value) * 0.06));
      if (value >= 100) {
        setCount(100);
        setTimeout(() => setDone(true), 350);
        setTimeout(() => setLoaded(true), 900);
        return;
      }
      setCount(value);
      timer = window.setTimeout(tick, 28);
    };
    let timer = window.setTimeout(tick, 200);
    return () => window.clearTimeout(timer);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl text-bone md:text-6xl"
          >
            MONO<sup className="text-lg align-super">®</sup>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 font-sans text-[0.65rem] tracking-wider3 uppercase text-warmgray"
          >
            Future Essentials
          </motion.p>
          <p className="absolute bottom-10 right-10 font-sans text-sm tabular-nums text-warmgray">
            {String(count).padStart(3, '0')}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
