import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, PlusSquare, CheckSquare, ExternalLink, Building2, MapPin, Check, Sparkles } from "lucide-react";

const CATEGORY_CLASS = {
  "Education & Learning":              "badge-education",
  "Agriculture, Rural & Environment":  "badge-agriculture",
  "Health & Wellness":                 "badge-health",
  "Business & Entrepreneurship":       "badge-business",
  "Skills & Employment":               "badge-skills",
  "Women Empowerment":                 "badge-women",
  "Social Welfare":                    "badge-welfare",
};

// Circular progress ring for match score with gradient fill
function MatchRing({ score = 0 }) {
  const pct    = Math.round(score * 100);
  const radius = 21;
  const circ   = 2 * Math.PI * radius;
  const dash   = circ * (pct / 100);
  const color  = pct >= 70 ? "#10b981" : pct >= 45 ? "#f59e0b" : "#6366f1";
  const gradId = `grad-${pct}-${Math.random().toString(36).substring(2, 6)}`;

  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0 select-none">
      <svg width="54" height="54" viewBox="0 0 54 54" className="drop-shadow-sm">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={pct >= 70 ? "#059669" : pct >= 45 ? "#d97706" : "#8b5cf6"} />
          </linearGradient>
        </defs>
        <circle cx="27" cy="27" r={radius} fill="none" stroke="var(--border)" strokeWidth="3.5" />
        <circle cx="27" cy="27" r={radius} fill="none" stroke={`url(#${gradId})`} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        <text x="27" y="31.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={color} fontFamily="'Plus Jakarta Sans', sans-serif">
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
        Match
      </span>
    </div>
  );
}

export default function SchemeCard({ scheme = {}, score = 0, explanation = {}, onCompare, isComparing, onViewDetails, listMode = false }) {
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      return Array.isArray(saved) && saved.includes(scheme.slug);
    } catch {
      return false;
    }
  });

  function toggleBookmark(e) {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const list = Array.isArray(saved) ? saved : [];
      const updated = bookmarked
        ? list.filter(s => s !== scheme.slug)
        : [...list, scheme.slug];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setBookmarked(!bookmarked);
    } catch {}
  }

  const catClass   = CATEGORY_CLASS[scheme.category] || "badge-welfare";
  const levelClass = scheme.level?.toLowerCase() === "central" ? "badge-central" : "badge-state";
  const confidence = explanation?.confidence || "";
  const benefits   = (scheme.benefits || scheme.brief_description || "").split(";")[0]?.trim();
  const whyList    = explanation?.whyRecommended || [];

  if (listMode) {
    return (
      <motion.div
        className="glass-card flex flex-row items-center gap-4 p-4 hover:shadow-lg transition-all duration-200"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}>

        {/* Left: name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge ${catClass}`}>{scheme.category}</span>
            <span className={`badge ${levelClass}`}>{scheme.level || "Central"}</span>
            {scheme.state && scheme.state !== "Central" && (
              <span className="badge" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                <MapPin size={9} /> {scheme.state}
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm leading-snug font-display"
              style={{ color: "var(--text-primary)" }} title={scheme.name}>
            {scheme.name}
          </h3>
          {benefits && (
            <p className="text-xs mt-1 line-clamp-1" style={{ color: "var(--text-muted)" }}>{benefits}</p>
          )}
        </div>

        {/* Right: score + actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {score > 0 && <MatchRing score={score} />}
          <button onClick={toggleBookmark} className="p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: bookmarked ? "var(--accent)" : "var(--text-muted)" }}
                  title={bookmarked ? "Remove bookmark" : "Save scheme"}>
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          {onCompare && (
            <button onClick={() => onCompare(scheme)} className="p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    style={{ color: isComparing ? "var(--accent)" : "var(--text-muted)" }}
                    title={isComparing ? "Remove from compare" : "Add to compare"}>
              {isComparing ? <CheckSquare size={16} /> : <PlusSquare size={16} />}
            </button>
          )}
          <button onClick={() => onViewDetails?.(scheme)}
                  className="btn-primary flex items-center gap-1.5 text-xs px-3.5 py-2">
            View Details <ExternalLink size={12} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card flex flex-col gap-3.5 p-5 relative overflow-hidden group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}>

      {/* Top subtle glow line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-snug font-display line-clamp-2"
              style={{ color: "var(--text-primary)" }} title={scheme.name}>
            {scheme.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Building2 size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span className="text-xs truncate font-medium" style={{ color: "var(--text-muted)", maxWidth: "210px" }}>
              {scheme.ministry || scheme.department || "Central/State Scheme"}
            </span>
          </div>
        </div>
        {score > 0 && <MatchRing score={score} />}
      </div>

      {/* ── Badges ── */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`badge ${catClass}`}>{scheme.category}</span>
        <span className={`badge ${levelClass}`}>{scheme.level || "Central"}</span>
        {scheme.state && scheme.state !== "Central" && (
          <span className="badge" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
            <MapPin size={9} /> {scheme.state}
          </span>
        )}
      </div>

      {/* ── Key benefit ── */}
      {benefits && (
        <p className="text-xs leading-relaxed line-clamp-2 font-normal" style={{ color: "var(--text-secondary)" }}>
          {benefits}
        </p>
      )}

      {/* ── Why recommended pill (top reason) ── */}
      {whyList.length > 0 && (
        <div className="flex items-start gap-1.5 text-xs rounded-xl px-2.5 py-1.5 font-medium border"
             style={{
               background: "var(--accent-grad-subtle)",
               borderColor: "rgba(99,102,241,0.2)",
               color: "var(--accent)"
             }}>
          <Sparkles size={13} className="shrink-0 mt-0.5 text-indigo-500" />
          <span className="line-clamp-1">{whyList[0]}</span>
        </div>
      )}

      {/* ── Confidence badge ── */}
      {confidence && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  background: confidence === "High Match" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  borderColor: confidence === "High Match" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)",
                  color: confidence === "High Match" ? "var(--success)" : "var(--warning)"
                }}>
            {confidence}
          </span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={toggleBookmark} className="p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ color: bookmarked ? "var(--accent)" : "var(--text-muted)" }}
                title={bookmarked ? "Remove bookmark" : "Save scheme"}
                aria-label="Bookmark">
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>

        {onCompare && (
          <button onClick={() => onCompare(scheme)}
                  className="p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: isComparing ? "var(--accent)" : "var(--text-muted)" }}
                  title={isComparing ? "Remove from compare" : "Add to compare"}
                  aria-label="Compare">
            {isComparing ? <CheckSquare size={16} /> : <PlusSquare size={16} />}
          </button>
        )}

        <div className="flex-1" />

        <button onClick={() => onViewDetails?.(scheme)}
                className="btn-primary flex items-center gap-1.5 text-xs px-3.5 py-2">
          View Details
          <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  );
}
