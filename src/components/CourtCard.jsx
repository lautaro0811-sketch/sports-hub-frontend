import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trophy, Clock, ArrowRight } from 'lucide-react';
import { getAssetUrl } from '../utils/imageUrl';

export default function CourtCard({ court, selectedDate }) {
  const imageUrl = getAssetUrl(court.image_url || court.sports_complex?.cover_photo_url);
  const timeSlots = court.time_slots || [];
  const availableSlots = timeSlots.filter((slot) => slot.available);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Contenedor de Imagen o Placeholder */}
      <div className="relative h-48 bg-gradient-to-tr from-emerald-800 to-teal-600 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={court.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-100 p-4">
            <Trophy className="w-12 h-12 mb-2 opacity-80" />
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
              {court.sport?.name || 'Deporte'}
            </span>
          </div>
        )}

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {court.sport && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {court.sport.name}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {court.surface_type}
          </span>
        </div>

        {/* Badge de Disponibilidad */}
        <div className="absolute bottom-3 right-3">
          {availableSlots.length > 0 ? (
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              {availableSlots.length} {availableSlots.length === 1 ? 'turno libre' : 'turnos libres'}
            </span>
          ) : (
            <span className="bg-gray-800/80 backdrop-blur-sm text-gray-200 text-[11px] font-medium px-2.5 py-1 rounded-full">
              Sin turnos libres
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo de la Card */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-700 transition">
            {court.name}
          </h3>

          {court.sports_complex && (
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-700">{court.sports_complex.name}</strong> •{' '}
                {court.sports_complex.address}, {court.sports_complex.city}
              </span>
            </div>
          )}

          {/* Horarios destacados si hay */}
          {timeSlots.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {timeSlots.length} {timeSlots.length === 1 ? 'franja configurada' : 'franjas configuradas'} hoy
              </span>
            </div>
          )}
        </div>

        {/* Pie de Card con Precio y Botón */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Tarifa base
            </span>
            <div className="text-emerald-700 font-extrabold text-lg leading-tight">
              ${court.base_price?.toLocaleString('es-AR')}
              <span className="text-xs text-gray-500 font-normal"> /hr</span>
            </div>
          </div>

          <Link
            to={`/courts/${court.id}${selectedDate ? `?date=${selectedDate}` : ''}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <span>Ver turnos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

