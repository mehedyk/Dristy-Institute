import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg: "#020817", bg2: "#060E1D", surface: "#0D1B2E",
  blue: "#38BDF8", blueDeep: "#0EA5E9",
  cyan: "#22D3EE", orange: "#F97316", orangeDeep: "#EA580C",
  purple: "#A78BFA", green: "#34D399",
  text: "#F1F5F9", textMuted: "#64748B",
  border: "rgba(255,255,255,0.06)",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Hind Siliguri','Poppins',system-ui,sans-serif;color:#F1F5F9;background:#020817;overflow-x:hidden;line-height:1.6}
  h1,h2,h3,h4{font-family:'Poppins','Hind Siliguri',sans-serif}
  .sr{opacity:0;transform:translateY(44px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr-l{opacity:0;transform:translateX(-60px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr-r{opacity:0;transform:translateX(60px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr-s{opacity:0;transform:scale(.85);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .sr.on,.sr-l.on,.sr-r.on,.sr-s.on{opacity:1!important;transform:none!important}
  .d1{transition-delay:.04s}.d2{transition-delay:.13s}.d3{transition-delay:.22s}
  .d4{transition-delay:.31s}.d5{transition-delay:.40s}.d6{transition-delay:.49s}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
  @keyframes floatX{0%,100%{transform:translateX(0) rotate(0deg)}50%{transform:translateX(-16px) rotate(4deg)}}
  @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes shimmerTxt{from{background-position:-200% center}to{background-position:200% center}}
  @keyframes pulseGlow{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
  @keyframes countIn{from{opacity:0;transform:translateY(18px) scale(.8)}to{opacity:1;transform:none}}
  @keyframes scanLine{0%{top:-10%}100%{top:110%}}
  @keyframes borderPulse{0%,100%{border-color:rgba(56,189,248,.2)}50%{border-color:rgba(56,189,248,.6)}}
  .grad-blue{background:linear-gradient(135deg,#fff 0%,#BAE6FD 40%,#38BDF8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .grad-fire{background:linear-gradient(135deg,#FCD34D 0%,#F97316 50%,#EF4444 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .grad-cyan{background:linear-gradient(135deg,#A78BFA,#38BDF8,#22D3EE);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerTxt 4s linear infinite}
  .tilt{transition:transform .12s ease,box-shadow .3s ease;transform-style:preserve-3d;will-change:transform}
  .btn-fire{position:relative;overflow:hidden;background:linear-gradient(135deg,#F97316,#DC2626);color:#fff;border:none;padding:15px 38px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 0 28px rgba(249,115,22,.5),0 4px 20px rgba(0,0,0,.4);transition:all .3s;display:inline-flex;align-items:center;gap:8px}
  .btn-fire::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:skewX(-20deg);transition:left .55s ease}
  .btn-fire:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 0 50px rgba(249,115,22,.7),0 8px 30px rgba(0,0,0,.5)}
  .btn-fire:hover::after{left:160%}
  .btn-blue{position:relative;overflow:hidden;background:linear-gradient(135deg,#0EA5E9,#0369A1);color:#fff;border:none;padding:14px 32px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 0 22px rgba(14,165,233,.45),0 4px 20px rgba(0,0,0,.3);transition:all .3s;display:inline-flex;align-items:center;gap:8px}
  .btn-blue:hover{transform:translateY(-3px);box-shadow:0 0 42px rgba(14,165,233,.65),0 8px 30px rgba(0,0,0,.4)}
  .btn-ghost{background:transparent;color:rgba(241,245,249,.7);border:1px solid rgba(255,255,255,.14);padding:14px 28px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .3s;display:inline-flex;align-items:center;gap:8px}
  .btn-ghost:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.3);color:#fff;transform:translateY(-2px)}
  @media(max-width:768px){.hide-sm{display:none!important}.sm-col{flex-direction:column!important}.sm-full{width:100%!important;flex:none!important;min-width:unset!important}.sm-center{text-align:center!important;align-items:center!important;justify-content:center!important}.sm-g1{grid-template-columns:1fr!important}.sm-g2{grid-template-columns:1fr 1fr!important}}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#020817}::-webkit-scrollbar-thumb{background:#0EA5E9;border-radius:2px}
`;

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".sr,.sr-l,.sr-r,.sr-s").forEach((el) => obs.observe(el));
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
    let s = null; const dur = 2200;
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
function useScramble(text, active, delay = 0) {
  const [disp, setDisp] = useState(text);
  useEffect(() => {
    if (!active) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let iter = 0;
    const to = setTimeout(() => {
      const iv = setInterval(() => {
        setDisp(text.split("").map((c, i) => {
          if (c === " ") return " ";
          if (i < iter) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));
        iter += 0.35;
        if (iter > text.length) { setDisp(text); clearInterval(iv); }
      }, 40);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(to);
  }, [active, text, delay]);
  return disp;
}
function useTilt(max = 14) {
  const ref = useRef(null);
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(16px)`;
  }, [max]);
  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let id;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.3 + 0.2,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      a: Math.random() * .5 + .1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + c.width) % c.width;
        p.y = (p.y + p.vy + c.height) % c.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${.14 * (1 - d / 110)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

const COURSES = [
  {
    dur: "৩ মাস", eng: "3 Months", title: "অফিস বেসিক", price: "১,৮৫০",
    topics: ["MS Word, Excel, PowerPoint", "বাংলা ও ইংরেজি টাইপিং", "Email ও Internet", "Basic Computer Skills"],
    icon: "💼", c: T.blue, glow: "rgba(56,189,248,.22)", border: "rgba(56,189,248,.22)",
    bg: "linear-gradient(145deg,rgba(14,165,233,.12),rgba(3,105,161,.05))",
  },
  {
    dur: "৬ মাস", eng: "6 Months", title: "অফিস + ডিজাইন", price: "৩,৫০০", tag: "সবচেয়ে জনপ্রিয়",
    topics: ["অফিস বেসিক সম্পূর্ণ", "Adobe Photoshop & Illustrator", "Logo ও Banner Design", "Basic Accounting"],
    icon: "🎨", c: T.orange, glow: "rgba(249,115,22,.28)", border: "rgba(249,115,22,.28)",
    bg: "linear-gradient(145deg,rgba(249,115,22,.12),rgba(234,88,12,.05))", hi: true,
  },
  {
    dur: "১ বছর", eng: "1 Year", title: "প্রফেশনাল", price: "৬,০০০",
    topics: ["অফিস + ডিজাইন সম্পূর্ণ", "Web Design (HTML/CSS)", "Accounting Software", "জাতীয় সার্টিফিকেট"],
    icon: "🏆", c: T.purple, glow: "rgba(167,139,250,.22)", border: "rgba(167,139,250,.22)",
    bg: "linear-gradient(145deg,rgba(139,92,246,.12),rgba(109,40,217,.05))",
  },
];

const TESTIMONIALS = [
  { n: "রাহেলা বেগম", r: "৬ মাস কোর্স সম্পন্ন", q: "এখানে শিখে আমি একটি অফিসে ডেটা এন্ট্রি অপারেটর হিসেবে কাজ করছি। শিক্ষকরা অনেক ধৈর্যশীল।" },
  { n: "মো. আরিফ হোসেন", r: "১ বছর কোর্স সম্পন্ন", q: "গ্রাফিক ডিজাইনে ফ্রিল্যান্সিং করে ভালো আয় করছি। প্রফেশনাল কোর্সটি আমার জীবন বদলে দিয়েছে।" },
  { n: "সুমাইয়া আক্তার", r: "৩ মাস কোর্স সম্পন্ন", q: "ছোট কোর্স কিন্তু শেখার মান অনেক উন্নত। ফি অনেক সাশ্রয়ী এবং পরিবেশ খুবই ভালো।" },
  { n: "কামাল উদ্দিন", r: "৬ মাস কোর্স সম্পন্ন", q: "এখন নিজেই ব্যানার ও লোগো ডিজাইন করি। দৃষ্টি কম্পিউটারের জন্য অনেক কৃতজ্ঞ।" },
  { n: "নাজমা বেগম", r: "১ বছর কোর্স সম্পন্ন", q: "ওয়েব ডিজাইন শিখে অনলাইনে কাজ করছি। এই সুযোগ না পেলে হয়তো সম্ভব হতো না।" },
];

function Navbar() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, height: 68,
      padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all .4s ease",
      background: sc ? "rgba(2,8,23,.94)" : "transparent",
      backdropFilter: sc ? "blur(20px)" : "none",
      borderBottom: sc ? "1px solid rgba(255,255,255,.06)" : "1px solid transparent",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,#0EA5E9,#38BDF8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Poppins,sans-serif",
          boxShadow: "0 0 20px rgba(14,165,233,.55)",
        }}>দৃ</div>
        <div>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.2 }}>Dristy Computer</div>
          <div style={{ fontSize: 10, color: T.textMuted }}>Training Center, Gopalpur</div>
        </div>
      </div>
      <div className="hide-sm" style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["কোর্সসমূহ", "কেন আমরা", "যোগাযোগ"].map(l => (
          <span key={l} style={{ color: T.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "color .2s", fontFamily: "Poppins,sans-serif" }}
            onMouseEnter={e => e.target.style.color = T.blue}
            onMouseLeave={e => e.target.style.color = T.textMuted}
          >{l}</span>
        ))}
      </div>
      <button className="btn-blue hide-sm" style={{ padding: "9px 22px", fontSize: 13 }}>ভর্তি হোন</button>
    </nav>
  );
}

function Hero() {
  const [on, setOn] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [heroRef, heroIn] = useInView(0.1);
  const s1 = useScramble("কম্পিউটার শিখুন", heroIn, 300);
  const s2 = useScramble("ক্যারিয়ার গড়ুন", heroIn, 700);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const m = e => setMouse({ x: (e.clientX / window.innerWidth - .5) * 40, y: (e.clientY / window.innerHeight - .5) * 40 });
    const s = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", m);
    window.addEventListener("scroll", s, { passive: true });
    return () => { window.removeEventListener("mousemove", m); window.removeEventListener("scroll", s); };
  }, []);

  const a = (d, ex = {}) => ({
    opacity: on ? 1 : 0, transform: on ? "none" : "translateY(30px)",
    transition: `opacity .85s ease ${d}, transform .85s cubic-bezier(.16,1,.3,1) ${d}`, ...ex,
  });

  return (
    <section ref={heroRef} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "120px 5% 80px", background: T.bg }}>
      <ParticleCanvas />
      {/* Parallax orbs */}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,.1) 0%,transparent 70%)", top: `calc(-5% + ${-mouse.y * .4}px)`, left: `calc(25% + ${mouse.x * .4}px)`, transform: `translateY(${-scrollY * .18}px)`, transition: "top .1s,left .1s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.09) 0%,transparent 70%)", bottom: "0%", right: `calc(5% + ${-mouse.x * .3}px)`, transform: `translateY(${scrollY * .12}px)`, transition: "right .15s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 70%)", top: "60%", left: `calc(10% + ${mouse.x * .2}px)`, pointerEvents: "none" }} />
      {/* Rotating rings */}
      {[800, 560, 360].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: `1px solid rgba(56,189,248,${.04 - i * .01})`, top: "50%", left: "50%", transform: `translate(-50%,-50%) translateY(${-scrollY * .05}px)`, animation: `rotateSlow ${50 + i * 20}s linear infinite ${i % 2 ? "reverse" : ""}`, pointerEvents: "none" }} />
      ))}
      {/* Scan line effect */}
      <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,rgba(56,189,248,.15),transparent)", animation: "scanLine 8s linear infinite", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }} className="sm-full sm-center">
            <div style={{ ...a("0s"), display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(14,165,233,.08)", border: "1px solid rgba(14,165,233,.25)", borderRadius: 50, padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue, boxShadow: "0 0 10px rgba(56,189,248,.9)", animation: "pulseGlow 2s ease infinite" }} />
              <span style={{ color: "#7DD3FC", fontSize: 12, fontWeight: 600, fontFamily: "Poppins,sans-serif", letterSpacing: ".04em" }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত</span>
            </div>
            <h1 style={{ ...a("0.1s"), fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(38px,5.5vw,68px)", lineHeight: 1.05, marginBottom: 16 }}>
              <span className="grad-blue" style={{ display: "block", fontFamily: "monospace" }}>{s1}</span>
              <span className="grad-fire" style={{ display: "block", fontFamily: "monospace" }}>{s2}</span>
            </h1>
            <p style={{ ...a("0.25s"), fontSize: "clamp(14px,1.7vw,16px)", color: "rgba(241,245,249,.58)", lineHeight: 1.88, marginBottom: 38, maxWidth: 460 }}>
              দৃষ্টি কম্পিউটার প্রশিক্ষণ ইনস্টিটিউটে ৩ মাস, ৬ মাস ও ১ বছর মেয়াদী কোর্স। মাত্র{" "}
              <strong style={{ color: T.orange, textShadow: "0 0 14px rgba(249,115,22,.6)" }}>৳১,৮৫০</strong> থেকে শুরু।
            </p>
            <div style={{ ...a("0.35s"), display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-fire" style={{ fontSize: 16, padding: "16px 40px" }}>🎓 ভর্তি হোন এখনই</button>
              <button className="btn-ghost">📞 কথা বলুন</button>
            </div>
            <div style={{ ...a("0.52s"), display: "inline-flex", alignItems: "center", gap: 12, marginTop: 36, background: "rgba(249,115,22,.07)", border: "1px solid rgba(249,115,22,.2)", borderRadius: 14, padding: "14px 20px" }}>
              <span style={{ fontSize: 24 }}>🔥</span>
              <div>
                <div style={{ color: T.orange, fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 20, textShadow: "0 0 16px rgba(249,115,22,.5)" }}>৬০% বিশেষ ছাড়!</div>
                <div style={{ color: "rgba(241,245,249,.45)", fontSize: 12 }}>সীমিত সময়ের অফার — আসন সীমিত</div>
              </div>
            </div>
          </div>

          {/* Glassmorphic pricing card */}
          <div className="hide-sm" style={{
            opacity: on ? 1 : 0, transform: on ? "none" : "translateX(50px) scale(.9)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .5s",
            width: 310, flexShrink: 0,
          }}>
            <div style={{ background: "linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", backdropFilter: "blur(30px)", border: "1px solid rgba(56,189,248,.2)", borderRadius: 24, padding: "28px 24px", boxShadow: "0 0 60px rgba(14,165,233,.12),inset 0 1px 0 rgba(255,255,255,.08)", animation: "borderPulse 4s ease infinite" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ color: T.textMuted, fontSize: 12 }}>নতুন ভর্তি — ২০২৬</span>
                <span style={{ background: "linear-gradient(135deg,#F97316,#DC2626)", color: "#fff", fontSize: 10, padding: "3px 10px", borderRadius: 50, fontWeight: 700, boxShadow: "0 0 12px rgba(249,115,22,.6)" }}>LIVE</span>
              </div>
              {COURSES.map(c => (
                <div key={c.dur} style={{ background: c.hi ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${c.hi ? "rgba(249,115,22,.3)" : T.border}`, borderRadius: 12, padding: "13px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = c.hi ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.03)"}
                >
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{c.dur} {c.hi ? "⭐" : ""}</div>
                    <div style={{ color: T.textMuted, fontSize: 12 }}>{c.eng}</div>
                  </div>
                  <div style={{ color: c.c, fontWeight: 900, fontSize: 17, fontFamily: "Poppins,sans-serif", textShadow: `0 0 12px ${c.glow}` }}>৳{c.price}</div>
                </div>
              ))}
              <button className="btn-blue" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>এখনই শুরু করুন →</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to bottom,transparent,${T.bg})`, pointerEvents: "none" }} />
    </section>
  );
}

function StatsBar() {
  const [ref, inView] = useInView(.3);
  const s1 = useCounter(500, inView), s2 = useCounter(8, inView), s3 = useCounter(3, inView), s4 = useCounter(100, inView);
  const stats = [
    { v: s1, suf: "+", l: "শিক্ষার্থী প্রশিক্ষিত", icon: "👨‍💻", c: T.blue },
    { v: s2, suf: "+", l: "বছরের অভিজ্ঞতা", icon: "📅", c: T.orange },
    { v: s3, suf: "টি", l: "কোর্স প্রোগ্রাম", icon: "📚", c: T.purple },
    { v: s4, suf: "%", l: "সার্টিফিকেট প্রদান", icon: "🎓", c: T.cyan },
  ];
  return (
    <section ref={ref} style={{ background: T.bg2, padding: "72px 5%", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(40px,5vw,60px)", lineHeight: 1, color: s.c, textShadow: `0 0 30px ${s.c}55`, animation: inView ? `countIn .6s ease ${i * .1}s both` : "none" }}>
              {s.v}{s.suf}
            </div>
            <div style={{ color: T.textMuted, fontSize: 14, marginTop: 8, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section style={{ padding: "110px 5%", background: T.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,.04) 0%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,.07)", border: "1px solid rgba(56,189,248,.2)", borderRadius: 50, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: T.blue, textTransform: "uppercase" }}>আমাদের কোর্সসমূহ</span>
          </div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", marginBottom: 14 }}>
            <span className="grad-blue">কোর্স বেছে নিন</span>
          </h2>
          <p style={{ color: T.textMuted, fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>তিনটি মেয়াদে কোর্স — সময় ও বাজেট অনুযায়ী সেরাটি বেছে নিন।</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 28 }}>
          {COURSES.map((c, i) => {
            const tilt = useTilt(12);
            return (
              <div key={i} className={`sr d${i + 1}`}>
                <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="tilt" style={{ background: c.bg, borderRadius: 20, overflow: "hidden", border: `1px solid ${c.border}`, boxShadow: `0 0 40px ${c.glow},0 4px 24px rgba(0,0,0,.5)`, position: "relative", height: "100%" }}>
                  {c.hi && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${c.c},transparent)` }} />}
                  {c.tag && <div style={{ position: "absolute", top: 18, right: 18, background: `rgba(249,115,22,.15)`, color: T.orange, border: "1px solid rgba(249,115,22,.3)", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 50, fontFamily: "Poppins,sans-serif" }}>{c.tag}</div>}
                  <div style={{ padding: "28px 28px 0" }}>
                    <div style={{ fontSize: 38, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ color: c.c, fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 4 }}>{c.eng}</div>
                    <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 6, textShadow: `0 0 20px ${c.glow}` }}>{c.title}</h3>
                  </div>
                  <div style={{ padding: "16px 28px 28px" }}>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 18, marginBottom: 18 }}>
                      {c.topics.map(t => (
                        <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: c.c, fontWeight: 700 }}>✓</div>
                          <span style={{ color: "rgba(241,245,249,.68)", fontSize: 13 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                      <span style={{ fontSize: 12, color: T.textMuted }}>মাত্র</span>
                      <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: 30, color: c.c, textShadow: `0 0 20px ${c.glow}` }}>৳{c.price}</span>
                    </div>
                    <button style={{ width: "100%", padding: 13, borderRadius: 10, background: `linear-gradient(135deg,${c.c},${c.c}99)`, color: "#fff", border: "none", fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .3s", boxShadow: `0 0 20px ${c.glow}` }}
                      onMouseEnter={e => { e.target.style.boxShadow = `0 0 42px ${c.glow}`; e.target.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.target.style.boxShadow = `0 0 20px ${c.glow}`; e.target.style.transform = "none"; }}
                    >এই কোর্সে ভর্তি হোন →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BentoFeatures() {
  const bentoItems = [
    { icon: "🏛️", t: "সরকার অনুমোদিত", d: "বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক স্বীকৃত। সার্টিফিকেট সারাদেশে বৈধ।", c: T.blue, span: "1 / span 1", rspan: "1 / span 2", big: true },
    { icon: "👨‍🏫", t: "অভিজ্ঞ প্রশিক্ষক", d: "দক্ষ শিক্ষকদের তত্ত্বাবধানে", c: T.orange },
    { icon: "📜", t: "জাতীয় সার্টিফিকেট", d: "সরকার স্বীকৃত সনদ", c: T.purple },
    { icon: "💰", t: "৳১,৮৫০ থেকে শুরু", d: "সাশ্রয়ী মূল্যে বিশ্বমানের শিক্ষা", c: T.green },
    { icon: "🕐", t: "নমনীয় সময়সূচী", d: "সকাল, বিকেল ও সন্ধ্যা ব্যাচ", c: T.cyan },
    { icon: "🖥️", t: "আধুনিক ল্যাব + ৫০০+ শিক্ষার্থী", d: "সর্বাধুনিক কম্পিউটার সজ্জিত ল্যাব। হাতে-কলমে শিক্ষার মাধ্যমে দ্রুত দক্ষতা।", c: T.purple, wide: true },
  ];
  return (
    <section style={{ padding: "100px 5%", background: T.bg2, borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,46px)" }}>
            <span className="grad-cyan">আমাদের সুবিধাসমূহ</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridAutoRows: "minmax(150px,auto)", gap: 14 }} className="sm-g1">
          {/* Big left */}
          <div className="sr d1" style={{ gridColumn: "1", gridRow: "1 / span 2", background: "linear-gradient(145deg,rgba(14,165,233,.12),rgba(14,165,233,.03))", border: "1px solid rgba(56,189,248,.2)", borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", cursor: "default", transition: "border-color .3s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(56,189,248,.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(56,189,248,.2)"}
          >
            <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,.2),transparent)", pointerEvents: "none" }} />
            <div style={{ fontSize: 42 }}>🏛️</div>
            <div>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 10 }}>সরকার অনুমোদিত</h3>
              <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক স্বীকৃত। আপনার সার্টিফিকেট সারাদেশে বৈধ।</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(14,165,233,.1)", border: "1px solid rgba(56,189,248,.2)", borderRadius: 8, padding: "7px 14px", marginTop: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, boxShadow: `0 0 8px ${T.blue}` }} />
              <span style={{ color: T.blue, fontSize: 12, fontWeight: 600 }}>Verified ✓</span>
            </div>
          </div>
          {/* 4 small */}
          {[
            { icon: "👨‍🏫", t: "অভিজ্ঞ প্রশিক্ষক", d: "দক্ষ শিক্ষকদের তত্ত্বাবধানে শিক্ষা", c: T.orange, ci: "249,115,22" },
            { icon: "📜", t: "জাতীয় সার্টিফিকেট", d: "কোর্স শেষে সরকার স্বীকৃত সনদ", c: T.purple, ci: "167,139,250" },
            { icon: "💰", t: "৳১,৮৫০ থেকে", d: "সাশ্রয়ী মূল্যে বিশ্বমানের শিক্ষা", c: T.green, ci: "52,211,153" },
            { icon: "🕐", t: "নমনীয় ব্যাচ", d: "সকাল, বিকেল ও সন্ধ্যা", c: T.cyan, ci: "34,211,238" },
          ].map((f, i) => (
            <div key={i} className={`sr d${i + 2}`} style={{ background: `linear-gradient(145deg,rgba(${f.ci},.08),rgba(0,0,0,0))`, border: `1px solid rgba(${f.ci},.15)`, borderRadius: 16, padding: "22px", display: "flex", flexDirection: "column", gap: 8, transition: "transform .3s,border-color .3s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = `rgba(${f.ci},.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = `rgba(${f.ci},.15)`; }}
            >
              <div style={{ fontSize: 28 }}>{f.icon}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>{f.t}</div>
              <div style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.65 }}>{f.d}</div>
            </div>
          ))}
          {/* Wide bottom */}
          <div className="sr d6" style={{ gridColumn: "1 / span 3", background: "linear-gradient(135deg,rgba(56,189,248,.06),rgba(167,139,250,.06))", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "26px 28px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", transition: "border-color .3s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(56,189,248,.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"}
          >
            <div style={{ fontSize: 44 }}>🖥️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>আধুনিক কম্পিউটার ল্যাব</h3>
              <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.7 }}>সর্বাধুনিক কম্পিউটার সজ্জিত পরিবেশ — হাতে-কলমে শিক্ষায় দ্রুত দক্ষতা অর্জন।</p>
            </div>
            <div style={{ background: "rgba(56,189,248,.08)", border: "1px solid rgba(56,189,248,.18)", borderRadius: 14, padding: "18px 24px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: 28, color: T.blue, textShadow: `0 0 20px rgba(56,189,248,.4)` }}>৫০০+</div>
              <div style={{ color: T.textMuted, fontSize: 12, marginTop: 4 }}>শিক্ষার্থী</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: "📞", t: "যোগাযোগ করুন", d: "WhatsApp বা সরাসরি এসে ভর্তির বিস্তারিত জানুন", c: T.blue, ci: "56,189,248" },
    { n: "02", icon: "📋", t: "কোর্স বেছে নিন", d: "আপনার সুবিধামতো কোর্স ও ব্যাচ নির্বাচন করুন", c: T.orange, ci: "249,115,22" },
    { n: "03", icon: "🎓", t: "শিখুন ও এগিয়ে যান", d: "সার্টিফিকেট নিয়ে ক্যারিয়ার গড়ুন", c: T.purple, ci: "167,139,250" },
  ];
  return (
    <section style={{ padding: "100px 5%", background: T.bg, borderTop: "1px solid rgba(255,255,255,.05)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.04) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,46px)" }}>
            <span className="grad-fire">মাত্র তিন ধাপে শুরু করুন</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, position: "relative" }}>
          <div className="hide-sm" style={{ position: "absolute", top: 42, left: "16%", right: "16%", height: 1, background: `linear-gradient(90deg,${T.blue}33,${T.orange}66,${T.purple}33)`, zIndex: 0 }}>
            <div style={{ position: "absolute", top: "-1px", left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${T.blue}11,${T.orange}33,${T.purple}11)`, filter: "blur(5px)" }} />
          </div>
          {steps.map((s, i) => (
            <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                <div style={{ width: 86, height: 86, borderRadius: "50%", background: `radial-gradient(circle,rgba(${s.ci},.15),rgba(0,0,0,0))`, border: `1px solid rgba(${s.ci},.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto", boxShadow: `0 0 30px rgba(${s.ci},.2)`, transition: "box-shadow .3s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 50px rgba(${s.ci},.4)`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 30px rgba(${s.ci},.2)`}
                >{s.icon}</div>
                <div style={{ position: "absolute", top: -8, right: -8, width: 28, height: 28, borderRadius: "50%", background: s.c, color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "Poppins,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px rgba(${s.ci},.7)` }}>{i + 1}</div>
              </div>
              <div style={{ color: "rgba(100,116,139,.5)", fontSize: 11, letterSpacing: ".2em", marginBottom: 8 }}>{s.n}</div>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 10 }}>{s.t}</h3>
              <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.78 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section style={{ padding: "100px 0", background: T.bg2, borderTop: "1px solid rgba(255,255,255,.05)", overflow: "hidden", position: "relative" }}>
      <div className="sr" style={{ textAlign: "center", padding: "0 5%", marginBottom: 52 }}>
        <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,46px)" }}>
          <span className="grad-blue">শিক্ষার্থীরা যা বলছেন</span>
        </h2>
      </div>
      <div style={{ display: "flex", gap: 20, width: "max-content", animation: "marquee 32s linear infinite" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((t, i) => (
          <div key={i} style={{ width: 340, flexShrink: 0, background: "linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.01))", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "26px", cursor: "default", transition: "border-color .3s,box-shadow .3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(56,189,248,.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", marginBottom: 14 }}>
              {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 16, textShadow: "0 0 8px #F59E0B88" }}>{s}</span>)}
            </div>
            <p style={{ color: "rgba(241,245,249,.62)", lineHeight: 1.82, fontSize: 14, marginBottom: 22, fontStyle: "italic" }}>"{t.q}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${T.blue},${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 16, boxShadow: "0 0 16px rgba(56,189,248,.3)" }}>{t.n[0]}</div>
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>{t.n}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{t.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 140, background: `linear-gradient(to right,${T.bg2},transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 140, background: `linear-gradient(to left,${T.bg2},transparent)`, pointerEvents: "none" }} />
    </section>
  );
}

function CTABanner() {
  return (
    <section style={{ padding: "0 5% 100px" }}>
      <div className="sr" style={{ borderRadius: 28, overflow: "hidden", position: "relative", background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 30%,#0F172A 55%,#1C0A00 100%)", backgroundSize: "400% 400%", animation: "gradShift 12s ease infinite", padding: "80px 8%", border: "1px solid rgba(249,115,22,.15)", boxShadow: "0 0 100px rgba(249,115,22,.06),0 0 200px rgba(56,189,248,.04)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1.5px 1.5px,rgba(255,255,255,.04) 1px,transparent 0)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.14),transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: 220, color: "rgba(249,115,22,.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>৬০%</div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,.1)", border: "1px solid rgba(249,115,22,.25)", borderRadius: 50, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.orange, display: "inline-block", boxShadow: `0 0 10px ${T.orange}`, animation: "pulseGlow 2s ease infinite" }} />
              <span style={{ color: T.orange, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>সীমিত সময়ের অফার</span>
            </div>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>
              <span className="grad-fire">এখনই ভর্তি হন,</span><br />
              <span style={{ color: "#fff" }}>পান ৬০% বিশেষ ছাড়!</span>
            </h2>
            <p style={{ color: "rgba(241,245,249,.58)", fontSize: 15, lineHeight: 1.82 }}>নতুন সেশনে ভর্তি চলছে। আসন সীমিত — দেরি না করে আজই যোগাযোগ করুন।</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button className="btn-fire" style={{ fontSize: 18, padding: "18px 46px" }}>🎓 এখনই ভর্তি হোন</button>
            <a href="https://www.facebook.com/share/1E2jAYRKhz/" target="_blank" rel="noreferrer" style={{ color: "rgba(241,245,249,.5)", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(241,245,249,.5)"}
            >📘 Facebook Page দেখুন →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.bg2, borderTop: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 5% 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="sm-g1 sm-col">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#0EA5E9,#38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", boxShadow: "0 0 20px rgba(14,165,233,.45)" }}>দৃ</div>
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15 }}>Dristy Computer Training Center</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>গোপালপুর, বাংলাদেশ</div>
              </div>
            </div>
            <p style={{ color: "rgba(100,116,139,.7)", fontSize: 13, lineHeight: 1.85, maxWidth: 300, marginBottom: 20 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত। সুলভ মূল্যে মানসম্পন্ন আইটি শিক্ষা।</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["📘", "Facebook", "https://www.facebook.com/share/1E2jAYRKhz/"], ["💬", "WhatsApp", "#"]].map(([ic, l, hr]) => (
                <a key={l} href={hr} target="_blank" rel="noreferrer" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "8px 14px", color: T.textMuted, fontSize: 13, textDecoration: "none", transition: "all .2s", display: "flex", alignItems: "center", gap: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,.08)"; e.currentTarget.style.borderColor = "rgba(56,189,248,.3)"; e.currentTarget.style.color = T.blue; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.color = T.textMuted; }}
                >{ic} {l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 18, color: "#fff" }}>কোর্সসমূহ</div>
            {["৩ মাসের কোর্স", "৬ মাসের কোর্স", "১ বছরের কোর্স", "অফিস কোর্স", "গ্রাফিক ডিজাইন"].map(l => (
              <div key={l} style={{ color: T.textMuted, fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = T.blue}
                onMouseLeave={e => e.target.style.color = T.textMuted}
              >{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 18, color: "#fff" }}>যোগাযোগ</div>
            {[["📍", "গোপালপুর, বাংলাদেশ"], ["💬", "WhatsApp-এ যোগাযোগ"], ["📘", "Facebook Page"], ["⏰", "শনি–বৃহস্পতি: সকাল ৯টা–রাত ৮টা"]].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{ic}</span>
                <span style={{ color: "rgba(100,116,139,.7)", fontSize: 13, lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(100,116,139,.5)", fontSize: 13 }}>© ২০২৬ Dristy Computer Training Center. সর্বস্বত্ব সংরক্ষিত।</span>
          <span style={{ color: "rgba(100,116,139,.3)", fontSize: 12 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWA() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); }, []);
  return (
    <a href="https://wa.me/" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 28, right: 24, zIndex: 1000, opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(.3)", transition: "all .65s cubic-bezier(.16,1,.3,1)", textDecoration: "none" }}>
      <div style={{ position: "absolute", inset: -7, borderRadius: "50%", background: "rgba(37,211,102,.22)", animation: "pulseGlow 2.2s ease infinite" }} />
      <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#25D366,#128C7E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 0 32px rgba(37,211,102,.55)", transition: "transform .3s", position: "relative" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.14)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >💬</div>
    </a>
  );
}

export default function App() {
  useScrollReveal();
  return (
    <>
      <style>{STYLES}</style>
      <Navbar />
      <Hero />
      <StatsBar />
      <Courses />
      <BentoFeatures />
      <HowItWorks />
      <TestimonialsMarquee />
      <CTABanner />
      <Footer />
      <FloatingWA />
    </>
  );
}
