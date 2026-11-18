import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { courtsApi } from '../api/courts';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { getAssetUrl } from '../utils/imageUrl';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Trophy,
  Tag,
  Zap,
} from 'lucide-react';

export default function CourtDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const dateParam = searchParams.get('date') || todayStr;

  const [date, setDate] = useState(dateParam);
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sincroniza el parámetro de búsqueda en la URL
  useEffect(() => {
    setSearchParams({ date });
  }, [date, setSearchParams]);

  // Carga del detalle de la cancha y sus turnos
  useEffect(() => {
    const fetchCourtDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await courtsApi.getCourt(id, date);
        setCourt(data.court);
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          'No se pudo cargar la información de la cancha solicitada.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCourtDetail();
  }, [id, date]);

  const handleSelectSlot = (slot) => {
    if (!isAuthenticated) {
      // Redirigir al login guardando la intención
      navigate('/login', {
        state: {
          from: { pathname: `/courts/${id}`, search: `?date=${date}` },
          message: 'Debés iniciar sesión para reservar un turno',
        },
      });
      return;
    }

    // Navega o prepara el flujo de confirmación de reserva (Fase 4)
    navigate('/reservations/new', {
      state: {
        court,
        slot,
        date,
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-72 bg-gray-200 rounded-3xl"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Cancha no encontrada'} />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const imageUrl = getAssetUrl(court.image_url || court.sports_complex?.cover_photo_url);
  const timeSlots = court.time_slots || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Botón Volver */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a todas las canchas
      </Link>

      {/* Cabecera Principal de la Cancha */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Foto o Ilustración */}
        <div className="relative h-64 md:h-full min-h-[260px] bg-gradient-to-tr from-emerald-800 to-teal-700">
          {imageUrl ? (
            <img src={imageUrl} alt={court.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-100 p-6">
              <Trophy className="w-16 h-16 mb-2 opacity-80" />
              <span className="text-sm uppercase tracking-wider font-bold">
                {court.sport?.name}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {court.sport?.name}
            </span>
            <span className="bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
              Superficie: {court.surface_type}
            </span>
          </div>
        </div>

        {/* Información Detallada */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
                {court.pricing_scheme_name || 'Tarifa estándar'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {court.name}
              </h1>
            </div>

            {court.sports_complex && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{court.sports_complex.name}</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  {court.sports_complex.address}, {court.sports_complex.city}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Base: <strong>${court.base_price?.toLocaleString('es-AR')}</strong> /hr</span>
              </div>
            </div>
          </div>

          {/* Selector de Fecha para consultar turnos */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <label
              htmlFor="detail-date"
              className="block text-xs font-extrabold uppercase text-gray-700 tracking-wider"
            >
              Consultar disponibilidad para la fecha:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  id="detail-date"
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de Turnos para la fecha seleccionada */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Turnos para el {new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Los precios finales se calculan automáticamente aplicando las reglas y multiplicadores vigentes.
            </p>
          </div>
        </div>

        {timeSlots.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-bold text-gray-700">
              No hay franjas horarias configuradas para este día de la semana.
            </p>
            <p className="text-xs text-gray-500">
              Probá seleccionando otra fecha en el calendario superior.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => {
              const hasMultiplier = slot.pricing?.multiplier && slot.pricing.multiplier !== 1;
              const isAvailable = slot.available;

              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isAvailable
                      ? 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        {slot.start_time} - {slot.end_time} hs
                      </span>
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-200/70 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 text-gray-500" />
                          Reservado
                        </span>
                      )}
                    </div>

                    {/* Desglose de Tarifa y Multiplicador */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">
                          Precio Total
                        </span>
                        <div className="text-base font-black text-gray-900 leading-tight">
                          ${slot.pricing?.final_price?.toLocaleString('es-AR')}
                        </div>
                      </div>

                      {hasMultiplier && (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {slot.pricing.multiplier}x Tarifa
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleSelectSlot(slot)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isAvailable
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? 'Seleccionar este turno' : 'No disponible'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

