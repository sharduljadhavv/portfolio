'use client';
import { useEffect } from 'react';

export default function Navbar() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTo = (id: string) => {
    const target = id === 'scene3'
      ? document.getElementById('s3intro')
      : document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav id="nav">
      <div className="nav-logo">SJ</div>
      <ul className="nav-links">
        <li><a href="#" onClick={e => { e.preventDefault(); navTo('hero'); }}>Work</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); navTo('scene3'); }}>Craft</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); navTo('s2intro'); }}>About</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); navTo('sceneFinal'); }}>Contact</a></li>
      </ul>
    </nav>
  );
}
