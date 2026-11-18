import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Globe, Menu, X, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import NotificationBell from "./NotificationBell";

// nav_key maps to i18n translation keys defined in all locale files
const NAV_LINKS = [
  { to: "/",        key: "nav_home" },
  { to: "/search",  key: "nav_search" },
  { to: "/assess",  key: "nav_assess" },
  { to: "/compare", key: "nav_compare" },
  { to: "/impact",  key: "nav_impact" },
];

// Removed "bn" — no locale file or SPEECH_LOCALES entry exists for Bengali
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
];

export default function Navbar({ theme, toggleTheme, user, onAuthClick, onLogout }) {
  const { t, i18n } = useTranslation();
  const location  = useLocation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [langOpen, setLangOpen]   = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  function changeLanguage(code) {
    i18n.changeLanguage(code);
    setLangOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <nav className="glass w-full border-b" style={{ borderColor: "var(--border)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Brand ───────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md transition-transform duration-300 group-hover:scale-105"
                   style={{ background: "var(--accent-grad)", boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}>
                🏛️
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display" style={{ color: "var(--text-primary)" }}>
                Gov<span className="gradient-text">Match</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded font-mono font-semibold" 
                      style={{ background: "var(--accent-grad-subtle)", color: "var(--accent)", border: "1px solid rgba(217,119,6,0.25)" }}>
                  AI
                </span>
              </span>
            </Link>

            {/* ── Desktop nav links ────────────────────── */}
            <div className="hidden md:flex items-center gap-1.5 flex-1 justify-center">
              {NAV_LINKS.map(({ to, key }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to}
                    className="relative px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                    style={{
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      background: active ? "var(--accent-grad-subtle)" : "transparent",
                      border: active ? "1px solid rgba(217,119,6,0.3)" : "1px solid transparent",
                    }}>
                    {t(key)}
                  </Link>
                );
              })}
            </div>

            {/* ── Right controls ───────────────────────── */}
            <div className="flex items-center gap-2.5 shrink-0">

              {/* Language selector */}
              <div className="relative hidden sm:block" ref={langRef}>
                <button onClick={() => setLangOpen(v => !v)}
                  className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-1.5 rounded-full">
                  <Globe size={13} className="text-indigo-500" />
                  <span className="font-medium">{currentLang.label}</span>
                  <ChevronDown size={12} style={{ transform: langOpen ? "rotate(180deg)" : "", transition: "transform 0.2s" }} />
                </button>
                {langOpen && (
                  <div className="glass-card absolute right-0 mt-2 w-36 py-1.5 z-50"
                       style={{
                         borderRadius: "var(--radius-sm)",
                         boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                       }}>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => changeLanguage(l.code)}
                      className="w-full text-left px-3 py-1.5 text-sm transition-colors"
                      style={{
                        color: i18n.language === l.code ? "var(--accent)" : "var(--text-secondary)",
                        fontWeight: i18n.language === l.code ? 600 : 400,
                        background: "transparent",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-lg"
                    aria-label="Toggle theme" style={{ border: "1px solid var(--border)" }}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification bell */}
            <NotificationBell />

            {/* Auth */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-2 btn-ghost px-2 py-1 rounded-lg">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                       style={{ background: "var(--accent-grad)" }}>
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {user.name || user.email}
                  </span>
                  <ChevronDown size={12} style={{ transform: userOpen ? "rotate(180deg)" : "", transition: "transform 0.2s", color: "var(--text-muted)" }} />
                </button>
                {userOpen && (
                  <div className="glass-card absolute right-0 mt-2 w-48 py-1.5 z-50"
                       style={{
                         borderRadius: "var(--radius-sm)",
                         boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
                       }}>
                    <Link to="/profile" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <User size={15} className="text-indigo-500" /> My Profile
                    </Link>
                    <Link to="/saved" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <span>🔖</span> Saved Schemes
                    </Link>
                    <hr style={{ borderColor: "var(--border)", margin: "4px 0" }} />
                    <button onClick={() => { setUserOpen(false); onLogout && onLogout(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                      style={{ color: "var(--danger)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onAuthClick} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-1.5">
                <LogIn size={14} />
                <span className="hidden sm:inline">{t("login")}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden btn-ghost p-2">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden pb-3 pt-1 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, key }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  color: location.pathname === to ? "var(--accent)" : "var(--text-secondary)",
                  background: location.pathname === to ? "rgba(99,102,241,0.1)" : "transparent"
                }}>
                {t(key)}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => changeLanguage(l.code)}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: i18n.language === l.code ? "var(--accent)" : "var(--bg-secondary)",
                    color: i18n.language === l.code ? "#fff" : "var(--text-secondary)"
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  </header>
);
}
