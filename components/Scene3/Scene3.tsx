'use client';
import { useEffect } from 'react';

export default function Scene3() {
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        initScene3(gsap, ScrollTrigger);
      });
    });
  }, []);

  function initScene3(gsap: any, ScrollTrigger: any) {
    const panels   = document.querySelectorAll('.pillar-panel');
    const dots     = document.querySelectorAll('.pillar-spine-dot');
    const spineFill = document.getElementById('pillarSpineFill');
    const wrap     = document.getElementById('pillarsWrap');
    let currentIdx = 0;

    function showPanel(idx: number) {
      panels.forEach((p, i) => p.classList.toggle('active', i === idx));
      dots.forEach((d, i)   => d.classList.toggle('active', i <= idx));
      currentIdx = idx;
    }

    dots[0]?.classList.add('active');

    ScrollTrigger.create({
      trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: false,
      onUpdate(self: any) {
        const idx = Math.min(3, Math.floor(self.progress * 4));
        showPanel(idx);
        if (spineFill) (spineFill as HTMLElement).style.height = (self.progress * 100) + '%';
      }
    });

    ScrollTrigger.create({ trigger: '#s3intro', start: 'top 75%', onEnter() {
      gsap.to('#s3eyebrow',  { opacity:1, y:0, duration:0.7, ease:'power3.out' });
      gsap.to('#s3headline', { opacity:1, y:0, duration:0.9, delay:0.15, ease:'power4.out' });
      gsap.to('#s3sub',      { opacity:1, y:0, duration:0.7, delay:0.35, ease:'power3.out' });
    }});
  }

  return (
    <div className="scene3" id="scene3">
      {/* Intro */}
      <div className="s3-intro" id="s3intro">
        <p className="s3-eyebrow"  id="s3eyebrow">The craft</p>
        <h2 className="s3-headline" id="s3headline">How I<br /><span>build.</span></h2>
        <p className="s3-sub" id="s3sub">A backend system has four layers. I own all of them.</p>
      </div>

      {/* Sticky pillars */}
      <div className="pillars-wrap" id="pillarsWrap">
        <div className="pillars-sticky" id="pillarsSticky">

          {/* Spine */}
          <div className="pillar-spine" id="pillarSpine">
            <div className="pillar-spine-fill" id="pillarSpineFill"></div>
            <div className="pillar-spine-dot" id="spDot0" style={{top:'0%'}}></div>
            <div className="pillar-spine-dot" id="spDot1" style={{top:'33%'}}></div>
            <div className="pillar-spine-dot" id="spDot2" style={{top:'66%'}}></div>
            <div className="pillar-spine-dot" id="spDot3" style={{top:'100%'}}></div>
          </div>

          {/* Pillar 1 — Foundation */}
          <div className="pillar-panel pillar-1 active" id="pillar0">
            <div className="pillar-number">01</div>
            <div className="pillar-left">
              <p className="pillar-phase">Phase 01 — Foundation</p>
              <h3 className="pillar-name">The<br />Foundation.</h3>
              <p className="pillar-desc">I design database schemas from scratch - relational modeling, constraints, indexes, and query optimization. I look at a product design and architect the database around it before a single line of application code is written.</p>
              <div className="pillar-stack">
                {['PostgreSQL','SQL','pgvector','Indexing','Query Optimization'].map(t=>(
                  <span key={t} className="pillar-stack-tag">{t}</span>
                ))}
              </div>
              <div className="pillar-stat">
                <span className="pillar-stat-num">70%</span>
                <span className="pillar-stat-label">faster API response times<br />through schema &amp; query optimization</span>
              </div>
            </div>
            <div className="pillar-right">
              <div className="schema-vis">
                <div className="schema-table">
                  <div className="schema-table-header">🗃 users</div>
                  <div className="schema-table-rows">
                    <div className="schema-row"><span className="schema-pk">PK</span><span className="schema-col">id</span><span className="schema-type">uuid</span><span className="schema-index">IDX</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>email</span><span className="schema-type">varchar · unique</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>subscription_plan</span><span className="schema-type">enum</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>token_limit</span><span className="schema-type">integer</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>created_at</span><span className="schema-type">timestamptz</span><span className="schema-index">IDX</span></div>
                  </div>
                </div>
                <div className="schema-connector"><div className="schema-line"></div></div>
                <div className="schema-table">
                  <div className="schema-table-header">🗃 conversations</div>
                  <div className="schema-table-rows">
                    <div className="schema-row"><span className="schema-pk">PK</span><span className="schema-col">id</span><span className="schema-type">uuid</span></div>
                    <div className="schema-row"><span className="schema-fk">FK</span><span className="schema-col">user_id</span><span className="schema-type">→ users.id</span><span className="schema-index">IDX</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>tokens_used</span><span className="schema-type">integer</span></div>
                    <div className="schema-row"><span className="schema-col" style={{marginLeft:'20px'}}>summary</span><span className="schema-type">text</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2 — Engine */}
          <div className="pillar-panel pillar-2" id="pillar1">
            <div className="pillar-number">02</div>
            <div className="pillar-left">
              <p className="pillar-phase">Phase 02 — Engine</p>
              <h3 className="pillar-name">The<br />Engine.</h3>
              <p className="pillar-desc">Production-grade APIs, auth flows, push notifications, payment integrations, rate limiting, presigned URLs. The backend that runs 24/7 without thinking twice — because it was designed that way.</p>
              <div className="pillar-stack">
                {['Node.js','TypeScript','Python','Java','Express','TypeORM'].map(t=>(
                  <span key={t} className="pillar-stack-tag">{t}</span>
                ))}
              </div>
              <div className="pillar-stat">
                <span className="pillar-stat-num">50%</span>
                <span className="pillar-stat-label">increase in user interactions<br />via notifications backend</span>
              </div>
            </div>
            <div className="pillar-right">
              <div className="api-vis">
                {[
                  { icon:'📨', name:'POST /api/request', detail:'JWT auth · rate limiter · validation', badge:'SECURE', cls:'badge-blue' },
                  { icon:'⚙️', name:'Business Logic', detail:'Service layer · domain rules', badge:'CORE', cls:'badge-gold' },
                  { icon:'🗃', name:'PostgreSQL Query', detail:'Optimized · indexed · transactional', badge:'FAST', cls:'badge-green' },
                  { icon:'✅', name:'200 OK', detail:'Typed response · error handled', badge:'LIVE', cls:'badge-green' },
                ].reduce((acc: JSX.Element[], node, i, arr) => {
                  acc.push(
                    <div key={i} className="api-node">
                      <span className="api-icon">{node.icon}</span>
                      <div className="api-info"><span className="api-name">{node.name}</span><span className="api-detail">{node.detail}</span></div>
                      <span className={`api-badge ${node.cls}`}>{node.badge}</span>
                    </div>
                  );
                  if (i < arr.length-1) acc.push(<div key={`a${i}`} className="api-arrow">↓ {i===0?'middleware chain':i===1?'data layer':'response'}</div>);
                  return acc;
                }, [])}
              </div>
            </div>
          </div>

          {/* Pillar 3 — Intelligence */}
          <div className="pillar-panel pillar-3" id="pillar2">
            <div className="pillar-number">03</div>
            <div className="pillar-left">
              <p className="pillar-phase">Phase 03 — Intelligence</p>
              <h3 className="pillar-name">The<br />Intelligence.</h3>
              <p className="pillar-desc">End-to-end RAG pipelines — document ingestion, semantic chunking, vector embeddings, pgvector storage. Designed token management schemas that cut LLM costs by 60% while keeping multi-turn context alive.</p>
              <div className="pillar-stack">
                {['RAG Pipeline','pgvector','LLM Integration','Token Optimization','Conversational Context'].map(t=>(
                  <span key={t} className="pillar-stack-tag">{t}</span>
                ))}
              </div>
              <div className="pillar-stat">
                <span className="pillar-stat-num">60%</span>
                <span className="pillar-stat-label">reduction in LLM costs<br />via token &amp; context optimization</span>
              </div>
            </div>
            <div className="pillar-right">
              <div className="rag-vis">
                <div className="rag-flow">
                  {[
                    { cls:'rag-s1', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.2)', icon:'📄', title:'Document Ingestion',          sub:'PDF, wiki, README parsing' },
                    { cls:'rag-s2', bg:'rgba(96,165,250,0.1)',  border:'rgba(96,165,250,0.2)',  icon:'✂',  title:'Semantic Chunking',            sub:'Context-aware splitting' },
                    { cls:'rag-s3', bg:'rgba(34,211,238,0.1)',  border:'rgba(34,211,238,0.2)',  icon:'🧠', title:'Vector Embeddings → pgvector', sub:'Stored & indexed for similarity search' },
                    { cls:'rag-s4', bg:'rgba(74,222,128,0.1)',  border:'rgba(74,222,128,0.2)',  icon:'⚡', title:'LLM Response + Token Budget',  sub:'Context-aware · cost-optimized' },
                  ].map(step => (
                    <div key={step.cls} className={`rag-step ${step.cls}`}>
                      <div className="rag-icon-wrap" style={{background:step.bg, border:`1px solid ${step.border}`}}>{step.icon}</div>
                      <div className="rag-text">
                        <span className="rag-title">{step.title}</span>
                        <span className="rag-sub">{step.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4 — Infrastructure */}
          <div className="pillar-panel pillar-4" id="pillar3">
            <div className="pillar-number">04</div>
            <div className="pillar-left">
              <p className="pillar-phase">Phase 04 — Infrastructure</p>
              <h3 className="pillar-name">The<br />Infrastructure.</h3>
              <p className="pillar-desc">I deploy across multiple environments — EC2, ECS, ECR, S3, CloudWatch. CI/CD with Jenkins and Docker. Once I build something, I ship it. And keep it running.</p>
              <div className="pillar-stack">
                {['AWS EC2 · ECS · ECR','Docker','Jenkins','S3 · CloudWatch','Cloudflare CDN'].map(t=>(
                  <span key={t} className="pillar-stack-tag">{t}</span>
                ))}
              </div>
              <div className="pillar-stat">
                <span className="pillar-stat-num">2</span>
                <span className="pillar-stat-label">environments deployed<br />QA + Production on AWS</span>
              </div>
            </div>
            <div className="pillar-right">
              <div className="infra-vis">
                <div className="infra-grid">
                  {[
                    {icon:'🖥', name:'EC2'}, {icon:'📦', name:'ECS'}, {icon:'🐳', name:'Docker'},
                    {icon:'⚙️', name:'Jenkins'}, {icon:'🗄', name:'S3'}, {icon:'📡', name:'CloudWatch'},
                  ].map(c => (
                    <div key={c.name} className="infra-card">
                      <div className="infra-icon">{c.icon}</div>
                      <div className="infra-name">{c.name}</div>
                      <div className="infra-status"><div className="infra-dot"></div>running</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
