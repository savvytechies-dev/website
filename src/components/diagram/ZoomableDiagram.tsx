import { useCallback, useRef, useState } from "react";

/**
 * Wraps a diagram SVG with pinch-to-zoom + drag-to-pan (touch), ctrl/⌘-wheel or
 * trackpad-pinch zoom (desktop), double-tap/click to toggle, and always-present
 * +/−/reset controls. Architecture diagrams are wide (~1200px viewBox), so on a
 * phone they render small — this lets a reader zoom into any corner.
 *
 * Mobile scroll is preserved: at 1× the surface uses `touch-action: pan-y` so a
 * one-finger vertical swipe still scrolls the page; two-finger pinch is captured
 * for zoom. Once zoomed in, one-finger drag pans (touch-action switches to none).
 */
const MIN = 1;
const MAX = 5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function ZoomableDiagram({ children }: { children: React.ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Active pointers (for pinch) + gesture bookkeeping.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number; mx: number; my: number } | null>(null);
  const pan = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);

  const box = () => surface.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 1, 1);

  // Clamp translation so content always covers the viewport (no empty gutters).
  const clampT = useCallback((nx: number, ny: number, s: number) => {
    const b = box();
    return { x: clamp(nx, b.width * (1 - s), 0), y: clamp(ny, b.height * (1 - s), 0) };
  }, []);

  // Zoom about a point (px,py) relative to the surface.
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

  const reset = () => { setAnimate(true); setScale(1); setTx(0); setTy(0); };
  const step = (dir: number) => { const b = box(); zoomTo(scale * (dir > 0 ? 1.4 : 1 / 1.4), b.width / 2, b.height / 2, true); };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return; // don't hijack normal page scroll
    e.preventDefault();
    const b = box();
    zoomTo(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - b.left, e.clientY - b.top);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const b = box();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setAnimate(false);
    if (pointers.current.size === 2) {
      const [a, p] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - p.x, a.y - p.y),
        scale,
        mx: (a.x + p.x) / 2 - b.left,
        my: (a.y + p.y) / 2 - b.top,
      };
      pan.current = null;
    } else if (scale > 1) {
      pan.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
    // Double-tap / double-click toggles zoom.
    const now = e.timeStamp;
    if (now - lastTap.current < 300 && pointers.current.size === 1) {
      zoomTo(scale > 1 ? 1 : 2.4, e.clientX - b.left, e.clientY - b.top, true);
    }
    lastTap.current = now;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
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
    if (pointers.current.size === 0) pan.current = null;
  };

  const zoomed = scale > 1.01;
  const btn = "w-9 h-9 flex items-center justify-center rounded-lg bg-white/95 border border-slate-200 text-slate-600 text-lg leading-none shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition";

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ touchAction: zoomed ? "none" : "pan-y" }}>
      <div
        ref={surface}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: zoomed ? "grab" : "default" }}
      >
        <div
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: animate ? "transform 180ms ease-out" : "none",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 select-none">
        <button type="button" aria-label="Zoom in" className={btn} onClick={() => step(1)}>+</button>
        <button type="button" aria-label="Zoom out" className={btn} onClick={() => step(-1)}>−</button>
        <button type="button" aria-label="Reset zoom" className={btn} onClick={reset} style={{ fontSize: "14px" }}>⤢</button>
      </div>

      {/* Hint (only before first interaction / when reset) */}
      {!zoomed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 pointer-events-none">
          pinch or scroll-zoom · double-tap to zoom
        </div>
      )}
    </div>
  );
}
