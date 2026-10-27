'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { RSVPRecord, GuestInvite, GiftPreferenceType, InvitationScopeType } from '@/lib/types';
import { WEDDING_CONFIG } from '@/config/wedding';
import {
  Lock,
  Unlock,
  Users,
  UserCheck,
  UserX,
  Utensils,
  Search,
  Download,
  LogOut,
  RefreshCw,
  Clock,
  Heart,
  MessageSquare,
  AlertTriangle,
  Database,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  UserPlus,
  Copy,
  Check,
  Share2,
  Trash2,
  MessageCircle,
  Edit2,
  X,
  Tag,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Pestaña activa: 'guests' (por defecto) o 'rsvps'
  const [activeTab, setActiveTab] = useState<'guests' | 'rsvps'>('guests');

  // Datos de confirmaciones (RSVP)
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'dietary'>('all');
  const [selectedRsvpForDetail, setSelectedRsvpForDetail] = useState<RSVPRecord | null>(null);

  // Datos de invitados y asignación de pases
  const [guests, setGuests] = useState<GuestInvite[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [guestSearchTerm, setGuestSearchTerm] = useState('');
  const [guestGroupFilter, setGuestGroupFilter] = useState<string>('all');

  // Formulario nuevo invitado
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPasses, setNewGuestPasses] = useState(2);
  const [newGuestGroup, setNewGuestGroup] = useState('Familia');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestNotes, setNewGuestNotes] = useState('');
  const [newGuestGiftType, setNewGuestGiftType] = useState<GiftPreferenceType>('bank');
  const [newGuestScope, setNewGuestScope] = useState<InvitationScopeType>('church_and_reception');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [guestFeedback, setGuestFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal para editar invitado existente
  const [editingGuest, setEditingGuest] = useState<GuestInvite | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/login');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchRSVPs();
        fetchGuests();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchRSVPs();
        fetchGuests();
      } else {
        setLoginError(data.error || 'Contraseña incorrecta');
      }
    } catch {
      setLoginError('Error de conexión al autenticar');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
      setRsvps([]);
      setGuests([]);
    }
  };

  const fetchRSVPs = async () => {
    setIsLoadingRsvps(true);
    try {
      const res = await fetch('/api/admin/rsvps');
      const data = await res.json();
      if (res.ok && data.success) {
        setRsvps(data.data || []);
        setIsDemoMode(Boolean(data.isDemoMode));
      }
    } catch (err) {
      console.error('Error cargando confirmaciones:', err);
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const res = await fetch('/api/admin/guests');
      const data = await res.json();
      if (res.ok && data.success) {
        setGuests(data.data || []);
      }
    } catch (err) {
      console.error('Error cargando lista de invitados:', err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setIsAddingGuest(true);
    setGuestFeedback(null);

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newGuestName.trim(),
          max_guests: newGuestPasses,
          group: newGuestGroup.trim() || undefined,
          phone: newGuestPhone.trim() || undefined,
          notes: newGuestNotes.trim() || undefined,
          gift_type: newGuestGiftType,
          invitation_scope: newGuestScope,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGuests((prev) => [data.data, ...prev]);
        setNewGuestName('');
        setNewGuestPasses(2);
        setNewGuestPhone('');
        setNewGuestNotes('');
        setNewGuestGiftType('bank');
        setNewGuestScope('church_and_reception');
        setGuestFeedback(`¡Invitación para ${data.data.full_name} creada con ${data.data.max_guests} pases asignados!`);
        setTimeout(() => setGuestFeedback(null), 5000);
      } else {
        setGuestFeedback(data.error || 'Error al guardar el invitado.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el invitado.';
      setGuestFeedback(msg);
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !editingGuest.full_name.trim()) return;

    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGuest.id,
          full_name: editingGuest.full_name.trim(),
          max_guests: Number(editingGuest.max_guests) || 1,
          group: editingGuest.group || undefined,
          phone: editingGuest.phone || undefined,
          notes: editingGuest.notes || undefined,
          gift_type: editingGuest.gift_type || 'bank',
          invitation_scope: editingGuest.invitation_scope || 'church_and_reception',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGuests((prev) => prev.map((g) => (g.id === editingGuest.id ? data.data : g)));
        setEditingGuest(null);
      }
    } catch (err) {
      console.error('Error actualizando invitado:', err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('¿Deseas eliminar este invitado de la lista?')) return;
    try {
      const res = await fetch(`/api/admin/guests?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error('Error eliminando invitado:', err);
    }
  };

  const toggleAttendanceStatus = async (record: RSVPRecord) => {
    const newStatus = record.attendance_status === 'attending' ? 'declined' : 'attending';
    try {
      const res = await fetch('/api/admin/rsvps', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          updates: { attendance_status: newStatus },
        }),
      });
      if (res.ok) {
        setRsvps((prev) =>
          prev.map((r) => (r.id === record.id ? { ...r, attendance_status: newStatus } : r))
        );
      }
    } catch (e) {
      console.error('Error actualizando estado:', e);
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const totalResponses = rsvps.length;
    const attendingResponses = rsvps.filter((r) => r.attendance_status === 'attending');
    const declinedResponses = rsvps.filter((r) => r.attendance_status === 'declined');

    const totalConfirmedPeople = attendingResponses.reduce(
      (sum, r) => sum + (Number(r.guest_count) || 1),
      0
    );

    const withDietaryRestrictions = attendingResponses.filter(
      (r) => r.dietary_restrictions && r.dietary_restrictions.trim().length > 0
    );

    const totalAssignedPasses = guests.reduce((sum, g) => sum + (Number(g.max_guests) || 1), 0);
    const pendingGuests = guests.filter((g) => g.status === 'pending');

    return {
      totalResponses,
      attendingCount: attendingResponses.length,
      declinedCount: declinedResponses.length,
      totalConfirmedPeople,
      withDietaryCount: withDietaryRestrictions.length,
      totalAssignedPasses,
      totalInvitedGuests: guests.length,
      pendingGuestsCount: pendingGuests.length,
    };
  }, [rsvps, guests]);

  // Grupos únicos disponibles
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.group && g.group.trim()) set.add(g.group.trim());
    });
    return Array.from(set);
  }, [guests]);

  // Filtrado de invitados pre-registrados
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.full_name.toLowerCase().includes(guestSearchTerm.toLowerCase()) ||
        (g.phone && g.phone.includes(guestSearchTerm)) ||
        (g.notes && g.notes.toLowerCase().includes(guestSearchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (guestGroupFilter !== 'all' && g.group !== guestGroupFilter) return false;

      return true;
    });
  }, [guests, guestSearchTerm, guestGroupFilter]);

  // Filtrado de confirmaciones (RSVPs)
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchesSearch =
        r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.phone && r.phone.includes(searchTerm)) ||
        (r.companion_names && r.companion_names.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      if (statusFilter === 'attending') return r.attendance_status === 'attending';
      if (statusFilter === 'declined') return r.attendance_status === 'declined';
      if (statusFilter === 'dietary') {
        return r.attendance_status === 'attending' && r.dietary_restrictions && r.dietary_restrictions.trim();
      }

      return true;
    });
  }, [rsvps, searchTerm, statusFilter]);

  const getPersonalizedUrl = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://boda-estefani-ricardo.vercel.app';
    return `${origin}/?invitacion=${encodeURIComponent(code)}`;
  };

  const handleCopyPersonalizedLink = async (code: string) => {
    const url = getPersonalizedUrl(code);
    await navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const getGuestWhatsAppInviteUrl = (guest: GuestInvite) => {
    const url = getPersonalizedUrl(guest.code);
    const passesText =
      guest.max_guests === 1
        ? '1 pase personal reservado con especial afecto en su honor'
        : `${guest.max_guests} pases reservados con especial afecto en su honor`;

    const scopeText =
      guest.invitation_scope === 'church_only'
        ? `Te invitamos a celebrar nuestra boda religiosa este sábado 12 de diciembre de 2026 a las 11:00 a. m. en la Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo.`
        : `Te invitamos a celebrar nuestra boda religiosa este sábado 12 de diciembre de 2026 a las 11:00 a. m. en la Iglesia Las Mercedes, Ciudad Colonial, y posteriormente acompañarnos al brindis y recepción en el Salón Vista Marina (Av. España 70, Santo Domingo Este).`;

    const text = `¡Hola ${guest.full_name}! 🕊️💌 Nos hace una inmensa ilusión compartir contigo un momento tan significativo en nuestras vidas.\n\n${scopeText}\n\nHemos preparado ${passesText}.\n\n*Nota formal:* La invitación es personal e intransferible, válida exclusivamente para el número de pases asignados.\n\nPuedes ver tu tarjeta personalizada y confirmar tu asistencia aquí:\n${url}`;

    const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const phoneParam = cleanPhone ? `phone=${cleanPhone}&` : '';

    return `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#B89355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA DE ACCESO AUTENTICADO (LOGIN)
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 paper-texture">
        <div className="w-full max-w-md bg-[#FCFAF6] border border-[#DFC088]/50 rounded-2xl p-8 shadow-card-elevated text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F3EDE2] border border-[#DFC088]/40 flex items-center justify-center text-[#B89355] mb-4">
            <Lock className="w-6 h-6 stroke-[1.75]" />
          </div>

          <span className="text-xs uppercase font-serif-luxury tracking-widest text-[#8C6A35] font-semibold">
            Boda Estefani & Ricardo
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A2118] font-normal mt-1 mb-2">
            Panel de Novios
          </h1>
          <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] mb-6">
            Ingresa tu contraseña para asignar los pases y gestionar las confirmaciones de tus invitados.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs text-left">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="admin_password" className="block text-xs font-semibold text-[#2A2118] text-left mb-1.5 font-sans-clean">
                Contraseña de los novios
              </label>
              <input
                id="admin_password"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-4 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B89355] font-sans-clean"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="gold-button w-full py-3 rounded-full font-serif-luxury text-sm tracking-widest uppercase cursor-pointer"
            >
              {isLoggingIn ? 'Verificando...' : 'Entrar al Panel'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#DFC088]/30">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8C6A35] hover:text-[#2A2118] font-sans-clean"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la invitación</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PANEL ADMINISTRATIVO PRIVADO
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#2A2118] pb-16">
      {/* Header */}
      <header className="bg-[#FCFAF6] border-b border-[#DFC088]/30 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-[#6B5B4D] hover:text-[#2A2118] hover:bg-[#F3EDE2] transition-colors"
              title="Volver a la invitación"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif-luxury text-lg sm:text-xl font-medium text-[#2A2118]">
                Panel de Novios — Estefani & Ricardo
              </h1>
              <p className="text-[11px] text-[#8C6A35] font-sans-clean">
                Gestión de Invitados • Sábado 12 de diciembre de 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchRSVPs();
                fetchGuests();
              }}
              disabled={isLoadingRsvps || isLoadingGuests}
              className="p-2 rounded-lg text-[#6B5B4D] hover:text-[#2A2118] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingRsvps || isLoadingGuests ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#B89355]/40 text-[#6B5B4D] hover:text-[#2A2118] hover:border-[#B89355] bg-white transition-colors cursor-pointer font-sans-clean"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Selector de Pestañas */}
      <div className="bg-[#FCFAF6] border-b border-[#DFC088]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('guests')}
            className={`py-3.5 px-3 font-serif-luxury text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'guests'
                ? 'border-[#B89355] text-[#2A2118] font-semibold'
                : 'border-transparent text-[#6B5B4D] hover:text-[#2A2118]'
            }`}
          >
            Control de Pases y Enlaces de Invitados ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3.5 px-3 font-serif-luxury text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'rsvps'
                ? 'border-[#B89355] text-[#2A2118] font-semibold'
                : 'border-transparent text-[#6B5B4D] hover:text-[#2A2118]'
            }`}
          >
            Confirmaciones Recibidas ({rsvps.length})
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de estado de base de datos */}
        {isDemoMode ? (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-3">
            <Database className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold mb-0.5">Almacenamiento Local Seguro Activo</p>
              <p className="text-amber-700 leading-relaxed">
                Tus invitados y confirmaciones se están guardando de forma segura en tu servidor. Al conectar Supabase, se sincronizarán directamente en la nube.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Conectado a la base de datos Supabase con seguridad activa.</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* RESUMEN DE KPIS */}
        {/* ==================================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-[#FCFAF6] border border-[#DFC088]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8C6A35] mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Total Asistirán
              </span>
              <Users className="w-4 h-4" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-[#2A2118]">
              {stats.totalConfirmedPeople}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Personas confirmadas
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Confirmados (Sí)
              </span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-emerald-800">
              {stats.attendingCount}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Invitaciones que dijeron Sí
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Pendientes
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-amber-800">
              {stats.pendingGuestsCount}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Aún no han respondido
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-[#DFC088]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8C6A35] mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Pases Asignados
              </span>
              <Tag className="w-4 h-4" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-[#2A2118]">
              {stats.totalAssignedPasses}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              En {stats.totalInvitedGuests} invitaciones
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-600 mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                No asistirán
              </span>
              <UserX className="w-4 h-4 text-stone-500" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-stone-700">
              {stats.declinedCount}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Declinaron
            </p>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* PESTAÑA 1: GESTIÓN DE INVITADOS Y ASIGNACIÓN DE PASES */}
        {/* ==================================================================== */}
        {activeTab === 'guests' && (
          <section className="space-y-8">
            {/* Formulario para añadir invitado con pases asignados */}
            <div className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-2xl p-6 shadow-xs">
              <h3 className="font-serif-luxury text-xl text-[#2A2118] font-medium mb-1">
                Asignar pases a un nuevo invitado
              </h3>
              <p className="font-sans-clean text-xs text-[#6B5B4D] mb-5">
                Ingresa el nombre de la persona o familia y cuántos pases llevará su invitación. Al guardarlo, se crea su enlace único para que no puedan solicitar más asientos de los autorizados.
              </p>

              {guestFeedback && (
                <div
                  className={`p-3 mb-4 rounded-lg text-xs font-sans-clean flex items-center gap-2 ${
                    guestFeedback.includes('Error') || guestFeedback.includes('No se pudo')
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {guestFeedback.includes('Error') || guestFeedback.includes('No se pudo') ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{guestFeedback}</span>
                </div>
              )}

              <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Nombre o Familia del Invitado <span className="text-[#8C6A35]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Ej. Familia Rodríguez o Dr. Carlos Peña"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Pases asignados <span className="text-[#8C6A35]">*</span>
                  </label>
                  <select
                    value={newGuestPasses}
                    onChange={(e) => setNewGuestPasses(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  >
                    <option value={1}>1 pase (Individual)</option>
                    <option value={2}>2 pases (Pareja)</option>
                    <option value={3}>3 pases</option>
                    <option value={4}>4 pases (Familia)</option>
                    <option value={5}>5 pases</option>
                    <option value={6}>6 pases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Grupo / Mesa
                  </label>
                  <input
                    type="text"
                    value={newGuestGroup}
                    onChange={(e) => setNewGuestGroup(e.target.value)}
                    placeholder="Ej. Familia Novia, Amigos, etc."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Teléfono (opcional para WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="Ej. +1 809 555 1234"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Alcance de la Invitación <span className="text-[#8C6A35]">*</span>
                  </label>
                  <select
                    value={newGuestScope}
                    onChange={(e) => setNewGuestScope(e.target.value as InvitationScopeType)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  >
                    <option value="church_and_reception">⛪ + 🥂 Iglesia y Recepción (Salón Vista Marina)</option>
                    <option value="church_only">⛪ Solo Iglesia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                    Detalle u Obsequio a Mostrar <span className="text-[#8C6A35]">*</span>
                  </label>
                  <select
                    value={newGuestGiftType}
                    onChange={(e) => setNewGuestGiftType(e.target.value as GiftPreferenceType)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                  >
                    <option value="bank">💳 Solo Cuenta APAP (Lluvia de Sobres)</option>
                    <option value="registry">🎁 Solo Lista de Regalos</option>
                    <option value="both">💳🎁 Ambas opciones (Cuenta y Regalos)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2">
                  <input
                    type="text"
                    value={newGuestNotes}
                    onChange={(e) => setNewGuestNotes(e.target.value)}
                    placeholder="Notas internas (ej. Padrinos, mesa 4, requiere transporte...)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/30 bg-white text-xs text-[#6B5B4D] font-sans-clean focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isAddingGuest}
                    className="gold-button w-full py-2.5 rounded-lg font-serif-luxury text-xs tracking-wider uppercase inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Guardar Invitado</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Listado de invitados con buscador y filtros */}
            <div className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
                <h3 className="font-serif-luxury text-xl text-[#2A2118] font-medium">
                  Lista de Invitados y Enlaces Generados
                </h3>

                <div className="flex items-center gap-3">
                  {/* Buscador */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6A35]" />
                    <input
                      type="text"
                      value={guestSearchTerm}
                      onChange={(e) => setGuestSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre o teléfono..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DFC088]/40 bg-white text-xs font-sans-clean focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                    />
                  </div>

                  {/* Filtro por grupo */}
                  {availableGroups.length > 0 && (
                    <select
                      value={guestGroupFilter}
                      onChange={(e) => setGuestGroupFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#DFC088]/40 bg-white text-xs font-sans-clean"
                    >
                      <option value="all">Todos los grupos</option>
                      {availableGroups.map((grp) => (
                        <option key={grp} value={grp}>
                          {grp}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans-clean">
                  <thead>
                    <tr className="border-b border-[#DFC088]/30 text-[#8C6A35] font-serif-luxury text-xs uppercase tracking-wider">
                      <th className="py-3 px-3">Invitado</th>
                      <th className="py-3 px-3">Grupo / Mesa</th>
                      <th className="py-3 px-3 text-center">Pases</th>
                      <th className="py-3 px-3">Alcance & Regalo</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3">Notas</th>
                      <th className="py-3 px-3 text-right">Compartir / Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFC088]/20">
                    {filteredGuests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#6B5B4D] italic">
                          No hay invitados registrados con esos criterios.
                        </td>
                      </tr>
                    ) : (
                      filteredGuests.map((g) => {
                        const isConfirmed = g.status === 'confirmed';
                        const isDeclined = g.status === 'declined';

                        return (
                          <tr key={g.id} className="hover:bg-[#FAF7F2] transition-colors">
                            <td className="py-3.5 px-3 font-medium text-[#2A2118]">
                              {g.full_name}
                              {g.phone && <span className="block text-[11px] text-[#8C6A35]">{g.phone}</span>}
                            </td>

                            <td className="py-3.5 px-3">
                              {g.group ? (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF4E6] border border-[#DFC088]/30 text-[#8C6A35] text-[11px] font-medium">
                                  {g.group}
                                </span>
                              ) : (
                                <span className="text-[#A69584]">—</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-block px-2.5 py-1 rounded-full bg-[#FAF4E6] border border-[#B89355]/40 text-[#8C6A35] font-semibold text-xs">
                                {g.max_guests} {g.max_guests === 1 ? 'pase' : 'pases'}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-col gap-1 items-start">
                                {g.invitation_scope === 'church_only' ? (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-medium">
                                    ⛪ Solo Iglesia
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                                    ⛪ + 🥂 Vista Marina
                                  </span>
                                )}
                                {g.gift_type === 'registry' ? (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-medium">
                                    🎁 Lista Regalos
                                  </span>
                                ) : g.gift_type === 'both' ? (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                                    💳🎁 Cuenta + Regalos
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium">
                                    💳 Cuenta APAP
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              {isConfirmed ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Confirmó ({g.confirmed_count || g.max_guests})</span>
                                </span>
                              ) : isDeclined ? (
                                <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>No asistirá</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Pendiente</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-[#8C6A35] italic text-xs max-w-xs truncate">
                              {g.notes || '—'}
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botón Enviar WhatsApp */}
                                <a
                                  href={getGuestWhatsAppInviteUrl(g)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                  title="Enviar invitación personalizada por WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>

                                {/* Botón Copiar Enlace */}
                                <button
                                  onClick={() => handleCopyPersonalizedLink(g.code)}
                                  className="p-1.5 rounded-lg bg-stone-100 text-[#2A2118] hover:bg-stone-200 transition-colors cursor-pointer"
                                  title="Copiar enlace personalizado"
                                >
                                  {copiedCode === g.code ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Botón Editar */}
                                <button
                                  onClick={() => setEditingGuest(g)}
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                                  title="Editar pases o datos"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                {/* Botón Eliminar */}
                                <button
                                  onClick={() => handleDeleteGuest(g.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Eliminar de la lista"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* PESTAÑA 2: CONFIRMACIONES Y ASISTENCIA (RSVPS) */}
        {/* ==================================================================== */}
        {activeTab === 'rsvps' && (
          <section className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6A35]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por invitado, acompañante o teléfono..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#DFC088]/40 bg-white text-xs sm:text-sm text-[#2A2118] focus:outline-none focus:ring-2 focus:ring-[#B89355] font-sans-clean"
                />
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/admin/export"
                  download
                  className="gold-button px-4 py-2.5 rounded-lg font-serif-luxury text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar a Excel (CSV)</span>
                </a>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DFC088]/20 pb-4 mb-4">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#B89355] text-white font-medium'
                    : 'bg-white text-[#6B5B4D] hover:bg-[#FAF7F2] border border-[#DFC088]/30'
                }`}
              >
                Todos ({rsvps.length})
              </button>
              <button
                onClick={() => setStatusFilter('attending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean cursor-pointer ${
                  statusFilter === 'attending'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                Asistirán ({stats.attendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('declined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean cursor-pointer ${
                  statusFilter === 'declined'
                    ? 'bg-stone-600 text-white font-medium'
                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                No asistirán ({stats.declinedCount})
              </button>
              <button
                onClick={() => setStatusFilter('dietary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean cursor-pointer ${
                  statusFilter === 'dietary'
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                Con restricciones ({stats.withDietaryCount})
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              {filteredRsvps.length === 0 ? (
                <div className="py-12 text-center text-[#6B5B4D] font-sans-clean text-sm">
                  No se encontraron confirmaciones registradas.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans-clean">
                  <thead>
                    <tr className="border-b border-[#DFC088]/30 text-[#8C6A35] font-serif-luxury text-xs uppercase tracking-wider">
                      <th className="py-3 px-3">Invitado Principal</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3 text-center">Total Personas</th>
                      <th className="py-3 px-3">Acompañantes</th>
                      <th className="py-3 px-3">Restricciones</th>
                      <th className="py-3 px-3">Teléfono</th>
                      <th className="py-3 px-3">Fecha</th>
                      <th className="py-3 px-3 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFC088]/20">
                    {filteredRsvps.map((rsvp) => {
                      const isAttending = rsvp.attendance_status === 'attending';
                      const companionList = Array.isArray(rsvp.companion_names) ? rsvp.companion_names : [];

                      return (
                        <tr key={rsvp.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 px-3 font-medium text-[#2A2118]">
                            {rsvp.guest_name}
                            {rsvp.message && (
                              <span className="block text-[11px] text-[#8C6A35] italic truncate max-w-xs mt-0.5">
                                “{rsvp.message}”
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => toggleAttendanceStatus(rsvp)}
                              title="Haz clic para alternar estado"
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-transform hover:scale-105 ${
                                isAttending
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-stone-100 text-stone-700 border border-stone-300'
                              }`}
                            >
                              {isAttending ? (
                                <>
                                  <UserCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Asistirá</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3 text-stone-500" />
                                  <span>No asistirá</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-3 text-center font-semibold text-[#2A2118]">
                            {isAttending ? rsvp.guest_count : 0}
                          </td>

                          <td className="py-3.5 px-3 text-[#6B5B4D] max-w-xs">
                            {isAttending && companionList.length > 0 ? (
                              <span className="truncate block" title={companionList.join(', ')}>
                                {companionList.join(', ')}
                              </span>
                            ) : (
                              <span className="text-[#A69584] italic">Sin acompañantes</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 max-w-xs">
                            {rsvp.dietary_restrictions ? (
                              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 text-xs truncate max-w-[180px]">
                                {rsvp.dietary_restrictions}
                              </span>
                            ) : (
                              <span className="text-[#A69584] italic">—</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-[#6B5B4D]">
                            {rsvp.phone ? (
                              <a
                                href={`https://wa.me/${rsvp.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8C6A35] hover:underline"
                              >
                                {rsvp.phone}
                              </a>
                            ) : (
                              <span className="text-[#A69584]">—</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-[11px] text-[#8C6A35] whitespace-nowrap">
                            {new Date(rsvp.created_at).toLocaleDateString('es-DO', {
                              timeZone: 'America/Santo_Domingo',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedRsvpForDetail(rsvp)}
                              className="text-xs text-[#8C6A35] hover:text-[#2A2118] underline underline-offset-2 cursor-pointer"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modal para Editar Invitado y sus Pases Asignados */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FCFAF6] border border-[#DFC088]/50 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#DFC088]/30 pb-3">
              <h3 className="font-serif-luxury text-xl text-[#2A2118] font-medium">
                Editar Pases de Invitación
              </h3>
              <button
                onClick={() => setEditingGuest(null)}
                className="text-[#6B5B4D] hover:text-[#2A2118] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Nombre del Invitado o Familia
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.full_name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Cantidad de pases asignados
                </label>
                <select
                  value={editingGuest.max_guests}
                  onChange={(e) => setEditingGuest({ ...editingGuest, max_guests: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs sm:text-sm font-sans-clean"
                >
                  <option value={1}>1 pase (Individual)</option>
                  <option value={2}>2 pases (Pareja)</option>
                  <option value={3}>3 pases</option>
                  <option value={4}>4 pases (Familia)</option>
                  <option value={5}>5 pases</option>
                  <option value={6}>6 pases</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Grupo / Mesa
                </label>
                <input
                  type="text"
                  value={editingGuest.group || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, group: e.target.value })}
                  placeholder="Ej. Familia Novia, Amigos, etc."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#DFC088]/50 bg-white text-xs font-sans-clean"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editingGuest.phone || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#DFC088]/50 bg-white text-xs font-sans-clean"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Notas
                </label>
                <input
                  type="text"
                  value={editingGuest.notes || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#DFC088]/30 bg-white text-xs font-sans-clean"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Alcance de la Invitación
                </label>
                <select
                  value={editingGuest.invitation_scope || 'church_and_reception'}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      invitation_scope: e.target.value as InvitationScopeType,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs font-sans-clean"
                >
                  <option value="church_and_reception">⛪ + 🥂 Iglesia y Recepción (Salón Vista Marina)</option>
                  <option value="church_only">⛪ Solo Iglesia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A2118] mb-1 font-sans-clean">
                  Detalle u Obsequio a Mostrar
                </label>
                <select
                  value={editingGuest.gift_type || 'bank'}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      gift_type: e.target.value as GiftPreferenceType,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white text-xs font-sans-clean"
                >
                  <option value="bank">💳 Solo Cuenta APAP (Lluvia de Sobres)</option>
                  <option value="registry">🎁 Solo Lista de Regalos</option>
                  <option value="both">💳🎁 Ambas opciones (Cuenta y Regalos)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-sans-clean text-[#6B5B4D]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="gold-button px-5 py-2 rounded-full font-serif-luxury text-xs tracking-wider uppercase"
                >
                  {isSavingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalle Completo de Respuesta */}
      {selectedRsvpForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FCFAF6] border border-[#DFC088]/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="font-serif-luxury text-2xl text-[#2A2118] font-normal mb-1">
              {selectedRsvpForDetail.guest_name}
            </h3>
            <p className="text-xs text-[#8C6A35] font-sans-clean mb-4">
              Fecha de respuesta:{' '}
              {new Date(selectedRsvpForDetail.created_at).toLocaleString('es-DO', {
                timeZone: 'America/Santo_Domingo',
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm font-sans-clean">
              <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#DFC088]/30 flex justify-between items-center">
                <span className="text-[#6B5B4D]">Estado de asistencia:</span>
                <span
                  className={`font-semibold ${
                    selectedRsvpForDetail.attendance_status === 'attending'
                      ? 'text-emerald-700'
                      : 'text-stone-600'
                  }`}
                >
                  {selectedRsvpForDetail.attendance_status === 'attending'
                    ? `Sí asistirá (${selectedRsvpForDetail.guest_count} personas)`
                    : 'No asistirá'}
                </span>
              </div>

              {selectedRsvpForDetail.attendance_status === 'attending' &&
                selectedRsvpForDetail.companion_names?.length > 0 && (
                  <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#DFC088]/30">
                    <span className="text-[#6B5B4D] block mb-1">Acompañantes registrados:</span>
                    <ul className="list-disc list-inside text-[#2A2118] font-medium space-y-0.5">
                      {selectedRsvpForDetail.companion_names.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedRsvpForDetail.dietary_restrictions && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-amber-800 font-semibold block mb-0.5">
                    Restricciones alimentarias / Alergias:
                  </span>
                  <p className="text-amber-900">{selectedRsvpForDetail.dietary_restrictions}</p>
                </div>
              )}

              {selectedRsvpForDetail.phone && (
                <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#DFC088]/30">
                  <span className="text-[#6B5B4D] block mb-0.5">Teléfono:</span>
                  <p className="text-[#2A2118] font-medium">{selectedRsvpForDetail.phone}</p>
                </div>
              )}

              {selectedRsvpForDetail.message && (
                <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#DFC088]/30">
                  <span className="text-[#6B5B4D] block mb-0.5">Mensaje para Estefani & Ricardo:</span>
                  <p className="text-[#2A2118] italic leading-relaxed">
                    “{selectedRsvpForDetail.message}”
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRsvpForDetail(null)}
                className="gold-button px-6 py-2 rounded-full font-serif-luxury text-xs tracking-wider uppercase cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
