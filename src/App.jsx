import { useState, useEffect, useRef } from "react";

// ── Design Tokens (UI UX Pro Max: Trust & Authority + B2B palette) ──
const C = {
  primary: "#1E3A8A",
  primaryLight: "#2563EB",
  primaryPale: "#EFF6FF",
  accent: "#F97316",
  accentDark: "#EA580C",
  accentPale: "#FFF7ED",
  text: "#0F172A",
  textMid: "#334155",
  textMuted: "#64748B",
  border: "#E2E8F0",
  bg: "#FFFFFF",
  bgAlt: "#F8FAFC",
  bgDark: "#0F172A",
  gold: "#F59E0B",
  green: "#10B981",
};

// ── CSS ──
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Hind Siliguri','Poppins',system-ui,sans-serif;color:#0F172A;background:#fff;overflow-x:hidden;line-height:1.6}
  h1,h2,h3,h4{font-family:'Poppins','Hind Siliguri',sans-serif;letter-spacing:-0.02em}

  /* ── Scroll Reveal ── */
  .sr{opacity:0;transform:translateY(40px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .sr-l{opacity:0;transform:translateX(-50px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .sr-r{opacity:0;transform:translateX(50px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .sr-s{opacity:0;transform:scale(.88);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .sr.on,.sr-l.on,.sr-r.on,.sr-s.on{opacity:1!important;transform:none!important}
  .d1{transition-delay:.05s}.d2{transition-delay:.15s}.d3{transition-delay:.25s}
  .d4{transition-delay:.35s}.d5{transition-delay:.45s}.d6{transition-delay:.55s}

  /* ── Keyframes ── */
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
  @keyframes floatX{0%,100%{transform:translateX(0) rotate(0deg)}50%{transform:translateX(-14px) rotate(3deg)}}
  @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.4)}60%{box-shadow:0 0 0 10px rgba(249,115,22,0)}}
  @keyframes shimmer{from{transform:translateX(-200%) skewX(-20deg)}to{transform:translateX(300%) skewX(-20deg)}}
  @keyframes heroIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
  @keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes waPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.45)}60%{box-shadow:0 0 0 14px rgba(37,211,102,0)}}

  /* ── Card hover ── */
  .lift{transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease}
  .lift:hover{transform:translateY(-10px) scale(1.01);box-shadow:0 24px 60px rgba(30,58,138,.18)!important}

  /* ── Buttons ── */
  .btn-o{background:linear-gradient(135deg,#F97316,#EA580C);color:#fff;border:none;padding:14px 32px;border-radius:10px;
    font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;cursor:pointer;
    transition:all .3s ease;position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:8px}
  .btn-o::after{content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);
    transform:skewX(-20deg);transition:left .5s ease}
  .btn-o:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(249,115,22,.45)}
  .btn-o:hover::after{left:180%}
  .btn-g{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5);padding:12px 28px;border-radius:10px;
    font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;cursor:pointer;
    transition:all .3s;display:inline-flex;align-items:center;gap:8px}
  .btn-g:hover{background:rgba(255,255,255,.1);border-color:#fff;transform:translateY(-2px)}

  .sec-tag{display:inline-block;background:#FFF7ED;color:#EA580C;border:1px solid rgba(249,115,22,.22);
    padding:4px 14px;border-radius:50px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px}

  /* ── Responsive ── */
  @media(max-width:768px){
    .hide-sm{display:none!important}
    .sm-col{flex-direction:column!important}
    .sm-full{width:100%!important;flex:none!important}
    .sm-center{text-align:center!important;align-items:center!important;justify-content:center!important}
    .sm-grid1{grid-template-columns:1fr!important}
    .sm-px{padding-left:20px!important;padding-right:20px!important}
  }
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:#2563EB;border-radius:3px}
`;

// ── Hooks ──
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    document.querySelectorAll(".sr,.sr-l,.sr-r,.sr-s").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCounter(target, inView) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = null;
    const dur = 2000;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return v;
}

function useInView(t = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [t]);
  return [ref, inView];
}

// ── Data ──
const COURSES = [
  {
    dur: "৩ মাস", eng: "3 Months", title: "অফিস বেসিক", price: "১,৮৫০",
    topics: ["MS Word, Excel, PowerPoint", "বাংলা ও ইংরেজি টাইপিং", "Email ও Internet", "Basic Computer Skills"],
    icon: "💼", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)", tag: null, hi: false,
  },
  {
    dur: "৬ মাস", eng: "6 Months", title: "অফিস + ডিজাইন", price: "৩,৫০০",
    topics: ["অফিস বেসিক সম্পূর্ণ", "Adobe Photoshop & Illustrator", "Logo ও Banner Design", "Basic Accounting"],
    icon: "🎨", grad: "linear-gradient(135deg,#F97316,#EA580C)", tag: "জনপ্রিয় ⭐", hi: true,
  },
  {
    dur: "১ বছর", eng: "1 Year", title: "প্রফেশনাল কোর্স", price: "৬,০০০",
    topics: ["সম্পূর্ণ অফিস + ডিজাইন", "Web Design (HTML/CSS)", "Accounting Software", "জাতীয় সার্টিফিকেট"],
    icon: "🏆", grad: "linear-gradient(135deg,#059669,#10B981)", tag: null, hi: false,
  },
];

const FEATURES = [
  { icon: "🏛️", t: "সরকার অনুমোদিত", d: "বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক স্বীকৃত প্রতিষ্ঠান" },
  { icon: "👨‍🏫", t: "অভিজ্ঞ প্রশিক্ষক", d: "দক্ষ ও অভিজ্ঞ শিক্ষকদের সরাসরি তত্ত্বাবধানে শিক্ষা" },
  { icon: "🖥️", t: "আধুনিক ল্যাব", d: "সর্বাধুনিক কম্পিউটার সজ্জিত, ব্যবহারিক শিক্ষার পরিবেশ" },
  { icon: "📜", t: "সার্টিফিকেট", d: "কোর্স শেষে জাতীয়ভাবে স্বীকৃত সনদ প্রদান করা হয়" },
  { icon: "💰", t: "সাশ্রয়ী মূল্য", d: "মাত্র ৳১,৮৫০ থেকে শুরু — সবার নাগালের মধ্যে" },
  { icon: "🕐", t: "নমনীয় সময়সূচী", d: "সকাল, বিকেল ও সন্ধ্যা — আপনার সুবিধামতো ব্যাচ" },
];

const TESTIMONIALS = [
  { n: "রাহেলা বেগম", r: "৬ মাস কোর্স সম্পন্ন", q: "এখানে শিখে আমি একটি অফিসে ডেটা এন্ট্রি অপারেটর হিসেবে কাজ করছি। শিক্ষকরা অনেক ধৈর্যশীল ও সহযোগিতামূলক।" },
  { n: "মো. আরিফ হোসেন", r: "১ বছর কোর্স সম্পন্ন", q: "প্রফেশনাল কোর্সটি আমার জীবন বদলে দিয়েছে। গ্রাফিক ডিজাইনে ফ্রিল্যান্সিং করে এখন ভালো আয় করছি।" },
  { n: "সুমাইয়া আক্তার", r: "৩ মাস কোর্স সম্পন্ন", q: "ছোট কোর্স কিন্তু শেখার মান অনেক উন্নত। ফি অনেক সাশ্রয়ী এবং পরিবেশ খুবই ভালো।" },
];

const STEPS = [
  { n: "০১", icon: "📞", t: "যোগাযোগ করুন", d: "WhatsApp বা সরাসরি এসে ভর্তির বিস্তারিত তথ্য জেনে নিন" },
  { n: "০২", icon: "📋", t: "কোর্স বেছে নিন", d: "আপনার সুবিধামতো কোর্স ও ব্যাচের সময় নির্বাচন করুন" },
  { n: "০৩", icon: "🎓", t: "শিখুন ও এগিয়ে যান", d: "কোর্স সম্পন্ন করে সার্টিফিকেট নিয়ে ক্যারিয়ার গড়ুন" },
];

// ── Navbar ──
function Navbar() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      height: 70, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all .4s ease",
      background: sc ? "rgba(255,255,255,.96)" : "transparent",
      backdropFilter: sc ? "blur(16px)" : "none",
      boxShadow: sc ? "0 2px 24px rgba(0,0,0,.07)" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg,#1E3A8A,#3B82F6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "Poppins,sans-serif",
          boxShadow: "0 4px 16px rgba(30,58,138,.35)",
        }}>দৃ</div>
        <div>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 16, color: sc ? C.primary : "#fff", lineHeight: 1.2 }}>
            Dristy Computer
          </div>
          <div style={{ fontSize: 11, color: sc ? C.textMuted : "rgba(255,255,255,.6)" }}>Training Center, Gopalpur</div>
        </div>
      </div>
      <div className="hide-sm" style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["কোর্সসমূহ", "কেন আমরা", "যোগাযোগ"].map((l) => (
          <span key={l} style={{
            color: sc ? C.textMuted : "rgba(255,255,255,.8)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", transition: "color .2s", fontFamily: "Poppins,sans-serif",
          }}
            onMouseEnter={(e) => (e.target.style.color = sc ? C.primary : "#fff")}
            onMouseLeave={(e) => (e.target.style.color = sc ? C.textMuted : "rgba(255,255,255,.8)")}
          >{l}</span>
        ))}
      </div>
      <button className="btn-o hide-sm" style={{ padding: "9px 22px", fontSize: 14 }}>ভর্তি হোন</button>
    </nav>
  );
}

// ── Hero ──
function Hero() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  const a = (delay, extra = {}) => ({
    opacity: on ? 1 : 0, transform: on ? "none" : "translateY(28px)",
    transition: `opacity .8s ease ${delay}, transform .8s cubic-bezier(.16,1,.3,1) ${delay}`,
    ...extra,
  });
  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#020817 0%,#0F172A 28%,#1E3A8A 58%,#1D4ED8 82%,#0F172A 100%)",
      backgroundSize: "300% 300%", animation: "gradShift 14s ease infinite",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", padding: "120px 5% 80px",
    }}>
      {/* grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,.04) 1px,transparent 0)",
        backgroundSize: "48px 48px", pointerEvents: "none",
      }} />
      {/* blobs */}
      {[
        { w: 480, h: 480, top: "-12%", right: "-8%", bg: "rgba(37,99,235,.14)", anim: "floatY 9s ease-in-out infinite", blur: 60 },
        { w: 300, h: 300, bottom: "0%", left: "-6%", bg: "rgba(249,115,22,.09)", anim: "floatX 11s ease-in-out infinite", blur: 50 },
        { w: 140, h: 140, top: "35%", right: "32%", bg: "rgba(255,255,255,.04)", anim: "floatY 7s ease-in-out infinite 2s", blur: 20 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.h, borderRadius: "50%",
          background: b.bg, top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          animation: b.anim, filter: `blur(${b.blur}px)`, pointerEvents: "none",
        }} />
      ))}

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 280 }} className="sm-full sm-center">
            <div style={{
              ...a("0s"),
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(249,115,22,.12)", border: "1px solid rgba(249,115,22,.35)",
              borderRadius: 50, padding: "6px 16px", marginBottom: 28,
              animation: on ? "badgePulse 2.5s ease infinite" : "none",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
              <span style={{ color: "#FED7AA", fontSize: 12, fontWeight: 600, fontFamily: "Poppins,sans-serif", letterSpacing: ".05em" }}>
                বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত
              </span>
            </div>

            <h1 style={{
              ...a("0.1s"),
              fontFamily: "Poppins,sans-serif", fontWeight: 900,
              fontSize: "clamp(34px,5.5vw,62px)", color: "#fff", lineHeight: 1.1, marginBottom: 20,
            }}>
              কম্পিউটার শিখুন,<br />
              <span style={{
                background: "linear-gradient(135deg,#F97316,#FCD34D)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>ক্যারিয়ার গড়ুন</span>
            </h1>

            <p style={{
              ...a("0.2s"),
              fontSize: "clamp(14px,1.8vw,17px)", color: "rgba(255,255,255,.72)",
              lineHeight: 1.85, marginBottom: 36, maxWidth: 480,
            }}>
              দৃষ্টি কম্পিউটার প্রশিক্ষণ ইনস্টিটিউটে ৩ মাস, ৬ মাস ও ১ বছর মেয়াদী কোর্স। মাত্র{" "}
              <strong style={{ color: "#F97316" }}>৳১,৮৫০</strong> থেকে শুরু।{" "}
              <span style={{
                background: "rgba(249,115,22,.22)", border: "1px solid rgba(249,115,22,.5)",
                borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 700, color: "#FED7AA",
              }}>৬০% ভর্তি ছাড় চলছে!</span>
            </p>

            <div style={{ ...a("0.3s"), display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-o" style={{ fontSize: 16, padding: "15px 34px" }}>🎓 ভর্তি হোন এখনই</button>
              <button className="btn-g">📞 কথা বলুন</button>
            </div>

            <div style={{ ...a("0.5s"), display: "flex", gap: 22, marginTop: 36, flexWrap: "wrap" }}>
              {[["✅","সরকার অনুমোদিত"], ["🏆","অভিজ্ঞ প্রশিক্ষক"], ["📜","সার্টিফিকেট প্রদান"]].map(([e, t]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{e}</span>
                  <span style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — pricing card */}
          <div className="hide-sm" style={{
            opacity: on ? 1 : 0, transform: on ? "none" : "translateX(40px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .45s",
            width: 320, flexShrink: 0,
          }}>
            <div style={{
              background: "rgba(255,255,255,.07)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,.13)", borderRadius: 20, padding: 28,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>নতুন ভর্তি — ২০২৫</span>
                <span style={{ background: "#F97316", color: "#fff", fontSize: 10, padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>LIVE</span>
              </div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", marginBottom: 20 }}>
                ৬০% বিশেষ ছাড় 🔥
              </div>
              {COURSES.map((c) => (
                <div key={c.dur} style={{
                  background: c.hi ? "rgba(249,115,22,.18)" : "rgba(255,255,255,.05)",
                  border: c.hi ? "1px solid rgba(249,115,22,.45)" : "1px solid rgba(255,255,255,.08)",
                  borderRadius: 12, padding: "12px 16px", marginBottom: 10,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{c.dur} কোর্স {c.hi ? "⭐" : ""}</div>
                    <div style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{c.eng}</div>
                  </div>
                  <div style={{ color: c.hi ? "#F97316" : "#93C5FD", fontWeight: 800, fontSize: 17, fontFamily: "Poppins,sans-serif" }}>
                    ৳{c.price}
                  </div>
                </div>
              ))}
              <button className="btn-o" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
                আজই ভর্তি হোন →
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: -56, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: on ? .5 : 0, transition: "opacity 1s ease 1.2s",
        }}>
          <div style={{ width: 22, height: 36, border: "2px solid rgba(255,255,255,.3)", borderRadius: 11, display: "flex", justifyContent: "center", paddingTop: 5 }}>
            <div style={{ width: 4, height: 8, borderRadius: 2, background: "rgba(255,255,255,.7)", animation: "floatY 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats Bar ──
function StatsBar() {
  const [ref, inView] = useInView(.3);
  const s1 = useCounter(500, inView), s2 = useCounter(8, inView),
    s3 = useCounter(3, inView), s4 = useCounter(100, inView);
  const stats = [
    { v: s1, suf: "+", l: "শিক্ষার্থী প্রশিক্ষিত", icon: "👨‍💻" },
    { v: s2, suf: "+", l: "বছরের অভিজ্ঞতা", icon: "📅" },
    { v: s3, suf: "টি", l: "কোর্স প্রোগ্রাম", icon: "📚" },
    { v: s4, suf: "%", l: "সার্টিফিকেট প্রদান", icon: "🎓" },
  ];
  return (
    <section ref={ref} style={{ background: `linear-gradient(135deg,${C.primary},#1D4ED8)`, padding: "56px 5%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontFamily: "Poppins,sans-serif", fontWeight: 800,
              fontSize: "clamp(32px,4vw,48px)", color: "#fff", lineHeight: 1,
              animation: inView ? `countUp .5s ease ${i * .1}s both` : "none",
            }}>{s.v}{s.suf}</div>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 14, marginTop: 7, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Courses ──
function Courses() {
  return (
    <section style={{ padding: "100px 5%", background: C.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="sec-tag">আমাদের কোর্সসমূহ</div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: C.text, marginBottom: 14 }}>
            আপনার পছন্দমতো কোর্স বেছে নিন
          </h2>
          <p style={{ color: C.textMuted, fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
            তিনটি মেয়াদে কোর্স — আপনার সময় ও বাজেট অনুযায়ী সবচেয়ে উপযুক্তটি বেছে নিন।
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 28 }}>
          {COURSES.map((c, i) => (
            <div key={i} className={`lift sr d${i + 1}`} style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              border: c.hi ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
              boxShadow: c.hi ? "0 8px 40px rgba(249,115,22,.14)" : "0 2px 16px rgba(0,0,0,.05)",
              position: "relative",
            }}>
              {c.tag && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: C.accent, color: "#fff", fontSize: 11, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 50, fontFamily: "Poppins,sans-serif",
                }}>{c.tag}</div>
              )}
              <div style={{ background: c.grad, padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ color: "rgba(255,255,255,.65)", fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{c.eng} Course</div>
                <div style={{ color: "#fff", fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 22, marginTop: 4 }}>{c.title}</div>
              </div>
              <div style={{ padding: "24px 28px" }}>
                <div style={{ marginBottom: 20 }}>
                  {c.topics.map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        background: c.hi ? "rgba(249,115,22,.1)" : C.primaryPale,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: c.hi ? C.accent : C.primaryLight, fontWeight: 700,
                      }}>✓</div>
                      <span style={{ color: C.textMid, fontSize: 14 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 8,
                  borderTop: `1px solid ${C.border}`, paddingTop: 18, marginBottom: 18,
                }}>
                  <span style={{ fontSize: 13, color: C.textMuted }}>মাত্র</span>
                  <span style={{
                    fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 28,
                    color: c.hi ? C.accent : C.primary,
                  }}>৳{c.price}</span>
                  <span style={{ color: C.textMuted, fontSize: 13 }}>/কোর্স</span>
                </div>
                <button style={{
                  width: "100%", padding: 13, borderRadius: 10, background: c.grad,
                  color: "#fff", border: "none", fontFamily: "Poppins,sans-serif",
                  fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "opacity .2s",
                }}
                  onMouseEnter={(e) => (e.target.style.opacity = ".88")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >এই কোর্সে ভর্তি হোন →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Us ──
function WhyUs() {
  return (
    <section style={{ padding: "100px 5%", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          <div className="sr-l" style={{ flex: 1, minWidth: 260 }}>
            <div className="sec-tag">কেন আমাদের বেছে নেবেন</div>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 18 }}>
              গোপালপুরের সেরা<br />
              <span style={{ color: C.primary }}>কম্পিউটার প্রশিক্ষণ কেন্দ্র</span>
            </h2>
            <p style={{ color: C.textMuted, lineHeight: 1.85, marginBottom: 32, fontSize: 15 }}>
              আমরা বিশ্বাস করি প্রযুক্তি শিক্ষা সবার জন্য সহজলভ্য হওয়া উচিত। তাই সরকার অনুমোদিত পাঠ্যক্রম, দক্ষ প্রশিক্ষক ও সাশ্রয়ী মূল্যে মানসম্পন্ন কম্পিউটার প্রশিক্ষণ দিয়ে আসছি।
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { bg: C.primaryPale, c: C.primary, v: "৫০০+", l: "শিক্ষার্থী" },
                { bg: C.accentPale, c: C.accent, v: "৮+", l: "বছর অভিজ্ঞতা" },
                { bg: "#F0FDF4", c: C.green, v: "১০০%", l: "সার্টিফিকেট" },
              ].map((s) => (
                <div key={s.l} style={{ background: s.bg, borderRadius: 12, padding: "16px 20px", flex: 1, textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 22, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="sr-r" style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="lift" style={{
                  background: C.bgAlt, borderRadius: 14, padding: "20px 18px",
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 6 }}>{f.t}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65 }}>{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──
function HowItWorks() {
  return (
    <section style={{ padding: "90px 5%", background: C.primary, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,.04) 1px,transparent 0)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-block", background: "rgba(249,115,22,.15)",
            border: "1px solid rgba(249,115,22,.35)", borderRadius: 50,
            padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#FED7AA",
            letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14,
          }}>কীভাবে শুরু করবেন</div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 800, color: "#fff" }}>
            মাত্র তিন ধাপে শুরু করুন
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 40, position: "relative" }}>
          {/* Connector line */}
          <div className="hide-sm" style={{
            position: "absolute", top: 38, left: "16.5%", right: "16.5%", height: 2,
            background: "linear-gradient(90deg,rgba(255,255,255,.15),rgba(249,115,22,.4),rgba(255,255,255,.15))",
          }} />
          {STEPS.map((s, i) => (
            <div key={i} className={`sr d${i + 1} sm-center`} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                <div style={{
                  width: 76, height: 76, borderRadius: "50%",
                  background: "rgba(255,255,255,.08)", border: "2px solid rgba(255,255,255,.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, margin: "0 auto",
                }}>{s.icon}</div>
                <div style={{
                  position: "absolute", top: -6, right: -6, width: 26, height: 26,
                  borderRadius: "50%", background: C.accent, color: "#fff",
                  fontSize: 11, fontWeight: 800, fontFamily: "Poppins,sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</div>
              </div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: ".18em", marginBottom: 8 }}>{s.n}</div>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 10 }}>{s.t}</h3>
              <p style={{ color: "rgba(255,255,255,.58)", fontSize: 14, lineHeight: 1.75 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──
function Testimonials() {
  return (
    <section style={{ padding: "100px 5%", background: C.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="sec-tag">শিক্ষার্থীদের মতামত</div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 800, color: C.text }}>
            তারা যা বলছেন
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`lift sr d${i + 1}`} style={{
              background: "#fff", borderRadius: 18, padding: 28,
              border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(0,0,0,.05)",
            }}>
              <div style={{ display: "flex", marginBottom: 14 }}>
                {"★★★★★".split("").map((s, j) => (
                  <span key={j} style={{ color: C.gold, fontSize: 17 }}>{s}</span>
                ))}
              </div>
              <p style={{ color: C.textMid, lineHeight: 1.85, fontSize: 15, marginBottom: 22, fontStyle: "italic" }}>
                "{t.q}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.primary},${C.primaryLight})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>{t.n[0]}</div>
                <div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: C.text }}>{t.n}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Admission Banner ──
function AdmissionBanner() {
  return (
    <section style={{ padding: "0 5% 80px" }}>
      <div className="sr" style={{
        borderRadius: 24, overflow: "hidden",
        background: "linear-gradient(135deg,#F97316,#EA580C,#C2410C)",
        padding: "64px 8%", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,.06) 1px,transparent 0)",
          backgroundSize: "30px 30px", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)",
          fontSize: 180, opacity: .05, fontFamily: "Poppins,sans-serif", fontWeight: 900, pointerEvents: "none", lineHeight: 1,
        }}>৬০%</div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div style={{
              background: "rgba(255,255,255,.2)", display: "inline-block",
              borderRadius: 50, padding: "4px 14px", fontSize: 11, fontWeight: 700,
              color: "#fff", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase",
            }}>⚡ সীমিত সময়ের অফার</div>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.5vw,44px)", color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>
              এখনই ভর্তি হন, পান<br />৬০% বিশেষ ছাড়!
            </h2>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: 15, maxWidth: 440, lineHeight: 1.75 }}>
              নতুন সেশনে ভর্তি চলছে। আসন সীমিত — দেরি না করে আজই যোগাযোগ করুন।
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <button style={{
              background: "#fff", color: C.accentDark, border: "none",
              padding: "16px 38px", borderRadius: 12, fontFamily: "Poppins,sans-serif",
              fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all .3s",
              boxShadow: "0 8px 32px rgba(0,0,0,.18)",
            }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 14px 40px rgba(0,0,0,.28)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,.18)"; }}
            >🎓 এখনই ভর্তি হোন</button>
            <a href="https://www.facebook.com/share/1E2jAYRKhz/" target="_blank" rel="noreferrer" style={{
              color: "rgba(255,255,255,.88)", fontSize: 14, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 8,
            }}>📘 Facebook Page দেখুন</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer style={{ background: C.bgDark, color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 5% 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="sm-col sm-grid1">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg,#1E3A8A,#3B82F6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "#fff",
              }}>দৃ</div>
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15 }}>Dristy Computer Training Center</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>গোপালপুর</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 14, lineHeight: 1.85, maxWidth: 300 }}>
              বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত। সুলভ মূল্যে মানসম্পন্ন আইটি শিক্ষা প্রদানে প্রতিশ্রুতিবদ্ধ।
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[["📘", "Facebook", "https://www.facebook.com/share/1E2jAYRKhz/"], ["💬", "WhatsApp", "#"]].map(([ic, l, hr]) => (
                <a key={l} href={hr} target="_blank" rel="noreferrer" style={{
                  background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,.65)",
                  fontSize: 13, textDecoration: "none", transition: "all .2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.65)"; }}
                >{ic} {l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 18 }}>কোর্সসমূহ</div>
            {["৩ মাসের কোর্স", "৬ মাসের কোর্স", "১ বছরের কোর্স", "অফিস কোর্স", "গ্রাফিক ডিজাইন", "Web Design"].map((l) => (
              <div key={l} style={{ color: "rgba(255,255,255,.45)", fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={(e) => (e.target.style.color = C.accent)}
                onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,.45)")}
              >{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 18 }}>যোগাযোগ</div>
            {[
              ["📍", "গোপালপুর, বাংলাদেশ"],
              ["💬", "WhatsApp-এ কথা বলুন"],
              ["📘", "Facebook Page"],
              ["⏰", "শনি–বৃহস্পতি: সকাল ৯টা–রাত ৮টা"],
            ].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{ic}</span>
                <span style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 13 }}>
            © ২০২৫ Dristy Computer Training Center, Gopalpur. সর্বস্বত্ব সংরক্ষিত।
          </span>
          <span style={{ color: "rgba(255,255,255,.2)", fontSize: 12 }}>বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত</span>
        </div>
      </div>
    </footer>
  );
}

// ── Floating WhatsApp ──
function FloatingWA() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1600); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 26, right: 22, zIndex: 1000,
      opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(.4)",
      transition: "all .55s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{
        position: "absolute", inset: -5, borderRadius: "50%",
        background: "rgba(37,211,102,.3)", animation: "waPulse 2s ease infinite",
      }} />
      <button style={{
        width: 58, height: 58, borderRadius: "50%",
        background: "linear-gradient(135deg,#25D366,#128C7E)",
        border: "none", cursor: "pointer", fontSize: 26,
        boxShadow: "0 6px 24px rgba(37,211,102,.45)", transition: "transform .3s",
        position: "relative",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="WhatsApp-এ যোগাযোগ করুন"
      >💬</button>
    </div>
  );
}

// ── App ──
export default function App() {
  useScrollReveal();
  return (
    <>
      <style>{STYLES}</style>
      <Navbar />
      <Hero />
      <StatsBar />
      <Courses />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <AdmissionBanner />
      <Footer />
      <FloatingWA />
    </>
  );
}
