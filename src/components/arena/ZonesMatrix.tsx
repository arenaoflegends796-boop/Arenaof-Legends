import { useEffect, useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INR, scrollToId, useArena, type ZoneId } from "./state";

gsap.registerPlugin(ScrollTrigger);

type CardMeta = {
  id: ZoneId;
  title: string;
  glow: string;
  accent: string;
  btnStyle: string;
  seoDesc: string;
  specs: string[];
};

const CARDS_META: CardMeta[] = [
  {
    id: "ps5",
    title: "PlayStation 5 VIP Lounge",
    glow: "hover:shadow-[var(--shadow-cyan)] border-arena-cyan/30",
    accent: "text-arena-cyan",
    btnStyle: "btn-cta-ps5",
    seoDesc: "Premium PS5 gaming cafe in Bengaluru with 4K 120Hz OLED displays & DualSense controllers.",
    specs: [
      "2 × PS5 rigs with DualSense controllers & 4K 120Hz HDR",
      "Pro gaming recliners, 1 to 4 players per setup",
      "Available Games: God of War Ragnarök, EA FC 26, WWE 2K24, GTA V, Spider-Man 2, Mortal Kombat 1",
      "Zero-lag competitive setup billed per minute",
    ],
  },
  {
    id: "snooker",
    title: "English Snooker Championship Tables",
    glow: "hover:shadow-[var(--shadow-green)] border-arena-green/30",
    accent: "text-arena-green",
    btnStyle: "btn-cta-gold",
    seoDesc: "Professional Snooker tables in Peenya featuring Strachan 6811 cloth & match lighting.",
    specs: [
      "2 × tournament boards with Strachan 6811 West of England cloth",
      "Professional weighted brass cues & Aramith Tournament balls",
      "Precision overhead LED match lighting & digital scoreboards",
      "Spectator lounge with climate-controlled ambience",
    ],
  },
  {
    id: "french",
    title: "French Billiards / Carom Table",
    glow: "hover:shadow-[var(--shadow-crimson)] border-arena-crimson/30",
    accent: "text-arena-crimson",
    btnStyle: "btn-cta-snooker",
    seoDesc: "Heated French Carom table for 3-cushion practice & competitive cue sports in Peenya.",
    specs: [
      "1 × thermostatic heated tournament slate bed",
      "Super Aramith Carom balls & fine-nap billiard cloth",
      "Ideal for 3-cushion mastery & solo practice",
      "Coaching-friendly rail markings & video replay setup",
    ],
  },
];

const PS5_GAMES = [
  { title: "God of War Ragnarök", genre: "Action / Adventure", tag: "🔥 Top Rated", icon: "🪓", badge: "4K 60FPS" },
  { title: "EA FC 26", genre: "Sports / Football", tag: "⚽ Most Popular", icon: "⚽", badge: "4K 120FPS" },
  { title: "WWE 2K24", genre: "Fighting / Sports", tag: "🥊 Multi-player", icon: "🥊", badge: "4K HDR" },
  { title: "GTA V", genre: "Open World Action", tag: "🚗 Fan Favorite", icon: "🚗", badge: "4K 60FPS" },
  { title: "Spider-Man 2", genre: "Action / Superhero", tag: "🕷️ Ray Tracing", icon: "🕷️", badge: "4K 60FPS" },
  { title: "Mortal Kombat 1", genre: "Fighting / PvP", tag: "⚔️ Competitive", icon: "⚔️", badge: "4K 60FPS" },
];

export function ZonesMatrix() {
  const { selectZone, zonesData } = useArena();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".zone-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="zones" className="px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
            <Sparkles className="h-3.5 w-3.5 text-arena-green" /> Zones & Live Rates
          </span>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl text-gold-gradient">
            Pick Your Battlefield
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Experience Bengaluru's premier esports lounge and cue sports arena. Transparent per-minute billing with no hidden fees.
          </p>
        </header>

        <div
          ref={containerRef}
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        >
          {CARDS_META.map((meta) => {
            const zoneInfo = zonesData[meta.id];
            const currentRate = zoneInfo?.rate ?? 300;
            const emoji = zoneInfo?.emoji ?? "🎮";
            return (
              <article
                key={meta.id}
                className={`zone-card glass-panel flex w-[85vw] shrink-0 snap-center flex-col gap-4 border p-6 transition-all duration-300 lg:w-auto ${meta.glow}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{emoji}</span>
                  <div className="text-right">
                    <span className={`font-display text-2xl font-black ${meta.accent}`}>
                      {INR(currentRate)}
                    </span>
                    <p className="text-xs font-bold text-muted-foreground">
                      /hr · {INR(Math.round(currentRate / 60))}/min
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{meta.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{meta.seoDesc}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5 text-sm text-muted-foreground my-2">
                  {meta.specs.map((s) => (
                    <li key={s} className="flex gap-2">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${meta.accent}`} />
                      <span className="min-w-0 text-xs sm:text-sm">{s}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    selectZone(meta.id);
                    scrollToId("booking");
                  }}
                  className={`w-full rounded-xl py-3 text-sm font-extrabold tap-target shadow-lg ${meta.btnStyle}`}
                >
                  Book This Zone
                </button>
              </article>
            );
          })}
        </div>

        {/* Available PS5 Games Library Grid */}
        <div className="mt-16 rounded-3xl glass-panel p-6 sm:p-8 border border-arena-cyan/30 shadow-[var(--shadow-cyan)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-arena-cyan">
                🎮 PlayStation 5 Library
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black text-foreground">
                Available PS5 Games
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                All titles pre-installed on high-speed NVMe M.2 SSDs for instant load times.
              </p>
            </div>
            <button
              onClick={() => {
                selectZone("ps5");
                scrollToId("booking");
              }}
              className="rounded-xl btn-cta-ps5 px-5 py-2.5 text-xs font-extrabold tap-target"
            >
              Book PS5 Station Now
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PS5_GAMES.map((game) => (
              <div
                key={game.title}
                className="group relative rounded-2xl border border-arena-cyan/20 bg-accent/20 p-4 transition-all duration-300 hover:border-arena-cyan/60 hover:bg-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <h4 className="font-display text-base font-bold text-foreground group-hover:text-arena-cyan transition-colors">
                        {game.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{game.genre}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-arena-gold/10 pt-3">
                  <span className="text-[11px] font-extrabold text-arena-gold">{game.tag}</span>
                  <span className="rounded-md bg-arena-cyan/15 px-2 py-0.5 text-[10px] font-bold text-arena-cyan border border-arena-cyan/30">
                    {game.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
