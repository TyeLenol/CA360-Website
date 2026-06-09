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

export function Portrait({ bg = 'transparent', tone = '#d68307', accent = '#f9e7c8', seed = 1, style }) {
  const tilt = ((seed * 13) % 7) - 3;
  const earring = seed % 3 === 0;
  const collar = seed % 2 === 0 ? 'crew' : 'vneck';
  const hair = ['bob', 'fro', 'wrap', 'short'][seed % 4];
  const glasses = seed % 5 === 0;
  return (
    <svg viewBox="0 0 200 200" style={style} preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         width="100%" height="100%">
      <rect width="200" height="200" fill={bg} />
      <circle cx="100" cy="92" r="68" fill={accent} opacity="0.18" />
      {/* shoulders */}
      <path d={collar === 'crew'
        ? "M20 200 C 40 150, 70 145, 100 145 C 130 145, 160 150, 180 200 Z"
        : "M20 200 C 40 150, 75 150, 100 175 C 125 150, 160 150, 180 200 Z"}
        fill={tone} transform={`rotate(${tilt} 100 175)`} />
      {/* neck */}
      <rect x="88" y="118" width="24" height="32" rx="10" fill="#e8c7a0" />
      {/* head */}
      <ellipse cx="100" cy="92" rx="40" ry="46" fill="#e8c7a0" />
      {/* hair */}
      {hair === 'fro' && <>
        <circle cx="100" cy="60" r="44" fill="#2b1810" />
        <ellipse cx="100" cy="92" rx="40" ry="46" fill="#e8c7a0" />
      </>}
      {hair === 'bob' && <path d="M60 70 Q100 30 140 70 L142 110 Q140 95 130 92 L130 80 Q100 60 70 80 L70 92 Q60 95 58 110 Z" fill="#2b1810" />}
      {hair === 'wrap' && <path d="M58 88 Q60 50 100 48 Q140 50 142 88 L142 80 Q140 60 100 60 Q60 60 58 80 Z" fill="#d68307" />}
      {hair === 'short' && <path d="M60 85 Q70 50 100 50 Q130 50 140 85 L138 88 Q120 75 100 75 Q80 75 62 88 Z" fill="#2b1810" />}
      {/* eyes / brow / smile */}
      {glasses && <>
        <circle cx="86" cy="92" r="9" fill="none" stroke="#0a1f29" strokeWidth="2" />
        <circle cx="114" cy="92" r="9" fill="none" stroke="#0a1f29" strokeWidth="2" />
        <line x1="95" y1="92" x2="105" y2="92" stroke="#0a1f29" strokeWidth="2" />
      </>}
      <circle cx="86" cy="92" r="2.4" fill="#0a1f29" />
      <circle cx="114" cy="92" r="2.4" fill="#0a1f29" />
      <path d="M92 110 Q100 116 108 110" stroke="#0a1f29" strokeWidth="2" strokeLinecap="round" fill="none" />
      {earring && <circle cx="138" cy="100" r="3" fill={tone} />}
    </svg>
  );
}
