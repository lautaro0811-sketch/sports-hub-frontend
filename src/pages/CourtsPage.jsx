import React, { useState, useEffect, useCallback } from 'react';
import { courtsApi } from '../api/courts';
import CourtCard from '../components/CourtCard';
import CourtFilters from '../components/CourtFilters';
import Alert from '../components/Alert';
import { Trophy, SearchX, RotateCcw } from 'lucide-react';

export default function CourtsPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carga inicial de catálogo de deportes
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const data = await courtsApi.getSports();
        setSports(data);
      } catch (err) {
        console.warn('Error al cargar lista de deportes:', err);
      }
    };
    fetchSports();
  }, []);

  // Carga reactiva de canchas según los filtros
  const fetchCourts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (selectedSport) params.sport = selectedSport;
      if (selectedDate) params.date = selectedDate;
      if (selectedTime) params.time = selectedTime;

      const data = await courtsApi.getCourts(params);
      setCourts(data.courts || []);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'No se pudo conectar con el servidor para obtener las canchas disponibles.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedSport, selectedDate, selectedTime]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleResetFilters = () => {
    setSelectedSport('');
    setSelectedDate(todayStr);
    setSelectedTime('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Catálogo Oficial</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Explorar Canchas Disponibles
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Filtrá por disciplina, fecha y horario para encontrar tu próximo turno de juego.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Mostrando <strong className="text-gray-900 font-bold">{courts.length}</strong> canchas
        </div>
      </div>

      {/* Barra de Filtros */}
      <CourtFilters
        sports={sports}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        selectedTime={selectedTime}
        onChangeTime={setSelectedTime}
        onResetFilters={handleResetFilters}
      />

      {/* Mensaje de Error con opción de reintentar */}
      {error && (
        <div className="space-y-3">
          <Alert type="error" message={error} />
          <button
            onClick={fetchCourts}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reintentar búsqueda
          </button>
        </div>
      )}

      {/* Estado: Cargando (Skeletons) */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-pulse flex flex-col h-80"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado: Sin resultados */}
      {!loading && !error && courts.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            No se encontraron canchas disponibles
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            No encontramos instalaciones disponibles con los filtros aplicados. Intentá seleccionar otra fecha, otro horario o cambiar de deporte.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {/* Estado: Listado de Canchas */}
      {!loading && !error && courts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} selectedDate={selectedDate} />
          ))}
        </div>
      )}
    </div>
  );
}

