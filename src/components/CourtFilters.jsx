import React from 'react';
import { Filter, Calendar, Clock, RotateCcw } from 'lucide-react';

export default function CourtFilters({
  sports,
  selectedSport,
  onSelectSport,
  selectedDate,
  onChangeDate,
  selectedTime,
  onChangeTime,
  onResetFilters,
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Fila de Filtros de Fecha, Horario y Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filtrar Canchas</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Fecha */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <label htmlFor="filter-date" className="text-[10px] uppercase font-bold text-gray-400 leading-none">
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
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <label htmlFor="filter-time" className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                Hora (Opcional)
              </label>
              <select
                id="filter-time"
                value={selectedTime}
                onChange={(e) => onChangeTime(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="">Cualquier horario</option>
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
          {(selectedSport || selectedTime || selectedDate !== todayStr) && (
            <button
              onClick={onResetFilters}
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition"
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

