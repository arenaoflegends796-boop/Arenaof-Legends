import { useEffect, useState } from "react";
import { Crown, Menu, Phone, Shield, User, X, Zap } from "lucide-react";
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
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
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
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-arena-gold/40 px-3 py-1.5 text-xs font-bold text-arena-gold transition-colors hover:bg-arena-gold/10 tap-target"
          >
            <User className="h-3.5 w-3.5" /> Player Portal
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-arena-gold/20 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent tap-target"
          >
            <Shield className="h-3.5 w-3.5" /> Admin
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
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 lg:hidden overflow-y-auto">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-xl border border-arena-gold/40 text-arena-gold bg-arena-dark/80 tap-target"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center justify-center gap-6 w-full max-w-sm text-center">
            <span className="font-display text-lg font-black tracking-widest text-gold-gradient mb-2">
              ARENA OF LEGENDS
            </span>

            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="w-full rounded-xl py-3 px-4 text-center text-lg font-bold text-foreground transition-colors hover:text-arena-gold hover:bg-accent/40 tap-target"
              >
                {l.label}
              </button>
            ))}

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-arena-gold/40 bg-accent/40 py-3.5 px-4 text-base font-bold text-arena-gold tap-target"
            >
              <User className="h-5 w-5" /> Player Portal
            </Link>

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-arena-gold/30 bg-accent/20 py-3.5 px-4 text-base font-bold text-muted-foreground hover:text-arena-gold tap-target"
            >
              <Shield className="h-5 w-5" /> Admin Management Portal
            </Link>

            <a
              href={`tel:${PHONE}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-arena-crimson/60 py-3.5 px-4 font-bold text-arena-crimson tap-target"
            >
              <Phone className="h-5 w-5" /> Call Now
            </a>

            <button
              onClick={() => go("booking")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl gold-gradient py-4 px-4 font-extrabold text-arena-dark shadow-[var(--shadow-gold)] tap-target text-base"
            >
              <Zap className="h-5 w-5" /> Book a Slot Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
