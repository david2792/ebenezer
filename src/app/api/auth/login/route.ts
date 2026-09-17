import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ebenezer2026';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Ingresa la contraseña de administrador' }, { status: 400 });
    }

    if (password === DEFAULT_ADMIN_PASSWORD) {
      // In Next.js we can set an HttpOnly cookie or return an authorized token
      const response = NextResponse.json({ success: true, message: 'Autenticación exitosa' });
      response.cookies.set({
        name: 'ebenezer_admin_session',
        value: 'authenticated_' + Date.now(),
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error de autenticación' }, { status: 500 });
  }
}
