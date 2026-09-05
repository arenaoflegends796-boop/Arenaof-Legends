import { useState, type FormEvent } from "react";
import { CheckCircle2, Minus, Plus, X } from "lucide-react";
import { INR, WHATSAPP, formatDuration, useArena, type ZoneId } from "./state";

const ZONE_LIST: ZoneId[] = ["ps5", "snooker", "french"];

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-arena-gold/15 bg-accent/30 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-center font-display text-2xl font-black">
          {value}
          {value >= max && suffix === "+" ? "+" : ""}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DurationPicker({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-arena-gold/15 bg-accent/30 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Duration (minutes)
      </p>
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          aria-label="Decrease duration"
          onClick={() => onChange(Math.max(1, minutes - 1))}
          disabled={minutes <= 1}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Typeable Input */}
        <div className="flex items-center justify-center gap-1">
          <input
            type="number"
            min={1}
            max={720}
            step={1}
            value={minutes || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) onChange(val);
              else if (e.target.value === "") onChange(0);
            }}
            className="w-24 rounded-xl border border-arena-gold/40 bg-arena-dark/80 px-2 py-1.5 text-center font-display text-2xl font-black text-arena-gold outline-none focus:border-arena-gold"
          />
          <span className="text-sm font-bold text-muted-foreground">min</span>
        </div>

        <button
          type="button"
          aria-label="Increase duration"
          onClick={() => onChange(Math.min(720, minutes + 1))}
          disabled={minutes >= 720}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-arena-gold">
        = {formatDuration(minutes)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 15, 30, 45, 60, 90, 120, 180].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
              minutes === m
                ? "border-arena-gold bg-accent/60 text-arena-gold shadow-[var(--shadow-gold)]"
                : "border-arena-gold/15 text-muted-foreground"
            }`}
          >
            {formatDuration(m)}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-arena-gold/20 bg-arena-dark/60 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-arena-gold tap-target";

export function BookingSection() {
  const { zones, toggleZone, minutes, setMinutes, players, setPlayers, total, zonesData, addBooking, settings, blockedSlots, bookings } = useArena();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState("18:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [format, setFormat] = useState("");
  const [utr, setUtr] = useState("");
  const [done, setDone] = useState(false);
  const [slotPeriod, setSlotPeriod] = useState<"morning" | "afternoon" | "evening">("evening");

  // Dynamically generate slots based on Arena Settings (Opening/Closing & Interval)
  const availableTimeSlots = (() => {
    const slotsList: string[] = [];
    const openParts = (settings.openingTime || "10:00").split(":");
    const startH = Number(openParts[0] ?? 10);
    const startM = Number(openParts[1] ?? 0);
    const closeParts = (settings.closingTime || "23:30").split(":");
    const endH = Number(closeParts[0] ?? 23);
    const endM = Number(closeParts[1] ?? 30);
    const interval = settings.slotIntervalMinutes || 30;

    let currentMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    while (currentMinutes <= endTotalMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const formatted = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      slotsList.push(formatted);
      currentMinutes += interval;
    }
    return slotsList;
  })();

  const filteredSlots = availableTimeSlots.filter((s) => {
    const hour = parseInt(s.split(":")[0] ?? "0", 10);
    if (slotPeriod === "morning") return hour < 14;
    if (slotPeriod === "afternoon") return hour >= 14 && hour < 18;
    return hour >= 18;
  });

  const selectedHour = parseInt(slot.split(":")[0] ?? "0", 10);
  const isPrimeSlot = selectedHour >= 18 && selectedHour <= 22;

  const isSlotBlocked = (slotTime: string) => {
    const activeDate = date || new Date().toISOString().split('T')[0] || "2026-09-02";
    const isMaintenanceBlocked = blockedSlots.some(
      (b) =>
        b.date === activeDate &&
        (b.zoneId === "all" || zones.includes(b.zoneId as ZoneId)) &&
        slotTime >= b.startTime &&
        slotTime <= b.endTime
    );

    const isAlreadyBooked = bookings.some((b) => {
      if (b.bookingDate !== activeDate || b.status === "cancelled") return false;
      const sharesZone = b.zoneIds.some((z) => zones.includes(z));
      if (!sharesZone) return false;

      // Check slot time overlap based on booking start slot and duration minutes
      const bParts = b.slot.split(":");
      const bStartH = Number(bParts[0] ?? 0);
      const bStartM = Number(bParts[1] ?? 0);
      const bStartTotalMins = bStartH * 60 + bStartM;
      const bEndTotalMins = bStartTotalMins + (b.minutes || 60);

      const slotParts = slotTime.split(":");
      const slotH = Number(slotParts[0] ?? 0);
      const slotM = Number(slotParts[1] ?? 0);
      const slotTotalMins = slotH * 60 + slotM;

      return slotTotalMins >= bStartTotalMins && slotTotalMins < bEndTotalMins;
    });

    return isMaintenanceBlocked || isAlreadyBooked;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isSlotBlocked(slot)) {
      alert("This time slot is blocked for maintenance or private event. Please pick another time slot.");
      return;
    }
    addBooking({
      customerName: name,
      phone,
      bookingDate: date || new Date().toISOString().split('T')[0] || "2026-09-02",
      slot,
      zoneIds: zones,
      minutes,
      players,
      total,
      preferredFormat: format,
    });
    setDone(true);
  };

  return (
    <section id="booking" className="px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-arena-gold">
            Live Rate Calculator
          </span>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Estimate & lock your slot
          </h2>
          <p className="mt-3 text-muted-foreground">
            Toggle zones and set your duration in minutes — your total updates instantly.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Calculator */}
          <div className="glass-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Select zones
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {ZONE_LIST.map((z) => {
                const active = zones.includes(z);
                const info = zonesData[z];
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => toggleZone(z)}
                    className={`rounded-2xl border px-3 py-4 text-left transition-shadow tap-target ${
                      active
                        ? "border-arena-gold bg-accent/60 shadow-[var(--shadow-gold)]"
                        : "border-arena-gold/15 bg-accent/20"
                    }`}
                  >
                    <span className="text-xl">{info?.emoji}</span>
                    <span className="mt-1 block text-sm font-bold">{info?.name}</span>
                    <span className="text-xs font-semibold text-arena-gold">
                      {INR(info?.rate || 0)}/hr
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <DurationPicker minutes={minutes} onChange={setMinutes} />
            </div>

            <div className="mt-4 rounded-2xl gold-gradient p-5 text-arena-dark">
              <p className="text-xs font-black uppercase tracking-widest">Estimated total</p>
              <p className="mt-1 font-display text-4xl font-black">{INR(total)}</p>
              <p className="mt-1 text-sm font-semibold">
                {zones.map((z) => zonesData[z]?.name).filter(Boolean).join(" + ")} · {minutes} min ({formatDuration(minutes)})
              </p>
            </div>
          </div>

          {/* Lead funnel */}
          <form onSubmit={submit} className="glass-panel flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${
                    s <= step ? "gold-gradient" : "bg-accent"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-arena-gold">
              Step {step} of 3
            </p>

            {step === 1 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-black">Zones & time slot</h3>

                <div className="rounded-xl border border-arena-gold/30 bg-accent/40 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-arena-gold flex items-center gap-1.5">
                    <span>🕒 Venue Hours:</span>
                    <span>Open Time: <strong>{settings.openingTime || "10:00 AM"}</strong></span>
                    <span>·</span>
                    <span>Close Time: <strong>{settings.closingTime || "11:30 PM"}</strong></span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">({settings.slotIntervalMinutes}m steps)</span>
                </div>

                <p className="rounded-xl border border-arena-gold/15 bg-accent/30 px-4 py-3 text-sm text-muted-foreground">
                  Selected: {zones.map((z) => `${zonesData[z]?.emoji} ${zonesData[z]?.name}`).join(", ")}
                </p>
                
                <label className="text-sm font-semibold flex items-center justify-between" htmlFor="slot">
                  <span>Preferred time slot</span>
                  <span className="text-xs font-normal text-arena-gold">
                    Open: {settings.openingTime || "10:00"} – Close: {settings.closingTime || "23:30"}
                  </span>
                </label>

                {/* Nav Pills Category Tabs: Morning, Afternoon, Evening */}
                <div className="flex flex-col gap-2">
                  <div className="flex rounded-xl bg-accent/40 p-1 border border-arena-gold/20">
                    <button
                      type="button"
                      onClick={() => setSlotPeriod("morning")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        slotPeriod === "morning"
                          ? "bg-arena-gold text-arena-dark shadow-[var(--shadow-gold)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🌅 Morning (10am-2pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlotPeriod("afternoon")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        slotPeriod === "afternoon"
                          ? "bg-arena-gold text-arena-dark shadow-[var(--shadow-gold)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      ☀️ Afternoon (2pm-6pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlotPeriod("evening")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        slotPeriod === "evening"
                          ? "bg-arena-gold text-arena-dark shadow-[var(--shadow-gold)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🌙 Evening (6pm-11pm)
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border border-arena-gold/15 rounded-xl bg-accent/10">
                    {filteredSlots.map((s) => {
                      const hour = parseInt(s.split(":")[0] ?? "0", 10);
                      const isPeak = settings.surgeEnabled && hour >= settings.peakStartHour && hour < settings.peakEndHour;
                      const blocked = isSlotBlocked(s);

                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={blocked}
                          onClick={() => setSlot(s)}
                          className={`relative rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                            blocked
                              ? "border-arena-crimson/30 bg-arena-crimson/10 text-arena-crimson line-through cursor-not-allowed"
                              : slot === s
                              ? "border-arena-gold bg-arena-gold/20 text-arena-gold shadow-[var(--shadow-gold)] ring-1 ring-arena-gold"
                              : "border-arena-gold/20 text-muted-foreground hover:border-arena-gold/50"
                          }`}
                        >
                          {s}
                          {isPeak && !blocked && <span className="ml-1 text-[9px] font-black text-arena-gold">⚡</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Scarcity Logic for Prime Slots (18:00 - 22:00) */}
                  {isPrimeSlot && (
                    <div className="rounded-xl border border-arena-crimson/40 bg-arena-crimson/10 p-2.5 text-center animate-pulse">
                      <p className="text-xs font-black tracking-wide text-arena-crimson uppercase flex items-center justify-center gap-1.5">
                        <span className="text-base">🔥</span> High demand: Only 2 slots left for this prime session!
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="slot"
                    type="time"
                    required
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-black">Duration & estimate</h3>
                <DurationPicker minutes={minutes} onChange={setMinutes} />
                <p className="rounded-xl border border-arena-gold/30 bg-accent/40 px-4 py-3 font-display text-lg font-black text-arena-gold">
                  Estimated: {INR(total)}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-black">Contact info</h3>
                <input
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp / phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
                <input
                  placeholder="Preferred game (e.g. God of War Ragnarök, EA FC 26, GTA V, MK1)"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={inputCls}
                />
              </div>
            )}

            <div className="mt-auto flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border border-arena-gold/30 px-5 py-3 font-bold text-arena-gold tap-target"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 rounded-xl gold-gradient px-5 py-3 font-extrabold text-arena-dark tap-target"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient px-5 py-3 font-extrabold text-arena-dark shadow-[var(--shadow-gold)] tap-target"
                >
                  Lock In Time Slot & Get WhatsApp Confirmation
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-arena-dark/90 p-4 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel relative w-full max-w-lg p-6 sm:p-8 text-center shadow-[var(--shadow-gold)] border border-arena-gold/30 my-8">
            <button
              aria-label="Close confirmation"
              onClick={() => setDone(false)}
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-accent/40 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="inline-flex items-center justify-center rounded-full bg-arena-gold/10 p-3 mb-2">
              <CheckCircle2 className="h-10 w-10 text-arena-gold" />
            </div>

            <h3 className="font-display text-2xl font-black text-gold-gradient">
              Complete Payment to Confirm
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Scan the PhonePe QR Code below to pay <span className="font-bold text-arena-gold">{INR(total)}</span>
            </p>

            {/* PhonePe QR Display */}
            <div className="my-5 flex flex-col items-center justify-center rounded-2xl border border-arena-gold/20 bg-white p-5 text-black shadow-lg">
              <div className="w-full max-w-[260px] rounded-xl border border-purple-200 bg-purple-50/50 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display font-black text-purple-900 text-lg">PhonePe</span>
                  <span className="rounded-md bg-orange-500 text-black px-2 py-0.5 text-xs font-black">ARENA OF LEGENDS</span>
                </div>
                <img
                  src="/phonepe-qr-real.png"
                  alt="PhonePe Arena Of Legends Scannable QR Code"
                  className="w-full h-auto object-contain rounded-lg border border-gray-200 shadow-sm"
                />
                <p className="mt-3 text-[11px] font-bold text-gray-700">Scan using PhonePe / GPay / Paytm</p>
                <p className="text-[10px] text-gray-500 font-mono">Terminal 2-Q063636960</p>
              </div>
            </div>

            {/* Direct UPI Link Button for Mobile */}
            <a
              href={`upi://pay?pa=Q063636960@ybl&pn=Arena%20Of%20Legends&am=${total}&cu=INR`}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 px-4 py-3 font-bold text-white transition-all shadow-md"
            >
              <span>📱 Open PhonePe / GPay App to Pay</span>
            </a>

            {/* UTR Input Form */}
            <div className="rounded-xl border border-arena-gold/20 bg-accent/30 p-4 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-arena-gold mb-1.5">
                Step 2: Enter Transaction ID / UTR (12 digits)
              </label>
              <input
                type="text"
                placeholder="e.g. 423987654321"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full rounded-xl border border-arena-gold/30 bg-arena-dark/80 px-4 py-2.5 text-sm text-foreground outline-none focus:border-arena-gold"
              />
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={`${WHATSAPP}?text=Hi%20Arena%20Of%20Legends,%20I%20have%20completed%20the%20payment%20for%20my%20slot!%0A%0A👤%20Name:%20${encodeURIComponent(name)}%0A💰%20Amount:%20${encodeURIComponent(INR(total))}%0A🔢%20UTR%20/%20Txn%20ID:%20${encodeURIComponent(utr || "Not provided")}%0A%0ASending%20payment%20screenshot.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl gold-gradient px-5 py-3 font-extrabold text-arena-dark shadow-[var(--shadow-gold)] tap-target"
              >
                Send Payment & UTR on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
