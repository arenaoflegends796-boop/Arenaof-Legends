import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ZoneId = "ps5" | "snooker" | "french";

export type ZoneInfo = {
  id: ZoneId;
  name: string;
  rate: number; // rate per hour in INR
  emoji: string;
  active: boolean;
};

export type BookingItem = {
  id: string;
  customerName: string;
  phone: string;
  bookingDate: string;
  slot: string;
  zoneIds: ZoneId[];
  minutes: number;
  players: number;
  total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  preferredFormat?: string;
};

export type StationItem = {
  id: string;
  name: string;
  zoneId: ZoneId;
  status: "available" | "in_use" | "maintenance";
  currentSessionMinutes?: number;
  startTime?: string;
  assignedCustomer?: string;
};

export type BlockedSlot = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  zoneId: ZoneId | "all";
  reason: string;
};

export type ArenaSettings = {
  adminPin: string;
  surgeMultiplier: number;
  surgeEnabled: boolean;
  arenaName: string;
  contactPhone: string;
  whatsappUrl: string;
  openingHours: string;
  slotIntervalMinutes: number; // e.g. 15, 30, 60 min intervals
  bufferMinutes: number; // cleaning/rest buffer between slots (e.g. 10 mins)
  openingTime: string; // e.g. "10:00"
  closingTime: string; // e.g. "23:30"
  peakStartHour: number; // e.g. 18 (6 PM)
  peakEndHour: number; // e.g. 22 (10 PM)
};

export const DEFAULT_ZONES: Record<ZoneId, ZoneInfo> = {
  ps5: { id: "ps5", name: "PlayStation 5 VIP", rate: 300, emoji: "🎮", active: true },
  snooker: { id: "snooker", name: "English Snooker", rate: 240, emoji: "🎱", active: true },
  french: { id: "french", name: "French Billiards", rate: 160, emoji: "🥖", active: true },
};

const DEFAULT_SETTINGS: ArenaSettings = {
  adminPin: "1234",
  surgeMultiplier: 1.2,
  surgeEnabled: false,
  arenaName: "Arena of Legends",
  contactPhone: "+917483992257",
  whatsappUrl: "https://wa.me/917483992257",
  openingHours: "10:00 AM - 11:30 PM",
  slotIntervalMinutes: 30,
  bufferMinutes: 10,
  openingTime: "10:00",
  closingTime: "23:30",
  peakStartHour: 18,
  peakEndHour: 22,
};

const MOCK_INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: "BK-1001",
    customerName: "Rahul Sharma",
    phone: "+919811223344",
    bookingDate: "2026-08-28",
    slot: "18:00",
    zoneIds: ["ps5"],
    minutes: 120,
    players: 2,
    total: 600,
    status: "confirmed",
    createdAt: "2026-08-28T10:15:00Z",
    preferredFormat: "EA FC 25 1v1",
  },
  {
    id: "BK-1002",
    customerName: "Vikram Singh",
    phone: "+919877665544",
    bookingDate: "2026-08-28",
    slot: "19:30",
    zoneIds: ["snooker"],
    minutes: 90,
    players: 2,
    total: 360,
    status: "pending",
    createdAt: "2026-08-28T11:00:00Z",
  },
  {
    id: "BK-1003",
    customerName: "Ananya Iyer",
    phone: "+919822334455",
    bookingDate: "2026-08-27",
    slot: "16:00",
    zoneIds: ["ps5", "snooker"],
    minutes: 180,
    players: 4,
    total: 1620,
    status: "completed",
    createdAt: "2026-08-27T12:00:00Z",
  },
  {
    id: "BK-1004",
    customerName: "Karan Mehta",
    phone: "+919899887766",
    bookingDate: "2026-08-26",
    slot: "20:00",
    zoneIds: ["french"],
    minutes: 120,
    players: 2,
    total: 320,
    status: "completed",
    createdAt: "2026-08-26T15:30:00Z",
  },
  {
    id: "BK-1005",
    customerName: "Sameer Verma",
    phone: "+919812345678",
    bookingDate: "2026-08-25",
    slot: "17:00",
    zoneIds: ["ps5"],
    minutes: 60,
    players: 2,
    total: 300,
    status: "completed",
    createdAt: "2026-08-25T14:00:00Z",
  },
];

const DEFAULT_STATIONS: StationItem[] = [
  { id: "ST-PS5-1", name: "PS5 VIP Station 1", zoneId: "ps5", status: "in_use", currentSessionMinutes: 75, startTime: "13:00", assignedCustomer: "Rahul Sharma" },
  { id: "ST-PS5-2", name: "PS5 VIP Station 2", zoneId: "ps5", status: "available" },
  { id: "ST-SNK-1", name: "Snooker Board 1 (Strachan 6811)", zoneId: "snooker", status: "available" },
  { id: "ST-SNK-2", name: "Snooker Board 2 (Tournament)", zoneId: "snooker", status: "in_use", currentSessionMinutes: 45, startTime: "13:30", assignedCustomer: "Vikram Singh" },
  { id: "ST-FRN-1", name: "French Carom Table 1", zoneId: "french", status: "available" },
];

type ArenaState = {
  zonesData: Record<ZoneId, ZoneInfo>;
  updateZoneRate: (id: ZoneId, rate: number) => void;
  toggleZoneActive: (id: ZoneId) => void;

  // Public calculator state
  zones: ZoneId[];
  toggleZone: (z: ZoneId) => void;
  selectZone: (z: ZoneId) => void;
  minutes: number;
  setMinutes: (n: number) => void;
  players: number;
  setPlayers: (n: number) => void;
  total: number;

  // Admin & Bookings
  bookings: BookingItem[];
  addBooking: (b: Omit<BookingItem, "id" | "createdAt" | "status">) => BookingItem;
  updateBooking: (id: string, updated: Partial<BookingItem>) => void;
  updateBookingStatus: (id: string, status: BookingItem["status"]) => void;
  deleteBooking: (id: string) => void;

  // Blocked Slots & Maintenance
  blockedSlots: BlockedSlot[];
  addBlockedSlot: (b: Omit<BlockedSlot, "id">) => void;
  deleteBlockedSlot: (id: string) => void;

  // Station Management
  stations: StationItem[];
  updateStationStatus: (id: string, status: StationItem["status"], customerName?: string) => void;

  // Settings & PIN
  settings: ArenaSettings;
  updateSettings: (newSettings: Partial<ArenaSettings>) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
};

const Ctx = createContext<ArenaState | null>(null);

export function ArenaProvider({ children }: { children: ReactNode }) {
  // Zone Rates state with localStorage persistence
  const [zonesData, setZonesData] = useState<Record<ZoneId, ZoneInfo>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aol_zones");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return DEFAULT_ZONES;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aol_zones", JSON.stringify(zonesData));
    }
  }, [zonesData]);

  // Bookings state
  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aol_bookings");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return MOCK_INITIAL_BOOKINGS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aol_bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  // Blocked slots state
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aol_blocked_slots");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [
      { id: "BLK-1", date: "2026-08-28", startTime: "14:00", endTime: "16:00", zoneId: "snooker", reason: "Tournament Cloth Maintenance" }
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aol_blocked_slots", JSON.stringify(blockedSlots));
    }
  }, [blockedSlots]);

  // Stations state
  const [stations, setStations] = useState<StationItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aol_stations");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return DEFAULT_STATIONS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aol_stations", JSON.stringify(stations));
    }
  }, [stations]);

  // Settings state
  const [settings, setSettings] = useState<ArenaSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aol_settings");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aol_settings", JSON.stringify(settings));
    }
  }, [settings]);

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aol_admin_auth") === "true";
    }
    return false;
  });

  // Public Booking Calculator State
  const [zones, setZones] = useState<ZoneId[]>(["ps5"]);
  const [minutes, setMinutes] = useState(120);
  const [players, setPlayers] = useState(1);

  const value = useMemo<ArenaState>(() => {
    const hourlySum = zones.reduce((sum, z) => sum + (zonesData[z]?.rate || 0), 0);
    const multiplier = settings.surgeEnabled ? settings.surgeMultiplier : 1;
    const total = Math.round(((hourlySum / 60) * minutes) * multiplier);

    return {
      zonesData,
      updateZoneRate: (id, rate) => {
        setZonesData((prev) => ({
          ...prev,
          [id]: { ...prev[id], rate },
        }));
      },
      toggleZoneActive: (id) => {
        setZonesData((prev) => ({
          ...prev,
          [id]: { ...prev[id], active: !prev[id].active },
        }));
      },

      zones,
      minutes,
      players,
      total,
      setMinutes: (n) => setMinutes(Math.min(720, Math.max(1, n))),
      setPlayers: (n) => setPlayers(Math.min(20, Math.max(1, n))),
      toggleZone: (z) =>
        setZones((cur) =>
          cur.includes(z) ? (cur.length > 1 ? cur.filter((x) => x !== z) : cur) : [...cur, z],
        ),
      selectZone: (z) => setZones([z]),

      bookings,
      addBooking: (b) => {
        const newBooking: BookingItem = {
          ...b,
          id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          status: "pending",
        };
        setBookings((prev) => [newBooking, ...prev]);
        return newBooking;
      },
      updateBooking: (id, updated) => {
        setBookings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
        );
      },
      updateBookingStatus: (id, status) => {
        setBookings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      },
      deleteBooking: (id) => {
        setBookings((prev) => prev.filter((item) => item.id !== id));
      },

      blockedSlots,
      addBlockedSlot: (b) => {
        const newBlock: BlockedSlot = {
          ...b,
          id: `BLK-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setBlockedSlots((prev) => [newBlock, ...prev]);
      },
      deleteBlockedSlot: (id) => {
        setBlockedSlots((prev) => prev.filter((item) => item.id !== id));
      },

      stations,
      updateStationStatus: (id, status, customerName) => {
        setStations((prev) =>
          prev.map((s) => {
            if (s.id !== id) return s;
            if (status === "in_use") {
              return {
                ...s,
                status,
                assignedCustomer: customerName || "Walk-in Customer",
                startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                currentSessionMinutes: 0,
              };
            }
            const { assignedCustomer, startTime, currentSessionMinutes, ...rest } = s;
            return { ...rest, status };
          })
        );
      },

      settings,
      updateSettings: (newSet) => setSettings((prev) => ({ ...prev, ...newSet })),

      isAdminAuthenticated,
      loginAdmin: (pin) => {
        if (pin === settings.adminPin) {
          setIsAdminAuthenticated(true);
          if (typeof window !== "undefined") localStorage.setItem("aol_admin_auth", "true");
          return true;
        }
        return false;
      },
      logoutAdmin: () => {
        setIsAdminAuthenticated(false);
        if (typeof window !== "undefined") localStorage.removeItem("aol_admin_auth");
      },
    };
  }, [zonesData, zones, minutes, players, bookings, blockedSlots, stations, settings, isAdminAuthenticated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useArena() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useArena must be used within ArenaProvider");
  return ctx;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

export const PHONE = "+917483992257";
export const WHATSAPP = "https://wa.me/917483992257";
