import { useEffect, useState } from "react";
import { Crown, Menu, Phone, Shield, X, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PHONE, WHATSAPP, scrollToId } from "./state";

const LINKS = [
  { label: "Gaming & Cue Zones", id: "zones" },
  { label: "Live Rate Calculator", id: "booking" },
  { label: "Leaderboard", id: "leaderboard" },
  { label: "Location", id: "location" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "glass-panel rounded-none shadow-[var(--shadow-gold)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:flex lg:justify-between lg:px-8">
        <button
          onClick={() => go("hero")}
          className="flex min-w-0 items-center gap-2 text-left tap-target"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gold-gradient shadow-[var(--shadow-gold)]">
            <Crown className="h-5 w-5 text-arena-dark" />
          </span>
          <span className="truncate font-display lg:overflow-visible text-sm font-bold tracking-widest text-gold-gradient sm:text-base">
            ARENA OF LEGENDS
          </span>
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-arena-gold"
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-arena-gold/40 px-3 py-1.5 text-xs font-bold text-arena-gold transition-colors hover:bg-arena-gold/10 tap-target"
          >
            <Shield className="h-3.5 w-3.5" /> Admin Panel
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-arena-crimson/60 px-3 py-2 text-sm font-bold text-arena-crimson transition-shadow hover:shadow-[var(--shadow-crimson)] tap-target"
          >
            <Phone className="h-4 w-4" /> WhatsApp / Call
          </a>
          <button
            onClick={() => go("booking")}
            className="inline-flex items-center gap-2 rounded-xl gold-gradient px-4 py-2 text-sm font-extrabold text-arena-dark transition-shadow hover:shadow-[var(--shadow-gold)] tap-target"
          >
            <Zap className="h-4 w-4" /> Book a Slot
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${PHONE}`}
            aria-label="Call Arena of Legends"
            className="grid h-11 w-11 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold"
          >
            <Phone className="h-5 w-5" />
          </a>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-arena-dark/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-2 glass-panel rounded-none p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-gold-gradient">MENU</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-xl px-3 py-3 text-left text-base font-semibold text-foreground/90 transition-colors hover:bg-accent hover:text-arena-gold tap-target"
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-arena-gold/40 bg-accent/40 px-3 py-3 text-base font-bold text-arena-gold tap-target"
            >
              <Shield className="h-4 w-4" /> Admin Management Portal
            </Link>
            <a
              href={`tel:${PHONE}`}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-arena-crimson/60 px-4 py-3 font-bold text-arena-crimson tap-target"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <button
              onClick={() => go("booking")}
              className="inline-flex items-center justify-center gap-2 rounded-xl gold-gradient px-4 py-3 font-extrabold text-arena-dark tap-target"
            >
              <Zap className="h-4 w-4" /> Book a Slot
            </button>
          </aside>
        </div>
      )}
    </header>
  );
}
