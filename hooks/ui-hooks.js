"use client";

import { useEffect, useState } from 'react';

// Triggers `is-in` class on elements with [data-reveal] when in view.
export function useGlobalRevealObserver() {
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

    document.querySelectorAll('[data-reveal]').forEach(observe);

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        el.classList.add('is-in');
      }
    });

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
export function useInView(ref, { threshold = 0.2, rootMargin = '0px', once = true } = {}) {
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
export function useScrollProgress(ref) {
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

export function useCountUp(target, inView, { duration = 1600 } = {}) {
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
