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

    const cleanQuery = query.trim().toLowerCase();

    // Llave maestra para los novios / organizadores
    if (
      cleanQuery === 'novios' ||
      cleanQuery === 'vip' ||
      cleanQuery === 'estefaniricardo2026'
    ) {
      return NextResponse.json({
        success: true,
        data: {
          code: 'novios',
          full_name: 'Estefani Cedeño & Ricardo Fernandez',
          max_guests: 2,
          status: 'confirmed',
          gift_type: 'both',
          invitation_scope: 'church_and_reception',
          invitation_role: 'standard',
        },
      });
    }

    // Llave maestra para Damas de Honor
    if (
      cleanQuery === 'dama' ||
      cleanQuery === 'damas' ||
      cleanQuery === 'damadehonor' ||
      cleanQuery === 'damasdehonor'
    ) {
      return NextResponse.json({
        success: true,
        data: {
          code: 'damas',
          full_name: 'Queridas Damas de Honor',
          max_guests: 1,
          status: 'pending',
          gift_type: 'bank',
          invitation_scope: 'church_and_reception',
          invitation_role: 'bridesmaid',
        },
      });
    }

    const guest = await findGuestByCodeOrName(query.trim());

    if (!guest) {
      return NextResponse.json(
        {
          success: false,
          error:
            'No encontramos una invitación registrada con ese nombre o código. Por favor comunícate directamente con Estefani y Ricardo.',
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
        gift_type: guest.gift_type || 'bank',
        invitation_scope: guest.invitation_scope || 'church_and_reception',
        invitation_role: guest.invitation_role || 'standard',
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
