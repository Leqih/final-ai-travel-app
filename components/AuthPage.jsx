"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HERO_IMG   = "https://www.figma.com/api/mcp/asset/055dba02-4d1b-4a1e-a470-f10f77a9637c";
const GOOGLE_ICON = "https://www.figma.com/api/mcp/asset/4d027e30-f708-442b-a328-ccfb611e972d";
const FB_ICON    = "https://www.figma.com/api/mcp/asset/d50b44cf-11e2-4ae1-9fe1-908a0c9288a2";

export const S = {
  bg:          "#09090f",
  border:      "rgba(255,255,255,0.08)",
  borderFocus: "rgba(255,140,66,0.55)",
  text:        "#fff",
  textDim:     "rgba(255,255,255,0.45)",
  textMuted:   "rgba(255,255,255,0.22)",
  accent:      "#ff8c42",
  font:        `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`,
};

export { HERO_IMG, GOOGLE_ICON, FB_ICON };

export function AuthPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState(null);

  return (
    <AuthShell>
      {/* Hero */}
      <HeroImage />

      {/* Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 24px 20px", gap: 12, overflow: "hidden" }}>

        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", letterSpacing: -0.5 }}>
            Welcome Back <span style={{ fontWeight: 400 }}>👋</span>
          </h1>
          <p style={{ fontSize: 12, color: S.textDim, margin: 0, lineHeight: 1.4 }}>
            Sign in to start planning your next trip.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Field label="Email" type="email" placeholder="Example@email.com"
            value={email} onChange={setEmail}
            focused={focused === "email"} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
          <Field label="Password" type="password" placeholder="At least 8 characters"
            value={password} onChange={setPassword}
            focused={focused === "password"} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
          <div style={{ textAlign: "right" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: S.accent, fontWeight: 600, padding: 0 }}>
              Forgot Password?
            </button>
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <CTAButton onClick={() => router.push("/home")}>Sign in</CTAButton>
          <Divider label="Or sign in with" />
          <div style={{ display: "flex", gap: 12 }}>
            <SocialBtn icon={<img src={GOOGLE_ICON} alt="Google" style={{ width: 20, height: 20 }} />} label="Google" />
            <SocialBtn icon={<img src={FB_ICON} alt="Facebook" style={{ width: 20, height: 20 }} />} label="Facebook" />
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: S.textDim, margin: 0 }}>
            Don't have an account?{" "}
            <button onClick={() => router.push("/signup")} style={{ background: "none", border: "none", cursor: "pointer", color: S.accent, fontWeight: 700, fontSize: 13, padding: 0 }}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

/* ─── shared shell ─── */
export function AuthShell({ children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: S.bg,
      fontFamily: S.font,
      color: S.text,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

export function HeroImage() {
  return (
    <div style={{ position: "relative", margin: "16px 16px 0", borderRadius: 20, overflow: "hidden", flexShrink: 0, height: "22vh" }}>
      <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,15,0.45)" }} />
    </div>
  );
}

export function Field({ label, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: focused ? S.accent : "rgba(255,255,255,0.55)" }}>{label}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "9px 12px", borderRadius: 8,
          border: `1px solid ${focused ? S.borderFocus : S.border}`,
          background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          color: S.text, fontSize: 14, fontFamily: S.font, outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(255,140,66,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
    </div>
  );
}

export function CTAButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 0",
      borderRadius: 12, border: "none", cursor: "pointer",
      fontSize: 15, fontWeight: 700,
      background: "linear-gradient(135deg, #ff9a52, #ff5f1f)",
      color: "#fff", boxShadow: "0 6px 20px rgba(255,110,30,0.35)",
    }}>
      {children}
    </button>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: S.border }} />
      <span style={{ fontSize: 12, color: S.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: S.border }} />
    </div>
  );
}

export function SocialBtn({ icon, label }) {
  return (
    <button style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      padding: "10px 0", borderRadius: 12, border: `1px solid ${S.border}`,
      background: "rgba(255,255,255,0.05)",
      color: S.text, fontSize: 14, fontWeight: 600,
      cursor: "pointer", fontFamily: S.font,
    }}>
      {icon}{label}
    </button>
  );
}
