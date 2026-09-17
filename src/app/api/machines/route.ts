import { NextRequest, NextResponse } from 'next/server';
import { getMachines, addMachine } from '@/lib/machines';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get('muscleGroup');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let machines = await getMachines();

    if (muscleGroup && muscleGroup !== 'Todos') {
      machines = machines.filter(
        m => m.muscleGroup.toLowerCase() === muscleGroup.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      machines = machines.filter(
        m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }

    if (featured === 'true') {
      machines = machines.filter(m => m.featured);
    }

    return NextResponse.json({ success: true, count: machines.length, data: machines });
  } catch (error) {
    console.error('API machines GET error:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener máquinas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, muscleGroup, description, specs, imageUrl, featured, price } = body;

    if (!name || !muscleGroup) {
      return NextResponse.json(
        { success: false, error: 'El nombre y el grupo muscular son obligatorios' },
        { status: 400 }
      );
    }

    const newMachine = await addMachine({
      name: name.trim(),
      muscleGroup: muscleGroup.trim(),
      description: description ? description.trim() : '',
      specs: Array.isArray(specs) ? specs.filter((s: string) => s && s.trim()) : [],
      imageUrl: imageUrl || '/images/logo-ebenezer-green.png',
      featured: Boolean(featured),
      price: price ? price.trim() : undefined
    });

    return NextResponse.json({ success: true, data: newMachine }, { status: 201 });
  } catch (error) {
    console.error('API machines POST error:', error);
    return NextResponse.json({ success: false, error: 'Error al crear la máquina' }, { status: 500 });
  }
}
