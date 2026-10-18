import { NextRequest, NextResponse } from 'next/server';
import { findGuestByCodeOrName } from '@/lib/serverStore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('code') || searchParams.get('invitacion') || searchParams.get('name');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Código o nombre requerido para consultar los pases.' },
        { status: 400 }
      );
    }

    const guest = await findGuestByCodeOrName(query.trim());

    if (!guest) {
      return NextResponse.json(
        {
          success: false,
          error: 'No encontramos una invitación registrada con ese nombre o código. Por favor comunícate directamente con Estefani y Ricardo.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        code: guest.code,
        full_name: guest.full_name,
        max_guests: guest.max_guests,
        status: guest.status,
      },
    });
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'digest' in err && (err as { digest: string }).digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('Error verificando invitado:', err);
    return NextResponse.json(
      { success: false, error: 'Error al consultar la lista de invitados.' },
      { status: 500 }
    );
  }
}
