"use client";
import { useState, useEffect } from "react";

/* ── Figma iPhone 16 Pro / Black Titanium asset URLs ───────────────── */
const F = {
  sideBtn:    "https://www.figma.com/api/mcp/asset/172ecc66-2117-4113-8bb3-43622a806eec",
  sideBtn1:   "https://www.figma.com/api/mcp/asset/3c45b222-483d-4413-bf1f-2bbdcdacf04d",
  speaker:    "https://www.figma.com/api/mcp/asset/efdca1c8-a84d-4b40-9f7c-6779b7548ba4",
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

/* ── Figma native component dimensions (fixed) ──────────────────────── */
const NW = 1310, NH = 2710;
const SX = 26, SY = 18, SW = 1258, SH = 2674, SR = 212;

// App viewport — AW matches the app's body width (375px from globals.css)
// so content fills the screen edge-to-edge with no side gaps.
// AH derived from screen aspect so bottom nav is never clipped.
const AW = 375;
const AH = Math.round(AW * SH / SW); // ≈ 797

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

/* ── Side button ────────────────────────────────────────────────────── */
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
        backgroundSize: "110px 110px", backgroundRepeat: "repeat",
      }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 3, boxShadow: "inset 0px -15px 7px 0px rgba(0,0,0,0.5)" }} />
    </div>
  );
}

/* ── iPhone 16 Pro ──────────────────────────────────────────────────── */
function IPhone16Pro({ route, displayH }) {
  const time = useClock();

  const sc       = displayH / NH;
  const DW       = Math.round(NW * sc);
  const DH       = displayH;
  const appSc    = (SW * sc) / AW;
  const frameRing = Math.round(18 * sc);

  return (
    <div style={{ position: "relative", width: DW, height: DH, userSelect: "none", flexShrink: 0 }}>

      {/* Screen + iframe */}
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
        {/* iframe scaled to exactly fill the screen area */}
        <div style={{ width: AW, height: AH, transform: `scale(${appSc})`, transformOrigin: "top left" }}>
          <iframe
            src={route}
            style={{ width: AW, height: AH, border: "none", display: "block", background: "#09090f" }}
            title="Opal"
          />
        </div>
        {/* Home indicator */}
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          width: "35%", height: 5, borderRadius: 99,
          background: "rgba(255,255,255,0.35)", pointerEvents: "none", zIndex: 20,
        }} />
      </div>

      {/* Chrome overlay — native size scaled via transform */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: NW, height: NH,
        transform: `scale(${sc})`, transformOrigin: "top left",
        pointerEvents: "none", zIndex: 10,
      }}>
        {/* Bezel edge glow */}
        <div style={{
          position: "absolute", left: SX, top: SY, width: SW, height: SH,
          borderRadius: SR, boxShadow: "0px -2px 7px 6px rgba(255,255,255,0.28)",
        }} />
        <div style={{
          position: "absolute", left: SX, top: SY, width: SW, height: SH,
          borderRadius: SR,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
        }} />

        {/* Speaker grille */}
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          top: 17, width: 272, height: 11, borderRadius: 24,
          border: "1.5px solid black",
          backgroundImage: `linear-gradient(90deg,rgba(51,51,51,.4),rgba(51,51,51,.4)),url('${F.speaker}')`,
          backgroundSize: "auto auto, 16px 16px",
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

        {/* Buttons */}
        <SideButton left={0} top={556} width={24} height={124} />
        <SideButton left={0} top={773} width={24} height={202} />
        <SideButton left={0} top={1030} width={24} height={202} />
        <SideButton right={0} top={842} width={24} height={320} />
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function MockupPage() {
  const [phoneH, setPhoneH] = useState(700);
  const [route]  = useState("/");

  useEffect(() => {
    const prevBody = document.body.style.cssText;
    const prevHtml = document.documentElement.style.cssText;
    document.body.style.cssText = "margin:0;width:100vw;height:100dvh;overflow:hidden;background:transparent;position:static;transform:none;";
    document.documentElement.style.cssText = "display:block;height:100dvh;overflow:hidden;background:#0a0a12;";

    const compute = () => {
      const pad = 20; // 20px gap on every side
      const vh = window.innerHeight - pad * 2;
      const vw = window.innerWidth  - pad * 2;
      // Fit phone within the padded area (constrain by both dimensions)
      const hFromHeight = vh;
      const hFromWidth  = vw * NH / NW;
      setPhoneH(Math.floor(Math.min(hFromHeight, hFromWidth)));
    };
    compute();
    window.addEventListener("resize", compute);

    return () => {
      document.body.style.cssText = prevBody;
      document.documentElement.style.cssText = prevHtml;
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div style={{
      height: "100dvh",
      width: "100vw",
      background: [
        "radial-gradient(ellipse 70% 50% at 30% 0%,rgba(255,140,66,0.06) 0%,transparent 55%)",
        "radial-gradient(ellipse 60% 60% at 80% 100%,rgba(57,108,191,0.06) 0%,transparent 55%)",
        "#0a0a12",
      ].join(","),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <IPhone16Pro route={route} displayH={phoneH} />
    </div>
  );
}
