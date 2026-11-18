import { ExternalLink, Phone, Mail, Globe, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const PORTAL_LINKS = [
  { label: "MyScheme Portal",           href: "https://myscheme.gov.in" },
  { label: "National Scholarship Portal", href: "https://scholarships.gov.in" },
  { label: "PM India Schemes",          href: "https://www.pmindia.gov.in" },
  { label: "India.gov.in",              href: "https://www.india.gov.in" },
];

const QUICK_LINKS = [
  { label: "Home",                 to: "/" },
  { label: "Search Schemes",       to: "/search" },
  { label: "Eligibility Check",    to: "/assess" },
  { label: "Compare Schemes",      to: "/compare" },
  { label: "Impact Dashboard",     to: "/impact" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t transition-colors" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md"
                   style={{ background: "var(--accent-grad)" }}>
                🏛️
              </div>
              <span className="font-extrabold text-base tracking-tight font-display" style={{ color: "var(--text-primary)" }}>
                Gov<span className="gradient-text">Match</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded font-mono font-semibold" 
                      style={{ background: "var(--accent-grad-subtle)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  AI
                </span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed font-normal" style={{ color: "var(--text-muted)" }}>
              AI-driven civic intelligence connecting Indian citizens with 4,430+ central and state government welfare schemes in regional languages.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 mt-1">
              <ShieldCheck size={14} /> Official Data Intelligence Verified
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 font-display"
                style={{ color: "var(--text-primary)" }}>Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-xs transition-colors font-medium hover:underline"
                     style={{ color: "var(--text-muted)" }}
                     onMouseEnter={e => e.target.style.color = "var(--accent)"}
                     onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 font-display"
                style={{ color: "var(--text-primary)" }}>Official Portals</h4>
            <ul className="flex flex-col gap-2">
              {PORTAL_LINKS.map(l => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                     className="text-xs flex items-center gap-1.5 transition-colors font-medium hover:underline"
                     style={{ color: "var(--text-muted)" }}
                     onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                     onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    {l.label} <ExternalLink size={11} className="text-indigo-400" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpdesk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 font-display"
                style={{ color: "var(--text-primary)" }}>Citizen Helpdesk</h4>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                <Phone size={13} className="text-indigo-500 shrink-0" />
                <span>1800-11-1555 (National Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                <Mail size={13} className="text-indigo-500 shrink-0" />
                <span>support@govmatch.ai</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                <Globe size={13} className="text-indigo-500 shrink-0" />
                <span>Active 24/7 with Bob AI Assistant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
             style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} GovMatch AI. Built for empowering citizens across India.
          </p>
          <p className="text-center sm:text-right">
            Non-commercial civic technology platform · Powered by IBM SkillsBuild
          </p>
        </div>
      </div>
    </footer>
  );
}
