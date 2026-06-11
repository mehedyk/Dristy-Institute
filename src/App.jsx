import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEMES (10 themes: dark/light alternating) ───────────────────────
// 1-slate(darkish) 2-sunrise(light) 3-abyss(dark) 4-snow(light)
// 5-forest(darkish black-green) 6-jade(light NEW) 7-carbon(dark)
// 8-ocean(light NEW) 9-obsidian(darkish) 10-rose(light NEW)
const THEMES = {
  slate:    { name:"Deep Slate",   emoji:"🩵", dark:true,  bg:"#030A0F", bg2:"#061018", card:"#0A1820", p:"#06B6D4", a:"#EC4899", tx:"#E0FAFF", mu:"#2E6070", gr:"6,182,212" },
  sunrise:  { name:"Sunrise",      emoji:"🌅", dark:false, bg:"#FFFBF0", bg2:"#FFF4DC", card:"#FFECC4", p:"#B45309", a:"#0F766E", tx:"#1C0A00", mu:"#78532A", gr:"180,83,9" },
  abyss:    { name:"Abyss",        emoji:"🌌", dark:true,  bg:"#040408", bg2:"#080810", card:"#0E0E1C", p:"#818CF8", a:"#F472B6", tx:"#EEF2FF", mu:"#4F4688", gr:"129,140,248" },
  snow:     { name:"Snow White",   emoji:"⬜", dark:false, bg:"#FFFFFF", bg2:"#EFF4FF", card:"#E2EAFF", p:"#1D4ED8", a:"#DC2626", tx:"#0F172A", mu:"#4B6080", gr:"29,78,216" },
  forest:   { name:"Deep Forest",  emoji:"🌿", dark:true,  bg:"#030F08", bg2:"#061410", card:"#0A1E12", p:"#16A34A", a:"#D97706", tx:"#E8FAF0", mu:"#3A6A4A", gr:"22,163,74" },
  jade:     { name:"Jade Light",   emoji:"💚", dark:false, bg:"#F0FAF5", bg2:"#E4F5ED", card:"#D4EDDE", p:"#059669", a:"#D97706", tx:"#0A2318", mu:"#527A65", gr:"5,150,105" },
  carbon:   { name:"Carbon",       emoji:"🔴", dark:true,  bg:"#080808", bg2:"#0F0F0F", card:"#161616", p:"#EF4444", a:"#F97316", tx:"#FAFAFA", mu:"#555555", gr:"239,68,68" },
  ocean:    { name:"Ocean Mist",   emoji:"🌊", dark:false, bg:"#F0FFFE", bg2:"#E0FAF8", card:"#C8F2EE", p:"#0D9488", a:"#F97316", tx:"#062726", mu:"#3D8A84", gr:"13,148,136" },
  obsidian: { name:"Obsidian",     emoji:"🟡", dark:true,  bg:"#030200", bg2:"#080704", card:"#100F08", p:"#F59E0B", a:"#10B981", tx:"#FFF8E7", mu:"#6A5A2A", gr:"245,158,11" },
  rose:     { name:"Rose Petal",   emoji:"🌸", dark:false, bg:"#FFF8F8", bg2:"#FFEEF0", card:"#FFE0E4", p:"#E11D48", a:"#059669", tx:"#200A0E", mu:"#8A4B5A", gr:"225,29,72" },
};
const THEME_KEYS = Object.keys(THEMES);

const NAV_IDS = ["courses","why-us","contact"];
const scrollTo = id => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 98, behavior: "smooth" });
};

const CURSOR_EFFECTS = ["off","dot","glow","sparkle","ripple","spotlight","trail","comet","fire"];
const CURSOR_ICONS   = { off:"○", dot:"·", glow:"◉", sparkle:"✸", ripple:"⊕", spotlight:"☀", trail:"〰", comet:"☄", fire:"🔥" };
const CURSOR_LABELS  = { off:"Off", dot:"Dots", glow:"Glow", sparkle:"Stars", ripple:"Ripple", spotlight:"Light", trail:"Trail", comet:"Comet", fire:"Fire" };

const L = {
  bn: {
    nav:["কোর্সসমূহ","কেন আমরা","যোগাযোগ"], enroll:"ভর্তি হোন",
    ticker:["🎓 নতুন সেশনে ভর্তি চলছে — আসন সীমিত","🔥 60% বিশেষ ভর্তি ছাড়","📞 01643-928687","📜 বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত","💻 মাত্র ৳1,850 থেকে শুরু"],
    tag:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত",
    h1:"কম্পিউটার শিখুন,", h2:"ক্যারিয়ার গড়ুন",
    desc:"দৃষ্টি কম্পিউটার প্রশিক্ষণ ইনস্টিটিউটে ৩ মাস, ৬ মাস ও ১ বছর মেয়াদী কোর্স। মাত্র ৳1,850 থেকে শুরু।",
    btn1:"ভর্তি হোন এখনই", btn2:"কল করুন: 01643-928687",
    disc:"60% ভর্তি ছাড়", discSub:"সীমিত সময়ের অফার",
    trust:["সরকার অনুমোদিত","অভিজ্ঞ প্রশিক্ষক","সার্টিফিকেট প্রদান"],
    stats:[["500+","শিক্ষার্থী"],["8+","বছর অভিজ্ঞতা"],["3টি","কোর্স"],["100%","সার্টিফিকেট"]],
    cTitle:"আমাদের কোর্সসমূহ", cSub:"আপনার সময় ও বাজেট অনুযায়ী সেরা কোর্সটি বেছে নিন",
    courses:[
      {dur:"৩ মাস",eng:"3 Months",title:"অফিস বেসিক",price:"1,850",icon:"💼",topics:["MS Word, Excel, PowerPoint","বাংলা ও ইংরেজি টাইপিং","Email ও Internet","Basic Computer Skills"]},
      {dur:"৬ মাস",eng:"6 Months",title:"অফিস + ডিজাইন",price:"3,500",icon:"🎨",tag:"সবচেয়ে জনপ্রিয়",topics:["অফিস বেসিক সম্পূর্ণ","Adobe Photoshop & Illustrator","Logo ও Banner Design","Basic Accounting"]},
      {dur:"১ বছর",eng:"1 Year",title:"প্রফেশনাল কোর্স",price:"6,000",icon:"🏆",topics:["অফিস + ডিজাইন সম্পূর্ণ","Web Design (HTML/CSS)","Accounting Software","জাতীয় সার্টিফিকেট"]},
    ],
    cBtn:"এই কোর্সে ভর্তি হোন →",
    wTitle:"কেন আমাদের বেছে নেবেন",
    features:[
      {icon:"🏛️",t:"সরকার অনুমোদিত",d:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক স্বীকৃত প্রতিষ্ঠান"},
      {icon:"👨‍🏫",t:"অভিজ্ঞ প্রশিক্ষক",d:"দক্ষ ও অভিজ্ঞ শিক্ষকদের সরাসরি তত্ত্বাবধানে শিক্ষা"},
      {icon:"🖥️",t:"আধুনিক ল্যাব",d:"সর্বাধুনিক কম্পিউটার সজ্জিত হাতে-কলমে শিক্ষার পরিবেশ"},
      {icon:"📜",t:"জাতীয় সার্টিফিকেট",d:"কোর্স শেষে সরকার স্বীকৃত সনদ প্রদান করা হয়"},
      {icon:"💰",t:"সাশ্রয়ী মূল্য",d:"মাত্র ৳1,850 থেকে শুরু — সবার নাগালের মধ্যে"},
      {icon:"🕐",t:"নমনীয় সময়সূচী",d:"সকাল, বিকেল ও সন্ধ্যা ব্যাচে ক্লাসের সুবিধা"},
    ],
    sTitle:"মাত্র তিন ধাপে শুরু করুন",
    steps:["যোগাযোগ করুন","কোর্স বেছে নিন","শিখুন ও এগিয়ে যান"],
    stepD:["WhatsApp বা সরাসরি এসে ভর্তির বিস্তারিত জানুন","আপনার সুবিধামতো কোর্স ও ব্যাচ নির্বাচন করুন","সার্টিফিকেট নিয়ে ক্যারিয়ার গড়ুন"],
    tTitle:"শিক্ষার্থীরা যা বলছেন",
    tests:[
      {n:"রাহেলা বেগম",r:"৬ মাস কোর্স সম্পন্ন",q:"এখানে শিখে একটি অফিসে ডেটা এন্ট্রি অপারেটর হিসেবে কাজ করছি। শিক্ষকরা অনেক ধৈর্যশীল।"},
      {n:"মো. আরিফ হোসেন",r:"১ বছর কোর্স সম্পন্ন",q:"গ্রাফিক ডিজাইনে ফ্রিল্যান্সিং করে ভালো আয় করছি। এই কোর্স আমার জীবন বদলে দিয়েছে।"},
      {n:"সুমাইয়া আক্তার",r:"৩ মাস কোর্স সম্পন্ন",q:"ছোট কোর্স কিন্তু শেখার মান অনেক উন্নত। ফি অনেক সাশ্রয়ী এবং পরিবেশ খুবই ভালো।"},
      {n:"কামাল উদ্দিন",r:"৬ মাস কোর্স সম্পন্ন",q:"এখন নিজেই ব্যানার ও লোগো ডিজাইন করি। দৃষ্টি কম্পিউটারের জন্য অনেক কৃতজ্ঞ।"},
    ],
    ctaL1:"এখনই ভর্তি হোন,", ctaL2:"পান 60% বিশেষ ছাড়!",
    ctaDesc:"নতুন সেশনে ভর্তি চলছে। আসন সীমিত — দেরি না করে আজই যোগাযোগ করুন।",
    ctaBtn:"ভর্তি হোন এখনই", ctaCall:"কল করুন: 01643-928687",
    fDesc:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত। সুলভ মূল্যে মানসম্পন্ন আইটি শিক্ষা।",
    fLinks:["৩ মাসের কোর্স","৬ মাসের কোর্স","১ বছরের কোর্স","অফিস কোর্স","গ্রাফিক ডিজাইন"],
    fContact:["📍 গোপালপুর, টাঙ্গাইল, বাংলাদেশ","📞 01643-928687","📘 Facebook Page","⏰ শনি–বৃহস্পতি: সকাল 9টা–রাত 8টা"],
    copy:"© ২০২৬ দৃষ্টি কম্পিউটার ট্রেনিং সেন্টার। সর্বস্বত্ব সংরক্ষিত।",
    approved:"বাংলাদেশ কারিগরি শিক্ষাবোর্ড অনুমোদিত",
    devBy:"বানিয়েছেন", devName:"মেহেদী",
  },
  en: {
    nav:["Courses","Why Us","Contact"], enroll:"Enroll Now",
    ticker:["🎓 New session open — Limited seats!","🔥 60% special discount on admission","📞 01643-928687","📜 Bangladesh Technical Education Board Approved","💻 Starting from just ৳1,850"],
    tag:"Bangladesh Technical Education Board Approved",
    h1:"Learn Computer Skills,", h2:"Build Your Career",
    desc:"Dristy Computer Training Institute offers 3 month, 6 month & 1 year courses. Starting from just ৳1,850.",
    btn1:"Enroll Now", btn2:"Call: 01643-928687",
    disc:"60% Admission Discount", discSub:"Limited time offer",
    trust:["Govt. Approved","Expert Trainers","Certificate Awarded"],
    stats:[["500+","Students Trained"],["8+","Years Experience"],["3","Courses"],["100%","Certified"]],
    cTitle:"Our Courses", cSub:"Choose the best course based on your time and budget",
    courses:[
      {dur:"৩ মাস",eng:"3 Months",title:"Office Basics",price:"১,৮৫০",icon:"💼",topics:["MS Word, Excel, PowerPoint","Bangla & English Typing","Email & Internet","Basic Computer Skills"]},
      {dur:"৬ মাস",eng:"6 Months",title:"Office + Design",price:"৩,৫০০",icon:"🎨",tag:"Most Popular",topics:["Full Office Basics","Adobe Photoshop & Illustrator","Logo & Banner Design","Basic Accounting"]},
      {dur:"১ বছর",eng:"1 Year",title:"Professional Course",price:"৬,০০০",icon:"🏆",topics:["Full Office + Design","Web Design (HTML/CSS)","Accounting Software","National Certificate"]},
    ],
    cBtn:"Enroll in This Course →",
    wTitle:"Why Choose Us",
    features:[
      {icon:"🏛️",t:"Govt. Approved",d:"Recognized by Bangladesh Technical Education Board"},
      {icon:"👨‍🏫",t:"Expert Trainers",d:"Highly qualified and experienced instructors"},
      {icon:"🖥️",t:"Modern Lab",d:"State-of-the-art computers for hands-on learning"},
      {icon:"📜",t:"National Certificate",d:"Nationally recognized certificate upon completion"},
      {icon:"💰",t:"Affordable Fees",d:"Starting from ৳1,850 — within everyone's reach"},
      {icon:"🕐",t:"Flexible Schedule",d:"Morning, afternoon & evening batches available"},
    ],
    sTitle:"Start in Just 3 Steps",
    steps:["Contact Us","Choose a Course","Learn & Grow"],
    stepD:["Visit or WhatsApp us to get full admission details","Select the course and batch that suits your schedule","Complete your course and build a career with a certificate"],
    tTitle:"What Our Students Say",
    tests:[
      {n:"Rahela Begum",r:"6 Month Course Completed",q:"After training here I'm working as a data entry operator. The teachers are very patient."},
      {n:"Md. Arif Hossain",r:"1 Year Course Completed",q:"I'm freelancing in graphic design and earning well. This course changed my life."},
      {n:"Sumaiya Akter",r:"3 Month Course Completed",q:"Short course but excellent quality. The fees are very affordable and the environment is great."},
      {n:"Kamal Uddin",r:"6 Month Course Completed",q:"I now design banners and logos myself. Very grateful to Dristy Computer."},
    ],
    ctaL1:"Enroll Now,", ctaL2:"Get 60% Discount!",
    ctaDesc:"New session enrollment is open. Limited seats — contact us today without delay.",
    ctaBtn:"Enroll Now", ctaCall:"Call: 01643-928687",
    fDesc:"Bangladesh Technical Education Board Approved. Quality IT education at affordable prices.",
    fLinks:["3 Month Course","6 Month Course","1 Year Course","Office Course","Graphic Design"],
    fContact:["📍 Gopalpur, Tangail, Bangladesh","📞 01643-928687","📘 Facebook Page","⏰ Sat–Thu: 9AM–8PM"],
    copy:"© 2026 Dristy Computer Training Center. All rights reserved.",
    approved:"Bangladesh Technical Education Board Approved",
    devBy:"Developed by", devName:"Mehedy",
  },
};

// ─── CSS ─────────────────────────────────────────────────────────────
// Font choice: Kalpurush — clean, modern Bengali typeface.
// Perfect for a professional computer-training brand: technical
// precision meets warm, community-focused Bengali identity.
const CSS = `
  @import url('https://fonts.maateen.me/kalpurush/font.css');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;700;900&display=swap');
  @font-face{font-family:'BnNums';src:local('Noto Sans Bengali'),local('NotoSansBengali'),url('https://fonts.gstatic.com/s/notosansbengali/v28/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolLudCk8izI0lc.woff2') format('woff2');unicode-range:U+09E6-09EF;font-weight:100 900}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'BnNums','Kalpurush','Hind Siliguri','Poppins',system-ui,sans-serif;overflow-x:hidden;line-height:1.6;transition:background .3s,color .3s}
  h1,h2,h3,h4{font-family:'BnNums','Kalpurush','Poppins','Hind Siliguri',sans-serif}
  button{font-family:'BnNums','Kalpurush','Poppins','Hind Siliguri',sans-serif}
  section{scroll-margin-top:98px}

  .sr{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr-l{opacity:0;transform:translateX(-40px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr-r{opacity:0;transform:translateX(40px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .sr.on,.sr-l.on,.sr-r.on{opacity:1!important;transform:none!important}
  .d1{transition-delay:.06s}.d2{transition-delay:.13s}.d3{transition-delay:.20s}.d4{transition-delay:.27s}.d5{transition-delay:.34s}.d6{transition-delay:.41s}

  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes pulseRing{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
  @keyframes countIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
  @keyframes themeFlash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
  @keyframes cardRipple{0%{width:0;height:0;opacity:.45}100%{width:220px;height:220px;opacity:0}}
  @keyframes burstOut{0%{transform:rotate(var(--r,0deg)) translateX(0);opacity:.8}100%{transform:rotate(var(--r,0deg)) translateX(55px);opacity:0}}

  @keyframes orbSpin{
    0%{transform:scale(1) rotate(0deg)}
    35%{transform:scale(1.42) rotate(195deg)}
    68%{transform:scale(.9) rotate(318deg)}
    100%{transform:scale(1) rotate(360deg)}
  }
  @keyframes starTwinkle{
    0%,100%{opacity:.9;transform:scale(1)}
    42%{opacity:.06;transform:scale(.35)}
    72%{opacity:.55;transform:scale(.7)}
  }
  @keyframes sunGlow{
    0%,100%{box-shadow:0 0 13px rgba(255,220,0,.95),0 0 28px rgba(255,185,0,.4)}
    50%{box-shadow:0 0 22px rgba(255,235,0,1),0 0 48px rgba(255,200,0,.7)}
  }
  @keyframes moonFloat{
    0%,100%{transform:translateY(0) rotate(0deg)}
    50%{transform:translateY(-2px) rotate(5deg)}
  }
  @keyframes sunRaysSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes cloudDrift{
    0%,100%{transform:translateX(0) scaleX(1)}
    50%{transform:translateX(8px) scaleX(1.12)}
  }

  .card{transition:transform .28s ease,box-shadow .28s ease}
  .card:hover{transform:translateY(-5px)}

  @media(max-width:768px){
    .hide-sm{display:none!important}
    .show-sm{display:flex!important}
    .sm-col{flex-direction:column!important}
    .sm-full{width:100%!important;flex:none!important;min-width:0!important}
    .sm-center{text-align:center!important;align-items:center!important;justify-content:center!important}
    .sm-g1{grid-template-columns:1fr!important}
    .sm-g2{grid-template-columns:1fr 1fr!important}
  }
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:var(--p);border-radius:2px}
  ::-webkit-scrollbar-track{background:var(--bg)}
`;
const themeVars = t => `:root{--bg:${t.bg};--bg2:${t.bg2};--card:${t.card};--p:${t.p};--a:${t.a};--tx:${t.tx};--mu:${t.mu};--gr:${t.gr}}body{background:${t.bg};color:${t.tx}}`;

// ─── HOOKS ───────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      en => en.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1, rootMargin: "0px 0px -28px 0px" }
    );
    document.querySelectorAll(".sr,.sr-l,.sr-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
function useInView(thr = 0.2) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: thr });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [thr]);
  return [ref, v];
}
function useCounter(target, inView) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = null; const dur = 2000;
    const tick = ts => { if (!s) s = ts; const p = Math.min((ts-s)/dur,1); setV(Math.floor((1-Math.pow(1-p,3))*target)); if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return v;
}
function useScramble(text, active) {
  const [disp, setDisp] = useState("");
  useEffect(() => {
    if (!active) { setDisp(""); return; }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&";
    let iter = 0;
    const iv = setInterval(() => {
      setDisp(text.split("").map((ch,i) => { if(ch===" "||ch===",") return ch; if(i<iter) return text[i]; return chars[Math.floor(Math.random()*chars.length)]; }).join(""));
      iter += 0.4;
      if (iter > text.length) { setDisp(text); clearInterval(iv); }
    }, 36);
    return () => clearInterval(iv);
  }, [active, text]);
  return disp;
}
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => { const max = document.documentElement.scrollHeight-window.innerHeight; setP(max>0?(window.scrollY/max)*100:0); };
    window.addEventListener("scroll", fn, {passive:true});
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}
function useClickOutside(ref, cb) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [cb]);
}

// ─── CURSOR SYSTEM — 9 effects ───────────────────────────────────────
function CursorSystem({ effect, rgb }) {
  const canvasRef = useRef(null);
  const domRef    = useRef(null);

  useEffect(() => {
    const CANVAS_FX = ["dot","sparkle","ripple","trail","comet","fire"];
    if (!CANVAS_FX.includes(effect)) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); let animId;
    const resize = () => { c.width=window.innerWidth; c.height=window.innerHeight; };
    resize(); window.addEventListener("resize", resize);

    const trail=[],sparks=[],ripples=[],trailPts=[],cometPts=[],firePts=[];

    const onMove = (e) => {
      if (effect==="dot") { trail.push({x:e.clientX,y:e.clientY,life:1}); if(trail.length>24) trail.shift(); }
      if (effect==="sparkle" && Math.random()>.45)
        for(let i=0;i<3;i++) sparks.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4-1.2,life:1,sz:Math.random()*3+1});
      if (effect==="trail")  { trailPts.push({x:e.clientX,y:e.clientY,life:1}); if(trailPts.length>55) trailPts.shift(); }
      if (effect==="comet")  { cometPts.push({x:e.clientX,y:e.clientY,life:1}); if(cometPts.length>34) cometPts.shift(); }
      if (effect==="fire") {
        for(let i=0;i<4;i++) firePts.push({
          x:e.clientX+(Math.random()-.5)*18, y:e.clientY+5,
          vx:(Math.random()-.5)*2.2, vy:-(Math.random()*3+1.8),
          life:1, size:Math.random()*5.5+2.5
        });
      }
    };
    const onClick = (e) => { if(effect==="ripple") ripples.push({x:e.clientX,y:e.clientY,r:0,life:1}); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    const star = (x,y,sz) => {
      ctx.beginPath();
      for(let p=0;p<4;p++){
        const a=(p/4)*Math.PI*2,r1=sz*2.2,r2=sz*.5;
        if(p===0) ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1); else ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);
        const ma=a+Math.PI/4; ctx.lineTo(Math.cos(ma)*r2,Math.sin(ma)*r2);
      }
      ctx.closePath(); ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);

      if(effect==="dot")
        trail.forEach(d=>{ d.life=Math.max(0,d.life-.052); if(!d.life)return; ctx.beginPath(); ctx.arc(d.x,d.y,5*d.life,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},${d.life*.8})`; ctx.fill(); });

      if(effect==="sparkle")
        for(let i=sparks.length-1;i>=0;i--){ const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=.09; s.life=Math.max(0,s.life-.03); if(!s.life){sparks.splice(i,1);continue;} ctx.save(); ctx.translate(s.x,s.y); ctx.rotate(s.life*Math.PI*2); ctx.fillStyle=`rgba(${rgb},${s.life})`; star(0,0,s.sz*s.life); ctx.restore(); }

      if(effect==="ripple")
        for(let i=ripples.length-1;i>=0;i--){ const r=ripples[i]; r.r+=4.5; r.life=Math.max(0,r.life-.022); if(!r.life){ripples.splice(i,1);continue;} ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2); ctx.strokeStyle=`rgba(${rgb},${r.life*.85})`; ctx.lineWidth=2; ctx.stroke(); ctx.beginPath(); ctx.arc(r.x,r.y,r.r*.55,0,Math.PI*2); ctx.strokeStyle=`rgba(${rgb},${r.life*.35})`; ctx.lineWidth=1; ctx.stroke(); }

      if(effect==="trail"){
        ctx.lineCap="round"; ctx.lineJoin="round";
        for(let i=trailPts.length-1;i>=0;i--){
          trailPts[i].life=Math.max(0,trailPts[i].life-.016);
          if(!trailPts[i].life){ trailPts.splice(i,1); }
        }
        for(let i=1;i<trailPts.length;i++){
          const p=i/trailPts.length;
          ctx.beginPath(); ctx.moveTo(trailPts[i-1].x,trailPts[i-1].y); ctx.lineTo(trailPts[i].x,trailPts[i].y);
          ctx.strokeStyle=`rgba(${rgb},${p*trailPts[i].life*.78})`; ctx.lineWidth=p*8; ctx.stroke();
        }
        if(trailPts.length>0){
          const h=trailPts[trailPts.length-1];
          ctx.beginPath(); ctx.arc(h.x,h.y,5,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},.9)`; ctx.fill();
          ctx.beginPath(); ctx.arc(h.x,h.y,9,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},.2)`; ctx.fill();
        }
      }

      if(effect==="comet"){
        ctx.lineCap="round"; ctx.lineJoin="round";
        for(let i=cometPts.length-1;i>=0;i--){
          cometPts[i].life=Math.max(0,cometPts[i].life-.022);
          if(!cometPts[i].life){ cometPts.splice(i,1); }
        }
        for(let i=1;i<cometPts.length;i++){
          const p=i/cometPts.length;
          ctx.beginPath(); ctx.moveTo(cometPts[i-1].x,cometPts[i-1].y); ctx.lineTo(cometPts[i].x,cometPts[i].y);
          ctx.strokeStyle=`rgba(${rgb},${p*cometPts[i].life*.95})`; ctx.lineWidth=p*7; ctx.stroke();
        }
        if(cometPts.length>0){
          const h=cometPts[cometPts.length-1];
          ctx.beginPath(); ctx.arc(h.x,h.y,11,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},.18)`; ctx.fill();
          ctx.beginPath(); ctx.arc(h.x,h.y,6.5,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},.55)`; ctx.fill();
          ctx.beginPath(); ctx.arc(h.x,h.y,3.5,0,Math.PI*2); ctx.fillStyle="rgba(255,255,255,.96)"; ctx.fill();
        }
      }

      if(effect==="fire"){
        for(let i=firePts.length-1;i>=0;i--){
          const p=firePts[i];
          p.x+=p.vx; p.y+=p.vy; p.vy-=.065; p.vx*=.97; p.size*=.963;
          p.life=Math.max(0,p.life-.026);
          if(!p.life||p.size<.35){firePts.splice(i,1);continue;}
          const phase=1-p.life;
          const g=Math.floor(Math.max(0,195-phase*240));
          ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life*1.4,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,${Math.floor(g*.45)},0,${p.life*.35})`; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,${g},0,${p.life*.85})`; ctx.fill();
          if(p.life>.55){
            ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life*.4,0,Math.PI*2);
            ctx.fillStyle=`rgba(255,240,180,${(p.life-.55)*1.8})`; ctx.fill();
          }
        }
      }

      animId=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMove); window.removeEventListener("click",onClick); };
  }, [effect, rgb]);

  useEffect(() => {
    if (!["glow","spotlight"].includes(effect) || !domRef.current) return;
    const el = domRef.current;
    const onMove = (e) => {
      if(effect==="glow"){ el.style.left=(e.clientX-18)+"px"; el.style.top=(e.clientY-18)+"px"; el.style.opacity="1"; }
      if(effect==="spotlight") el.style.background=`radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px,rgba(${rgb},.13),transparent 70%)`;
    };
    const onLeave = ()=>{ el.style.opacity="0"; };
    window.addEventListener("mousemove",onMove); document.addEventListener("mouseleave",onLeave);
    return ()=>{ window.removeEventListener("mousemove",onMove); document.removeEventListener("mouseleave",onLeave); };
  }, [effect, rgb]);

  if(effect==="off") return null;
  return (
    <>
      {["dot","sparkle","ripple","trail","comet","fire"].includes(effect) && <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:99999}} />}
      {effect==="glow" && <div ref={domRef} style={{position:"fixed",width:36,height:36,borderRadius:"50%",border:`2px solid rgba(${rgb},.8)`,boxShadow:`0 0 16px rgba(${rgb},.55),0 0 36px rgba(${rgb},.2),inset 0 0 10px rgba(${rgb},.1)`,pointerEvents:"none",zIndex:99999,opacity:0,transition:"opacity .15s"}} />}
      {effect==="spotlight" && <div ref={domRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:99998,background:"transparent"}} />}
    </>
  );
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────
function ParticleCanvas({ rgb }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width=c.offsetWidth; c.height=c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({length:50}, () => ({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,a:Math.random()*.3+.07}));
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => { p.x=(p.x+p.vx+c.width)%c.width; p.y=(p.y+p.vy+c.height)%c.height; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},${p.a})`; ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) { const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<95){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(${rgb},${.09*(1-d/95)})`;ctx.lineWidth=.5;ctx.stroke();} }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",resize); };
  }, [rgb]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

// ─── TILT GLARE CARD ─────────────────────────────────────────────────
function TiltGlareCard({ children, style, max = 14 }) {
  const ref = useRef(null); const glare = useRef(null); const borderGlow = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [burst, setBurst] = useState(false);
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x=(e.clientX-left)/width, y=(e.clientY-top)/height;
    const rx=(y-.5)*-max*2, ry=(x-.5)*max*2, tx=(x-.5)*9, ty=(y-.5)*9;
    ref.current.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${tx}px,${ty}px) scale3d(1.04,1.04,1.04)`;
    if(glare.current){ glare.current.style.background=`radial-gradient(circle at ${x*100}% ${y*100}%,rgba(255,255,255,.22),transparent 55%)`; glare.current.style.opacity="1"; }
    if(borderGlow.current) borderGlow.current.style.background=`radial-gradient(circle 130px at ${x*100}% ${y*100}%,rgba(255,255,255,.14),transparent 65%)`;
  }, [max]);
  const onMouseEnter = useCallback(() => { setBurst(true); setTimeout(()=>setBurst(false),600); }, []);
  const onMouseLeave = useCallback(() => {
    if(ref.current) ref.current.style.transform="perspective(900px) rotateX(0) rotateY(0) translate(0,0) scale3d(1,1,1)";
    if(glare.current) glare.current.style.opacity="0";
    if(borderGlow.current) borderGlow.current.style.background="transparent";
  }, []);
  const onClick = useCallback((e) => {
    if(!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const id = Date.now()+Math.random();
    setRipples(r=>[...r,{x:e.clientX-left,y:e.clientY-top,id}]);
    setTimeout(()=>setRipples(r=>r.filter(rp=>rp.id!==id)),700);
  }, []);
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} onClick={onClick}
      className="tilt" style={{...style,position:"relative",overflow:"hidden"}}>
      <div ref={glare} style={{position:"absolute",inset:0,borderRadius:"inherit",opacity:0,transition:"opacity .25s",pointerEvents:"none",zIndex:10}} />
      <div ref={borderGlow} style={{position:"absolute",inset:0,borderRadius:"inherit",background:"transparent",pointerEvents:"none",zIndex:9}} />
      {ripples.map(rp=>(<div key={rp.id} style={{position:"absolute",left:rp.x,top:rp.y,width:0,height:0,borderRadius:"50%",background:"rgba(255,255,255,.22)",transform:"translate(-50%,-50%)",animation:"cardRipple .65s ease-out forwards",pointerEvents:"none",zIndex:11}} />))}
      {burst && Array.from({length:8},(_,i)=>(<div key={i} style={{position:"absolute",left:"50%",top:"50%",width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,.5)",pointerEvents:"none",zIndex:12,animation:`burstOut .55s ease-out ${i*0.045}s forwards`,transformOrigin:"0 0",transform:`rotate(${i*45}deg) translateX(0px)`}} />))}
      {children}
    </div>
  );
}

const WAIcon = ({size=24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

function ThemeFlash({ trigger }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setShow(true);
    const to = setTimeout(() => setShow(false), 450);
    return () => clearTimeout(to);
  }, [trigger]);
  if (!show) return null;
  return <div style={{position:"fixed",inset:0,zIndex:9997,background:"rgba(255,255,255,.18)",animation:"themeFlash .45s ease forwards",pointerEvents:"none"}} />;
}

function ScrollProgressBar({ t }) {
  const p = useScrollProgress();
  return <div style={{position:"fixed",top:0,left:0,zIndex:10000,height:3,width:`${p}%`,background:t.p,boxShadow:`0 0 8px rgba(${t.gr},.8)`,transition:"width .08s"}} />;
}

function NewsTicker({ t, c }) {
  const items = [...c.ticker, ...c.ticker];
  return (
    <div style={{background:`rgba(${t.gr},.07)`,borderBottom:`1px solid rgba(${t.gr},.16)`,height:30,display:"flex",alignItems:"center",overflow:"hidden"}}>
      <div style={{flexShrink:0,background:t.p,color:t.bg,fontSize:10,fontWeight:800,padding:"0 12px",height:"100%",display:"flex",alignItems:"center",letterSpacing:".08em",whiteSpace:"nowrap"}}>LIVE</div>
      <div style={{overflow:"hidden",flex:1}}>
        <div style={{display:"inline-flex",gap:"3.5rem",animation:"ticker 26s linear infinite",whiteSpace:"nowrap",paddingLeft:"1.5rem"}}>
          {items.map((item,i) => <span key={i} style={{color:t.tx,fontSize:11,opacity:.82,fontWeight:500}}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose, t, c, lang, setLang, themeKey, setThemeKey, cursorEffect, setCursorEffect, onThemeSwitch }) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1100,opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity .3s"}} />
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(320px,88vw)",background:t.bg2,borderLeft:`1px solid rgba(${t.gr},.15)`,zIndex:1101,transform:open?"translateX(0)":"translateX(100%)",transition:"transform .35s cubic-bezier(.16,1,.3,1)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 18px 14px",borderBottom:`1px solid rgba(${t.gr},.1)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:t.p,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:t.bg}}>দৃ</div>
            <div style={{fontWeight:700,fontSize:13,color:t.tx,lineHeight:1.2}}>Dristy Computer<br/><span style={{color:t.mu,fontSize:10,fontWeight:400}}>Gopalpur</span></div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:7,background:`rgba(${t.gr},.1)`,border:`1px solid rgba(${t.gr},.2)`,color:t.mu,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"10px 10px"}}>
          {c.nav.map((l,i) => (
            <button key={l} onClick={() => { scrollTo(NAV_IDS[i]); onClose(); }} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 10px",background:"transparent",border:"none",borderRadius:9,color:t.tx,fontSize:15,fontWeight:600,cursor:"pointer",transition:"background .18s",textAlign:"left"}}
              onMouseEnter={e=>e.currentTarget.style.background=`rgba(${t.gr},.08)`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            ><span style={{color:t.p,width:20}}>{"📚✅📞"[i*2]}</span>{l}</button>
          ))}
        </div>
        <div style={{height:1,background:`rgba(${t.gr},.1)`,margin:"0 10px"}} />
        <div style={{padding:"12px 10px",display:"flex",gap:8}}>
          <button onClick={()=>setLang(l=>l==="bn"?"en":"bn")} style={{flex:1,padding:"10px",background:`rgba(${t.gr},.09)`,border:`1px solid rgba(${t.gr},.2)`,borderRadius:8,color:t.p,fontSize:12,fontWeight:700,cursor:"pointer"}}>{lang==="bn"?"Switch to EN":"বাংলায় দেখুন"}</button>
        </div>
        <div style={{padding:"0 10px 10px"}}>
          <div style={{fontSize:9,color:t.mu,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8,paddingLeft:4,fontWeight:700}}>CURSOR EFFECTS</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
            {CURSOR_EFFECTS.map(ef=>(
              <button key={ef} onClick={()=>setCursorEffect(ef)} style={{padding:"9px 4px",background:cursorEffect===ef?t.p:`rgba(${t.gr},.07)`,border:`1px solid ${cursorEffect===ef?t.p:`rgba(${t.gr},.12)`}`,borderRadius:8,color:cursorEffect===ef?t.bg:t.mu,fontSize:11,cursor:"pointer",transition:"all .18s",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:15}}>{CURSOR_ICONS[ef]}</span>
                <span style={{fontSize:9,fontWeight:cursorEffect===ef?700:400}}>{CURSOR_LABELS[ef]}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:"0 10px 10px"}}>
          <div style={{fontSize:9,color:t.mu,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8,paddingLeft:4,fontWeight:700}}>THEMES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
            {Object.entries(THEMES).map(([key,th],i) => (
              <button key={key} onClick={()=>{onThemeSwitch(key);onClose();}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"9px 5px",background:themeKey===key?`rgba(${th.gr},.15)`:`rgba(${t.gr},.05)`,border:`1px solid ${themeKey===key?`rgba(${th.gr},.38)`:`rgba(${t.gr},.1)`}`,borderRadius:9,cursor:"pointer",transition:"all .16s",position:"relative"}}>
                <div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:th.dark?"#818CF8":"#F59E0B",opacity:.75}} />
                <div style={{display:"flex",gap:2}}><div style={{width:9,height:9,borderRadius:"50%",background:th.p}}/><div style={{width:9,height:9,borderRadius:"50%",background:th.a}}/></div>
                <span style={{color:themeKey===key?th.p:t.mu,fontSize:8,fontWeight:themeKey===key?700:400,textAlign:"center",lineHeight:1.3}}>{th.emoji}<br/>{i+1}.{th.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:"0 10px 26px",marginTop:"auto",display:"flex",flexDirection:"column",gap:9}}>
          <button onClick={()=>{window.open("tel:01643928687");onClose();}} style={{width:"100%",padding:"13px",background:t.p,color:t.bg,border:"none",borderRadius:9,fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 0 16px rgba(${t.gr},.38)`}}>{c.enroll}</button>
          <a href="tel:01643928687" style={{width:"100%",padding:"12px",background:`rgba(${t.gr},.09)`,color:t.p,border:`1px solid rgba(${t.gr},.22)`,borderRadius:9,fontWeight:600,fontSize:13,textDecoration:"none",textAlign:"center",display:"block"}}>📞 01643-928687</a>
        </div>
      </div>
    </>
  );
}

// ─── ANIMATED DAY / NIGHT THEME TOGGLE ───────────────────────────────
// Moon + stars for dark themes. Sun + clouds + rays for light themes.
// On click: orb spins 360°, sky background cross-fades, stars appear/vanish.
function ThemeToggleBtn({ themeKey, onCycleTheme, t }) {
  const [clickCount, setClickCount] = useState(0);
  const isDark = THEMES[themeKey]?.dark ?? true;
  const idx = THEME_KEYS.indexOf(themeKey);
  const nextKey = THEME_KEYS[(idx+1) % THEME_KEYS.length];

  const handle = () => {
    setClickCount(n => n + 1);
    onCycleTheme();
  };

  const STARS = [[7,5,1.6,0],[14,4,.9,.35],[24,8,1.4,.7],[36,5,.9,1.1],[47,9,1.6,1.45],[55,5,1,1.8],[20,19,1,.55],[42,20,1.1,1.25]];

  return (
    <button
      onClick={handle}
      title={`Theme ${idx+1}/10: ${THEMES[themeKey].name} → ${THEMES[nextKey].name}`}
      style={{
        position:"relative", width:74, height:34, borderRadius:17,
        border:"none", cursor:"pointer", padding:0, overflow:"hidden",
        background: isDark
          ? "linear-gradient(135deg,#04051A 0%,#0C1038 45%,#060D26 100%)"
          : "linear-gradient(135deg,#70C8F5 0%,#C8EEFF 35%,#FEFAE0 65%,#FFE878 100%)",
        boxShadow: isDark
          ? `0 0 0 1.5px rgba(${t.gr},.28), 0 0 16px rgba(${t.gr},.18), inset 0 1px 0 rgba(255,255,255,.05)`
          : `0 0 0 1.5px rgba(200,150,0,.45), 0 0 16px rgba(255,200,50,.28), inset 0 1px 0 rgba(255,255,255,.6)`,
        transition:"background .65s ease, box-shadow .4s ease",
        flexShrink:0,
      }}
    >
      {/* Stars */}
      {STARS.map(([x,y,size,delay],i) => (
        <div key={i} style={{
          position:"absolute",left:x,top:y,width:size,height:size,
          borderRadius:"50%",background:"#fff",
          opacity:isDark?.88:0,
          transition:"opacity .6s ease",
          animation:isDark?`starTwinkle 1.9s ease-in-out ${delay}s infinite`:"none",
          pointerEvents:"none",
        }} />
      ))}
      {/* Clouds */}
      <div style={{position:"absolute",left:5,top:9,fontSize:9,opacity:isDark?0:.55,transition:"opacity .5s ease",animation:isDark?"none":"cloudDrift 5s ease-in-out infinite",pointerEvents:"none",lineHeight:1}}>☁</div>
      <div style={{position:"absolute",left:18,top:19,fontSize:7,opacity:isDark?0:.38,transition:"opacity .5s ease .1s",animation:isDark?"none":"cloudDrift 7s ease-in-out 2.5s infinite",pointerEvents:"none",lineHeight:1}}>☁</div>
      {/* Horizon glow */}
      {!isDark && <div style={{position:"absolute",bottom:0,left:0,right:0,height:14,background:"linear-gradient(to top,rgba(255,200,50,.22),transparent)",pointerEvents:"none"}} />}
      {/* Orb — key remount triggers orbSpin animation on each click */}
      <div
        key={`orb-${clickCount}`}
        style={{
          position:"absolute",width:26,height:26,borderRadius:"50%",
          top:4, left:isDark?5:43,
          transition:"left .58s cubic-bezier(.16,1,.3,1),background .55s,box-shadow .55s",
          background:isDark
            ?"radial-gradient(circle at 33% 30%,#F0F4FF,#C8D0E4 60%,#A8B4CC)"
            :"radial-gradient(circle at 30% 28%,#FFFDE4,#FFE040 40%,#FFB800)",
          boxShadow:isDark
            ?"inset 2px -2px 4px rgba(0,0,0,.35),0 0 8px rgba(200,215,255,.3)"
            :"0 0 14px rgba(255,220,0,.98),0 0 28px rgba(255,190,0,.55),0 0 50px rgba(255,170,0,.2)",
          animation:clickCount>0
            ?"orbSpin .68s cubic-bezier(.16,1,.3,1)"
            :(isDark?"moonFloat 3.2s ease-in-out infinite":"sunGlow 2.6s ease-in-out infinite"),
          overflow:"hidden",flexShrink:0,
        }}
      >
        {isDark && <div style={{position:"absolute",width:20,height:20,borderRadius:"50%",background:"rgba(4,5,26,.78)",top:-5,left:12,pointerEvents:"none"}} />}
        {!isDark && <div style={{position:"absolute",inset:5,borderRadius:"50%",background:"rgba(255,255,210,.55)",pointerEvents:"none"}} />}
      </div>
      {/* Sun rays ring */}
      <div
        key={`rays-${clickCount}`}
        style={{
          position:"absolute",width:40,height:40,borderRadius:"50%",
          top:4-7,left:43-7,
          border:"1.5px dashed rgba(255,195,40,.38)",
          opacity:isDark?0:1,transition:"opacity .5s ease",
          animation:"sunRaysSpin 7s linear infinite",pointerEvents:"none",
        }}
      />
      {/* Counter pill */}
      <div style={{position:"absolute",bottom:3,right:5,fontSize:7,fontWeight:800,lineHeight:1,color:isDark?"rgba(180,200,255,.55)":"rgba(120,80,0,.5)",pointerEvents:"none",letterSpacing:".02em"}}>{idx+1}/{THEME_KEYS.length}</div>
    </button>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────
function Navbar({ t, c, lang, setLang, themeKey, cursorEffect, cycleCursor, menuOpen, setMenuOpen, onCycleTheme }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const fn=()=>setSc(window.scrollY>70); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); }, []);
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:998}}>
      <NewsTicker t={t} c={c} />
      <nav style={{height:62,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .35s",background:sc?`${t.bg}F0`:"transparent",backdropFilter:sc?"blur(18px)":"none",borderBottom:sc?`1px solid rgba(${t.gr},.12)`:"1px solid transparent"}}>
        <div style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <div style={{width:36,height:36,borderRadius:9,flexShrink:0,background:t.p,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:t.bg,boxShadow:`0 0 14px rgba(${t.gr},.45)`}}>দৃ</div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:t.tx,lineHeight:1.2}}>Dristy Computer</div>
            <div style={{fontSize:10,color:t.mu}}>Training Center, Gopalpur</div>
          </div>
        </div>
        <div className="hide-sm" style={{display:"flex",gap:24,alignItems:"center"}}>
          {c.nav.map((l,i) => (
            <button key={l} onClick={()=>scrollTo(NAV_IDS[i])} style={{background:"none",border:"none",color:t.mu,fontSize:13,fontWeight:500,cursor:"pointer",transition:"color .2s",padding:"4px 0"}}
              onMouseEnter={e=>e.target.style.color=t.p} onMouseLeave={e=>e.target.style.color=t.mu}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <button onClick={()=>setLang(l=>l==="bn"?"en":"bn")} style={{background:`rgba(${t.gr},.09)`,border:`1px solid rgba(${t.gr},.22)`,color:t.p,padding:"5px 11px",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}
            onMouseEnter={e=>e.currentTarget.style.background=`rgba(${t.gr},.18)`} onMouseLeave={e=>e.currentTarget.style.background=`rgba(${t.gr},.09)`}
          >{lang==="bn"?"EN":"বাং"}</button>
          {/* ── Animated day/night theme toggle button ── */}
          <ThemeToggleBtn themeKey={themeKey} onCycleTheme={onCycleTheme} t={t} />
          <button onClick={cycleCursor} title={`Cursor: ${CURSOR_LABELS[cursorEffect]}`} className="hide-sm" style={{minWidth:34,height:30,borderRadius:7,background:cursorEffect!=="off"?t.p:`rgba(${t.gr},.09)`,border:`1px solid rgba(${t.gr},.22)`,color:cursorEffect!=="off"?t.bg:t.mu,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 9px",gap:4,transition:"all .2s"}}>
            <span>{CURSOR_ICONS[cursorEffect]}</span>
            <span style={{fontSize:9,opacity:.75}}>{CURSOR_LABELS[cursorEffect]}</span>
          </button>
          <button onClick={()=>window.open("tel:01643928687")} className="hide-sm" style={{background:t.p,color:t.bg,border:"none",padding:"8px 17px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",boxShadow:`0 0 13px rgba(${t.gr},.38)`,transition:"all .22s",whiteSpace:"nowrap"}}
            onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow=`0 0 22px rgba(${t.gr},.55)`;}} onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=`0 0 13px rgba(${t.gr},.38)`;}}
          >{c.enroll}</button>
          <button onClick={()=>setMenuOpen(true)} style={{display:"none",width:34,height:34,borderRadius:8,background:`rgba(${t.gr},.09)`,border:`1px solid rgba(${t.gr},.2)`,cursor:"pointer",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}} className="show-sm">
            {[0,1,2].map(i=><div key={i} style={{width:16,height:2,borderRadius:1,background:t.p}}/>)}
          </button>
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
  const [mx, setMx] = useState({x:0,y:0});
  useEffect(() => { const to=setTimeout(()=>setOn(true),80); return()=>clearTimeout(to); }, []);
  useEffect(() => {
    const fs=()=>setSy(window.scrollY);
    const fm=e=>setMx({x:(e.clientX/window.innerWidth-.5)*28,y:(e.clientY/window.innerHeight-.5)*28});
    window.addEventListener("scroll",fs,{passive:true}); window.addEventListener("mousemove",fm);
    return()=>{window.removeEventListener("scroll",fs);window.removeEventListener("mousemove",fm);};
  }, []);
  const a = (d,ex={}) => ({opacity:on?1:0,transform:on?"none":"translateY(22px)",transition:`opacity .8s ease ${d},transform .8s cubic-bezier(.16,1,.3,1) ${d}`,...ex});
  return (
    <section ref={ref} style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",padding:"128px 5% 80px",background:t.bg}}>
      <ParticleCanvas rgb={t.gr} />
      <div style={{position:"absolute",width:560,height:560,borderRadius:"50%",background:`radial-gradient(circle,rgba(${t.gr},.08),transparent 70%)`,top:`calc(-8% + ${-mx.y*.3}px)`,left:`calc(20% + ${mx.x*.3}px)`,transform:`translateY(${-sy*.12}px)`,transition:"top .12s,left .12s",pointerEvents:"none",filter:"blur(10px)"}} />
      <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",background:`radial-gradient(circle,rgba(${t.gr},.05),transparent 70%)`,bottom:"5%",right:`calc(8% + ${-mx.x*.18}px)`,transform:`translateY(${sy*.07}px)`,pointerEvents:"none",filter:"blur(10px)"}} />
      <div style={{maxWidth:1140,margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:52,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:260}} className="sm-full sm-center">
            <div style={{...a("0s"),display:"inline-flex",alignItems:"center",gap:8,background:`rgba(${t.gr},.08)`,border:`1px solid rgba(${t.gr},.22)`,borderRadius:50,padding:"5px 15px",marginBottom:24}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:t.p,boxShadow:`0 0 8px ${t.p}`,animation:"pulseRing 2s ease infinite"}} />
              <span style={{color:t.p,fontSize:11,fontWeight:600,letterSpacing:".04em"}}>{c.tag}</span>
            </div>
            <h1 style={{...a("0.1s"),fontWeight:900,fontSize:"clamp(34px,5.2vw,62px)",lineHeight:1.08,marginBottom:14}}>
              <span style={{display:"block",color:t.tx}}>{s1||c.h1}</span>
              <span style={{display:"block",color:t.p}}>{s2||c.h2}</span>
            </h1>
            <p style={{...a("0.22s"),fontSize:"clamp(13px,1.6vw,15px)",color:t.tx+"88",lineHeight:1.88,marginBottom:32,maxWidth:440}}>{c.desc}</p>
            <div style={{...a("0.32s"),display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>window.open("tel:01643928687")} style={{background:t.p,color:t.bg,border:"none",padding:"13px 28px",borderRadius:9,fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 0 20px rgba(${t.gr},.4)`,transition:"all .22s"}}
                onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 0 32px rgba(${t.gr},.58)`;}} onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=`0 0 20px rgba(${t.gr},.4)`;}}
              >{c.btn1}</button>
              <button onClick={()=>window.open("tel:01643928687")} style={{background:"transparent",color:t.tx,border:`1.5px solid rgba(${t.gr},.28)`,padding:"12px 24px",borderRadius:9,fontWeight:600,fontSize:14,cursor:"pointer",transition:"all .22s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.p;e.currentTarget.style.color=t.p;e.currentTarget.style.background=`rgba(${t.gr},.07)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.28)`;e.currentTarget.style.color=t.tx;e.currentTarget.style.background="transparent";}}
              >{c.btn2}</button>
            </div>
            <div style={{...a("0.44s"),display:"flex",alignItems:"center",gap:12,marginTop:28,flexWrap:"wrap"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:9,background:`rgba(${t.gr},.07)`,border:`1px solid rgba(${t.gr},.18)`,borderRadius:10,padding:"9px 16px"}}>
                <span style={{fontSize:17}}>🔥</span>
                <div><div style={{color:t.p,fontWeight:800,fontSize:15}}>{c.disc}</div><div style={{color:t.mu,fontSize:11}}>{c.discSub}</div></div>
              </div>
              {c.trust.map(tr => <div key={tr} style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:t.p,fontSize:13}}>✓</span><span style={{color:t.mu,fontSize:12}}>{tr}</span></div>)}
            </div>
          </div>
          <div className="hide-sm" style={{opacity:on?1:0,transform:on?"none":"translateX(36px)",transition:"all .9s cubic-bezier(.16,1,.3,1) .42s",width:280,flexShrink:0}}>
            <div style={{background:`rgba(255,255,255,.04)`,backdropFilter:"blur(20px)",border:`1px solid rgba(${t.gr},.16)`,borderRadius:17,padding:"22px 20px",boxShadow:`0 0 44px rgba(${t.gr},.07),inset 0 1px 0 rgba(255,255,255,.05)`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{color:t.mu,fontSize:11}}>ভর্তি প্যাকেজ ২০২৬</span>
                <span style={{background:t.p,color:t.bg,fontSize:9,padding:"3px 9px",borderRadius:50,fontWeight:700}}>LIVE</span>
              </div>
              {c.courses.map((cr,i) => (
                <div key={i} style={{background:i===1?`rgba(${t.gr},.1)`:`rgba(255,255,255,.03)`,border:`1px solid ${i===1?`rgba(${t.gr},.28)`:"rgba(255,255,255,.05)"}`,borderRadius:9,padding:"10px 13px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .18s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=`rgba(${t.gr},.12)`} onMouseLeave={e=>e.currentTarget.style.background=i===1?`rgba(${t.gr},.1)`:"rgba(255,255,255,.03)"}
                >
                  <div><div style={{color:t.tx,fontWeight:600,fontSize:12}}>{cr.dur} {i===1?"⭐":""}</div><div style={{color:t.mu,fontSize:10}}>{cr.eng}</div></div>
                  <div style={{color:t.p,fontWeight:800,fontSize:14}}>৳{cr.price}</div>
                </div>
              ))}
              <button onClick={()=>window.open("tel:01643928687")} style={{width:"100%",padding:"10px",borderRadius:8,background:t.p,color:t.bg,border:"none",fontWeight:700,fontSize:12,cursor:"pointer",marginTop:4,transition:"all .22s",boxShadow:`0 0 12px rgba(${t.gr},.32)`}}
                onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow=`0 0 22px rgba(${t.gr},.5)`;}} onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=`0 0 12px rgba(${t.gr},.32)`;}}
              >{c.enroll} →</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:`linear-gradient(transparent,${t.bg})`,pointerEvents:"none"}} />
    </section>
  );
}

function StatsBar({ t, c }) {
  const [ref, inView] = useInView(.3);
  const v = [useCounter(500,inView),useCounter(8,inView),useCounter(3,inView),useCounter(100,inView)];
  return (
    <section ref={ref} style={{background:t.bg2,padding:"56px 5%",borderTop:`1px solid rgba(${t.gr},.09)`,borderBottom:`1px solid rgba(${t.gr},.09)`}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:24}} className="sm-g2">
        {c.stats.map(([val,label],i) => (
          <div key={i} className={`sr d${i+1}`} style={{textAlign:"center"}}>
            <div style={{fontWeight:900,fontSize:"clamp(32px,4.5vw,50px)",lineHeight:1,color:t.p,animation:inView?`countIn .5s ease ${i*.08}s both`:"none"}}>{v[i]}{val.replace(/[0-9০-৯৳,]/g,"")}</div>
            <div style={{height:2,background:`rgba(${t.gr},.12)`,borderRadius:1,margin:"7px auto 7px",width:50,overflow:"hidden"}}>
              <div style={{height:"100%",background:t.p,width:inView?"100%":"0%",transition:`width 1.8s ease ${i*.15}s`}} />
            </div>
            <div style={{color:t.mu,fontSize:12,fontWeight:500}}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Courses({ t, c }) {
  return (
    <section id="courses" style={{padding:"88px 5%",background:t.bg}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="sr sm-center" style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-block",background:`rgba(${t.gr},.07)`,border:`1px solid rgba(${t.gr},.18)`,borderRadius:50,padding:"3px 14px",fontSize:10,fontWeight:700,color:t.p,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>{c.cTitle}</div>
          <h2 style={{fontWeight:900,fontSize:"clamp(24px,3.5vw,38px)",color:t.tx,marginBottom:10}}>{c.cTitle}</h2>
          <p style={{color:t.mu,fontSize:14,maxWidth:460,margin:"0 auto"}}>{c.cSub}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:22}} className="sm-g1">
          {c.courses.map((cr,i) => (
            <div key={i} className={`card sr d${i+1}`} style={{background:t.card,border:`1px solid rgba(${t.gr},.${i===1?"22":"1"})`,borderRadius:16,overflow:"hidden",boxShadow:i===1?`0 0 28px rgba(${t.gr},.1)`:"none",position:"relative"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 14px 44px rgba(${t.gr},.16)`} onMouseLeave={e=>e.currentTarget.style.boxShadow=i===1?`0 0 28px rgba(${t.gr},.1)`:"none"}
            >
              {i===1 && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:t.p}} />}
              {cr.tag && <div style={{position:"absolute",top:14,right:14,background:t.p,color:t.bg,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:50}}>{cr.tag}</div>}
              <div style={{padding:"20px 20px 0"}}>
                <div style={{fontSize:30,marginBottom:6}}>{cr.icon}</div>
                <div style={{color:t.p,fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>{cr.eng}</div>
                <h3 style={{fontWeight:800,fontSize:18,color:t.tx,marginBottom:14}}>{cr.title}</h3>
              </div>
              <div style={{padding:"0 20px 20px"}}>
                <div style={{borderTop:`1px solid rgba(${t.gr},.08)`,paddingTop:14,marginBottom:14}}>
                  {cr.topics.map(tp => (
                    <div key={tp} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,border:`1px solid rgba(${t.gr},.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:t.p,fontWeight:700}}>✓</div>
                      <span style={{color:t.tx+"99",fontSize:12}}>{tp}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:15}}>
                  <span style={{fontSize:11,color:t.mu}}>মাত্র</span>
                  <span style={{fontWeight:900,fontSize:24,color:t.p}}>৳{cr.price}</span>
                </div>
                <button onClick={()=>window.open("tel:01643928687")} style={{width:"100%",padding:"10px",borderRadius:8,background:i===1?t.p:`rgba(${t.gr},.09)`,color:i===1?t.bg:t.p,border:`1px solid rgba(${t.gr},.2)`,fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .22s"}}
                  onMouseEnter={e=>{e.target.style.background=t.p;e.target.style.color=t.bg;e.target.style.boxShadow=`0 0 16px rgba(${t.gr},.38)`;}} onMouseLeave={e=>{e.target.style.background=i===1?t.p:`rgba(${t.gr},.09)`;e.target.style.color=i===1?t.bg:t.p;e.target.style.boxShadow="none";}}
                >{c.cBtn}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ t, c }) {
  return (
    <section id="why-us" style={{padding:"88px 5%",background:t.bg2,borderTop:`1px solid rgba(${t.gr},.08)`}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="sr sm-center" style={{textAlign:"center",marginBottom:44}}>
          <h2 style={{fontWeight:900,fontSize:"clamp(24px,3.5vw,38px)",color:t.tx}}>{c.wTitle}</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}} className="sm-g1">
          {c.features.map((f,i) => (
            <div key={i} className={`card sr d${i+1}`} style={{background:t.card,border:`1px solid rgba(${t.gr},.1)`,borderRadius:13,padding:"18px",display:"flex",gap:14,alignItems:"flex-start",transition:"border-color .25s,box-shadow .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.28)`;e.currentTarget.style.boxShadow=`0 8px 30px rgba(${t.gr},.1)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.1)`;e.currentTarget.style.boxShadow="none";}}
            >
              <div style={{width:40,height:40,borderRadius:9,flexShrink:0,background:`rgba(${t.gr},.09)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{f.icon}</div>
              <div><div style={{fontWeight:700,fontSize:14,color:t.tx,marginBottom:4}}>{f.t}</div><div style={{color:t.mu,fontSize:12,lineHeight:1.65}}>{f.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ t, c }) {
  return (
    <section style={{padding:"88px 5%",background:t.bg,borderTop:`1px solid rgba(${t.gr},.07)`}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="sr sm-center" style={{textAlign:"center",marginBottom:52}}>
          <h2 style={{fontWeight:900,fontSize:"clamp(24px,3.5vw,38px)",color:t.tx}}>{c.sTitle}</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:28,position:"relative"}} className="sm-g1">
          <div className="hide-sm" style={{position:"absolute",top:33,left:"16%",right:"16%",height:1,background:`linear-gradient(90deg,rgba(${t.gr},.06),rgba(${t.gr},.22),rgba(${t.gr},.06))`,zIndex:0}} />
          {c.steps.map((s,i) => (
            <div key={i} className={`sr d${i+1}`} style={{textAlign:"center",position:"relative",zIndex:1}}>
              <div style={{width:66,height:66,borderRadius:"50%",background:t.card,border:`2px solid rgba(${t.gr},.18)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 16px",transition:"border-color .25s,box-shadow .25s",position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.p;e.currentTarget.style.boxShadow=`0 0 20px rgba(${t.gr},.22)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.18)`;e.currentTarget.style.boxShadow="none";}}
              >
                {["📞","📋","🎓"][i]}
                <div style={{position:"absolute",top:-5,right:-5,width:22,height:22,borderRadius:"50%",background:t.p,color:t.bg,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
              </div>
              <h3 style={{fontWeight:700,fontSize:16,color:t.tx,marginBottom:8}}>{s}</h3>
              <p style={{color:t.mu,fontSize:13,lineHeight:1.72,maxWidth:200,margin:"0 auto"}}>{c.stepD[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ t, c }) {
  const doubled = [...c.tests,...c.tests];
  return (
    <section style={{padding:"88px 0",background:t.bg2,borderTop:`1px solid rgba(${t.gr},.08)`,overflow:"hidden",position:"relative"}}>
      <div className="sr" style={{textAlign:"center",padding:"0 5%",marginBottom:44}}>
        <h2 style={{fontWeight:900,fontSize:"clamp(24px,3.5vw,38px)",color:t.tx}}>{c.tTitle}</h2>
      </div>
      <div style={{display:"flex",gap:18,width:"max-content",animation:"marquee 32s linear infinite"}}
        onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"} onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
        {doubled.map((item,i) => (
          <div key={i} className="card" style={{width:300,flexShrink:0,background:t.card,border:`1px solid rgba(${t.gr},.1)`,borderRadius:14,padding:"20px",transition:"border-color .25s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.28)`;e.currentTarget.style.boxShadow=`0 10px 30px rgba(${t.gr},.1)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.1)`;e.currentTarget.style.boxShadow="none";}}
          >
            <div style={{display:"flex",marginBottom:10}}>{"★★★★★".split("").map((s,j)=><span key={j} style={{color:"#F59E0B",fontSize:13}}>{s}</span>)}</div>
            <p style={{color:t.tx+"80",lineHeight:1.8,fontSize:13,marginBottom:18,fontStyle:"italic"}}>"{item.q}"</p>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`rgba(${t.gr},.15)`,display:"flex",alignItems:"center",justifyContent:"center",color:t.p,fontWeight:800,fontSize:14,flexShrink:0}}>{item.n[0]}</div>
              <div><div style={{fontWeight:700,fontSize:13,color:t.tx}}>{item.n}</div><div style={{fontSize:10,color:t.mu}}>{item.r}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{position:"absolute",top:0,left:0,bottom:0,width:100,background:`linear-gradient(to right,${t.bg2},transparent)`,pointerEvents:"none"}} />
      <div style={{position:"absolute",top:0,right:0,bottom:0,width:100,background:`linear-gradient(to left,${t.bg2},transparent)`,pointerEvents:"none"}} />
    </section>
  );
}

function CTA({ t, c }) {
  return (
    <section id="contact" style={{padding:"0 5% 88px"}}>
      <div className="sr" style={{borderRadius:20,overflow:"hidden",position:"relative",background:t.card,padding:"64px 8%",border:`1px solid rgba(${t.gr},.16)`,boxShadow:`0 0 70px rgba(${t.gr},.05)`}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 1.5px 1.5px,rgba(${t.gr},.05) 1px,transparent 0)`,backgroundSize:"30px 30px",pointerEvents:"none"}} />
        <div style={{position:"absolute",right:"5%",top:"50%",transform:"translateY(-50%)",fontWeight:900,fontSize:160,color:`rgba(${t.gr},.04)`,lineHeight:1,pointerEvents:"none",userSelect:"none"}}>৬০%</div>
        <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:32}}>
          <div style={{maxWidth:480}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`rgba(${t.gr},.09)`,border:`1px solid rgba(${t.gr},.22)`,borderRadius:50,padding:"4px 13px",marginBottom:16}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:t.p,display:"inline-block",animation:"pulseRing 2s ease infinite"}} />
              <span style={{color:t.p,fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>সীমিত সময়ের অফার</span>
            </div>
            <h2 style={{fontWeight:900,fontSize:"clamp(24px,3.5vw,42px)",lineHeight:1.1,marginBottom:12}}>
              <span style={{color:t.p}}>{c.ctaL1}</span><br/><span style={{color:t.tx}}>{c.ctaL2}</span>
            </h2>
            <p style={{color:t.mu,fontSize:14,lineHeight:1.8}}>{c.ctaDesc}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <button onClick={()=>window.open("tel:01643928687")} style={{background:t.p,color:t.bg,border:"none",padding:"15px 36px",borderRadius:10,fontWeight:700,fontSize:15,cursor:"pointer",transition:"all .25s",boxShadow:`0 0 20px rgba(${t.gr},.38)`}}
              onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 0 38px rgba(${t.gr},.55)`;}} onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=`0 0 20px rgba(${t.gr},.38)`;}}
            >{c.ctaBtn}</button>
            <button onClick={()=>window.open("tel:01643928687")} style={{background:"transparent",color:t.mu,border:`1px solid rgba(${t.gr},.2)`,padding:"12px 32px",borderRadius:10,fontWeight:600,fontSize:14,cursor:"pointer",transition:"all .22s"}}
              onMouseEnter={e=>{e.target.style.borderColor=t.p;e.target.style.color=t.p;}} onMouseLeave={e=>{e.target.style.borderColor=`rgba(${t.gr},.2)`;e.target.style.color=t.mu;}}
            >📞 {c.ctaCall}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t, c }) {
  return (
    <footer style={{background:t.bg2,borderTop:`1px solid rgba(${t.gr},.08)`}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"52px 5% 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:36}} className="sm-g1 sm-col">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:38,height:38,borderRadius:9,background:t.p,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:t.bg,boxShadow:`0 0 12px rgba(${t.gr},.38)`,flexShrink:0}}>দৃ</div>
              <div><div style={{fontWeight:700,fontSize:13,color:t.tx}}>Dristy Computer Training Center</div><div style={{fontSize:10,color:t.mu}}>Gopalpur, Tangail, Bangladesh</div></div>
            </div>
            <p style={{color:t.mu,fontSize:12,lineHeight:1.85,maxWidth:270,marginBottom:16}}>{c.fDesc}</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["📘","Facebook","https://www.facebook.com/share/1E2jAYRKhz/"],["📞","01643-928687","tel:01643928687"]].map(([ic,l,hr])=>(
                <a key={l} href={hr} style={{background:`rgba(${t.gr},.07)`,border:`1px solid rgba(${t.gr},.14)`,borderRadius:7,padding:"6px 11px",color:t.mu,fontSize:11,textDecoration:"none",transition:"all .2s",display:"flex",alignItems:"center",gap:5}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${t.gr},.14)`;e.currentTarget.style.color=t.p;e.currentTarget.style.borderColor=`rgba(${t.gr},.28)`;}} onMouseLeave={e=>{e.currentTarget.style.background=`rgba(${t.gr},.07)`;e.currentTarget.style.color=t.mu;e.currentTarget.style.borderColor=`rgba(${t.gr},.14)`;}}
                >{ic} {l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:12,marginBottom:14,color:t.tx}}>কোর্সসমূহ</div>
            {c.fLinks.map(l=><div key={l} style={{color:t.mu,fontSize:12,marginBottom:8,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=t.p} onMouseLeave={e=>e.target.style.color=t.mu}>{l}</div>)}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:12,marginBottom:14,color:t.tx}}>যোগাযোগ</div>
            {c.fContact.map(item=><div key={item} style={{color:t.mu,fontSize:12,marginBottom:9,lineHeight:1.6}}>{item}</div>)}
          </div>
        </div>
        <div style={{borderTop:`1px solid rgba(${t.gr},.08)`,paddingTop:16,display:"flex",flexDirection:"column",gap:6,alignItems:"center",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-between",width:"100%",flexWrap:"wrap",gap:8}}>
            <span style={{color:t.mu+"88",fontSize:11}}>{c.copy}</span>
            <span style={{color:t.mu+"55",fontSize:10}}>{c.approved}</span>
          </div>
          <div style={{color:t.mu+"99",fontSize:11}}>
            {c.devBy}{" "}
            <a href="https://mehedy.netlify.app" target="_blank" rel="noreferrer" style={{color:t.p,fontWeight:700,textDecoration:"none",transition:"opacity .2s"}}
              onMouseEnter={e=>e.target.style.opacity=".7"} onMouseLeave={e=>e.target.style.opacity="1"}
            >{c.devName}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── THEME SWITCHER floating panel ───────────────────────────────────
function ThemeSwitcher({ themeKey, t, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, useCallback(() => setOpen(false), []));
  return (
    <div ref={ref} style={{position:"fixed",bottom:28,left:24,zIndex:999}}>
      {open && (
        <div style={{position:"absolute",bottom:58,left:0,background:`${t.bg2}F5`,backdropFilter:"blur(20px)",border:`1px solid rgba(${t.gr},.18)`,borderRadius:14,padding:"14px 12px",width:240,boxShadow:"0 8px 40px rgba(0,0,0,.45)",animation:"fadeIn .2s ease"}}>
          <div style={{fontSize:9,color:t.mu,letterSpacing:".1em",textTransform:"uppercase",marginBottom:9,paddingLeft:3,fontWeight:700}}>ALL THEMES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {Object.entries(THEMES).map(([key,th],i)=>(
              <button key={key} onClick={()=>{onSwitch(key);setOpen(false);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"9px 5px",background:themeKey===key?`rgba(${th.gr},.15)`:`rgba(${t.gr},.05)`,border:`1px solid ${themeKey===key?`rgba(${th.gr},.38)`:`rgba(${t.gr},.1)`}`,borderRadius:9,cursor:"pointer",transition:"all .16s",position:"relative"}}
                onMouseEnter={e=>{if(themeKey!==key)e.currentTarget.style.background=`rgba(${t.gr},.1)`;}} onMouseLeave={e=>{if(themeKey!==key)e.currentTarget.style.background=`rgba(${t.gr},.05)`;}}
              >
                <div style={{position:"absolute",top:4,right:4,width:5,height:5,borderRadius:"50%",background:th.dark?"#818CF8":"#F59E0B",opacity:.75}} />
                <div style={{display:"flex",gap:2}}><div style={{width:9,height:9,borderRadius:"50%",background:th.p}}/><div style={{width:9,height:9,borderRadius:"50%",background:th.a}}/></div>
                <span style={{color:themeKey===key?th.p:t.mu,fontSize:8,fontWeight:themeKey===key?700:400,textAlign:"center",lineHeight:1.3}}>{th.emoji}<br/>{i+1}.{th.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <div style={{marginTop:9,paddingTop:8,borderTop:`1px solid rgba(${t.gr},.1)`,display:"flex",gap:12,justifyContent:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:8,color:t.mu}}><div style={{width:6,height:6,borderRadius:"50%",background:"#818CF8"}} />Dark</div>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:8,color:t.mu}}><div style={{width:6,height:6,borderRadius:"50%",background:"#F59E0B"}} />Light</div>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{width:44,height:44,borderRadius:12,background:t.card,border:`1px solid rgba(${t.gr},.22)`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 18px rgba(0,0,0,.35)",transition:"all .22s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=t.p;e.currentTarget.style.boxShadow=`0 4px 24px rgba(${t.gr},.3)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`rgba(${t.gr},.22)`;e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,.35)";}}
      >🎨</button>
    </div>
  );
}

function FloatingWA() {
  const [show, setShow] = useState(false);
  useEffect(() => { const to=setTimeout(()=>setShow(true),1800); return()=>clearTimeout(to); }, []);
  return (
    <a href="https://wa.me/8801643928687" target="_blank" rel="noreferrer" style={{position:"fixed",bottom:28,right:24,zIndex:1000,opacity:show?1:0,transform:show?"scale(1)":"scale(.3)",transition:"all .55s cubic-bezier(.16,1,.3,1)",textDecoration:"none"}}>
      <div style={{position:"absolute",inset:-6,borderRadius:"50%",background:"rgba(37,211,102,.2)",animation:"pulseRing 2.2s ease infinite"}} />
      <div style={{width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 0 22px rgba(37,211,102,.52)",transition:"transform .25s",position:"relative"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      ><WAIcon size={24}/></div>
    </a>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState("slate");
  const [lang, setLang] = useState("bn");
  const [cursorEffect, setCursorEffect] = useState("off");
  const cycleCursor = useCallback(() => {
    setCursorEffect(e => { const i=CURSOR_EFFECTS.indexOf(e); return CURSOR_EFFECTS[(i+1)%CURSOR_EFFECTS.length]; });
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const t = THEMES[themeKey];
  const c = L[lang];

  const switchTheme = useCallback((key) => {
    setFlashTrigger(n => n + 1);
    setThemeKey(key);
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = THEME_KEYS.indexOf(themeKey);
    switchTheme(THEME_KEYS[(idx + 1) % THEME_KEYS.length]);
  }, [themeKey, switchTheme]);

  useScrollReveal();

  return (
    <>
      <style>{CSS + themeVars(t)}</style>
      <CursorSystem effect={cursorEffect} rgb={t.gr} />
      <ThemeFlash trigger={flashTrigger} />
      <ScrollProgressBar t={t} />
      <Navbar t={t} c={c} lang={lang} setLang={setLang} themeKey={themeKey} cursorEffect={cursorEffect} cycleCursor={cycleCursor} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onCycleTheme={cycleTheme} />
      <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)} t={t} c={c} lang={lang} setLang={setLang} themeKey={themeKey} setThemeKey={setThemeKey} cursorEffect={cursorEffect} setCursorEffect={setCursorEffect} onThemeSwitch={switchTheme} />
      <Hero key={`${themeKey}-${lang}`} t={t} c={c} />
      <StatsBar t={t} c={c} />
      <Courses t={t} c={c} />
      <Features t={t} c={c} />
      <Steps t={t} c={c} />
      <Testimonials t={t} c={c} />
      <CTA t={t} c={c} />
      <Footer t={t} c={c} />
      <ThemeSwitcher themeKey={themeKey} t={t} onSwitch={switchTheme} />
      <FloatingWA />
    </>
  );
}
