import React from 'react';
import { MapPin, Building2, ArrowRight, Check } from 'lucide-react';
import { getAssetUrl } from '../utils/imageUrl';

export default function ComplexCard({ complex, isSelected, onSelect }) {
  const coverUrl = getAssetUrl(complex.cover_photo_url);

  return (
    <div
      onClick={() => onSelect && onSelect(complex.id)}
      className={`rounded-2xl border transition-all overflow-hidden flex flex-col cursor-pointer group bg-white ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500 shadow-md'
          : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      {/* Contenedor de Imagen o Placeholder */}
      <div className="relative h-40 bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={complex.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-100 p-4">
            <Building2 className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
              Sede Oficial
            </span>
          </div>
        )}

        {/* Badge superior de Ciudad */}
        {complex.city && (
          <div className="absolute top-3 left-3">
            <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{complex.city}</span>
            </span>
          </div>
        )}

        {/* Badge de Total de Canchas */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            {complex.total_courts ?? 0} {complex.total_courts === 1 ? 'cancha' : 'canchas'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition">
            {complex.name}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{complex.address}</span>
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Complejo seleccionado</span>
              </>
            ) : (
              <>
                <span>Ver canchas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
