import { Gamepad2, Target, Trophy, Zap } from "lucide-react";
import { scrollToId } from "./state";

const BADGES = [
  { icon: "🎮", text: "2x PS5 VIP Stations (₹300/hr)", cls: "text-arena-cyan border-arena-cyan/40" },
  {
    icon: "🎱",
    text: "2x English Snooker Boards (₹240/hr)",
    cls: "text-arena-green border-arena-green/40",
  },
  {
    icon: "🥖",
    text: "1x French Board (₹160/hr)",
    cls: "text-arena-crimson border-arena-crimson/40",
  },
  { icon: "⏱️", text: "Per-Minute Billing Available", cls: "text-arena-gold border-arena-gold/40" },
];

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-4 pb-16 pt-28 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-arena-gold/30 bg-accent/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-arena-gold">
          Play • Compete • Win • Repeat
        </span>

        <h1 className="mt-6 font-display text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
          <span className="text-gold-gradient">PLAY. COMPETE.</span>
          <br />
          <span className="text-foreground">WIN. REPEAT.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Elite PlayStation 5 VIP setups, championship English Snooker, and French Billiards. Zero
          lag, pro-grade equipment, pure competition.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button
            onClick={() => scrollToId("booking")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl gold-gradient px-6 py-4 text-base font-extrabold text-arena-dark shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] tap-target"
          >
            <Zap className="h-5 w-5" /> Reserve Console or Snooker Table
          </button>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => (
            <li
              key={b.text}
              className={`glass-panel flex items-center gap-2 border px-3 py-3 text-left text-sm font-semibold ${b.cls}`}
            >
              <span className="shrink-0 text-lg">{b.icon}</span>
              <span className="min-w-0">{b.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-arena-cyan" /> 4K 120Hz
          </span>
          <span className="inline-flex items-center gap-2">
            <Target className="h-4 w-4 text-arena-green" /> 6811 Tournament Cloth
          </span>
          <span className="inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-arena-gold" /> Pro Match Setup
          </span>
        </div>
      </div>
    </section>
  );
}
