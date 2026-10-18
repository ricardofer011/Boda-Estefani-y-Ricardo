import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import { RSVPFormData, RSVPRecord } from './types';

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'local_rsvps.json');

async function ensureLocalDataFile(): Promise<RSVPRecord[]> {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(LOCAL_DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Archivo inicial con datos de demostración si está vacío
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
        invitation_code: 'DEMO01',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'demo-2',
        guest_name: 'Guillermo y Laura Mendoza',
        phone: '+1 829 555 0341',
        attendance_status: 'attending',
        guest_count: 2,
        companion_names: ['Laura Mendoza'],
        dietary_restrictions: null,
        message: '¡Estaremos allí con el corazón lleno de gozo para celebrar con Estefani y Ricardo!',
        invitation_code: 'DEMO02',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'demo-3',
        guest_name: 'David Ortiz Peña',
        phone: '+1 809 555 0876',
        attendance_status: 'declined',
        guest_count: 1,
        companion_names: [],
        dietary_restrictions: null,
        message: 'Estaré fuera del país en esa fecha, pero les envío un fuerte abrazo y mis oraciones para su matrimonio.',
        invitation_code: 'DEMO03',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ];
    try {
      const dir = path.dirname(LOCAL_DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error al inicializar archivo local:', e);
    }
    return initialData;
  }
}

async function saveLocalData(records: RSVPRecord[]): Promise<void> {
  const dir = path.dirname(LOCAL_DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * Guarda o actualiza una confirmación de asistencia.
 * Si Supabase está configurado, persiste en PostgreSQL con RLS.
 * Si no, persiste de forma segura en almacenamiento local.
 */
export async function saveRSVP(formData: RSVPFormData): Promise<{ record: RSVPRecord; isDemoMode: boolean }> {
  const now = new Date().toISOString();
  const isDemo = !isSupabaseConfigured();

  // Validaciones
  const cleanName = formData.guest_name.trim();
  if (!cleanName || cleanName.length < 2) {
    throw new Error('El nombre del invitado es obligatorio y debe tener al menos 2 caracteres.');
  }

  const isAttending = formData.attendance_status === 'attending';
  const count = isAttending ? Math.max(1, Math.min(10, formData.guest_count || 1)) : 1;
  const companionNames = isAttending && count > 1 ? formData.companion_names.filter(n => n.trim().length > 0) : [];

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

    return { record: data as RSVPRecord, isDemoMode: false };
  }

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

  return { record: newRecord, isDemoMode: true };
}

/**
 * Obtiene todas las confirmaciones para el panel administrativo.
 */
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

/**
 * Actualiza una confirmación desde el panel administrativo.
 */
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
  const index = records.findIndex(r => r.id === id);
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
