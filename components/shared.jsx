/* ============================================================
   SHARED — Hooks, portraits, icons, photo placeholders, logo.
   ============================================================ */

const { useState, useEffect, useRef, useCallback, useMemo, Fragment } = React;

/* ===== HOOKS ===== */

// Triggers `is-in` class on elements with [data-reveal] when in view.
// Single global IntersectionObserver, runs once per element.
// Also watches the DOM for newly-mounted [data-reveal] nodes so React
// sections that mount later (carousels, conditional panels) still reveal.
function useGlobalRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    const observed = new WeakSet();
    const observe = (el) => {
      if (!observed.has(el)) { observed.add(el); io.observe(el); }
    };

    // Initial pass: observe everything currently in the DOM.
    document.querySelectorAll('[data-reveal]').forEach(observe);

    // Belt-and-braces: anything above the fold gets is-in immediately,
    // so first paint always shows the hero / above-the-fold content even
    // if IO is slow to deliver its first batch (background tabs, slow devices).
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        el.classList.add('is-in');
      }
    });

    // Catch nodes added later by React state changes / late mounts.
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.hasAttribute && node.hasAttribute('data-reveal')) observe(node);
          node.querySelectorAll && node.querySelectorAll('[data-reveal]').forEach(observe);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}

// In-view boolean for a single ref
function useInView(ref, { threshold = 0.2, rootMargin = '0px', once = true } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold, rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

// 0..1 progress through an element's full vertical extent
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) { setP(0); return; }
        const scrolled = -r.top;
        const prog = Math.max(0, Math.min(1, scrolled / total));
        setP(prog);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

// Generic count-up tween when in view
function useCountUp(target, inView, { duration = 1600 } = {}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const tick = (t) => {
      if (start == null) start = t;
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);
  return n;
}

/* ===== ICONS ===== */
function ArrowRight({ color = 'currentColor', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke={color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowLeft({ color = 'currentColor', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 12H4m0 0l6 6m-6-6l6-6" stroke={color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDown({ color = 'currentColor', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke={color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon({ color = '#d68307', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke={color} strokeWidth="2"/>
      <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
function Star({ color = 'currentColor', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.5 7H22l-6 4.5L18 22l-6-4.5L6 22l2-8.5L2 9h7.5L12 2z" />
    </svg>
  );
}
function PlusIcon({ color = 'currentColor', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MinusIcon({ color = 'currentColor', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ===== LOGO PLACEHOLDER (user has the real one) ===== */
function LogoMark({ color = '#0a1f29', accent = '#d68307', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="2.5" />
      <path d="M20 6 a14 14 0 0 1 0 28" fill="none" stroke={accent}
            strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="4" fill={accent} />
    </svg>
  );
}

/* ===== PHOTO PLACEHOLDER ===== */
function PhotoPlaceholder({ label = 'PHOTO', tone = 'teal', style, children, className = '' }) {
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

/* ===== STYLISED PORTRAIT (clearly a placeholder, not AI face) ===== */
function Portrait({ bg = 'transparent', tone = '#d68307', accent = '#f9e7c8', seed = 1, style }) {
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

/* ===== UTIL: NumberPlus (e.g. "300+" with orange + serif italic) ===== */
function NumberPlus({ value, plus = true, plusColor = '#d68307' }) {
  return <Fragment>{value}{plus && <span style={{ color: plusColor, fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400 }}>+</span>}</Fragment>;
}

Object.assign(window, {
  useGlobalRevealObserver, useInView, useScrollProgress, useCountUp,
  ArrowRight, ArrowLeft, ArrowDown, PinIcon, Star, PlusIcon, MinusIcon,
  LogoMark, PhotoPlaceholder, Portrait, NumberPlus,
});
