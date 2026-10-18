import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import { RSVPFormData, RSVPRecord, GuestInvite } from './types';

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'local_rsvps.json');
const LOCAL_GUESTS_FILE = path.join(process.cwd(), 'data', 'local_guests.json');

// ============================================================================
// ALMACENAMIENTO LOCAL DE RSVPs
// ============================================================================
async function ensureLocalDataFile(): Promise<RSVPRecord[]> {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(LOCAL_DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    const initialData: RSVPRecord[] = [
      {
        id: 'demo-1',
        guest_name: 'María Alejandra Fernández',
        phone: '+1 809 555 0192',
        attendance_status: 'attending',
        guest_count: 2,
        companion_names: ['Carlos Fernández'],
        dietary_restrictions: 'Vegetariana',
        message: '¡Muchas felicidades a ambos! Qué alegría verlos dar este hermoso paso ante Dios.',
        invitation_code: 'maria-fernandez',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
    try {
      const dir = path.dirname(LOCAL_DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error al inicializar archivo local de RSVPs:', e);
    }
    return initialData;
  }
}

async function saveLocalData(records: RSVPRecord[]): Promise<void> {
  const dir = path.dirname(LOCAL_DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// ============================================================================
// ALMACENAMIENTO DE LISTA DE INVITADOS PRE-APROBADOS Y CONTROL DE PASES
// ============================================================================
async function ensureGuestsFile(): Promise<GuestInvite[]> {
  try {
    const dir = path.dirname(LOCAL_GUESTS_FILE);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(LOCAL_GUESTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    const defaultGuests: GuestInvite[] = [
      {
        id: 'guest-1',
        code: 'maria-fernandez',
        full_name: 'María Alejandra Fernández',
        phone: '+1 809 555 0192',
        max_guests: 2,
        status: 'confirmed',
        confirmed_count: 2,
        notes: 'Familia cercana',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'guest-2',
        code: 'guillermo-mendoza',
        full_name: 'Guillermo y Laura Mendoza',
        phone: '+1 829 555 0341',
        max_guests: 2,
        status: 'pending',
        notes: 'Amigos de la universidad',
        created_at: new Date().toISOString(),
      },
      {
        id: 'guest-3',
        code: 'david-ortiz',
        full_name: 'David Ortiz Peña',
        phone: '+1 809 555 0876',
        max_guests: 1,
        status: 'pending',
        notes: 'Pase individual',
        created_at: new Date().toISOString(),
      },
    ];
    try {
      const dir = path.dirname(LOCAL_GUESTS_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(LOCAL_GUESTS_FILE, JSON.stringify(defaultGuests, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error al inicializar archivo local de invitados:', e);
    }
    return defaultGuests;
  }
}

async function saveGuestsData(records: GuestInvite[]): Promise<void> {
  const dir = path.dirname(LOCAL_GUESTS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LOCAL_GUESTS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * Obtener todos los invitados pre-aprobados (Para el panel privado /admin)
 */
export async function getAllGuests(): Promise<{ records: GuestInvite[]; isDemoMode: boolean }> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { records: data as GuestInvite[], isDemoMode: false };
      }
    }
  }

  const records = await ensureGuestsFile();
  return { records, isDemoMode: true };
}

/**
 * Buscar un invitado por su código de invitación o por coincidencia de nombre
 */
export async function findGuestByCodeOrName(query: string): Promise<GuestInvite | null> {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      // Buscar primero por código exacto
      const { data: byCode } = await supabase
        .from('guests')
        .select('*')
        .ilike('code', clean)
        .limit(1);

      if (byCode && byCode.length > 0) return byCode[0] as GuestInvite;

      // Buscar por nombre
      const { data: byName } = await supabase
        .from('guests')
        .select('*')
        .ilike('full_name', `%${clean}%`)
        .limit(1);

      if (byName && byName.length > 0) return byName[0] as GuestInvite;
    }
  }

  const guests = await ensureGuestsFile();
  return (
    guests.find(
      (g) =>
        g.code.toLowerCase() === clean ||
        g.full_name.toLowerCase().includes(clean)
    ) || null
  );
}

/**
 * Crear o actualizar un invitado desde el panel administrativo
 */
export async function saveGuestInvite(
  guest: Omit<GuestInvite, 'id' | 'created_at'> & { id?: string }
): Promise<{ record: GuestInvite; isDemoMode: boolean }> {
  const now = new Date().toISOString();
  const cleanCode = (guest.code || guest.full_name.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (guest.id) {
        const { data, error } = await supabase
          .from('guests')
          .update({
            code: cleanCode,
            full_name: guest.full_name,
            phone: guest.phone || null,
            max_guests: guest.max_guests,
            status: guest.status || 'pending',
            notes: guest.notes || null,
          })
          .eq('id', guest.id)
          .select()
          .single();

        if (!error && data) return { record: data as GuestInvite, isDemoMode: false };
      } else {
        const { data, error } = await supabase
          .from('guests')
          .insert([
            {
              code: cleanCode,
              full_name: guest.full_name,
              phone: guest.phone || null,
              max_guests: guest.max_guests,
              status: guest.status || 'pending',
              notes: guest.notes || null,
            },
          ])
          .select()
          .single();

        if (!error && data) return { record: data as GuestInvite, isDemoMode: false };
      }
    }
  }

  const guests = await ensureGuestsFile();
  if (guest.id) {
    const idx = guests.findIndex((g) => g.id === guest.id);
    if (idx !== -1) {
      guests[idx] = {
        ...guests[idx],
        code: cleanCode,
        full_name: guest.full_name,
        phone: guest.phone || null,
        max_guests: guest.max_guests,
        status: guest.status || guests[idx].status,
        notes: guest.notes || null,
        updated_at: now,
      };
      await saveGuestsData(guests);
      return { record: guests[idx], isDemoMode: true };
    }
  }

  const newGuest: GuestInvite = {
    id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: cleanCode,
    full_name: guest.full_name,
    phone: guest.phone || null,
    max_guests: guest.max_guests,
    status: guest.status || 'pending',
    notes: guest.notes || null,
    created_at: now,
  };

  guests.unshift(newGuest);
  await saveGuestsData(guests);
  return { record: newGuest, isDemoMode: true };
}

/**
 * Eliminar un invitado desde el panel administrativo
 */
export async function deleteGuestInvite(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('guests').delete().eq('id', id);
      if (!error) return true;
    }
  }

  const guests = await ensureGuestsFile();
  const updated = guests.filter((g) => g.id !== id);
  await saveGuestsData(updated);
  return true;
}

// ============================================================================
// DISPATCH DE NOTIFICACIÓN A PLATAFORMA EXTERNA (Webhook, Google Sheets, etc.)
// ============================================================================
async function sendExternalNotification(rsvp: RSVPRecord) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;

  try {
    const payload = {
      event: 'wedding_rsvp_submitted',
      couple: 'Estefani & Ricardo',
      guest_name: rsvp.guest_name,
      attendance: rsvp.attendance_status === 'attending' ? 'SÍ ASISTIRÁ' : 'NO ASISTIRÁ',
      headcount: rsvp.attendance_status === 'attending' ? rsvp.guest_count : 0,
      companions: rsvp.companion_names?.join(', ') || 'Ninguno',
      dietary: rsvp.dietary_restrictions || 'Ninguna',
      phone: rsvp.phone || 'No indicado',
      message: rsvp.message || '',
      timestamp: rsvp.created_at,
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Webhook notification skipped or failed:', err);
  }
}

// ============================================================================
// GUARDAR RESPUESTA (RSVP)
// ============================================================================
export async function saveRSVP(formData: RSVPFormData): Promise<{ record: RSVPRecord; isDemoMode: boolean }> {
  const now = new Date().toISOString();
  const isDemo = !isSupabaseConfigured();

  const cleanName = formData.guest_name.trim();
  if (!cleanName || cleanName.length < 2) {
    throw new Error('El nombre del invitado es obligatorio y debe tener al menos 2 caracteres.');
  }

  const isAttending = formData.attendance_status === 'attending';
  const count = isAttending ? Math.max(1, Math.min(10, formData.guest_count || 1)) : 1;
  const companionNames = isAttending && count > 1 ? formData.companion_names.filter((n) => n.trim().length > 0) : [];

  let savedRecord: RSVPRecord;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      throw new Error('No se pudo inicializar la conexión con Supabase');
    }

    const payload = {
      guest_name: cleanName,
      phone: formData.phone?.trim() || null,
      attendance_status: formData.attendance_status,
      guest_count: count,
      companion_names: companionNames,
      dietary_restrictions: formData.dietary_restrictions?.trim() || null,
      message: formData.message?.trim() || null,
      invitation_code: formData.invitation_code?.trim() || null,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('rsvps')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error insertando en Supabase:', error);
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    savedRecord = data as RSVPRecord;

    // Actualizar estado en tabla guests si coincide
    if (formData.invitation_code) {
      await supabase
        .from('guests')
        .update({
          status: isAttending ? 'confirmed' : 'declined',
          confirmed_count: isAttending ? count : 0,
        })
        .eq('code', formData.invitation_code.trim());
    }
  } else {
    // Modo local
    const currentRecords = await ensureLocalDataFile();
    const newRecord: RSVPRecord = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      guest_name: cleanName,
      phone: formData.phone?.trim() || null,
      attendance_status: formData.attendance_status,
      guest_count: count,
      companion_names: companionNames,
      dietary_restrictions: formData.dietary_restrictions?.trim() || null,
      message: formData.message?.trim() || null,
      invitation_code: formData.invitation_code?.trim() || null,
      created_at: now,
      updated_at: now,
    };

    currentRecords.unshift(newRecord);
    await saveLocalData(currentRecords);
    savedRecord = newRecord;

    // Actualizar lista local de invitados si coincide código o nombre
    try {
      const guests = await ensureGuestsFile();
      const guestMatch = guests.find(
        (g) =>
          (formData.invitation_code && g.code.toLowerCase() === formData.invitation_code.toLowerCase()) ||
          g.full_name.toLowerCase() === cleanName.toLowerCase()
      );
      if (guestMatch) {
        guestMatch.status = isAttending ? 'confirmed' : 'declined';
        guestMatch.confirmed_count = isAttending ? count : 0;
        await saveGuestsData(guests);
      }
    } catch (e) {
      console.warn('Error actualizando estado local de invitado:', e);
    }
  }

  // Notificar en segundo plano a la plataforma externa (si está configurada)
  sendExternalNotification(savedRecord).catch(() => {});

  return { record: savedRecord, isDemoMode: isDemo };
}

export async function getAllRSVPs(): Promise<{ records: RSVPRecord[]; isDemoMode: boolean }> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { records: data as RSVPRecord[], isDemoMode: false };
      }
      console.error('Error al consultar Supabase:', error);
    }
  }

  const records = await ensureLocalDataFile();
  return { records, isDemoMode: true };
}

export async function updateRSVPStatus(
  id: string,
  updates: Partial<RSVPRecord>
): Promise<{ success: boolean; isDemoMode: boolean }> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('rsvps')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Error actualizando registro: ${error.message}`);
      }
      return { success: true, isDemoMode: false };
    }
  }

  const records = await ensureLocalDataFile();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Registro no encontrado');
  }

  records[index] = {
    ...records[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await saveLocalData(records);
  return { success: true, isDemoMode: true };
}
