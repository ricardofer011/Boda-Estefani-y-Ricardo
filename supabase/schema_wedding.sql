-- ==============================================================================
-- ESQUEMA OFICIAL SUPABASE — BODA ESTEFANI & RICARDO
-- Proyecto: https://nfjkyygjuzsjygvlpbff.supabase.co
-- ==============================================================================
-- Copia y pega este script en el SQL Editor de tu proyecto en Supabase y pulsa RUN.
-- ==============================================================================

-- 1. Extensión para IDs únicos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabla de Confirmaciones (RSVP)
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    phone TEXT,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'declined')),
    guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 10),
    companion_names TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT,
    message TEXT,
    invitation_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Invitados (Guests)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    max_guests INTEGER NOT NULL DEFAULT 2 CHECK (max_guests >= 1 AND max_guests <= 10),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    confirmed_count INTEGER DEFAULT 0,
    group_name TEXT,
    notes TEXT,
    gift_type TEXT DEFAULT 'bank',
    invitation_scope TEXT DEFAULT 'church_and_reception',
    invitation_role TEXT DEFAULT 'standard',
    invited_by TEXT DEFAULT 'estefani',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Si la tabla ya existía, añadir columnas nuevas con seguridad:
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS invited_by TEXT DEFAULT 'estefani';
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS invitation_role TEXT DEFAULT 'standard';
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS invitation_scope TEXT DEFAULT 'church_and_reception';
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS gift_type TEXT DEFAULT 'bank';

-- 4. Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON public.rsvps (attendance_status);
CREATE INDEX IF NOT EXISTS idx_guests_code ON public.guests (code);

-- 5. Habilitar Seguridad RLS con acceso para tu clave API
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura para rsvps
DROP POLICY IF EXISTS "Permitir todo en rsvps" ON public.rsvps;
CREATE POLICY "Permitir todo en rsvps" ON public.rsvps FOR ALL USING (true) WITH CHECK (true);

-- Políticas de lectura y escritura para guests
DROP POLICY IF EXISTS "Permitir todo en guests" ON public.guests;
CREATE POLICY "Permitir todo en guests" ON public.guests FOR ALL USING (true) WITH CHECK (true);

-- 6. Insertar código base para Damas de Honor y muestra inicial
INSERT INTO public.guests (code, full_name, max_guests, status, group_name, notes, invitation_scope, invitation_role, invited_by)
VALUES 
    ('damas', 'Queridas Damas de Honor', 1, 'pending', 'Corte de Honor', 'Acceso general Damas de Boda', 'church_and_reception', 'bridesmaid', 'estefani')
ON CONFLICT (code) DO NOTHING;
