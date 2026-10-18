import { NextResponse } from 'next/server';
import { saveRSVP } from '@/lib/serverStore';
import { RSVPFormData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RSVPFormData;

    // Validación básica de campos obligatorios
    if (!body || !body.guest_name || body.guest_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Por favor, introduce tu nombre y apellido completo.' },
        { status: 400 }
      );
    }

    if (!body.attendance_status || !['attending', 'declined'].includes(body.attendance_status)) {
      return NextResponse.json(
        { success: false, error: 'Por favor, indica si asistirás o no podrás asistir.' },
        { status: 400 }
      );
    }

    if (body.attendance_status === 'attending') {
      const count = Number(body.guest_count);
      if (isNaN(count) || count < 1 || count > 10) {
        return NextResponse.json(
          { success: false, error: 'La cantidad de asistentes debe ser entre 1 y 10.' },
          { status: 400 }
        );
      }
    }

    const { record, isDemoMode } = await saveRSVP(body);

    const message = body.attendance_status === 'attending'
      ? '¡Gracias por responder! Nos alegra compartir este momento tan especial contigo.'
      : 'Gracias por avisarnos con anticipación. Sentiremos tu ausencia y te tendremos muy presente en nuestras oraciones.';

    return NextResponse.json({
      success: true,
      message,
      data: record,
      isDemoMode,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error inesperado al procesar la confirmación.';
    console.error('RSVP API Error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
