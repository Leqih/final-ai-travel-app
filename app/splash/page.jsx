"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#09090f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`,
    }}>
      {/* Logo mark */}
      <div style={{ marginBottom: 20 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="url(#g)" />
          <text x="32" y="44" textAnchor="middle" fontSize="30" fill="#fff">✈️</text>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff9a52" />
              <stop offset="1" stopColor="#ff5f1f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
        Wandr
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
        Plan smarter. Travel better.
      </div>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 48 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#ff8c42",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
