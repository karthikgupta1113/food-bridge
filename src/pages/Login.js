import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UtensilsCrossed, Building2, Bike } from "lucide-react";
import { login, normalizeRole } from "../api";
import "./Login.css";

const ROLES = [
  {
    id: "donor",
    name: "Donor",
    icon: UtensilsCrossed,
    description: "Restaurants, events, households",
    tagline: "Share your surplus food",
  },
  {
    id: "ngo",
    name: "NGO",
    icon: Building2,
    description: "Verified charities & shelters",
    tagline: "Receive & distribute food",
  },
  {
    id: "hero",
    name: "Food Hero",
    icon: Bike,
    description: "Volunteers & gig workers",
    tagline: "Pick up & deliver food",
  },
];

export default function Login() {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState(
    ROLES.some((r) => r.id === requestedRole) ? requestedRole : "donor"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const currentRole = ROLES.find((r) => r.id === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSubmitting(true);
    try {
      const res = await login(formData.email.trim().toLowerCase(), formData.password, selectedRole);
      setSubmitting(false);

      if (!res || res.error) {
        setServerError(res?.error || "Login failed");
        return;
      }

      const roleValue = res?.user?.role || selectedRole;
      const getTargetRoute = (role) => {
        const normalizedRole = normalizeRole(role);
        if (normalizedRole === "Donor") return "/donor";
        if (normalizedRole === "Receiver") return "/receiver";
        if (normalizedRole === "Volunteer") return "/volunteer";
        return "/dashboard";
      };

      navigate(getTargetRoute(roleValue), { replace: true });
    } catch (error) {
      setSubmitting(false);
      setServerError(error.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <div className="login-brand">
            <span className="brand-badge">🍱</span>
            <span className="brand-title">FoodBridge</span>
          </div>

          <h1 className="login-hero">
            Save Food.
            <br />
            Feed People.
            <br />
            <span className="login-hero-accent">In 2 Hours.</span>
          </h1>

          <p className="login-copy">
            Join 2,400+ donors, NGOs, and food heroes ending hunger one meal at a time.
          </p>

          <div className="login-note">🌱 Aligned with UN SDG #2 — Zero Hunger</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-welcome">
            <h2>Welcome back</h2>
            <p>Sign in to keep food moving and mouths fed.</p>
          </div>

          <div className="role-panel">
            <label>I am a</label>
            <div className="role-buttons">
              {ROLES.map((role) => {
                const isActive = selectedRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`role-button ${isActive ? "active" : ""}`}
                  >
                    <Icon className="role-icon" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="role-description">{currentRole.tagline} • {currentRole.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrap">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@foodbridge.dev"
                  className={errors.email ? "input-error" : ""}
                />
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', padding: 0, color: '#d97706', cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => alert("Password reset instructions will be sent to your registered email.")}
                >
                  Forgot?
                </button>
              </div>
              <div className="input-wrap">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={errors.password ? "input-error" : ""}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {serverError && <div className="alert-box">{serverError}</div>}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? "Signing in..." : `Sign in as ${currentRole.name}`}
              <ArrowRight className="submit-icon" />
            </button>
          </form>

          <p className="login-footer">
            New to FoodBridge? <Link to="/signup">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
