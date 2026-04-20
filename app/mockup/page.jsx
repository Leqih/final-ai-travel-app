"use client";
import { useState, useRef, useEffect } from "react";

const ROUTES = [
  { label: "Home",     path: "/" },
  { label: "Discover", path: "/nearby" },
  { label: "Planner",  path: "/planner" },
  { label: "My Trips", path: "/trips" },
  { label: "Profile",  path: "/profile" },
];

/* ─── iPhone frame dimensions ─────────────────────────────────────── */
const PHONES = {
  16: {
    label: "iPhone 16",
    sub: "Titanium · USB-C · Camera Control",
    frameW: 320,
    frameH: 670,
    radius: 52,
    bezelTop: 14,
    bezelSide: 12,
    bezelBot: 14,
    diWidth: 122,
    diHeight: 36,
    diRadius: 20,
    frameColor: "#2a2a2e",
    frameGrad: "linear-gradient(160deg, #3a3a3e 0%, #1c1c20 40%, #2e2e32 70%, #222226 100%)",
    frameShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)",
    screenBg: "#000",
    /* left side buttons: action btn + vol up + vol down */
    leftBtns: [
      { y: 130, h: 34, label: "Action" },
      { y: 182, h: 52, label: "Vol+" },
      { y: 244, h: 52, label: "Vol−" },
    ],
    /* right side buttons: power + camera control */
    rightBtns: [
      { y: 164, h: 72, label: "Power" },
      { y: 270, h: 52, label: "Camera\nCtrl" },
    ],
    hasUsbC: true,
  },
  17: {
    label: "iPhone 17",
    sub: "Titanium · Camera Bar · Ultra-thin",
    frameW: 314,
    frameH: 658,
    radius: 56,
    bezelTop: 12,
    bezelSide: 10,
    bezelBot: 12,
    diWidth: 116,
    diHeight: 34,
    diRadius: 18,
    frameColor: "#c8b99a",
    frameGrad: "linear-gradient(160deg, #ddd0b8 0%, #b8a888 40%, #cfc0a4 70%, #b4a480 100%)",
    frameShadow: "0 0 0 1px rgba(255,255,255,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)",
    screenBg: "#000",
    leftBtns: [
      { y: 128, h: 32, label: "Action" },
      { y: 176, h: 50, label: "Vol+" },
      { y: 236, h: 50, label: "Vol−" },
    ],
    rightBtns: [
      { y: 160, h: 68, label: "Power" },
    ],
    hasUsbC: true,
    hasCameraBar: true,
  },
};

function IPhoneFrame({ model, route, onRouteChange }) {
  const cfg = PHONES[model];
  const iframeRef = useRef(null);

  const screenW = cfg.frameW - cfg.bezelSide * 2;
  const screenH = cfg.frameH - cfg.bezelTop - cfg.bezelBot;

  /* The app is designed for 390px wide — scale it down to fit screenW */
  const APP_W = 390;
  const APP_H = 844;
  const scale = screenW / APP_W;
  const scaledH = APP_H * scale;

  const leftBtnX = -9;
  const rightBtnX = cfg.frameW - 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

      {/* Phone shell */}
      <div style={{
        position: "relative",
        width: cfg.frameW,
        height: cfg.frameH,
        borderRadius: cfg.radius,
        background: cfg.frameGrad,
        boxShadow: `${cfg.frameShadow}, 0 40px 100px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)`,
        userSelect: "none",
      }}>

        {/* ── Screen recess ── */}
        <div style={{
          position: "absolute",
          top: cfg.bezelTop,
          left: cfg.bezelSide,
          width: screenW,
          height: screenH,
          borderRadius: cfg.radius - cfg.bezelSide,
          background: cfg.screenBg,
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.8)",
        }}>
          {/* Iframe scaled to look like the phone is running the app */}
          <div style={{
            width: APP_W,
            height: APP_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "auto",
          }}>
            <iframe
              ref={iframeRef}
              src={route}
              style={{
                width: APP_W,
                height: APP_H,
                border: "none",
                display: "block",
                background: "#09090f",
              }}
              title={`iPhone ${model} — Opal`}
            />
          </div>

          {/* Screen glare overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
            pointerEvents: "none",
            borderRadius: "inherit",
          }} />
        </div>

        {/* ── Dynamic Island ── */}
        <div style={{
          position: "absolute",
          top: cfg.bezelTop + 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: cfg.diWidth,
          height: cfg.diHeight,
          borderRadius: cfg.diRadius,
          background: "#000",
          zIndex: 10,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          {/* Camera dot */}
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#111", border: "1.5px solid #222", position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: "#1a1a2e", boxShadow: "inset 0 0 2px rgba(255,255,255,0.1)" }} />
          </div>
        </div>

        {/* ── Left buttons ── */}
        {cfg.leftBtns.map((btn, i) => (
          <div key={i} style={{
            position: "absolute",
            left: leftBtnX,
            top: btn.y,
            width: 4,
            height: btn.h,
            borderRadius: "2px 0 0 2px",
            background: cfg.model === 17
              ? "linear-gradient(180deg, #d4c8b0 0%, #bfb298 100%)"
              : "linear-gradient(180deg, #3c3c40 0%, #28282c 100%)",
            boxShadow: "-1px 0 3px rgba(0,0,0,0.5)",
          }} />
        ))}

        {/* ── Right buttons ── */}
        {cfg.rightBtns.map((btn, i) => (
          <div key={i} style={{
            position: "absolute",
            right: leftBtnX,
            top: btn.y,
            width: 4,
            height: btn.h,
            borderRadius: "0 2px 2px 0",
            background: model === "17"
              ? "linear-gradient(180deg, #d4c8b0 0%, #bfb298 100%)"
              : "linear-gradient(180deg, #3c3c40 0%, #28282c 100%)",
            boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
          }} />
        ))}

        {/* ── Bottom: USB-C + speaker grilles ── */}
        <div style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          {/* Left speaker dots */}
          {[...Array(5)].map((_, i) => (
            <div key={`l${i}`} style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          ))}
          {/* USB-C port */}
          <div style={{
            width: 36,
            height: 10,
            borderRadius: 5,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.07)",
            margin: "0 4px",
          }} />
          {/* Right speaker dots */}
          {[...Array(5)].map((_, i) => (
            <div key={`r${i}`} style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          ))}
        </div>

        {/* ── iPhone 17: Camera bar hint on top edge ── */}
        {cfg.hasCameraBar && (
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 180,
            height: 4,
            borderRadius: "0 0 4px 4px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)",
          }} />
        )}
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{cfg.label}</div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 3, letterSpacing: 0.1 }}>{cfg.sub}</div>
      </div>
    </div>
  );
}

export default function MockupPage() {
  const [route, setRoute] = useState("/");
  const [selectedModel, setSelectedModel] = useState(null); // null = both

  /* Override global body/html styles so the page breaks out of 375px constraint */
  useEffect(() => {
    const prevBodyStyle = document.body.style.cssText;
    const prevHtmlStyle = document.documentElement.style.cssText;
    document.body.style.cssText =
      "margin:0;width:100vw;min-height:100vh;overflow:hidden;background:transparent;position:static;transform:none;";
    document.documentElement.style.cssText =
      "display:block;min-height:100vh;background:#09090f;";
    return () => {
      document.body.style.cssText = prevBodyStyle;
      document.documentElement.style.cssText = prevHtmlStyle;
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(ellipse at 30% 20%, rgba(255,140,66,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(57,108,191,0.08) 0%, transparent 50%), linear-gradient(180deg, #060610 0%, #09090f 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 24px 64px",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,140,66,0.1)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
          <span style={{ fontSize: 13 }}>✈️</span>
          <span style={{ color: "rgba(255,140,66,0.9)", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>OPAL TRAVEL</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px", lineHeight: 1.1 }}>
          Interactive Prototype
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0, fontWeight: 400 }}>
          Tap, swipe and explore — fully interactive on device
        </p>
      </div>

      {/* ── Route picker ── */}
      <div style={{
        display: "flex",
        gap: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 99,
        padding: 4,
        marginBottom: 48,
      }}>
        {ROUTES.map(r => (
          <button
            key={r.path}
            onClick={() => setRoute(r.path)}
            style={{
              all: "unset",
              padding: "8px 18px",
              borderRadius: 99,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: route === r.path ? 700 : 500,
              color: route === r.path ? "#fff" : "rgba(255,255,255,0.4)",
              background: route === r.path ? "rgba(255,255,255,0.1)" : "transparent",
              boxShadow: route === r.path ? "0 1px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.07)" : "none",
              transition: "all 0.18s",
              letterSpacing: 0.1,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── Phones ── */}
      <div style={{
        display: "flex",
        gap: 56,
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <IPhoneFrame model={16} route={route} />
        <IPhoneFrame model={17} route={route} />
      </div>

      {/* ── Footer note ── */}
      <div style={{
        marginTop: 52,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "10px 18px",
      }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          Both screens are fully interactive — scroll, tap and navigate as normal
        </span>
      </div>
    </div>
  );
}
