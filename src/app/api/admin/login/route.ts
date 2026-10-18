import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken, SESSION_COOKIE_NAME, isUserAdmin } from '@/lib/auth';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'EstefaniRicardo2026';

export async function GET() {
  const isAdmin = await isUserAdmin();
  return NextResponse.json({ authenticated: isAdmin });
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa la contraseña de administración.' },
        { status: 400 }
      );
    }

    if (password.trim() !== ADMIN_SECRET.trim()) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta.' },
        { status: 401 }
      );
    }

    // Crear token con timestamp
    const token = signToken(`admin-${Date.now()}`);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return NextResponse.json({ success: true, message: 'Acceso autorizado al panel de novios.' });
  } catch (err) {
    console.error('Error en login admin:', err);
    return NextResponse.json(
      { success: false, error: 'Error del servidor al procesar inicio de sesión.' },
      { status: 500 }
    );
  }
}
