import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <Trophy className="w-3.5 h-3.5" />
            <span>Temporada 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Reservá tu cancha favorita en minutos.
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Explorá complejos deportivos, consultá disponibilidad de turnos en tiempo real,
            confirmá con seña online y gestioná tus reservas desde un solo lugar.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-700 font-bold flex items-center justify-center text-base">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs text-emerald-200">¡Hola de nuevo!</p>
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl shadow-md transition"
                >
                  <span>Crear mi cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl border border-emerald-500/40 transition"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Características Destacadas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Turnos en Tiempo Real</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Consultá disponibilidad horaria inmediata con cálculo automático de tarifas y reglas de precio dinámico.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Seña Online Integrada</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Asegurá tu turno pagando el 30% del valor inicial con confirmación instantánea de tu reserva.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Múltiples Disciplinas</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Fútbol, Pádel, Tenis y más instalaciones de primer nivel verificadas para tu partido.
          </p>
        </div>
      </section>
    </div>
  );
}
