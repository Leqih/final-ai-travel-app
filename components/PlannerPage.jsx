"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft, faChevronRight, faChevronDown, faCreditCard, faHouse, faCompass, faPlane, faCircleUser, faPlus, faMagnifyingGlass, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
const CircularGallery = dynamic(() => import("./CircularGallery"), { ssr: false });
const Aurora = dynamic(() => import("./Aurora"), { ssr: false });
const Grainient = dynamic(() => import("./Grainient"), { ssr: false });

const NAV_ITEMS = [
  { icon: faHouse,       label: "Home",      href: "/home"   },
  { icon: faCompass,     label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,       label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser,  label: "Profile",   href: "/profile" },
];

const TRAVEL_TYPES = [
  "Vacation", "Adventure", "Relaxation", "Cultural", "Romantic",
  "Solo Travel", "Family Trip", "Honeymoon", "Beach & Islands", "City Break",
];

const CITY_OPTIONS = [
  { label: "Tokyo", emoji: "🗼", country: "Japan", code: "TYO", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop", desc: "A neon-lit metropolis where ancient temples sit beside futuristic skyscrapers.", bestTime: "Mar – May, Oct – Nov", vibes: ["Foodie", "Tech", "Culture"] },
  { label: "Seoul", emoji: "🇰🇷", country: "South Korea", code: "SEL", img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300&h=300&fit=crop", desc: "K-culture capital blending cutting-edge fashion, street food, and royal palaces.", bestTime: "Apr – Jun, Sep – Nov", vibes: ["Trendy", "Nightlife", "Food"] },
  { label: "Bangkok", emoji: "🛕", country: "Thailand", code: "BKK", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=300&fit=crop", desc: "Sensory overload in the best way — ornate temples, bustling markets, street food paradise.", bestTime: "Nov – Mar", vibes: ["Street Food", "Temples", "Vibrant"] },
  { label: "Bali", emoji: "🌴", country: "Indonesia", code: "DPS", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=300&fit=crop", desc: "Island of gods with emerald rice terraces, surf breaks, and spiritual serenity.", bestTime: "Apr – Oct", vibes: ["Wellness", "Surf", "Nature"] },
  { label: "Paris", emoji: "🗼", country: "France", code: "CDG", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=300&fit=crop", desc: "The city of light, love, and croissants — romance in every cobblestone street.", bestTime: "Apr – Jun, Sep – Oct", vibes: ["Romance", "Art", "Cuisine"] },
  { label: "New York", emoji: "🗽", country: "United States", code: "JFK", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=300&fit=crop", desc: "The city that never sleeps — energy, diversity, and skylines that define ambition.", bestTime: "Apr – Jun, Sep – Nov", vibes: ["Urban", "Arts", "Energy"] },
  { label: "London", emoji: "🇬🇧", country: "United Kingdom", code: "LHR", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=300&fit=crop", desc: "Royal heritage meets indie music scenes — history on every corner, pubs on every street.", bestTime: "May – Sep", vibes: ["History", "Culture", "Music"] },
  { label: "Rome", emoji: "🏛️", country: "Italy", code: "FCO", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=300&fit=crop", desc: "An open-air museum where every fountain, ruin, and piazza tells a 2,000-year story.", bestTime: "Apr – Jun, Sep – Oct", vibes: ["History", "Food", "Art"] },
  { label: "Istanbul", emoji: "🕌", country: "Turkey", code: "IST", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=300&fit=crop", desc: "Where Europe meets Asia — bazaars, minarets, and Bosphorus sunsets.", bestTime: "Apr – May, Sep – Nov", vibes: ["Bazaars", "Culture", "Views"] },
  { label: "Dubai", emoji: "🏙️", country: "UAE", code: "DXB", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=300&fit=crop", desc: "Superlatives made real — tallest towers, largest malls, boldest architecture.", bestTime: "Nov – Mar", vibes: ["Luxury", "Modern", "Desert"] },
  { label: "Sydney", emoji: "🦘", country: "Australia", code: "SYD", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&h=300&fit=crop", desc: "Harbour city with iconic sails, golden beaches, and laid-back coastal living.", bestTime: "Sep – Nov, Mar – May", vibes: ["Beaches", "Outdoors", "Relaxed"] },
  { label: "Barcelona", emoji: "🇪🇸", country: "Spain", code: "BCN", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=300&fit=crop", desc: "Gaudí's dreamlike architecture, tapas culture, and endless Mediterranean sunshine.", bestTime: "May – Jun, Sep – Oct", vibes: ["Architecture", "Beach", "Nightlife"] },
  { label: "Kyoto", emoji: "⛩️", country: "Japan", code: "KIX", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=300&fit=crop", desc: "Japan's cultural soul — thousands of temples, geisha districts, and bamboo groves.", bestTime: "Mar – May, Oct – Nov", vibes: ["Zen", "Tradition", "Nature"] },
  { label: "Santorini", emoji: "🏝️", country: "Greece", code: "JTR", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=300&fit=crop", desc: "Whitewashed villages clinging to volcanic cliffs above the cobalt Aegean Sea.", bestTime: "May – Oct", vibes: ["Sunset", "Romance", "Island"] },
  { label: "Marrakech", emoji: "🇲🇦", country: "Morocco", code: "RAK", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=300&h=300&fit=crop", desc: "A labyrinth of souks, spices, and riads where color assaults you beautifully.", bestTime: "Mar – May, Sep – Nov", vibes: ["Exotic", "Souks", "Craft"] },
  { label: "Singapore", emoji: "🇸🇬", country: "Singapore", code: "SIN", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=300&fit=crop", desc: "Futuristic garden city — sky parks, hawker centres, and hyper-efficient charm.", bestTime: "Feb – Apr", vibes: ["Modern", "Food", "Clean"] },
  { label: "Prague", emoji: "🏰", country: "Czech Republic", code: "PRG", img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=300&h=300&fit=crop", desc: "Fairy-tale Gothic spires, medieval squares, and Europe's finest craft beer.", bestTime: "Apr – May, Sep – Oct", vibes: ["Medieval", "Beer", "Budget"] },
  { label: "Lisbon", emoji: "🇵🇹", country: "Portugal", code: "LIS", img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=300&h=300&fit=crop", desc: "Hilly, sun-drenched city with trams, fado music, and pastel de nata on every corner.", bestTime: "Mar – May, Sep – Oct", vibes: ["Charming", "Affordable", "Fado"] },
  { label: "Cape Town", emoji: "🇿🇦", country: "South Africa", code: "CPT", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=300&fit=crop", desc: "Table Mountain backdrop, world-class wine, and the meeting of two oceans.", bestTime: "Nov – Mar", vibes: ["Nature", "Wine", "Adventure"] },
  { label: "Havana", emoji: "🇨🇺", country: "Cuba", code: "HAV", img: "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=300&h=300&fit=crop", desc: "Frozen in time — vintage cars, salsa rhythms, and crumbling colonial grandeur.", bestTime: "Dec – Apr", vibes: ["Vintage", "Music", "Unique"] },
  { label: "Amsterdam", emoji: "🇳🇱", country: "Netherlands", code: "AMS", img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=300&fit=crop", desc: "Canal rings, tulip fields, world-class museums, and the world's best cycling culture.", bestTime: "Apr – May, Sep – Oct", vibes: ["Canals", "Museums", "Bikes"] },
  { label: "Reykjavik", emoji: "🇮🇸", country: "Iceland", code: "KEF", img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=300&h=300&fit=crop", desc: "Gateway to fire and ice — auroras, geysers, hot springs, and midnight sun.", bestTime: "Jun – Aug, Dec – Feb", vibes: ["Aurora", "Nature", "Wild"] },
  { label: "Buenos Aires", emoji: "🇦🇷", country: "Argentina", code: "EZE", img: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=300&h=300&fit=crop", desc: "Paris of the South — tango, steak, bookshops, and passionate football culture.", bestTime: "Mar – May, Sep – Nov", vibes: ["Tango", "Steak", "Culture"] },
  { label: "Osaka", emoji: "🏯", country: "Japan", code: "ITM", img: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=300&h=300&fit=crop", desc: "Japan's kitchen — takoyaki, ramen, neon-lit streets, and unmatched street food.", bestTime: "Mar – May, Oct – Nov", vibes: ["Food", "Fun", "Nightlife"] },
  { label: "Vienna", emoji: "🎵", country: "Austria", code: "VIE", img: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=300&h=300&fit=crop", desc: "Imperial grandeur, Mozart's birthplace, coffeehouses, and the world's best philharmonic.", bestTime: "Apr – May, Sep – Oct", vibes: ["Classical", "Coffee", "Imperial"] },
  { label: "Petra", emoji: "🏜️", country: "Jordan", code: "AMM", img: "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=300&h=300&fit=crop", desc: "The Rose City — ancient Nabataean tombs carved into rose-red sandstone cliffs.", bestTime: "Mar – May, Sep – Nov", vibes: ["Ancient", "Adventure", "Desert"] },
  { label: "Rio", emoji: "🇧🇷", country: "Brazil", code: "GIG", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&h=300&fit=crop", desc: "Carnival energy, Cristo Redentor, iconic beaches, and samba in the streets.", bestTime: "Dec – Mar", vibes: ["Carnival", "Beach", "Samba"] },
  { label: "Hanoi", emoji: "🇻🇳", country: "Vietnam", code: "HAN", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=300&fit=crop", desc: "Old Quarter chaos, pho for breakfast, French colonial charm, and lakes at dusk.", bestTime: "Oct – Apr", vibes: ["Street Food", "History", "Budget"] },
  { label: "Maldives", emoji: "🏝️", country: "Maldives", code: "MLE", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=300&fit=crop", desc: "Overwater bungalows, crystal lagoons, and the clearest water on the planet.", bestTime: "Nov – Apr", vibes: ["Luxury", "Diving", "Romance"] },
  { label: "Taipei", emoji: "🇹🇼", country: "Taiwan", code: "TPE", img: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=300&h=300&fit=crop", desc: "Night markets, bubble tea origins, friendly locals, and Taipei 101 piercing the clouds.", bestTime: "Oct – Dec, Mar – May", vibes: ["Night Market", "Foodie", "Modern"] },
];

const BUDGET_STEPS = [
  { label: "Budget", amount: "$50", sub: "/ day" },
  { label: "Mid-Range", amount: "$150", sub: "/ day" },
  { label: "Luxury", amount: "$500", sub: "/ day" },
  { label: "Ultra-Luxury", amount: "$2000", sub: "/ day" },
];

/* Interest icons matching Figma: dining, accommodation, culture, hiking, outdoors, museum, shopping, nightlife */
const INTEREST_OPTIONS = [
  { label: "Dining", icon: "dining" },
  { label: "Stay", icon: "stay" },
  { label: "Culture", icon: "culture" },
  { label: "Hiking", icon: "hiking" },
  { label: "Outdoors", icon: "outdoors" },
  { label: "Museum", icon: "museum" },
  { label: "Shopping", icon: "shopping" },
  { label: "Nightlife", icon: "nightlife" },
];

const INTEREST_CATEGORIES = ["Culture", "Adventure", "Relaxation", "Luxury"];

const DURATION_OPTIONS = [
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "1 Week", days: 7 },
  { label: "10 Days", days: 10 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "1 Month", days: 30 },
];

/* SVG icons for interest orbital */
function InterestIcon({ type, active }) {
  const color = active ? "#000" : "rgba(255,255,255,0.5)";
  const size = 20;
  const icons = {
    dining: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
    stay: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h.01"/><path d="M9 12h.01"/><path d="M9 15h.01"/>
      </svg>
    ),
    culture: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/>
      </svg>
    ),
    hiking: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H11a2 2 0 00-2 2v12a2 2 0 002 2h8"/><path d="M5 8l4 4-4 4"/>
      </svg>
    ),
    outdoors: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 22H7l-5-9 10-11 10 11-5 9z"/><path d="M12 2v20"/>
      </svg>
    ),
    museum: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4a3 3 0 016 0v4"/>
      </svg>
    ),
    shopping: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    nightlife: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 019 9 9 9 0 11-9-9z"/>
      </svg>
    ),
  };
  return icons[type] || null;
}


/* ── Bottom Sheet wrapper ── */
function BottomSheet({ open, onClose, children, sheetStyle }) {
  if (!open) return null;
  return (
    <div className="pl-sheet-overlay" onClick={onClose}>
      <div className="pl-sheet" onClick={(e) => e.stopPropagation()} style={sheetStyle}>
        <div className="pl-sheet-handle" />
        {children}
      </div>
    </div>
  );
}

/* ── City selector — ReactBits Circular Gallery ── */
function CitySheet({ open, onClose, value, onSelect }) {
  const [selected, setSelected] = useState(value || CITY_OPTIONS[0]?.label);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const inputRef = useRef(null);
  const tapRef = useRef(null);

  const isSearchMode = focused || query.trim().length > 0;

  // Returns { sections: [{type,label,cities}] } when searching, null when idle
  const searchResult = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // Which countries partially match the query?
    const matchedCountries = [
      ...new Set(
        CITY_OPTIONS
          .filter(c => c.country.toLowerCase().includes(q))
          .map(c => c.country)
      ),
    ];

    const sections = [];

    // Country sections — all cities in that country, sorted A→Z
    matchedCountries.forEach(country => {
      const cities = CITY_OPTIONS
        .filter(c => c.country === country)
        .sort((a, b) => a.label.localeCompare(b.label));
      sections.push({ type: "country", label: country, cities });
    });

    // City-name matches not already covered by a country section
    const coveredCodes = new Set(sections.flatMap(s => s.cities.map(c => c.code)));
    const cityMatches = CITY_OPTIONS.filter(
      c => c.label.toLowerCase().includes(q) && !coveredCodes.has(c.code)
    );
    if (cityMatches.length > 0) {
      sections.unshift({ type: "cities", label: "Cities", cities: cityMatches });
    }

    return { sections, total: sections.reduce((n, s) => n + s.cities.length, 0) };
  }, [query]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setSelected(value || CITY_OPTIONS[0]?.label);
      setQuery("");
      setFocused(false);
      setFlipped(false);
    }
  }, [open, value]);

  const galleryItems = useMemo(() =>
    CITY_OPTIONS.map((c) => ({
      image: c.img.replace("w=300&h=300", "w=800&h=600"),
      text: c.label,
    })),
    []
  );

  // Pick a city from the list, collapse back to gallery
  const pickCity = (city) => {
    setSelected(city.label);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const canConfirm = !!selected;
  const selectedCity = CITY_OPTIONS.find(c => c.label === selected);
  const buttonLabel = selectedCity ? `${selectedCity.emoji}  ${selectedCity.label}, ${selectedCity.country}` : "Select a city";

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Header */}
      <div className="pl-city-header">
        <h2 className="pl-city-title">
          {isSearchMode
            ? searchResult
              ? `${searchResult.total} destination${searchResult.total !== 1 ? "s" : ""}`
              : "Search Destinations"
            : "Explore Cities"}
        </h2>
      </div>

      {/* Search bar */}
      <div className="pl-city-search-wrap">
        <input
          ref={inputRef}
          className="pl-city-search"
          type="text"
          placeholder="Search city or country..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!query.trim()) setFocused(false); }}
          autoComplete="off"
        />
        {query.trim().length > 0 && (
          <button className="pl-city-search-clear" onClick={clearSearch} aria-label="Clear">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>

      {/* SEARCH MODE — sectioned list */}
      {isSearchMode ? (
        <div className="pl-city-list">
          {!searchResult || searchResult.total === 0 ? (
            <p className="pl-city-list-empty">No destinations found for "{query}"</p>
          ) : (
            searchResult.sections.map((section, si) => (
              <div key={si}>
                {/* Section header */}
                <div className="pl-city-section-hd">
                  {section.type === "country" ? (
                    <>
                      <span className="pl-city-section-flag">
                        {section.cities[0]?.emoji}
                      </span>
                      <span className="pl-city-section-name">{section.label}</span>
                      <span className="pl-city-section-count">
                        {section.cities.length} {section.cities.length === 1 ? "city" : "cities"} · A–Z
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="pl-city-section-name">Cities</span>
                      <span className="pl-city-section-count">{section.cities.length} result{section.cities.length > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                {/* City rows */}
                {section.cities.map(city => (
                  <button
                    key={city.code}
                    className={`pl-city-list-item${selected === city.label ? " pl-city-list-item--active" : ""}`}
                    onClick={() => pickCity(city)}
                  >
                    <span className="pl-city-list-emoji">{city.emoji}</span>
                    <div className="pl-city-list-info">
                      <span className="pl-city-list-name">{city.label}</span>
                      <span className="pl-city-list-country">{city.country}</span>
                    </div>
                    {selected === city.label && (
                      <FontAwesomeIcon icon={faCheck} className="pl-city-list-check" />
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      ) : (
        <div
          style={{ height: "320px", overflow: "hidden", position: "relative", width: "100%" }}
          onPointerDown={(e) => {
            if (flipped) return;
            tapRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
          }}
          onPointerUp={(e) => {
            if (flipped || !tapRef.current) return;
            const dx = Math.abs(e.clientX - tapRef.current.x);
            const dy = Math.abs(e.clientY - tapRef.current.y);
            const dt = Date.now() - tapRef.current.t;
            tapRef.current = null;
            if (dx < 8 && dy < 8 && dt < 300) setFlipped(true);
          }}
        >
          <div style={{ position: "absolute", top: "-130px", left: 0, right: 0, height: "480px" }}>
            <CircularGallery
              items={galleryItems}
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
              showLabel={false}
              onSnap={(item) => { if (item) { setSelected(item.text); setFlipped(false); } }}
            />
          </div>
          {/* Gradient fade at bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "90px", background: "linear-gradient(to bottom, transparent, #111)", pointerEvents: "none", zIndex: 10 }} />
          {/* Detail — same position as WebGL card, scaleX flip so it feels like the card back */}
          {flipped && selectedCity && (
            <div className="pl-detail-card" onClick={() => setFlipped(false)}>
              <img src={selectedCity.img.replace("w=300&h=300", "w=800&h=600")} alt="" className="pl-detail-card-bg" />
              <div className="pl-detail-card-content">
                <div style={{ fontSize: 30, lineHeight: 1 }}>{selectedCity.emoji}</div>
                <div className="pl-detail-city-name">{selectedCity.label}</div>
                <div className="pl-detail-city-country">{selectedCity.country}</div>
                <div className="pl-detail-city-desc">{selectedCity.desc}</div>
                <div style={{ marginTop: "auto", paddingTop: 10 }}>
                  <div className="pl-detail-label">Best time to visit</div>
                  <div className="pl-detail-besttime">{selectedCity.bestTime}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {selectedCity.vibes.map(v => (
                      <span key={v} className="pl-detail-vibe">{v}</span>
                    ))}
                  </div>
                </div>
                <div className="pl-detail-hint">tap to go back</div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`pl-sheet-cta${!canConfirm ? " pl-sheet-cta--disabled" : ""}`}
        disabled={!canConfirm}
        onClick={() => { if (canConfirm) { onSelect(selected); onClose(); } }}
      >
        {buttonLabel}
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
    </BottomSheet>
  );
}

/* ── Budget selector — spinnable dial ── */
/* 50 ticks, each tick = $200, range $0–$10,000 */
const MIN_BUDGET = 0;
const MAX_BUDGET = 10000;
const TICK_COUNT = 50;
const TICK_VALUE = 200; // each tick = $200

function budgetToAngle(budget) {
  const t = Math.max(0, Math.min(1, budget / MAX_BUDGET));
  return t * 270 - 135;
}

function angleToBudget(angle) {
  const t = (angle + 135) / 270;
  const clamped = Math.max(0, Math.min(1, t));
  const raw = clamped * MAX_BUDGET;
  // Snap to nearest $100 (one tick)
  return Math.round(raw / TICK_VALUE) * TICK_VALUE;
}

function getBudgetLabel(amount) {
  if (amount <= 1000) return "Budget";
  if (amount <= 3000) return "Mid-Range";
  if (amount <= 7000) return "Luxury";
  return "Ultra-Luxury";
}

function RangeSlider({ min, max, rangeMin, rangeMax, step, onChangeMin, onChangeMax }) {
  const trackRef = useRef(null);
  const draggingThumb = useRef(null); // "min" | "max" | null

  const pctMin = ((rangeMin - min) / (max - min)) * 100;
  const pctMax = ((rangeMax - min) / (max - min)) * 100;

  const getValueFromEvent = (e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    return Math.round(raw / step) * step;
  };

  const handleStart = (thumb) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingThumb.current = thumb;
  };

  const handleTrackClick = (e) => {
    if (draggingThumb.current) return;
    const val = getValueFromEvent(e);
    const distMin = Math.abs(val - rangeMin);
    const distMax = Math.abs(val - rangeMax);
    if (distMin <= distMax) {
      onChangeMin(Math.min(val, rangeMax));
    } else {
      onChangeMax(Math.max(val, rangeMin));
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingThumb.current) return;
      e.preventDefault();
      const val = getValueFromEvent(e);
      if (draggingThumb.current === "min") {
        onChangeMin(Math.min(val, rangeMax));
      } else {
        onChangeMax(Math.max(val, rangeMin));
      }
    };
    const onEnd = () => { draggingThumb.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [rangeMin, rangeMax]);

  return (
    <div className="pl-rslider">
      {/* Track */}
      <div className="pl-rslider-track" ref={trackRef} onMouseDown={handleTrackClick} onTouchStart={handleTrackClick}>
        <div className="pl-rslider-fill" style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }} />
        {/* Min thumb */}
        <div
          className="pl-rslider-thumb pl-rslider-thumb-min"
          style={{ left: `${pctMin}%` }}
          onMouseDown={handleStart("min")}
          onTouchStart={handleStart("min")}
        >
          <div className="pl-rslider-thumb-glow" />
        </div>
        {/* Max thumb */}
        <div
          className="pl-rslider-thumb pl-rslider-thumb-max"
          style={{ left: `${pctMax}%` }}
          onMouseDown={handleStart("max")}
          onTouchStart={handleStart("max")}
        >
          <div className="pl-rslider-thumb-glow" />
        </div>
      </div>
      {/* Scale labels */}
      <div className="pl-rslider-labels">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}

const B_TICK_SPACING = 28;
const B_PAD = 10;

function HorizontalBudgetRuler({ value, onChange, constraintMin = 0, constraintMax = MAX_BUDGET }) {
  const dragStartX = useRef(null);
  const dragStartVal = useRef(null);
  const stepIndex = value / TICK_VALUE;
  const rulerOffset = (B_PAD + stepIndex) * B_TICK_SPACING;

  const doChange = (clientX) => {
    if (dragStartX.current === null) return;
    const delta = Math.round((clientX - dragStartX.current) / B_TICK_SPACING);
    const newVal = Math.max(constraintMin, Math.min(constraintMax, dragStartVal.current + delta * TICK_VALUE));
    onChange(newVal);
  };

  return (
    <div style={{ position: "relative", margin: "0 -28px", overflow: "hidden" }}>
      <div
        onMouseDown={e => { dragStartX.current = e.clientX; dragStartVal.current = value; }}
        onMouseMove={e => e.buttons === 1 && doChange(e.clientX)}
        onMouseUp={() => { dragStartX.current = null; }}
        onTouchStart={e => { dragStartX.current = e.touches[0].clientX; dragStartVal.current = value; }}
        onTouchMove={e => { e.preventDefault(); doChange(e.touches[0].clientX); }}
        onTouchEnd={() => { dragStartX.current = null; }}
        style={{
          touchAction: "none", userSelect: "none", cursor: "ew-resize",
          height: 80, position: "relative", overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg,rgba(14,14,18,1),rgba(14,14,18,0))", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg,rgba(14,14,18,1),rgba(14,14,18,0))", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 3, pointerEvents: "none" }}>
          <div style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "10px solid #ff8c42" }} />
        </div>
        <div style={{ position: "absolute", top: 10, bottom: 12, left: "50%", transform: "translateX(-50%)", width: 2, borderRadius: 1, background: "linear-gradient(180deg,rgba(255,140,66,0.5),rgba(255,140,66,0))", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(50% - ${rulerOffset}px)`, display: "flex" }}>
          {Array.from({ length: B_PAD }).map((_, i) => <div key={`l${i}`} style={{ width: B_TICK_SPACING, flexShrink: 0 }} />)}
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const tickVal = i * TICK_VALUE;
            const isMajor = i % 5 === 0;
            const isSel = tickVal === value;
            return (
              <div key={i}
                onClick={() => onChange(Math.max(constraintMin, Math.min(constraintMax, tickVal)))}
                style={{ width: B_TICK_SPACING, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 12, cursor: "pointer", height: "100%" }}
              >
                <div style={{
                  width: isSel ? 3 : isMajor ? 2 : 1.5,
                  height: isSel ? 46 : isMajor ? 28 : 14,
                  borderRadius: 2,
                  background: isSel ? "linear-gradient(180deg,#ff8c42,#ff5f1f)" : isMajor ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
                  boxShadow: isSel ? "0 2px 10px rgba(255,140,66,0.5)" : "none",
                  transition: "height 0.15s cubic-bezier(0.34,1.56,0.64,1), background 0.15s",
                }} />
                {isMajor && (
                  <span style={{ fontSize: 9, fontWeight: 700, lineHeight: 1, marginTop: 4, color: isSel ? "#ff9a52" : "rgba(255,255,255,0.2)", letterSpacing: 0.2 }}>
                    {tickVal === 0 ? "$0" : tickVal >= 1000 ? `$${tickVal / 1000}k` : `$${tickVal}`}
                  </span>
                )}
              </div>
            );
          })}
          {Array.from({ length: B_PAD }).map((_, i) => <div key={`r${i}`} style={{ width: B_TICK_SPACING, flexShrink: 0 }} />)}
        </div>
      </div>
    </div>
  );
}

function BudgetSheet({ open, onClose, value, onSelect }) {
  const [mode, setMode] = useState("single"); // "single" | "range"
  const [amount, setAmount] = useState(MIN_BUDGET);
  const [rangeMin, setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(10000);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);
  const dialRef = useRef(null);
  const dragging = useRef(false);
  const activePointer = useRef(null);

  useEffect(() => {
    if (open) {
      if (value && value.includes("–")) {
        setMode("range");
        const parts = value.replace(/[$,]/g, "").split("–").map(s => parseInt(s.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          setRangeMin(parts[0]);
          setRangeMax(parts[1]);
        }
      } else if (value && value.startsWith("$")) {
        setMode("single");
        const num = parseInt(value.replace(/[$,]/g, ""), 10);
        setAmount(isNaN(num) ? 0 : num);
      } else {
        const map = { "Budget": 1000, "Mid-Range": 3000, "Luxury": 7000, "Ultra-Luxury": 10000 };
        setAmount(map[value] || 0);
      }
    }
  }, [open, value]);

  const rotation = budgetToAngle(amount);

  const getAngleFromEvent = (e, rect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle > 180) angle -= 360;
    return Math.max(-135, Math.min(135, angle));
  };

  const handleStart = (e) => {
    if (!dialRef.current) return;
    if (e.target.closest && e.target.closest('.pl-dial-inner')) return;
    dragging.current = true;
    const rect = dialRef.current.getBoundingClientRect();
    const angle = getAngleFromEvent(e, rect);
    activePointer.current = "single";
    setAmount(angleToBudget(angle));
  };

  const handleMove = (e) => {
    if (!dragging.current || !dialRef.current) return;
    e.preventDefault();
    const rect = dialRef.current.getBoundingClientRect();
    const angle = getAngleFromEvent(e, rect);
    setAmount(angleToBudget(angle));
  };

  const handleEnd = () => {
    dragging.current = false;
    activePointer.current = null;
  };


  useEffect(() => {
    if (!open || mode !== "single") return;
    const onMove = (e) => handleMove(e);
    const onEnd = () => handleEnd();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [open, mode]);


  const label = mode === "single" ? getBudgetLabel(amount) : `${getBudgetLabel(rangeMin)} – ${getBudgetLabel(rangeMax)}`;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pl-budget-header">
        <span className="pl-budget-icon-wrap">
          <FontAwesomeIcon icon={faCreditCard} style={{ width: 18, height: 14, color: "rgba(255,255,255,0.5)" }} />
        </span>
        <span className="pl-budget-title">Total Budget</span>
        <div className="pl-budget-toggle">
          <button className={`pl-budget-toggle-btn ${mode === "single" ? "pl-budget-toggle-active" : ""}`} onClick={() => setMode("single")}>Single</button>
          <button className={`pl-budget-toggle-btn ${mode === "range" ? "pl-budget-toggle-active" : ""}`} onClick={() => setMode("range")}>Range</button>
        </div>
      </div>

      <div className="pl-budget-content">
      {mode === "single" ? (
        /* ── Single: Rotary Dial ── */
        <div className="pl-dial-wrap">
          <div
            className="pl-dial-outer"
            ref={dialRef}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{ cursor: "grab", userSelect: "none", touchAction: "none" }}
          >
            {/* Arc progress SVG */}
            {(() => {
              const R = 108, CX = 120, CY = 120;
              const totalLen = (270 / 360) * 2 * Math.PI * R; // 270° arc
              const progress = (rotation + 135) / 270;
              const dashOffset = totalLen * (1 - Math.max(0, Math.min(1, progress)));
              return (
                <svg className="pl-dial-arc-svg" width="240" height="240" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
                  {/* Track */}
                  <path d="M 43.6 196.4 A 108 108 0 1 1 196.4 196.4"
                    fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" strokeLinecap="round" />
                  {/* Progress */}
                  <path d="M 43.6 196.4 A 108 108 0 1 1 196.4 196.4"
                    fill="none" stroke="#ff8c42" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={totalLen} strokeDashoffset={dashOffset}
                    style={{ filter: "drop-shadow(0 0 5px rgba(255,140,66,0.7))", transition: "stroke-dashoffset 0.25s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </svg>
              );
            })()}
            {Array.from({ length: 36 }).map((_, i) => {
              // 36 ticks = $0…$3500 in $100 steps, constrained to the 270° active range
              const a = -135 + (i / 35) * 270;
              const isMajor = i % 5 === 0; // every $500
              const isActive = a <= rotation;
              return (
                <div
                  key={i}
                  className={`pl-dial-tick ${isMajor ? "pl-dial-tick-major" : ""}`}
                  style={{
                    transform: `rotate(${a}deg)`,
                    background: isActive
                      ? (isMajor ? "rgba(255,140,66,0.9)" : "rgba(255,140,66,0.45)")
                      : undefined,
                  }}
                />
              );
            })}
            <div className="pl-dial-pointer" style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="pl-dial-pointer-dot" />
            </div>
            <div
              className="pl-dial-inner"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
                setInputVal(String(amount));
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="pl-dial-unit">USD</span>
              {editing ? (
                <span className="pl-dial-amount">
                  <span className="pl-dial-dollar">$</span>
                  <input
                    ref={inputRef}
                    className="pl-dial-input"
                    type="number"
                    min="0"
                    max="3500"
                    step="100"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onBlur={() => {
                      const v = Math.max(0, Math.min(MAX_BUDGET, Math.round(Number(inputVal) / TICK_VALUE) * TICK_VALUE));
                      setAmount(isNaN(v) ? 0 : v);
                      setEditing(false);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                </span>
              ) : (
                <span className="pl-dial-amount">
                  <span className="pl-dial-dollar">$</span>
                  {amount.toLocaleString()}
                </span>
              )}
              <div className="pl-dial-dots">
                {BUDGET_STEPS.map((b, i) => (
                  <span key={i} className={`pl-dial-dot ${b.label === label ? "pl-dial-dot-active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="pl-dial-range">
            <span>MIN $0</span>
            <span>MAX $10,000</span>
          </div>
        </div>
      ) : (
        /* ── Range: Dual Horizontal Rulers ── */
        <div style={{ width: "100%", paddingTop: 4 }}>
          {/* MIN ruler */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 0 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase" }}>Min</span>
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.5, color: "#fff", lineHeight: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>$</span>{rangeMin.toLocaleString()}
              </span>
            </div>
            <HorizontalBudgetRuler value={rangeMin} onChange={setRangeMin} constraintMin={0} constraintMax={rangeMax - TICK_VALUE} />
          </div>
          {/* MAX ruler */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "12px 0 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase" }}>Max</span>
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.5, color: "#fff", lineHeight: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>$</span>{rangeMax.toLocaleString()}
              </span>
            </div>
            <HorizontalBudgetRuler value={rangeMax} onChange={setRangeMax} constraintMin={rangeMin + TICK_VALUE} constraintMax={MAX_BUDGET} />
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>← swipe to adjust →</div>
        </div>
      )}
      </div>

      {mode === "single" ? (
        <div className="pl-budget-segments">
          {BUDGET_STEPS.map((b) => (
            <button
              key={b.label}
              className={`pl-budget-seg ${b.label === getBudgetLabel(amount) ? "pl-budget-seg-active" : ""}`}
              onClick={() => {
                const map = { "Budget": 1000, "Mid-Range": 3000, "Luxury": 7000, "Ultra-Luxury": 10000 };
                setAmount(map[b.label]);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="pl-budget-segments">
          {[
            { label: "Budget", min: 0, max: 2000 },
            { label: "Mid-Range", min: 2000, max: 5000 },
            { label: "Luxury", min: 5000, max: 10000 },
            { label: "Flexible", min: 0, max: 10000 },
          ].map((p) => {
            const isActive = Math.abs(rangeMin - p.min) <= 50 && Math.abs(rangeMax - p.max) <= 50;
            return (
              <button
                key={p.label}
                className={`pl-budget-seg ${isActive ? "pl-budget-seg-active" : ""}`}
                onClick={() => { setRangeMin(p.min); setRangeMax(p.max); }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        className="pl-sheet-cta"
        onClick={() => {
          if (mode === "single") {
            onSelect(`$${amount.toLocaleString()}`);
          } else {
            onSelect(`$${rangeMin.toLocaleString()} – $${rangeMax.toLocaleString()}`);
          }
          onClose();
        }}
      >
        Set Budget
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
      <p className="pl-sheet-hint">{mode === "single" ? "Drag around the dial to adjust, or tap a preset below" : "Drag either pointer to set your budget range"}</p>
    </BottomSheet>
  );
}

/* ── Travel Style / Interests — orbital ring (Figma 624:11700) ── */
function StyleSheet({ open, onClose, value, onSelect }) {
  const [selected, setSelected] = useState(() => value ? [value] : []);

  useEffect(() => {
    if (open) setSelected(value ? [value] : []);
  }, [open, value]);

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const selectedCount = selected.length;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="pl-sheet-title">Select Interests</h2>
      <p className="pl-sheet-subtitle">Swipe to explore, tap to collect</p>

      <div className="pl-interest-orbit">
        <div className="pl-orbit-ring pl-orbit-ring-inner" />
        <div className="pl-orbit-ring pl-orbit-ring-outer" />
        {INTEREST_OPTIONS.map((item, i) => {
          const angle = (i / INTEREST_OPTIONS.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 120;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          const isActive = selected.includes(item.label);
          return (
            <button
              key={item.label}
              className={`pl-orbit-item ${isActive ? "pl-orbit-item-active" : ""}`}
              style={{ transform: `translate(${x}px, ${y}px)`, '--ox': `${x}px`, '--oy': `${y}px` }}
              onClick={() => toggle(item.label)}
            >
              <InterestIcon type={item.icon} active={isActive} />
              <span className="pl-orbit-item-label">{item.label}</span>
            </button>
          );
        })}
        <div className="pl-orbit-center">
          <span className="pl-orbit-center-label">SELECTED</span>
          <div className="pl-orbit-dots">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`pl-orbit-dot ${i < selectedCount ? "pl-orbit-dot-active" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <button
        className="pl-sheet-cta"
        onClick={() => {
          if (selected.length > 0) {
            onSelect(selected.length === 1 ? selected[0] : `${selected.length} Interests`);
            onClose();
          }
        }}
      >
        Confirm Selection
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
    </BottomSheet>
  );
}

/* ── Duration selector ── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function formatDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  if (diff <= 1) return "1 Day";
  if (diff < 7) return `${diff} Days`;
  if (diff === 7) return "1 Week";
  if (diff < 14) return `${diff} Days`;
  if (diff === 14) return "2 Weeks";
  if (diff < 21) return `${diff} Days`;
  if (diff === 21) return "3 Weeks";
  if (diff < 30) return `${diff} Days`;
  if (diff === 30) return "1 Month";
  return `${diff} Days`;
}
function dateDiffDays(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function CalendarMonth({ year, month, startDate, endDate, hoveredDate, onDayClick, onDayHover, today, isFirst }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = hoveredDate && startDate && !endDate ? hoveredDate : endDate;
  const rangeStart = startDate;

  function dayState(date) {
    if (!date) return "empty";
    const d = startOfDay(date);
    const isPast = d < startOfDay(today);
    if (isPast) return "past";
    const isStart = rangeStart && isSameDay(d, rangeStart);
    const isEnd = rangeEnd && isSameDay(d, rangeEnd);
    const inRange = rangeStart && rangeEnd && d > startOfDay(rangeStart) && d < startOfDay(rangeEnd);
    if (isStart && isEnd) return "single";
    if (isStart) return "start";
    if (isEnd) return "end";
    if (inRange) return "in-range";
    return "normal";
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", rowGap: 2 }}>
        {/* Weekday headers */}
        {WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", paddingBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>{w}</div>
        ))}

        {cells.map((date, i) => {
          const state = dayState(date);
          if (state === "empty") return <div key={`e${i}`} style={{ height: 44 }} />;
          const isStart = state === "start" || state === "single";
          const isEnd = state === "end" || state === "single";
          const inRange = state === "in-range";
          const isPast = state === "past";
          const isToday = isSameDay(date, today);

          // Range pill background — extends edge-to-edge between start and end
          const rangeLeft = isStart && !isEnd ? "50%" : (inRange || isEnd) ? "0%" : "50%";
          const rangeRight = isEnd && !isStart ? "50%" : (inRange || isStart) ? "0%" : "50%";
          const showRange = (inRange || isStart || isEnd) && !(isStart && isEnd);

          return (
            <div
              key={date.toISOString()}
              onClick={() => !isPast && onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              style={{ position: "relative", height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: isPast ? "default" : "pointer" }}
            >
              {/* Range fill band */}
              {showRange && (
                <div style={{
                  position: "absolute", top: 5, bottom: 5,
                  left: rangeLeft, right: rangeRight,
                  background: "rgba(255,255,255,0.08)",
                  pointerEvents: "none",
                }} />
              )}

              {/* Day circle */}
              <div style={{
                position: "relative", zIndex: 1,
                width: 36, height: 36,
                borderRadius: "50%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: (isStart || isEnd) ? "#fff" : "transparent",
                boxShadow: (isStart || isEnd) ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
                transition: "background 0.14s, box-shadow 0.14s",
              }}>
                <span style={{
                  fontSize: 14, lineHeight: 1,
                  fontWeight: (isStart || isEnd) ? 700 : isToday ? 700 : 400,
                  color: isPast
                    ? "rgba(255,255,255,0.13)"
                    : (isStart || isEnd)
                    ? "#09090f"
                    : isToday
                    ? "#ff9a52"
                    : inRange
                    ? "#fff"
                    : "rgba(255,255,255,0.7)",
                }}>
                  {date.getDate()}
                </span>
                {/* Today dot */}
                {isToday && !(isStart || isEnd) && (
                  <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#ff8c42", marginTop: 3 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DurationSheet({ open, onClose, value, onSelect }) {
  const [today, setToday] = useState(() => startOfDay(new Date(2025, 0, 1)));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth, setViewMonth] = useState(0);

  // Set real today on client to avoid SSR mismatch
  useEffect(() => {
    const t = startOfDay(new Date());
    setToday(t);
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
  }, []);

  useEffect(() => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
      setHoveredDate(null);
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
    }
  }, [open]);

  function handleDayClick(date) {
    const d = startOfDay(date);
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
    } else {
      if (d < startDate) {
        setStartDate(d);
        setEndDate(null);
      } else {
        setEndDate(d);
        setHoveredDate(null);
      }
    }
  }

  const rangeEnd = hoveredDate && startDate && !endDate ? startOfDay(hoveredDate) : endDate;
  const days = startDate && rangeEnd ? dateDiffDays(startDate, rangeEnd) : null;
  const label = days ? formatDuration(startDate, rangeEnd) : null;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;

  const fmtDate = d => d?.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <BottomSheet open={open} onClose={onClose} sheetStyle={{ paddingBottom: 32 }}>

      {/* Date range summary — two cards + connector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, marginTop: 4, width: "100%" }}>
        {/* Depart card */}
        <div style={{
          flex: 1, minWidth: 0, borderRadius: 16, padding: "14px 16px",
          background: startDate ? "#fff" : "rgba(255,255,255,0.06)",
          border: startDate ? "none" : "1px solid rgba(255,255,255,0.09)",
          transition: "background 0.2s, border 0.2s",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 5,
            color: startDate ? "rgba(9,9,15,0.4)" : "rgba(255,255,255,0.28)" }}>Depart</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4, whiteSpace: "nowrap",
            color: startDate ? "#09090f" : "rgba(255,255,255,0.2)" }}>
            {startDate ? fmtDate(startDate) : "Add date"}
          </div>
        </div>

        {/* Connector */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
          {days && <div style={{ fontSize: 10, fontWeight: 800, color: "#ff8c42", letterSpacing: -0.2 }}>{days}d</div>}
          <div style={{ width: 24, height: 1.5, background: days ? "linear-gradient(90deg,#ff9a52,#ff5f1f)" : "rgba(255,255,255,0.12)", borderRadius: 2 }} />
        </div>

        {/* Return card */}
        <div style={{
          flex: 1, minWidth: 0, borderRadius: 16, padding: "14px 16px",
          background: rangeEnd ? "#fff" : "rgba(255,255,255,0.06)",
          border: rangeEnd ? "none" : "1px solid rgba(255,255,255,0.09)",
          transition: "background 0.2s, border 0.2s",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 5,
            color: rangeEnd ? "rgba(9,9,15,0.4)" : "rgba(255,255,255,0.28)" }}>Return</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4, whiteSpace: "nowrap",
            color: rangeEnd ? "#09090f" : "rgba(255,255,255,0.2)" }}>
            {rangeEnd ? fmtDate(rangeEnd) : "Add date"}
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 2px", width: "100%" }}>
        <button
          onClick={prevMonth} disabled={!canGoPrev}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "transparent",
            color: canGoPrev ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)",
            fontSize: 22, cursor: canGoPrev ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}
        >‹</button>
        <div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: -0.4 }}>{MONTH_NAMES[viewMonth]}</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.25)", marginLeft: 6 }}>{viewYear}</span>
        </div>
        <button
          onClick={nextMonth}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}
        >›</button>
      </div>

      {/* Hint pill */}
      {(!startDate || !endDate) && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
            color: "rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.05)", borderRadius: 20,
            padding: "4px 14px",
          }}>
            {!startDate ? "Tap a date to set departure" : "Now tap a return date"}
          </span>
        </div>
      )}

      {/* Single-month calendar */}
      <div onMouseLeave={() => setHoveredDate(null)}>
        <CalendarMonth
          year={viewYear} month={viewMonth}
          startDate={startDate} endDate={endDate} hoveredDate={rangeEnd}
          onDayClick={handleDayClick}
          onDayHover={d => !endDate && startDate && setHoveredDate(startOfDay(d))}
          today={today}
        />
      </div>

      <button
        className="pl-sheet-cta"
        disabled={!startDate || !endDate}
        onClick={() => { onSelect({ label, startDate, endDate }); onClose(); }}
        style={{ opacity: startDate && endDate ? 1 : 0.35, transition: "opacity 0.2s" }}
      >
        {startDate && endDate ? `Set ${label}` : "Select your dates"}
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: startDate && endDate ? "#000" : "rgba(0,0,0,0.4)" }} />
      </button>
    </BottomSheet>
  );
}


export function PlannerPage() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    ["/", "/nearby", "/trips", "/profile"].forEach(r => router.prefetch(r));
  }, [router]);
  const [travelType, setTravelType] = useState(0);
  const [travelOpen, setTravelOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [city, setCity] = useState(null);
  const [budget, setBudget] = useState(null);
  const [style, setStyle] = useState(null);
  const [duration, setDuration]         = useState(null);
  const [tripStartDate, setTripStartDate] = useState(null);
  const [tripEndDate,   setTripEndDate]   = useState(null);
  const [generating, setGenerating] = useState(false);

  const [activeSheet, setActiveSheet] = useState(null);
  const shellRef = useRef(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("nav-visibility-change", { detail: { hidden: !!activeSheet } }));
  }, [activeSheet]);

  // Entrance animation — clearProps:"filter" removes inline filter after animation
  // so it doesn't create a persistent stacking context that blocks pointer events
  useEffect(() => {
    if (!shellRef.current) return;
    const elements = shellRef.current.querySelectorAll(".pl-header, .pl-heading, .pl-card, .pl-actions");
    gsap.fromTo(elements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "transform,filter" }
    );
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTravelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Navigate after loading animation completes (~3.2s covers all 4 steps)
  useEffect(() => {
    if (!generating) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      if (duration) params.set("duration", duration);
      if (budget) params.set("budget", budget);
      if (style) params.set("prefs", style);
      if (tripStartDate) params.set("startDate", tripStartDate.toISOString().split("T")[0]);
      if (tripEndDate)   params.set("endDate",   tripEndDate.toISOString().split("T")[0]);
      params.set("ai", "true");
      router.push(`/planner/manual?${params.toString()}`);
    }, 3200);
    return () => clearTimeout(timer);
  }, [generating]);

  return (
    <div className="pl-shell" ref={shellRef}>
      {/* Aurora background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Aurora
          colorStops={["#F97316", "#97a1cf", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Header */}
      <div className="pl-header">
        <div className="pl-badge">AI TRAVEL PLANNER</div>
      </div>

      {/* Heading */}
      <div className="pl-heading">
        <h1 className="pl-title">Plan The Best<br />Trip To The</h1>
        <div className="pl-vacation-wrap" ref={dropdownRef}>
          <button className="pl-vacation-btn" onClick={() => setTravelOpen(!travelOpen)}>
            <span className="pl-vacation">{TRAVEL_TYPES[travelType]}</span>
            <FontAwesomeIcon icon={faChevronDown} className={`pl-vacation-arrow ${travelOpen ? "pl-vacation-arrow-open" : ""}`} style={{ width: 14, height: 14, color: "#ff7b4b" }} />
          </button>
          {travelOpen && (
              <div className="pl-travel-dropdown">
                {TRAVEL_TYPES.map((t, i) => (
                  <button
                    key={t}
                    className={`pl-travel-option ${i === travelType ? "pl-travel-option-active" : ""}`}
                    onClick={() => { setTravelType(i); setTravelOpen(false); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
          )}
        </div>
      </div>

      {/* Dropdown backdrop — rendered at shell level to avoid stacking context clipping */}
      {travelOpen && <div className="pl-dropdown-backdrop" onClick={() => setTravelOpen(false)} />}

      {/* Mad-libs card */}
      <div className="pl-card">
        <div className="pl-prompt">
          <div className="pl-prompt-line">
            I want to explore{" "}
            <button className={`pl-pill ${city ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("city")}>
              <span className="pl-pill-text">{city || "City/Region"}</span>
            </button>
          </div>
          <div className="pl-prompt-line">
            prefer a{" "}
            <button className={`pl-pill ${budget ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("budget")}>
              <span className="pl-pill-text">{budget || "Budget"}</span>
            </button>
            {" "}budget,
          </div>
          <div className="pl-prompt-line">
            my travel style is{" "}
            <button className={`pl-pill ${style ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("style")}>
              <span className="pl-pill-text">{style || "Type of Group"}</span>
            </button>
          </div>
          <div className="pl-prompt-line" style={{ marginBottom: 0 }}>
            for{" "}
            <button className={`pl-pill ${duration ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("duration")}>
              <span className="pl-pill-text">{duration || "Duration"}</span>
            </button>
            {" "}....
          </div>
        </div>
      </div>

      {/* Validation hint */}
      {!city && (
        <div style={{ textAlign: "center", marginTop: 20, marginBottom: 4, color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: 0.4, animation: "pl-fade-in 0.4s ease" }}>
          ↑ Choose a destination to get started
        </div>
      )}

      {/* Action buttons */}
      <div className="pl-actions">
        <Link
          href={`/planner/manual?city=${encodeURIComponent(city || "")}&duration=${encodeURIComponent(duration || "")}${budget ? `&budget=${encodeURIComponent(budget)}` : ""}${style ? `&style=${encodeURIComponent(style)}` : ""}`}
          className="pl-btn-inspire"
        >DIRECTLY CREATE</Link>
        <button
          className="pl-btn-generate"
          onClick={() => { if (city) setGenerating(true); }}
          style={{ opacity: city ? 1 : 0.45, cursor: city ? "pointer" : "not-allowed", transition: "opacity 0.2s" }}
          title={!city ? "Select a destination first" : undefined}
        >
          <div className="pl-uiverse-wrapper">
            <span>HELP ME PLAN</span>
            <div className="pl-circle pl-circle-12"></div>
            <div className="pl-circle pl-circle-11"></div>
            <div className="pl-circle pl-circle-10"></div>
            <div className="pl-circle pl-circle-9"></div>
            <div className="pl-circle pl-circle-8"></div>
            <div className="pl-circle pl-circle-7"></div>
            <div className="pl-circle pl-circle-6"></div>
            <div className="pl-circle pl-circle-5"></div>
            <div className="pl-circle pl-circle-4"></div>
            <div className="pl-circle pl-circle-3"></div>
            <div className="pl-circle pl-circle-2"></div>
            <div className="pl-circle pl-circle-1"></div>
          </div>
        </button>
      </div>

      {/* Generating loading overlay */}
      {generating && (
        <div className="pl-gen-overlay">
          {/* Aurora background for generating overlay */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }}>
            <Aurora colorStops={["#F97316", "#97a1cf", "#5227FF"]} blend={0.5} amplitude={1.0} speed={0.5} />
          </div>
          <div className="pl-gen-card">
            <div className="pl-gen-orb" />
            <div className="pl-gen-content">
              <p className="pl-gen-label">AI TRAVEL PLANNER</p>
              <h2 className="pl-gen-title">
                Crafting your<br />perfect trip
                {city ? <> to <span className="pl-gen-city">{city.split(",")[0]}</span></> : "…"}
              </h2>
              <p className="pl-gen-sub">Analysing destinations, weather, and hidden gems</p>
              <div className="pl-gen-steps">
                {[
                  { text: "Researching destination", delay: 0 },
                  { text: "Matching your style",     delay: 0.7 },
                  { text: "Building itinerary",       delay: 1.4 },
                  { text: "Finalising details",        delay: 2.1 },
                ].map(({ text, delay }) => (
                  <div key={text} className="pl-gen-step" style={{ animationDelay: `${delay}s` }}>
                    <span className="pl-gen-step-dot" style={{ animationDelay: `${delay}s` }} />
                    <span className="pl-gen-step-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="pl-gen-cancel" onClick={() => setGenerating(false)}>Cancel</button>
        </div>
      )}

      {/* Bottom sheets */}
      <CitySheet open={activeSheet === "city"} onClose={() => setActiveSheet(null)} value={city} onSelect={setCity} />
      <BudgetSheet open={activeSheet === "budget"} onClose={() => setActiveSheet(null)} value={budget} onSelect={setBudget} />
      <StyleSheet open={activeSheet === "style"} onClose={() => setActiveSheet(null)} value={style} onSelect={setStyle} />
      <DurationSheet open={activeSheet === "duration"} onClose={() => setActiveSheet(null)} value={duration}
        onSelect={({ label, startDate, endDate }) => { setDuration(label); setTripStartDate(startDate); setTripEndDate(endDate); }} />

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
