import { NextRequest, NextResponse } from 'next/server';
import { getMachineById, updateMachine, deleteMachine } from '@/lib/machines';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const machine = await getMachineById(params.id);
    if (!machine) {
      return NextResponse.json({ success: false, error: 'Máquina no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: machine });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al buscar máquina' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const updated = await updateMachine(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Máquina no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar máquina' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const deleted = await deleteMachine(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Máquina no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Máquina eliminada correctamente' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al eliminar máquina' }, { status: 500 });
  }
}
