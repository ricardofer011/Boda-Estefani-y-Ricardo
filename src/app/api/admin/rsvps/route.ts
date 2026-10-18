import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { getAllRSVPs, updateRSVPStatus } from '@/lib/serverStore';
import { RSVPRecord } from '@/lib/types';

export async function GET() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado.' }, { status: 401 });
  }

  try {
    const { records, isDemoMode } = await getAllRSVPs();
    return NextResponse.json({
      success: true,
      data: records,
      isDemoMode,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al obtener confirmaciones.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado.' }, { status: 401 });
  }

  try {
    const { id, updates } = (await request.json()) as { id: string; updates: Partial<RSVPRecord> };
    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'ID y cambios requeridos.' }, { status: 400 });
    }

    const { isDemoMode } = await updateRSVPStatus(id, updates);
    return NextResponse.json({ success: true, isDemoMode });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al actualizar registro.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
