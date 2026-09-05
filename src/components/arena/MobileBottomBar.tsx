import { Phone, Zap } from "lucide-react";
import { PHONE, scrollToId } from "./state";

export function MobileBottomBar() {
  return (
    <div className="sticky-mobile-cta grid grid-cols-2 gap-3 md:hidden">
      <a
        href={`tel:${PHONE}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-arena-crimson/60 bg-arena-crimson/10 px-4 py-3 font-bold text-arena-crimson tap-target"
      >
        <Phone className="h-4 w-4" /> Call Arena
      </a>
      <button
        onClick={() => scrollToId("booking")}
        className="inline-flex items-center justify-center gap-2 rounded-xl btn-cta-gold px-4 py-3 font-extrabold text-arena-dark tap-target shadow-[var(--shadow-gold)]"
      >
        <Zap className="h-4 w-4" /> Book a Slot
      </button>
    </div>
  );
}
