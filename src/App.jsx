import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════
// 7 THEMES — each a completely different visual identity
// ═══════════════════════════════════════
const THEMES = {
  cyber:   { name:"Dark Cyberpunk",    emoji:"⚡", bg:"#020817", bg2:"#060E1D", p:"#38BDF8", a:"#F97316", s:"#A78BFA", tx:"#F1F5F9", mu:"#64748B", glow:"rgba(56,189,248,.38)", hf:"'Poppins',sans-serif", effect:"particles" },
  tokyo:   { name:"Neon Tokyo",        emoji:"🌸", bg:"#0A0010", bg2:"#0D0018", p:"#FF0080", a:"#00F5FF", s:"#FFE600", tx:"#FFF0F8", mu:"#9D7DB4", glow:"rgba(255,0,128,.42)", hf:"'Poppins',sans-serif", effect:"neon" },
  luxury:  { name:"Royal Luxury",      emoji:"👑", bg:"#0D0A1E", bg2:"#120F28", p:"#D4AF37", a:"#C084FC", s:"#F9A8D4", tx:"#FAF5FF", mu:"#7C3AED", glow:"rgba(212,175,55,.4)",  hf:"Georgia,serif",         effect:"stars" },
  aurora:  { name:"Aurora Night",      emoji:"🌌", bg:"#010B18", bg2:"#020F20", p:"#34D399", a:"#818CF8", s:"#67E8F9", tx:"#ECFDF5", mu:"#6EE7B7", glow:"rgba(52,211,153,.32)", hf:"'Poppins',sans-serif", effect:"aurora" },
  sunset:  { name:"Ember Sunset",      emoji:"🔥", bg:"#120500", bg2:"#180800", p:"#FB923C", a:"#FBBF24", s:"#F472B6", tx:"#FFF7ED", mu:"#A87060", glow:"rgba(251,146,60,.45)", hf:"'Poppins',sans-serif", effect:"ember" },
  ocean:   { name:"Deep Ocean",        emoji:"🌊", bg:"#010E1A", bg2:"#011420", p:"#06B6D4", a:"#0EA5E9", s:"#7DD3FC", tx:"#E0F7FF", mu:"#4B8EA0", glow:"rgba(6,182,212,.35)",  hf:"'Poppins',sans-serif", effect:"bubbles" },
  matrix:  { name:"Matrix Terminal",   emoji:"💻", bg:"#000000", bg2:"#040904", p:"#00FF41", a:"#39FF14", s:"#ADFF2F", tx:"#00FF41", mu:"#005215", glow:"rgba(0,255,65,.32)",   hf:"'Courier New',monospace", effect:"matrix" },
};

// ═══════════════════════════════════════
// STATIC CSS (animations & structure)
// ═══════════════════════════════════════
const CSS_BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Hind Siliguri','Poppins',system-ui,sans-serif;overflow-x:hidden;line-height:1.6;transition:background .5s,color .5s}
  h1,h2,h3,h4{letter-spacing:-.02em}

  /* ── Scroll Reveal ── */
  .sr{opacity:0;transform:translateY(44px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr-l{opacity:0;transform:translateX(-60px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr-r{opacity:0;transform:translateX(60px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr.on,.sr-l.on,.sr-r.on{opacity:1!important;transform:none!important}
  .d1{transition-delay:.05s}.d2{transition-delay:.15s}.d3{transition-delay:.25s}.d4{transition-delay:.35s}.d5{transition-delay:.45s}.d6{transition-delay:.55s}

  /* ── Keyframes ── */
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
  @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes marqueeScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes shimmerSkel{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes shimmerTxt{from{background-position:-200% center}to{background-position:200% center}}
  @keyframes pulseGlow{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
  @keyframes countIn{from{opacity:0;transform:translateY(18px) scale(.78)}to{opacity:1;transform:none}}
  @keyframes scanLine{0%{top:-5%}100%{top:105%}}
  @keyframes progressFill{from{width:0%}to{width:var(--pw,100%)}}
  @keyframes borderSweep{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes glitch1{0%,100%{clip-path:inset(40% 0 50% 0);transform:translate(-4px,0)}25%{clip-path:inset(10% 0 80% 0);transform:translate(4px,0)}50%{clip-path:inset(70% 0 10% 0);transform:translate(-3px,0)}75%{clip-path:inset(30% 0 60% 0);transform:translate(3px,0)}}
  @keyframes glitch2{0%,100%{clip-path:inset(60% 0 20% 0);transform:translate(4px,0)}25%{clip-path:inset(20% 0 60% 0);transform:translate(-4px,0)}50%{clip-path:inset(5% 0 85% 0);transform:translate(3px,0)}75%{clip-path:inset(80% 0 5% 0);transform:translate(-3px,0)}}
  @keyframes aurora1{0%,100%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.2)}}
  @keyframes aurora2{0%,100%{transform:rotate(60deg) scale(1.1)}50%{transform:rotate(240deg) scale(.9)}}
  @keyframes skelPulse{0%,100%{opacity:.4}50%{opacity:.8}}

  /* ── Skeleton ── */
  .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmerSkel 1.5s infinite;border-radius:8px}

  /* ── Tilt card ── */
  .tilt{transition:transform .1s ease,box-shadow .3s ease;transform-style:preserve-3d;will-change:transform}

  /* ── Border sweep card ── */
  .bsweep-wrap{padding:1px;border-radius:18px;background:linear-gradient(90deg,var(--p),var(--s),var(--a),var(--p));background-size:300% 300%;animation:borderSweep 4s linear infinite}

  /* ── Responsive ── */
  @media(max-width:768px){.hide-sm{display:none!important}.sm-col{flex-direction:column!important}.sm-full{width:100%!important;flex:none!important;min-width:unset!important}.sm-center{text-align:center!important;align-items:center!important;justify-content:center!important}.sm-g1{grid-template-columns:1fr!important}}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--p);border-radius:2px}
`;

function themeCSSVars(t) {
  return `:root{--bg:${t.bg};--bg2:${t.bg2};--p:${t.p};--a:${t.a};--s:${t.s};--tx:${t.tx};--mu:${t.mu};--glow:${t.glow};--hf:${t.hf}}body{background:${t.bg};color:${t.tx}}h1,h2,h3,h4{font-family:${t.hf}}`;
}

// ═══════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (en) => en.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
    );
    document.querySelectorAll(".sr,.sr-l,.sr-r").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
function useInView(t = 0.2) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [t]);
  return [ref, v];
}
function useCounter(target, inView) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = null;
    const dur = 2200;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return v;
}
function useTyping(texts, speed = 90, delSpeed = 45, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    const text = texts[idx % texts.length];
    let to;
    if (typing) {
      if (ci < text.length) { to = setTimeout(() => { setDisplay(text.slice(0, ci + 1)); setCi(c => c + 1); }, speed); }
      else { to = setTimeout(() => setTyping(false), pause); }
    } else {
      if (ci > 0) { to = setTimeout(() => { setDisplay(text.slice(0, ci - 1)); setCi(c => c - 1); }, delSpeed); }
      else { setIdx(i => i + 1); setTyping(true); }
    }
    return () => clearTimeout(to);
  }, [ci, typing, idx, texts, speed, delSpeed, pause]);
  return display;
}
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}
function useMouseParallax() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e) => setM({ x: (e.clientX / window.innerWidth - .5) * 40, y: (e.clientY / window.innerHeight - .5) * 40 });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return m;
}

// ═══════════════════════════════════════
// CANVAS EFFECTS
// ═══════════════════════════════════════
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 68 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.3 + .2, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, a: Math.random() * .5 + .1 }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + c.width) % c.width; p.y = (p.y + p.vy + c.height) % c.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(148,163,184,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(56,189,248,${.14 * (1 - d / 110)})`; ctx.lineWidth = .5; ctx.stroke(); }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function MatrixCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const cols = Math.floor(c.width / 20);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,.05)"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#00FF41"; ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, y * 20);
        if (y * 20 > c.height && Math.random() > .975) drops[i] = 0;
        drops[i] += .5;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: .35 }} />;
}

function BubbleCanvas({ t }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const bubbles = Array.from({ length: 30 }, () => ({ x: Math.random() * c.width, y: c.height + Math.random() * 200, r: Math.random() * 20 + 5, vy: Math.random() * .8 + .3, a: Math.random() * .25 + .05 }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      bubbles.forEach(b => {
        b.y -= b.vy;
        if (b.y + b.r < 0) { b.y = c.height + b.r; b.x = Math.random() * c.width; }
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6,182,212,${b.a})`; ctx.lineWidth = 1; ctx.stroke();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function HeroBackground({ effect }) {
  if (effect === "particles") return <ParticleCanvas />;
  if (effect === "matrix") return <MatrixCanvas />;
  if (effect === "bubbles") return <BubbleCanvas />;
  if (effect === "neon") return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,0,128,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,128,.06) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,0,128,.18),transparent)", top: "10%", left: "20%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,.14),transparent)", bottom: "10%", right: "15%", filter: "blur(50px)" }} />
    </div>
  );
  if (effect === "aurora") return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: "120%", height: "60%", top: "5%", left: "-10%", background: "linear-gradient(135deg,rgba(52,211,153,.12),rgba(129,140,248,.1),transparent)", borderRadius: "50%", animation: "aurora1 12s ease-in-out infinite", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: "100%", height: "50%", top: "25%", left: "5%", background: "linear-gradient(225deg,rgba(103,232,249,.1),rgba(52,211,153,.08),transparent)", borderRadius: "50%", animation: "aurora2 15s ease-in-out infinite", filter: "blur(50px)" }} />
    </div>
  );
  if (effect === "stars") return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, borderRadius: "50%", background: "rgba(212,175,55,.7)", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `pulseGlow ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s` }} />
      ))}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,55,.08),transparent)", top: "20%", right: "-5%", filter: "blur(80px)" }} />
    </div>
  );
  if (effect === "ember") return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,146,60,.15),rgba(239,68,68,.08),transparent)", bottom: "-10%", left: "30%", filter: "blur(80px)", animation: "floatY 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,191,36,.1),transparent)", top: "20%", right: "10%", filter: "blur(50px)" }} />
    </div>
  );
  return null;
}

// ═══════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════
function TiltGlareCard({ children, style, max = 14 }) {
  const ref = useRef(null); const glare = useRef(null);
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width, y = (e.clientY - top) / height;
    ref.current.style.transform = `perspective(900px) rotateX(${(y - .5) * -max * 2}deg) rotateY(${(x - .5) * max * 2}deg) scale3d(1.04,1.04,1.04)`;
    if (glare.current) { glare.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%,rgba(255,255,255,.2),transparent 60%)`; glare.current.style.opacity = "1"; }
  }, [max]);
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    if (glare.current) glare.current.style.opacity = "0";
  }, []);
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="tilt" style={style}>
      <div ref={glare} style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0, transition: "opacity .3s", pointerEvents: "none", zIndex: 10 }} />
      {children}
    </div>
  );
}

function GlitchText({ children, t, style }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const fn = () => { setG(true); setTimeout(() => setG(false), 500); };
    const id = setInterval(fn, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      {g && <>
        <span aria-hidden style={{ position: "absolute", top: 0, left: 0, color: t.a, animation: "glitch1 .45s steps(2,end) infinite" }}>{children}</span>
        <span aria-hidden style={{ position: "absolute", top: 0, left: 0, color: t.p, animation: "glitch2 .45s steps(2,end) infinite" }}>{children}</span>
      </>}
    </span>
  );
}

function SkeletonPage({ t }) {
  return (
    <div style={{ background: t.bg, minHeight: "100vh", padding: "100px 5% 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="skel" style={{ height: 60, width: "40%", marginBottom: 20 }} />
        <div className="skel" style={{ height: 40, width: "70%", marginBottom: 16 }} />
        <div className="skel" style={{ height: 20, width: "55%", marginBottom: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[0, 1, 2].map(i => <div key={i} className="skel" style={{ height: 340, borderRadius: 20 }} />)}
        </div>
      </div>
    </div>
  );
}

function ScrollProgressBar({ t }) {
  const p = useScrollProgress();
  return (
    <div style={{ position: "fixed", top: 0, left: 0, zIndex: 10000, height: 3, width: `${p}%`, background: `linear-gradient(90deg,${t.p},${t.a},${t.s})`, boxShadow: `0 0 12px ${t.glow}`, transition: "width .08s" }} />
  );
}

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════
const NEWS_ITEMS = [
  "🎓 নতুন সেশনে ভর্তি চলছে — আসন সীমিত!",
  "🔥 ৬০% বিশেষ ভর্তি ছাড় পাচ্ছেন এখনই",
  "📜 বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত কোর্স",
  "💻 মাত্র ৳১,৮৫০ থেকে শুরু — আজই যোগাযোগ করুন",
  "🏆 ৫০০+ শিক্ষার্থী সফলভাবে প্রশিক্ষণ সম্পন্ন করেছেন",
  "📅 ৩ মাস • ৬ মাস • ১ বছর মেয়াদী কোর্স",
];

const COURSES = [
  { dur: "৩ মাস", eng: "3 Months", title: "অফিস বেসিক", price: "১,৮৫০", topics: ["MS Word, Excel, PowerPoint", "বাংলা ও ইংরেজি টাইপিং", "Email ও Internet", "Basic Computer Skills"], icon: "💼" },
  { dur: "৬ মাস", eng: "6 Months", title: "অফিস + ডিজাইন", price: "৩,৫০০", topics: ["অফিস বেসিক সম্পূর্ণ", "Adobe Photoshop & Illustrator", "Logo ও Banner Design", "Basic Accounting"], icon: "🎨", tag: "সবচেয়ে জনপ্রিয়" },
  { dur: "১ বছর", eng: "1 Year", title: "প্রফেশনাল", price: "৬,০০০", topics: ["অফিস + ডিজাইন সম্পূর্ণ", "Web Design (HTML/CSS)", "Accounting Software", "জাতীয় সার্টিফিকেট"], icon: "🏆" },
];

const TESTIMONIALS = [
  { n: "রাহেলা বেগম", r: "৬ মাস কোর্স সম্পন্ন", q: "এখানে শিখে আমি একটি অফিসে ডেটা এন্ট্রি অপারেটর হিসেবে কাজ করছি। শিক্ষকরা অনেক ধৈর্যশীল।" },
  { n: "মো. আরিফ হোসেন", r: "১ বছর কোর্স সম্পন্ন", q: "গ্রাফিক ডিজাইনে ফ্রিল্যান্সিং করে ভালো আয় করছি। এই কোর্স আমার জীবন বদলে দিয়েছে।" },
  { n: "সুমাইয়া আক্তার", r: "৩ মাস কোর্স সম্পন্ন", q: "ছোট কোর্স কিন্তু শেখার মান অনেক উন্নত। ফি অনেক সাশ্রয়ী এবং পরিবেশ খুবই ভালো।" },
  { n: "কামাল উদ্দিন", r: "৬ মাস কোর্স সম্পন্ন", q: "এখন নিজেই ব্যানার ও লোগো ডিজাইন করি। দৃষ্টি কম্পিউটারের জন্য অনেক কৃতজ্ঞ।" },
  { n: "নাজমা বেগম", r: "১ বছর কোর্স সম্পন্ন", q: "ওয়েব ডিজাইন শিখে অনলাইনে কাজ করছি। এই সুযোগ না পেলে হয়তো সম্ভব হতো না।" },
];

const STATS = [
  { target: 500, suf: "+", l: "শিক্ষার্থী প্রশিক্ষিত", icon: "👨‍💻" },
  { target: 8, suf: "+", l: "বছরের অভিজ্ঞতা", icon: "📅" },
  { target: 3, suf: "টি", l: "কোর্স প্রোগ্রাম", icon: "📚" },
  { target: 100, suf: "%", l: "সার্টিফিকেট প্রদান", icon: "🎓" },
];

// ═══════════════════════════════════════
// NAVBAR + NEWS TICKER
// ═══════════════════════════════════════
function NewsTicker({ t }) {
  const doubled = [...NEWS_ITEMS, ...NEWS_ITEMS];
  return (
    <div style={{ background: t.p + "18", borderBottom: `1px solid ${t.p}33`, overflow: "hidden", height: 34, display: "flex", alignItems: "center" }}>
      <div style={{ flexShrink: 0, background: t.p, color: t.bg, fontSize: 11, fontWeight: 800, padding: "0 14px", height: "100%", display: "flex", alignItems: "center", letterSpacing: ".06em", whiteSpace: "nowrap", fontFamily: t.hf }}>
        🔴 LIVE
      </div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ display: "flex", gap: 60, width: "max-content", animation: "tickerScroll 25s linear infinite", paddingLeft: 24 }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ color: t.tx, fontSize: 12, whiteSpace: "nowrap", opacity: .85, fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Navbar({ t }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 70);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 998, transition: "all .4s ease" }}>
      <NewsTicker t={t} />
      <nav style={{ height: 64, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", background: sc ? `${t.bg}F2` : "transparent", backdropFilter: sc ? "blur(20px)" : "none", borderBottom: sc ? `1px solid ${t.p}22` : "1px solid transparent", transition: "all .4s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg,${t.p},${t.a})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: t.bg, fontFamily: t.hf, boxShadow: `0 0 18px ${t.glow}` }}>দৃ</div>
          <div>
            <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 14, color: t.tx, lineHeight: 1.2 }}>Dristy Computer</div>
            <div style={{ fontSize: 10, color: t.mu }}>Training Center, Gopalpur</div>
          </div>
        </div>
        <div className="hide-sm" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {["কোর্সসমূহ", "কেন আমরা", "যোগাযোগ"].map(l => (
            <span key={l} style={{ color: t.mu, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "color .2s", fontFamily: t.hf }}
              onMouseEnter={e => e.target.style.color = t.p} onMouseLeave={e => e.target.style.color = t.mu}>{l}</span>
          ))}
        </div>
        <button onClick={() => window.open("https://www.facebook.com/share/1E2jAYRKhz/")} className="hide-sm" style={{ background: `linear-gradient(135deg,${t.p},${t.a})`, color: t.bg, border: "none", padding: "9px 22px", borderRadius: 9, fontFamily: t.hf, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: `0 0 18px ${t.glow}`, transition: "all .3s" }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 0 32px ${t.glow}`; }}
          onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 18px ${t.glow}`; }}
        >ভর্তি হোন</button>
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════
// HERO
// ═══════════════════════════════════════
function Hero({ t }) {
  const [on, setOn] = useState(false);
  const mouse = useMouseParallax();
  const [heroRef, heroIn] = useInView(0.1);
  const typed = useTyping(["IT Professional হোন", "Freelancer হোন", "আত্মনির্ভরশীল হোন", "ক্যারিয়ার গড়ুন"]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => { const to = setTimeout(() => setOn(true), 80); return () => clearTimeout(to); }, []);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const a = (d, extra = {}) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(28px)", transition: `opacity .85s ease ${d},transform .85s cubic-bezier(.16,1,.3,1) ${d}`, ...extra });

  return (
    <section ref={heroRef} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "130px 5% 80px", background: t.bg }}>
      <HeroBackground effect={t.effect} />
      {/* Parallax orbs */}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${t.p}18 0%,transparent 70%)`, top: `calc(-5% + ${-mouse.y * .4}px)`, left: `calc(22% + ${mouse.x * .4}px)`, transform: `translateY(${-scrollY * .15}px)`, transition: "top .12s,left .12s", pointerEvents: "none", filter: "blur(10px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${t.a}12 0%,transparent 70%)`, bottom: "0%", right: `calc(5% + ${-mouse.x * .3}px)`, transform: `translateY(${scrollY * .1}px)`, transition: "right .15s", pointerEvents: "none", filter: "blur(10px)" }} />
      {/* Rotating rings */}
      {[750, 520, 330].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: `1px solid ${t.p}${i === 0 ? "08" : i === 1 ? "06" : "04"}`, top: "50%", left: "50%", transform: `translate(-50%,-50%) translateY(${-scrollY * .04}px)`, animation: `rotateSlow ${50 + i * 18}s linear infinite ${i % 2 ? "reverse" : ""}`, pointerEvents: "none" }} />
      ))}
      {t.effect === "matrix" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${t.p},transparent)`, animation: "scanLine 5s linear infinite", pointerEvents: "none" }} />}

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }} className="sm-full sm-center">
            <div style={{ ...a("0s"), display: "inline-flex", alignItems: "center", gap: 8, background: `${t.p}14`, border: `1px solid ${t.p}35`, borderRadius: 50, padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.p, boxShadow: `0 0 10px ${t.p}`, animation: "pulseGlow 2s ease infinite" }} />
              <span style={{ color: t.p, fontSize: 12, fontWeight: 600, fontFamily: t.hf, letterSpacing: ".04em" }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত</span>
            </div>

            <h1 style={{ ...a("0.1s"), fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(36px,5.5vw,66px)", lineHeight: 1.05, marginBottom: 12 }}>
              <GlitchText t={t} style={{ display: "block", color: t.tx }}>কম্পিউটার শিখুন,</GlitchText>
              <span style={{ display: "block", background: `linear-gradient(135deg,${t.p},${t.a})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ক্যারিয়ার গড়ুন</span>
            </h1>

            {/* Typing animation */}
            <div style={{ ...a("0.2s"), height: 36, display: "flex", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: "clamp(16px,2.2vw,22px)", color: t.a, fontWeight: 700, fontFamily: t.hf }}>{typed}</span>
              <span style={{ color: t.p, fontSize: 24, animation: "pulseGlow 1s ease-in-out infinite", marginLeft: 3 }}>|</span>
            </div>

            <p style={{ ...a("0.28s"), fontSize: "clamp(14px,1.6vw,16px)", color: t.tx + "99", lineHeight: 1.88, marginBottom: 36, maxWidth: 460 }}>
              দৃষ্টি কম্পিউটার প্রশিক্ষণ ইনস্টিটিউটে ৩ মাস, ৬ মাস ও ১ বছর মেয়াদী কোর্স। মাত্র{" "}
              <strong style={{ color: t.a, textShadow: `0 0 14px ${t.a}99` }}>৳১,৮৫০</strong> থেকে শুরু।
            </p>
            <div style={{ ...a("0.36s"), display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button style={{ background: `linear-gradient(135deg,${t.a},${t.p})`, color: t.bg, border: "none", padding: "15px 38px", borderRadius: 10, fontFamily: t.hf, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: `0 0 28px ${t.glow},0 4px 20px rgba(0,0,0,.4)`, transition: "all .3s" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.02)"; e.target.style.boxShadow = `0 0 50px ${t.glow},0 8px 30px rgba(0,0,0,.5)`; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 28px ${t.glow},0 4px 20px rgba(0,0,0,.4)`; }}
              >🎓 ভর্তি হোন এখনই</button>
              <button style={{ background: "transparent", color: t.tx + "CC", border: `1px solid ${t.tx}22`, padding: "14px 28px", borderRadius: 10, fontFamily: t.hf, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.p}12`; e.currentTarget.style.borderColor = t.p; e.currentTarget.style.color = t.tx; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${t.tx}22`; e.currentTarget.style.color = t.tx + "CC"; }}
              >📞 কথা বলুন</button>
            </div>
            <div style={{ ...a("0.5s"), display: "inline-flex", alignItems: "center", gap: 12, marginTop: 34, background: `${t.a}10`, border: `1px solid ${t.a}25`, borderRadius: 14, padding: "13px 20px" }}>
              <span style={{ fontSize: 22 }}>🔥</span>
              <div>
                <div style={{ color: t.a, fontFamily: t.hf, fontWeight: 800, fontSize: 18, textShadow: `0 0 16px ${t.a}88` }}>৬০% বিশেষ ছাড়!</div>
                <div style={{ color: t.tx + "66", fontSize: 12 }}>সীমিত সময়ের অফার — আসন সীমিত</div>
              </div>
            </div>
          </div>

          {/* Glassmorphic pricing card */}
          <div className="hide-sm" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(50px)", transition: "all 1s cubic-bezier(.16,1,.3,1) .5s", width: 300, flexShrink: 0 }}>
            <div style={{ background: `rgba(255,255,255,.05)`, backdropFilter: "blur(28px)", border: `1px solid ${t.p}28`, borderRadius: 22, padding: "26px 22px", boxShadow: `0 0 60px ${t.glow}22,inset 0 1px 0 rgba(255,255,255,.08)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: t.mu, fontSize: 12 }}>নতুন ভর্তি — ২০২৫</span>
                <span style={{ background: `linear-gradient(135deg,${t.a},${t.p})`, color: t.bg, fontSize: 10, padding: "3px 10px", borderRadius: 50, fontWeight: 700, boxShadow: `0 0 12px ${t.glow}` }}>LIVE</span>
              </div>
              {COURSES.map((c, i) => (
                <div key={i} style={{ background: i === 1 ? `${t.a}14` : `rgba(255,255,255,.03)`, border: `1px solid ${i === 1 ? t.a + "35" : "rgba(255,255,255,.07)"}`, borderRadius: 11, padding: "12px 15px", marginBottom: 9, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `${t.p}12`}
                  onMouseLeave={e => e.currentTarget.style.background = i === 1 ? `${t.a}14` : "rgba(255,255,255,.03)"}
                >
                  <div>
                    <div style={{ color: t.tx, fontWeight: 600, fontSize: 13 }}>{c.dur} {i === 1 ? "⭐" : ""}</div>
                    <div style={{ color: t.mu, fontSize: 11 }}>{c.eng}</div>
                  </div>
                  <div style={{ color: t.p, fontWeight: 900, fontSize: 16, fontFamily: t.hf, textShadow: `0 0 12px ${t.glow}` }}>৳{c.price}</div>
                </div>
              ))}
              <button style={{ width: "100%", padding: 12, borderRadius: 9, background: `linear-gradient(135deg,${t.p},${t.a})`, color: t.bg, border: "none", fontFamily: t.hf, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 8, transition: "all .3s", boxShadow: `0 0 16px ${t.glow}` }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 0 30px ${t.glow}`; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 16px ${t.glow}`; }}
              >এখনই শুরু করুন →</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(to bottom,transparent,${t.bg})`, pointerEvents: "none" }} />
    </section>
  );
}

// ═══════════════════════════════════════
// STATS + PROGRESS BARS
// ═══════════════════════════════════════
function StatsBar({ t }) {
  const [ref, inView] = useInView(.3);
  const vals = STATS.map((s, i) => useCounter(s.target, inView));
  return (
    <section ref={ref} style={{ background: t.bg2, padding: "70px 5%", borderTop: `1px solid ${t.p}18`, borderBottom: `1px solid ${t.p}18` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32 }}>
        {STATS.map((s, i) => (
          <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(38px,5vw,56px)", lineHeight: 1, color: t.p, textShadow: `0 0 28px ${t.glow}`, animation: inView ? `countIn .6s ease ${i * .1}s both` : "none" }}>{vals[i]}{s.suf}</div>
            {/* Progress bar fill */}
            <div style={{ height: 3, background: `${t.p}18`, borderRadius: 2, margin: "10px auto", width: 80, overflow: "hidden" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${t.p},${t.a})`, width: inView ? "100%" : "0%", transition: `width 2s ease ${i * .2}s`, boxShadow: `0 0 8px ${t.glow}` }} />
            </div>
            <div style={{ color: t.mu, fontSize: 13, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// 3D COURSE CAROUSEL
// ═══════════════════════════════════════
function CourseCarousel({ t }) {
  const [active, setActive] = useState(1);
  const total = COURSES.length;

  const getPos = (i) => {
    const raw = ((i - active + total) % total);
    const norm = raw === 2 ? -1 : raw; // -1, 0, 1
    return {
      transform: `perspective(1200px) rotateY(${norm * 36}deg) translateX(${norm * 210}px) translateZ(${Math.abs(norm) * -200}px) scale(${norm === 0 ? 1 : .84})`,
      opacity: norm === 0 ? 1 : .55,
      zIndex: total - Math.abs(norm),
      transition: "all .65s cubic-bezier(.16,1,.3,1)",
      position: "absolute", width: 300, left: "50%", marginLeft: -150, top: 0,
      cursor: norm !== 0 ? "pointer" : "default",
    };
  };

  return (
    <section style={{ padding: "110px 5%", background: t.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle,${t.p}06,transparent)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${t.p}10`, border: `1px solid ${t.p}25`, borderRadius: 50, padding: "5px 16px", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: t.p, textTransform: "uppercase", fontFamily: t.hf }}>আমাদের কোর্সসমূহ</span>
          </div>
          <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", marginBottom: 14, background: `linear-gradient(135deg,${t.tx},${t.p})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            কোর্স বেছে নিন
          </h2>
        </div>

        {/* 3D Carousel */}
        <div style={{ position: "relative", height: 500, perspective: "1200px", marginBottom: 32 }} className="hide-sm">
          {COURSES.map((c, i) => (
            <div key={i} style={getPos(i)} onClick={() => setActive(i)}>
              <TiltGlareCard max={i === active ? 12 : 0} style={{ background: `linear-gradient(145deg,${t.p}14,${t.a}08)`, border: `1px solid ${t.p}${i === active ? "3A" : "18"}`, borderRadius: 20, height: 470, boxShadow: i === active ? `0 0 50px ${t.glow},0 8px 40px rgba(0,0,0,.5)` : "none", overflow: "hidden", position: "relative" }}>
                {c.tag && i === active && <div style={{ position: "absolute", top: 16, right: 16, background: t.a, color: t.bg, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 50, fontFamily: t.hf }}>{c.tag}</div>}
                {i === active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${t.p},${t.a},transparent)` }} />}
                <div style={{ padding: "28px 26px" }}>
                  <div style={{ fontSize: 42, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ color: t.p, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4, fontFamily: t.hf }}>{c.eng}</div>
                  <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 22, color: t.tx, marginBottom: 20, textShadow: i === active ? `0 0 20px ${t.glow}` : "none" }}>{c.title}</h3>
                  <div style={{ borderTop: `1px solid ${t.tx}0A`, paddingTop: 16, marginBottom: 16 }}>
                    {c.topics.map(tp => (
                      <div key={tp} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `1px solid ${t.p}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: t.p, fontWeight: 700 }}>✓</div>
                        <span style={{ color: t.tx + "AA", fontSize: 13 }}>{tp}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 20 }}>
                    <span style={{ fontSize: 12, color: t.mu }}>মাত্র</span>
                    <span style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 28, color: t.p, textShadow: `0 0 20px ${t.glow}` }}>৳{c.price}</span>
                  </div>
                  <button style={{ width: "100%", padding: 12, borderRadius: 10, background: i === active ? `linear-gradient(135deg,${t.p},${t.a})` : `${t.p}18`, color: i === active ? t.bg : t.mu, border: "none", fontFamily: t.hf, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .3s", boxShadow: i === active ? `0 0 18px ${t.glow}` : "none" }}>
                    {i === active ? "এই কোর্সে ভর্তি হোন →" : "দেখুন"}
                  </button>
                </div>
              </TiltGlareCard>
            </div>
          ))}
        </div>
        {/* Carousel controls */}
        <div className="hide-sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
          <button onClick={() => setActive(a => (a - 1 + total) % total)} style={{ width: 44, height: 44, borderRadius: "50%", background: `${t.p}15`, border: `1px solid ${t.p}30`, color: t.p, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
            onMouseEnter={e => e.currentTarget.style.background = `${t.p}28`} onMouseLeave={e => e.currentTarget.style.background = `${t.p}15`}>←</button>
          <div style={{ display: "flex", gap: 8 }}>
            {COURSES.map((_, i) => <div key={i} onClick={() => setActive(i)} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? t.p : `${t.p}30`, cursor: "pointer", transition: "all .3s", boxShadow: i === active ? `0 0 10px ${t.glow}` : "none" }} />)}
          </div>
          <button onClick={() => setActive(a => (a + 1) % total)} style={{ width: 44, height: 44, borderRadius: "50%", background: `${t.p}15`, border: `1px solid ${t.p}30`, color: t.p, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
            onMouseEnter={e => e.currentTarget.style.background = `${t.p}28`} onMouseLeave={e => e.currentTarget.style.background = `${t.p}15`}>→</button>
        </div>
        {/* Mobile grid fallback */}
        <div className="sm-g1" style={{ display: "none" }} />
        <div style={{ display: "none" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            {COURSES.map((c, i) => (
              <TiltGlareCard key={i} style={{ background: `${t.p}10`, border: `1px solid ${t.p}22`, borderRadius: 16, padding: "20px" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                <h3 style={{ fontFamily: t.hf, fontWeight: 700, color: t.tx, marginBottom: 8 }}>{c.title}</h3>
                <div style={{ color: t.p, fontFamily: t.hf, fontWeight: 800, fontSize: 22 }}>৳{c.price}</div>
              </TiltGlareCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// BENTO FEATURES (border sweep)
// ═══════════════════════════════════════
function BentoFeatures({ t }) {
  const cells = [
    { icon: "🏛️", title: "সরকার অনুমোদিত", desc: "বাংলাদেশ কারিগরি শিক্ষাবোর্ড স্বীকৃত। সার্টিফিকেট সারাদেশে বৈধ।", span: "1 / span 1", rspan: "1 / span 2", big: true },
    { icon: "👨‍🏫", title: "অভিজ্ঞ প্রশিক্ষক", desc: "দক্ষ শিক্ষকদের তত্ত্বাবধান" },
    { icon: "📜", title: "জাতীয় সার্টিফিকেট", desc: "সরকার স্বীকৃত সনদ" },
    { icon: "💰", title: "৳১,৮৫০ থেকে", desc: "সাশ্রয়ী বিশ্বমানের শিক্ষা" },
    { icon: "🕐", title: "নমনীয় সময়", desc: "সকাল, বিকেল ও সন্ধ্যা ব্যাচ" },
    { icon: "🖥️", title: "আধুনিক ল্যাব — ৫০০+ শিক্ষার্থী", desc: "সর্বাধুনিক কম্পিউটার সজ্জিত ব্যবহারিক শিক্ষার পরিবেশ।", wide: true },
  ];
  return (
    <section style={{ padding: "100px 5%", background: t.bg2, borderTop: `1px solid ${t.p}12` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", background: `linear-gradient(135deg,${t.p},${t.s},${t.a})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerTxt 4s linear infinite" }}>আমাদের সুবিধাসমূহ</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridAutoRows: "minmax(150px,auto)", gap: 14 }} className="sm-g1">
          {/* Big cell */}
          <div className="sr d1 bsweep-wrap" style={{ gridColumn: "1", gridRow: "1 / span 2" }}>
            <div style={{ background: t.bg2, borderRadius: 17, padding: "30px 26px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "default" }}>
              <div style={{ fontSize: 42 }}>🏛️</div>
              <div>
                <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 19, color: t.tx, marginBottom: 10 }}>সরকার অনুমোদিত</h3>
                <p style={{ color: t.mu, fontSize: 14, lineHeight: 1.75 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড স্বীকৃত। আপনার সার্টিফিকেট সারাদেশে বৈধ।</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${t.p}14`, border: `1px solid ${t.p}28`, borderRadius: 8, padding: "7px 14px", marginTop: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.p, boxShadow: `0 0 8px ${t.p}` }} />
                <span style={{ color: t.p, fontSize: 12, fontWeight: 600, fontFamily: t.hf }}>Verified ✓</span>
              </div>
            </div>
          </div>
          {/* Small cells */}
          {[
            { icon: "👨‍🏫", t: "অভিজ্ঞ প্রশিক্ষক", d: "দক্ষ শিক্ষকদের সরাসরি তত্ত্বাবধানে শিক্ষা" },
            { icon: "📜", t: "জাতীয় সার্টিফিকেট", d: "কোর্স শেষে সরকার স্বীকৃত সনদ" },
            { icon: "💰", t: "৳১,৮৫০ থেকে শুরু", d: "সাশ্রয়ী মূল্যে বিশ্বমানের শিক্ষা" },
            { icon: "🕐", t: "নমনীয় সময়সূচী", d: "সকাল, বিকেল ও সন্ধ্যা ব্যাচ" },
          ].map((f, i) => (
            <div key={i} className={`sr d${i + 2}`} style={{ background: `${t.p}08`, border: `1px solid ${t.p}14`, borderRadius: 16, padding: "22px", display: "flex", flexDirection: "column", gap: 8, transition: "transform .3s,border-color .3s,box-shadow .3s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = t.p + "44"; e.currentTarget.style.boxShadow = `0 12px 40px ${t.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = t.p + "14"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28 }}>{f.icon}</div>
              <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 14, color: t.tx }}>{f.t}</div>
              <div style={{ color: t.mu, fontSize: 13, lineHeight: 1.65 }}>{f.d}</div>
            </div>
          ))}
          {/* Wide cell */}
          <div className="sr d6" style={{ gridColumn: "1 / span 3", background: `${t.p}06`, border: `1px solid ${t.tx}08`, borderRadius: 18, padding: "26px 28px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", transition: "border-color .3s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.p + "28"} onMouseLeave={e => e.currentTarget.style.borderColor = `${t.tx}08`}
          >
            <div style={{ fontSize: 44 }}>🖥️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 18, color: t.tx, marginBottom: 6 }}>আধুনিক কম্পিউটার ল্যাব</h3>
              <p style={{ color: t.mu, fontSize: 14, lineHeight: 1.7 }}>সর্বাধুনিক কম্পিউটার সজ্জিত পরিবেশ — হাতে-কলমে শিক্ষায় দ্রুত দক্ষতা।</p>
            </div>
            <div style={{ background: `${t.p}10`, border: `1px solid ${t.p}22`, borderRadius: 14, padding: "18px 24px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 28, color: t.p, textShadow: `0 0 20px ${t.glow}` }}>৫০০+</div>
              <div style={{ color: t.mu, fontSize: 12, marginTop: 4 }}>শিক্ষার্থী</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════
function HowItWorks({ t }) {
  const steps = [
    { n: "01", icon: "📞", title: "যোগাযোগ করুন", desc: "WhatsApp বা সরাসরি এসে ভর্তির বিস্তারিত জানুন" },
    { n: "02", icon: "📋", title: "কোর্স বেছে নিন", desc: "আপনার সুবিধামতো কোর্স ও ব্যাচ নির্বাচন করুন" },
    { n: "03", icon: "🎓", title: "শিখুন ও এগিয়ে যান", desc: "সার্টিফিকেট নিয়ে ক্যারিয়ার গড়ুন" },
  ];
  return (
    <section style={{ padding: "100px 5%", background: t.bg, borderTop: `1px solid ${t.p}10`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${t.a}07,transparent)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", background: `linear-gradient(135deg,${t.a},${t.p})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>মাত্র তিন ধাপে শুরু করুন</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 32, position: "relative" }}>
          <div className="hide-sm" style={{ position: "absolute", top: 42, left: "16%", right: "16%", height: 1, background: `linear-gradient(90deg,${t.p}44,${t.a}66,${t.s}44)`, zIndex: 0 }}>
            <div style={{ position: "absolute", inset: "-2px 0", background: `linear-gradient(90deg,${t.p}11,${t.a}22,${t.s}11)`, filter: "blur(6px)" }} />
          </div>
          {steps.map((s, i) => (
            <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 22 }}>
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: `radial-gradient(circle,${t.p}18,rgba(0,0,0,0))`, border: `1px solid ${t.p}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto", boxShadow: `0 0 28px ${t.glow}20`, transition: "box-shadow .3s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 50px ${t.glow}`} onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 28px ${t.glow}20`}>{s.icon}</div>
                <div style={{ position: "absolute", top: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${t.p},${t.a})`, color: t.bg, fontSize: 11, fontWeight: 800, fontFamily: t.hf, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${t.glow}` }}>{i + 1}</div>
              </div>
              <div style={{ color: t.mu + "66", fontSize: 11, letterSpacing: ".2em", marginBottom: 8 }}>{s.n}</div>
              <h3 style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 17, color: t.tx, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: t.mu, fontSize: 14, lineHeight: 1.78 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// TESTIMONIALS MARQUEE
// ═══════════════════════════════════════
function TestimonialsMarquee({ t }) {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section style={{ padding: "100px 0", background: t.bg2, borderTop: `1px solid ${t.p}10`, overflow: "hidden", position: "relative" }}>
      <div className="sr" style={{ textAlign: "center", padding: "0 5%", marginBottom: 52 }}>
        <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", background: `linear-gradient(135deg,${t.tx},${t.p})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>শিক্ষার্থীরা যা বলছেন</h2>
      </div>
      <div style={{ display: "flex", gap: 20, width: "max-content", animation: "marqueeScroll 34s linear infinite" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"} onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((item, i) => (
          <TiltGlareCard key={i} max={6} style={{ width: 340, flexShrink: 0, background: `rgba(255,255,255,.03)`, border: `1px solid ${t.tx}0A`, borderRadius: 18, padding: "26px", transition: "border-color .3s,box-shadow .3s" }}>
            <div style={{ display: "flex", marginBottom: 14 }}>
              {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 16, textShadow: "0 0 8px #F59E0B88" }}>{s}</span>)}
            </div>
            <p style={{ color: t.tx + "88", lineHeight: 1.82, fontSize: 14, marginBottom: 22, fontStyle: "italic" }}>"{item.q}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${t.p},${t.s})`, display: "flex", alignItems: "center", justifyContent: "center", color: t.bg, fontFamily: t.hf, fontWeight: 800, fontSize: 16, boxShadow: `0 0 14px ${t.glow}` }}>{item.n[0]}</div>
              <div>
                <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 15, color: t.tx }}>{item.n}</div>
                <div style={{ fontSize: 12, color: t.mu }}>{item.r}</div>
              </div>
            </div>
          </TiltGlareCard>
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 130, background: `linear-gradient(to right,${t.bg2},transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 130, background: `linear-gradient(to left,${t.bg2},transparent)`, pointerEvents: "none" }} />
    </section>
  );
}

// ═══════════════════════════════════════
// CTA BANNER
// ═══════════════════════════════════════
function CTABanner({ t }) {
  return (
    <section style={{ padding: "0 5% 100px" }}>
      <div className="sr" style={{ borderRadius: 28, overflow: "hidden", position: "relative", background: `radial-gradient(ellipse at 20% 50%,${t.p}14,transparent 60%),radial-gradient(ellipse at 80% 50%,${t.a}10,transparent 60%),${t.bg2}`, padding: "80px 8%", border: `1px solid ${t.p}20`, boxShadow: `0 0 100px ${t.glow}10` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1.5px 1.5px,${t.p}07 1px,transparent 0)`, backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", fontFamily: t.hf, fontWeight: 900, fontSize: 200, color: `${t.p}06`, lineHeight: 1, pointerEvents: "none" }}>৬০%</div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${t.p}12`, border: `1px solid ${t.p}28`, borderRadius: 50, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.p, display: "inline-block", boxShadow: `0 0 10px ${t.p}`, animation: "pulseGlow 2s ease infinite" }} />
              <span style={{ color: t.p, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontFamily: t.hf }}>সীমিত সময়ের অফার</span>
            </div>
            <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.1, marginBottom: 16, background: `linear-gradient(135deg,${t.a},${t.p})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              এখনই ভর্তি হন,<br /><span style={{ WebkitTextFillColor: t.tx }}>পান ৬০% বিশেষ ছাড়!</span>
            </h2>
            <p style={{ color: t.tx + "88", fontSize: 15, lineHeight: 1.82 }}>নতুন সেশনে ভর্তি চলছে। আসন সীমিত — দেরি না করে আজই যোগাযোগ করুন।</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button style={{ background: `linear-gradient(135deg,${t.a},${t.p})`, color: t.bg, border: "none", padding: "18px 44px", borderRadius: 12, fontFamily: t.hf, fontWeight: 700, fontSize: 17, cursor: "pointer", transition: "all .3s", boxShadow: `0 0 30px ${t.glow}` }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = `0 0 52px ${t.glow}`; }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 30px ${t.glow}`; }}
            >🎓 এখনই ভর্তি হোন</button>
            <a href="https://www.facebook.com/share/1E2jAYRKhz/" target="_blank" rel="noreferrer" style={{ color: t.tx + "60", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = t.tx} onMouseLeave={e => e.currentTarget.style.color = t.tx + "60"}
            >📘 Facebook Page দেখুন →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════
function Footer({ t }) {
  return (
    <footer style={{ background: t.bg2, borderTop: `1px solid ${t.p}10` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 5% 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 44 }} className="sm-g1 sm-col">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg,${t.p},${t.a})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: t.bg, boxShadow: `0 0 18px ${t.glow}` }}>দৃ</div>
              <div>
                <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 14, color: t.tx }}>Dristy Computer Training Center</div>
                <div style={{ fontSize: 11, color: t.mu }}>গোপালপুর, বাংলাদেশ</div>
              </div>
            </div>
            <p style={{ color: t.mu + "AA", fontSize: 13, lineHeight: 1.85, maxWidth: 290, marginBottom: 18 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত। সুলভ মূল্যে মানসম্পন্ন আইটি শিক্ষা।</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[["📘", "Facebook", "https://www.facebook.com/share/1E2jAYRKhz/"], ["💬", "WhatsApp", "#"]].map(([ic, l, hr]) => (
                <a key={l} href={hr} target="_blank" rel="noreferrer" style={{ background: `${t.p}08`, border: `1px solid ${t.p}18`, borderRadius: 8, padding: "8px 13px", color: t.mu, fontSize: 13, textDecoration: "none", transition: "all .2s", display: "flex", alignItems: "center", gap: 5 }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${t.p}16`; e.currentTarget.style.borderColor = t.p + "40"; e.currentTarget.style.color = t.p; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${t.p}08`; e.currentTarget.style.borderColor = t.p + "18"; e.currentTarget.style.color = t.mu; }}
                >{ic} {l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 13, marginBottom: 16, color: t.tx }}>কোর্সসমূহ</div>
            {["৩ মাসের কোর্স", "৬ মাসের কোর্স", "১ বছরের কোর্স", "অফিস কোর্স", "গ্রাফিক ডিজাইন"].map(l => (
              <div key={l} style={{ color: t.mu + "BB", fontSize: 13, marginBottom: 9, cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = t.p} onMouseLeave={e => e.target.style.color = t.mu + "BB"}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: t.hf, fontWeight: 700, fontSize: 13, marginBottom: 16, color: t.tx }}>যোগাযোগ</div>
            {[["📍", "গোপালপুর, বাংলাদেশ"], ["💬", "WhatsApp-এ যোগাযোগ"], ["📘", "Facebook Page"], ["⏰", "শনি–বৃহস্পতি: সকাল ৯টা–রাত ৮টা"]].map(([ic, text]) => (
              <div key={text} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{ic}</span>
                <span style={{ color: t.mu + "AA", fontSize: 13, lineHeight: 1.65 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${t.p}10`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: t.mu + "66", fontSize: 12 }}>© ২০২৫ Dristy Computer Training Center. সর্বস্বত্ব সংরক্ষিত।</span>
          <span style={{ color: t.mu + "44", fontSize: 11 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত</span>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════
// THEME SWITCHER (toggle slide UI)
// ═══════════════════════════════════════
function ThemeSwitcher({ current, onChange, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 28, left: 24, zIndex: 1000 }}>
      {open && (
        <div style={{ position: "absolute", bottom: 70, left: 0, background: `${t.bg2}F0`, backdropFilter: "blur(20px)", border: `1px solid ${t.p}22`, borderRadius: 16, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 6, minWidth: 190, boxShadow: `0 0 40px rgba(0,0,0,.5)` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: t.mu, textTransform: "uppercase", marginBottom: 6, paddingLeft: 2 }}>THEMES</div>
          {Object.entries(THEMES).map(([key, th]) => (
            <button key={key} onClick={() => { onChange(key); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, background: current === key ? `${th.p}18` : "transparent", border: `1px solid ${current === key ? th.p + "44" : "transparent"}`, borderRadius: 10, padding: "9px 12px", cursor: "pointer", transition: "all .2s", width: "100%" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: th.p, boxShadow: `0 0 6px ${th.p}` }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: th.a }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: th.s }} />
              </div>
              <span style={{ color: current === key ? th.p : t.mu, fontSize: 13, fontWeight: current === key ? 700 : 400, fontFamily: t.hf }}>{th.emoji} {th.name}</span>
            </button>
          ))}
        </div>
      )}
      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)} style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${t.p},${t.a})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 0 24px ${t.glow}`, transition: "transform .3s", transform: open ? "rotate(180deg)" : "none" }}>🎨</button>
    </div>
  );
}

// ═══════════════════════════════════════
// FLOATING WHATSAPP
// ═══════════════════════════════════════
function FloatingWA({ t }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const to = setTimeout(() => setShow(true), 2000); return () => clearTimeout(to); }, []);
  return (
    <a href="https://wa.me/" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 28, right: 24, zIndex: 1000, opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(.3)", transition: "all .65s cubic-bezier(.16,1,.3,1)", textDecoration: "none" }}>
      <div style={{ position: "absolute", inset: -7, borderRadius: "50%", background: "rgba(37,211,102,.22)", animation: "pulseGlow 2.2s ease infinite" }} />
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#25D366,#128C7E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 30px rgba(37,211,102,.55)", transition: "transform .3s", position: "relative" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.14)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>💬</div>
    </a>
  );
}

// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════
export default function App() {
  const [themeKey, setThemeKey] = useState("cyber");
  const [loaded, setLoaded] = useState(false);
  const t = THEMES[themeKey];

  useScrollReveal();
  useEffect(() => { const to = setTimeout(() => setLoaded(true), 1400); return () => clearTimeout(to); }, []);

  if (!loaded) return (
    <>
      <style>{CSS_BASE + themeCSSVars(t)}</style>
      <SkeletonPage t={t} />
    </>
  );

  return (
    <>
      <style>{CSS_BASE + themeCSSVars(t)}</style>
      <ScrollProgressBar t={t} />
      <Navbar t={t} />
      <Hero t={t} />
      <StatsBar t={t} />
      <CourseCarousel t={t} />
      <BentoFeatures t={t} />
      <HowItWorks t={t} />
      <TestimonialsMarquee t={t} />
      <CTABanner t={t} />
      <Footer t={t} />
      <ThemeSwitcher current={themeKey} onChange={setThemeKey} t={t} />
      <FloatingWA t={t} />
    </>
  );
}
