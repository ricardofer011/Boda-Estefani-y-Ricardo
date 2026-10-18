-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE — BODA ESTEFANI & RICARDO
-- ==============================================================================
-- Este script crea las tablas, índices, políticas de seguridad (RLS) y funciones
-- necesarias para gestionar las confirmaciones de asistencia (RSVP) y la lista
-- de invitados de la boda católica de Estefani & Ricardo.
-- ==============================================================================

-- 1. EXTENSIÓN PARA UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE CONFIRMACIONES (RSVP)
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

-- Comentarios explicativos en columnas
COMMENT ON TABLE public.rsvps IS 'Registro de confirmaciones de asistencia a la boda';
COMMENT ON COLUMN public.rsvps.guest_name IS 'Nombre y apellido del invitado principal';
COMMENT ON COLUMN public.rsvps.attendance_status IS 'attending (asistirá) o declined (no asistirá)';
COMMENT ON COLUMN public.rsvps.guest_count IS 'Total de personas que asistirán (1 si no tiene acompañantes)';
COMMENT ON COLUMN public.rsvps.companion_names IS 'Lista de nombres de los acompañantes';

-- 3. TABLA DE INVITADOS PRE-REGISTRADOS (OPCIONAL PARA CONTROL DE PASES)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    max_guests INTEGER NOT NULL DEFAULT 2 CHECK (max_guests >= 1 AND max_guests <= 10),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.guests IS 'Lista oficial previa de invitados y límite de pases';

-- 4. ÍNDICES DE RENDIMIENTO Y BÚSQUEDA
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance_status ON public.rsvps (attendance_status);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_name ON public.rsvps (guest_name);
CREATE INDEX IF NOT EXISTS idx_guests_code ON public.guests (code);

-- 5. FUNCIÓN TRIGGER PARA ACTUALIZAR 'updated_at' AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER trigger_rsvps_updated_at
    BEFORE UPDATE ON public.rsvps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Regla 1: Cualquier visitante público puede INSERTAR una confirmación en rsvps.
DROP POLICY IF EXISTS "Permitir inserción pública de confirmaciones" ON public.rsvps;
CREATE POLICY "Permitir inserción pública de confirmaciones"
    ON public.rsvps
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Regla 2: El público NO puede consultar la lista general de confirmaciones
-- (para proteger la privacidad de los invitados, teléfonos y mensajes).
-- Solo el rol autenticado de administración o service_role puede hacer SELECT general.
DROP POLICY IF EXISTS "Lectura restringida para administradores" ON public.rsvps;
CREATE POLICY "Lectura restringida para administradores"
    ON public.rsvps
    FOR SELECT
    TO authenticated
    USING (true);

-- Regla 3: Permitir a administradores actualizar registros de rsvps
DROP POLICY IF EXISTS "Actualización reservada para administradores" ON public.rsvps;
CREATE POLICY "Actualización reservada para administradores"
    ON public.rsvps
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Regla 4: Permitir a administradores eliminar registros de rsvps si fuese necesario
DROP POLICY IF EXISTS "Eliminación reservada para administradores" ON public.rsvps;
CREATE POLICY "Eliminación reservada para administradores"
    ON public.rsvps
    FOR DELETE
    TO authenticated
    USING (true);

-- Regla 5: Acceso a la tabla de invitados pre-registrados exclusivo para administradores
DROP POLICY IF EXISTS "Acceso a invitados reservado para administradores" ON public.guests;
CREATE POLICY "Acceso a invitados reservado para administradores"
    ON public.guests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. FUNCIÓN SEGURA PARA VERIFICAR CÓDIGO DE INVITACIÓN (Si se utiliza control de pases)
CREATE OR REPLACE FUNCTION public.verify_invitation_code(p_code TEXT)
RETURNS TABLE (
    found BOOLEAN,
    guest_name TEXT,
    max_guests INTEGER,
    status TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        true AS found,
        g.full_name AS guest_name,
        g.max_guests,
        g.status
    FROM public.guests g
    WHERE lower(g.code) = lower(trim(p_code))
    LIMIT 1;
END;
$$;
