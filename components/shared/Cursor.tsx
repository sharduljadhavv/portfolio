'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.matches('a,button,.p-tile.filled,.t-skill'))
        document.body.classList.add('cursor-grow');
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.matches('a,button,.p-tile.filled,.t-skill'))
        document.body.classList.remove('cursor-grow');
    };

    const lerp = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    lerp();

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <>
      <div id="cur-dot"  ref={dotRef}  />
      <div id="cur-ring" ref={ringRef} />
    </>
  );
}
