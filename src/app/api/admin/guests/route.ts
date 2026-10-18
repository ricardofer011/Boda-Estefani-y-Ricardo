import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { getAllGuests, saveGuestInvite, deleteGuestInvite } from '@/lib/serverStore';
import { GuestInvite } from '@/lib/types';

export async function GET() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
  }

  try {
    const { records, isDemoMode } = await getAllGuests();
    return NextResponse.json({ success: true, data: records, isDemoMode });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al obtener invitados.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Omit<GuestInvite, 'id' | 'created_at'> & { id?: string };

    if (!body.full_name || body.full_name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'El nombre del invitado es requerido.' }, { status: 400 });
    }

    const max = Number(body.max_guests) || 1;
    const { record, isDemoMode } = await saveGuestInvite({
      ...body,
      max_guests: Math.max(1, Math.min(10, max)),
    });

    return NextResponse.json({ success: true, data: record, isDemoMode });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al guardar invitado.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    }

    await deleteGuestInvite(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al eliminar invitado.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
