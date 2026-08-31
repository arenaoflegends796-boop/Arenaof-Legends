import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { ArenaProvider } from "@/components/arena/state";
import { Navbar } from "@/components/arena/Navbar";
import { Hero } from "@/components/arena/Hero";
import { ZonesMatrix } from "@/components/arena/ZonesMatrix";
import { BookingSection } from "@/components/arena/BookingSection";
import { VenueInfo } from "@/components/arena/VenueInfo";
import { MobileBottomBar } from "@/components/arena/MobileBottomBar";

const TITLE = "Arena of Legends — PS5 & Snooker Arena Bookings";
const DESC =
  "Book PlayStation 5 VIP stations (₹300/hr), championship English Snooker (₹240/hr) and French Billiards (₹160/hr). Pro-grade gear billed by the minute or hour.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ArenaProvider>
      <Navbar />
      <main>
        <Hero />
        <ZonesMatrix />
        <BookingSection />
        <VenueInfo />
      </main>
      <footer className="border-t border-arena-gold/15 px-4 py-8 pb-28 text-center md:pb-8 lg:px-8">
        <p className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-widest text-gold-gradient">
          <Crown className="h-4 w-4 text-arena-gold" /> ARENA OF LEGENDS
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Play • Compete • Win • Repeat
        </p>
      </footer>
      <MobileBottomBar />
    </ArenaProvider>
  );
}
