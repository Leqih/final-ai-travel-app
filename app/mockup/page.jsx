"use client";
import { useState, useEffect } from "react";

const ROUTES = [
  { label: "Home",     path: "/" },
  { label: "Discover", path: "/nearby" },
  { label: "Planner",  path: "/planner" },
  { label: "My Trips", path: "/trips" },
  { label: "Profile",  path: "/profile" },
];

/* ─── iPhone frame configs ──────────────────────────────────────────── */
const PHONES = {
  16: {
    label: "iPhone 16",
    sub: "Titanium · USB-C · Camera Control",
    frameW: 360,
    frameH: 752,
    radius: 56,
    bezelTop: 14,
    bezelSide: 13,
    bezelBot: 14,
    diWidth: 130,
    diHeight: 38,
    diRadius: 22,
    frameGrad: "linear-gradient(160deg, #48484c 0%, #1e1e22 35%, #323236 65%, #222226 100%)",
    frameShadow: "0 0 0 1.5px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)",
    btnGrad: "linear-gradient(180deg, #404044 0%, #2a2a2e 100%)",
    screenBg: "#000",
    leftBtns: [
      { y: 145, h: 36, label: "Action" },
      { y: 200, h: 56, label: "Vol+" },
      { y: 268, h: 56, label: "Vol−" },
    ],
    rightBtns: [
      { y: 180, h: 78, label: "Power" },
      { y: 296, h: 56, label: "CamCtrl" },
    ],
    hasUsbC: true,
  },
  17: {
    label: "iPhone 17",
    sub: "Titanium · Camera Bar · Ultra-thin",
    frameW: 352,
    frameH: 738,
    radius: 60,
    bezelTop: 12,
    bezelSide: 11,
    bezelBot: 12,
    diWidth: 124,
    diHeight: 36,
    diRadius: 20,
    frameGrad: "linear-gradient(160deg, #e0d4bc 0%, #c4b490 35%, #d8cbb0 65%, #bfac86 100%)",
    frameShadow: "0 0 0 1.5px rgba(255,255,255,0.25), inset 0 0 0 1px rgba(255,255,255,0.12)",
    btnGrad: "linear-gradient(180deg, #ddd0b8 0%, #c8b898 100%)",
    screenBg: "#000",
    leftBtns: [
      { y: 142, h: 34, label: "Action" },
      { y: 192, h: 54, label: "Vol+" },
      { y: 258, h: 54, label: "Vol−" },
    ],
    rightBtns: [
      { y: 175, h: 74, label: "Power" },
    ],
    hasUsbC: true,
    hasCameraBar: true,
  },
};

/* ── SVG status icons ────────────────────────────────────────────────── */
function SignalBars() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <rect x="0"  y="8"  width="3" height="4"  rx="1" fill="white"/>
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="white"/>
      <rect x="9"  y="3"  width="3" height="9"  rx="1" fill="white"/>
      <rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/>
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
      <path d="M3.5 6.5C4.8 5.2 6.3 4.5 8 4.5s3.2.7 4.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M1 3.5C3 1.5 5.4.5 8 .5s5 1 7 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
      <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
      <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4"/>
    </svg>
  );
}

/* ── Status bar overlay ──────────────────────────────────────────────── */
function StatusBar({ screenW }) {
  const [time, setTime] = useState(() => {
    const n = new Date();
    return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setTime(`${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`);
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: screenW,
      height: 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      zIndex: 30,
      pointerEvents: "none",
    }}>
      <span style={{
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: -0.3,
        fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
      }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <SignalBars />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

/* ── Home indicator ──────────────────────────────────────────────────── */
function HomeIndicator({ screenW }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 8,
      left: "50%",
      transform: "translateX(-50%)",
      width: Math.round(screenW * 0.35),
      height: 5,
      borderRadius: 99,
      background: "rgba(255,255,255,0.5)",
      zIndex: 30,
      pointerEvents: "none",
    }} />
  );
}

/* ── iPhone frame component ──────────────────────────────────────────── */
function IPhoneFrame({ model, route }) {
  const cfg = PHONES[model];

  const screenW = cfg.frameW - cfg.bezelSide * 2;
  const screenH = cfg.frameH - cfg.bezelTop - cfg.bezelBot;

  const APP_W = 390;
  const APP_H = 844;
  const scale  = screenW / APP_W;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>

      {/* ── Outer phone shell ── */}
      <div style={{
        position: "relative",
        width: cfg.frameW,
        height: cfg.frameH,
        borderRadius: cfg.radius,
        background: cfg.frameGrad,
        boxShadow: `${cfg.frameShadow}, 0 50px 120px rgba(0,0,0,0.85), 0 12px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)`,
        userSelect: "none",
      }}>

        {/* Inner screen recess */}
        <div style={{
          position: "absolute",
          top: cfg.bezelTop,
          left: cfg.bezelSide,
          width: screenW,
          height: screenH,
          borderRadius: cfg.radius - cfg.bezelSide,
          background: cfg.screenBg,
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.9), inset 0 2px 8px rgba(0,0,0,0.6)",
        }}>

          {/* App iframe — scaled from 390px to screenW */}
          <div style={{
            width: APP_W,
            height: APP_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "auto",
          }}>
            <iframe
              src={route}
              style={{ width: APP_W, height: APP_H, border: "none", display: "block", background: "#09090f" }}
              title={`iPhone ${model} — Opal`}
            />
          </div>

          {/* Status bar overlay — sits on top of iframe */}
          <StatusBar screenW={screenW} />

          {/* Home indicator */}
          <HomeIndicator screenW={screenW} />

          {/* Screen glare */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(130deg, rgba(255,255,255,0.05) 0%, transparent 45%)",
            pointerEvents: "none",
            borderRadius: "inherit",
          }} />
        </div>

        {/* ── Dynamic Island ── */}
        <div style={{
          position: "absolute",
          top: cfg.bezelTop + 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: cfg.diWidth,
          height: cfg.diHeight,
          borderRadius: cfg.diRadius,
          background: "#000",
          zIndex: 40,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 0 12px rgba(0,0,0,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          {/* FaceID sensor bar */}
          <div style={{ width: 44, height: 5, borderRadius: 4, background: "#1a1a1a" }} />
          {/* Camera lens */}
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#111", border: "1.5px solid #252525", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: "#0a0a1e", boxShadow: "inset 0 0 3px rgba(100,140,255,0.3)" }} />
          </div>
        </div>

        {/* ── Left side buttons ── */}
        {cfg.leftBtns.map((btn, i) => (
          <div key={i} style={{
            position: "absolute",
            left: -5,
            top: btn.y,
            width: 4,
            height: btn.h,
            borderRadius: "3px 0 0 3px",
            background: cfg.btnGrad,
            boxShadow: "-2px 0 6px rgba(0,0,0,0.6), inset -1px 0 2px rgba(255,255,255,0.08)",
          }} />
        ))}

        {/* ── Right side buttons ── */}
        {cfg.rightBtns.map((btn, i) => (
          <div key={i} style={{
            position: "absolute",
            right: -5,
            top: btn.y,
            width: 4,
            height: btn.h,
            borderRadius: "0 3px 3px 0",
            background: cfg.btnGrad,
            boxShadow: "2px 0 6px rgba(0,0,0,0.6), inset 1px 0 2px rgba(255,255,255,0.08)",
          }} />
        ))}

        {/* ── Bottom: USB-C + speaker grilles ── */}
        <div style={{
          position: "absolute",
          bottom: 13,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={`l${i}`} style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.14)" }} />
          ))}
          <div style={{ width: 38, height: 10, borderRadius: 6, background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.08)", margin: "0 5px" }} />
          {[...Array(6)].map((_, i) => (
            <div key={`r${i}`} style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.14)" }} />
          ))}
        </div>

        {/* ── iPhone 17: Camera bar at top edge ── */}
        {cfg.hasCameraBar && (
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 5,
            borderRadius: "0 0 5px 5px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.18) 75%, transparent)",
          }} />
        )}

        {/* ── Subtle inner edge highlight (rim light) ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: cfg.radius,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Phone label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{cfg.label}</div>
        <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 11, marginTop: 3, letterSpacing: 0.2 }}>{cfg.sub}</div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function MockupPage() {
  const [route, setRoute] = useState("/");

  useEffect(() => {
    const prevBody = document.body.style.cssText;
    const prevHtml = document.documentElement.style.cssText;
    document.body.style.cssText =
      "margin:0;width:100vw;min-height:100vh;overflow:hidden;background:transparent;position:static;transform:none;";
    document.documentElement.style.cssText =
      "display:block;min-height:100vh;background:#07070f;";
    return () => {
      document.body.style.cssText = prevBody;
      document.documentElement.style.cssText = prevHtml;
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: [
        "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(255,140,66,0.07) 0%, transparent 60%)",
        "radial-gradient(ellipse 50% 50% at 80% 90%, rgba(57,108,191,0.07) 0%, transparent 60%)",
        "radial-gradient(ellipse 40% 60% at 60% 40%, rgba(255,180,100,0.03) 0%, transparent 50%)",
        "linear-gradient(180deg, #070710 0%, #09090f 100%)",
      ].join(", "),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "52px 24px 72px",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,140,66,0.1)", border: "1px solid rgba(255,140,66,0.22)",
          borderRadius: 99, padding: "5px 16px", marginBottom: 18,
        }}>
          <span style={{ fontSize: 13 }}>✈️</span>
          <span style={{ color: "rgba(255,140,66,0.9)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>OPAL TRAVEL</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: -1.2, margin: "0 0 10px", lineHeight: 1.05 }}>
          Interactive Prototype
        </h1>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 15, margin: 0, fontWeight: 400, letterSpacing: 0.1 }}>
          Tap, swipe and explore — fully interactive on device
        </p>
      </div>

      {/* ── Route picker ── */}
      <div style={{
        display: "flex",
        gap: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 99,
        padding: "4px",
        marginBottom: 56,
      }}>
        {ROUTES.map(r => (
          <button
            key={r.path}
            onClick={() => setRoute(r.path)}
            style={{
              all: "unset",
              padding: "8px 20px",
              borderRadius: 99,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: route === r.path ? 700 : 500,
              color: route === r.path ? "#fff" : "rgba(255,255,255,0.38)",
              background: route === r.path
                ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.07) 100%)"
                : "transparent",
              boxShadow: route === r.path
                ? "0 1px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)"
                : "none",
              transition: "all 0.2s",
              letterSpacing: 0.1,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── Phone pair ── */}
      <div style={{
        display: "flex",
        gap: 64,
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <IPhoneFrame model={16} route={route} />
        <IPhoneFrame model={17} route={route} />
      </div>

      {/* ── Footer ── */}
      <div style={{
        marginTop: 60,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "11px 20px",
      }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12, letterSpacing: 0.1 }}>
          Both screens are fully interactive — scroll, tap and navigate as normal
        </span>
      </div>
    </div>
  );
}
