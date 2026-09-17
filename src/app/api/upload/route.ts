import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No hay nada que persistir acá: la URL del blob vuelve directo al cliente.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 400 }
    );
  }
}
