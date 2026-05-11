'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTo = (id: string) => {
    setMenuOpen(false);
    const target = id === 'scene3'
      ? document.getElementById('s3intro')
      : document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav id="nav">
        <div className="nav-logo">SJ</div>
        <ul className="nav-links">
          <li><a href="#" onClick={e => { e.preventDefault(); navTo('hero'); }}>Work</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); navTo('scene3'); }}>Craft</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); navTo('s2intro'); }}>About</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); navTo('sceneFinal'); }}>Contact</a></li>
        </ul>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span className={menuOpen ? 'ham-open' : ''}></span>
          <span className={menuOpen ? 'ham-open' : ''}></span>
          <span className={menuOpen ? 'ham-open' : ''}></span>
        </button>
      </nav>
      {menuOpen && (
        <div className="nav-mobile-menu">
          <ul>
            <li><a href="#" onClick={e => { e.preventDefault(); navTo('hero'); }}>Work</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navTo('scene3'); }}>Craft</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navTo('s2intro'); }}>About</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navTo('sceneFinal'); }}>Contact</a></li>
          </ul>
        </div>
      )}
    </>
  );
}
