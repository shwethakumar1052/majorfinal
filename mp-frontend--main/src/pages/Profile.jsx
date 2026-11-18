import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Briefcase, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../services/apiService";

const STORAGE_USER = "govmatch_user";
const STORAGE_PROFILE = "govmatch_profile";
const STORAGE_TOKEN = "govmatch_token";

export default function Profile({ user, onAuthChange }) {
  const navigate = useNavigate();
  const storedLocal = JSON.parse(localStorage.getItem(STORAGE_PROFILE) || "{}");

  const [form, setForm] = useState({
    name:       user?.name || "",
    email:      user?.email || "",
    state:      storedLocal.state || "",
    occupation: storedLocal.occupation || "",
    age:        storedLocal.age || "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load profile from database if logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token && user) {
      profileAPI.getProfile()
        .then(response => {
          const { profile: dbProfile } = response;
          if (dbProfile) {
            setForm(prev => ({
              ...prev,
              state: dbProfile.state || prev.state,
              occupation: dbProfile.occupation || prev.occupation,
              age: dbProfile.age || prev.age,
            }));
          }
        })
        .catch(error => {
          console.warn("Could not load profile from database:", error);
        });
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    // Update user info in localStorage
    const updated = { ...user, name: form.name, email: form.email };
    localStorage.setItem(STORAGE_USER, JSON.stringify(updated));
    
    // Update profile in localStorage (backward compatibility)
    const updatedProfile = { ...storedLocal, state: form.state, occupation: form.occupation, age: form.age };
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(updatedProfile));

    // Try to save to database if logged in
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token) {
      try {
        await profileAPI.updateProfile({
          state: form.state,
          occupation: form.occupation,
          age: form.age,
        });
      } catch (error) {
        console.warn("Database update failed, but localStorage updated:", error);
      }
    }

    onAuthChange?.(updated);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
    onAuthChange?.(null);
    navigate("/");
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto glass-card p-10 text-center flex flex-col items-center gap-4 page-enter">
        <User size={40} style={{ color: "var(--text-muted)" }} />
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>Not logged in</p>
        <button onClick={() => navigate("/")} className="btn-primary">Go to Home</button>
      </div>
    );
  }

  return (
    <motion.div className="max-w-xl mx-auto flex flex-col gap-5 page-enter"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

      <div>
        <h1 className="text-2xl font-bold gradient-text">My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage your account and preferences</p>
      </div>

      {/* Avatar card */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
             style={{ background: "var(--accent-grad)" }}>
          {(user.name || "U")[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}
          </p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Edit Details</h2>

        {[
          { icon: <User size={14} />,     label: "Full Name",   key: "name",       type: "text" },
          { icon: <Mail size={14} />,     label: "Email",       key: "email",      type: "email" },
          { icon: <MapPin size={14} />,   label: "State",       key: "state",      type: "text" },
          { icon: <Briefcase size={14}/>, label: "Occupation",  key: "occupation", type: "text" },
          { icon: <User size={14} />,     label: "Age",         key: "age",        type: "number" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {f.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>{f.icon}</span>
              <input type={f.type} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl outline-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e  => e.target.style.borderColor = "var(--border)"} />
            </div>
          </div>
        ))}

        <div className="flex gap-3 mt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
            <Save size={14} /> {loading ? "Saving..." : "Save Changes"}
          </button>
          {saved && <span className="text-sm flex items-center" style={{ color: "var(--success)" }}>✓ Saved!</span>}
        </div>
      </form>

      {/* Logout */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Sign Out</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>You'll need to login again to access your data</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-sm"
                style={{ color: "var(--danger)", borderColor: "rgba(239,68,68,0.3)" }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </motion.div>
  );
}
