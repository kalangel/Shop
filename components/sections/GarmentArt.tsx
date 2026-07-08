import type { GarmentCategory } from '@/lib/products';

/**
 * Hand-drawn line art for each garment category — a single-stroke
 * editorial illustration instead of stock photography.
 */
export default function GarmentArt({
  category,
  className = '',
}: {
  category: GarmentCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ART[category]}
    </svg>
  );
}

const ART: Record<GarmentCategory, React.ReactNode> = {
  hoodie: (
    <>
      <path d="M70 62 C70 34 130 34 130 62 L128 74 C120 66 80 66 72 74 Z" />
      <path d="M72 74 C80 66 120 66 128 74 L146 86 L166 156 L142 166 L134 128" />
      <path d="M72 74 L54 86 L34 156 L58 166 L66 128" />
      <path d="M66 128 L64 196 L136 196 L134 128" />
      <path d="M80 72 C86 92 114 92 120 72" />
      <path d="M94 92 L92 116 M106 92 L108 118" />
      <rect x="78" y="152" width="44" height="30" rx="8" />
      <path d="M64 188 L136 188" strokeDasharray="3 4" />
    </>
  ),
  'zip-hoodie': (
    <>
      <path d="M70 62 C70 34 130 34 130 62 L128 74 C120 66 80 66 72 74 Z" />
      <path d="M72 74 C80 66 120 66 128 74 L146 86 L166 156 L142 166 L134 128" />
      <path d="M72 74 L54 86 L34 156 L58 166 L66 128" />
      <path d="M66 128 L64 196 L136 196 L134 128" />
      <path d="M100 78 L100 196" />
      <path d="M96 78 L96 196 M104 78 L104 196" strokeDasharray="2 3" />
      <circle cx="100" cy="110" r="4" />
      <path d="M100 114 L100 124" />
    </>
  ),
  tshirt: (
    <>
      <path d="M78 48 C88 58 112 58 122 48 L150 60 L162 96 L136 106 L132 88" />
      <path d="M78 48 L50 60 L38 96 L64 106 L68 88" />
      <path d="M68 88 L66 192 L134 192 L132 88" />
      <path d="M84 50 C90 62 110 62 116 50" />
      <path d="M66 184 L134 184" strokeDasharray="3 4" />
    </>
  ),
  crewneck: (
    <>
      <path d="M78 50 C88 60 112 60 122 50 L152 64 L164 118 L140 126 L134 96" />
      <path d="M78 50 L48 64 L36 118 L60 126 L66 96" />
      <path d="M66 96 L64 190 L136 190 L134 96" />
      <path d="M82 52 C90 64 110 64 118 52" />
      <path d="M84 54 C91 64 109 64 116 54" strokeDasharray="2 3" />
      <path d="M64 180 L136 180" strokeDasharray="3 4" />
      <path d="M60 118 L66 122 M140 118 L134 122" />
    </>
  ),
  pants: (
    <>
      <path d="M66 34 L134 34 L138 58 L62 58 Z" />
      <path d="M62 58 L54 196 L88 196 L98 92 L102 92 L112 196 L146 196 L138 58" />
      <path d="M66 44 L134 44" strokeDasharray="3 4" />
      <rect x="64" y="106" width="22" height="26" rx="4" />
      <rect x="116" y="106" width="22" height="26" rx="4" />
      <path d="M100 58 L100 84" />
    </>
  ),
  shorts: (
    <>
      <path d="M62 44 L138 44 L142 66 L58 66 Z" />
      <path d="M58 66 L50 140 L94 140 L99 92 L101 92 L106 140 L150 140 L142 66" />
      <path d="M62 54 L138 54" strokeDasharray="3 4" />
      <path d="M100 66 L100 88" />
      <path d="M52 130 L94 130 M106 130 L148 130" strokeDasharray="3 4" />
    </>
  ),
  jacket: (
    <>
      <path d="M80 44 L100 56 L120 44 L152 60 L164 130 L140 138 L134 100" />
      <path d="M80 44 L48 60 L36 130 L60 138 L66 100" />
      <path d="M66 100 L64 192 L136 192 L134 100" />
      <path d="M80 44 L92 66 L100 56 L108 66 L120 44" />
      <path d="M100 66 L100 192" />
      <path d="M70 122 L92 122 M108 122 L130 122" strokeDasharray="3 4" />
      <path d="M64 182 L136 182" strokeDasharray="3 4" />
    </>
  ),
  cap: (
    <>
      <path d="M52 118 C52 74 148 74 148 118 Z" />
      <path d="M100 76 L100 84" />
      <path d="M76 82 C72 96 70 106 70 118 M124 82 C128 96 130 106 130 118" strokeDasharray="2 4" />
      <path d="M48 118 L152 118 C170 118 176 128 172 134 C150 126 66 124 48 130 Z" />
      <circle cx="100" cy="74" r="3" />
    </>
  ),
  tote: (
    <>
      <path d="M58 88 L142 88 L150 196 L50 196 Z" />
      <path d="M74 88 C74 48 126 48 126 88" />
      <path d="M58 100 L142 100" strokeDasharray="3 4" />
      <path d="M84 132 L116 132" />
      <path d="M92 140 L108 140" strokeDasharray="2 3" />
    </>
  ),
};
