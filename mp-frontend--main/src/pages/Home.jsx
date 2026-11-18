import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, ArrowRight, Users, TrendingUp, IndianRupee,
  Sprout, GraduationCap, Heart, Briefcase, Zap, Baby,
  Sparkles, CheckCircle2, ShieldCheck, ChevronRight,
  FileText, UserCheck, Languages
} from "lucide-react";
import { useTranslation } from "react-i18next";

// ── Animated Counter ────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{val.toLocaleString("en-IN")}{suffix}</span>;
}

const CATEGORIES = [
  { icon: <Sprout size={24} />,        label: "Agriculture",  color: "#16a34a", bg: "rgba(22, 163, 74, 0.12)", path: "/search?category=Agriculture%2C+Rural+%26+Environment" },
  { icon: <GraduationCap size={24} />, label: "Education",    color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)", path: "/search?category=Education+%26+Learning" },
  { icon: <Baby size={24} />,          label: "Women",        color: "#db2777", bg: "rgba(219, 39, 119, 0.12)", path: "/search?category=Women+Empowerment" },
  { icon: <Heart size={24} />,         label: "Health",       color: "#e11d48", bg: "rgba(225, 29, 72, 0.12)", path: "/search?category=Health+%26+Wellness" },
  { icon: <Briefcase size={24} />,     label: "Business",     color: "#d97706", bg: "rgba(217, 119, 6, 0.12)", path: "/search?category=Business+%26+Entrepreneurship" },
  { icon: <Zap size={24} />,           label: "Employment",   color: "#7c3aed", bg: "rgba(124, 58, 237, 0.12)", path: "/search?category=Skills+%26+Employment" },
];

const POPULAR_SEARCHES = [
  { label: "🌾 PM-KISAN", query: "PM-KISAN" },
  { label: "🎓 NSP Scholarship", query: "National Scholarship" },
  { label: "🏠 PM Awas", query: "PM Awas Yojana" },
  { label: "👩 Sukanya Samriddhi", query: "Sukanya Samriddhi" },
  { label: "💼 MUDRA Loan", query: "MUDRA" },
];

const HOW_STEP_KEYS = [
  { n: "01", titleKey: "step1_title", descKey: "step1_desc", icon: "📝" },
  { n: "02", titleKey: "step2_title", descKey: "step2_desc", icon: "🧠" },
  { n: "03", titleKey: "step3_title", descKey: "step3_desc", icon: "🎯" },
  { n: "04", titleKey: "step4_title", descKey: "step4_desc", icon: "📄" },
];

const TESTIMONIALS = [
  { name: "Ramesh K.", state: "Karnataka", quote: "Found PM-KISAN and PMFBY in under 2 minutes. Got ₹6,000 credited to my bank account with direct steps!", role: "Farmer" },
  { name: "Priya S.",  state: "Tamil Nadu", quote: "The AI eligibility checker told me exactly which documents I needed. Applied for Sukanya Samriddhi smoothly.", role: "Teacher & Mother" },
  { name: "Arjun M.", state: "Maharashtra", quote: "Discovered the MUDRA scheme via the smart search. My small tailoring venture is now fully funded!", role: "Entrepreneur" },
];

const HERO_FEATURES = [
  { icon: <FileText size={20} />,   title: "4,400+ Schemes",                desc: "Central & State Government" },
  { icon: <UserCheck size={20} />,  title: "Personalized Recommendations",  desc: "Based on your profile" },
  { icon: <Zap size={20} />,        title: "Fast Eligibility Check",        desc: "Results in under 2 minutes" },
  { icon: <Languages size={20} />,  title: "Multi-language Support",        desc: "Access in your preferred language" },
];

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/search");
    }
  }

  return (
    <div className="flex flex-col gap-16 page-enter pb-8">

      {/* ── Hero Section — Light Patriotic Design ─────────── */}
      <section className="hero-section relative rounded-3xl overflow-hidden border"
               style={{
                 borderColor: "rgba(200, 190, 170, 0.3)",
                 boxShadow: "0 20px 50px -12px rgba(140, 110, 70, 0.15)",
               }}>

        {/* Background Image */}
        <div className="hero-bg-image" />

        {/* Light overlay for text readability */}
        <div className="hero-overlay" />

        {/* Content */}
        <motion.div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-14 pb-4"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>

          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border"
               style={{
                 background: "rgba(255, 255, 255, 0.75)",
                 backdropFilter: "blur(8px)",
                 color: "#1e3a5f",
                 borderColor: "rgba(30, 58, 95, 0.15)",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
               }}>
            <span>🇮🇳</span>
            <span>Smart Citizen Welfare Intelligence • 4,430+ Live Schemes</span>
          </div>

          {/* Heading */}
          <h1 className="font-display leading-tight mb-5 tracking-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "#1e3a5f",
              }}>
            Find Every Scheme<br />
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #1e40af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              You Deserve
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto font-normal"
             style={{ color: "#475569" }}>
            {t("hero_sub")}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-4">
            <div className="flex gap-2 p-1.5 rounded-2xl border transition-all duration-300 focus-within:ring-2"
                 style={{
                   background: "#ffffff",
                   borderColor: "rgba(200, 200, 210, 0.5)",
                   boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                   focusWithinRing: "rgba(30, 58, 95, 0.3)"
                 }}>
              <div className="flex-1 relative flex items-center">
                <Search size={18} className="absolute left-3.5" style={{ color: "#94a3b8" }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t("hero_search_placeholder") || "Search schemes e.g. farmer loan, girl scholarship, PM Awas…"}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm font-medium outline-none bg-transparent"
                  style={{ color: "#0f172a" }}
                />
              </div>
              <button
                type="submit"
                onClick={handleSearch}
                id="hero-search-btn"
                className="px-6 py-3 rounded-xl whitespace-nowrap text-sm font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: "#1e3a5f",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(30, 58, 95, 0.3)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#162d4a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1e3a5f"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Trending chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-8">
            <span className="font-medium mr-1" style={{ color: "#64748b" }}>Trending:</span>
            {POPULAR_SEARCHES.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  color: "#334155",
                  border: "1px solid rgba(200, 200, 210, 0.5)",
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1e3a5f"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#1e3a5f"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#334155"; e.currentTarget.style.borderColor = "rgba(200, 200, 210, 0.5)"; }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3.5 justify-center mb-10">
            <button onClick={() => navigate("/assess")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg"
              style={{
                background: "#1e3a5f",
                color: "#ffffff",
                boxShadow: "0 6px 20px rgba(30, 58, 95, 0.35)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(30, 58, 95, 0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 58, 95, 0.35)"; }}>
              <Sparkles size={16} />
              {t("hero_cta1")} <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/search")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                color: "#1e3a5f",
                borderColor: "#1e3a5f",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#1e3a5f"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.75)"; e.currentTarget.style.color = "#1e3a5f"; }}>
              {t("hero_cta2")}
            </button>
          </div>
        </motion.div>

        {/* ── Feature Strip at bottom of hero ─────────── */}
        <div className="hero-feature-strip relative z-10">
          {HERO_FEATURES.map((feat, i) => (
            <div key={i} className="hero-feature-item">
              <div className="hero-feature-icon">
                {feat.icon}
              </div>
              <div>
                <p className="hero-feature-title">{feat.title}</p>
                <p className="hero-feature-desc">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modern Key Impact Stats ──────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: <TrendingUp size={24} />, label: t("stats_total_schemes"),     value: 4430,      suffix: "+", desc: "Central & State verified" },
          { icon: <Users size={24} />,      label: t("stats_beneficiaries"),     value: 120000000, suffix: "+", desc: "Citizens assisted across India" },
          { icon: <IndianRupee size={24}/>, label: t("stats_disbursed"),         value: 2500000,   suffix: "+ Cr", desc: "Direct Benefit Transfer reach" },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                 style={{ background: "var(--accent-grad-subtle)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-extrabold font-display tracking-tight" style={{ color: "var(--text-primary)" }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Categories Grid ──────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight" style={{ color: "var(--text-primary)" }}>
              Browse by Category
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Filter welfare opportunities curated for your specific requirements
            </p>
          </div>
          <button onClick={() => navigate("/search")} className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "var(--accent)" }}>
            View all categories <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <motion.button key={cat.label} onClick={() => navigate(cat.path)}
              className="glass-card flex flex-col items-center gap-3 p-5 cursor-pointer text-center group"
              whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                   style={{ background: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold font-display" style={{ color: "var(--text-primary)" }}>
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-2 inline-block"
                style={{ background: "var(--accent-grad-subtle)", color: "var(--accent)" }}>
            Step-by-Step Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
            {t("how_works")}
          </h2>
          <p className="text-xs sm:text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            {t("how_works_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_STEP_KEYS.map((step, i) => (
            <motion.div key={step.n} className="glass-card p-6 flex flex-col gap-3 relative group"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-display gradient-text">{step.n}</span>
                <span className="text-xl p-2 rounded-xl" style={{ background: "var(--bg-secondary)" }}>{step.icon}</span>
              </div>
              <h3 className="font-bold text-sm font-display mt-2" style={{ color: "var(--text-primary)" }}>{t(step.titleKey)}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{t(step.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Citizen Stories & Testimonials ───────────────────── */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-2 inline-block"
                style={{ background: "var(--accent-grad-subtle)", color: "var(--accent)" }}>
            Real Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
            {t("impact_title")}
          </h2>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Hear from citizens who claimed their government benefits effortlessly
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <motion.div key={t.name} className="glass-card p-6 flex flex-col gap-4 relative"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-1 text-amber-400 text-sm">
                {"★".repeat(5)}
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md"
                     style={{ background: "var(--accent-grad)" }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{t.role} · {t.state}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Modern Bottom CTA Banner ─────────────────────────── */}
      <section className="glass-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
               style={{
                 background: "linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(124,58,237,0.08) 100%)",
                 border: "1px solid rgba(99,102,241,0.25)",
                 boxShadow: "0 15px 40px -10px rgba(79, 70, 229, 0.18)"
               }}>
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 mb-2">
            <ShieldCheck size={16} /> Fast, Free & Confidential
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display mb-2" style={{ color: "var(--text-primary)" }}>
            {t("cta_ready")}
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("cta_sub")}
          </p>
        </div>
        <button onClick={() => navigate("/assess")} className="btn-primary flex items-center gap-2 px-7 py-3.5 text-sm font-bold whitespace-nowrap shadow-lg">
          <Sparkles size={16} />
          {t("cta_start")} <ArrowRight size={15} />
        </button>
      </section>
    </div>
  );
}
