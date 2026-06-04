import { useState, useEffect, useRef, useCallback } from "react";

// ─── 7 THEMES — one accent, professional ───────────────────────────
const THEMES = {
  navy:     { name:"Deep Navy",      emoji:"🔵", bg:"#030912", bg2:"#061020", card:"#0A1628", p:"#2B7FE1", a:"#E8401A", s:"#4DA6FF", tx:"#EAF2FF", mu:"#4A6E8A", gr:"43,127,225" },
  midnight: { name:"Midnight",       emoji:"🟣", bg:"#06060F", bg2:"#0C0C1E", card:"#111128", p:"#7C6FE8", a:"#F59E0B", s:"#9B8FF0", tx:"#F0EEFF", mu:"#504D7A", gr:"124,111,232" },
  forest:   { name:"Deep Forest",    emoji:"🟢", bg:"#030F08", bg2:"#061410", card:"#0A1E12", p:"#16A34A", a:"#D97706", s:"#22C55E", tx:"#E8FAF0", mu:"#3A6A4A", gr:"22,163,74" },
  royal:    { name:"Royal Dark",     emoji:"👑", bg:"#08060F", bg2:"#100C1E", card:"#160F28", p:"#9C6EFF", a:"#D4AF37", s:"#B48AFF", tx:"#F5F0FF", mu:"#5A4A72", gr:"156,110,255" },
  carbon:   { name:"Carbon",         emoji:"🔴", bg:"#080808", bg2:"#0F0F0F", card:"#161616", p:"#EF4444", a:"#F97316", s:"#F87171", tx:"#FAFAFA", mu:"#555555", gr:"239,68,68" },
  slate:    { name:"Deep Slate",     emoji:"🩵", bg:"#030A0F", bg2:"#061018", card:"#0A1820", p:"#06B6D4", a:"#EC4899", s:"#22D3EE", tx:"#E0FAFF", mu:"#2E6070", gr:"6,182,212" },
  obsidian: { name:"Obsidian Amber", emoji:"🟡", bg:"#030200", bg2:"#080704", card:"#100F08", p:"#F59E0B", a:"#10B981", s:"#FBBF24", tx:"#FFF8E7", mu:"#6A5A2A", gr:"245,158,11" },
};

// ─── BILINGUAL CONTENT ──────────────────────────────────────────────
const L = {
  bn: {
    nav: ["কোর্সসমূহ", "কেন আমরা", "যোগাযোগ"],
    enroll: "ভর্তি হোন",
    ticker: ["🎓 নতুন সেশনে ভর্তি চলছে — আসন সীমিত","🔥 ৬০% বিশেষ ভর্তি ছাড় পাচ্ছেন এখনই","📞 ০১৬৪৩-৯২৮৬৮৭","📜 বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত","💻 মাত্র ৳১,৮৫০ থেকে শুরু"],
    tag: "বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত",
    h1: "কম্পিউটার শিখুন,",
    h2: "ক্যারিয়ার গড়ুন",
    desc: "দৃষ্টি কম্পিউটার প্রশিক্ষণ ইনস্টিটিউটে ৩ মাস, ৬ মাস ও ১ বছর মেয়াদী কোর্স। মাত্র ৳১,৮৫০ থেকে শুরু।",
    btn1: "ভর্তি হোন এখনই",
    btn2: "কল করুন: ০১৬৪৩-৯২৮৬৮৭",
    disc: "৬০% ভর্তি ছাড়",
    discSub: "সীমিত সময়ের অফার",
    trust: ["সরকার অনুমোদিত","অভিজ্ঞ প্রশিক্ষক","সার্টিফিকেট প্রদান"],
    stats: [["৫০০+","শিক্ষার্থী"],["৮+","বছর অভিজ্ঞতা"],["৩টি","কোর্স"],["১০০%","সার্টিফিকেট"]],
    cTitle: "আমাদের কোর্সসমূহ",
    cSub: "আপনার সময় ও বাজেট অনুযায়ী সেরা কোর্সটি বেছে নিন",
    courses: [
      { dur:"৩ মাস", eng:"3 Months", title:"অফিস বেসিক", price:"১,৮৫০", icon:"💼", topics:["MS Word, Excel, PowerPoint","বাংলা ও ইংরেজি টাইপিং","Email ও Internet","Basic Computer Skills"] },
      { dur:"৬ মাস", eng:"6 Months", title:"অফিস + ডিজাইন", price:"৩,৫০০", icon:"🎨", tag:"সবচেয়ে জনপ্রিয়", topics:["অফিস বেসিক সম্পূর্ণ","Adobe Photoshop & Illustrator","Logo ও Banner Design","Basic Accounting"] },
      { dur:"১ বছর", eng:"1 Year", title:"প্রফেশনাল কোর্স", price:"৬,০০০", icon:"🏆", topics:["অফিস + ডিজাইন সম্পূর্ণ","Web Design (HTML/CSS)","Accounting Software","জাতীয় সার্টিফিকেট"] },
    ],
    cBtn: "এই কোর্সে ভর্তি হোন →",
    wTitle: "কেন আমাদের বেছে নেবেন",
    features: [
      {icon:"🏛️",t:"সরকার অনুমোদিত",d:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক স্বীকৃত প্রতিষ্ঠান"},
      {icon:"👨‍🏫",t:"অভিজ্ঞ প্রশিক্ষক",d:"দক্ষ ও অভিজ্ঞ শিক্ষকদের সরাসরি তত্ত্বাবধানে শিক্ষা"},
      {icon:"🖥️",t:"আধুনিক ল্যাব",d:"সর্বাধুনিক কম্পিউটার সজ্জিত হাতে-কলমে শিক্ষার পরিবেশ"},
      {icon:"📜",t:"জাতীয় সার্টিফিকেট",d:"কোর্স শেষে সরকার স্বীকৃত সনদ প্রদান করা হয়"},
      {icon:"💰",t:"সাশ্রয়ী মূল্য",d:"মাত্র ৳১,৮৫০ থেকে শুরু — সবার নাগালের মধ্যে"},
      {icon:"🕐",t:"নমনীয় সময়সূচী",d:"সকাল, বিকেল ও সন্ধ্যা ব্যাচে ক্লাসের সুবিধা"},
    ],
    sTitle: "মাত্র তিন ধাপে শুরু করুন",
    steps: ["যোগাযোগ করুন","কোর্স বেছে নিন","শিখুন ও এগিয়ে যান"],
    stepD: ["WhatsApp বা সরাসরি এসে ভর্তির বিস্তারিত জানুন","আপনার সুবিধামতো কোর্স ও ব্যাচ নির্বাচন করুন","সার্টিফিকেট নিয়ে ক্যারিয়ার গড়ুন"],
    tTitle: "শিক্ষার্থীরা যা বলছেন",
    tests: [
      {n:"রাহেলা বেগম",r:"৬ মাস কোর্স সম্পন্ন",q:"এখানে শিখে একটি অফিসে ডেটা এন্ট্রি অপারেটর হিসেবে কাজ করছি। শিক্ষকরা অনেক ধৈর্যশীল।"},
      {n:"মো. আরিফ হোসেন",r:"১ বছর কোর্স সম্পন্ন",q:"গ্রাফিক ডিজাইনে ফ্রিল্যান্সিং করে ভালো আয় করছি। এই কোর্স আমার জীবন বদলে দিয়েছে।"},
      {n:"সুমাইয়া আক্তার",r:"৩ মাস কোর্স সম্পন্ন",q:"ছোট কোর্স কিন্তু শেখার মান অনেক উন্নত। ফি অনেক সাশ্রয়ী এবং পরিবেশ খুবই ভালো।"},
      {n:"কামাল উদ্দিন",r:"৬ মাস কোর্স সম্পন্ন",q:"এখন নিজেই ব্যানার ও লোগো ডিজাইন করি। দৃষ্টি কম্পিউটারের জন্য অনেক কৃতজ্ঞ।"},
    ],
    ctaL1:"এখনই ভর্তি হোন,", ctaL2:"পান ৬০% বিশেষ ছাড়!",
    ctaDesc:"নতুন সেশনে ভর্তি চলছে। আসন সীমিত — দেরি না করে আজই যোগাযোগ করুন।",
    ctaBtn:"ভর্তি হোন এখনই", ctaCall:"কল করুন: ০১৬৪৩-৯২৮৬৮৭",
    phone:"01643-928687",
    fDesc:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত। সুলভ মূল্যে মানসম্পন্ন আইটি শিক্ষা।",
    fLinks:["৩ মাসের কোর্স","৬ মাসের কোর্স","১ বছরের কোর্স","অফিস কোর্স","গ্রাফিক ডিজাইন"],
    fContact:["📍 গোপালপুর, টাঙ্গাইল, বাংলাদেশ","📞 ০১৬৪৩-৯২৮৬৮৭","📘 Facebook Page","⏰ শনি–বৃহস্পতি: সকাল ৯টা–রাত ৮টা"],
    copy:"© ২০২৫ দৃষ্টি কম্পিউটার ট্রেনিং সেন্টার। সর্বস্বত্ব সংরক্ষিত।",
    approved:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত",
  },
  en: {
    nav: ["Courses", "Why Us", "Contact"],
    enroll: "Enroll Now",
    ticker: ["🎓 New session open — Limited seats!","🔥 60% special discount on admission","📞 01643-928687","📜 Bangladesh Technical Education Board Approved","💻 Starting from just ৳1,850"],
    tag: "Bangladesh Technical Education Board Approved",
    h1: "Learn Computer Skills,",
    h2: "Build Your Career",
    desc: "Dristy Computer Training Institute offers 3 month, 6 month & 1 year courses. Starting from just ৳1,850.",
    btn1: "Enroll Now",
    btn2: "Call: 01643-928687",
    disc: "60% Admission Discount",
    discSub: "Limited time offer",
    trust: ["Govt. Approved","Expert Trainers","Certificate Awarded"],
    stats: [["500+","Students Trained"],["8+","Years Experience"],["3","Courses"],["100%","Certified"]],
    cTitle: "Our Courses",
    cSub: "Choose the best course based on your time and budget",
    courses: [
      { dur:"৩ মাস", eng:"3 Months", title:"Office Basics", price:"১,৮৫০", icon:"💼", topics:["MS Word, Excel, PowerPoint","Bangla & English Typing","Email & Internet","Basic Computer Skills"] },
      { dur:"৬ মাস", eng:"6 Months", title:"Office + Design", price:"৩,৫০০", icon:"🎨", tag:"Most Popular", topics:["Full Office Basics","Adobe Photoshop & Illustrator","Logo & Banner Design","Basic Accounting"] },
      { dur:"১ বছর", eng:"1 Year", title:"Professional Course", price:"৬,০০০", icon:"🏆", topics:["Full Office + Design","Web Design (HTML/CSS)","Accounting Software","National Certificate"] },
    ],
    cBtn: "Enroll in This Course →",
    wTitle: "Why Choose Us",
    features: [
      {icon:"🏛️",t:"Govt. Approved",d:"Recognized by Bangladesh Technical Education Board"},
      {icon:"👨‍🏫",t:"Expert Trainers",d:"Highly qualified and experienced instructors"},
      {icon:"🖥️",t:"Modern Lab",d:"State-of-the-art computers for hands-on practical learning"},
      {icon:"📜",t:"National Certificate",d:"Nationally recognized certificate upon course completion"},
      {icon:"💰",t:"Affordable Fees",d:"Starting from ৳1,850 — within everyone's reach"},
      {icon:"🕐",t:"Flexible Schedule",d:"Morning, afternoon & evening batches available"},
    ],
    sTitle: "Start in Just 3 Steps",
    steps: ["Contact Us","Choose a Course","Learn & Grow"],
    stepD: ["Visit or WhatsApp us to get full admission details","Select the course and batch that suits your schedule","Complete your course and build your career with a certificate"],
    tTitle: "What Our Students Say",
    tests: [
      {n:"Rahela Begum",r:"6 Month Course Completed",q:"After training here I'm working as a data entry operator. The teachers are very patient."},
      {n:"Md. Arif Hossain",r:"1 Year Course Completed",q:"I'm now freelancing in graphic design and earning well. This course changed my life."},
      {n:"Sumaiya Akter",r:"3 Month Course Completed",q:"Short course but excellent quality. The fees are very affordable and the environment is great."},
      {n:"Kamal Uddin",r:"6 Month Course Completed",q:"I now design banners and logos myself. Very grateful to Dristy Computer."},
    ],
    ctaL1:"Enroll Now,", ctaL2:"Get 60% Discount!",
    ctaDesc:"New session enrollment is open. Limited seats — contact us today without delay.",
    ctaBtn:"Enroll Now", ctaCall:"Call: 01643-928687",
    phone:"01643-928687",
    fDesc:"Bangladesh Technical Education Board Approved. Quality IT education at affordable prices.",
    fLinks:["3 Month Course","6 Month Course","1 Year Course","Office Course","Graphic Design"],
    fContact:["📍 Gopalpur, Tangail, Bangladesh","📞 01643-928687","📘 Facebook Page","⏰ Sat–Thu: 9AM–8PM"],
    copy:"© 2025 Dristy Computer Training Center. All rights reserved.",
    approved:"Bangladesh Technical Education Board Approved",
  },
};

// ─── STATIC CSS ─────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Hind Siliguri','Poppins',system-ui,sans-serif;overflow-x:hidden;line-height:1.6;transition:background .4s,color .4s}
  h1,h2,h3,h4,button{font-family:'Poppins','Hind Siliguri',sans-serif}

  .sr{opacity:0;transform:translateY(32px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr-l{opacity:0;transform:translateX(-40px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr-r{opacity:0;transform:translateX(40px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr.on,.sr-l.on,.sr-r.on{opacity:1!important;transform:none!important}
  .d1{transition-delay:.06s}.d2{transition-delay:.14s}.d3{transition-delay:.22s}.d4{transition-delay:.30s}.d5{transition-delay:.38s}.d6{transition-delay:.46s}

  @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
  @keyframes pulseRing{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
  @keyframes countIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes progressFill{from{width:0}to{width:100%}}
  @keyframes scrollBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}

  .card{transition:transform .3s ease,box-shadow .3s ease}
  .card:hover{transform:translateY(-6px)}

  @media(max-width:768px){
    .hide-sm{display:none!important}
    .sm-col{flex-direction:column!important}
    .sm-full{width:100%!important;flex:none!important;min-width:0!important}
    .sm-center{text-align:center!important;align-items:center!important;justify-content:center!important}
    .sm-g1{grid-template-columns:1fr!important}
  }
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:var(--p);border-radius:2px}
  ::-webkit-scrollbar-track{background:var(--bg)}
`;

function themeVars(t) {
  return `:root{--bg:${t.bg};--bg2:${t.bg2};--card:${t.card};--p:${t.p};--a:${t.a};--s:${t.s};--tx:${t.tx};--mu:${t.mu};--gr:${t.gr}}body{background:${t.bg};color:${t.tx}}`;
}

// ─── HOOKS ──────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      en => en.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".sr,.sr-l,.sr-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useInView(t = 0.2) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
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
    let s = null; const dur = 2000;
    const tick = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return v;
}

function useScramble(text, active) {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
  useEffect(() => {
    if (!active) { setDisplay(""); return; }
    let iter = 0;
    const iv = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) => {
          if (ch === " " || ch === ",") return ch;
          if (i < iter) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      iter += 0.4;
      if (iter > text.length) { setDisplay(text); clearInterval(iv); }
    }, 36);
    return () => clearInterval(iv);
  }, [active, text]);
  return display;
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

// ─── DOT TRAIL CURSOR (canvas-based) ────────────────────────────────
function DotTrailCursor({ active, rgb }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let animId;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const trail = [];
    const onMove = e => { trail.push({ x: e.clientX, y: e.clientY, life: 1 }); if (trail.length > 22) trail.shift(); };
    window.addEventListener("mousemove", onMove);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      trail.forEach((d, i) => {
        d.life = Math.max(0, d.life - 0.055);
        if (d.life <= 0) return;
        const size = 5 * d.life;
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${d.life * 0.75})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, [active, rgb]);
  if (!active) return null;
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }} />;
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────
function ParticleCanvas({ rgb }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
      a: Math.random() * .35 + .08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + c.width) % c.width;
        p.y = (p.y + p.vy + c.height) % c.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${rgb},${.1 * (1 - d / 100)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [rgb]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────
function ScrollProgressBar({ t }) {
  const p = useScrollProgress();
  return <div style={{ position: "fixed", top: 0, left: 0, zIndex: 10000, height: 3, width: `${p}%`, background: t.p, boxShadow: `0 0 8px rgba(${t.gr},.8)`, transition: "width .08s", transformOrigin: "left" }} />;
}

// ─── NEWS TICKER ─────────────────────────────────────────────────────
function NewsTicker({ t, c }) {
  const items = [...c.ticker, ...c.ticker];
  return (
    <div style={{ background: `rgba(${t.gr},.08)`, borderBottom: `1px solid rgba(${t.gr},.18)`, height: 32, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ flexShrink: 0, background: t.p, color: t.bg, fontSize: 10, fontWeight: 800, padding: "0 12px", height: "100%", display: "flex", alignItems: "center", letterSpacing: ".08em", whiteSpace: "nowrap" }}>
        LIVE
      </div>
      <div style={{ overflow: "hidden", flex: 1, cursor: "default" }}>
        <div style={{ display: "inline-flex", gap: "4rem", animation: "ticker 28s linear infinite", whiteSpace: "nowrap", paddingLeft: "2rem" }}>
          {items.map((item, i) => (
            <span key={i} style={{ color: t.tx, fontSize: 12, opacity: .8, fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────
function Navbar({ t, c, lang, setLang, cursorOn, setCursorOn }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 70);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 998 }}>
      <NewsTicker t={t} c={c} />
      <nav style={{ height: 62, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .4s", background: sc ? `${t.bg}F0` : "transparent", backdropFilter: sc ? "blur(18px)" : "none", borderBottom: sc ? `1px solid rgba(${t.gr},.12)` : "1px solid transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: t.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: t.bg, boxShadow: `0 0 16px rgba(${t.gr},.5)` }}>দৃ</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.tx, lineHeight: 1.2 }}>Dristy Computer</div>
            <div style={{ fontSize: 10, color: t.mu }}>Training Center, Gopalpur</div>
          </div>
        </div>
        <div className="hide-sm" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {c.nav.map(l => (
            <span key={l} style={{ color: t.mu, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = t.p} onMouseLeave={e => e.target.style.color = t.mu}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language toggle */}
          <button onClick={() => setLang(l => l === "bn" ? "en" : "bn")} style={{ background: `rgba(${t.gr},.1)`, border: `1px solid rgba(${t.gr},.25)`, color: t.p, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s", letterSpacing: ".04em" }}
            onMouseEnter={e => e.currentTarget.style.background = `rgba(${t.gr},.2)`} onMouseLeave={e => e.currentTarget.style.background = `rgba(${t.gr},.1)`}
          >{lang === "bn" ? "EN" : "বাং"}</button>
          {/* Cursor toggle */}
          <button onClick={() => setCursorOn(v => !v)} title="Cursor Trail" style={{ background: cursorOn ? t.p : `rgba(${t.gr},.1)`, border: `1px solid rgba(${t.gr},.25)`, color: cursorOn ? t.bg : t.mu, width: 32, height: 32, borderRadius: 7, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>✦</button>
          <button onClick={() => window.open("tel:01643928687")} className="hide-sm" style={{ background: t.p, color: t.bg, border: "none", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: `0 0 14px rgba(${t.gr},.4)`, transition: "all .25s" }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 0 24px rgba(${t.gr},.6)`; }}
            onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 14px rgba(${t.gr},.4)`; }}
          >{c.enroll}</button>
        </div>
      </nav>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────
function Hero({ t, c }) {
  const [on, setOn] = useState(false);
  const [ref, inView] = useInView(0.1);
  const s1 = useScramble(c.h1, inView);
  const s2 = useScramble(c.h2, inView);
  const [sy, setSy] = useState(0);
  const [mx, setMx] = useState({ x: 0, y: 0 });

  useEffect(() => { const to = setTimeout(() => setOn(true), 80); return () => clearTimeout(to); }, []);
  useEffect(() => {
    const fs = () => setSy(window.scrollY);
    const fm = e => setMx({ x: (e.clientX / window.innerWidth - .5) * 30, y: (e.clientY / window.innerHeight - .5) * 30 });
    window.addEventListener("scroll", fs, { passive: true });
    window.addEventListener("mousemove", fm);
    return () => { window.removeEventListener("scroll", fs); window.removeEventListener("mousemove", fm); };
  }, []);

  const a = (d, ex = {}) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity .8s ease ${d},transform .8s cubic-bezier(.16,1,.3,1) ${d}`, ...ex });

  return (
    <section ref={ref} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "128px 5% 80px", background: t.bg }}>
      <ParticleCanvas rgb={t.gr} />
      {/* Parallax orbs */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,rgba(${t.gr},.09),transparent 70%)`, top: `calc(-8% + ${-mx.y * .35}px)`, left: `calc(20% + ${mx.x * .35}px)`, transform: `translateY(${-sy * .14}px)`, transition: "top .12s,left .12s", pointerEvents: "none", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(${t.gr},.06),transparent 70%)`, bottom: "5%", right: `calc(8% + ${-mx.x * .2}px)`, transform: `translateY(${sy * .08}px)`, pointerEvents: "none", filter: "blur(8px)" }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 280 }} className="sm-full sm-center">
            {/* Approval tag */}
            <div style={{ ...a("0s"), display: "inline-flex", alignItems: "center", gap: 8, background: `rgba(${t.gr},.08)`, border: `1px solid rgba(${t.gr},.22)`, borderRadius: 50, padding: "6px 16px", marginBottom: 26 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.p, boxShadow: `0 0 8px ${t.p}`, animation: "pulseRing 2s ease infinite" }} />
              <span style={{ color: t.p, fontSize: 12, fontWeight: 600, letterSpacing: ".04em" }}>{c.tag}</span>
            </div>

            {/* Scramble title */}
            <h1 style={{ ...a("0.1s"), fontWeight: 900, fontSize: "clamp(36px,5.5vw,64px)", lineHeight: 1.08, marginBottom: 14 }}>
              <span style={{ display: "block", color: t.tx, fontFamily: "monospace, 'Courier New'" }}>{s1 || c.h1}</span>
              <span style={{ display: "block", color: t.p, fontFamily: "monospace, 'Courier New'" }}>{s2 || c.h2}</span>
            </h1>

            <p style={{ ...a("0.22s"), fontSize: "clamp(14px,1.7vw,16px)", color: t.tx + "88", lineHeight: 1.88, marginBottom: 34, maxWidth: 460 }}>{c.desc}</p>

            <div style={{ ...a("0.32s"), display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => window.open("tel:01643928687")} style={{ background: t.p, color: t.bg, border: "none", padding: "14px 32px", borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: `0 0 22px rgba(${t.gr},.42)`, transition: "all .25s" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 0 36px rgba(${t.gr},.6)`; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 22px rgba(${t.gr},.42)`; }}
              >{c.btn1}</button>
              <button onClick={() => window.open("tel:01643928687")} style={{ background: "transparent", color: t.tx, border: `1.5px solid rgba(${t.gr},.3)`, padding: "13px 28px", borderRadius: 9, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.p; e.currentTarget.style.color = t.p; e.currentTarget.style.background = `rgba(${t.gr},.08)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.3)`; e.currentTarget.style.color = t.tx; e.currentTarget.style.background = "transparent"; }}
              >{c.btn2}</button>
            </div>

            {/* Discount + trust badges */}
            <div style={{ ...a("0.46s"), display: "flex", alignItems: "center", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `rgba(${t.gr},.08)`, border: `1px solid rgba(${t.gr},.2)`, borderRadius: 10, padding: "10px 18px" }}>
                <span style={{ fontSize: 18 }}>🔥</span>
                <div>
                  <div style={{ color: t.p, fontWeight: 800, fontSize: 16 }}>{c.disc}</div>
                  <div style={{ color: t.mu, fontSize: 11 }}>{c.discSub}</div>
                </div>
              </div>
              {c.trust.map(tr => (
                <div key={tr} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: t.p, fontSize: 14 }}>✓</span>
                  <span style={{ color: t.mu, fontSize: 13 }}>{tr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — info card */}
          <div className="hide-sm" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(40px)", transition: "all .9s cubic-bezier(.16,1,.3,1) .45s", width: 296, flexShrink: 0 }}>
            <div style={{ background: `rgba(255,255,255,.04)`, backdropFilter: "blur(20px)", border: `1px solid rgba(${t.gr},.18)`, borderRadius: 18, padding: "24px 22px", boxShadow: `0 0 50px rgba(${t.gr},.08),inset 0 1px 0 rgba(255,255,255,.06)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: t.mu, fontSize: 12 }}>ভর্তি প্যাকেজ ২০২৫</span>
                <span style={{ background: t.p, color: t.bg, fontSize: 10, padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>LIVE</span>
              </div>
              {c.courses.map((cr, i) => (
                <div key={i} style={{ background: i === 1 ? `rgba(${t.gr},.1)` : `rgba(255,255,255,.03)`, border: `1px solid ${i === 1 ? `rgba(${t.gr},.3)` : "rgba(255,255,255,.06)"}`, borderRadius: 10, padding: "11px 14px", marginBottom: 9, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `rgba(${t.gr},.12)`}
                  onMouseLeave={e => e.currentTarget.style.background = i === 1 ? `rgba(${t.gr},.1)` : "rgba(255,255,255,.03)"}
                >
                  <div>
                    <div style={{ color: t.tx, fontWeight: 600, fontSize: 13 }}>{cr.dur} {i === 1 ? "⭐" : ""}</div>
                    <div style={{ color: t.mu, fontSize: 11 }}>{cr.eng}</div>
                  </div>
                  <div style={{ color: t.p, fontWeight: 800, fontSize: 15 }}>৳{cr.price}</div>
                </div>
              ))}
              <button onClick={() => window.open("tel:01643928687")} style={{ width: "100%", padding: "11px", borderRadius: 8, background: t.p, color: t.bg, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 6, transition: "all .25s", boxShadow: `0 0 14px rgba(${t.gr},.35)` }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 0 24px rgba(${t.gr},.55)`; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 14px rgba(${t.gr},.35)`; }}
              >{c.enroll} →</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: `linear-gradient(transparent,${t.bg})`, pointerEvents: "none" }} />
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────
function StatsBar({ t, c }) {
  const [ref, inView] = useInView(.3);
  const vals = [
    useCounter(500, inView), useCounter(8, inView), useCounter(3, inView), useCounter(100, inView),
  ];
  return (
    <section ref={ref} style={{ background: t.bg2, padding: "64px 5%", borderTop: `1px solid rgba(${t.gr},.1)`, borderBottom: `1px solid rgba(${t.gr},.1)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 28 }}>
        {c.stats.map(([val, label], i) => (
          <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: "clamp(36px,5vw,52px)", lineHeight: 1, color: t.p, animation: inView ? `countIn .5s ease ${i * .08}s both` : "none" }}>{vals[i]}{val.replace(/[0-9৳]/g, "")}</div>
            <div style={{ height: 3, background: `rgba(${t.gr},.12)`, borderRadius: 2, margin: "8px auto 8px", width: 60, overflow: "hidden" }}>
              <div style={{ height: "100%", background: t.p, width: inView ? "100%" : "0%", transition: `width 1.8s ease ${i * .15}s` }} />
            </div>
            <div style={{ color: t.mu, fontSize: 13, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── COURSES ─────────────────────────────────────────────────────────
function Courses({ t, c }) {
  return (
    <section style={{ padding: "96px 5%", background: t.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-block", background: `rgba(${t.gr},.08)`, border: `1px solid rgba(${t.gr},.2)`, borderRadius: 50, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: t.p, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{c.cTitle}</div>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,3.5vw,40px)", color: t.tx, marginBottom: 12 }}>{c.cTitle}</h2>
          <p style={{ color: t.mu, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>{c.cSub}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 24 }}>
          {c.courses.map((cr, i) => (
            <div key={i} className={`card sr d${i + 1}`} style={{ background: t.card, border: `1px solid rgba(${t.gr},.${i === 1 ? "25" : "12"})`, borderRadius: 18, overflow: "hidden", boxShadow: i === 1 ? `0 0 32px rgba(${t.gr},.1)` : "none", position: "relative" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 48px rgba(${t.gr},.18)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = i === 1 ? `0 0 32px rgba(${t.gr},.1)` : "none"}
            >
              {i === 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.p }} />}
              {cr.tag && <div style={{ position: "absolute", top: 16, right: 16, background: t.p, color: t.bg, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 50 }}>{cr.tag}</div>}
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ fontSize: 34, marginBottom: 8 }}>{cr.icon}</div>
                <div style={{ color: t.p, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>{cr.eng}</div>
                <h3 style={{ fontWeight: 800, fontSize: 20, color: t.tx, marginBottom: 18 }}>{cr.title}</h3>
              </div>
              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ borderTop: `1px solid rgba(255,255,255,.06)`, paddingTop: 16, marginBottom: 16 }}>
                  {cr.topics.map(tp => (
                    <div key={tp} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `1px solid rgba(${t.gr},.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: t.p, fontWeight: 700 }}>✓</div>
                      <span style={{ color: t.tx + "99", fontSize: 13 }}>{tp}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: t.mu }}>মাত্র</span>
                  <span style={{ fontWeight: 900, fontSize: 26, color: t.p }}>৳{cr.price}</span>
                </div>
                <button onClick={() => window.open("tel:01643928687")} style={{ width: "100%", padding: "11px", borderRadius: 9, background: i === 1 ? t.p : `rgba(${t.gr},.1)`, color: i === 1 ? t.bg : t.p, border: `1px solid rgba(${t.gr},.22)`, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => { e.target.style.background = t.p; e.target.style.color = t.bg; e.target.style.boxShadow = `0 0 18px rgba(${t.gr},.4)`; }}
                  onMouseLeave={e => { e.target.style.background = i === 1 ? t.p : `rgba(${t.gr},.1)`; e.target.style.color = i === 1 ? t.bg : t.p; e.target.style.boxShadow = "none"; }}
                >{c.cBtn}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────
function Features({ t, c }) {
  return (
    <section style={{ padding: "96px 5%", background: t.bg2, borderTop: `1px solid rgba(${t.gr},.08)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,3.5vw,40px)", color: t.tx }}>{c.wTitle}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {c.features.map((f, i) => (
            <div key={i} className={`card sr d${i + 1}`} style={{ background: t.card, border: `1px solid rgba(${t.gr},.1)`, borderRadius: 14, padding: "22px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.3)`; e.currentTarget.style.boxShadow = `0 8px 32px rgba(${t.gr},.1)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.1)`; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: `rgba(${t.gr},.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: t.tx, marginBottom: 5 }}>{f.t}</div>
                <div style={{ color: t.mu, fontSize: 13, lineHeight: 1.65 }}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────
function Steps({ t, c }) {
  return (
    <section style={{ padding: "96px 5%", background: t.bg, borderTop: `1px solid rgba(${t.gr},.08)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="sr sm-center" style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,3.5vw,40px)", color: t.tx }}>{c.sTitle}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 32, position: "relative" }}>
          <div className="hide-sm" style={{ position: "absolute", top: 36, left: "16%", right: "16%", height: 1, background: `linear-gradient(90deg,rgba(${t.gr},.06),rgba(${t.gr},.25),rgba(${t.gr},.06))`, zIndex: 0 }} />
          {c.steps.map((s, i) => (
            <div key={i} className={`sr d${i + 1}`} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.card, border: `2px solid rgba(${t.gr},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px", transition: "border-color .3s,box-shadow .3s", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.p; e.currentTarget.style.boxShadow = `0 0 24px rgba(${t.gr},.25)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.2)`; e.currentTarget.style.boxShadow = "none"; }}
              >
                {["📞", "📋", "🎓"][i]}
                <div style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: "50%", background: t.p, color: t.bg, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: t.tx, marginBottom: 10 }}>{s}</h3>
              <p style={{ color: t.mu, fontSize: 14, lineHeight: 1.75, maxWidth: 220, margin: "0 auto" }}>{c.stepD[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS MARQUEE ─────────────────────────────────────────────
function Testimonials({ t, c }) {
  const doubled = [...c.tests, ...c.tests];
  return (
    <section style={{ padding: "96px 0", background: t.bg2, borderTop: `1px solid rgba(${t.gr},.08)`, overflow: "hidden", position: "relative" }}>
      <div className="sr" style={{ textAlign: "center", padding: "0 5%", marginBottom: 48 }}>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,3.5vw,40px)", color: t.tx }}>{c.tTitle}</h2>
      </div>
      <div style={{ display: "flex", gap: 20, width: "max-content", animation: "marquee 34s linear infinite" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((item, i) => (
          <div key={i} className="card" style={{ width: 330, flexShrink: 0, background: t.card, border: `1px solid rgba(${t.gr},.1)`, borderRadius: 16, padding: "24px", transition: "border-color .3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.3)`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 36px rgba(${t.gr},.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${t.gr},.1)`; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", marginBottom: 12 }}>
              {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 14 }}>{s}</span>)}
            </div>
            <p style={{ color: t.tx + "80", lineHeight: 1.8, fontSize: 14, marginBottom: 20, fontStyle: "italic" }}>"{item.q}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `rgba(${t.gr},.18)`, display: "flex", alignItems: "center", justifyContent: "center", color: t.p, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{item.n[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: t.tx }}>{item.n}</div>
                <div style={{ fontSize: 11, color: t.mu }}>{item.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 110, background: `linear-gradient(to right,${t.bg2},transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 110, background: `linear-gradient(to left,${t.bg2},transparent)`, pointerEvents: "none" }} />
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────
function CTA({ t, c }) {
  return (
    <section style={{ padding: "0 5% 96px" }}>
      <div className="sr" style={{ borderRadius: 22, overflow: "hidden", position: "relative", background: t.card, padding: "72px 8%", border: `1px solid rgba(${t.gr},.18)`, boxShadow: `0 0 80px rgba(${t.gr},.06)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1.5px 1.5px,rgba(${t.gr},.05) 1px,transparent 0)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "4%", top: "50%", transform: "translateY(-50%)", fontWeight: 900, fontSize: 180, color: `rgba(${t.gr},.04)`, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>৬০%</div>
        <div style={{ position: "absolute", right: "10%", bottom: "-20%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(${t.gr},.07),transparent)`, filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `rgba(${t.gr},.1)`, border: `1px solid rgba(${t.gr},.24)`, borderRadius: 50, padding: "4px 14px", marginBottom: 18 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.p, display: "inline-block", animation: "pulseRing 2s ease infinite" }} />
              <span style={{ color: t.p, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>সীমিত সময়ের অফার</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,4vw,46px)", lineHeight: 1.1, marginBottom: 14 }}>
              <span style={{ color: t.p }}>{c.ctaL1}</span><br />
              <span style={{ color: t.tx }}>{c.ctaL2}</span>
            </h2>
            <p style={{ color: t.mu, fontSize: 15, lineHeight: 1.8 }}>{c.ctaDesc}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <button onClick={() => window.open("tel:01643928687")} style={{ background: t.p, color: t.bg, border: "none", padding: "16px 40px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all .3s", boxShadow: `0 0 24px rgba(${t.gr},.4)` }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = `0 0 44px rgba(${t.gr},.6)`; }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 0 24px rgba(${t.gr},.4)`; }}
            >{c.ctaBtn}</button>
            <button onClick={() => window.open("tel:01643928687")} style={{ background: "transparent", color: t.mu, border: `1px solid rgba(${t.gr},.2)`, padding: "13px 36px", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={e => { e.target.style.borderColor = t.p; e.target.style.color = t.p; }}
              onMouseLeave={e => { e.target.style.borderColor = `rgba(${t.gr},.2)`; e.target.style.color = t.mu; }}
            >📞 {c.ctaCall}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────
function Footer({ t, c }) {
  return (
    <footer style={{ background: t.bg2, borderTop: `1px solid rgba(${t.gr},.08)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 5% 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 44, marginBottom: 40 }} className="sm-g1 sm-col">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: t.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: t.bg, boxShadow: `0 0 14px rgba(${t.gr},.4)`, flexShrink: 0 }}>দৃ</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: t.tx }}>Dristy Computer Training Center</div>
                <div style={{ fontSize: 11, color: t.mu }}>Gopalpur, Tangail, Bangladesh</div>
              </div>
            </div>
            <p style={{ color: t.mu, fontSize: 13, lineHeight: 1.85, maxWidth: 280, marginBottom: 18 }}>{c.fDesc}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[["📘","Facebook","https://www.facebook.com/share/1E2jAYRKhz/"],["📞","01643-928687","tel:01643928687"]].map(([ic,l,hr]) => (
                <a key={l} href={hr} style={{ background: `rgba(${t.gr},.07)`, border: `1px solid rgba(${t.gr},.15)`, borderRadius: 7, padding: "7px 12px", color: t.mu, fontSize: 12, textDecoration: "none", transition: "all .2s", display: "flex", alignItems: "center", gap: 5 }}
                  onMouseEnter={e => { e.currentTarget.style.background = `rgba(${t.gr},.14)`; e.currentTarget.style.color = t.p; e.currentTarget.style.borderColor = `rgba(${t.gr},.3)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `rgba(${t.gr},.07)`; e.currentTarget.style.color = t.mu; e.currentTarget.style.borderColor = `rgba(${t.gr},.15)`; }}
                >{ic} {l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: t.tx }}>কোর্সসমূহ</div>
            {c.fLinks.map(l => (
              <div key={l} style={{ color: t.mu, fontSize: 13, marginBottom: 9, cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = t.p} onMouseLeave={e => e.target.style.color = t.mu}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: t.tx }}>যোগাযোগ</div>
            {c.fContact.map(item => (
              <div key={item} style={{ color: t.mu, fontSize: 13, marginBottom: 10, lineHeight: 1.6 }}>{item}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid rgba(${t.gr},.08)`, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: t.mu + "88", fontSize: 12 }}>{c.copy}</span>
          <span style={{ color: t.mu + "55", fontSize: 11 }}>{c.approved}</span>
        </div>
      </div>
    </footer>
  );
}

// ─── THEME SWITCHER ───────────────────────────────────────────────────
function ThemeSwitcher({ current, onChange, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 28, left: 24, zIndex: 1000 }}>
      {open && (
        <div style={{ position: "absolute", bottom: 60, left: 0, background: `${t.bg2}F2`, backdropFilter: "blur(20px)", border: `1px solid rgba(${t.gr},.18)`, borderRadius: 14, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 5, width: 196, boxShadow: "0 8px 40px rgba(0,0,0,.5)", animation: "fadeIn .2s ease" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: t.mu, textTransform: "uppercase", marginBottom: 5, paddingLeft: 4 }}>THEMES</div>
          {Object.entries(THEMES).map(([key, th]) => (
            <button key={key} onClick={() => { onChange(key); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 9, background: current === key ? `rgba(${th.gr},.12)` : "transparent", border: `1px solid ${current === key ? `rgba(${th.gr},.3)` : "transparent"}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", transition: "all .18s", width: "100%" }}>
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: th.p }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: th.a }} />
              </div>
              <span style={{ color: current === key ? th.p : t.mu, fontSize: 12, fontWeight: current === key ? 700 : 400 }}>{th.emoji} {th.name}</span>
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ width: 46, height: 46, borderRadius: 12, background: t.card, border: `1px solid rgba(${t.gr},.22)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 20px rgba(0,0,0,.4)", transition: "all .25s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = t.p} onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${t.gr},.22)`}
      >🎨</button>
    </div>
  );
}

// ─── FLOATING WHATSAPP ────────────────────────────────────────────────
function FloatingWA({ t }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const to = setTimeout(() => setShow(true), 1800); return () => clearTimeout(to); }, []);
  return (
    <a href="https://wa.me/8801643928687" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 28, right: 24, zIndex: 1000, opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(.3)", transition: "all .6s cubic-bezier(.16,1,.3,1)", textDecoration: "none" }}>
      <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#25D366,#128C7E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 24px rgba(37,211,102,.5)", transition: "transform .25s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >💬</div>
    </a>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState("navy");
  const [lang, setLang] = useState("bn");
  const [cursorOn, setCursorOn] = useState(false);
  const t = THEMES[themeKey];
  const c = L[lang];
  useScrollReveal();
  return (
    <>
      <style>{CSS + themeVars(t)}</style>
      <DotTrailCursor active={cursorOn} rgb={t.gr} />
      <ScrollProgressBar t={t} />
      <Navbar t={t} c={c} lang={lang} setLang={setLang} cursorOn={cursorOn} setCursorOn={setCursorOn} />
      {/* key on Hero remounts on theme/lang change → re-triggers scramble */}
      <Hero key={`${themeKey}-${lang}`} t={t} c={c} />
      <StatsBar t={t} c={c} />
      <Courses t={t} c={c} />
      <Features t={t} c={c} />
      <Steps t={t} c={c} />
      <Testimonials t={t} c={c} />
      <CTA t={t} c={c} />
      <Footer t={t} c={c} />
      <ThemeSwitcher current={themeKey} onChange={setThemeKey} t={t} />
      <FloatingWA t={t} />
    </>
  );
}
