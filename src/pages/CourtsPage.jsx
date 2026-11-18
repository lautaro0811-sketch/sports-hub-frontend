import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courtsApi } from '../api/courts';
import { complexesApi } from '../api/complexes';
import CourtCard from '../components/CourtCard';
import CourtFilters from '../components/CourtFilters';
import Alert from '../components/Alert';
import { Trophy, SearchX, RotateCcw, Building2, X } from 'lucide-react';

export default function CourtsPage({
  externalComplexId = null,
  onClearExternalComplex = null,
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [searchParams, setSearchParams] = useSearchParams();

  const [sports, setSports] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [courts, setCourts] = useState([]);

  // Estados de filtros
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || '');
  const [selectedComplex, setSelectedComplex] = useState(
    externalComplexId ? String(externalComplexId) : searchParams.get('complex_id') || ''
  );
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || todayStr);
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sincronizar si cambia el prop externalComplexId
  useEffect(() => {
    if (externalComplexId) {
      setSelectedComplex(String(externalComplexId));
    }
  }, [externalComplexId]);

  // Carga inicial de catálogo de deportes y complejos
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [sportsData, complexesData] = await Promise.all([
          courtsApi.getSports().catch(() => []),
          complexesApi.getComplexes().catch(() => []),
        ]);
        setSports(sportsData);
        setComplexes(complexesData);
      } catch (err) {
        console.warn('Error al cargar metadatos de filtros:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Carga reactiva de canchas según los filtros de backend (deporte, complejo, fecha, hora)
  const fetchCourts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (selectedSport) params.sport = selectedSport;
      if (selectedComplex) params.sports_complex_id = selectedComplex;
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
  }, [selectedSport, selectedComplex, selectedDate, selectedTime]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  // Filtrado reactivo en el cliente para búsqueda rápida por texto
  const filteredCourts = useMemo(() => {
    if (!searchQuery.trim()) return courts;
    const q = searchQuery.toLowerCase().trim();

    return courts.filter((court) => {
      const name = court.name?.toLowerCase() || '';
      const sportName = court.sport?.name?.toLowerCase() || '';
      const surface = court.surface_type?.toLowerCase() || '';
      const complexName = court.sports_complex?.name?.toLowerCase() || '';
      const complexCity = court.sports_complex?.city?.toLowerCase() || '';

      return (
        name.includes(q) ||
        sportName.includes(q) ||
        surface.includes(q) ||
        complexName.includes(q) ||
        complexCity.includes(q)
      );
    });
  }, [courts, searchQuery]);

  const handleResetFilters = () => {
    setSelectedSport('');
    setSelectedComplex('');
    setSelectedDate(todayStr);
    setSelectedTime('');
    setSearchQuery('');
    if (onClearExternalComplex) {
      onClearExternalComplex();
    }
  };

  const handleSelectComplex = (complexId) => {
    setSelectedComplex(complexId ? String(complexId) : '');
    if (!complexId && onClearExternalComplex) {
      onClearExternalComplex();
    }
  };

  // Encontrar el complejo seleccionado actualmente para mostrarlo en el banner informativo
  const activeComplexObj = complexes.find((c) => String(c.id) === String(selectedComplex));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
            Filtrá por complejo, disciplina, fecha y horario para encontrar tu próximo turno de juego.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Mostrando <strong className="text-gray-900 font-bold">{filteredCourts.length}</strong> canchas
          {courts.length !== filteredCourts.length && ` (de ${courts.length})`}
        </div>
      </div>

      {/* Banner de Sede Activa (si hay un complejo filtrado) */}
      {activeComplexObj && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Filtrando por complejo
              </p>
              <h2 className="text-sm font-bold text-emerald-950">
                {activeComplexObj.name} {activeComplexObj.city ? `• ${activeComplexObj.city}` : ''}
              </h2>
            </div>
          </div>
          <button
            onClick={() => handleSelectComplex('')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Quitar filtro de sede</span>
          </button>
        </div>
      )}

      {/* Barra de Filtros */}
      <CourtFilters
        sports={sports}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        complexes={complexes}
        selectedComplex={selectedComplex}
        onChangeComplex={handleSelectComplex}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
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
      {!loading && !error && filteredCourts.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            No se encontraron canchas disponibles
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            No encontramos instalaciones disponibles con los filtros aplicados. Intentá seleccionar otro complejo, otra fecha, horario o disciplina.
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
      {!loading && !error && filteredCourts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <CourtCard key={court.id} court={court} selectedDate={selectedDate} />
          ))}
        </div>
      )}
    </div>
  );
}
