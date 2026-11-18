import React from 'react';
import { Filter, Calendar, Clock, RotateCcw, Building2, Search, X } from 'lucide-react';

export default function CourtFilters({
  sports = [],
  selectedSport = '',
  onSelectSport,
  complexes = [],
  selectedComplex = '',
  onChangeComplex,
  searchQuery = '',
  onChangeSearch,
  selectedDate,
  onChangeDate,
  selectedTime = '',
  onChangeTime,
  onResetFilters,
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const hasActiveFilters = Boolean(
    selectedSport ||
    selectedComplex ||
    selectedTime ||
    searchQuery ||
    (selectedDate && selectedDate !== todayStr)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Encabezado y Barra de Búsqueda */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Buscador de texto */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, complejo o superficie..."
            value={searchQuery}
            onChange={(e) => onChangeSearch && onChangeSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearch && onChangeSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Controles de Complejo, Fecha, Hora y Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Complejo */}
          {complexes.length > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex flex-col">
                <label htmlFor="filter-complex" className="text-[9px] uppercase font-bold text-gray-400 leading-none">
                  Complejo
                </label>
                <select
                  id="filter-complex"
                  value={selectedComplex}
                  onChange={(e) => onChangeComplex && onChangeComplex(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[160px] truncate"
                >
                  <option value="">Todas las sedes</option>
                  {complexes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.city ? `(${c.city})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Selector de Fecha */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex flex-col">
              <label htmlFor="filter-date" className="text-[9px] uppercase font-bold text-gray-400 leading-none">
                Fecha
              </label>
              <input
                id="filter-date"
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => onChangeDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Selector de Hora Opcional */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex flex-col">
              <label htmlFor="filter-time" className="text-[9px] uppercase font-bold text-gray-400 leading-none">
                Hora
              </label>
              <select
                id="filter-time"
                value={selectedTime}
                onChange={(e) => onChangeTime(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="">Cualquier hora</option>
                <option value="09:00">09:00 hs</option>
                <option value="10:00">10:00 hs</option>
                <option value="11:00">11:00 hs</option>
                <option value="14:00">14:00 hs</option>
                <option value="15:00">15:00 hs</option>
                <option value="16:00">16:00 hs</option>
                <option value="17:00">17:00 hs</option>
                <option value="18:00">18:00 hs</option>
                <option value="19:00">19:00 hs</option>
                <option value="20:00">20:00 hs</option>
                <option value="21:00">21:00 hs</option>
                <option value="22:00">22:00 hs</option>
              </select>
            </div>
          </div>

          {/* Botón Reset */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Pills de Deportes */}
      <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectSport('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            !selectedSport
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos los deportes
        </button>

        {sports.map((sport) => {
          const isSelected = selectedSport === sport.name || selectedSport === String(sport.id);
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(isSelected ? '' : sport.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{sport.name}</span>
              {sport.courts_count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {sport.courts_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
