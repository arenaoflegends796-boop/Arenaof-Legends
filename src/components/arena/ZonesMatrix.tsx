import { Check } from "lucide-react";
import { INR, scrollToId, useArena, type ZoneId } from "./state";

type CardMeta = {
  id: ZoneId;
  title: string;
  glow: string;
  accent: string;
  specs: string[];
};

const CARDS_META: CardMeta[] = [
  {
    id: "ps5",
    title: "PlayStation 5 VIP Lounge",
    glow: "hover:shadow-[var(--shadow-cyan)] border-arena-cyan/30",
    accent: "text-arena-cyan",
    specs: [
      "2 × PS5 rigs with DualSense controllers",
      "4K 120Hz displays, pro gaming recliners",
      "2–4 players per setup",
      "EA FC, Mortal Kombat, WWE 2K, GTA V, Spider-Man, Rocket League, Tekken",
    ],
  },
  {
    id: "snooker",
    title: "English Snooker Championship Tables",
    glow: "hover:shadow-[var(--shadow-green)] border-arena-green/30",
    accent: "text-arena-green",
    specs: [
      "2 × tournament boards, 6811 championship cloth",
      "Professional brass cue sets, pro chalk & rests",
      "Overhead precision match lighting",
      "Digital scoreboard + spectator lounge",
    ],
  },
  {
    id: "french",
    title: "French Billiards / Carom Table",
    glow: "hover:shadow-[var(--shadow-crimson)] border-arena-crimson/30",
    accent: "text-arena-crimson",
    specs: [
      "1 × heated tournament bed",
      "Precision carom balls, fine-nap cloth",
      "Ideal for 3-cushion practice",
      "Coaching-friendly rail markings",
    ],
  },
];

export function ZonesMatrix() {
  const { selectZone, zonesData } = useArena();

  return (
    <section id="zones" className="px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
            Zones & Rates
          </span>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Pick your battlefield
          </h2>
          <p className="mt-3 text-muted-foreground">
            Straight hourly rates. No packages you don't need, no hidden extras.
          </p>
        </header>

        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {CARDS_META.map((meta) => {
            const zoneInfo = zonesData[meta.id];
            const currentRate = zoneInfo?.rate ?? 300;
            const emoji = zoneInfo?.emoji ?? "🎮";
            return (
              <article
                key={meta.id}
                className={`glass-panel flex w-[85vw] shrink-0 snap-center flex-col gap-4 border p-6 transition-shadow lg:w-auto ${meta.glow}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{emoji}</span>
                  <span className={`font-display text-2xl font-black ${meta.accent}`}>
                    {INR(currentRate)}
                    <span className="text-sm font-bold text-muted-foreground">
                      /hr · {INR(Math.round(currentRate / 60))}/min
                    </span>
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold">{meta.title}</h3>
                <ul className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                  {meta.specs.map((s) => (
                    <li key={s} className="flex gap-2">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${meta.accent}`} />
                      <span className="min-w-0">{s}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    selectZone(meta.id);
                    scrollToId("booking");
                  }}
                  className="rounded-xl gold-gradient px-4 py-3 font-extrabold text-arena-dark transition-shadow hover:shadow-[var(--shadow-gold)] tap-target"
                >
                  Book This Zone
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
