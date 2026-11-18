import React from 'react';
import { Building2, X } from 'lucide-react';
import ComplexCard from './ComplexCard';

export default function ComplexesSection({
  complexes = [],
  selectedComplexId,
  onSelectComplex,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 animate-pulse">
              <div className="h-36 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (complexes.length === 0) {
    return null;
  }

  return (
    <section id="complejos" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Sedes & Predios</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Nuestros Complejos Deportivos
          </h2>
          <p className="text-sm text-gray-500">
            Elegí tu sede favorita o explorá todas las canchas disponibles.
          </p>
        </div>

        {selectedComplexId && (
          <button
            onClick={() => onSelectComplex(null)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Ver todas las sedes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {complexes.map((complex) => (
          <ComplexCard
            key={complex.id}
            complex={complex}
            isSelected={selectedComplexId === complex.id}
            onSelect={(id) => onSelectComplex(selectedComplexId === id ? null : id)}
          />
        ))}
      </div>
    </section>
  );
}
