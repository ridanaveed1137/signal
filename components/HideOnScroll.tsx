"use client";
import { useEffect, useRef, useState } from "react";

// Wrap your site header with this. The header slides away when the reader
// scrolls down and slides back as soon as they scroll up.
//
// Uses position: fixed (not sticky), so it works regardless of parent
// overflow rules or positioning inside the header itself. A spacer the
// same height as the header keeps the page content from jumping up.
export default function HideOnScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(0);
  const ticking = useRef(false);
  const focused = useRef(false);

  // keep the spacer in sync with the real header height
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    last.current = window.scrollY;

    const update = () => {
      const y = Math.max(window.scrollY, 0);
      const diff = y - last.current;

      setScrolled(y > 8);

      if (y < 80 || focused.current) {
        setHidden(false);
        last.current = y;
      } else if (Math.abs(diff) > 4) {
        setHidden(diff > 0); // down = hide, up = show
        last.current = y;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* reserves the header's space in the page flow */}
      <div aria-hidden="true" style={{ height }} />

      <div
        ref={barRef}
        onFocusCapture={() => {
          focused.current = true;
          setHidden(false);
        }}
        onBlurCapture={() => {
          focused.current = false;
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          transition:
            "transform 300ms cubic-bezier(.2,.8,.2,1), background-color 300ms",
          backgroundColor: scrolled ? "rgba(20,17,14,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}