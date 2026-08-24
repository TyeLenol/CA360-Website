export function PhotoPlaceholder({ label = 'PHOTO', tone = 'teal', style, children, className = '' }) {
  const palettes = {
    teal:   ['#7aa3b4', '#36728f'],
    deep:   ['#1f4a5e', '#0a1f29'],
    orange: ['#e6b16a', '#d68307'],
    warm:   ['#e8a07d', '#c66b3b'],
    cream:  ['#efe2c5', '#d4b88a'],
    soft:   ['#c6e0e8', '#7aa3b4'],
  };
  const p = palettes[tone] || palettes.teal;
  return (
    <div
      className={'ph ' + className}
      data-label={label}
      style={{
        ...style,
        background: `linear-gradient(135deg, ${p[0]} 0%, ${p[1]} 100%)`,
      }}
    >
      {children}
    </div>
  );
}

/*
 * A non-photographic identity mark for people across the site.
 * It is intentionally abstract rather than a cartoon face: the shape,
 * halo, and small line details vary by seed while staying recognisably CA360.
 */
export function Portrait({ bg = 'transparent', tone = '#d68307', accent = '#f9e7c8', seed = 1, style }) {
  const variant = Math.abs(seed) % 3;
  const tilt = ((seed * 13) % 7) - 3;
  const haloRotation = variant === 0 ? -8 : variant === 1 ? 5 : 12;
  const corePath = variant === 0
    ? 'M72 49 Q100 22 128 49 L121 116 Q100 134 79 116 Z'
    : variant === 1
      ? 'M67 59 Q100 25 133 59 L119 121 Q100 133 81 121 Z'
      : 'M76 42 Q100 25 124 42 L132 106 Q112 134 88 124 Q68 106 76 42 Z';
  const shoulderPath = variant === 1
    ? 'M20 200 Q34 151 76 144 L100 169 L124 144 Q166 151 180 200 Z'
    : 'M18 200 Q34 148 78 143 L100 166 L122 143 Q166 148 182 200 Z';

  return (
    <svg
      viewBox="0 0 200 200"
      style={style}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.22" transform={`rotate(${haloRotation} 100 100)`}>
        <circle cx="100" cy="100" r="76" fill="none" stroke={accent} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="61" fill={tone} />
        <path d="M24 100 H176 M100 24 V176" stroke={accent} strokeWidth="1" />
      </g>
      <path d={shoulderPath} fill={tone} transform={`rotate(${tilt} 100 174)`} />
      <path d={corePath} fill={accent} />
      <path d="M100 29 V53" stroke={tone} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      <path d="M82 73 H118 M86 87 H114 M91 101 H109" stroke={tone} strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <circle cx={variant === 2 ? 118 : 82} cy="119" r="5" fill={tone} opacity="0.9" />
      <path d="M47 169 Q100 190 153 169" fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
