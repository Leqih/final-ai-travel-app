"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, CTAButton, Divider, SocialBtn, S, HERO_IMG, GOOGLE_ICON, FB_ICON } from "./AuthPage";

function CompactField({ label, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
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

export function SignUpPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [focused, setFocused]   = useState(null);

  return (
    <AuthShell>
      {/* Hero — shorter to leave room for 4 fields */}
      <div style={{ position: "relative", margin: "16px 16px 0", borderRadius: 20, overflow: "hidden", flexShrink: 0, height: "22vh" }}>
        <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,15,0.45)" }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 24px 20px", gap: 12, overflow: "hidden" }}>

        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", letterSpacing: -0.5 }}>
            Create Account <span style={{ fontWeight: 400 }}>✨</span>
          </h1>
          <p style={{ fontSize: 12, color: S.textDim, margin: 0, lineHeight: 1.4 }}>
            Join thousands of travelers planning smarter.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <CompactField label="Full Name" type="text" placeholder="Your name"
            value={name} onChange={setName}
            focused={focused === "name"} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
          <CompactField label="Email" type="email" placeholder="Example@email.com"
            value={email} onChange={setEmail}
            focused={focused === "email"} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
          <CompactField label="Password" type="password" placeholder="At least 8 characters"
            value={password} onChange={setPassword}
            focused={focused === "password"} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
          <CompactField label="Confirm Password" type="password" placeholder="Repeat your password"
            value={confirm} onChange={setConfirm}
            focused={focused === "confirm"} onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)} />
        </div>

        <CTAButton onClick={() => router.push("/home")}>Create Account</CTAButton>

        <Divider label="Or sign up with" />

        <div style={{ display: "flex", gap: 12 }}>
          <SocialBtn icon={<img src={GOOGLE_ICON} alt="Google" style={{ width: 20, height: 20 }} />} label="Google" />
          <SocialBtn icon={<img src={FB_ICON} alt="Facebook" style={{ width: 20, height: 20 }} />} label="Facebook" />
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: S.textDim, margin: 0 }}>
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", cursor: "pointer", color: S.accent, fontWeight: 700, fontSize: 13, padding: 0 }}>
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
