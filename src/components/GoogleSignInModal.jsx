import React from "react";
import { motion } from "framer-motion";
import { loginWithGoogle } from "../api";

const accounts = [
  { name: "Donor User", email: "donor@gmail.com" },
  { name: "NGO User", email: "ngo@gmail.com" },
  { name: "Volunteer User", email: "volunteer@gmail.com" },
];

export default function GoogleSignInModal({ role, onClose, onSignedIn }) {
  const handleSelect = async (email) => {
    try {
      await loginWithGoogle(email, role);
      const payload = { email, role, provider: "google" };
      try { localStorage.setItem("social-login", JSON.stringify(payload)); } catch (e) {}
      if (onSignedIn) onSignedIn(payload);
    } catch (err) {
      if (onSignedIn) onSignedIn({ error: err?.message || "Login failed" });
    } finally {
      onClose();
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modal = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdrop}
      style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", zIndex: 2000, fontFamily: 'Roboto, Arial, sans-serif' }}
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        initial="hidden"
        animate="visible"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 420, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", padding: 20, textAlign: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 8 }}>
          <svg width="36" height="36" viewBox="0 0 48 48" style={{ marginRight: 6 }}>
            <path fill="#EA4335" d="M24 9.5c3.9 0 7 1.5 9.2 3.6l6.9-6.9C36.6 2.9 30.7 0 24 0 14.9 0 6.8 5 2.5 12.6l7.9 6.1C12.6 13.1 17.8 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24c0-1.6-.2-3.1-.6-4.6H24v8.7h12.7c-.6 3.1-2.5 5.7-5.3 7.4l8.1 6.3C43.7 37.4 46.5 31.1 46.5 24z"/>
            <path fill="#4A90E2" d="M10.4 28.7A14.9 14.9 0 0 1 9 24c0-1.7.3-3.4.9-4.9L2 12c-1.8 3.4-2.8 7.3-2.8 11.5 0 4.2 1 8.1 2.8 11.5l7.9-6.3z"/>
            <path fill="#FBBC05" d="M24 48c6.7 0 12.6-2.2 17-6l-8.1-6.3c-2.6 1.7-5.9 2.7-9 2.7-6.2 0-11.4-3.6-13.6-8.9L2.5 35.4C6.8 43 14.9 48 24 48z"/>
          </svg>
          <h3 style={{ margin: 0, fontSize: 18, color: "#202124" }}>Continue with Google</h3>
        </div>

        <p style={{ color: "#5f6368", marginTop: 6, marginBottom: 14 }}>Choose an account to continue</p>

        <div style={{ display: "grid", gap: 10 }}>
          {accounts.map((acc) => (
            <motion.button
              key={acc.email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(acc.email)}
              style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg,#fbbc05,#ea4335)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                {acc.email[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "#202124", fontWeight: 700 }}>{acc.name}</div>
                <div style={{ fontSize: 13, color: "#5f6368" }}>{acc.email}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", border: "none", color: "#1a73e8", fontWeight: 700, cursor: "pointer" }}>Use another account</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
