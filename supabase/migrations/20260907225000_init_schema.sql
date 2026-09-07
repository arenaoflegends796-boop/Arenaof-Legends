-- Migration: Create core tables, enums, functions, and RLS policies for Arena of Legends

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE IF NOT EXISTS public.zones (
  id text PRIMARY KEY,
  name text NOT NULL,
  rate integer NOT NULL DEFAULT 0,
  emoji text NOT NULL DEFAULT '🎮',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zones TO authenticated;
GRANT ALL ON public.zones TO service_role;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Zones are publicly readable" ON public.zones FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage zones" ON public.zones FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DROP TRIGGER IF EXISTS zones_updated_at ON public.zones;
CREATE TRIGGER zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.zones (id,name,rate,emoji,sort_order) VALUES
  ('ps5','PlayStation 5 VIP',300,'🎮',1),
  ('snooker','English Snooker',240,'🎱',2),
  ('french','French Billiards',160,'🥖',3)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id text,
  zone_ids text[] NOT NULL DEFAULT '{}',
  station_id text,
  booking_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time text,
  end_time text,
  slot text NOT NULL DEFAULT '12:00',
  minutes integer NOT NULL DEFAULT 60,
  players integer NOT NULL DEFAULT 1,
  customer_name text NOT NULL,
  phone text NOT NULL,
  preferred_format text,
  payment_mode text NOT NULL DEFAULT 'UPI',
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'CONFIRMED',
  source text NOT NULL DEFAULT 'ONLINE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
