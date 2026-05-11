'use client';
import { useEffect, useRef } from 'react';

// ── helpers ──────────────────────────────────────────────
function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function typeWriter(el: HTMLElement, text: string, speed: number): Promise<void> {
  return new Promise(res => {
    let i = 0; el.textContent = '';
    const id = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(id); res(); }
    }, speed);
  });
}

function buildLetterSpans(el: HTMLElement, text: string) {
  el.innerHTML = '';
  [...text].forEach(ch => {
    if (ch === ' ') { el.appendChild(document.createTextNode('\u00a0')); return; }
    const w = document.createElement('span'); w.className = 'lw';
    const c = document.createElement('span'); c.className = 'lc'; c.textContent = ch;
    w.appendChild(c); el.appendChild(w);
  });
}

const BCOLS = ['#60a5fa','#22d3ee','#818cf8','#a78bfa','#38bdf8','#67e8f9'];
let activeLetter: HTMLElement | null = null;
let liveDigits: any[] = [];

function scatter(wrap: HTMLElement, gsap: any) {
  if (wrap === activeLetter) return;
  if (activeLetter) reassemble(activeLetter, liveDigits.splice(0), gsap);
  activeLetter = wrap; liveDigits = [];
  const ch = wrap.querySelector('.lc') as HTMLElement;
  const r = ch.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  gsap.killTweensOf(ch);
  gsap.to(ch, { opacity: 0, scale: 0.4, duration: 0.14, ease: 'power2.in' });
  for (let i = 0; i < 35; i++) {
    const d: any = document.createElement('span'); d.className = 'bd';
    d.textContent = Math.random() > .5 ? '1' : '0';
    const sz = Math.round(rnd(10, 22)), col = BCOLS[Math.floor(Math.random() * BCOLS.length)];
    d.style.fontSize = sz + 'px'; d.style.color = col;
    d.style.left = cx + 'px'; d.style.top = cy + 'px';
    d.style.opacity = '0'; d.style.display = 'block';
    document.body.appendChild(d); liveDigits.push(d);
    const angle = rnd(0, Math.PI * 2), dist = rnd(60, 130);
    const tx = cx + Math.cos(angle) * dist * rnd(0.7, 1.3);
    const ty = cy + Math.sin(angle) * dist * rnd(0.7, 1.3);
    gsap.fromTo(d,
      { left: cx + 'px', top: cy + 'px', rotation: 0, scale: 0, opacity: 0 },
      {
        left: tx + 'px', top: ty + 'px', rotation: rnd(-270, 270),
        scale: rnd(0.7, 1.4), opacity: rnd(0.6, 1.0),
        duration: rnd(0.35, 0.6), delay: rnd(0, 0.09), ease: 'power3.out',
        onComplete() {
          if (!d.isConnected) return;
          gsap.to(d, { top: `+=${rnd(10,25)}`, left: `+=${rnd(-12,12)}`, rotation: `+=${rnd(-40,40)}`, duration: rnd(2,4), repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.to(d, { opacity: rnd(0.15,0.5), duration: rnd(0.4,1.0), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: rnd(0,0.6) });
          d._flick = setInterval(() => { if (d.isConnected) d.textContent = d.textContent === '1' ? '0' : '1'; else clearInterval(d._flick); }, rnd(200, 800));
        }
      }
    );
  }
}

function reassemble(wrap: HTMLElement, digits: any[], gsap: any) {
  const ch = wrap.querySelector('.lc') as HTMLElement;
  const r = ch.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  digits.forEach(d => {
    clearInterval(d._flick); gsap.killTweensOf(d);
    gsap.to(d, { left: cx + 'px', top: cy + 'px', opacity: 0, scale: 0, rotation: 0, duration: rnd(0.22, 0.38), delay: rnd(0, 0.05), ease: 'power3.in', onComplete() { d.remove(); } });
  });
  gsap.to(ch, { opacity: 1, scale: 1, duration: 0.38, delay: 0.08, ease: 'back.out(1.8)' });
}
// ── end helpers ──────────────────────────────────────────

export default function Hero() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      runHero(gsap);
    });
  }, []);

  async function runHero(gsap: any) {
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    const isTouch = window.matchMedia('(hover: none)').matches;

    // Dot grid parallax
    if (!isTouch) document.addEventListener('mousemove', (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 24;
      const py = (e.clientY / window.innerHeight - 0.5) * 24;
      const g = document.getElementById('dotGrid');
      if (g) g.style.transform = `translate(${px}px,${py}px)`;
    });

    buildLetterSpans(document.getElementById('nameFirst')!, 'Shardul');
    buildLetterSpans(document.getElementById('nameLast')!,  'Jadhav.');

    gsap.to('#nav',       { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.3 });
    gsap.to('#yearBadge', { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.5 });

    await wait(700);
    gsap.to('#codeWrap', { opacity: 1, duration: 0.35 });
    await typeWriter(document.getElementById('codeText')!, 'const shardul = new Engineer();', 44);
    await wait(420);
    gsap.to('#codeWrap', { opacity: 0, y: -10, duration: 0.38, ease: 'power2.in' });
    await wait(380);

    gsap.to('#roleLabel',  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    await wait(200);
    gsap.to('#heroName', { opacity: 1, duration: 0 });
    gsap.to(['#nameFirst','#nameLast'], { y: 0, duration: 1.05, ease: 'power4.out', stagger: 0.1 });
    await wait(500);
    gsap.to('#accentLine',  { opacity: 1, width: 120, duration: 0.8, ease: 'power3.out' });
    await wait(200);
    gsap.to('#heroTagline', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    await wait(320);
    gsap.to('#heroCta',     { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' });
    await wait(200);
    gsap.to(['#availability','#location','#scrollInd'], { opacity: 1, duration: 0.7, stagger: 0.12 });
    await wait(500);

    // Binary scatter hover
    if (!isTouch) {
      document.querySelectorAll('.lw').forEach(w => {
        w.addEventListener('mouseenter', () => scatter(w as HTMLElement, gsap));
      });
      document.getElementById('heroName')?.addEventListener('mouseleave', () => {
        if (activeLetter) { reassemble(activeLetter, liveDigits.splice(0), gsap); activeLetter = null; }
      });
    }

    // Hide scroll indicator on final scene
    const finalSection = document.getElementById('sceneFinal');
    if (finalSection) {
      const ind = document.getElementById('scrollInd');
      const checkFinal = () => {
        if (!ind) return;
        const rect = finalSection.getBoundingClientRect();
        ind.style.display = rect.top <= window.innerHeight * 0.85 ? 'none' : '';
      };
      window.addEventListener('scroll', checkFinal, { passive: true });
      checkFinal();
    }
  }

  return (
    <>
      <div className="year-badge" id="yearBadge">© 2026</div>

      <section className="hero" id="hero">
        <div className="dot-grid" id="dotGrid"></div>
        <div className="hero-content">
          <div className="code-wrap" id="codeWrap">
            <span className="code-text" id="codeText"></span>
            <span className="code-caret"></span>
          </div>
          <p className="role-label" id="roleLabel">Software Engineer</p>
          <h1 className="hero-name" id="heroName">
            <span className="name-line"><span className="name-word" id="nameFirst"></span></span>
            <span className="name-line"><span className="name-word" id="nameLast"></span></span>
          </h1>
          <div className="name-accent-line" id="accentLine"></div>
          <p className="hero-tagline" id="heroTagline">
            Backend by trade<span className="tagline-sep">·</span>Frontend by heart
          </p>
          <div className="hero-cta" id="heroCta">
            <button className="btn-primary">View my work</button>
            <a href="mailto:sharduljadhavwork@gmail.com" className="btn-secondary">Get in touch ↗</a>
          </div>
        </div>
      </section>

      <div className="availability" id="availability">
        <span className="avail-dot"></span>Available for work
      </div>
      <div className="location" id="location">Pune, India</div>
      <div className="scroll-ind" id="scrollInd">
        <div className="scroll-line"></div>
        <span className="scroll-label">Scroll</span>
      </div>
    </>
  );
}
