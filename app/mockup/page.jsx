"use client";
import { useState, useEffect } from "react";

const ROUTES = [
  { label: "Home",     path: "/" },
  { label: "Discover", path: "/nearby" },
  { label: "Planner",  path: "/planner" },
  { label: "My Trips", path: "/trips" },
  { label: "Profile",  path: "/profile" },
];

/* ── Figma iPhone 16 Pro / Black Titanium asset URLs ───────────────── */
const F = {
  sideBtn:    "https://www.figma.com/api/mcp/asset/172ecc66-2117-4113-8bb3-43622a806eec",
  sideBtn1:   "https://www.figma.com/api/mcp/asset/3c45b222-483d-4413-bf1f-2bbdcdacf04d",
  speaker:    "https://www.figma.com/api/mcp/asset/efdca1c8-a84d-4b40-9f7c-6779b7548ba4",
  bezelCurve: "https://www.figma.com/api/mcp/asset/b241a97c-0f97-4d65-996e-025a2a4e6729",
  bezelShine: "https://www.figma.com/api/mcp/asset/059a55a7-4e05-4418-ba93-502b864d93c5",
  shineImg:   "https://www.figma.com/api/mcp/asset/b823d51f-da98-48e7-a22a-dbdda414e38b",
  antenna:    "https://www.figma.com/api/mcp/asset/45b29579-ab06-45b8-8661-5a962b83eef9",
  camera:     "https://www.figma.com/api/mcp/asset/fdf0671c-75da-4f29-9114-4c87de492b48",
  bar1:       "https://www.figma.com/api/mcp/asset/60add121-dd92-45c5-8a0d-00e7a0df770f",
  bar2:       "https://www.figma.com/api/mcp/asset/eb389cfa-38a3-4210-9ef0-d9f70843bc00",
  bar3:       "https://www.figma.com/api/mcp/asset/5e50845e-ad67-4011-a818-c540846034a3",
  bar4:       "https://www.figma.com/api/mcp/asset/7a6c4b36-f17b-49e5-91fa-8a644ceed118",
  bar5:       "https://www.figma.com/api/mcp/asset/4e21b3f0-0ef9-4034-95c1-306b4925cf76",
  bar6:       "https://www.figma.com/api/mcp/asset/b40209de-7dcd-4a1d-98aa-ebe0ca965e8a",
  bar7:       "https://www.figma.com/api/mcp/asset/6a2e6072-73b7-4c45-a138-521c4e5e5885",
  battBorder: "https://www.figma.com/api/mcp/asset/1d874270-7750-4e2e-ac6e-042b3389652f",
  battCap:    "https://www.figma.com/api/mcp/asset/5db70c09-bd92-402b-90fd-362861e135a7",
};

/* ── Figma native component dimensions ──────────────────────────────── */
const NW = 1310, NH = 2710;  // native px
const DH = 760;               // desired display height
const sc = DH / NH;           // ≈ 0.2805
const DW = Math.round(NW * sc); // ≈ 367px

// Screen rect in native coords (Device Bezel Glow position)
const SX = 26, SY = 18, SW = 1258, SH = 2674, SR = 212;

// App viewport
const AW = 390, AH = 844;
const appSc = (SW * sc) / AW; // scale app to fit screen

/* ── Live clock ─────────────────────────────────────────────────────── */
function useClock() {
  const fmt = () => {
    const n = new Date();
    return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
  };
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ── Side button (metallic, reused for all 4 buttons) ───────────────── */
function SideButton({ left, top, width, height, right }) {
  const pos = right != null
    ? { position: "absolute", right, top, width, height }
    : { position: "absolute", left, top, width, height };
  return (
    <div style={{ ...pos, borderRadius: 3, border: "1px solid rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        background: "#434343",
        backgroundImage: `url('${F.sideBtn}'), url('${F.sideBtn1}')`,
        backgroundSize: "110px 110px", backgroundPosition: "top left",
        backgroundRepeat: "repeat",
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        backgroundImage: `url('${F.sideBtn1}')`,
        backgroundSize: "110px 110px", opacity: 0.2,
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        boxShadow: "inset 0px -15px 7px 0px rgba(0,0,0,0.5)",
      }} />
    </div>
  );
}

/* ── iPhone 16 Pro (Black Titanium) using Figma assets ──────────────── */
function IPhone16Pro({ route }) {
  const time = useClock();
  const frameRing = Math.round(18 * sc); // ≈ 5px frame width at display scale

  return (
    <div style={{ position: "relative", width: DW, height: DH, userSelect: "none" }}>

      {/* ① Screen + iframe — sits in the middle of the z-stack */}
      <div style={{
        position: "absolute",
        left: SX * sc, top: SY * sc,
        width: SW * sc, height: SH * sc,
        borderRadius: SR * sc,
        background: "#000",
        overflow: "hidden",
        zIndex: 5,
        boxShadow: [
          `0 0 0 ${frameRing}px #3b3b3b`,
          `0 0 0 ${frameRing + 1}px #111`,
          `0 60px 150px rgba(0,0,0,0.95), 0 20px 60px rgba(0,0,0,0.7)`,
          `inset 0 0 0 1px rgba(0,0,0,0.8)`,
        ].join(", "),
      }}>
        <div style={{ width: AW, height: AH, transform: `scale(${appSc})`, transformOrigin: "top left" }}>
          <iframe
            src={route}
            style={{ width: AW, height: AH, border: "none", display: "block", background: "#09090f" }}
            title="iPhone 16 Pro — Opal"
          />
        </div>
        {/* Home indicator */}
        <div style={{
          position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
          width: "35%", height: 5, borderRadius: 99,
          background: "rgba(255,255,255,0.35)", pointerEvents: "none",
        }} />
      </div>

      {/* ② Chrome overlay — native size, scaled, above screen */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: NW, height: NH,
        transform: `scale(${sc})`, transformOrigin: "top left",
        pointerEvents: "none", zIndex: 10,
      }}>
        {/* Bezel edge glow (white inner edge light) */}
        <div style={{
          position: "absolute", left: SX, top: SY, width: SW, height: SH,
          borderRadius: SR, background: "transparent",
          boxShadow: "0px -2px 7px 6px rgba(255,255,255,0.28)",
        }} />

        {/* Inner bezel edge highlight (no mask needed — just the corners) */}
        <div style={{
          position: "absolute", left: SX, top: SY, width: SW, height: SH,
          borderRadius: SR,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }} />

        {/* Speaker grille */}
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          top: 17, width: 272, height: 11, borderRadius: 24,
          border: "1.5px solid black",
          backgroundImage: `linear-gradient(90deg,rgba(51,51,51,.4),rgba(51,51,51,.4)),url('${F.speaker}')`,
          backgroundSize: "auto auto, 16px 16px", backgroundPosition: "top left",
          boxShadow: "inset 0px 1px 5px 3px rgba(0,0,0,0.75)", overflow: "hidden",
        }} />

        {/* Dynamic Island */}
        <div style={{ position: "absolute", left: 468, top: 87, width: 373, height: 108 }}>
          <div style={{ position: "absolute", inset: 0, width: 374, height: 108, borderRadius: 140, background: "#000" }} />
          <div style={{ position: "absolute", left: 291, top: "50%", width: 58, height: 58, transform: "translateY(-50%)" }}>
            <img alt="" style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }} src={F.camera} />
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          position: "absolute", left: 38, top: 62, width: 1234, height: 158,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: 115, paddingRight: 66,
        }}>
          <span style={{
            color: "white", fontSize: 46, fontWeight: 500,
            fontFamily: "'SF Pro Display',-apple-system,sans-serif",
            letterSpacing: -1, lineHeight: 1, whiteSpace: "nowrap",
          }}>{time}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {/* Signal */}
            <div style={{ position: "relative", width: 59, height: 33 }}>
              {[
                { top:"60%", left:0, right:"83.33%", bottom:0, src:F.bar1 },
                { top:"40%", left:"27.78%", right:"55.56%", bottom:0, src:F.bar2 },
                { top:"20%", left:"55.56%", right:"27.78%", bottom:0, src:F.bar3 },
                { top:0, left:"83.33%", right:0, bottom:0, src:F.bar4 },
              ].map((b, i) => (
                <div key={i} style={{ position:"absolute", top:b.top, left:b.left, right:b.right, bottom:b.bottom }}>
                  <img alt="" style={{ width:"100%", height:"100%", display:"block" }} src={b.src} />
                </div>
              ))}
            </div>
            {/* WiFi */}
            <div style={{ position: "relative", width: 53, height: 38, overflow: "hidden" }}>
              {[
                { top:"69.84%", left:"34.32%", right:"34.38%", bottom:"0.01%", src:F.bar5 },
                { top:"33.73%", left:"18.75%", right:"18.68%", bottom:"31.83%", src:F.bar6 },
                { top:"0.01%", left:0, right:"0.01%", bottom:"56.96%", src:F.bar7 },
              ].map((b, i) => (
                <div key={i} style={{ position:"absolute", top:b.top, left:b.left, right:b.right, bottom:b.bottom }}>
                  <img alt="" style={{ width:"100%", height:"100%", display:"block" }} src={b.src} />
                </div>
              ))}
            </div>
            {/* Battery */}
            <div style={{ position: "relative", width: 79, height: 40, overflow: "hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:"12.5%", bottom:0 }}>
                <img alt="" style={{ width:"100%", height:"100%", display:"block" }} src={F.battBorder} />
              </div>
              <div style={{ position:"absolute", top:"16.67%", left:"8.33%", right:"20.83%", bottom:"16.67%", borderRadius:1, background:"white" }} />
              <div style={{ position:"absolute", top:"33.33%", left:"91.67%", right:0, bottom:"33.33%" }}>
                <img alt="" style={{ width:"100%", height:"100%", display:"block" }} src={F.battCap} />
              </div>
            </div>
          </div>
        </div>

        {/* Left buttons: Action, Vol+, Vol− */}
        <SideButton left={0} top={556} width={24} height={124} />
        <SideButton left={0} top={773} width={24} height={202} />
        <SideButton left={0} top={1030} width={24} height={202} />
        {/* Right button: Power */}
        <SideButton right={0} top={842} width={24} height={320} />
      </div>
    </div>
  );
}

/* ── iPhone 17 (CSS — Desert Titanium) ──────────────────────────────── */
const P17 = {
  frameW: 352, frameH: 738,
  radius: 60, bezelTop: 12, bezelSide: 11, bezelBot: 12,
  diWidth: 124, diHeight: 36, diRadius: 20,
  frameGrad: "linear-gradient(160deg,#e0d4bc 0%,#c4b490 35%,#d8cbb0 65%,#bfac86 100%)",
  frameShadow: "0 0 0 1.5px rgba(255,255,255,0.25),inset 0 0 0 1px rgba(255,255,255,0.12)",
  btnGrad: "linear-gradient(180deg,#ddd0b8 0%,#c8b898 100%)",
  leftBtns:  [{ y:142,h:34 },{ y:192,h:54 },{ y:258,h:54 }],
  rightBtns: [{ y:175,h:74 }],
  hasCameraBar: true,
};

function IPhone17({ route }) {
  const cfg = P17;
  const time = useClock();
  const screenW = cfg.frameW - cfg.bezelSide * 2;
  const screenH = cfg.frameH - cfg.bezelTop - cfg.bezelBot;
  const appScale = screenW / AW;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:22 }}>
      <div style={{
        position:"relative", width:cfg.frameW, height:cfg.frameH,
        borderRadius:cfg.radius, background:cfg.frameGrad,
        boxShadow:`${cfg.frameShadow},0 50px 120px rgba(0,0,0,0.85),0 12px 40px rgba(0,0,0,0.7)`,
        userSelect:"none",
      }}>
        {/* Screen */}
        <div style={{
          position:"absolute", top:cfg.bezelTop, left:cfg.bezelSide,
          width:screenW, height:screenH,
          borderRadius:cfg.radius - cfg.bezelSide,
          background:"#000", overflow:"hidden",
          boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.9)",
        }}>
          <div style={{ width:AW, height:AH, transform:`scale(${appScale})`, transformOrigin:"top left" }}>
            <iframe src={route} style={{ width:AW, height:AH, border:"none", display:"block", background:"#09090f" }} title="iPhone 17 — Opal" />
          </div>
          {/* Status bar */}
          <div style={{
            position:"absolute", top:0, left:0, width:screenW, height:52,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 20px", pointerEvents:"none", zIndex:20,
          }}>
            <span style={{ color:"#fff", fontSize:14, fontWeight:700, letterSpacing:-0.3, fontFamily:"-apple-system,sans-serif" }}>{time}</span>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <svg width="16" height="11" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="white"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="white"/><rect x="9" y="3" width="3" height="9" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
              <svg width="15" height="11" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/><path d="M3.5 6.5C4.8 5.2 6.3 4.5 8 4.5s3.2.7 4.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/><path d="M1 3.5C3 1.5 5.4.5 8 .5s5 1 7 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg>
              <svg width="24" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4"/></svg>
            </div>
          </div>
          {/* Home indicator */}
          <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:"35%", height:5, borderRadius:99, background:"rgba(255,255,255,0.5)", pointerEvents:"none", zIndex:20 }} />
          {/* Glare */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(130deg,rgba(255,255,255,0.05) 0%,transparent 45%)", pointerEvents:"none", borderRadius:"inherit" }} />
        </div>
        {/* Dynamic Island */}
        <div style={{
          position:"absolute", top:cfg.bezelTop+11, left:"50%", transform:"translateX(-50%)",
          width:cfg.diWidth, height:cfg.diHeight, borderRadius:cfg.diRadius,
          background:"#000", zIndex:40,
          boxShadow:"0 0 0 1px rgba(255,255,255,0.06),inset 0 0 12px rgba(0,0,0,1)",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          <div style={{ width:44, height:5, borderRadius:4, background:"#1a1a1a" }} />
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#111", border:"1.5px solid #252525", position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:5, height:5, borderRadius:"50%", background:"#0a0a1e" }} />
          </div>
        </div>
        {/* Left buttons */}
        {cfg.leftBtns.map((b,i) => (
          <div key={i} style={{ position:"absolute", left:-5, top:b.y, width:4, height:b.h, borderRadius:"3px 0 0 3px", background:cfg.btnGrad, boxShadow:"-2px 0 6px rgba(0,0,0,0.6)" }} />
        ))}
        {/* Right buttons */}
        {cfg.rightBtns.map((b,i) => (
          <div key={i} style={{ position:"absolute", right:-5, top:b.y, width:4, height:b.h, borderRadius:"0 3px 3px 0", background:cfg.btnGrad, boxShadow:"2px 0 6px rgba(0,0,0,0.6)" }} />
        ))}
        {/* Bottom USB-C */}
        <div style={{ position:"absolute", bottom:13, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:5 }}>
          {[...Array(6)].map((_,i) => <div key={`l${i}`} style={{ width:2.5, height:2.5, borderRadius:"50%", background:"rgba(0,0,0,0.3)" }} />)}
          <div style={{ width:38, height:10, borderRadius:6, background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.08)", margin:"0 5px" }} />
          {[...Array(6)].map((_,i) => <div key={`r${i}`} style={{ width:2.5, height:2.5, borderRadius:"50%", background:"rgba(0,0,0,0.3)" }} />)}
        </div>
        {/* Camera bar hint */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:200, height:5, borderRadius:"0 0 5px 5px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.18) 25%,rgba(255,255,255,0.18) 75%,transparent)" }} />
        {/* Rim light */}
        <div style={{ position:"absolute", inset:0, borderRadius:cfg.radius, boxShadow:"inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.3)", pointerEvents:"none" }} />
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ color:"#fff", fontSize:15, fontWeight:700, letterSpacing:-0.3 }}>iPhone 17</div>
        <div style={{ color:"rgba(255,255,255,0.32)", fontSize:11, marginTop:3, letterSpacing:0.2 }}>Titanium · Camera Bar · Ultra-thin</div>
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
    document.body.style.cssText = "margin:0;width:100vw;min-height:100vh;overflow:hidden;background:transparent;position:static;transform:none;";
    document.documentElement.style.cssText = "display:block;min-height:100vh;background:#07070f;";
    return () => {
      document.body.style.cssText = prevBody;
      document.documentElement.style.cssText = prevHtml;
    };
  }, []);

  return (
    <div style={{
      minHeight:"100vh", width:"100vw",
      background:[
        "radial-gradient(ellipse 60% 40% at 20% 10%,rgba(255,140,66,0.07) 0%,transparent 60%)",
        "radial-gradient(ellipse 50% 50% at 80% 90%,rgba(57,108,191,0.07) 0%,transparent 60%)",
        "linear-gradient(180deg,#070710 0%,#09090f 100%)",
      ].join(","),
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"52px 24px 72px",
      fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
      overflowX:"hidden", boxSizing:"border-box",
    }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,140,66,0.1)", border:"1px solid rgba(255,140,66,0.22)", borderRadius:99, padding:"5px 16px", marginBottom:18 }}>
          <span style={{ fontSize:13 }}>✈️</span>
          <span style={{ color:"rgba(255,140,66,0.9)", fontSize:11, fontWeight:700, letterSpacing:1.2 }}>OPAL TRAVEL</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:40, fontWeight:800, letterSpacing:-1.2, margin:"0 0 10px", lineHeight:1.05 }}>
          Interactive Prototype
        </h1>
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:15, margin:0, fontWeight:400 }}>
          Tap, swipe and explore — fully interactive on device
        </p>
      </div>

      {/* Route picker */}
      <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:99, padding:"4px", marginBottom:56 }}>
        {ROUTES.map(r => (
          <button key={r.path} onClick={() => setRoute(r.path)} style={{
            all:"unset", padding:"8px 20px", borderRadius:99, cursor:"pointer",
            fontSize:12, fontWeight:route === r.path ? 700 : 500,
            color:route === r.path ? "#fff" : "rgba(255,255,255,0.38)",
            background:route === r.path ? "linear-gradient(135deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.07) 100%)" : "transparent",
            boxShadow:route === r.path ? "0 1px 8px rgba(0,0,0,0.4),inset 0 0 0 1px rgba(255,255,255,0.1)" : "none",
            transition:"all 0.2s", letterSpacing:0.1,
          }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Phones */}
      <div style={{ display:"flex", gap:64, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
        {/* iPhone 16 Pro — Figma Black Titanium */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:22 }}>
          <IPhone16Pro route={route} />
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#fff", fontSize:15, fontWeight:700, letterSpacing:-0.3 }}>iPhone 16 Pro</div>
            <div style={{ color:"rgba(255,255,255,0.32)", fontSize:11, marginTop:3, letterSpacing:0.2 }}>Black Titanium · USB-C · Camera Control</div>
          </div>
        </div>
        {/* iPhone 17 — CSS Desert Titanium */}
        <IPhone17 route={route} />
      </div>

      {/* Footer */}
      <div style={{ marginTop:60, display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"11px 20px" }}>
        <span style={{ fontSize:14 }}>💡</span>
        <span style={{ color:"rgba(255,255,255,0.28)", fontSize:12, letterSpacing:0.1 }}>
          Both screens are fully interactive — scroll, tap and navigate as normal
        </span>
      </div>
    </div>
  );
}
