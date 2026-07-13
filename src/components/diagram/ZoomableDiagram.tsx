import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Wraps a diagram SVG with:
 *  - inline: click/tap to enlarge (opens fullscreen), plus two-finger pinch on
 *    touch. One-finger vertical swipe still scrolls the page (touch-action pan-y).
 *  - fullscreen: free pan + zoom — pinch, wheel/trackpad, drag, double-tap,
 *    and +/−/reset controls. Close with ✕, Esc, or a backdrop click.
 *
 * Architecture diagrams are wide (~1200px), so on any screen this lets a reader
 * open one and inspect any corner.
 */
const MIN = 1;
const MAX = 6;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function ZoomableDiagram({ children }: { children: React.ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [full, setFull] = useState(false);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number; mx: number; my: number } | null>(null);
  const pan = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const gesture = useRef<{ x: number; y: number; t: number; moved: boolean; pinched: boolean } | null>(null);
  const lastTap = useRef(0);

  const box = () => surface.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 1, 1);

  const clampT = useCallback((nx: number, ny: number, s: number) => {
    const b = box();
    return { x: clamp(nx, b.width * (1 - s), 0), y: clamp(ny, b.height * (1 - s), 0) };
  }, []);

  const reset = useCallback(() => {
    setAnimate(true);
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const zoomTo = useCallback((nextScale: number, px: number, py: number, smooth = false) => {
    setScale((s) => {
      const ns = clamp(nextScale, MIN, MAX);
      setTx((ptx) => {
        const nx = px - (px - ptx) * (ns / s);
        setTy((pty) => clampT(nx, py - (py - pty) * (ns / s), ns).y);
        return clampT(nx, 0, ns).x;
      });
      return ns;
    });
    setAnimate(smooth);
  }, [clampT]);

  const enterFull = useCallback(() => { reset(); setFull(true); }, [reset]);
  const exitFull = useCallback(() => { setFull(false); reset(); }, [reset]);

  // Fullscreen: lock body scroll + Esc to close.
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') exitFull(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [full, exitFull]);

  const step = (dir: number) => { const b = box(); zoomTo(scale * (dir > 0 ? 1.4 : 1 / 1.4), b.width / 2, b.height / 2, true); };

  const onWheel = (e: React.WheelEvent) => {
    // Inline: only zoom on ctrl/⌘ so normal page scroll isn't hijacked.
    // Fullscreen: any wheel zooms (there's nothing else to scroll).
    if (!full && !e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const b = box();
    zoomTo(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - b.left, e.clientY - b.top);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const b = box();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setAnimate(false);
    if (pointers.current.size === 1) {
      gesture.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, moved: false, pinched: false };
    }
    if (pointers.current.size === 2) {
      const [a, p] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - p.x, a.y - p.y),
        scale,
        mx: (a.x + p.x) / 2 - b.left,
        my: (a.y + p.y) / 2 - b.top,
      };
      pan.current = null;
      if (gesture.current) gesture.current.pinched = true;
    } else if (full && scale > 1) {
      pan.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
    // Double-tap zoom (fullscreen only).
    if (full && e.timeStamp - lastTap.current < 300 && pointers.current.size === 1) {
      zoomTo(scale > 1 ? 1 : 2.6, e.clientX - b.left, e.clientY - b.top, true);
    }
    lastTap.current = e.timeStamp;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gesture.current && Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) > 6) {
      gesture.current.moved = true;
    }
    if (pinch.current && pointers.current.size >= 2) {
      const [a, p] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - p.x, a.y - p.y);
      zoomTo(pinch.current.scale * (dist / pinch.current.dist), pinch.current.mx, pinch.current.my);
    } else if (pan.current) {
      const c = clampT(pan.current.tx + (e.clientX - pan.current.x), pan.current.ty + (e.clientY - pan.current.y), scale);
      setTx(c.x); setTy(c.y);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      pan.current = null;
      const g = gesture.current;
      gesture.current = null;
      // A clean tap on the inline diagram → enlarge.
      if (!full && g && !g.moved && !g.pinched && e.timeStamp - g.t < 400) {
        enterFull();
      }
    }
  };

  const transform = (
    <div
      style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: '0 0',
        transition: animate ? 'transform 180ms ease-out' : 'none',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );

  const btn =
    'w-9 h-9 flex items-center justify-center rounded-lg bg-white/95 border border-slate-200 text-slate-600 text-lg leading-none shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition';

  // Fullscreen overlay (position:fixed escapes any parent overflow — no portal needed).
  if (full) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6"
        onClick={exitFull}
      >
        <div
          className="relative w-[96vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={surface}
            className="w-full h-full flex items-center justify-center"
            style={{ touchAction: 'none', cursor: scale > 1.01 ? 'grab' : 'default' }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {transform}
          </div>
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 select-none">
            <button type="button" aria-label="Close" className={btn} onClick={exitFull}>✕</button>
            <button type="button" aria-label="Zoom in" className={btn} onClick={() => step(1)}>+</button>
            <button type="button" aria-label="Zoom out" className={btn} onClick={() => step(-1)}>−</button>
            <button type="button" aria-label="Reset zoom" className={btn} style={{ fontSize: '14px' }} onClick={reset}>⤢</button>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 pointer-events-none">
            drag to pan · pinch or scroll to zoom · Esc to close
          </div>
        </div>
      </div>
    );
  }

  // Inline: click/tap to enlarge; two-finger pinch on touch.
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ touchAction: 'pan-y' }}>
      <div
        ref={surface}
        style={{ cursor: 'zoom-in' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {transform}
      </div>
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 pointer-events-none select-none">
        <span className="text-[11px] font-medium text-slate-500 bg-white/90 border border-slate-200 rounded-full px-2.5 py-1 shadow-sm">
          ⤢ Click to enlarge
        </span>
      </div>
    </div>
  );
}
