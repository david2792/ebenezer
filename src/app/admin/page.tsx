'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import {
  Plus, Trash2, Edit3, Upload, Check, AlertCircle, Dumbbell,
  ArrowLeft, LogOut, ShieldCheck, Search, Sparkles, X, Eye,
  RefreshCw, CheckCircle2
} from 'lucide-react';
import { Machine } from '@/lib/types';

const MUSCLE_OPTIONS = [
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Glúteos',
  'Pantorrillas',
  'Funcional',
  'Accesorios',
  'Mancuernas',
  'Barras',
  'Discos'
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);

  // Machines state
  const [machines, setMachines] = useState<Machine[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('Todos');

  // Form State (New or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState('Piernas');
  const [formDescription, setFormDescription] = useState('');
  const [formSpecs, setFormSpecs] = useState<string[]>(['']);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadMachines();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Load machines from API
  const loadMachines = async () => {
    try {
      const res = await fetch('/api/machines');
      const json = await res.json();
      if (json.success) {
        setMachines(json.data);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
      showToast('error', 'Error al cargar máquinas');
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadMachines();
      } else {
        setLoginError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setLoginError('Error de conexión');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal for new machine
  const openNewMachineModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormGroup('Piernas');
    setFormDescription('');
    setFormSpecs(['Acero estructural de alta resistencia', 'Pintura electrostática al horno']);
    setFormImageUrl('/images/gym/gym-1.jpeg');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditMachineModal = (machine: Machine) => {
    setIsEditing(true);
    setEditingId(machine.id);
    setFormName(machine.name);
    setFormGroup(machine.muscleGroup);
    setFormDescription(machine.description || '');
    setFormSpecs(machine.specs && machine.specs.length > 0 ? machine.specs : ['']);
    setFormImageUrl(machine.imageUrl);
    setFormFeatured(Boolean(machine.featured));
    setIsModalOpen(true);
  };

  // Handle image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('Subiendo imagen...');

    try {
      const blob = await upload(`uploads/${Date.now()}_${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload'
      });
      setFormImageUrl(blob.url);
      setUploadMessage('¡Imagen subida correctamente!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setUploadMessage('Error al subir imagen: ' + message);
    } finally {
      setUploading(false);
    }
  };

  // Save Machine (Create or Update)
  const handleSaveMachine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('error', 'El nombre de la máquina es obligatorio');
      return;
    }

    const payload = {
      name: formName.trim(),
      muscleGroup: formGroup,
      description: formDescription.trim(),
      specs: formSpecs.map(s => s.trim()).filter(Boolean),
      imageUrl: formImageUrl || '/images/logo-ebenezer-green.png',
      featured: formFeatured
    };

    try {
      if (isEditing && editingId) {
        // Update
        const res = await fetch(`/api/machines/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', `Máquina "${formName}" actualizada exitosamente`);
          setIsModalOpen(false);
          loadMachines();
        } else {
          showToast('error', data.error || 'Error al actualizar');
        }
      } else {
        // Create
        const res = await fetch('/api/machines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', `Máquina "${formName}" creada exitosamente`);
          setIsModalOpen(false);
          loadMachines();
        } else {
          showToast('error', data.error || 'Error al guardar');
        }
      }
    } catch (err) {
      showToast('error', 'Error en la petición');
    }
  };

  // Delete Machine
  const handleDeleteMachine = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la máquina "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/machines/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Máquina eliminada correctamente');
        loadMachines();
      } else {
        showToast('error', data.error || 'Error al eliminar');
      }
    } catch (err) {
      showToast('error', 'Error de red al eliminar');
    }
  };

  // Toggle Featured Quick Action
  const handleToggleFeatured = async (machine: Machine) => {
    try {
      const res = await fetch(`/api/machines/${machine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !machine.featured })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Estado de carrusel actualizado`);
        loadMachines();
      }
    } catch (err) {
      showToast('error', 'Error al actualizar estado');
    }
  };

  // Specs array helpers
  const handleSpecChange = (index: number, value: string) => {
    const updated = [...formSpecs];
    updated[index] = value;
    setFormSpecs(updated);
  };

  const addSpecField = () => {
    setFormSpecs([...formSpecs, '']);
  };

  const removeSpecField = (index: number) => {
    const updated = formSpecs.filter((_, i) => i !== index);
    setFormSpecs(updated.length > 0 ? updated : ['']);
  };

  // Filtered list
  const filteredMachines = machines.filter(m => {
    const matchesGroup = groupFilter === 'Todos' || m.muscleGroup.toLowerCase() === groupFilter.toLowerCase();
    const q = searchFilter.toLowerCase();
    const matchesSearch = q === '' || m.name.toLowerCase().includes(q) || m.muscleGroup.toLowerCase().includes(q);
    return matchesGroup && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: machines.length,
    featured: machines.filter(m => m.featured).length,
    byGroup: MUSCLE_OPTIONS.reduce((acc, g) => {
      acc[g] = machines.filter(m => m.muscleGroup.toLowerCase() === g.toLowerCase()).length;
      return acc;
    }, {} as Record<string, number>)
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#11141D] border border-[#232B3B] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top accent light */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF66] to-[#10B981]" />

          {/* Logo & Pitbull Icon */}
          <div className="text-center mb-8">
            <div className="relative h-16 w-52 mx-auto mb-4">
              <Image
                src="/images/logo-ebenezer-transparent.png"
                alt="EBENEZER"
                fill
                className="object-contain filter drop-shadow-[0_0_12px_rgba(0,255,102,0.3)]"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel de Administración</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-3">Acceso Restringido</h2>
            <p className="text-gray-400 text-xs mt-1">Ingresa la clave maestra para gestionar máquinas y fotos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña..."
                className="w-full px-4 py-3 rounded-xl bg-[#171B26] border border-[#252E40] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all"
                autoFocus
              />
              <p className="text-[11px] text-gray-500 mt-1">Clave predeterminada: <span className="text-gray-300 font-mono">ebenezer2026</span></p>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/20 transition-all duration-300"
            >
              Entrar al Panel
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Volver a la página principal
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen bg-[#090B0F] text-gray-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-[#0E1B14] border-[#00FF66] text-[#00FF66]' 
            : 'bg-[#220F12] border-red-500 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-[#0E121A] border-b border-[#1E2638] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative h-10 w-40">
              <Image
                src="/images/logo-ebenezer-transparent.png"
                alt="EBENEZER"
                fill
                className="object-contain"
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-800 text-xs font-bold uppercase tracking-wider text-[#00FF66]">
              <ShieldCheck className="w-4 h-4" />
              <span>Panel de Control</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-[#161B26] hover:bg-[#202736] border border-gray-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Ver Web en Vivo</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Action Bar & Stat Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gestor de Equipamiento
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Carga nuevas máquinas con sus fotos, asígnalas a su grupo muscular y selecciónalas para el carrusel principal.
            </p>
          </div>

          <button
            onClick={openNewMachineModal}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 transition-all duration-300 transform hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Cargar Nueva Máquina</span>
          </button>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">Total Máquinas</div>
            <div className="text-2xl font-black text-white font-mono mt-1 text-glow-green">{stats.total}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">En Carrusel</div>
            <div className="text-2xl font-black text-[#00FF66] font-mono mt-1">{stats.featured}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">Piernas</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.byGroup['Piernas'] || 0}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">Pecho</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.byGroup['Pecho'] || 0}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">Espalda</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.byGroup['Espalda'] || 0}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11151F] border border-[#202738]">
            <div className="text-xs text-gray-400 font-semibold uppercase">Hombros / Brazos</div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {(stats.byGroup['Hombros'] || 0) + (stats.byGroup['Brazos'] || 0)}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#10141D] border border-[#1F2738] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar por nombre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151B27] border border-[#242E42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF66]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-gray-400 font-semibold uppercase mr-1">Grupo:</span>
            {['Todos', ...MUSCLE_OPTIONS].map((g) => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  groupFilter === g
                    ? 'bg-[#00FF66] text-black'
                    : 'bg-[#161C27] text-gray-300 hover:text-white border border-gray-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Machines List Table / Cards */}
        <div className="bg-[#10141D] border border-[#1F2738] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#141A26] border-b border-[#20293C] text-xs font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Máquina / Imagen</th>
                  <th className="py-3.5 px-4 sm:px-6">Grupo Muscular</th>
                  <th className="py-3.5 px-4 sm:px-6">Carrusel</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2436]">
                {filteredMachines.length > 0 ? (
                  filteredMachines.map((machine) => (
                    <tr key={machine.id} className="hover:bg-[#141924] transition-colors">
                      {/* Name & Photo */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#0A0D14] border border-gray-800 flex-shrink-0">
                            <Image
                              src={machine.imageUrl}
                              alt={machine.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm sm:text-base leading-snug">
                              {machine.name}
                            </div>
                            <div className="text-xs text-gray-400 line-clamp-1 max-w-sm mt-0.5">
                              {machine.description || 'Sin descripción'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Muscle Group */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#17202E] text-[#00FF66] border border-[#00FF66]/30">
                          <Dumbbell className="w-3 h-3" />
                          {machine.muscleGroup}
                        </span>
                      </td>

                      {/* Featured toggle */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(machine)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            machine.featured
                              ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40'
                              : 'bg-gray-800/40 text-gray-400 hover:text-white border border-gray-700'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{machine.featured ? 'Destacada' : 'No'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditMachineModal(machine)}
                            className="p-2 rounded-xl bg-[#161C27] text-gray-300 hover:text-white hover:bg-[#222B3D] border border-gray-700 transition-colors"
                            title="Editar máquina"
                          >
                            <Edit3 className="w-4 h-4 text-[#00FF66]" />
                          </button>
                          <button
                            onClick={() => handleDeleteMachine(machine.id, machine.name)}
                            className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:text-red-300 hover:bg-red-950/60 border border-red-900/60 transition-colors"
                            title="Eliminar máquina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      No se encontraron máquinas con este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Add or Edit Machine */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#11151F] border border-[#232B3B] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#181E2C] text-gray-400 hover:text-white border border-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#00FF66] uppercase tracking-wider">
                {isEditing ? 'Actualizar Información' : 'Nuevo Registro'}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {isEditing ? 'Editar Máquina' : 'Cargar Nueva Máquina'}
              </h2>
            </div>

            <form onSubmit={handleSaveMachine} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Nombre de la Máquina *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Prensa 45° Pro Heavy Duty"
                  className="w-full px-4 py-3 rounded-xl bg-[#171C28] border border-[#263145] text-white text-sm focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              {/* Muscle Group */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Grupo Muscular *
                </label>
                <select
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#171C28] border border-[#263145] text-white text-sm focus:outline-none focus:border-[#00FF66]"
                >
                  {MUSCLE_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-[#11151F] text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Descripción y Biomecánica
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explica la biomecánica, recorrido, comodidades o ventajas para el usuario..."
                  className="w-full px-4 py-3 rounded-xl bg-[#171C28] border border-[#263145] text-white text-sm focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              {/* Image Upload / Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Foto de la Máquina
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#161B27] border border-[#263044]">
                  {/* Image Preview */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-[#0A0C10] border border-gray-700 flex-shrink-0 flex items-center justify-center">
                    {formImageUrl ? (
                      <Image
                        src={formImageUrl}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <Dumbbell className="w-8 h-8 text-gray-600" />
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-[#00FF66] hover:bg-[#10B981] disabled:opacity-50 transition-colors"
                    >
                      {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{uploading ? 'Subiendo...' : 'Subir Foto desde Dispositivo'}</span>
                    </button>

                    {uploadMessage && (
                      <p className="text-xs text-[#00FF66] font-medium">{uploadMessage}</p>
                    )}

                    <div>
                      <p className="text-[11px] text-gray-400 mt-1">O escribe la URL / ruta de imagen:</p>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="/images/gym/gym-1.jpeg"
                        className="w-full px-3 py-2 mt-1 rounded-lg bg-[#0F131C] border border-[#212A3B] text-xs text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Especificaciones Técnicas (Viñetas)
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-xs text-[#00FF66] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3 h-3" /> Agregar viñeta
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleSpecChange(idx, e.target.value)}
                        placeholder={`Especificación #${idx + 1} (ej. Calibre 11, Pintura al horno...)`}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#171C28] border border-[#263145] text-xs text-white"
                      />
                      {formSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecField(idx)}
                          className="p-2 text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured in Carousel toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#161B27] border border-[#263044]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#00FF66]" />
                  <div>
                    <div className="text-sm font-bold text-white">Destacar en el Carrusel de Inicio</div>
                    <div className="text-xs text-gray-400">Aparecerá en las diapositivas de la página principal.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-5 h-5 accent-[#00FF66] rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-[#171C28] border border-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-[#00FF66] hover:bg-[#10B981] shadow-md shadow-[#00FF66]/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Guardar Cambios' : 'Registrar Máquina'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
