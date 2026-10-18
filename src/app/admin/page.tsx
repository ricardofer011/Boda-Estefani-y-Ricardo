'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { RSVPRecord } from '@/lib/types';
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
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'dietary'>('all');
  const [selectedRsvpForDetail, setSelectedRsvpForDetail] = useState<RSVPRecord | null>(null);

  // Verificar estado de sesión al cargar
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
    }
  };

  const fetchRSVPs = async () => {
    setIsLoadingData(true);
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
      setIsLoadingData(false);
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

  // Cálculo de estadísticas y KPIs
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

    return {
      totalResponses,
      attendingCount: attendingResponses.length,
      declinedCount: declinedResponses.length,
      totalConfirmedPeople,
      withDietaryCount: withDietaryRestrictions.length,
    };
  }, [rsvps]);

  // Filtrado y búsqueda
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

  // Pantalla de carga inicial mientras se comprueba la cookie de sesión
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
            Panel de Administración
          </h1>
          <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] mb-6">
            Acceso exclusivo y privado para los novios para gestionar las confirmaciones de asistencia.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs text-left">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="admin_password" className="block text-xs font-semibold text-[#2A2118] text-left mb-1.5 font-sans-clean">
                Contraseña de acceso
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
              <span>Volver a la invitación pública</span>
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
      {/* Barra de cabecera del panel */}
      <header className="bg-[#FCFAF6] border-b border-[#DFC088]/30 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-[#6B5B4D] hover:text-[#2A2118] hover:bg-[#F3EDE2] transition-colors"
              title="Ver invitación pública"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif-luxury text-lg sm:text-xl font-medium text-[#2A2118]">
                Panel de Novios — Estefani & Ricardo
              </h1>
              <p className="text-[11px] text-[#8C6A35] font-sans-clean">
                Ceremonia: 12 de diciembre de 2026 • Iglesia Las Mercedes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRSVPs}
              disabled={isLoadingData}
              className="p-2 rounded-lg text-[#6B5B4D] hover:text-[#2A2118] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              title="Refrescar lista"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
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

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de estado de la base de datos */}
        {isDemoMode ? (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-3">
            <Database className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold mb-0.5">Modo de Demostración y Almacenamiento Local Activo</p>
              <p className="text-amber-700 leading-relaxed">
                Las respuestas se están guardando localmente en el servidor. Para conectar tu base de datos Supabase en la nube con Row Level Security, añade tus credenciales en el archivo <code>.env.local</code>.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Conectado a la base de datos Supabase en la nube con Row Level Security (RLS) activo.</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* RESUMEN DE CONFIRMACIONES (KPIS) */}
        {/* ==================================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {/* Total personas confirmadas */}
          <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-[#FCFAF6] border border-[#DFC088]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8C6A35] mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Total Personas
              </span>
              <Users className="w-4 h-4" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-[#2A2118]">
              {stats.totalConfirmedPeople}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Asistentes + acompañantes
            </p>
          </div>

          {/* Invitaciones que asistirán */}
          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Asistirán
              </span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-emerald-800">
              {stats.attendingCount}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Respuestas confirmadas (Sí)
            </p>
          </div>

          {/* Invitaciones que no asistirán */}
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
              Respuestas declinadas (No)
            </p>
          </div>

          {/* Total respuestas recibidas */}
          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-[#DFC088]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8C6A35] mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Respuestas
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-[#2A2118]">
              {stats.totalResponses}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Total formularios recibidos
            </p>
          </div>

          {/* Restricciones alimentarias reportadas */}
          <div className="p-4 rounded-xl bg-[#FCFAF6] border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs uppercase font-sans-clean font-semibold tracking-wider">
                Restricciones
              </span>
              <Utensils className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif-luxury text-3xl font-semibold text-amber-800">
              {stats.withDietaryCount}
            </div>
            <p className="text-[11px] text-[#6B5B4D] mt-1 font-sans-clean">
              Alergias o menús especiales
            </p>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* HERRAMIENTAS: BÚSQUEDA, FILTROS Y EXPORTAR A CSV */}
        {/* ==================================================================== */}
        <section className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Buscador */}
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

            {/* Botón de exportación a CSV */}
            <div className="flex items-center gap-2">
              <a
                href="/api/admin/export"
                download
                className="gold-button px-4 py-2.5 rounded-lg font-serif-luxury text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Exportar a CSV</span>
              </a>
            </div>
          </div>

          {/* Filtros por pestaña */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#DFC088]/20 pb-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#B89355] text-white font-medium'
                  : 'bg-white text-[#6B5B4D] hover:bg-[#FAF7F2] border border-[#DFC088]/30'
              }`}
            >
              Todos ({rsvps.length})
            </button>
            <button
              onClick={() => setStatusFilter('attending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer ${
                statusFilter === 'attending'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              Asistirán ({stats.attendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('declined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer ${
                statusFilter === 'declined'
                  ? 'bg-stone-600 text-white font-medium'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              No asistirán ({stats.declinedCount})
            </button>
            <button
              onClick={() => setStatusFilter('dietary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer ${
                statusFilter === 'dietary'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              Con restricciones ({stats.withDietaryCount})
            </button>
          </div>

          {/* ================================================================== */}
          {/* TABLA DE GESTIÓN DE INVITADOS */}
          {/* ================================================================== */}
          <div className="mt-4 overflow-x-auto">
            {filteredRsvps.length === 0 ? (
              <div className="py-12 text-center text-[#6B5B4D] font-sans-clean text-sm">
                No se encontraron respuestas con los criterios seleccionados.
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
                    <th className="py-3 px-3 text-right">Detalle / Acción</th>
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
                            title="Haz clic para cambiar estado"
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
                            <span
                              className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 text-xs truncate max-w-[180px]"
                              title={rsvp.dietary_restrictions}
                            >
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
      </main>

      {/* Modal de Detalle Completo de Invitado */}
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
                    <span className="text-[#6B5B4D] block mb-1">Acompañantes:</span>
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
