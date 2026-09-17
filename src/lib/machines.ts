import fs from 'fs';
import path from 'path';
import { list, put, del } from '@vercel/blob';
import { Machine } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'machines.json');
const BLOB_PREFIX = 'data/machines-';

function readSeedFile(): Machine[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content) as Machine[];
  } catch (error) {
    console.error('Error reading seed machines file:', error);
    return [];
  }
}

async function getLatestBlob() {
  const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
  if (blobs.length === 0) return null;
  return blobs.reduce((latest, b) =>
    new Date(b.uploadedAt) > new Date(latest.uploadedAt) ? b : latest
  );
}

export async function getMachines(): Promise<Machine[]> {
  try {
    const latest = await getLatestBlob();
    if (!latest) {
      // No hay datos guardados todavía en Blob: usamos el catálogo semilla del repo.
      return readSeedFile();
    }
    // Cada guardado crea un blob nuevo con URL única, así que esta lectura
    // nunca pega contra una respuesta cacheada de una versión anterior.
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) {
      return readSeedFile();
    }
    return (await res.json()) as Machine[];
  } catch (error) {
    console.error('Error reading machines from Blob:', error);
    return readSeedFile();
  }
}

export async function saveMachines(machines: Machine[]): Promise<boolean> {
  try {
    const { blobs: previous } = await list({ prefix: BLOB_PREFIX, limit: 1000 });

    await put(`${BLOB_PREFIX}${Date.now()}.json`, JSON.stringify(machines, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    // Limpiamos versiones anteriores para no acumular blobs sin uso.
    await Promise.allSettled(previous.map(b => del(b.url)));

    return true;
  } catch (error) {
    console.error('Error saving machines to Blob:', error);
    return false;
  }
}

export async function getMachineById(id: string): Promise<Machine | undefined> {
  const machines = await getMachines();
  return machines.find(m => m.id === id);
}

export async function addMachine(machine: Omit<Machine, 'id' | 'createdAt'>): Promise<Machine> {
  const machines = await getMachines();
  const newMachine: Machine = {
    ...machine,
    id: 'ebz-' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };
  machines.unshift(newMachine);
  await saveMachines(machines);
  return newMachine;
}

export async function updateMachine(id: string, updates: Partial<Machine>): Promise<Machine | null> {
  const machines = await getMachines();
  const index = machines.findIndex(m => m.id === id);
  if (index === -1) return null;

  machines[index] = {
    ...machines[index],
    ...updates,
    id
  };
  await saveMachines(machines);
  return machines[index];
}

export async function deleteMachine(id: string): Promise<boolean> {
  const machines = await getMachines();
  const filtered = machines.filter(m => m.id !== id);
  if (filtered.length === machines.length) return false;
  return saveMachines(filtered);
}
