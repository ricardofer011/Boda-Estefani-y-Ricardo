import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { getAllRSVPs } from '@/lib/serverStore';

function escapeCSV(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
  }

  const { records } = await getAllRSVPs();

  const headers = [
    'ID',
    'Fecha Registro',
    'Invitado Principal',
    'Estado Asistencia',
    'Total Personas',
    'Acompañantes',
    'Teléfono',
    'Restricciones Alimentarias',
    'Mensaje para los Novios',
    'Código Invitación',
  ];

  const rows = records.map((r) => {
    const formattedDate = new Date(r.created_at).toLocaleString('es-DO', {
      timeZone: 'America/Santo_Domingo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const statusText = r.attendance_status === 'attending' ? 'Confirmado (Asistirá)' : 'Declinado (No asistirá)';
    const companionsText = Array.isArray(r.companion_names) ? r.companion_names.join('; ') : '';

    return [
      escapeCSV(r.id),
      escapeCSV(formattedDate),
      escapeCSV(r.guest_name),
      escapeCSV(statusText),
      escapeCSV(r.guest_count),
      escapeCSV(companionsText),
      escapeCSV(r.phone || ''),
      escapeCSV(r.dietary_restrictions || 'Ninguna'),
      escapeCSV(r.message || ''),
      escapeCSV(r.invitation_code || ''),
    ].join(',');
  });

  // UTF-8 BOM para que Excel en español reconozca tildes y caracteres especiales
  const bom = '\uFEFF';
  const csvContent = bom + [headers.join(','), ...rows].join('\r\n');

  const filename = `confirmaciones_boda_estefani_ricardo_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
