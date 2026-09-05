import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  User, 
  Gamepad2, 
  Clock, 
  RotateCcw, 
  LogOut, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Zap, 
  Plus,
  Home,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";
import gsap from "gsap";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/arena/Navbar";
import { ArenaProvider, useArena, INR, type ZoneId, formatDuration } from "@/components/arena/state";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/dashboard")({
  component: GamerDashboardRoute,
});

function GamerDashboardRoute() {
  return (
    <ArenaProvider>
      <Navbar />
      <main className="min-h-screen bg-arena-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <GamerDashboardContent />
      </main>
    </ArenaProvider>
  );
}

interface BookingRecord {
  id: string;
  gameTitle: string;
  duration: string;
  amount: number;
  date: string;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  rank: string;
  avatarUrl: string;
}

function GamerDashboardContent() {
  const navigate = useNavigate();
  const { addBooking } = useArena();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneId>("ps5");
  const [modalDuration, setModalDuration] = useState(120);
  const [modalSlot, setModalSlot] = useState("18:00");
  const [modalDate, setModalDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");

  // Animation Refs
  const authCardRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const historyCardRef = useRef<HTMLDivElement>(null);

  // 1. Supabase Auth Session Listener & Real-time Profile / Bookings Fetcher
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setProfile(null);
        setBookings([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile & Bookings for the logged-in user (Strict Data Isolation)
  const fetchUserData = async (authUser: SupabaseUser) => {
    setLoading(true);
    try {
      // 1. Fetch user profile from Supabase
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles" as any)
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileErr && profileErr.code !== "PGRST116") {
        console.warn("Profiles table fetch info:", profileErr.message);
      }

      const activeProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || "",
        username: (profileData as any)?.username || authUser.email?.split("@")[0] || "CyberLegend",
        rank: (profileData as any)?.rank || "ELITE LEGEND",
        avatarUrl: (profileData as any)?.avatar_url || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop",
      };
      setProfile(activeProfile);

      // 2. Fetch user's isolated bookings from Supabase
      const { data: bookingsData, error: bookingsErr } = await supabase
        .from("user_bookings" as any)
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (bookingsErr) {
        console.warn("User bookings fetch info:", bookingsErr.message);
        setBookings([
          {
            id: "BK-9001",
            gameTitle: "PlayStation 5 VIP Lounge (EA FC 25)",
            duration: "120 mins",
            amount: 600,
            date: "Today, 18:00",
          },
        ]);
      } else if (bookingsData && bookingsData.length > 0) {
        const formatted: BookingRecord[] = (bookingsData as any[]).map((b) => ({
          id: b.id,
          gameTitle: b.game_title,
          duration: b.duration,
          amount: b.amount,
          date: `${b.booking_date || "Today"}, ${b.slot_time || "18:00"}`,
        }));
        setBookings(formatted);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // GSAP Entrance Animations
  useEffect(() => {
    if (!user && authCardRef.current) {
      gsap.fromTo(
        authCardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.2)" }
      );
    } else if (user) {
      if (profileCardRef.current) {
        gsap.fromTo(
          profileCardRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }
      if (historyCardRef.current) {
        gsap.fromTo(
          historyCardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
        );
      }
    }
  }, [user]);

  // Auth Handler with Supabase Auth (Sign In & Sign Up)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setActionLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: usernameInput || email.split("@")[0] }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Insert profile record in Supabase
          await supabase.from("profiles" as any).insert({
            id: data.user.id,
            username: usernameInput || email.split("@")[0],
            rank: "ROOKIE LEGEND",
            avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setActionLoading(false);
    }
  };

  // Sign Out Handler with Supabase
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Calculate rate for modal
  const getZoneTitle = (z: ZoneId) => {
    if (z === "ps5") return "PlayStation 5 VIP Lounge";
    if (z === "snooker") return "English Snooker Championship Board";
    return "French Billiards Carom Table";
  };

  const getZoneRate = (z: ZoneId) => {
    if (z === "ps5") return 300;
    if (z === "snooker") return 240;
    return 160;
  };

  const currentModalTotal = Math.round((getZoneRate(selectedZone) / 60) * modalDuration);

  // Submit Modal Booking Flow with Supabase Insert
  const handleModalBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const gameTitle = getZoneTitle(selectedZone);
    const newRecord: BookingRecord = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      gameTitle: gameTitle,
      duration: `${modalDuration} mins`,
      amount: currentModalTotal,
      date: `${modalDate}, ${modalSlot}`,
    };

    // 1. Insert into Supabase user_bookings table (Strict RLS enforced: auth.uid() = user_id)
    try {
      await supabase.from("user_bookings" as any).insert({
        user_id: user.id,
        game_title: gameTitle,
        duration: `${modalDuration} mins`,
        amount: currentModalTotal,
        booking_date: modalDate,
        slot_time: modalSlot,
      });
    } catch (err) {
      console.warn("Supabase insert note:", err);
    }

    // 2. Update portal state in real time
    setBookings((prev) => [newRecord, ...prev]);

    // 3. Sync with main Arena Context state
    addBooking({
      customerName: profile?.username || "Gamer",
      phone: "+91 98000 11122",
      bookingDate: modalDate || (new Date().toISOString().split("T")[0] ?? "2026-09-02"),
      slot: modalSlot,
      zoneIds: [selectedZone],
      minutes: modalDuration,
      players: 1,
      total: currentModalTotal,
      preferredFormat: `Portal Booking: ${gameTitle}`,
    });

    setBookingSuccessMsg(`Reserved ${gameTitle} (${modalDuration} mins) for ${INR(currentModalTotal)}!`);
    setShowModal(false);

    setTimeout(() => setBookingSuccessMsg(""), 4000);
  };

  // Re-book Quick Button Handler
  const handleBookAgain = async (item: { gameTitle: string; duration: string; amount: number }) => {
    if (!user) return;

    const newRecord: BookingRecord = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      gameTitle: item.gameTitle,
      duration: item.duration,
      amount: item.amount,
      date: "Just now",
    };

    try {
      await supabase.from("user_bookings" as any).insert({
        user_id: user.id,
        game_title: item.gameTitle,
        duration: item.duration,
        amount: item.amount,
        booking_date: new Date().toISOString().split("T")[0] ?? "2026-09-02",
        slot_time: "18:00",
      });
    } catch (err) {
      console.warn("Re-book insert note:", err);
    }

    setBookings((prev) => [newRecord, ...prev]);

    addBooking({
      customerName: profile?.username || "Gamer",
      phone: "+91 98000 11122",
      bookingDate: new Date().toISOString().split("T")[0] ?? "2026-09-02",
      slot: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      zoneIds: ["ps5"],
      minutes: item.duration.includes("90") ? 90 : 120,
      players: 1,
      total: item.amount,
      preferredFormat: `Re-book: ${item.gameTitle}`,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-arena-gold">
          <Loader2 className="h-10 w-10 animate-spin text-arena-gold" />
          <p className="font-display font-bold tracking-widest text-sm">AUTHENTICATING PLAYER SESSION...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN / SIGNUP SCREEN (UNAUTHENTICATED VIEW) ---
  if (!user) {
    return (
      <div className="mx-auto max-w-md">
        <div className="mb-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-arena-gold hover:underline"
          >
            <Home className="h-4 w-4" /> Return to Arena Home
          </Link>
        </div>

        <div 
          ref={authCardRef}
          className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-arena-gold/30 shadow-[var(--shadow-gold)]"
        >
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-arena-gold/10 blur-2xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl gold-gradient shadow-[var(--shadow-gold)]">
              <Gamepad2 className="h-7 w-7 text-arena-dark" />
            </div>
            <h2 className="font-display text-2xl font-black tracking-wider text-gold-gradient uppercase">
              {isSignUp ? "Create Player Tag" : "Gamer Portal Access"}
            </h2>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {isSignUp ? "Join the hall of legends" : "Enter credentials to access live stats"}
            </p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Gamertag / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-arena-gold/70" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="xX_ApexLegend_Xx"
                    className="w-full rounded-xl border border-arena-gold/20 bg-accent/30 py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-arena-gold focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-arena-gold/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player1@arena.com"
                  className="w-full rounded-xl border border-arena-gold/20 bg-accent/30 py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-arena-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-arena-gold/70" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-arena-gold/20 bg-accent/30 py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-arena-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl btn-cta-gold py-3 text-sm font-extrabold text-arena-dark shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {actionLoading ? (
                <Zap className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {isSignUp ? "INITIALIZE ACCOUNT" : "AUTHENTICATE & ENTER"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-arena-gold/15 pt-4">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError("");
              }}
              className="text-xs font-bold tracking-wider text-arena-gold hover:underline uppercase"
            >
              {isSignUp ? "Already registered? Login here" : "Need an account? Register new tag"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN DASHBOARD (AUTHENTICATED VIEW) ---
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Return to Arena Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-arena-gold/30 bg-accent/30 px-3.5 py-2 text-xs font-bold text-arena-gold hover:bg-accent/60"
        >
          <Home className="h-4 w-4" /> Return to Arena Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Supabase Authenticated Session
        </span>
      </div>

      {bookingSuccessMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-arena-green/50 bg-arena-green/10 p-4 text-sm font-bold text-arena-green shadow-[var(--shadow-green)]">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{bookingSuccessMsg}</span>
        </div>
      )}

      {/* Profile Header */}
      <div 
        ref={profileCardRef}
        className="glass-panel relative overflow-hidden rounded-3xl p-6 border border-arena-gold/30 shadow-[var(--shadow-gold)]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop"}
              alt="Avatar"
              className="h-20 w-20 rounded-2xl border-2 border-arena-gold object-cover shadow-[var(--shadow-gold)]"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="font-display text-2xl font-black text-gold-gradient">
                  {profile?.username || user.email?.split("@")[0]}
                </h2>
                <Trophy className="h-5 w-5 text-arena-gold" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold border border-arena-gold/30">
                <Sparkles className="h-3.5 w-3.5" />
                {profile?.rank || "ELITE LEGEND"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl btn-cta-gold px-4 py-2.5 text-xs font-extrabold text-arena-dark shadow-[var(--shadow-gold)]"
            >
              <Plus className="h-4 w-4" /> Book New Game
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Prominent High-Contrast Action Card */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 border-2 border-arena-gold/40 gold-gradient text-arena-dark shadow-[var(--shadow-gold)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-arena-dark text-arena-gold px-2.5 py-1 rounded-md">
              Instant Session Reservation
            </span>
            <h3 className="font-display text-2xl font-black mt-2">
              Ready for your next gaming match or cue battle?
            </h3>
            <p className="text-xs font-bold mt-1 text-arena-dark/80">
              Reserve PS5 rigs (₹300/hr), Snooker (₹240/hr), or French Billiards (₹160/hr) with instant confirmation.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-2xl bg-arena-dark px-6 py-3.5 font-display text-sm font-black text-arena-gold border border-arena-gold shadow-2xl transition-transform hover:scale-105"
          >
            + BOOK NEW GAME / SLOT
          </button>
        </div>
      </div>

      {/* Booking History & Live Writes */}
      <div 
        ref={historyCardRef}
        className="glass-panel rounded-3xl p-6 border border-arena-gold/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-black uppercase text-gold-gradient flex items-center gap-2">
              <Clock className="h-5 w-5 text-arena-gold" /> Player Session History
            </h3>
            <p className="text-xs text-muted-foreground">Recorded gaming & cue sports sessions (Supabase RLS Isolated)</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-arena-gold/40 px-3.5 py-2 text-xs font-extrabold text-arena-gold hover:bg-arena-gold/10"
          >
            <Plus className="h-4 w-4" /> Book New Slot
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-arena-gold/20 p-8 text-center">
            <Gamepad2 className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="font-display text-sm font-bold text-foreground">No previous session bookings found</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Click below to create your first session reservation linked to your Supabase ID.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl btn-cta-gold px-4 py-2 text-xs font-bold text-arena-dark"
            >
              <Plus className="h-4 w-4" /> + Book New Game / Slot
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-arena-gold/15 bg-accent/20 p-4 transition-all hover:border-arena-gold/50 hover:bg-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm font-bold text-foreground group-hover:text-arena-gold">
                      {item.gameTitle}
                    </span>
                    <span className="rounded-md bg-arena-gold/10 px-2 py-0.5 text-[10px] font-bold text-arena-gold">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-arena-gold">
                    {INR(item.amount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {item.date}
                  </p>
                </div>

                <button
                  onClick={() => handleBookAgain(item)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-arena-gold/30 bg-arena-gold/10 py-2 text-xs font-bold text-arena-gold transition-colors hover:bg-arena-gold hover:text-arena-dark"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Quick Re-book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Booking Modal inside Player Portal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel relative w-full max-w-lg rounded-3xl p-6 border-2 border-arena-gold/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-arena-gold/20">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-arena-gold" />
                <h3 className="font-display text-lg font-black text-gold-gradient uppercase">
                  Book New Game / Slot
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleModalBookingSubmit} className="mt-4 space-y-4">
              {/* Zone Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  1. Select Gaming or Cue Zone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ps5" as ZoneId, name: "PS5 VIP", rate: "₹300/hr", emoji: "🎮" },
                    { id: "snooker" as ZoneId, name: "Snooker", rate: "₹240/hr", emoji: "🎱" },
                    { id: "french" as ZoneId, name: "French Carom", rate: "₹160/hr", emoji: "🔴" },
                  ].map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setSelectedZone(z.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                        selectedZone === z.id
                          ? "border-arena-gold bg-arena-gold/20 text-arena-gold ring-1 ring-arena-gold shadow-[var(--shadow-gold)]"
                          : "border-arena-gold/20 bg-accent/20 text-muted-foreground hover:border-arena-gold/40"
                      }`}
                    >
                      <span className="text-xl">{z.emoji}</span>
                      <span className="text-xs font-bold mt-1">{z.name}</span>
                      <span className="text-[10px] text-arena-gold font-semibold">{z.rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    2. Booking Date
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-arena-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Time Slot
                  </label>
                  <input
                    type="time"
                    required
                    value={modalSlot}
                    onChange={(e) => setModalSlot(e.target.value)}
                    className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-arena-gold"
                  />
                </div>
              </div>

              {/* Duration Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  3. Duration (minutes)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[30, 60, 90, 120, 180, 240].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalDuration(m)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                        modalDuration === m
                          ? "border-arena-gold bg-arena-gold text-arena-dark shadow-[var(--shadow-gold)]"
                          : "border-arena-gold/20 text-muted-foreground hover:border-arena-gold/40"
                      }`}
                    >
                      {formatDuration(m)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl border border-arena-gold/30 bg-arena-gold/10 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-arena-gold">Estimated Total</p>
                  <p className="font-display text-2xl font-black text-gold-gradient">{INR(currentModalTotal)}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-bold text-foreground">{getZoneTitle(selectedZone)}</p>
                  <p>{modalDuration} min ({formatDuration(modalDuration)})</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl btn-cta-gold py-3 text-sm font-extrabold text-arena-dark shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
              >
                CONFIRM & SAVE TO SUPABASE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
