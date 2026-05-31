"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faPlane, faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
const Grainient = dynamic(() => import("./Grainient"), { ssr: false });

const CITY_FLAGS = { Tokyo:"🇯🇵", Seoul:"🇰🇷", Bangkok:"🇹🇭", Bali:"🇮🇩", Paris:"🇫🇷", "New York":"🇺🇸", London:"🇬🇧", Rome:"🇮🇹", Istanbul:"🇹🇷", Dubai:"🇦🇪", Sydney:"🇦🇺", Barcelona:"🇪🇸", Kyoto:"🇯🇵", Singapore:"🇸🇬", Lisbon:"🇵🇹", Osaka:"🇯🇵" };
const CITY_IMAGES = { Tokyo:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop", Seoul:"https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop", Paris:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop", Bali:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop", Bangkok:"https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop", Osaka:"https://images.unsplash.com/photo-1565559204102-f59129a70ae2?w=600&h=400&fit=crop" };

/* ─── Data ──────────────────────────────────────────────────────── */
const PLAN = [
  { time: "09:00", icon: "✈️", title: "Arrive Narita T3",  note: "JL 7" },
  { time: "13:00", icon: "🏯", title: "Senso-ji Temple",   note: "Asakusa" },
  { time: "18:00", icon: "🍜", title: "Shibuya Food Tour", note: "Meet at Hachiko" },
  { time: "21:00", icon: "🏨", title: "Check-in Hotel",    note: "Shinjuku" },
];

function activityCount(activities) {
  if (!activities) return 0;
  return Object.values(activities).reduce((s, a) => s + (a?.length || 0), 0);
}

function formatTripDates(startDate, duration) {
  if (!startDate) return duration || null;
  const start = new Date(startDate + "T00:00:00");
  const days = parseInt(duration) || 1;
  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

const DISCOVER = [
  { id: 1, title: "Immersive Art",    sub: "Exhibitions & installations", img: "https://picsum.photos/seed/art-exhibit/400/600",   city: "Tokyo",  category: "art"       },
  { id: 2, title: "Theme Parks",      sub: "Thrills & memories",          img: "https://picsum.photos/seed/theme-park/400/300",    city: "Osaka",  category: "adventure" },
  { id: 3, title: "Craft & Make",     sub: "DIY workshops nearby",        img: "https://picsum.photos/seed/pottery-craft/400/300", city: "Kyoto",  category: "culture"   },
  { id: 4, title: "Live Music",       sub: "Concerts & festivals",        img: "https://picsum.photos/seed/concert-crowd/400/300", city: "Seoul",  category: "adventure" },
];

const TOPICS = [
  { id: "japan-hiking",    tag: "Outdoor",   title: "Japan's Best Hiking Trails",  img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=440&h=320&fit=crop" },
  { id: "kyoto-alleys",   tag: "Deep Dive", title: "Hidden Alleys of Kyoto",      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=440&h=320&fit=crop" },
  { id: "osaka-food",     tag: "Food",      title: "Osaka Street Food Map",       img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=440&h=320&fit=crop" },
  { id: "tokyo-culture",  tag: "Culture",   title: "Tokyo's Festivals & Crafts",  img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=440&h=320&fit=crop" },
  { id: "bali-wellness",  tag: "Wellness",  title: "Bali's Best Retreat Spots",   img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=440&h=320&fit=crop" },
  { id: "seoul-nights",   tag: "Nightlife", title: "Seoul After Dark Guide",      img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=440&h=320&fit=crop" },
];

const MY_TRIPS = [
  {
    id: 1,
    title: "Japan Classic 5-Day",
    dates: "Mar 20 – Mar 25",
    duration: "5 days · 4 nights",
    places: 12,
    img: "https://picsum.photos/seed/japan-castle/200/200",
    color: "#1e1e2e",
    accent: "#6c6cff",
  },
  {
    id: 2,
    title: "Seoul Adventure",
    dates: "Apr 10 – Apr 13",
    duration: "3 days · 2 nights",
    places: 8,
    img: "https://picsum.photos/seed/seoul-street/200/200",
    color: "#162420",
    accent: "#fff",
  },
];

const CITIES = [
  { city: "Tokyo",   temp: "8°C",  icon: "☁️",  img: "https://picsum.photos/seed/tokyo-tower/120/120",   color: "#4a8fe8" },
  { city: "Seoul",   temp: "12°C", icon: "🌤️", img: "https://picsum.photos/seed/seoul-palace/120/120",  color: "#fff" },
  { city: "Bangkok", temp: "32°C", icon: "☀️",  img: "https://picsum.photos/seed/bangkok-wat/120/120",   color: "#e0a020" },
  { city: "Kyoto",   temp: "10°C", icon: "🌸",  img: "https://picsum.photos/seed/kyoto-shrine/120/120",  color: "#e05f8a" },
  { city: "Osaka",   temp: "11°C", icon: "🌥️", img: "https://picsum.photos/seed/osaka-castle/120/120",  color: "#9b59e0" },
];

const BUDDIES = [
  "https://picsum.photos/seed/face-a/48/48",
  "https://picsum.photos/seed/face-b/48/48",
  "https://picsum.photos/seed/face-c/48/48",
];

const STATS = [
  { emoji: "📍", value: "12", label: "Places",  accent: "#fff" },
  { emoji: "💰", value: "¥45K", label: "Budget", accent: "#e0a020" },
  { emoji: "🌤️", value: "8°C",  label: "Tokyo",  accent: "#4a8fe8" },
  { emoji: "📝", value: "4",    label: "Notes",  accent: "#9b59e0" },
  { emoji: "🗺️", value: "3",    label: "Routes", accent: "#2ab87a" },
];

const NAV_ITEMS = [
  { icon: faHouse,       label: "Home",      href: "/home"   },
  { icon: faCompass,     label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,       label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser,  label: "Profile",   href: "/profile" },
];

const DEST_IMG  = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&h=400&fit=crop";
const TODAY_FEATURED_IMG = "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800&h=450&fit=crop";
const TODAY_THUMBS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=240&h=200&fit=crop",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=240&h=200&fit=crop",
];

function pad(n) { return String(n).padStart(2, "0"); }

/* ─── HomeClient ─────────────────────────────────────────────────── */
export function HomeClient() {
  const pathname = usePathname();
  const router = useRouter();

  // ── Mounted guard — prevents SSR/client mismatch for date-dependent UI ──
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const hour = mounted ? new Date().getHours() : 0;

  // Prefetch all nav routes on mount so taps are instant
  useEffect(() => {
    ["/nearby", "/trips", "/profile", "/planner"].forEach(r => router.prefetch(r));
  }, [router]);
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  const today = mounted ? new Date() : new Date(0);
  const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  // ── Splash screen — only on very first ever load (localStorage) ──
  const [splashVisible, setSplashVisible] = useState(false);
  const [splashGone, setSplashGone] = useState(true);
  useEffect(() => {
    // Safety fallback: always dismiss splash after 3s regardless of state
    const safety = setTimeout(() => { setSplashVisible(false); setSplashGone(true); }, 3000);
    try { if (localStorage.getItem("navora_splash_seen")) { clearTimeout(safety); return; } } catch (_) { clearTimeout(safety); return; }
    try { localStorage.setItem("navora_splash_seen", "1"); } catch (_) {}
    setSplashGone(false);
    setSplashVisible(true);
    const t1 = setTimeout(() => setSplashVisible(false), 900);
    const t2 = setTimeout(() => { setSplashGone(true); clearTimeout(safety); }, 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(safety); };
  }, []);

  const [tripSwitcherOpen, setTripSwitcherOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [planDay, setPlanDay]   = useState(1);
  const [cd, setCd] = useState({ days: 0, h: "00", m: "00", s: "00" });

  // ── Countdown config (trip + date) ──
  const [cdConfig, setCdConfig] = useState({ tripId: null, tripName: "My Trip", startDate: "" });
  const [savedTrips, setSavedTrips] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTripId, setPickerTripId] = useState(null);
  const [pickerDate, setPickerDate] = useState("");
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(0);

  // Load from localStorage on mount; auto-select nearest upcoming trip if no countdown set
  useEffect(() => {
    try {
      const trips = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      setSavedTrips(trips);
      const saved = localStorage.getItem("opal_countdown");
      if (saved) {
        setCdConfig(JSON.parse(saved));
      } else {
        // Auto-pick the nearest future trip that has a startDate
        const now = new Date();
        const upcoming = trips
          .filter(t => t.startDate)
          .map(t => ({ ...t, _start: new Date(t.startDate + "T00:00:00") }))
          .filter(t => t._start >= now)
          .sort((a, b) => a._start - b._start)[0];
        if (upcoming) {
          const cfg = { tripId: upcoming.id, tripName: upcoming.destination || "My Trip", startDate: upcoming.startDate };
          setCdConfig(cfg);
          localStorage.setItem("opal_countdown", JSON.stringify(cfg));
        }
      }
    } catch (_) {}
  }, []);

  // Reload trips when picker opens
  useEffect(() => {
    if (!pickerOpen) return;
    try {
      const trips = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      setSavedTrips(trips);
      // Always start fresh — user must pick a trip first
      setPickerTripId(null);
      setPickerDate("");
      const d = new Date();
      setCalYear(d.getFullYear());
      setCalMonth(d.getMonth());
    } catch (_) {}
  }, [pickerOpen]);

  function cycleTrip() {
    const datedTrips = savedTrips.filter(t => t.startDate);
    if (datedTrips.length < 2) return;
    const curIdx = datedTrips.findIndex(t => t.id === cdConfig.tripId);
    const next = datedTrips[(curIdx + 1) % datedTrips.length];
    const cfg = { tripId: next.id, tripName: next.destination || "My Trip", startDate: next.startDate };
    setCdConfig(cfg);
    localStorage.setItem("opal_countdown", JSON.stringify(cfg));
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  function saveCountdown() {
    if (!pickerTripId || !pickerDate) return;
    const trip = savedTrips.find(t => t.id === pickerTripId);
    const newConfig = { tripId: pickerTripId, tripName: trip?.destination || "My Trip", startDate: pickerDate };
    setCdConfig(newConfig);
    localStorage.setItem("opal_countdown", JSON.stringify(newConfig));
    // Also write startDate back to the trip in opal_trips
    try {
      const trips = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      const idx = trips.findIndex(t => t.id === pickerTripId);
      if (idx >= 0) { trips[idx].startDate = pickerDate; localStorage.setItem("opal_trips", JSON.stringify(trips)); }
    } catch (_) {}
    setPickerOpen(false);
  }

  // Countdown tick using dynamic startDate
  useEffect(() => {
    if (!cdConfig.startDate) { setCd({ days: 0, h: "00", m: "00", s: "00" }); return; }
    const target = new Date(cdConfig.startDate + "T09:00:00");
    function tick() {
      const diff = target - new Date();
      if (diff <= 0) { setCd({ days: 0, h: "00", m: "00", s: "00" }); return; }
      setCd({
        days: Math.floor(diff / 86400000),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cdConfig.startDate]);

  const shellRef = useRef(null);
  useLayoutEffect(() => {
    if (!shellRef.current) return;
    gsap.set(shellRef.current.querySelectorAll(
      ".hp-section-hd, .hp-featured-card, .hp-trips-scroll, .hp-topics-scroll, .hp-disc-grid"
    ), { opacity: 0, y: 24 });
  }, []);
  useEffect(() => {
    if (!shellRef.current) return;
    gsap.to(shellRef.current.querySelectorAll(
      ".hp-section-hd, .hp-featured-card, .hp-trips-scroll, .hp-topics-scroll, .hp-disc-grid"
    ), { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.05 });
  }, []);

  return (
    <>
    {!splashGone && (
      <div className={`splash-screen${!splashVisible ? " splash-exit" : ""}`}
        onClick={() => { setSplashVisible(false); setTimeout(() => setSplashGone(true), 550); }}>
        <div className="splash-icon-wrap">
          <div className="splash-icon-inner">
            <img src="/navora-logo.svg" alt="Navora" style={{ width: 120, height: 120, objectFit: "contain" }} />
          </div>
        </div>
        <div className="splash-wordmark">NAVORA</div>
        <div className="splash-tagline">Plan your journey</div>
        <div className="splash-bar-track">
          <div className="splash-bar-fill" />
        </div>
      </div>
    )}
    <div className="hp-shell" ref={shellRef}>
      <div className="hp-scroll">

        {/* ══ 1. Header — dotted dark bg ══ */}
        <div className="hp-header">
          <div className="hp-topbar">
            <div className="hp-topbar-left">
              <div className="hp-hey-row">
                <span className="hp-wave" style={{ cursor: "pointer" }} onClick={() => router.push("/login")}>👋</span>
                <span className="hp-hey">Hey Leqi</span>
              </div>
              <div className="hp-greeting">Good <strong>{greeting}</strong></div>
            </div>
            <div className="hp-avatar" onClick={() => router.push("/profile")} style={{ cursor: "pointer" }}><img src="/memojis/10.png" alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          </div>

          {/* ── Countdown hero card (expandable) ── */}
          <div className={`hp-cd-card${pickerOpen ? " hp-cd-picker-open" : ""}`}>
            <img className="hp-cd-img" src={CITY_IMAGES[cdConfig.tripName] || DEST_IMG} alt="Destination" />
            <div className="hp-cd-overlay" />

            {/* Countdown view */}
            <div className={`hp-cd-count-view${planOpen || pickerOpen ? " hp-cd-hidden" : ""}`}>
              {cdConfig.startDate && savedTrips.length > 0 ? (
                <>
                  {/* Active countdown — show trip name + date + timer */}
                  <div className="hp-cd-top">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="hp-cd-trip">
                        {CITY_FLAGS[cdConfig.tripName] || "✈️"} {cdConfig.tripName.toUpperCase()}
                      </span>
                      {(() => {
                        const trip = savedTrips.find(t => t.id === cdConfig.tripId);
                        if (!trip) return null;
                        const stops = Object.values(trip.activities || {}).flat().length;
                        return (
                          <span style={{
                            fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 600,
                            letterSpacing: 0.2, whiteSpace: "nowrap",
                          }}>
                            {trip.duration}{stops > 0 ? ` · ${stops} stops` : ""}
                          </span>
                        );
                      })()}
                    </div>
                    <button
                      onClick={() => setTripSwitcherOpen(true)}
                      style={{
                        background: "none", border: "none",
                        borderRadius: 16, padding: "4px 11px", cursor: "pointer",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                      My Plans
                      <span style={{ opacity: 0.5, fontSize: 10 }}>⌄</span>
                    </button>
                  </div>
                  <div className="hp-cd-main">{`In ${cd.days} days`}</div>
                  <div className="hp-cd-timer">
                    <div className="hp-cd-timer-unit">
                      <span className="hp-cd-digits">{cd.h}</span>
                      <span className="hp-cd-unit-label">HRS</span>
                    </div>
                    <span className="hp-cd-sep">:</span>
                    <div className="hp-cd-timer-unit">
                      <span className="hp-cd-digits">{cd.m}</span>
                      <span className="hp-cd-unit-label">MIN</span>
                    </div>
                    <span className="hp-cd-sep">:</span>
                    <div className="hp-cd-timer-unit">
                      <span className="hp-cd-digits">{cd.s}</span>
                      <span className="hp-cd-unit-label">SEC</span>
                    </div>
                  </div>
                  <button className="hp-cd-plan-toggle" onClick={() => { setPlanOpen(true); setPlanDay(1); }}>
                    <span>
                      {(() => {
                        const t = savedTrips.find(tr => tr.id === cdConfig.tripId);
                        const total = parseInt(t?.duration) || 1;
                        const totalActs = Object.values(t?.activities || {}).flat().length;
                        return total > 1
                          ? `${total}-Day Itinerary · ${totalActs} places`
                          : `Day 1 Itinerary${totalActs > 0 ? ` · ${totalActs} places` : ""}`;
                      })()}
                    </span>
                    <span className="hp-cd-toggle-arrow">›</span>
                  </button>
                </>
              ) : (
                /* Empty state — Opal cd-card layout: top label · mid heading · bottom CTA */
                <div style={{ position: "relative", height: "100%", padding: "16px 20px" }}>
                  {/* Top row — badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{
                      background: "rgba(20,20,20,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,95,31,0.55)",
                      borderRadius: 12, padding: "4px 12px",
                      color: "#ff8c42", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
                    }}>
                      {savedTrips.length > 0 ? `${savedTrips.length} trip${savedTrips.length > 1 ? "s" : ""} planned` : "Get started"}
                    </span>
                  </div>
                  {/* Main heading — Opal cd-main spec: 28px/700/−0.5px */}
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.5, marginTop: 10 }}>
                    {savedTrips.length > 0 ? "Where to next?" : "Plan your first trip"}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                    {savedTrips.length > 0
                      ? "Pick a trip and set a date to start your countdown"
                      : "Create an itinerary and start counting down"}
                  </div>
                  {/* Bottom CTA — Opal white primary button, absolutely pinned */}
                  <div style={{ position: "absolute", bottom: 14, left: 20, right: 20 }}>
                    {savedTrips.length > 0 ? (
                      <button onClick={() => setPickerOpen(true)} style={{
                        display: "block", width: "100%", padding: "11px 0",
                        background: "#fff", border: "none", borderRadius: 14, cursor: "pointer",
                        color: "#09090F", fontSize: 14, fontWeight: 700, letterSpacing: 0.1, textAlign: "center",
                      }}>
                        Set countdown ›
                      </button>
                    ) : (
                      <Link href="/planner" style={{
                        display: "block", textAlign: "center",
                        padding: "11px 0", background: "#fff", textDecoration: "none",
                        borderRadius: 14,
                        color: "#09090F", fontSize: 14, fontWeight: 700, letterSpacing: 0.1,
                      }}>
                        Start planning ›
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Trip + date picker overlay ── */}
            {pickerOpen && (<>
              {/* Full-card backdrop — covers image bleed below content */}
              <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,15,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", zIndex: 9, animation: "cd-backdrop-in 0.28s ease" }} />
              <div style={{
                position: "relative", zIndex: 10,
                display: "flex", flexDirection: "column",
                padding: "14px 16px 16px",
                animation: "cd-picker-in 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Set Countdown</span>
                  <button onClick={() => setPickerOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 26, height: 26, color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", lineHeight: 1 }}>✕</button>
                </div>

                {/* Trip selector */}
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, margin: "0 0 6px", textTransform: "uppercase" }}>Choose trip</p>
                {savedTrips.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 10, padding: "8px 0" }}>No saved trips — add one from Discover</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                    {savedTrips.map(t => {
                      const sel = pickerTripId === t.id;
                      return (
                        <button key={t.id} onClick={() => setPickerTripId(t.id)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 10px", borderRadius: 12, cursor: "pointer",
                          background: sel ? "rgba(255,140,66,0.12)" : "rgba(255,255,255,0.04)",
                          border: sel ? "1px solid rgba(255,140,66,0.3)" : "1px solid rgba(255,255,255,0.07)",
                          textAlign: "left", transition: "background 0.15s",
                        }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: sel ? "rgba(255,140,66,0.2)" : "rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16,
                          }}>
                            {CITY_FLAGS[t.destination] || "✈️"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: sel ? "#fff" : "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700 }}>{t.destination}</div>
                            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{t.duration} · {Object.values(t.activities || {}).flat().length} stops</div>
                          </div>
                          {sel && (
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ff8c42", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Custom date picker — only shown after trip is selected */}
                {!pickerTripId && (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, textAlign: "center", padding: "6px 0 2px", fontStyle: "italic" }}>← pick a trip to set the date</p>
                )}
                {pickerTripId && (<div style={{ animation: "cd-cal-in 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, margin: "0 0 8px", textTransform: "uppercase" }}>Start date</p>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "none", padding: "10px 8px 8px", marginBottom: 10 }}>
                    {/* Month/year nav */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
                      <button onClick={prevMonth} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, width: 28, height: 28, color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                        {["January","February","March","April","May","June","July","August","September","October","November","December"][calMonth]} {calYear}
                      </span>
                      <button onClick={nextMonth} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, width: 28, height: 28, color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                    </div>
                    {/* Day-of-week headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                        <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)", padding: "2px 0" }}>{d}</div>
                      ))}
                    </div>
                    {/* Day cells */}
                    {(() => {
                      const firstDay = new Date(calYear, calMonth, 1).getDay();
                      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                      const cells = [];
                      for (let i = 0; i < firstDay; i++) cells.push(null);
                      for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                      const selD = pickerDate ? new Date(pickerDate + "T00:00:00") : null;
                      const todayNow = new Date();
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                          {cells.map((day, idx) => {
                            if (!day) return <div key={`e-${idx}`} />;
                            const isSel = selD && selD.getFullYear() === calYear && selD.getMonth() === calMonth && selD.getDate() === day;
                            const isToday = todayNow.getFullYear() === calYear && todayNow.getMonth() === calMonth && todayNow.getDate() === day;
                            return (
                              <button key={day} onClick={() => {
                                const m = String(calMonth + 1).padStart(2, "0");
                                const dd = String(day).padStart(2, "0");
                                setPickerDate(`${calYear}-${m}-${dd}`);
                              }} style={{
                                background: isSel ? "#ff8c42" : isToday ? "rgba(255,140,66,0.18)" : "transparent",
                                border: isToday && !isSel ? "1px solid rgba(255,140,66,0.35)" : "1px solid transparent",
                                borderRadius: 7, height: 28, cursor: "pointer",
                                color: isSel ? "#fff" : isToday ? "#ff9a52" : "rgba(255,255,255,0.75)",
                                fontSize: 11, fontWeight: isSel ? 700 : 400,
                              }}>{day}</button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                  {/* Confirm button */}
                  <button
                    onClick={saveCountdown}
                    disabled={!pickerDate}
                    style={{
                      width: "100%", padding: "11px 0", borderRadius: 12,
                      background: pickerDate ? "linear-gradient(135deg, #ff8c42, #ff5f1f)" : "rgba(255,255,255,0.07)",
                      border: "none", cursor: pickerDate ? "pointer" : "default",
                      color: pickerDate ? "#fff" : "rgba(255,255,255,0.2)",
                      fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                    {pickerDate
                      ? `Set Countdown · ${new Date(pickerDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ›`
                      : "Pick a date above"}
                  </button>
                </div>)}
              </div>
            </>)}


            {/* ── Trip switcher sheet ── */}
            {tripSwitcherOpen && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 20,
                background: "rgba(9,9,15,0.92)", backdropFilter: "blur(16px)",
                borderRadius: "inherit", display: "flex", flexDirection: "column",
                padding: "20px 16px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>Switch Plan</span>
                  <button onClick={() => setTripSwitcherOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                  {savedTrips.filter(t => t.startDate).map(trip => {
                    const isActive = trip.id === cdConfig.tripId;
                    const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const stops = Object.values(trip.activities || {}).flat().length;
                    return (
                      <button key={trip.id} onClick={() => {
                        const cfg = { tripId: trip.id, tripName: trip.destination || "My Trip", startDate: trip.startDate };
                        setCdConfig(cfg);
                        localStorage.setItem("opal_countdown", JSON.stringify(cfg));
                        setTripSwitcherOpen(false);
                      }} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: isActive ? "rgba(255,140,66,0.15)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${isActive ? "rgba(255,140,66,0.4)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 12, padding: "10px 14px", cursor: "pointer", textAlign: "left",
                      }}>
                        <span style={{ fontSize: 22 }}>{CITY_FLAGS[trip.destination] || "✈️"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{trip.destination}</div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 1 }}>
                            {fmt(trip.startDate)}{trip.endDate ? ` – ${fmt(trip.endDate)}` : ""}{stops > 0 ? ` · ${stops} stops` : ""}
                          </div>
                        </div>
                        {isActive && <span style={{ color: "#ff8c42", fontSize: 14 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Today's plan view — dynamic from saved trip */}
            {(() => {
              const linkedTrip = savedTrips.find(t => t.id === cdConfig.tripId);
              const totalDays  = parseInt(linkedTrip?.duration) || 1;
              const dayActs    = (linkedTrip?.activities?.[planDay] || []);
              const CAT_EMOJI  = { attraction:"🏛️", food:"🍜", restaurant:"🍽️", nature:"🌿", shopping:"🛍️", accommodation:"🏨", transport:"🚃", nightlife:"🍸", art:"🎨", default:"📍" };
              return (
                <div className={`hp-cd-plan-view${planOpen ? " hp-cd-plan-open" : ""}`}>
                  <div className="hp-cd-plan-header">
                    <span className="hp-cd-plan-title">
                      Day {planDay} · {cdConfig.tripName || "Trip"}
                    </span>
                    <button className="hp-cd-plan-close" onClick={() => setPlanOpen(false)}>✕</button>
                  </div>

                  {/* Day tabs */}
                  {totalDays > 1 && (
                    <div style={{ display: "flex", gap: 6, padding: "0 14px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => (
                        <button key={d} onClick={() => setPlanDay(d)} style={{
                          flexShrink: 0,
                          height: 26, padding: "0 12px", borderRadius: 14, border: "none", cursor: "pointer",
                          fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
                          background: planDay === d ? "#ff8c42" : "rgba(255,255,255,0.08)",
                          color: planDay === d ? "#fff" : "rgba(255,255,255,0.45)",
                          transition: "background 0.15s, color 0.15s",
                        }}>
                          Day {d}
                          {(linkedTrip?.activities?.[d] || []).length > 0 && (
                            <span style={{ marginLeft: 4, opacity: 0.7 }}>·{(linkedTrip.activities[d]).length}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="hp-cd-plan-list">
                    {dayActs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "14px 0 8px", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                        No places added for Day {planDay} yet
                      </div>
                    ) : (
                      dayActs.map((act, i) => (
                        <div key={act._id || i} className="hp-cd-plan-row" style={{ cursor: "pointer" }}
                          onClick={() => router.push(`/planner/manual?id=${cdConfig.tripId}&city=${encodeURIComponent(linkedTrip?.destination || "")}&duration=${encodeURIComponent(linkedTrip?.duration || "")}&day=${planDay}`)}>
                          <span className="hp-cd-plan-time">{act.time || "—"}</span>
                          <span className="hp-cd-plan-icon">{CAT_EMOJI[act.category] || CAT_EMOJI.default}</span>
                          <div className="hp-cd-plan-info">
                            <span className="hp-cd-plan-name">{act.name}</span>
                            <span className="hp-cd-plan-note">{act.address?.split(",").slice(0, 2).join(",") || act.category || ""}</span>
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, marginLeft: "auto", paddingLeft: 8 }}>›</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ══ 2. Today's Pick ══ */}
        <div className="hp-section-hd">
          <div className="hp-today-date-label">
            <span className="hp-today-day">{today.getDate()}</span>
            <div className="hp-today-month-year">
              <span className="hp-today-month">{monthNames[today.getMonth()]}</span>
              <span className="hp-today-year">{today.getFullYear()}</span>
            </div>
            <span className="hp-today-title-text">Today's Pick</span>
          </div>
          <Link href="/picks" className="hp-section-link">See more</Link>
        </div>

        <div className="hp-featured-card">
          <img className="hp-featured-img" src={TODAY_FEATURED_IMG} alt="Featured" />
          <div className="hp-featured-overlay" />
          <div className="hp-featured-content">
            <p className="hp-featured-tag">🌍 Cultural Exploration</p>
            <p className="hp-featured-title">Iran: Ancient Cities at the<br />Crossroads of Civilization</p>
          </div>

        </div>


        {/* ══ 4. Your Trips — compact horizontal ══ */}
        <div className="hp-section-hd">
          <div>
            <p className="hp-section-cat">Your Journeys</p>
            <span className="hp-section-title">Your Trips</span>
            <p className="hp-section-sub">
              {savedTrips.length > 0 ? `${savedTrips.length} ${savedTrips.length === 1 ? "trip" : "trips"} · Plan your next` : "No trips yet"}
            </p>
          </div>
          <Link href="/planner" className="hp-section-link" style={{ textDecoration: "none" }}>+ New</Link>
        </div>

        <div className="hp-trips-scroll">
          {savedTrips.length === 0 ? (
            <Link href="/planner" style={{ textDecoration: "none" }}>
              <div className="hp-trip-card" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "#1A1A1E",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: "#242428",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 16,
                }}>✈️</div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 5px", letterSpacing: -0.3 }}>No trips yet</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 20px", lineHeight: 1.4, textAlign: "center" }}>Start planning your adventure</p>
                <div style={{
                  background: "#fff", color: "#09090F",
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.1,
                  padding: "8px 20px", borderRadius: 12,
                }}>Plan a trip ›</div>
              </div>
            </Link>
          ) : (
            savedTrips.map((trip) => {
              const img = CITY_IMAGES[trip.destination];
              const flag = CITY_FLAGS[trip.destination] || "✈️";
              const tag = trip.prefs?.[0] || trip.destination || "Trip";
              const dates = formatTripDates(trip.startDate, trip.duration);
              const count = activityCount(trip.activities);
              const href = `/planner/manual?city=${encodeURIComponent(trip.destination || "")}&duration=${encodeURIComponent(trip.duration || "")}&prefs=${encodeURIComponent((trip.prefs || []).join(","))}&id=${trip.id}`;
              return (
                <Link key={trip.id} href={href} className="hp-trip-card" style={{ textDecoration: "none" }}>
                  {img
                    ? <img className="hp-trip-img" src={img} alt={trip.destination} />
                    : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a1a2e,#0d0d1a)" }} />
                  }
                  <div className="hp-trip-grad" />
                  <span className="hp-trip-tag">{tag}</span>
                  <div className="hp-trip-info">
                    <p className="hp-trip-title">{flag} {trip.destination}</p>
                    <p className="hp-trip-meta">{[dates, count > 0 && `${count} places`].filter(Boolean).join(" · ")}</p>
                  </div>
                  <div className="hp-trip-action-btn">→ Open</div>
                </Link>
              );
            })
          )}
        </div>

        {/* My Itineraries lives in the Trips tab — see nav */}

        {/* ══ 6. Featured Topics ══ */}
        <div className="hp-section-hd">
          <div>
            <p className="hp-section-cat">Travel Guides</p>
            <span className="hp-section-title">Featured Topics</span>
            <p className="hp-section-sub">Hand-picked guides for you</p>
          </div>
          <Link href="/nearby" className="hp-section-link">All ›</Link>
        </div>

        <div className="hp-topics-scroll">
          {TOPICS.map((t) => (
            <Link key={t.id} href={`/blog/${t.id}`} className="hp-topic-card">
              <img className="hp-topic-img" src={t.img} alt={t.title} />
              <div className="hp-topic-grad" />
              <span className="hp-topic-tag">{t.tag}</span>
              <p className="hp-topic-title">{t.title}</p>
              <div className="hp-topic-action-btn">Read Guide ›</div>
            </Link>
          ))}
        </div>

        {/* ══ 7. Discover ══ */}
        <div className="hp-section-hd">
          <div>
            <p className="hp-section-cat">Explore</p>
            <span className="hp-section-title">Discover</span>
            <p className="hp-section-sub">Curated for your style</p>
          </div>
          <Link href="/nearby" className="hp-section-link">All ›</Link>
        </div>

        <div className="hp-disc-grid">
          {/* Left — tall card spanning both rows */}
          <Link href={`/nearby?city=${DISCOVER[0].city}&category=${DISCOVER[0].category}`} className="hp-disc-cell hp-disc-tall">
            <img className="hp-disc-img" src={DISCOVER[0].img} alt={DISCOVER[0].title} />
            <div className="hp-disc-grad" />
            <div className="hp-disc-label">
              <p className="hp-disc-title">{DISCOVER[0].title}</p>
              <p className="hp-disc-sub">{DISCOVER[0].sub}</p>
            </div>
          </Link>
          {/* Right column — two stacked */}
          {DISCOVER.slice(1, 3).map((item) => (
            <Link key={item.id} href={`/nearby?city=${item.city}&category=${item.category}`} className="hp-disc-cell hp-disc-short">
              <img className="hp-disc-img" src={item.img} alt={item.title} />
              <div className="hp-disc-grad" />
              <div className="hp-disc-label">
                <p className="hp-disc-title">{item.title}</p>
                <p className="hp-disc-sub">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ height: 112 }} />
      </div>

      <nav className="hp-nav">
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) =>
            item.center ? (
              <div key="center" className="hp-nav-center-wrap">
                <Link href="/planner" className="hp-nav-center-btn" style={{ overflow: "hidden", position: "relative" }}>
                  {pathname === '/planner' ? (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%" }}>
                      <Grainient color1="#F97316" color2="#396cbf" color3="#B497CF" timeSpeed={0.25} warpStrength={1} warpFrequency={5} warpSpeed={2} warpAmplitude={50} rotationAmount={500} grainAmount={0.1} contrast={1.5} zoom={0.9} />
                    </div>
                  ) : (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%", background: "linear-gradient(135deg, #F97316 0%, #396cbf 60%, #B497CF 100%)" }} />
                  )}
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
    </>
  );
}
