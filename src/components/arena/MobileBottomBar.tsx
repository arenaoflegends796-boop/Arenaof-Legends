import { Phone, Zap } from "lucide-react";
import { PHONE, scrollToId } from "./state";

export function MobileBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-3 border-t border-arena-gold/20 bg-arena-dark/95 p-3 backdrop-blur-xl md:hidden">
      <a
        href={`tel:${PHONE}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-arena-crimson/60 px-4 py-3 font-bold text-arena-crimson tap-target"
      >
        <Phone className="h-4 w-4" /> Call Arena
      </a>
      <button
        onClick={() => scrollToId("booking")}
        className="inline-flex items-center justify-center gap-2 rounded-xl gold-gradient px-4 py-3 font-extrabold text-arena-dark tap-target"
      >
        <Zap className="h-4 w-4" /> Reserve Slot
      </button>
    </div>
  );
}
