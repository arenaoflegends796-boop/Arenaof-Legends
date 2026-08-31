import { useState } from "react";
import { ChevronDown, MapPin, MessageCircle, Star, Trophy } from "lucide-react";
import { WHATSAPP } from "./state";

const RULES = [
  {
    q: "Equipment etiquette",
    a: "No food or drinks on tables or consoles. Cues stay in the rack when not in play, and controllers must be handed back at the counter after every session.",
  },
  {
    q: "Advance booking confirmation",
    a: "Slots are confirmed over WhatsApp within 15 minutes. Please arrive 10 minutes before your slot; unclaimed stations are released after 15 minutes.",
  },
  {
    q: "Controller & cue care",
    a: "Report any drift, worn tips or damaged cloth immediately. Deliberate damage to cues, cloth or DualSense controllers is chargeable at replacement cost.",
  },
  {
    q: "Billing by the minute",
    a: "Sessions are billed per minute from your start time, rounded to the nearest minute. Extend anytime at the counter if a station is free.",
  },
];

const REVIEWS = [
  {
    name: "Rohit K.",
    text: "Zero lag on the PS5 rigs and the recliners are unreal. Per-minute billing is a great touch.",
  },
  {
    name: "Aditya S.",
    text: "Snooker cloth and lighting are genuinely match grade. Best boards in the city.",
  },
  {
    name: "Faizan M.",
    text: "Booked the full arena lockout for our LAN night. Staff handled everything for us.",
  },
];

export function VenueInfo() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section id="leaderboard" className="px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <header className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
              Social Proof
            </span>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
              Rated by the regulars
            </h2>
          </header>

          <div className="glass-panel mt-6 flex flex-wrap items-center gap-4 p-5">
            <span className="inline-flex items-center gap-2 font-display text-3xl font-black text-arena-gold">
              4.9
              <Star className="h-6 w-6 fill-arena-gold text-arena-gold" />
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              Verified Google Reviews from competitive gamers and cue-sports players
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <article key={r.name} className="glass-panel p-5">
                <div className="flex gap-1 text-arena-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-arena-gold" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
                <p className="mt-3 text-sm font-bold">{r.name}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-3">
            <h3 className="font-display text-xl font-black">
              <Trophy className="mr-2 inline h-5 w-5 text-arena-gold" />
              Player guidelines
            </h3>
            {RULES.map((r, i) => (
              <div key={r.q} className="glass-panel overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left tap-target"
                >
                  <span className="min-w-0 font-bold">{r.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-arena-gold transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{r.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="px-4 pb-28 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="glass-panel p-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
              Location
            </span>
            <h2 className="mt-3 font-display text-3xl font-black">Find the arena</h2>
            <p className="mt-4 flex gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-arena-crimson" />
              <span>
                Arena of Legends, 2nd Floor, Vasanth Plaza, MG Road, Bengaluru 560001
              </span>
            </p>
            <dl className="mt-5 grid gap-2 text-sm">
              <div className="flex justify-between border-b border-arena-gold/10 pb-2">
                <dt className="text-muted-foreground">Mon – Thu</dt>
                <dd className="font-bold">11:00 AM – 12:00 AM</dd>
              </div>
              <div className="flex justify-between border-b border-arena-gold/10 pb-2">
                <dt className="text-muted-foreground">Fri – Sun</dt>
                <dd className="font-bold">10:00 AM – 2:00 AM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Billing</dt>
                <dd className="font-bold text-arena-gold">Per minute & per hour</dd>
              </div>
            </dl>
            <a
              href="https://maps.google.com/?q=MG+Road+Bengaluru"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl gold-gradient px-5 py-3 font-extrabold text-arena-dark tap-target"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
          </div>

          <div className="glass-panel overflow-hidden p-0">
            <iframe
              title="Arena of Legends location map"
              src="https://www.google.com/maps?q=MG%20Road%20Bengaluru&output=embed"
              loading="lazy"
              className="h-full min-h-[320px] w-full opacity-90 grayscale-[0.4]"
            />
          </div>
        </div>
      </section>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Quick chat on WhatsApp"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-arena-green text-arena-dark shadow-[var(--shadow-green)] md:bottom-6"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
