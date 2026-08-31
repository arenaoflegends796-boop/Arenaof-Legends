import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArenaProvider,
  INR,
  formatDuration,
  useArena,
  type BookingItem,
  type StationItem,
  type ZoneId,
} from "@/components/arena/state";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  DollarSign,
  Download,
  Edit2,
  Gamepad2,
  Key,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Arena of Legends Management" },
      { name: "description", content: "Manage zone prices, view monthly revenue analytics, track slot bookings and station availability." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <ArenaProvider>
      <AdminContent />
    </ArenaProvider>
  );
}

function AdminContent() {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin, settings } = useArena();
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setPinError("");
    } else {
      setPinError("Invalid Admin PIN code. Default PIN is 1234");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-arena-dark px-4 py-12">
        <div className="glass-panel w-full max-w-md p-8 text-center shadow-[var(--shadow-gold)] border border-arena-gold/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient shadow-[var(--shadow-gold)] text-arena-dark">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-black tracking-wide text-gold-gradient">
            ARENA ADMIN PORTAL
          </h1>
          <p className="mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Manager Authorization Required
          </p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                placeholder="Enter 4-digit PIN (e.g. 1234)"
                className="w-full rounded-xl border border-arena-gold/30 bg-accent/40 px-4 py-3 text-center text-2xl font-bold tracking-widest text-foreground placeholder:text-sm placeholder:tracking-normal outline-none focus:border-arena-gold"
                autoFocus
              />
              <Lock className="absolute left-4 top-4 h-5 w-5 text-arena-gold/60" />
            </div>

            {pinError && (
              <p className="text-xs font-bold text-arena-crimson animate-pulse">{pinError}</p>
            )}

            <div className="rounded-xl border border-arena-gold/20 bg-accent/20 p-3 text-left text-xs text-muted-foreground">
              <span className="font-bold text-arena-gold">🔑 Demo Credentials:</span> Default Security PIN is <code className="rounded bg-accent px-1.5 py-0.5 font-bold text-foreground">1234</code>. You can change this anytime inside Admin Settings.
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl gold-gradient py-3.5 font-extrabold text-arena-dark transition-all hover:shadow-[var(--shadow-gold)] tap-target flex items-center justify-center gap-2 text-base"
            >
              <Key className="h-5 w-5" /> Unlock Manager Portal
            </button>
          </form>

          <div className="mt-6 border-t border-arena-gold/15 pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-arena-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={logoutAdmin} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    bookings,
    zonesData,
    stations,
    blockedSlots,
    updateZoneRate,
    toggleZoneActive,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    addBlockedSlot,
    deleteBlockedSlot,
    updateStationStatus,
    addBooking,
    settings,
    updateSettings,
  } = useArena();
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "slots" | "bookings" | "stations" | "settings">("overview");

  // Search & Filter state for bookings
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Reschedule Modal State
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");
  const [rescheduleMins, setRescheduleMins] = useState(60);

  // New Blocked Slot Modal / State
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split("T")[0]);
  const [blockStartTime, setBlockStartTime] = useState("14:00");
  const [blockEndTime, setBlockEndTime] = useState("16:00");
  const [blockZone, setBlockZone] = useState<ZoneId | "all">("all");
  const [blockReason, setBlockReason] = useState("Maintenance / Cleaning Buffer");

  // New Walk-in Booking State
  const [showAddModal, setShowAddModal] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinZone, setWalkinZone] = useState<ZoneId>("ps5");
  const [walkinMins, setWalkinMins] = useState(60);

  // Revenue analytics computations
  const totalRevenue = bookings.reduce((sum, b) => (b.status === "completed" || b.status === "confirmed" ? sum + b.total : sum), 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const activeStationsCount = stations.filter((s) => s.status === "in_use").length;

  // Monthly breakdown calculation
  const currentMonthBookings = bookings.filter((b) => b.bookingDate.startsWith("2026-08"));
  const monthlyRevenue = currentMonthBookings.reduce((sum, b) => (b.status === "completed" || b.status === "confirmed" ? sum + b.total : sum), 0);

  // Zone breakdown
  const ps5Revenue = bookings.filter((b) => b.zoneIds.includes("ps5") && b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0);
  const snookerRevenue = bookings.filter((b) => b.zoneIds.includes("snooker") && b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0);
  const frenchRevenue = bookings.filter((b) => b.zoneIds.includes("french") && b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || b.phone.includes(searchQuery) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const hourlyRate = zonesData[walkinZone]?.rate || 300;
    const total = Math.round((hourlyRate / 60) * walkinMins * 2);
    addBooking({
      customerName: walkinName || "Walk-in Customer",
      phone: walkinPhone || "+91 90000 00000",
      bookingDate: new Date().toISOString().split("T")[0],
      slot: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      zoneIds: [walkinZone],
      minutes: walkinMins,
      players: 2,
      total,
      preferredFormat: "Quick Walk-in Session",
    });
    setWalkinName("");
    setWalkinPhone("");
    setShowAddModal(false);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const zoneRate = editingBooking.zoneIds.reduce((sum, z) => sum + (zonesData[z]?.rate || 0), 0);
    const newTotal = Math.round((zoneRate / 60) * rescheduleMins * (editingBooking.players || 1));

    updateBooking(editingBooking.id, {
      bookingDate: rescheduleDate,
      slot: rescheduleSlot,
      minutes: rescheduleMins,
      total: newTotal,
    });
    setEditingBooking(null);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    addBlockedSlot({
      date: blockDate,
      startTime: blockStartTime,
      endTime: blockEndTime,
      zoneId: blockZone,
      reason: blockReason,
    });
  };

  return (
    <div className="min-h-screen bg-arena-dark text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-arena-gold/20 glass-panel rounded-none px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gold-gradient text-arena-dark shadow-[var(--shadow-gold)]">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-black tracking-widest text-gold-gradient">
                  ARENA CONTROL CENTER
                </span>
                <span className="rounded-md border border-arena-green/40 bg-arena-green/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-arena-green">
                  Live System
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue, Dynamic Rates & Slot Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-arena-gold/30 px-3.5 py-2 text-xs font-bold text-arena-gold hover:bg-arena-gold/10"
            >
              <ArrowLeft className="h-4 w-4" /> View Public Site
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-arena-crimson/50 px-3.5 py-2 text-xs font-bold text-arena-crimson hover:bg-arena-crimson/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-arena-gold/15 pb-4">
          {[
            { id: "overview", label: "Monthly Revenue & Analytics", icon: BarChart3 },
            { id: "pricing", label: "Rate & Price Manager", icon: Sliders },
            { id: "slots", label: "Timing & Slot Adjustment", icon: Clock },
            { id: "bookings", label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: "stations", label: `Live Stations (${stations.length})`, icon: Gamepad2 },
            { id: "settings", label: "Arena Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-extrabold transition-all tap-target ${
                  active
                    ? "border-arena-gold gold-gradient text-arena-dark shadow-[var(--shadow-gold)]"
                    : "border-arena-gold/20 bg-accent/20 text-muted-foreground hover:border-arena-gold/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Monthly Revenue */}
        {activeTab === "overview" && (
          <div className="mt-8 flex flex-col gap-8">
            {/* Quick KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-panel p-5 border border-arena-gold/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Monthly Revenue (Aug)
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-lg gold-gradient text-arena-dark">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-gold-gradient">
                  {INR(monthlyRevenue)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-arena-green font-semibold">
                  <TrendingUp className="h-3.5 w-3.5" /> +18.4% vs last month
                </p>
              </div>

              <div className="glass-panel p-5 border border-arena-cyan/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Bookings
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-arena-cyan/20 text-arena-cyan">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-arena-cyan">
                  {bookings.length}
                </p>
                <p className="mt-1 text-xs font-semibold text-arena-gold">
                  {pendingCount} Pending Approval
                </p>
              </div>

              <div className="glass-panel p-5 border border-arena-green/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Stations
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-arena-green/20 text-arena-green">
                    <Gamepad2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-arena-green">
                  {activeStationsCount} / {stations.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">
                  In-use right now
                </p>
              </div>

              <div className="glass-panel p-5 border border-arena-gold/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Avg Hourly Yield
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-arena-gold/20 text-arena-gold">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-foreground">
                  {INR(Math.round((zonesData.ps5.rate + zonesData.snooker.rate + zonesData.french.rate) / 3))}
                </p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">
                  Across all 3 gaming zones
                </p>
              </div>
            </div>

            {/* Monthly Revenue Breakdown & Zone Analysis */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="glass-panel lg:col-span-2 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-black">Monthly Revenue Growth</h3>
                    <p className="text-xs text-muted-foreground">Monthly earnings trends and projection</p>
                  </div>
                  <button
                    onClick={() => alert("Revenue Report downloaded!")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-arena-gold/30 bg-accent/30 px-3 py-1.5 text-xs font-bold text-arena-gold hover:bg-arena-gold/10"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Report
                  </button>
                </div>

                {/* Simulated Chart Bars */}
                <div className="mt-6 flex h-48 items-end gap-4 rounded-2xl border border-arena-gold/15 bg-accent/20 p-4">
                  {[
                    { month: "May", rev: 14500, height: "45%" },
                    { month: "Jun", rev: 18200, height: "60%" },
                    { month: "Jul", rev: 22400, height: "75%" },
                    { month: "Aug (Current)", rev: monthlyRevenue, height: "90%", highlight: true },
                  ].map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-extrabold text-arena-gold">{INR(m.rev)}</span>
                      <div
                        style={{ height: m.height }}
                        className={`w-full rounded-t-xl transition-all ${
                          m.highlight ? "gold-gradient shadow-[var(--shadow-gold)]" : "bg-arena-cyan/30"
                        }`}
                      />
                      <span className="text-[11px] font-bold text-muted-foreground">{m.month}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>Target Monthly Goal: <strong className="text-foreground">{INR(50000)}</strong></span>
                  <span>Calculated from active & completed bookings</span>
                </div>
              </div>

              {/* Zone Distribution */}
              <div className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-black">Revenue by Zone</h3>
                  <p className="text-xs text-muted-foreground">Earnings contribution per gaming area</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-arena-cyan">🎮 PlayStation 5 VIP</span>
                      <span>{INR(ps5Revenue)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-accent">
                      <div className="h-2 rounded-full bg-arena-cyan" style={{ width: "55%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-arena-green">🎱 English Snooker</span>
                      <span>{INR(snookerRevenue)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-accent">
                      <div className="h-2 rounded-full bg-arena-green" style={{ width: "30%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-arena-crimson">🥖 French Billiards</span>
                      <span>{INR(frenchRevenue)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-accent">
                      <div className="h-2 rounded-full bg-arena-crimson" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-arena-gold/20 bg-accent/30 p-3 text-xs text-muted-foreground">
                  💡 <strong className="text-arena-gold">Pro Insight:</strong> PS5 stations drive 55% of overall venue revenue during 6 PM - 10 PM.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pricing & Rate Manager */}
        {activeTab === "pricing" && (
          <div className="mt-8 space-y-6">
            <div className="glass-panel p-6 border border-arena-gold/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-black text-gold-gradient">
                    Zone Rate & Hourly Price Manager
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update hourly rates instantly. Changes will immediately sync across all booking calculators and public zone cards.
                  </p>
                </div>
                <div className="rounded-xl border border-arena-green/30 bg-arena-green/10 px-4 py-2 text-xs font-bold text-arena-green">
                  ⚡ Auto-Synced with Public Calculator
                </div>
              </div>

              {/* Rate Editors */}
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {(Object.keys(zonesData) as ZoneId[]).map((zoneId) => {
                  const info = zonesData[zoneId];
                  const perMinuteRate = Math.round(info.rate / 60);

                  return (
                    <div
                      key={zoneId}
                      className="glass-panel flex flex-col justify-between border border-arena-gold/20 p-5 shadow-[var(--shadow-gold)]"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{info.emoji}</span>
                          <span className="rounded-lg bg-accent/60 px-2.5 py-1 text-xs font-extrabold text-arena-gold">
                            ₹{perMinuteRate}/min
                          </span>
                        </div>
                        <h4 className="mt-3 font-display text-lg font-bold">{info.name}</h4>

                        <div className="mt-4 space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Hourly Rate (₹/hr)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step={10}
                              min={50}
                              max={2000}
                              value={info.rate}
                              onChange={(e) => updateZoneRate(zoneId, Number(e.target.value))}
                              className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-2xl font-black text-arena-gold outline-none focus:border-arena-gold"
                            />
                            <span className="text-sm font-bold text-muted-foreground">/hr</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-xl bg-accent/20 p-2.5 text-xs">
                          <span className="text-muted-foreground">Status:</span>
                          <button
                            onClick={() => toggleZoneActive(zoneId)}
                            className={`rounded-lg px-2.5 py-1 font-bold ${
                              info.active ? "bg-arena-green/20 text-arena-green" : "bg-arena-crimson/20 text-arena-crimson"
                            }`}
                          >
                            {info.active ? "Active" : "Disabled"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-arena-gold/15 pt-3 text-[11px] text-muted-foreground">
                        Example: 120 mins = <strong className="text-foreground">{INR(info.rate * 2)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Surge & Peak Hour Pricing Controls */}
            <div className="glass-panel p-6 border border-arena-gold/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-lg font-bold">Peak Hours Surge Multiplier</h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically apply weekend / evening surge rates (+20%) on all calculations.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Surge Multiplier:</span>
                    <input
                      type="number"
                      step={0.1}
                      min={1}
                      max={2.5}
                      value={settings.surgeMultiplier}
                      onChange={(e) => updateSettings({ surgeMultiplier: parseFloat(e.target.value) })}
                      className="w-20 rounded-xl border border-arena-gold/30 bg-arena-dark px-3 py-1.5 text-sm font-bold text-arena-gold"
                    />
                  </div>

                  <button
                    onClick={() => updateSettings({ surgeEnabled: !settings.surgeEnabled })}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold tap-target transition-all ${
                      settings.surgeEnabled
                        ? "gold-gradient text-arena-dark shadow-[var(--shadow-gold)]"
                        : "border border-arena-gold/30 text-muted-foreground"
                    }`}
                  >
                    {settings.surgeEnabled ? "⚡ Surge Pricing ACTIVE" : "Surge Pricing OFF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Timing & Slot Adjustments */}
        {activeTab === "slots" && (
          <div className="mt-8 space-y-8">
            {/* Opening Hours & Slot Step Configuration */}
            <div className="glass-panel p-6 border border-arena-gold/30">
              <h3 className="font-display text-xl font-black text-gold-gradient">
                Venue Timing & Dynamic Slot Intervals
              </h3>
              <p className="text-xs text-muted-foreground">
                Set operating hours and slot breakdown intervals (e.g., 15m, 30m, 60m).
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Opening Time</label>
                  <input
                    type="time"
                    value={settings.openingTime || "10:00"}
                    onChange={(e) => updateSettings({ openingTime: e.target.value })}
                    className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-lg font-mono font-bold text-arena-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Closing Time</label>
                  <input
                    type="time"
                    value={settings.closingTime || "23:30"}
                    onChange={(e) => updateSettings({ closingTime: e.target.value })}
                    className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-lg font-mono font-bold text-arena-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Slot Step Interval</label>
                  <select
                    value={settings.slotIntervalMinutes}
                    onChange={(e) => updateSettings({ slotIntervalMinutes: Number(e.target.value) })}
                    className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-base font-bold text-arena-gold outline-none"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes (Standard)</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (Hourly)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block Time Slot / Buffer Management */}
            <div className="glass-panel p-6 border border-arena-gold/30">
              <h3 className="font-display text-xl font-black">Block Slots / Buffer Time Maintenance</h3>
              <p className="text-xs text-muted-foreground">
                Block specific time ranges for maintenance, private VIP events, or station sanitization.
              </p>

              <form onSubmit={handleAddBlock} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Date</label>
                  <input
                    type="date"
                    required
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">Start Time</label>
                  <input
                    type="time"
                    required
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">End Time</label>
                  <input
                    type="time"
                    required
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">Zone</label>
                  <select
                    value={blockZone}
                    onChange={(e) => setBlockZone(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-xs font-bold text-foreground"
                  >
                    <option value="all">Entire Arena (All Zones)</option>
                    <option value="ps5">PS5 VIP Only</option>
                    <option value="snooker">English Snooker Only</option>
                    <option value="french">French Billiards Only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-arena-crimson/80 py-2.5 text-xs font-extrabold text-white hover:bg-arena-crimson"
                >
                  🔒 Block Time Slot
                </button>
              </form>

              {/* Blocked Slots Table */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Currently Blocked Intervals</h4>
                {blockedSlots.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No slots are currently blocked.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {blockedSlots.map((blk) => (
                      <div key={blk.id} className="flex items-center justify-between rounded-xl border border-arena-crimson/30 bg-arena-crimson/10 p-3 text-xs">
                        <div>
                          <p className="font-bold text-arena-crimson">{blk.reason}</p>
                          <p className="text-muted-foreground">{blk.date} · {blk.startTime} - {blk.endTime}</p>
                          <p className="text-[10px] font-bold text-arena-gold capitalize">Zone: {blk.zoneId}</p>
                        </div>
                        <button
                          onClick={() => deleteBlockedSlot(blk.id)}
                          className="rounded-lg bg-arena-crimson/20 px-2 py-1 text-[11px] font-bold text-arena-crimson hover:bg-arena-crimson/40"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bookings & Walk-In Session Manager */}
        {activeTab === "bookings" && (
          <div className="mt-8 space-y-6">
            <div className="glass-panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-black">Slot Bookings Directory</h3>
                  <p className="text-xs text-muted-foreground">
                    Manage online slot reservations and add offline walk-in players.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-xs font-extrabold text-arena-dark shadow-[var(--shadow-gold)] tap-target"
                >
                  <Plus className="h-4 w-4" /> Add Walk-in Booking
                </button>
              </div>

              {/* Filters */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone or booking ID..."
                    className="w-full rounded-xl border border-arena-gold/20 bg-accent/20 pl-10 pr-4 py-2 text-sm text-foreground outline-none focus:border-arena-gold"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">Status:</span>
                  {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                        statusFilter === st
                          ? "bg-arena-gold text-arena-dark"
                          : "border border-arena-gold/15 bg-accent/20 text-muted-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-arena-gold/20 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Zone & Duration</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-arena-gold/10">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-accent/20">
                        <td className="py-4 px-4 font-mono font-bold text-arena-gold">{b.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold">{b.customerName}</div>
                          <div className="text-xs text-muted-foreground">{b.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold">
                            {b.zoneIds.map((z) => zonesData[z]?.name).join(" + ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {b.minutes} mins ({b.players} players)
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold">{b.bookingDate}</div>
                          <div className="text-xs text-muted-foreground">Slot: {b.slot}</div>
                        </td>
                        <td className="py-4 px-4 font-display font-black text-foreground">
                          {INR(b.total)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
                              b.status === "confirmed"
                                ? "bg-arena-cyan/20 text-arena-cyan"
                                : b.status === "completed"
                                ? "bg-arena-green/20 text-arena-green"
                                : b.status === "pending"
                                ? "bg-arena-gold/20 text-arena-gold animate-pulse"
                                : "bg-arena-crimson/20 text-arena-crimson"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBooking(b);
                                setRescheduleDate(b.bookingDate);
                                setRescheduleSlot(b.slot);
                                setRescheduleMins(b.minutes);
                              }}
                              className="rounded-lg border border-arena-gold/30 bg-arena-gold/10 px-2.5 py-1 text-xs font-bold text-arena-gold hover:bg-arena-gold/20"
                            >
                              Reschedule
                            </button>
                            {b.status === "pending" && (
                              <button
                                onClick={() => updateBookingStatus(b.id, "confirmed")}
                                className="rounded-lg bg-arena-green/20 px-2.5 py-1 text-xs font-bold text-arena-green hover:bg-arena-green/30"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status === "confirmed" && (
                              <button
                                onClick={() => updateBookingStatus(b.id, "completed")}
                                className="rounded-lg bg-arena-gold/20 px-2.5 py-1 text-xs font-bold text-arena-gold hover:bg-arena-gold/30"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="rounded-lg bg-arena-crimson/10 px-2 py-1 text-xs font-bold text-arena-crimson hover:bg-arena-crimson/20"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Stations & Hardware Manager */}
        {activeTab === "stations" && (
          <div className="mt-8 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="font-display text-xl font-black">Station & Board Availability</h3>
              <p className="text-xs text-muted-foreground">
                Track live gaming consoles, snooker tables and carom boards.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stations.map((st) => {
                  const isUse = st.status === "in_use";
                  const isMaint = st.status === "maintenance";
                  const zone = zonesData[st.zoneId];

                  return (
                    <div
                      key={st.id}
                      className={`glass-panel p-5 border transition-all ${
                        isUse
                          ? "border-arena-green/40 bg-arena-green/5 shadow-[var(--shadow-green)]"
                          : isMaint
                          ? "border-arena-crimson/30 bg-arena-crimson/5"
                          : "border-arena-gold/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{zone?.emoji}</span>
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
                            isUse
                              ? "bg-arena-green/20 text-arena-green"
                              : isMaint
                              ? "bg-arena-crimson/20 text-arena-crimson"
                              : "bg-arena-cyan/20 text-arena-cyan"
                          }`}
                        >
                          {st.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-lg font-bold">{st.name}</h4>
                      <p className="text-xs text-muted-foreground">{zone?.name}</p>

                      {isUse && (
                        <div className="mt-4 rounded-xl border border-arena-green/30 bg-arena-green/10 p-3 text-xs">
                          <p className="font-bold text-arena-green">
                            Occupied by: {st.assignedCustomer || "Player"}
                          </p>
                          <p className="mt-1 text-muted-foreground">
                            Started at {st.startTime || "14:00"} · Approx bill {INR(zone?.rate || 0)}/hr
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex gap-2 pt-2 border-t border-arena-gold/15">
                        <button
                          onClick={() => updateStationStatus(st.id, "available")}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold ${
                            st.status === "available" ? "gold-gradient text-arena-dark" : "border border-arena-gold/30 text-muted-foreground"
                          }`}
                        >
                          Available
                        </button>
                        <button
                          onClick={() => updateStationStatus(st.id, "in_use", "Walk-in Player")}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold ${
                            st.status === "in_use" ? "bg-arena-green text-arena-dark font-extrabold" : "border border-arena-green/30 text-arena-green"
                          }`}
                        >
                          Start Session
                        </button>
                        <button
                          onClick={() => updateStationStatus(st.id, "maintenance")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                            st.status === "maintenance" ? "bg-arena-crimson text-foreground" : "border border-arena-crimson/30 text-arena-crimson"
                          }`}
                        >
                          Maint.
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Settings & Security */}
        {activeTab === "settings" && (
          <div className="mt-8 max-w-2xl space-y-6">
            <div className="glass-panel p-6 border border-arena-gold/30">
              <h3 className="font-display text-xl font-black">Admin PIN & Arena Settings</h3>
              <p className="text-xs text-muted-foreground">
                Configure manager security code and global contact details.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Admin Security PIN
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={settings.adminPin}
                    onChange={(e) => updateSettings({ adminPin: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-lg font-mono font-bold text-arena-gold"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    This PIN protects the Admin Panel from unauthorized access.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Arena Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/20 px-4 py-2.5 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp Link URL
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappUrl}
                    onChange={(e) => updateSettings({ whatsappUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/20 px-4 py-2.5 text-sm text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Walk-in Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-arena-dark/80 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 shadow-[var(--shadow-gold)] border border-arena-gold/40">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-black">Add Walk-in Booking</h4>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddWalkin} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Select Zone</label>
                <select
                  value={walkinZone}
                  onChange={(e) => setWalkinZone(e.target.value as ZoneId)}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-arena-dark px-3 py-2 text-sm text-foreground"
                >
                  <option value="ps5">🎮 PlayStation 5 VIP (₹{zonesData.ps5.rate}/hr)</option>
                  <option value="snooker">🎱 English Snooker (₹{zonesData.snooker.rate}/hr)</option>
                  <option value="french">🥖 French Billiards (₹{zonesData.french.rate}/hr)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Duration (Minutes)</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    step={15}
                    min={15}
                    max={720}
                    value={walkinMins || ""}
                    onChange={(e) => setWalkinMins(Number(e.target.value))}
                    className="w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground outline-none focus:border-arena-gold"
                  />
                  <span className="text-xs font-bold text-muted-foreground">mins</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[30, 45, 60, 90, 120, 180, 240].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWalkinMins(m)}
                      className={`rounded-lg border px-2 py-1 text-[11px] font-bold ${
                        walkinMins === m
                          ? "border-arena-gold bg-arena-gold/20 text-arena-gold"
                          : "border-arena-gold/15 text-muted-foreground"
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl gold-gradient p-3 text-arena-dark font-display font-black text-center text-lg">
                Calculated Total: {INR(Math.round(((zonesData[walkinZone]?.rate || 300) / 60) * walkinMins))}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl gold-gradient py-3 font-extrabold text-arena-dark shadow-[var(--shadow-gold)]"
              >
                Save & Start Session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-arena-dark/80 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 shadow-[var(--shadow-gold)] border border-arena-gold/40">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-lg font-black">Reschedule Booking</h4>
                <p className="text-xs text-muted-foreground">{editingBooking.id} · {editingBooking.customerName}</p>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">New Start Time Slot</label>
                <input
                  type="time"
                  required
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Duration (Minutes)</label>
                <input
                  type="number"
                  step={15}
                  min={15}
                  max={720}
                  value={rescheduleMins}
                  onChange={(e) => setRescheduleMins(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-arena-gold/20 bg-accent/30 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl gold-gradient py-3 font-extrabold text-arena-dark shadow-[var(--shadow-gold)]"
              >
                Confirm Reschedule & Recalculate Bill
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
