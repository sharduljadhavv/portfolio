'use client';
import { useEffect } from 'react';

export default function FinalScene() {
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Binary rain
        const canvas = document.getElementById('rainCanvas') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d')!;
          const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
          resize();
          window.addEventListener('resize', resize);
          const cols = Math.floor(canvas.width / 20);
          const drops = Array.from({ length: cols }, () => Math.random() * -50);
          const draw = () => {
            ctx.fillStyle = 'rgba(6,11,24,0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#60a5fa';
            ctx.font = '14px "Syne Mono", monospace';
            drops.forEach((y, i) => {
              ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * 20, y * 20);
              if (y * 20 > canvas.height && Math.random() > 0.97) drops[i] = 0;
              drops[i] += 0.4;
            });
            requestAnimationFrame(draw);
          };
          draw();
        }

        // Scroll animations
        ScrollTrigger.create({
          trigger: '#sceneFinal', start: 'top 72%',
          onEnter() {
            gsap.to('#finalEyebrow',  { opacity:1, y:0, duration:0.7, ease:'power3.out' });
            gsap.to('#finalHeadline', { opacity:1, y:0, duration:1.0, delay:0.15, ease:'power4.out' });
            gsap.to('#finalSub',      { opacity:1, y:0, duration:0.7, delay:0.35, ease:'power3.out' });
            gsap.to('#finalLinks',    { opacity:1, y:0, duration:0.7, delay:0.55, ease:'power3.out' });
            gsap.to('#finalDivider',  { opacity:1, width:'100%', maxWidth:800, duration:1.0, delay:0.75, ease:'power3.out' });
            gsap.to('#finalFooter',   { opacity:1, duration:0.7, delay:0.95, ease:'power3.out' });
          }
        });
      });
    });
  }, []);

  return (
    <div className="scene-final" id="sceneFinal">
      <canvas className="final-rain-canvas" id="rainCanvas"></canvas>

      <p className="final-eyebrow"  id="finalEyebrow">Open to opportunities</p>

      <h2 className="final-headline" id="finalHeadline">
        Let&apos;s build<br /><span className="grad">something.</span>
      </h2>

      <p className="final-sub" id="finalSub">
        Whether it&apos;s a full backend system, a complex feature, or a product from scratch —
        I&apos;m ready. Let&apos;s talk.
      </p>

      <div className="final-links" id="finalLinks">
        <a href="mailto:sharduljadhavwork@gmail.com" className="final-link primary">
          <span className="final-link-icon">✉</span>
          sharduljadhavwork@gmail.com
        </a>
        <a href="https://linkedin.com/in/sharduljadhavv" target="_blank" rel="noreferrer" className="final-link">
          <span className="final-link-icon">in</span>
          LinkedIn
        </a>
        <a href="https://github.com/sharduljadhavv" target="_blank" rel="noreferrer" className="final-link">
          <span className="final-link-icon">⌥</span>
          GitHub
        </a>
      </div>

      <div className="final-divider" id="finalDivider"></div>

      <div className="final-footer" id="finalFooter">
        <div className="final-footer-center">
          Shardul Jadhav · Pune, India<br />
          Available for work
        </div>
        <div className="final-footer-right">
          Built with Love &<br />Obsession
        </div>
      </div>
    </div>
  );
}
