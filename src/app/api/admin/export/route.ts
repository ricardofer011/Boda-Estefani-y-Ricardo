import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { isUserAdmin } from '@/lib/auth';
import { getAllGuests, getAllRSVPs } from '@/lib/serverStore';
import { GuestInvite, RSVPRecord } from '@/lib/types';

function autoFitColumns(rows: Record<string, unknown>[]) {
  if (!rows || rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    rows.forEach((r) => {
      const val = r[key];
      if (val !== undefined && val !== null) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    });
    return { wch: Math.min(Math.max(maxLen + 3, 12), 65) };
  });
}

function addSheet(wb: XLSX.WorkBook, sheetName: string, rows: Record<string, unknown>[]) {
  const safeRows = rows.length > 0 ? rows : [{ 'Estado': 'No hay registros en esta sección actualmente.' }];
  const ws = XLSX.utils.json_to_sheet(safeRows);
  if (rows.length > 0 && ws['!ref']) {
    ws['!autofilter'] = { ref: ws['!ref'] };
    ws['!cols'] = autoFitColumns(rows);
  }
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

function formatDateDO(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('es-DO', {
      timeZone: 'America/Santo_Domingo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
  }

  const [{ records: guests }, { records: rsvps }] = await Promise.all([
    getAllGuests(),
    getAllRSVPs(),
  ]);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://boda-estefani-y-ricardo.vercel.app';

  // Mapa para cruzar confirmaciones (RSVP) con lista de invitados
  const rsvpByCode = new Map<string, RSVPRecord>();
  const rsvpByName = new Map<string, RSVPRecord>();
  const matchedRsvpIds = new Set<string>();

  for (const r of rsvps) {
    if (r.invitation_code && r.invitation_code.trim()) {
      rsvpByCode.set(r.invitation_code.trim().toLowerCase(), r);
    }
    if (r.guest_name && r.guest_name.trim()) {
      rsvpByName.set(r.guest_name.trim().toLowerCase(), r);
    }
  }

  // Lista unificada
  interface UnifiedRow {
    index: number;
    fullName: string;
    invitedBy: string;
    role: string;
    scope: string;
    giftType: string;
    group: string;
    attendanceStatus: string;
    maxGuests: number;
    confirmedCount: number;
    companions: string;
    dietary: string;
    phone: string;
    message: string;
    notes: string;
    code: string;
    url: string;
    date: string;
  }

  const masterList: UnifiedRow[] = [];

  // 1. Agregar todos los invitados pre-registrados
  guests.forEach((g) => {
    const rsvp =
      (g.code ? rsvpByCode.get(g.code.trim().toLowerCase()) : undefined) ||
      (g.full_name ? rsvpByName.get(g.full_name.trim().toLowerCase()) : undefined);

    if (rsvp) {
      matchedRsvpIds.add(rsvp.id);
    }

    const isAttending = rsvp ? rsvp.attendance_status === 'attending' : g.status === 'confirmed';
    const isDeclined = rsvp ? rsvp.attendance_status === 'declined' : g.status === 'declined';

    const statusLabel = isAttending
      ? 'Confirmado (Asistirá)'
      : isDeclined
      ? 'Declinado (No asistirá)'
      : 'Pendiente';

    const confirmedCount = isAttending
      ? rsvp
        ? Number(rsvp.guest_count) || 1
        : Number(g.confirmed_count) || Number(g.max_guests) || 1
      : 0;

    const invitedByLabel =
      g.invited_by === 'ricardo'
        ? 'De Ricardo'
        : g.invited_by === 'both'
        ? 'De Ambos'
        : 'De Estefani';

    const roleLabel = g.invitation_role === 'bridesmaid' ? 'Dama de Honor' : 'General';
    const scopeLabel = g.invitation_scope === 'church_only' ? 'Solo Iglesia' : 'Iglesia y Recepción';

    const giftTypeLabel =
      g.gift_type === 'registry'
        ? 'Solo Lista de Regalos'
        : g.gift_type === 'both'
        ? 'Cuenta + Regalos'
        : 'Solo Cuenta APAP';

    const roleParam = g.invitation_role === 'bridesmaid' ? '&rol=dama' : '';
    const scopeParam = g.invitation_scope === 'church_only' ? '&alcance=iglesia' : '';
    const giftParam = g.gift_type === 'bank' ? '&regalo=cuenta' : g.gift_type === 'registry' ? '&regalo=lista' : '';
    const personalUrl = `${origin}/?invitacion=${encodeURIComponent(g.code || '')}${roleParam}${scopeParam}${giftParam}`;

    masterList.push({
      index: masterList.length + 1,
      fullName: g.full_name,
      invitedBy: invitedByLabel,
      role: roleLabel,
      scope: scopeLabel,
      giftType: giftTypeLabel,
      group: g.group || 'General',
      attendanceStatus: statusLabel,
      maxGuests: Number(g.max_guests) || 1,
      confirmedCount,
      companions: Array.isArray(rsvp?.companion_names) ? rsvp.companion_names.filter(Boolean).join(', ') : '',
      dietary: rsvp?.dietary_restrictions?.trim() ? rsvp.dietary_restrictions.trim() : 'Ninguna',
      phone: g.phone?.trim() || rsvp?.phone?.trim() || '',
      message: rsvp?.message?.trim() || '',
      notes: g.notes?.trim() || '',
      code: g.code || '',
      url: personalUrl,
      date: formatDateDO(rsvp?.created_at || g.created_at),
    });
  });

  // 2. Agregar confirmaciones directas que no hayan sido vinculadas a un código existente
  rsvps.forEach((r) => {
    if (!matchedRsvpIds.has(r.id)) {
      const isAttending = r.attendance_status === 'attending';
      const statusLabel = isAttending ? 'Confirmado (Asistirá)' : 'Declinado (No asistirá)';
      const confirmedCount = isAttending ? Math.max(1, Number(r.guest_count) || 1) : 0;

      masterList.push({
        index: masterList.length + 1,
        fullName: r.guest_name,
        invitedBy: 'De Ambos',
        role: 'General',
        scope: 'Iglesia y Recepción',
        giftType: 'Cuenta + Regalos',
        group: 'Confirmación Directa',
        attendanceStatus: statusLabel,
        maxGuests: confirmedCount || 1,
        confirmedCount,
        companions: Array.isArray(r.companion_names) ? r.companion_names.filter(Boolean).join(', ') : '',
        dietary: r.dietary_restrictions?.trim() ? r.dietary_restrictions.trim() : 'Ninguna',
        phone: r.phone?.trim() || '',
        message: r.message?.trim() || '',
        notes: 'Confirmación directa RSVP',
        code: r.invitation_code || '',
        url: r.invitation_code ? `${origin}/?invitacion=${encodeURIComponent(r.invitation_code)}` : `${origin}/`,
        date: formatDateDO(r.created_at),
      });
    }
  });

  // Ordenar lista maestra alfabéticamente (A-Z) para un listado completamente predecible y ordenado
  masterList.sort((a, b) => a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' }));

  // Mapear filas para formato de tabla maestra
  const formatMasterRow = (item: UnifiedRow, i: number) => ({
    'No.': i + 1,
    'Invitado / Familia': item.fullName,
    'Invitado Por': item.invitedBy,
    'Tipo Invitación': item.role,
    'Alcance': item.scope,
    'Tipo de Regalo': item.giftType,
    'Grupo / Mesa': item.group,
    'Estado Asistencia': item.attendanceStatus,
    'Pases Asignados': item.maxGuests,
    'Personas Confirmadas': item.confirmedCount,
    'Acompañantes': item.companions || '—',
    'Restricciones Alimentarias': item.dietary,
    'Teléfono / WhatsApp': item.phone || '—',
    'Mensaje para los Novios': item.message || '—',
    'Notas Internas': item.notes || '—',
    'Código': item.code || '—',
    'Enlace Personalizado': item.url,
    'Fecha Registro / Respuesta': item.date || '—',
  });

  const masterSheetData = masterList.map(formatMasterRow);

  // Hoja 2: Confirmados
  const confirmedList = masterList.filter((m) => m.attendanceStatus.startsWith('Confirmado'));
  const confirmedSheetData = confirmedList.map((item, i) => ({
    'No.': i + 1,
    'Invitado Principal': item.fullName,
    'Invitado Por': item.invitedBy,
    'Total Asistentes': item.confirmedCount,
    'Acompañantes': item.companions || '—',
    'Restricciones Alimentarias': item.dietary,
    'Grupo / Mesa': item.group,
    'Alcance': item.scope,
    'Tipo Invitación': item.role,
    'Tipo de Regalo': item.giftType,
    'Teléfono': item.phone || '—',
    'Mensaje para los Novios': item.message || '—',
    'Fecha Confirmación': item.date || '—',
  }));

  // Hoja 3: Pendientes
  const pendingList = masterList.filter((m) => m.attendanceStatus.startsWith('Pendiente'));
  const pendingSheetData = pendingList.map((item, i) => ({
    'No.': i + 1,
    'Invitado / Familia': item.fullName,
    'Invitado Por': item.invitedBy,
    'Pases Reservados': item.maxGuests,
    'Tipo Invitación': item.role,
    'Alcance': item.scope,
    'Tipo de Regalo': item.giftType,
    'Grupo / Mesa': item.group,
    'Teléfono / WhatsApp': item.phone || '—',
    'Enlace Invitación (Copiar y Enviar)': item.url,
    'Notas': item.notes || '—',
  }));

  // Hoja 4: Declinados (No asistirán)
  const declinedList = masterList.filter((m) => m.attendanceStatus.startsWith('Declinado'));
  const declinedSheetData = declinedList.map((item, i) => ({
    'No.': i + 1,
    'Invitado / Familia': item.fullName,
    'Invitado Por': item.invitedBy,
    'Pases que Tenía': item.maxGuests,
    'Tipo Invitación': item.role,
    'Alcance': item.scope,
    'Teléfono': item.phone || '—',
    'Mensaje': item.message || '—',
    'Notas': item.notes || '—',
    'Fecha Respuesta': item.date || '—',
  }));

  // Hoja 5: Damas de Honor
  const bridesmaidsList = masterList.filter((m) => m.role.includes('Dama'));
  const bridesmaidsSheetData = bridesmaidsList.map((item, i) => ({
    'No.': i + 1,
    'Nombre Dama de Honor': item.fullName,
    'Estado Asistencia': item.attendanceStatus,
    'Pases Asignados': item.maxGuests,
    'Teléfono': item.phone || '—',
    'Mensaje a Estefani': item.message || '—',
    'Enlace Exclusivo Damas': item.url,
    'Fecha Respuesta': item.date || '—',
  }));

  // Hoja 6: Solo Iglesia
  const churchOnlyList = masterList.filter((m) => m.scope.includes('Solo Iglesia'));
  const churchOnlySheetData = churchOnlyList.map((item, i) => ({
    'No.': i + 1,
    'Invitado / Familia': item.fullName,
    'Invitado Por': item.invitedBy,
    'Estado Asistencia': item.attendanceStatus,
    'Pases Asignados': item.maxGuests,
    'Personas Confirmadas': item.confirmedCount,
    'Teléfono': item.phone || '—',
    'Notas': item.notes || '—',
    'Enlace Invitación': item.url,
  }));

  // Hoja 7: Banquete y Alergias (Confirmados con catering o restricciones)
  const banquetSheetData = confirmedList.map((item, i) => ({
    'No.': i + 1,
    'Invitado Principal': item.fullName,
    'Personas Confirmadas': item.confirmedCount,
    'Acompañantes': item.companions || '—',
    'Restricciones Alimentarias / Alergias': item.dietary,
    'Grupo / Mesa': item.group,
    'Alcance': item.scope,
    'Notas': item.notes || '—',
  }));

  // Hoja 7: Resumen Ejecutivo y Totales
  const totalInvites = masterList.length;
  const totalPasses = masterList.reduce((sum, r) => sum + r.maxGuests, 0);
  const totalConfirmedPeople = confirmedList.reduce((sum, r) => sum + r.confirmedCount, 0);
  const totalConfirmedInvites = confirmedList.length;
  const totalPendingInvites = pendingList.length;
  const totalDeclinedInvites = masterList.filter((m) => m.attendanceStatus.startsWith('Declinado')).length;

  const estefaniInvites = masterList.filter((m) => m.invitedBy.includes('Estefani'));
  const ricardoInvites = masterList.filter((m) => m.invitedBy.includes('Ricardo'));
  const bothInvites = masterList.filter((m) => m.invitedBy.includes('Ambos'));

  const bankGifts = masterList.filter((m) => m.giftType.includes('Solo Cuenta'));
  const registryGifts = masterList.filter((m) => m.giftType.includes('Solo Lista'));
  const bothGifts = masterList.filter((m) => m.giftType.includes('Cuenta + Regalos'));

  const withDietaryCount = masterList.filter((m) => m.dietary !== 'Ninguna').length;

  const summarySheetData = [
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Total de Invitaciones Creadas', 'Cantidad': totalInvites },
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Total de Pases Asignados', 'Cantidad': totalPasses },
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Personas Confirmadas (Asistirán)', 'Cantidad': totalConfirmedPeople },
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Invitaciones Confirmadas (Sí)', 'Cantidad': totalConfirmedInvites },
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Invitaciones Pendientes por Confirmar', 'Cantidad': totalPendingInvites },
    { 'Categoría': 'Métricas Generales', 'Indicador / Filtro': 'Invitaciones Declinadas (No asistirán)', 'Cantidad': totalDeclinedInvites },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Estefani (Invitaciones)', 'Cantidad': estefaniInvites.length },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Estefani (Pases asignados)', 'Cantidad': estefaniInvites.reduce((s, r) => s + r.maxGuests, 0) },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Estefani (Personas confirmadas)', 'Cantidad': estefaniInvites.reduce((s, r) => s + r.confirmedCount, 0) },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Ricardo (Invitaciones)', 'Cantidad': ricardoInvites.length },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Ricardo (Pases asignados)', 'Cantidad': ricardoInvites.reduce((s, r) => s + r.maxGuests, 0) },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Ricardo (Personas confirmadas)', 'Cantidad': ricardoInvites.reduce((s, r) => s + r.confirmedCount, 0) },
    { 'Categoría': 'Desglose por Quien Invita', 'Indicador / Filtro': 'De Ambos (Invitaciones)', 'Cantidad': bothInvites.length },
    { 'Categoría': 'Desglose por Tipo de Regalo', 'Indicador / Filtro': 'Solo Cuenta APAP (Lluvia de Sobres)', 'Cantidad': bankGifts.length },
    { 'Categoría': 'Desglose por Tipo de Regalo', 'Indicador / Filtro': 'Solo Lista de Regalos (Casa Cuesta)', 'Cantidad': registryGifts.length },
    { 'Categoría': 'Desglose por Tipo de Regalo', 'Indicador / Filtro': 'Ambas Opciones (Cuenta + Regalos)', 'Cantidad': bothGifts.length },
    { 'Categoría': 'Desglose por Alcance', 'Indicador / Filtro': 'Ceremonia & Recepción (Completa)', 'Cantidad': masterList.filter((m) => m.scope.includes('Recepción')).length },
    { 'Categoría': 'Desglose por Alcance', 'Indicador / Filtro': 'Solo Iglesia (Ceremonia Religiosa)', 'Cantidad': churchOnlyList.length },
    { 'Categoría': 'Desglose por Tipo de Invitación', 'Indicador / Filtro': 'Damas de Honor', 'Cantidad': bridesmaidsList.length },
    { 'Categoría': 'Desglose por Tipo de Invitación', 'Indicador / Filtro': 'Invitaciones Generales', 'Cantidad': masterList.filter((m) => m.role.includes('General')).length },
    { 'Categoría': 'Banquete / Catering', 'Indicador / Filtro': 'Personas con Restricciones Alimentarias', 'Cantidad': withDietaryCount },
  ];

  // Si se pide formato CSV explícito
  const urlParams = request.nextUrl.searchParams;
  const isCsv = urlParams.get('format') === 'csv';

  const dateTag = new Date().toISOString().slice(0, 10);

  if (isCsv) {
    const ws = XLSX.utils.json_to_sheet(masterSheetData);
    const csvContent = '\uFEFF' + XLSX.utils.sheet_to_csv(ws);
    const filename = `boda_estefani_ricardo_invitados_${dateTag}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  // Generar libro de trabajo Excel nativo (.xlsx) con 8 pestañas organizadas
  const wb = XLSX.utils.book_new();
  addSheet(wb, 'Lista Maestra', masterSheetData);
  addSheet(wb, 'Confirmados', confirmedSheetData);
  addSheet(wb, 'Pendientes', pendingSheetData);
  addSheet(wb, 'Declinados', declinedSheetData);
  addSheet(wb, 'Damas de Honor', bridesmaidsSheetData);
  addSheet(wb, 'Solo Iglesia', churchOnlySheetData);
  addSheet(wb, 'Banquete y Alergias', banquetSheetData);
  addSheet(wb, 'Resumen de Boda', summarySheetData);

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = `boda_estefani_ricardo_invitados_${dateTag}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
