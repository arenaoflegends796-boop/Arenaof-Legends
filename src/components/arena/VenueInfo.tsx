import { useState } from "react";
import { ChevronDown, MapPin, MessageCircle, Star, Trophy, Play, Clock } from "lucide-react";
import { WHATSAPP, useArena } from "./state";

const RULES = [
  {
    q: "Equipment etiquette & handling",
    a: "No food or drinks on tables or consoles. Cues stay in the rack when not in play, and DualSense controllers must be returned at the counter after your session.",
  },
  {
    q: "Advance booking & arrival grace period",
    a: "Slots are confirmed via WhatsApp. Please arrive 10 minutes prior to your reserved slot; unclaimed stations are released after 15 minutes.",
  },
  {
    q: "Controller & cue care policy",
    a: "Report stick drift, worn cue tips or cloth imperfections immediately. Deliberate damage to cues, cloth or DualSense controllers will be billed at standard replacement cost.",
  },
  {
    q: "Transparent per-minute billing",
    a: "Sessions are calculated per minute from start time. You can extend anytime at the counter if your setup or station is unreserved.",
  },
];

const REVIEWS = [
  {
    name: "Rohit K.",
    tag: "PS5 Gamer",
    text: "Zero lag on the 4K 120Hz PS5 setups and the recliners are unreal. The per-minute billing makes it the best PS5 gaming cafe in Bengaluru.",
    mediaUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    isVideo: false,
  },
  {
    name: "Aditya S.",
    tag: "Snooker Player",
    text: "Strachan 6811 cloth and overhead match lighting are genuinely tournament grade. Easily the most professional Snooker tables near Vasanth Nagar.",
    mediaUrl: "https://images.unsplash.com/photo-1615678811651-99af6637c36a?w=600&auto=format&fit=crop&q=80",
    isVideo: false,
  },
  {
    name: "Faizan M.",
    tag: "Squad Host",
    text: "Booked the full arena lockout for our weekend FC 25 tournament. Seamless WhatsApp booking and insane gaming atmosphere!",
    mediaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    isVideo: true,
  },
];

export function VenueInfo() {
  const [open, setOpen] = useState<number | null>(0);
  const { settings } = useArena();

  return (
    <>
      <section id="leaderboard" className="px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <header className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
              Social Proof & Reviews
            </span>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl text-gold-gradient">
              Rated by the Regulars
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              See what competitive gamers & cue sport enthusiasts say about Arena of Legends.
            </p>
          </header>

          <div className="glass-panel mt-6 flex flex-wrap items-center gap-4 p-5 border border-arena-gold/30">
            <span className="inline-flex items-center gap-2 font-display text-3xl font-black text-arena-gold">
              4.9
              <div className="flex text-arena-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-arena-gold" />
                ))}
              </div>
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              Verified Google Reviews from competitive console gamers and snooker enthusiasts in Bengaluru
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <article key={r.name} className="glass-panel overflow-hidden flex flex-col justify-between border border-arena-gold/20 hover:border-arena-gold/50 transition-all">
                <div className="relative h-44 w-full overflow-hidden bg-accent/40">
                  <img
                    src={r.mediaUrl}
                    alt={`${r.name} review ambient setup`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {r.isVideo && (
                    <div className="absolute inset-0 grid place-items-center bg-black/40">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-arena-gold/90 text-arena-dark shadow-[var(--shadow-gold)]">
                        <Play className="h-5 w-5 fill-arena-dark ml-0.5" />
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 rounded-md bg-arena-dark/90 px-2 py-0.5 text-[10px] font-bold text-arena-gold border border-arena-gold/30">
                    {r.tag}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-arena-gold mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-arena-gold" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">"{r.text}"</p>
                  </div>
                  <p className="mt-4 text-xs font-extrabold text-foreground tracking-wide uppercase">— {r.name}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-3">
            <h3 className="font-display text-xl font-black text-foreground">
              <Trophy className="mr-2 inline h-5 w-5 text-arena-gold" />
              Player Guidelines & Etiquette
            </h3>
            {RULES.map((r, i) => (
              <div key={r.q} className="glass-panel overflow-hidden border border-arena-gold/15">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left tap-target"
                >
                  <span className="min-w-0 font-bold text-sm sm:text-base text-foreground">{r.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-arena-gold transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{r.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="px-4 pb-28 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="glass-panel p-6 border border-arena-gold/30">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
              Venue Location
            </span>
            <h2 className="mt-2 font-display text-3xl font-black text-gold-gradient">Find The Arena</h2>
            <p className="mt-4 flex gap-2 text-muted-foreground text-sm">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-arena-crimson" />
              <span>
                Arena of Legends, Nelagadaranahalli Main Rd, Gopal Nagar, Nalagadderanahalli, Peenya, Bengaluru, Karnataka 560073
              </span>
            </p>
            <dl className="mt-5 grid gap-2 text-sm">
              <div className="flex justify-between border-b border-arena-gold/10 pb-2">
                <dt className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-arena-green" /> Venue Open Time
                </dt>
                <dd className="font-bold text-arena-green">{settings.openingTime || "10:00 AM"}</dd>
              </div>
              <div className="flex justify-between border-b border-arena-gold/10 pb-2">
                <dt className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-arena-crimson" /> Venue Close Time
                </dt>
                <dd className="font-bold text-arena-crimson">{settings.closingTime || "11:30 PM"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Operating Days</dt>
                <dd className="font-bold text-foreground">Monday – Sunday (7 Days)</dd>
              </div>
            </dl>
            <a
              href="https://maps.google.com/?q=Nelagadaranahalli+Main+Rd,+Gopal+Nagar,+Peenya,+Bengaluru,+Karnataka+560073"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl btn-cta-gold px-5 py-3 font-extrabold text-arena-dark tap-target shadow-[var(--shadow-gold)]"
            >
              <MapPin className="h-4 w-4" /> Get Map Directions
            </a>
          </div>

          <div className="glass-panel overflow-hidden p-0 border border-arena-gold/20">
            <iframe
              title="Arena of Legends location map"
              src="https://www.google.com/maps?q=Nelagadaranahalli%20Main%20Rd%2C%20Gopal%20Nagar%2C%20Peenya%2C%20Bengaluru%2C%20Karnataka%20560073&output=embed"
              loading="lazy"
              className="h-full min-h-[340px] w-full opacity-90 contrast-125"
            />
          </div>
        </div>
      </section>

      {/* Floating Action Button (FAB) for WhatsApp with Pulse Animation */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Quick chat on WhatsApp"
        className="whatsapp-fab fixed bottom-20 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-arena-green text-arena-dark shadow-[var(--shadow-green)] transition-transform hover:scale-110 md:bottom-6"
      >
        <MessageCircle className="h-7 w-7 text-arena-dark" />
      </a>
    </>
  );
}
