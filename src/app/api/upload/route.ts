import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Clean filename
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `uploads/${Date.now()}_${cleanBase}${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type || undefined,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ success: false, error: 'Error al subir la imagen' }, { status: 500 });
  }
}
