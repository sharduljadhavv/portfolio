'use client';
import { useEffect, useRef } from 'react';

// ── Devicon map ──────────────────────────────────────────
const DEVICON_MAP: Record<string, string> = {
  nodejs:           'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/nodejs/nodejs-original.svg',
  typescript:       'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/typescript/typescript-original.svg',
  express:          'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/express/express-original.svg',
  postgresql:       'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/postgresql/postgresql-original.svg',
  mongodb:          'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/mongodb/mongodb-original.svg',
  amazonwebservices:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  docker:           'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/docker/docker-original.svg',
  jenkins:          'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/icons/jenkins/jenkins-original.svg',
  pg:    '🧠', llm: '🤖', embed: '✦', rag: '⚡', ecs: '☁',
};

// ── Puzzle logic ─────────────────────────────────────────
const GRID = 4, TOTAL = GRID * GRID;

function shufflePuzzle() {
  let state = Array.from({ length: TOTAL }, (_,i) => i === TOTAL-1 ? 0 : i+1);
  let ei = TOTAL - 1;
  for (let m = 0; m < 300; m++) {
    const r = Math.floor(ei / GRID), c = ei % GRID;
    const nbrs: number[] = [];
    if (r > 0) nbrs.push(ei - GRID);
    if (r < GRID-1) nbrs.push(ei + GRID);
    if (c > 0) nbrs.push(ei - 1);
    if (c < GRID-1) nbrs.push(ei + 1);
    const pick = nbrs[Math.floor(Math.random() * nbrs.length)];
    [state[ei], state[pick]] = [state[pick], state[ei]];
    ei = pick;
  }
  return { state, emptyPos: ei };
}

export default function Scene2() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        initScene2(gsap, ScrollTrigger);
      });
    });
  }, []);

  function initScene2(gsap: any, ScrollTrigger: any) {
    // ── Puzzle ──────────────────────────────────────────
    let { state: puzzleState, emptyPos } = shufflePuzzle();
    let moveCount = 0, puzzleLocked = false;

    function renderBoard() {
      for (let i = 0; i < TOTAL; i++) {
        const v = puzzleState[i];
        const t = document.getElementById('pt' + i);
        if (!t) continue;
        if (v === 0) { t.className = 'p-tile empty'; t.textContent = ''; }
        else {
          t.className = 'p-tile filled' + (v === i+1 ? ' correct' : '');
          t.textContent = String(v);
        }
      }
    }

    function checkWin() {
      if (!puzzleState.every((v,i) => v === (i < TOTAL-1 ? i+1 : 0))) return;
      puzzleLocked = true;
      gsap.to('#puzzleSolvedMsg', { opacity: 1, duration: 0.6, ease: 'power3.out' });
      const status = document.getElementById('puzzleStatus');
      if (status) status.textContent = `Solved in ${moveCount} moves!`;
      for (let i = 0; i < TOTAL; i++) {
        const t = document.getElementById('pt' + i);
        if (t?.classList.contains('filled'))
          gsap.to(t, { background:'rgba(34,211,238,0.18)', borderColor:'rgba(34,211,238,0.5)', duration: 0.4, delay: i * 0.04 });
      }
    }

    function handleTileClick(pos: number) {
      if (puzzleLocked) return;
      const er = Math.floor(emptyPos/GRID), ec = emptyPos%GRID;
      const pr = Math.floor(pos/GRID),     pc = pos%GRID;
      const adjacent = (er===pr && Math.abs(ec-pc)===1) || (ec===pc && Math.abs(er-pr)===1);
      if (!adjacent) return;
      [puzzleState[emptyPos], puzzleState[pos]] = [puzzleState[pos], puzzleState[emptyPos]];
      emptyPos = pos;
      moveCount++;
      renderBoard();
      const status = document.getElementById('puzzleStatus');
      if (status) status.textContent = `Moves: ${moveCount}`;
      checkWin();
    }

    // Build tiles
    const board = document.getElementById('puzzleBoard');
    if (board) {
      board.innerHTML = '';
      for (let i = 0; i < TOTAL; i++) {
        const t = document.createElement('div');
        t.id = 'pt' + i;
        t.className = 'p-tile ' + (i === TOTAL-1 ? 'empty' : 'filled');
        t.textContent = i === TOTAL-1 ? '' : String(i+1);
        t.addEventListener('click', () => handleTileClick(i));
        board.appendChild(t);
      }
      renderBoard();
    }

    document.getElementById('shuffleBtn')?.addEventListener('click', () => {
      puzzleLocked = false; moveCount = 0;
      gsap.to('#puzzleSolvedMsg', { opacity: 0, duration: 0.2 });
      const status = document.getElementById('puzzleStatus');
      if (status) status.textContent = 'Moves: 0';
      const shuffled = shufflePuzzle();
      puzzleState = shuffled.state; emptyPos = shuffled.emptyPos;
      renderBoard();
    });

    document.getElementById('resetBtn')?.addEventListener('click', () => {
      puzzleLocked = false; moveCount = 0;
      gsap.to('#puzzleSolvedMsg', { opacity: 0, duration: 0.2 });
      const status = document.getElementById('puzzleStatus');
      if (status) status.textContent = 'Moves: 0';
      puzzleState = Array.from({length:TOTAL},(_,i)=>i===TOTAL-1?0:i+1);
      emptyPos = TOTAL-1;
      renderBoard();
    });

    // ── Terminal ─────────────────────────────────────────
    let termStarted = false;
    function startTerminal() {
      if (termStarted) return; termStarted = true;
      const body = document.getElementById('terminalBody');
      if (!body) return;
      body.innerHTML = '';

      const lines = [
        { type: 'prompt', text: 'shardul ', cmd: '--skills' },
        { type: 'out', delay: 600, html: `<span class="t-blue">▸ Backend</span>  <span class="t-out"><span class="t-skill" data-icon="nodejs">Node.js</span> · <span class="t-skill" data-icon="typescript">TypeScript</span> ·<span class="t-skill" data-icon="typescript">Python</span> ·<span class="t-skill" data-icon="typescript">Java</span> · <span class="t-skill" data-icon="express">Express</span></span>` },
        { type: 'out', delay: 950, html: `<span class="t-blue">▸ Database</span> <span class="t-out"><span class="t-skill" data-icon="postgresql">PostgreSQL</span> · <span class="t-skill" data-icon="pg">pgvector</span> · <span class="t-skill" data-icon="mongodb">MongoDB</span></span>` },
        { type: 'out', delay: 1300, html: `<span class="t-blue">▸ AI Engineering</span> <span class="t-out"><span class="t-skill" data-icon="llm">LLM Integration</span> · <span class="t-skill" data-icon="embed">RAG Systems</span> ·<span class="t-skill" data-icon="embed">Embeddings</span> · <span class="t-skill" data-icon="rag">Semantic Search</span></span>` },
        { type: 'out', delay: 1650, html: `<span class="t-blue">▸ Cloud</span>    <span class="t-out"><span class="t-skill" data-icon="amazonwebservices">AWS</span> · <span class="t-skill" data-icon="docker">Docker</span> · <span class="t-skill" data-icon="jenkins">Jenkins</span> · <span class="t-skill" data-icon="ecs">ECS</span></span>` },
        { type: 'out', delay: 2000, html: `<span class="t-yellow">▸ Status</span>   <span class="t-out">Building. Always.</span>` },
      ];

      async function run() {
        for (const l of lines) {
          if (l.type === 'prompt') {
            const row = document.createElement('div'); row.className = 't-line';
            row.innerHTML = `<span class="t-prompt">❯ </span><span class="t-cmd" id="tcmd"></span><span class="t-cursor"></span>`;
            body!.appendChild(row);
            const tcmd = row.querySelector('#tcmd') as HTMLElement;
            for (const ch of ((l as any).text + (l as any).cmd)) {
              tcmd.textContent += ch;
              await new Promise(r => setTimeout(r, 55));
            }
            row.querySelector('.t-cursor')?.remove();
          } else {
            await new Promise(r => setTimeout(r, (l as any).delay));
            const row = document.createElement('div'); row.className = 't-line';
            row.innerHTML = (l as any).html; row.style.opacity = '0';
            body!.appendChild(row);
            gsap.to(row, { opacity: 1, duration: 0.35 });
          }
        }
        // Attach skill hover icons
        if (!window.matchMedia('(hover: none)').matches) {
          document.querySelectorAll('.t-skill').forEach(el => {
            let cooldown = false;
            el.addEventListener('mouseenter', () => {
              if (cooldown) return;
              cooldown = true;
              launchFloatingIcon((el as HTMLElement).dataset.icon || '', el as HTMLElement, gsap);
              setTimeout(() => cooldown = false, 600);
            });
          });
        }
      }
      run();
    }

    // ── Jersey placeholder ────────────────────────────────
    function initJersey() {
      const scene = document.getElementById('jerseyScene');
      if (!scene) return;
      scene.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 7px,rgba(255,255,255,0.02) 7px,rgba(255,255,255,0.02) 8px);"></div>
            <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(232,184,75,0.6),transparent);"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(232,184,75,0.6),transparent);"></div>
        </div>
      `;
      gsap.to('#jerseyScene', { opacity: 1, duration: 1.2, ease: 'power3.out' });
    }

    // ── Card-3 parallax ───────────────────────────────────
    ScrollTrigger.create({
      trigger: '#card3', start: 'top bottom', end: 'bottom top', scrub: true,
      onUpdate(self: any) {
        const p = self.progress;
        gsap.set('#c3logo',   { y: `${(p-0.5)*80}px` });
        gsap.set('#c3jersey', { y: `${(p-0.5)*120}px` });
      }
    });

    // ── Scroll triggers ───────────────────────────────────
    ScrollTrigger.create({ trigger: '#s2intro', start: 'top 75%', onEnter: () => {
      gsap.to('#s2eyebrow',  { opacity:1, y:0, duration:0.7, ease:'power3.out' });
      gsap.to('#s2headline', { opacity:1, y:0, duration:0.9, delay:0.15, ease:'power4.out' });
      gsap.to('#s2sub',      { opacity:1, y:0, duration:0.7, delay:0.35, ease:'power3.out' });
    }});

    ScrollTrigger.create({ trigger: '#card1', start: 'top 70%', onEnter: () => {
      gsap.to(['#c1num','#c1title','#c1desc','#c1tag'], { opacity:1, x:0, duration:0.75, ease:'power3.out', stagger:0.12 });
      gsap.to('#puzzleContainer', { opacity:1, scale:1, duration:0.9, delay:0.2, ease:'back.out(1.3)' });
    }});

    ScrollTrigger.create({ trigger: '#card2', start: 'top 70%', onEnter: () => {
      gsap.to(['#c2num','#c2title','#c2desc','#c2tag'], { opacity:1, x:0, duration:0.75, ease:'power3.out', stagger:0.12 });
      gsap.to('#terminalWrap', { opacity:1, y:0, duration:0.8, delay:0.2, ease:'power3.out' });
      setTimeout(startTerminal, 600);
    }});

    ScrollTrigger.create({ trigger: '#card3', start: 'top 70%', onEnter: () => {
      gsap.to(['#c3num','#c3title','#c3desc','#c3tag'], { opacity:1, x:0, duration:0.75, ease:'power3.out', stagger:0.12 });
      setTimeout(initJersey, 400);
    }});

    ScrollTrigger.create({ trigger: '#bridge', start: 'top 75%', onEnter: () => {
      gsap.to('#bridgeLabel', { opacity:1, y:0, duration:0.6, ease:'power3.out' });
      gsap.to('#bridgeDivA',  { opacity:1, width:200, duration:0.8, delay:0.2, ease:'power3.out' });
      gsap.to('#bridgeQuote', { opacity:1, y:0, duration:1.0, delay:0.3, ease:'power4.out' });
      gsap.to('#bridgeDivB',  { opacity:1, width:200, duration:0.8, delay:0.6, ease:'power3.out' });
    }});
  }

  return (
    <div className="scene2">
      {/* S2 Intro */}
      <div className="s2-intro" id="s2intro">
        <p className="s2-eyebrow" id="s2eyebrow">Beyond the code</p>
        <h2 className="s2-headline" id="s2headline">Who is<br /><span>Shardul?</span></h2>
        <p className="s2-sub" id="s2sub">Three things that make me, me.</p>
      </div>

      {/* Card 1: Problem Solver + Puzzle */}
      <div className="trait-card card-1" id="card1">
        <div className="card-left">
          <p className="card-num" id="c1num">01 / Problem Solver</p>
          <h3 className="card-title" id="c1title">I think<br />in puzzles.</h3>
          <p className="card-desc" id="c1desc">Every complex system is a puzzle waiting to be solved. I break things down, find the pattern, and build solutions that hold up — not just ones that work today. Think you can crack this one?</p>
          <span className="card-tag" id="c1tag">Systems Thinker</span>
        </div>
        <div className="card-right">
          <div className="puzzle-container" id="puzzleContainer">
            <div className="puzzle-label">Slide tiles to solve — easy to understand, hard to master</div>
            <div className="puzzle-board" id="puzzleBoard"></div>
            <div className="puzzle-status" id="puzzleStatus">Moves: 0</div>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div className="puzzle-solved-msg" id="puzzleSolvedMsg">🎉 Solved it!</div>
              <div className="puzzle-controls">
                <button className="p-btn" id="shuffleBtn">Shuffle</button>
                <button className="p-btn" id="resetBtn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Software Engineer + Terminal */}
      <div className="trait-card card-2" id="card2">
        <div className="card-left">
          <p className="card-num" id="c2num">02 / Software Engineer</p>
          <h3 className="card-title" id="c2title">I build<br />systems.</h3>
          <p className="card-desc" id="c2desc">2 years turning business requirements into production-grade backend systems. From schema design to cloud deployment — I own the full lifecycle of everything I build.</p>
          <span className="card-tag" id="c2tag">Backend · AI · Cloud</span>
        </div>
        <div className="card-right">
          <div className="terminal-wrap" id="terminalWrap">
            <div className="terminal-bar">
              <div className="t-dot"></div><div className="t-dot"></div><div className="t-dot"></div>
              <span className="t-title">github@sharduljadhavv ~ </span>
            </div>
            <div className="terminal-body" id="terminalBody"></div>
          </div>
        </div>
      </div>

      {/* Card 3: Sports + RCB */}
      <div className="trait-card card-3" id="card3">
        <div className="card-3-bg" id="c3bg">
          <img className="card-3-bg-logo"   id="c3logo"   src="/rcb-logo.jpg"   alt="" />
          <img className="card-3-bg-jersey" id="c3jersey" src="/rcb-jersey.png" alt="" />
        </div>
        <div className="card-left">
          <p className="card-num" id="c3num">03 / Sports</p>
          <h3 className="card-title" id="c3title">I love<br />sports.</h3>
          <p className="card-desc" id="c3desc">Cricket, F1, esports — if there&apos;s a team, there&apos;s a story. I know you would have guessed my favourite team by now 😉</p>
        </div>
        <div className="card-right">
          <div className="jersey-scene" id="jerseyScene"></div>
        </div>
      </div>

      {/* Bridge Quote */}
      <div className="bridge" id="bridge">
        <p className="bridge-label" id="bridgeLabel">The through line</p>
        <div className="bridge-div" id="bridgeDivA"></div>
        <p className="bridge-quote" id="bridgeQuote">
          A great team needs a <em>great backend.</em> Someone who does the unglamorous work that makes the whole product win.
        </p>
        <div className="bridge-div" id="bridgeDivB"></div>
      </div>
    </div>
  );
}

// ── Floating icon helper ──────────────────────────────────
function launchFloatingIcon(skill: string, originEl: HTMLElement, gsap: any) {
  const iconSrc = DEVICON_MAP[skill];
  if (!iconSrc) return;
  const rect = originEl.getBoundingClientRect();
  const startX = rect.left + rect.width / 2, startY = rect.top;
  const count = iconSrc.length <= 2 ? 1 : Math.floor(Math.random()*2)+1;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div'); el.className = 'float-icon';
    if (iconSrc.length <= 2) { el.style.fontSize = '28px'; el.textContent = iconSrc; }
    else { const img = document.createElement('img'); img.src = iconSrc; img.style.cssText = 'width:32px;height:32px;display:block;'; el.appendChild(img); }
    const offsetX = (Math.random()-0.5)*60*i;
    el.style.left = (startX + offsetX) + 'px'; el.style.top = startY + 'px';
    document.body.appendChild(el);
    const travelY = -(startY + 80 + Math.random()*80), drift = (Math.random()-0.5)*80;
    const delay = i*0.08, rot = (Math.random()-0.5)*40;
    gsap.fromTo(el,
      { opacity:0, scale:0.4, rotation:-rot, y:0, x:0 },
      { opacity:1, scale:1, rotation:rot*0.5, y:-60, x:drift*0.3, duration:0.3, delay, ease:'back.out(1.8)',
        onComplete() { gsap.to(el, { y:travelY, x:drift, opacity:0, rotation:rot, duration:1.4+Math.random()*0.6, ease:'power2.in', onComplete() { el.remove(); } }); }
      }
    );
  }
}
