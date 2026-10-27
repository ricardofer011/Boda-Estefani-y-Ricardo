import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import { RSVPFormData, RSVPRecord, GuestInvite } from './types';

// Determinar directorio de almacenamiento seguro (en Vercel sólo /tmp es escribible)
function getStorageDirectory(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || (process.env.NODE_ENV === 'production' && !process.cwd().includes('Users'))) {
    return '/tmp';
  }
  return path.join(process.cwd(), 'data');
}

function getRsvpsFilePath(): string {
  return path.join(getStorageDirectory(), 'local_rsvps.json');
}

function getGuestsFilePath(): string {
  return path.join(getStorageDirectory(), 'local_guests.json');
}

// Variables en memoria global para que persistan entre invocaciones de la misma instancia
declare global {
  // eslint-disable-next-line no-var
  var __weddingRsvps: RSVPRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __weddingGuests: GuestInvite[] | undefined;
}

// ============================================================================
// ALMACENAMIENTO DE RSVPs
// ============================================================================
async function ensureLocalDataFile(): Promise<RSVPRecord[]> {
  if (globalThis.__weddingRsvps && globalThis.__weddingRsvps.length > 0) {
    return globalThis.__weddingRsvps;
  }

  const filePath = getRsvpsFilePath();
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    globalThis.__weddingRsvps = parsed;
    return parsed;
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
    globalThis.__weddingRsvps = initialData;
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Almacenando RSVPs en memoria:', e);
    }
    return initialData;
  }
}

async function saveLocalData(records: RSVPRecord[]): Promise<void> {
  globalThis.__weddingRsvps = records;
  const filePath = getRsvpsFilePath();
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Persistencia en disco secundaria:', e);
  }
}

// ============================================================================
// ALMACENAMIENTO DE LISTA DE INVITADOS
// ============================================================================
async function ensureGuestsFile(): Promise<GuestInvite[]> {
  if (globalThis.__weddingGuests && globalThis.__weddingGuests.length > 0) {
    return globalThis.__weddingGuests;
  }

  const filePath = getGuestsFilePath();
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    globalThis.__weddingGuests = parsed;
    return parsed;
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
        group: 'Familia',
        notes: 'Familia cercana',
        gift_type: 'bank',
        invitation_scope: 'church_and_reception',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'guest-2',
        code: 'guillermo-mendoza',
        full_name: 'Guillermo y Laura Mendoza',
        phone: '+1 829 555 0341',
        max_guests: 2,
        status: 'pending',
        group: 'Amigos',
        notes: 'Amigos de la universidad',
        gift_type: 'registry',
        invitation_scope: 'church_and_reception',
        created_at: new Date().toISOString(),
      },
    ];
    globalThis.__weddingGuests = defaultGuests;
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(defaultGuests, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Almacenando invitados en memoria:', e);
    }
    return defaultGuests;
  }
}

async function saveGuestsData(records: GuestInvite[]): Promise<void> {
  globalThis.__weddingGuests = records;
  const filePath = getGuestsFilePath();
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Persistencia en disco secundaria:', e);
  }
}

/**
 * Obtener todos los invitados pre-aprobados
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
      console.error('Error al consultar Supabase guests:', error);
    }
  }

  const records = await ensureGuestsFile();
  return { records, isDemoMode: !isSupabaseConfigured() };
}

/**
 * Buscar un invitado por código o nombre
 */
export async function findGuestByCodeOrName(query: string): Promise<GuestInvite | null> {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: byCode } = await supabase
        .from('guests')
        .select('*')
        .ilike('code', clean)
        .limit(1);

      if (byCode && byCode.length > 0) return byCode[0] as GuestInvite;

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
 * Crear o actualizar un invitado
 */
export async function saveGuestInvite(
  guest: Omit<GuestInvite, 'id' | 'created_at'> & { id?: string }
): Promise<{ record: GuestInvite; isDemoMode: boolean }> {
  const now = new Date().toISOString();
  const cleanCode = (guest.code || guest.full_name.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();
  const isDemo = !isSupabaseConfigured();

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
            group_name: guest.group || null,
            notes: guest.notes || null,
          })
          .eq('id', guest.id)
          .select()
          .single();

        if (!error && data) return { record: data as GuestInvite, isDemoMode: false };
        if (error) console.error('Error actualizando en Supabase:', error);
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
              group_name: guest.group || null,
              notes: guest.notes || null,
            },
          ])
          .select()
          .single();

        if (!error && data) return { record: data as GuestInvite, isDemoMode: false };
        if (error) console.error('Error insertando en Supabase:', error);
      }
    }
  }

  // Almacenamiento local / en memoria
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
        group: guest.group !== undefined ? guest.group : guests[idx].group,
        notes: guest.notes || null,
        gift_type: guest.gift_type || guests[idx].gift_type || 'bank',
        invitation_scope: guest.invitation_scope || guests[idx].invitation_scope || 'church_and_reception',
        invitation_role: guest.invitation_role || guests[idx].invitation_role || 'standard',
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
    group: guest.group || null,
    notes: guest.notes || null,
    gift_type: guest.gift_type || 'bank',
    invitation_scope: guest.invitation_scope || 'church_and_reception',
    invitation_role: guest.invitation_role || 'standard',
    created_at: now,
  };

  guests.unshift(newGuest);
  await saveGuestsData(guests);
  return { record: newGuest, isDemoMode: isDemo };
}

/**
 * Eliminar un invitado
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
// DISPATCH NOTIFICACIÓN EXTERNA
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
    console.warn('Webhook notification error:', err);
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
  return { records, isDemoMode: !isSupabaseConfigured() };
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
