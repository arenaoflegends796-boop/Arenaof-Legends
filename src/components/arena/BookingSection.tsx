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
          onClick={() => onChange(Math.max(15, minutes - 15))}
          disabled={minutes <= 15}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-arena-gold/30 text-arena-gold disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Typeable Input */}
        <div className="flex items-center justify-center gap-1">
          <input
            type="number"
            min={15}
            max={720}
            step={15}
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
          onClick={() => onChange(Math.min(720, minutes + 15))}
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
        {[30, 45, 60, 90, 120, 180, 240, 300].map((m) => (
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
  const { zones, toggleZone, minutes, setMinutes, players, setPlayers, total, zonesData, addBooking, settings, blockedSlots } = useArena();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState("18:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [format, setFormat] = useState("");
  const [done, setDone] = useState(false);

  // Dynamically generate slots based on Arena Settings (Opening/Closing & Interval)
  const availableTimeSlots = (() => {
    const slotsList: string[] = [];
    const [startH, startM] = (settings.openingTime || "10:00").split(":").map(Number);
    const [endH, endM] = (settings.closingTime || "23:30").split(":").map(Number);
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

  const isSlotBlocked = (slotTime: string) => {
    const isMaintenanceBlocked = blockedSlots.some(
      (b) =>
        b.date === date &&
        (b.zoneId === "all" || zones.includes(b.zoneId as ZoneId)) &&
        slotTime >= b.startTime &&
        slotTime <= b.endTime
    );

    const isAlreadyBooked = bookings.some((b) => {
      if (b.bookingDate !== date || b.status === "cancelled") return false;
      const sharesZone = b.zoneIds.some((z) => zones.includes(z));
      if (!sharesZone) return false;

      // Check slot time overlap based on booking start slot and duration minutes
      const [bStartH, bStartM] = b.slot.split(":").map(Number);
      const bStartTotalMins = bStartH * 60 + bStartM;
      const bEndTotalMins = bStartTotalMins + (b.minutes || 60);

      const [slotH, slotM] = slotTime.split(":").map(Number);
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
      bookingDate: date,
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
            Toggle zones, set your duration in minutes and players — your total updates instantly.
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DurationPicker minutes={minutes} onChange={setMinutes} />
              <Stepper
                label="Players"
                value={players}
                onChange={setPlayers}
                min={1}
                max={20}
                suffix="+"
              />
            </div>

            <div className="mt-4 rounded-2xl gold-gradient p-5 text-arena-dark">
              <p className="text-xs font-black uppercase tracking-widest">Estimated total</p>
              <p className="mt-1 font-display text-4xl font-black">{INR(total)}</p>
              <p className="mt-1 text-sm font-semibold">
                {zones.map((z) => zonesData[z]?.name).filter(Boolean).join(" + ")} · {minutes} min ({formatDuration(minutes)}) ·{" "}
                {players} players
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
                <h3 className="font-display text-xl font-black">Zones, date & time slot</h3>
                <p className="rounded-xl border border-arena-gold/15 bg-accent/30 px-4 py-3 text-sm text-muted-foreground">
                  Selected: {zones.map((z) => `${zonesData[z]?.emoji} ${zonesData[z]?.name}`).join(", ")}
                </p>

                <label className="text-sm font-semibold" htmlFor="date">
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
                <label className="text-sm font-semibold flex items-center justify-between" htmlFor="slot">
                  <span>Preferred time slot</span>
                  <span className="text-xs font-normal text-arena-gold">
                    {settings.openingHours} ({settings.slotIntervalMinutes}m steps)
                  </span>
                </label>

                {/* Popular Dynamic Time Slots Selector */}
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 border border-arena-gold/15 rounded-xl bg-accent/10">
                  {availableTimeSlots.map((s) => {
                    const hour = parseInt(s.split(":")[0], 10);
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
                            ? "border-arena-gold bg-accent/80 text-arena-gold shadow-[var(--shadow-gold)]"
                            : "border-arena-gold/20 text-muted-foreground hover:border-arena-gold/40"
                        }`}
                      >
                        {s}
                        {isPeak && !blocked && <span className="ml-1 text-[9px] font-black text-arena-gold">⚡</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
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
                <h3 className="font-display text-xl font-black">Players & estimate</h3>
                <Stepper
                  label="Players"
                  value={players}
                  onChange={setPlayers}
                  min={1}
                  max={20}
                  suffix="+"
                />
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
                  placeholder="Preferred game / match format (e.g. EA FC 1v1)"
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
        <div className="fixed inset-0 z-[60] grid place-items-center bg-arena-dark/80 p-4 backdrop-blur-sm">
          <div className="glass-panel relative w-full max-w-md p-8 text-center shadow-[var(--shadow-gold)]">
            <button
              aria-label="Close confirmation"
              onClick={() => setDone(false)}
              className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-xl text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <CheckCircle2 className="mx-auto h-14 w-14 text-arena-green" />
            <h3 className="mt-4 font-display text-2xl font-black text-gold-gradient">
              Slot Request Sent!
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Arena OF Legends staff will WhatsApp/call you within 15 minutes to lock your station.
            </p>
            <p className="mt-4 font-display text-xl font-black">{INR(total)}</p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl gold-gradient px-5 py-3 font-extrabold text-arena-dark tap-target"
            >
              Chat on WhatsApp now
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
