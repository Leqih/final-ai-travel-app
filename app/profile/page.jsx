"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Grainient = dynamic(() => import("@/components/Grainient"), { ssr: false });
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faCompass, faPlane, faCircleUser, faPlus, faEarthAmericas,
  faBell, faGear, faChevronRight, faPen, faXmark, faImages, faMap,
  faUpload, faCreditCard, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",     href: "/home"   },
  { icon: faCompass,    label: "Discover", href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips", href: "/trips"   },
  { icon: faCircleUser, label: "Profile",  href: "/profile" },
];

const CITY_FLAGS = {
  "Tokyo":"🇯🇵","Seoul":"🇰🇷","Bangkok":"🇹🇭","Bali":"🇮🇩","Paris":"🇫🇷",
  "New York":"🇺🇸","London":"🇬🇧","Rome":"🇮🇹","Istanbul":"🇹🇷","Dubai":"🇦🇪",
  "Sydney":"🇦🇺","Barcelona":"🇪🇸","Kyoto":"🇯🇵","Singapore":"🇸🇬","Lisbon":"🇵🇹",
};

const CITY_IMAGES = {
  "Tokyo":     "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop",
  "Seoul":     "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=500&fit=crop",
  "Bangkok":   "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=500&fit=crop",
  "Bali":      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=500&fit=crop",
  "Paris":     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop",
  "New York":  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=500&fit=crop",
  "London":    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop",
  "Rome":      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=500&fit=crop",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=500&fit=crop",
  "Lisbon":    "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=500&fit=crop",
};

const CITY_MAP_POS = {
  "London":    { x: 49.5, y: 18.1 }, "Paris":     { x: 50.6, y: 19.4 },
  "Barcelona": { x: 51.0, y: 24.4 }, "Lisbon":    { x: 47.5, y: 25.6 },
  "Rome":      { x: 53.6, y: 23.8 }, "Istanbul":  { x: 58.1, y: 24.4 },
  "Dubai":     { x: 65.3, y: 34.4 }, "New York":  { x: 29.4, y: 24.4 },
  "Bangkok":   { x: 78.1, y: 41.2 }, "Singapore": { x: 78.9, y: 49.7 },
  "Bali":      { x: 81.9, y: 55.0 }, "Seoul":     { x: 85.3, y: 26.9 },
  "Kyoto":     { x: 87.8, y: 28.2 }, "Tokyo":     { x: 88.9, y: 27.5 },
  "Sydney":    { x: 91.9, y: 71.4 },
};

const COUNTRY_MAP = {
  "Tokyo":"Japan","Seoul":"S. Korea","Bangkok":"Thailand","Bali":"Indonesia",
  "Paris":"France","New York":"USA","London":"UK","Rome":"Italy","Istanbul":"Turkey",
  "Dubai":"UAE","Sydney":"Australia","Barcelona":"Spain","Kyoto":"Japan",
  "Singapore":"Singapore","Lisbon":"Portugal",
};

const RANK_LEVELS = [
  { min: 0,  label: "New Wanderer", emoji: "🪨" },
  { min: 1,  label: "Explorer",     emoji: "🧭" },
  { min: 3,  label: "Adventurer",   emoji: "⛺" },
  { min: 6,  label: "Voyager",      emoji: "🚢" },
  { min: 10, label: "World Traveler",emoji: "🌍" },
];
function getRank(n) {
  return [...RANK_LEVELS].reverse().find(r => n >= r.min) || RANK_LEVELS[0];
}

const GEMS = [
  { city:"Tokyo",     emoji:"🗼", c1:"#ff6b6b", c2:"#c0392b", glow:"rgba(255,107,107,0.6)"  },
  { city:"Paris",     emoji:"🗼", c1:"#74b9ff", c2:"#0984e3", glow:"rgba(116,185,255,0.6)"  },
  { city:"New York",  emoji:"🗽", c1:"#a29bfe", c2:"#6c5ce7", glow:"rgba(108,92,231,0.6)"   },
  { city:"Seoul",     emoji:"🏯", c1:"#ffeaa7", c2:"#fdcb6e", glow:"rgba(253,203,110,0.6)"  },
  { city:"Bali",      emoji:"🌴", c1:"#55efc4", c2:"#00b894", glow:"rgba(0,184,148,0.6)"    },
  { city:"Dubai",     emoji:"🌆", c1:"#ffd32a", c2:"#e1b12c", glow:"rgba(255,211,42,0.6)"   },
  { city:"Sydney",    emoji:"🦘", c1:"#81ecec", c2:"#00cec9", glow:"rgba(0,206,201,0.6)"    },
  { city:"London",    emoji:"🎡", c1:"#fd79a8", c2:"#e84393", glow:"rgba(232,67,147,0.6)"   },
  { city:"Barcelona", emoji:"🌊", c1:"#ff7675", c2:"#d63031", glow:"rgba(214,48,49,0.6)"    },
  { city:"Singapore", emoji:"🦁", c1:"#fdcb6e", c2:"#e17055", glow:"rgba(225,112,85,0.6)"   },
];

const CITY_LATLNG = {
  "Tokyo":     { lat: 35.6762,  lng: 139.6503 },
  "Seoul":     { lat: 37.5665,  lng: 126.9780 },
  "Bangkok":   { lat: 13.7563,  lng: 100.5018 },
  "Bali":      { lat: -8.3405,  lng: 115.0920 },
  "Paris":     { lat: 48.8566,  lng: 2.3522   },
  "New York":  { lat: 40.7128,  lng: -74.0060 },
  "London":    { lat: 51.5074,  lng: -0.1278  },
  "Rome":      { lat: 41.9028,  lng: 12.4964  },
  "Istanbul":  { lat: 41.0082,  lng: 28.9784  },
  "Dubai":     { lat: 25.2048,  lng: 55.2708  },
  "Sydney":    { lat: -33.8688, lng: 151.2093 },
  "Barcelona": { lat: 41.3851,  lng: 2.1734   },
  "Kyoto":     { lat: 35.0116,  lng: 135.7681 },
  "Singapore": { lat: 1.3521,   lng: 103.8198 },
  "Lisbon":    { lat: 38.7223,  lng: -9.1393  },
};

// ── Budget dial constants ──────────────────────────────────────────────────
const MIN_BUDGET = 0;
const MAX_BUDGET = 3500;
const TICK_VALUE = 100;
const BUDGET_STEPS = [
  { label: "Budget" }, { label: "Mid-Range" },
  { label: "Luxury" },  { label: "Ultra-Luxury" },
];
function budgetToAngle(b) { return (Math.max(0, Math.min(1, b / MAX_BUDGET))) * 270 - 135; }
function angleToBudget(a) { return Math.round(Math.max(0, Math.min(1, (a + 135) / 270)) * MAX_BUDGET / TICK_VALUE) * TICK_VALUE; }
function getBudgetLabel(a) { return a <= 100 ? "Budget" : a <= 500 ? "Mid-Range" : a <= 1500 ? "Luxury" : "Ultra-Luxury"; }

function ProfileBudgetSheet({ open, onClose, onSelect }) {
  const [amount, setAmount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const dialRef = useRef(null);
  const inputRef = useRef(null);
  const dragging = useRef(false);

  const rotation = budgetToAngle(amount);
  const label = getBudgetLabel(amount);

  const getAngle = (e, rect) => {
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let angle = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    if (angle > 180) angle -= 360;
    return Math.max(-135, Math.min(135, angle));
  };

  const handleStart = (e) => {
    if (!dialRef.current || e.target.closest?.(".pl-dial-inner")) return;
    dragging.current = true;
    setAmount(angleToBudget(getAngle(e, dialRef.current.getBoundingClientRect())));
  };

  useEffect(() => {
    if (!open) return;
    const onMove = (e) => { if (!dragging.current || !dialRef.current) return; e.preventDefault(); setAmount(angleToBudget(getAngle(e, dialRef.current.getBoundingClientRect()))); };
    const onEnd = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onEnd); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="pl-sheet-overlay" onClick={onClose}>
      <div className="pl-sheet" onClick={e => e.stopPropagation()}>
        <div className="pl-sheet-handle" />
        <div className="pl-budget-header">
          <span className="pl-budget-icon-wrap">
            <FontAwesomeIcon icon={faCreditCard} style={{ width: 18, height: 14, color: "rgba(255,255,255,0.5)" }} />
          </span>
          <span className="pl-budget-title">Daily Budget</span>
        </div>
        <div className="pl-dial-wrap">
          <div className="pl-dial-outer" ref={dialRef} onMouseDown={handleStart} onTouchStart={handleStart} style={{ cursor: "grab", userSelect: "none", touchAction: "none" }}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`pl-dial-tick ${i % 5 === 0 ? "pl-dial-tick-major" : ""}`} style={{ transform: `rotate(${(i / 36) * 360}deg)` }} />
            ))}
            <div className="pl-dial-pointer" style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="pl-dial-pointer-dot" />
            </div>
            <div className="pl-dial-inner" onClick={e => { e.stopPropagation(); setEditing(true); setInputVal(String(amount)); setTimeout(() => inputRef.current?.focus(), 50); }} style={{ cursor: "pointer" }}>
              <span className="pl-dial-unit">USD</span>
              <span className="pl-dial-amount">
                <span className="pl-dial-dollar">$</span>
                {editing
                  ? <input ref={inputRef} className="pl-dial-input" type="number" min="0" max="3500" step="100" value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onBlur={() => { const v = Math.max(0, Math.min(MAX_BUDGET, Math.round(Number(inputVal) / TICK_VALUE) * TICK_VALUE)); setAmount(isNaN(v) ? 0 : v); setEditing(false); }}
                      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                      onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} />
                  : amount.toLocaleString()
                }
              </span>
              <div className="pl-dial-dots">
                {BUDGET_STEPS.map((b, i) => (
                  <span key={i} className={`pl-dial-dot ${b.label === label ? "pl-dial-dot-active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="pl-dial-range"><span>MIN $0</span><span>MAX $3,500</span></div>
        </div>
        <div className="pl-budget-segments">
          {BUDGET_STEPS.map(b => (
            <button key={b.label} className={`pl-budget-seg ${b.label === label ? "pl-budget-seg-active" : ""}`}
              onClick={() => { const map = { "Budget": 100, "Mid-Range": 500, "Luxury": 1500, "Ultra-Luxury": 3000 }; setAmount(map[b.label]); }}>
              {b.label}
            </button>
          ))}
        </div>
        <button className="pl-sheet-cta" onClick={() => { onSelect(`$${amount.toLocaleString()}/day`); onClose(); }}>
          Set Budget <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
        </button>
        <p className="pl-sheet-hint">Drag around the dial to adjust, or tap a preset below</p>
      </div>
    </div>
  );
}

const SNAZZY_STYLE = [
  {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
  {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
  {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
  {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
  {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
  {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"water","elementType":"all","stylers":[{"color":"#000347"},{"visibility":"on"}]},
];

let _gmapsPromise = null;
function loadGoogleMapsForProfile() {
  if (_gmapsPromise) return _gmapsPromise;
  if (typeof window !== "undefined" && window.google?.maps) return Promise.resolve(window.google.maps);
  _gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&language=en`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return _gmapsPromise;
}

function CollectionMapView({ visitedCities }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const geoCities = visitedCities.filter(c => CITY_LATLNG[c]);
    if (!geoCities.length) return;

    loadGoogleMapsForProfile().then(maps => {
      if (!mapInstanceRef.current) {
        const map = new maps.Map(mapRef.current, {
          zoom: 3,
          styles: SNAZZY_STYLE,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          backgroundColor: "#f2f2f2",
        });
        const bounds = new maps.LatLngBounds();
        geoCities.forEach(c => bounds.extend(CITY_LATLNG[c]));
        map.fitBounds(bounds, { top: 60, bottom: 80, left: 60, right: 60 });
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      overlaysRef.current.forEach(o => { try { o.setMap(null); } catch(_) {} });
      overlaysRef.current = [];

      geoCities.forEach(city => {
        const { lat, lng } = CITY_LATLNG[city];
        const img = CITY_IMAGES[city];
        const flag = CITY_FLAGS[city] || "✈️";

        const overlay = new maps.OverlayView();
        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.style.cssText = "position:absolute;cursor:pointer;transform:translate(-50%,-50%);";
          div.innerHTML = `
            <div style="position:relative">
              <div style="width:20px;height:20px;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:1.5px solid rgba(0,0,0,0.35);animation:fp-pulse 2.5s ease-out infinite;pointer-events:none"></div>
              <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2.5px solid rgba(0,0,0,0.85);box-shadow:0 4px 16px rgba(0,0,0,0.7),0 0 0 3px rgba(0,0,0,0.12);position:relative;z-index:1;transition:transform 0.15s">
                ${img
                  ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block">`
                  : `<div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:22px">${flag}</div>`
                }
              </div>
            </div>
          `;
          div.addEventListener("click", () => setSelectedCity(prev => prev === city ? null : city));
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };
        overlay.draw = function () {
          const pos = this.getProjection().fromLatLngToDivPixel(new maps.LatLng(lat, lng));
          if (pos && this._div) {
            this._div.style.left = pos.x + "px";
            this._div.style.top = pos.y + "px";
          }
        };
        overlay.onRemove = function () { this._div?.remove(); };
        overlay.setMap(map);
        overlaysRef.current.push(overlay);
      });
    }).catch(() => {});

    return () => {
      overlaysRef.current.forEach(o => { try { o.setMap(null); } catch(_) {} });
    };
  }, [visitedCities.join(",")]);

  return (
    <div style={{ position: "relative", height: "100%", background: "#f2f2f2" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Selected city card */}
      {selectedCity && (
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: "rgba(10,10,18,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 20, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.7)" }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: "1.5px solid rgba(255,140,66,0.3)" }}>
            {CITY_IMAGES[selectedCity]
              ? <img src={CITY_IMAGES[selectedCity]} alt={selectedCity} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{CITY_FLAGS[selectedCity]}</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>{CITY_FLAGS[selectedCity]} {selectedCity}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>{COUNTRY_MAP[selectedCity]}</div>
          </div>
          <button onClick={() => setSelectedCity(null)} style={{ all: "unset", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>✕</button>
        </div>
      )}

      {/* Empty state */}
      {visitedCities.filter(c => CITY_LATLNG[c]).length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 36 }}>🌍</span>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: 0, fontWeight: 500 }}>No places pinned yet</p>
        </div>
      )}
    </div>
  );
}

const glass = {
  background: "rgba(20,20,20,0.7)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

/* ── Bauhaus / geometric SVG icons for achievements (uniform scale, no stretch) ── */
const ACHIEVEMENT_ICONS = {
  wanderer: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 0.5) / 8) * Math.PI * 2 - Math.PI / 2;
        const x1 = 26 + Math.cos(a) * 19, y1 = 26 + Math.sin(a) * 19;
        const x2 = 26 + Math.cos(a2) * 9, y2 = 26 + Math.sin(a2) * 9;
        return <polygon key={i} points={`26,26 ${x1},${y1} ${x2},${y2}`} fill="white" fillOpacity="0.9" />;
      })}
    </svg>
  ),
  explorer: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M8 38 A18 18 0 0 1 44 38" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M13 38 A13 13 0 0 1 39 38" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M18 38 A8 8 0 0 1 34 38" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="26" cy="38" r="2.5" fill="white"/>
    </svg>
  ),
  adventurer: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <polygon points="26,7 47,45 5,45" fill="white" fillOpacity="0.9"/>
      <polygon points="26,19 37,41 15,41" fill="rgba(0,0,0,0.18)"/>
    </svg>
  ),
  voyager: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="26" y="5" width="29" height="29" rx="3" transform="rotate(45 26 26)" stroke="white" strokeWidth="3"/>
      <rect x="26" y="13" width="18" height="18" rx="2" transform="rotate(45 26 26)" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  worldtrav: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <circle cx="26" cy="26" r="18" stroke="white" strokeWidth="2.5"/>
      <line x1="26" y1="8" x2="26" y2="44" stroke="white" strokeWidth="2.5"/>
      <line x1="8" y1="26" x2="44" y2="26" stroke="white" strokeWidth="2.5"/>
      <ellipse cx="26" cy="26" rx="10" ry="18" stroke="white" strokeWidth="2.5"/>
      <line x1="9" y1="18" x2="43" y2="18" stroke="white" strokeWidth="2" strokeOpacity="0.6"/>
      <line x1="9" y1="34" x2="43" y2="34" stroke="white" strokeWidth="2" strokeOpacity="0.6"/>
    </svg>
  ),
  cityhop: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <polygon points="30,5 15,28 25,28 22,47 37,24 27,24" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  globetrott: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M7 16 Q17 4 27 16 Q37 28 47 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M7 28 Q17 16 27 28 Q37 40 47 28" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M7 40 Q17 28 27 40 Q37 52 47 40" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  passport: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <polygon points="26,5 31.5,20 48,20 35,29.5 40,46 26,36.5 12,46 17,29.5 4,20 20.5,20" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  weekaway: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M26 45 C26 45 7 33 7 18 C7 9 15 5 26 9 C37 5 45 9 45 18 C45 33 26 45 26 45Z" fill="white" fillOpacity="0.9"/>
      <path d="M26 45 L26 15" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 30 Q33 23 40 22" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  nomad: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M33 9 A18 18 0 1 0 33 43 A12 12 0 1 1 33 9Z" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
};

const ALL_TAGS = [
  { id: "wanderer",   label: "New Wanderer",   hint: "Create your first trip",     ownedPct: 94, glowRaw: "160,160,200", check: s => s.trips >= 0,     progress: s => 1 },
  { id: "explorer",  label: "Explorer",        hint: "Complete 1 trip",            ownedPct: 78, glowRaw: "50,210,90",   check: s => s.trips >= 1,     progress: s => Math.min(1, s.trips / 1) },
  { id: "adventurer",label: "Adventurer",      hint: "Complete 3 trips",           ownedPct: 61, glowRaw: "255,140,30",  check: s => s.trips >= 3,     progress: s => Math.min(1, s.trips / 3) },
  { id: "voyager",   label: "Voyager",         hint: "Complete 6 trips",           ownedPct: 44, glowRaw: "80,180,255",  check: s => s.trips >= 6,     progress: s => Math.min(1, s.trips / 6) },
  { id: "worldtrav", label: "World Traveler",  hint: "Complete 10 trips",          ownedPct: 22, glowRaw: "180,80,240",  check: s => s.trips >= 10,    progress: s => Math.min(1, s.trips / 10) },
  { id: "cityhop",   label: "City Hopper",     hint: "Visit 3 different cities",   ownedPct: 55, glowRaw: "255,220,0",   check: s => s.cities >= 3,    progress: s => Math.min(1, s.cities / 3) },
  { id: "globetrott",label: "Globe Trotter",   hint: "Visit 5 different cities",   ownedPct: 33, glowRaw: "80,200,255",  check: s => s.cities >= 5,    progress: s => Math.min(1, s.cities / 5) },
  { id: "passport",  label: "Passport Hunter", hint: "Visit 3 different countries",ownedPct: 38, glowRaw: "255,200,50",  check: s => s.countries >= 3, progress: s => Math.min(1, s.countries / 3) },
  { id: "weekaway",  label: "Week Away",       hint: "Travel for 7+ days total",   ownedPct: 58, glowRaw: "40,210,100",  check: s => s.days >= 7,      progress: s => Math.min(1, s.days / 7) },
  { id: "nomad",     label: "Digital Nomad",   hint: "Travel 30+ days total",      ownedPct: 14, glowRaw: "160,100,255", check: s => s.days >= 30,     progress: s => Math.min(1, s.days / 30) },
];

function TagDetailPanel({ tag, stats, isActive, onSetActive, onClose }) {
  const panelRef = useRef(null);
  const isUnlocked = tag.check(stats);
  const pct = tag.progress(stats);
  const g = isUnlocked ? "255,140,66" : tag.glowRaw;

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, { y: "100%" }, { y: "0%", duration: 0.35, ease: "power3.out" });
    }
  }, []);

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, { y: "100%", duration: 0.24, ease: "power2.in", onComplete: onClose });
    } else onClose();
  };

  return (
    <div ref={panelRef} style={{ position: "fixed", inset: 0, zIndex: 10100, background: "#06060e", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Ambient background radial */}
      {isUnlocked && (
        <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, rgba(${g},0.22) 0%, transparent 70%)`, pointerEvents: "none" }} />
      )}

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0", position: "relative", zIndex: 1 }}>
        <div onClick={handleClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1 }}>✕</span>
        </div>
        {/* Owned-by pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,200,50,0.1)", borderRadius: 20, padding: "5px 11px" }}>
          <span style={{ fontSize: 12 }}>🏅</span>
          <span style={{ color: "rgba(255,210,80,1)", fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>Owned by {tag.ownedPct}%</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", padding: "20px 28px 0", position: "relative", zIndex: 1 }}>
        <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1.1, letterSpacing: 2 }}>{tag.label}</div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontWeight: 400, marginTop: 8, letterSpacing: 0.1, lineHeight: 1.5 }}>{tag.hint}.</div>
      </div>

      {/* Gem — takes all remaining vertical space */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {isUnlocked && (
          <>
            <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, rgba(${g},0.28) 0%, transparent 70%)`, filter: "blur(32px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "6%", width: 160, height: 36, borderRadius: "50%", background: `rgba(${g},0.22)`, filter: "blur(20px)", pointerEvents: "none" }} />
          </>
        )}
        <div style={{
          width: 140, height: 140, position: "relative",
          filter: isUnlocked
            ? `drop-shadow(0 0 40px rgba(${g},0.9)) drop-shadow(0 12px 48px rgba(${g},0.55))`
            : "grayscale(1) brightness(0.28)",
          transform: isUnlocked ? "translateY(-12px)" : "none",
        }}>{ACHIEVEMENT_ICONS[tag.id]}</div>
      </div>

      {/* Bottom */}
      <div style={{ padding: "0 24px 36px", position: "relative", zIndex: 1 }}>
        {!isUnlocked ? (
          <>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
              Unlock this tag when you {tag.hint.toLowerCase()}.
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct * 100}%`, borderRadius: 2, background: `rgba(${g},0.8)`, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>PROGRESS</span>
                <span style={{ color: `rgba(${g},0.8)`, fontSize: 10, fontWeight: 700 }}>{Math.round(pct * 100)}%</span>
              </div>
            </div>
            <button onClick={handleClose} style={{ all: "unset", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", boxSizing: "border-box", padding: "15px 0", borderRadius: 20, cursor: "pointer", background: "rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: 15 }}>🔒</span>
              <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 15, fontWeight: 700 }}>Locked</span>
            </button>
          </>
        ) : (
          <>
            {!isActive && (
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", marginBottom: 18 }}>
                Tap below to display this tag on your profile.
              </div>
            )}
            <button onClick={() => { onSetActive(tag.id); handleClose(); }}
              style={{ all: "unset", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", boxSizing: "border-box", padding: "15px 0", borderRadius: 20, cursor: "pointer", background: isActive ? "rgba(255,255,255,0.09)" : "#ff8c42", boxShadow: isActive ? "none" : "0 6px 20px rgba(255,140,66,0.4)", transition: "all 0.18s" }}>
              <span style={{ color: isActive ? "rgba(255,255,255,0.4)" : "#fff", fontSize: 15, fontWeight: 700 }}>
                {isActive ? "✓  Currently Active" : "Set as Active Tag"}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TagLibrarySheet({ open, onClose, stats, displayTagId, onSelectTag }) {
  const [detail, setDetail] = useState(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open) { setDetail(null); return; }
    if (sheetRef.current) {
      gsap.fromTo(sheetRef.current, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.38, ease: "power3.out" });
    }
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    if (sheetRef.current) {
      gsap.to(sheetRef.current, { y: "100%", opacity: 0, duration: 0.25, ease: "power2.in", onComplete: onClose });
    } else onClose();
  };

  const unlockedCount = ALL_TAGS.filter(t => t.check(stats)).length;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} onClick={handleClose} />

        <div ref={sheetRef} style={{ position: "relative", background: "#08080f", borderRadius: "28px 28px 0 0", paddingBottom: "env(safe-area-inset-bottom,20px)", maxHeight: "84vh", display: "flex", flexDirection: "column" }}>

          {/* Handle */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Header */}
          <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#fff", fontSize: 21, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1 }}>Tags</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                <div style={{ height: 2, width: 56, borderRadius: 1, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(unlockedCount / ALL_TAGS.length) * 100}%`, background: "rgba(255,255,255,0.45)", borderRadius: 1 }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500 }}>{unlockedCount} / {ALL_TAGS.length} collected</span>
              </div>
            </div>
            <button onClick={handleClose} style={{ all: "unset", width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>✕</button>
          </div>

          {/* Grid */}
          <div style={{ overflowY: "auto", scrollbarWidth: "none", flex: 1, padding: "8px 8px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
              {ALL_TAGS.map(tag => {
                const isUnlocked = tag.check(stats);
                const isActive = displayTagId === tag.id;
                const pct = tag.progress(stats);
                const litColor = "255,140,66";
                return (
                  <button key={tag.id} onClick={() => setDetail(tag)}
                    style={{ all: "unset", cursor: "pointer", padding: "22px 6px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, borderRadius: 18, background: isActive ? "rgba(255,255,255,0.055)" : "transparent", transition: "background 0.15s", position: "relative" }}>

                    {/* Active indicator */}
                    {isActive && (
                      <div style={{ position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: "50%", background: "#ff8c42", boxShadow: "0 0 6px rgba(255,140,66,0.8)" }} />
                    )}

                    {/* Gem with glow halo */}
                    <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      {isUnlocked && (
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, rgba(${litColor},0.28) 0%, transparent 70%)`, filter: "blur(6px)", pointerEvents: "none" }} />
                      )}
                      <div style={{
                        width: 40, height: 40, position: "relative",
                        filter: isUnlocked
                          ? `drop-shadow(0 2px 10px rgba(${litColor},0.9))`
                          : "grayscale(1) brightness(0.25)",
                        transform: isUnlocked ? "translateY(-2px)" : "none",
                        transition: "filter 0.2s",
                      }}>{ACHIEVEMENT_ICONS[tag.id]}</div>
                    </div>

                    {/* Progress bar under locked gems */}
                    <div style={{ width: 32, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.06)", marginBottom: 8, overflow: "hidden" }}>
                      {!isUnlocked && pct > 0 && (
                        <div style={{ height: "100%", width: `${pct * 100}%`, background: `rgba(${g},0.7)`, borderRadius: 1 }} />
                      )}
                      {isUnlocked && (
                        <div style={{ height: "100%", width: "100%", background: `rgba(${g},0.6)`, borderRadius: 1 }} />
                      )}
                    </div>

                    {/* Label */}
                    <div style={{ color: isUnlocked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 700, letterSpacing: -0.1, textAlign: "center", lineHeight: 1.3 }}>{tag.label}</div>
                    <div style={{ color: isActive ? "#ff8c42" : isUnlocked ? `rgba(${g},0.7)` : "rgba(255,255,255,0.14)", fontSize: 10, fontWeight: 500, marginTop: 3, textAlign: "center" }}>
                      {isActive ? "Active" : isUnlocked ? "Earned" : "Locked"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {detail && (
        <TagDetailPanel
          tag={detail}
          stats={stats}
          isActive={displayTagId === detail.id}
          onSetActive={id => { onSelectTag(id); handleClose(); }}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}

export default function ProfilePage() {
  const pathname = usePathname();
  const shellRef = useRef(null);
  const [trips, setTrips] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("opal_trips") || "[]"); } catch (_) { return []; }
  });

  useEffect(() => {
    const sync = () => {
      try { setTrips(JSON.parse(localStorage.getItem("opal_trips") || "[]")); } catch (_) {}
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedMemoji, setSelectedMemoji] = useState("10");
  const [memojiPickerOpen, setMemojiPickerOpen] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const [selectedTrip,   setSelectedTrip]   = useState(null);
  const [collectionMode, setCollectionMode] = useState("photos");
  const [tripPhotos,     setTripPhotos]     = useState([]);
  const profFileRef = useRef(null);

  // Load photos whenever a trip is selected
  useEffect(() => {
    if (!selectedTrip) { setTripPhotos([]); return; }
    try {
      const colls = JSON.parse(localStorage.getItem(`navora_coll_${selectedTrip.id}`) || "[]");
      const all = colls.flatMap(c => (c.photos || []).map(src => ({ src, collName: c.name, collEmoji: c.emoji })));
      setTripPhotos(all);
    } catch(_) { setTripPhotos([]); }
  }, [selectedTrip]);

  function openTripCollection(trip) {
    setSelectedTrip(trip);
    setCollectionMode("photos");
  }

  function handleProfPhoto(e) {
    const file = e.target.files?.[0];
    if (!file || !selectedTrip) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      try {
        const colls = JSON.parse(localStorage.getItem(`navora_coll_${selectedTrip.id}`) || "[]");
        let profColl = colls.find(c => c.name === "Photos");
        if (!profColl) {
          profColl = { id: Date.now(), emoji: "📷", name: "Photos", photos: [] };
          colls.unshift(profColl);
        }
        profColl.photos = [dataUrl, ...(profColl.photos || [])];
        localStorage.setItem(`navora_coll_${selectedTrip.id}`, JSON.stringify(colls));
        setTripPhotos(prev => [{ src: dataUrl, collName: "Photos", collEmoji: "📷" }, ...prev]);
      } catch(_) {}
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  const [budgetSheetOpen, setBudgetSheetOpen] = useState(false);
  const [profileBudget, setProfileBudget] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("opal_daily_budget") || null;
  });
  const [displayTagId, setDisplayTagId] = useState(null);
  const [tagDetail, setTagDetail] = useState(null);

  useLayoutEffect(() => {
    if (!shellRef.current) return;
    gsap.set(shellRef.current.querySelectorAll(".fp-a"), { opacity: 0, y: 24, filter: "blur(5px)" });
  }, []);

  useEffect(() => {
    if (!shellRef.current) return;
    gsap.to(shellRef.current.querySelectorAll(".fp-a"),
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out", stagger: 0.07 }
    );
  }, []);

  const visitedCities = [...new Set(trips.map(t => t.destination).filter(Boolean))];
  const visitedCountries = [...new Set(visitedCities.map(c => COUNTRY_MAP[c]).filter(Boolean))];
  const totalDays = trips.reduce((s, t) => s + (parseInt(t.duration) || 0), 0);

  return (
    <div className="hp-shell" suppressHydrationWarning style={{ fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif` }}>
      <div ref={shellRef} className="hp-scroll" style={{ paddingBottom: 110 }}>

      {/* ══ Header — dot-grid bg matches homepage ══ */}
      <div className="fp-a hp-header" style={{ paddingBottom: 24 }}>
        {/* Topbar: avatar left, edit right */}
        <div className="hp-topbar">
          <div className="hp-topbar-left">
            <div className="hp-hey-row">
              <span className="hp-wave">✈️</span>
              <span className="hp-hey">My Profile</span>
            </div>
            <div className="hp-greeting">Traveler</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>Exploring the world ✈️</div>
            {(() => {
              const stats = { trips: trips.length, cities: visitedCities.length, countries: visitedCountries.length, days: totalDays };
              const activeTag = displayTagId ? ALL_TAGS.find(t => t.id === displayTagId) : null;
              const rank = getRank(trips.length);
              const shownTag = activeTag || ALL_TAGS.find(t => t.label === rank.label) || ALL_TAGS[0];
              return (
                <button onClick={() => setTagDetail(shownTag)} style={{ all: "unset", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8, background: "#ff8c42", borderRadius: 16, padding: "3px 10px", cursor: "pointer", boxShadow: "0 2px 8px rgba(255,140,66,0.35)" }}>
                  <span style={{ color: "#111", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>{shownTag.emoji} {shownTag.label}</span>
                </button>
              );
            })()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <button onClick={() => setMemojiPickerOpen(true)} style={{ width: 64, height: 64, borderRadius: "50%", background: selectedMemoji.startsWith("e:") ? "#FFD93D" : "#fff", flexShrink: 0, overflow: "hidden", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
              {selectedMemoji.startsWith("e:")
                ? selectedMemoji.slice(2)
                : <img src={`/memojis/${selectedMemoji}.png`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              }
            </button>
            <button style={{ ...glass, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
              <FontAwesomeIcon icon={faPen} style={{ width: 11, height: 11, color: "rgba(255,255,255,0.4)" }} />
            </button>
          </div>
        </div>

        {/* Stats — inside the header card */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, padding: "0 16px" }}>
          {[
            { v: trips.length,         l: "Trips"  },
            { v: visitedCities.length, l: "Cities" },
            { v: totalDays,            l: "Days"   },
          ].map(s => (
            <div key={s.l} style={{ ...glass, borderRadius: 20, padding: "14px 0", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#ff8c42", letterSpacing: -0.5, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Achievements section ══ */}
      {(() => {
        const stats = { trips: trips.length, cities: visitedCities.length, countries: visitedCountries.length, days: totalDays };
        const earnedCount = ALL_TAGS.filter(t => t.check(stats)).length;
        const activeId = displayTagId || ALL_TAGS.find(t => t.label === getRank(trips.length).label)?.id || "wanderer";
        return (
          <>
            <div className="fp-a hp-section-hd">
              <div>
                <p className="hp-section-cat">Milestones</p>
                <p className="hp-section-title">Achievements</p>
                <p className="hp-section-sub">Tags you've collected</p>
              </div>
              <span className="hp-section-link">{earnedCount} / {ALL_TAGS.length}</span>
            </div>
            <div className="fp-a" style={{ padding: "0 16px" }}>
              <div style={{ overflowX: "auto", margin: "0 -16px", padding: "0 16px 4px", scrollbarWidth: "none" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {ALL_TAGS.map(tag => {
                    const isUnlocked = tag.check(stats);
                    const isActive = activeId === tag.id;
                    const litColor = "255,140,66";
                    return (
                      <button key={tag.id} onClick={() => setTagDetail(tag)}
                        style={{ all: "unset", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 56, cursor: "pointer" }}>
                        <div style={{ position: "relative", width: 52, height: 52 }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: 16,
                            background: isUnlocked ? `rgba(${litColor},0.13)` : "rgba(255,255,255,0.04)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: 10,
                            filter: isUnlocked ? `drop-shadow(0 2px 8px rgba(${litColor},0.7))` : "grayscale(1) brightness(0.2)",
                            transition: "all 0.2s",
                          }}>{ACHIEVEMENT_ICONS[tag.id]}</div>
                          {isActive && (
                            <div style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#ff8c42", boxShadow: "0 0 5px rgba(255,140,66,0.9)" }} />
                          )}
                        </div>
                        <span style={{
                          color: isUnlocked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                          fontSize: 10, fontWeight: 500, textAlign: "center",
                          width: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ══ World Map section ══ */}
      <div className="fp-a hp-section-hd">
        <div>
          <p className="hp-section-cat">World Map</p>
          <p className="hp-section-title">My Journey</p>
          <p className="hp-section-sub">{visitedCountries.length} {visitedCountries.length === 1 ? "country" : "countries"} visited</p>
        </div>
        <span className="hp-section-link">{visitedCities.length} pins</span>
      </div>
      <div className="fp-a" style={{ padding: "0 16px" }}>
        <div style={{ ...glass, borderRadius: 22, overflow: "hidden", position: "relative" }}>
          <img src="/world-dotted.svg" alt="World map" style={{ display: "block", width: "100%", height: "auto", opacity: 0.5 }} />
          {visitedCities.length > 1 && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} preserveAspectRatio="none">
              {visitedCities.slice(0, -1).map((city, i) => {
                const p1 = CITY_MAP_POS[city], p2 = CITY_MAP_POS[visitedCities[i + 1]];
                if (!p1 || !p2) return null;
                return <line key={city} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="rgba(255,140,66,0.3)" strokeWidth="1" strokeDasharray="3,5" />;
              })}
            </svg>
          )}
          {visitedCities.map(city => {
            const pos = CITY_MAP_POS[city];
            if (!pos) return null;
            const isActive = activeCity === city;
            return (
              <button key={city} onClick={() => setActiveCity(isActive ? null : city)} style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: isActive ? 5 : 3 }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(255,140,66,0.45)", animation: "fp-pulse 2.5s ease-out infinite" }} />
                <div style={{ width: isActive ? 10 : 7, height: isActive ? 10 : 7, borderRadius: "50%", position: "relative", zIndex: 1, background: "#ff8c42", boxShadow: isActive ? "0 0 0 2px rgba(255,140,66,0.3), 0 0 12px rgba(255,140,66,0.7)" : "0 0 6px rgba(255,140,66,0.5)", transition: "all 0.18s" }} />
                {isActive && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,20,0.95)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "6px 12px", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{CITY_FLAGS[city] || "📍"}</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{city}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{COUNTRY_MAP[city]}</span>
                  </div>
                )}
              </button>
            );
          })}
          {visitedCities.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>🌍</span>
              <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 13, margin: 0, fontWeight: 400 }}>Add trips to mark your footprint</p>
            </div>
          )}
        </div>
      </div>


      {/* ══ Collection section — one card per trip ══ */}
      {mounted && trips.length > 0 && (
        <>
          <div className="fp-a hp-section-hd">
            <div>
              <p className="hp-section-cat">Photos</p>
              <p className="hp-section-title">Collection</p>
              <p className="hp-section-sub">Memories from your trips</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{trips.length} {trips.length === 1 ? "trip" : "trips"}</span>
          </div>
          <div className="fp-a" style={{ padding: "0 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {trips.map(trip => {
                const city = trip.destination;
                const img = CITY_IMAGES[city];
                const flag = CITY_FLAGS[city] || "✈️";
                return (
                  <button key={trip.id} className="fp-col-card" onClick={() => openTripCollection(trip)}
                    style={{ position: "relative", aspectRatio: "2/3", display: "block", cursor: "pointer", width: "100%" }}>
                    {img
                      ? <img src={img} alt={city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{flag}</div>
                    }
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                      <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {trip.title || city}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 1 }}>{city}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Hidden file input for profile photo adding */}
          <input ref={profFileRef} type="file" accept="image/*" capture="environment"
            style={{ display: "none" }} onChange={handleProfPhoto} />
        </>
      )}

      {/* ── Account ── */}
      <div className="fp-a" style={{ margin: "0 16px 24px" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", margin: "0 0 10px" }}>Account</p>
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden" }}>
          {[
            { icon: faPlane,  label: "Saved Trips",    sub: trips.length > 0 ? `${trips.length} ${trips.length === 1 ? "trip" : "trips"} saved` : "No trips saved yet", href: "/trips" },
            { icon: faBell,   label: "Trip Reminders", sub: "Get notified before your trips" },
            { icon: faGear,   label: "Settings",       sub: "Preferences & privacy", last: true },
          ].map((item) => (
            item.href ? (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 16, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FontAwesomeIcon icon={item.icon} style={{ width: 14, height: 14, color: "rgba(255,255,255,0.5)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{item.label}</div>
                  <div style={{ color: trips.length > 0 ? "rgba(255,140,66,0.8)" : "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>{item.sub}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} style={{ width: 9, height: 9, color: "rgba(255,255,255,0.28)", flexShrink: 0 }} />
              </Link>
            ) : (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderBottom: item.last ? "none" : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 16, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FontAwesomeIcon icon={item.icon} style={{ width: 14, height: 14, color: "rgba(255,255,255,0.5)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{item.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>{item.sub}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} style={{ width: 9, height: 9, color: "rgba(255,255,255,0.28)", flexShrink: 0 }} />
              </div>
            )
          ))}
        </div>
      </div>

        <style>{`
          @keyframes fp-pulse {
            0%   { opacity: 0.8; transform: translate(-50%,-50%) scale(0.6); }
            70%  { opacity: 0;   transform: translate(-50%,-50%) scale(2.2); }
            100% { opacity: 0;   transform: translate(-50%,-50%) scale(2.2); }
          }
          .fp-scroll-hide { scrollbar-width: none; }
          .fp-scroll-hide::-webkit-scrollbar { display: none; }
          .hp-shell button.fp-col-card {
            background: none !important;
            border: none !important;
            padding: 0 !important;
            border-radius: 20px !important;
            overflow: hidden !important;
          }
          .hp-shell button.fp-add-tile {
            background: rgba(255,255,255,0.07) !important;
            border: none !important;
            border-radius: 20px !important;
          }
          .hp-shell button.fp-modal-btn-pill {
            background: rgba(255,255,255,0.08) !important;
            border: none !important;
            border-radius: 999px !important;
          }
          .hp-shell button.fp-modal-btn-close {
            background: rgba(255,255,255,0.06) !important;
            border: none !important;
            border-radius: 50% !important;
          }
          .hp-shell button.fp-back-pill {
            background: rgba(255,255,255,0.06) !important;
            border: none !important;
            border-radius: 50% !important;
            padding: 0 !important;
          }
          .hp-shell button.fp-tab-active {
            background: rgba(255,255,255,0.1) !important;
            border-radius: 13px !important;
            box-shadow: 0 1px 6px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07) !important;
          }
          .fp-collection-sheet {
            align-items: flex-start !important;
            height: 88dvh !important;
            max-height: 88dvh !important;
            padding: 0 20px 0 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .fp-collection-body {
            flex: 1;
            overflow-y: auto;
            width: 100%;
            padding: 14px 0 40px;
          }
          .fp-collection-map {
            flex: 1;
            width: calc(100% + 40px);
            margin: 0 -20px;
            min-height: 0;
            overflow: hidden;
          }
        `}</style>
      </div>

      <ProfileBudgetSheet
        open={budgetSheetOpen}
        onClose={() => setBudgetSheetOpen(false)}
        onSelect={v => { setProfileBudget(v); localStorage.setItem("opal_daily_budget", v); }}
      />

      {memojiPickerOpen && (() => {
        const EMOJIS = ["😀","😂","🥹","😍","🤩","😎","🥸","🤓","😏","😌","🥳","🤗","😇","🫡","🤔","😴","🥰","😋","🤪","😜","🫠","🤭","😤","🫨","🤯","🥺","😭","😱","🤠","👻","💀","🤖","👾","🐶","🐱","🐼","🐨","🦊","🐯","🦁","🐸","🦋","🐙","🦄","🐲","🌈","🌸","⭐","🔥","💎","🎸","🎮","🚀","🍕","🍣","🧋"];
        const EMOJI_BG = ["#FFD93D","#FF6B6B","#4ECDC4","#A8E6CF","#FFB347","#C3B1E1","#87CEEB","#F0E68C","#98FB98","#DDA0DD","#F08080","#B0E0E6","#FFDAB9","#E0BBE4","#957DAD","#D4A5A5","#9EC1A3","#CFE2F3","#F9C784","#FC8EAC","#A8DADC","#F7B2BD","#B5EAD7","#C7CEEA","#E2F0CB","#FFDFD3","#D4E6F1","#F9EBEA","#E8F8F5","#FEF9E7","#F4ECF7","#EBF5FB","#E9F7EF","#FDFEFE","#F8F9FA","#EEF2FF","#FFF0F3","#F0FDF4","#FFFBEB","#FFF7ED","#FDF4FF","#ECFDF5","#EFF6FF","#FEF2F2","#F0F9FF","#FAFAF9","#F9F9F9","#FDFDEA","#F0FFF4","#FFFDE7","#FFF8F1","#FBF5F5","#F5F0FF","#EDFCF2","#F6FFF8"];
        const selectAvatar = id => { setSelectedMemoji(id); localStorage.setItem("opal_memoji", id); setMemojiPickerOpen(false); };
        const MemojiBtn = ({ id }) => (
          <button onClick={() => selectAvatar(id)} style={{
            padding: 0, border: "none", cursor: "pointer", borderRadius: "50%",
            background: id === selectedMemoji ? "rgba(255,255,255,0.15)" : "transparent",
            outline: id === selectedMemoji ? "2px solid rgba(255,255,255,0.7)" : "none",
            outlineOffset: 2, width: "100%", aspectRatio: "1/1", overflow: "hidden",
          }}>
            <img src={`/memojis/${id}.png`} alt="memoji" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </button>
        );
        const EmojiBtn = ({ emoji, idx }) => {
          const id = `e:${emoji}`;
          return (
            <button onClick={() => selectAvatar(id)} style={{
              padding: 0, border: "none", cursor: "pointer", borderRadius: "50%",
              outline: id === selectedMemoji ? "2px solid rgba(255,255,255,0.7)" : "none",
              outlineOffset: 2, width: "100%", aspectRatio: "1/1", overflow: "hidden",
              background: EMOJI_BG[idx % EMOJI_BG.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "min(7vw, 32px)",
            }}>
              {emoji}
            </button>
          );
        };
        const previewSrc = selectedMemoji.startsWith("e:") ? null : `/memojis/${selectedMemoji}.png`;
        const previewEmoji = selectedMemoji.startsWith("e:") ? selectedMemoji.slice(2) : null;
        return (
          <div className="pl-sheet-overlay" onClick={() => setMemojiPickerOpen(false)}>
            <div className="pl-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "80vh" }}>
              <div className="pl-sheet-handle" />
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 0 16px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: previewEmoji ? "#FFD93D" : "#fff", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {previewEmoji ? previewEmoji : <img src={previewSrc} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>Choose Avatar</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "2px 0 0" }}>Tap to select</p>
                </div>
              </div>
              <div style={{ overflowY: "auto", maxHeight: "calc(80vh - 110px)", paddingBottom: 8 }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px" }}>Memoji</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
                  {Array.from({ length: 58 }, (_, i) => String(i + 1)).map(id => <MemojiBtn key={id} id={id} />)}
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px" }}>Emoji</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                  {EMOJIS.map((em, i) => <EmojiBtn key={em} emoji={em} idx={i} />)}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {tagDetail && (
        <TagDetailPanel
          tag={tagDetail}
          stats={{ trips: trips.length, cities: visitedCities.length, countries: visitedCountries.length, days: totalDays }}
          isActive={displayTagId === tagDetail.id || (!displayTagId && tagDetail.id === (ALL_TAGS.find(t => t.label === getRank(trips.length).label)?.id || "wanderer"))}
          onSetActive={id => setDisplayTagId(id)}
          onClose={() => setTagDetail(null)}
        />
      )}

      {/* ── Trip Collection Sheet ── */}
      {mounted && selectedTrip && (
        <div className="pl-sheet-overlay" style={{ zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} onClick={() => setSelectedTrip(null)}>
          <div className="pl-sheet fp-collection-sheet" onClick={e => e.stopPropagation()}>

            <div className="pl-sheet-handle" />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", padding: "14px 0 0", gap: 12, width: "100%" }}>
              {/* Destination thumbnail */}
              {CITY_IMAGES[selectedTrip.destination] && (
                <div style={{ width: 44, height: 44, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                  <img src={CITY_IMAGES[selectedTrip.destination]} alt={selectedTrip.destination}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {CITY_FLAGS[selectedTrip.destination] || "✈️"} {selectedTrip.destination}
                </p>
                <h2 style={{ margin: "2px 0 0", color: "#fff", fontSize: 19, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedTrip.title || selectedTrip.destination}
                </h2>
              </div>
              <button className="fp-modal-btn-close" onClick={() => setSelectedTrip(null)}
                style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <FontAwesomeIcon icon={faXmark} style={{ width: 13, height: 13, color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>

            {/* Segmented tab control */}
            <div style={{ padding: "12px 0 0", width: "100%" }}>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 3, gap: 2 }}>
                {[{ id: "photos", icon: faImages, label: "Photos" }, { id: "map", icon: faMap, label: "Map" }].map(tab => (
                  <button key={tab.id} onClick={() => setCollectionMode(tab.id)}
                    className={collectionMode === tab.id ? "fp-tab-active" : ""}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "9px 0", cursor: "pointer",
                      color: collectionMode === tab.id ? "#fff" : "rgba(255,255,255,0.3)",
                      fontSize: 13, fontWeight: collectionMode === tab.id ? 600 : 400,
                      letterSpacing: collectionMode === tab.id ? -0.1 : 0, transition: "all 0.18s",
                    }}>
                    <FontAwesomeIcon icon={tab.icon} style={{ width: 12, height: 12 }} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "12px -20px 0", width: "calc(100% + 40px)" }} />

            {/* Photos mode */}
            {collectionMode === "photos" && (
              <div className="fp-scroll-hide fp-collection-body">
                {tripPhotos.length === 0 ? (
                  /* Empty state */
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 0 24px", gap: 10 }}>
                    <div style={{ width: 68, height: 68, borderRadius: 20, background: "rgba(20,20,20,0.7)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                      🖼️
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>No photos yet</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>
                      Add photos from this trip to build your memory collection
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    {tripPhotos.map((photo, i) => (
                      <div key={i} style={{ borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "1/1" }}>
                        <img src={photo.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        {/* Collection label pill */}
                        <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "3px 7px", display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 9 }}>{photo.collEmoji}</span>
                          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, fontWeight: 600 }}>{photo.collName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add Photo CTA */}
                <button onClick={() => profFileRef.current?.click()}
                  style={{ width: "100%", padding: "13px 0", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: "#ff8c42", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(255,140,66,0.28)", fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif`, marginTop: tripPhotos.length > 0 ? 4 : 0 }}>
                  <span style={{ fontSize: 16 }}>📷</span> Add Photo
                </button>
              </div>
            )}

            {/* Map mode — shows destination pin */}
            {collectionMode === "map" && (
              <div className="fp-collection-map">
                <CollectionMapView visitedCities={selectedTrip.destination ? [selectedTrip.destination] : []} />
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="hp-nav">
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) =>
            item.center ? (
              <div key="center" className="hp-nav-center-wrap">
                <Link href="/planner" className="hp-nav-center-btn" style={{ overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%", background: "linear-gradient(135deg, #F97316 0%, #396cbf 60%, #B497CF 100%)" }} />
                  <FontAwesomeIcon icon={faPlus} style={{ width: 18, height: 18, color: "white", position: "relative", zIndex: 1 }} />
                </Link>
              </div>
            ) : (
              <Link key={i} href={item.href} className={`hp-nav-item${pathname === item.href ? " hp-nav-active" : ""}`}>
                <FontAwesomeIcon icon={item.icon} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

    </div>
  );
}
