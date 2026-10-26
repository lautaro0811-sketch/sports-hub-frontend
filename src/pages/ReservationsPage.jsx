import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { reservationsApi } from '../api/reservations';
import Alert from '../components/Alert';
import {
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  Ban,
  RotateCcw,
  PlusCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filtro de estado
  const [filterStatus, setFilterStatus] = useState('all');

  // Estado para modal de cancelación
  const [cancelModalReservation, setCancelModalReservation] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Estado para pagar seña pendiente
  const [payingReservationId, setPayingReservationId] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reservationsApi.getReservations();
      setReservations(data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'No fue posible obtener el listado de reservas. Verifique su conexión.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Manejo de Cancelación de Reserva
  const handleConfirmCancel = async () => {
    if (!cancelModalReservation) return;

    setCancelling(true);
    setCancelError('');

    try {
      await reservationsApi.cancelReservation(cancelModalReservation.id);
      setActionSuccess(`La reserva #${cancelModalReservation.id} fue cancelada exitosamente.`);
      setCancelModalReservation(null);
      // Actualizamos la lista local
      await fetchReservations();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.error ||
        'No se pudo cancelar la reserva.';
      setCancelError(msg);
    } finally {
      setCancelling(false);
    }
  };

  // Manejo de Pago de Seña de una reserva pendiente
  const handlePayPendingDeposit = async (reservationId) => {
    setPayingReservationId(reservationId);
    setError('');

    try {
      await reservationsApi.confirmDepositWebhook(reservationId);
      setActionSuccess(`Seña abonada correctamente. La reserva #${reservationId} quedó confirmada.`);
      await fetchReservations();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'No se pudo registrar el pago de la seña. Intente nuevamente.';
      setError(msg);
    } finally {
      setPayingReservationId(null);
    }
  };

  // Filtro por pestañas
  const filteredReservations = reservations.filter((res) => {
    if (filterStatus === 'all') return true;
    return res.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmada
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            Pendiente de Seña
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <Ban className="w-3 h-3 text-red-500" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Pagado Total
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Seña Abonada (30%)
          </span>
        );
      case 'unpaid':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Sin Abonar
          </span>
        );
    }
  };

  const formatHour = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Panel de Usuario</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Mis Reservas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Revisá tus turnos programados, comprobantes de pago y gestioná cancelaciones.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Reservar otra cancha</span>
        </Link>
      </div>

      {actionSuccess && (
        <Alert
          type="success"
          message={actionSuccess}
          onClose={() => setActionSuccess('')}
        />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Pestañas de Filtro */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'confirmed', label: 'Confirmadas' },
          { key: 'pending', label: 'Pendientes' },
          { key: 'cancelled', label: 'Canceladas' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition -mb-px shrink-0 ${
              filterStatus === tab.key
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Estado: Sin reservas */}
      {!loading && filteredReservations.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            No se encontraron reservas
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {filterStatus === 'all'
              ? 'Todavía no tenés ningún turno reservado en Sports Hub.'
              : `No tenés reservas registradas con estado "${filterStatus}".`}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <span>Explorar catálogo de canchas</span>
          </Link>
        </div>
      )}

      {/* Listado de Tarjetas de Reserva */}
      {!loading && filteredReservations.length > 0 && (
        <div className="space-y-4">
          {filteredReservations.map((res) => {
            const totalPrice = parseFloat(res.total_price || 0);
            const depositAmount = parseFloat(res.deposit_amount || 0);
            const remainingBalance = Math.max(0, totalPrice - depositAmount);
            const startTimeFormatted = formatHour(res.start_time);
            const endTimeFormatted = formatHour(res.end_time);

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all space-y-4"
              >
                {/* Fila Superior: ID, Badges y Fecha */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 text-base">
                      Reserva #{res.id}
                    </span>
                    {getStatusBadge(res.status)}
                    {getPaymentBadge(res.payment_status)}
                  </div>

                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span>
                      Fecha: <strong>{res.reservation_date}</strong>
                    </span>
                  </div>
                </div>

                {/* Fila Central: Datos de la Cancha y Horario */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Instalación
                    </span>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">
                      {res.court?.name || 'Cancha'}
                    </h4>
                    {res.court?.sports_complex && (
                      <p className="text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {res.court.sports_complex.name} ({res.court.sports_complex.address})
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Turno Reservado
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm mt-0.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{startTimeFormatted} a {endTimeFormatted} hs</span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Superficie: {res.court?.surface_type || 'Estándar'}
                    </span>
                  </div>

                  {/* Desglose de Pago */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total:</span>
                      <strong className="text-gray-900">${totalPrice.toLocaleString('es-AR')}</strong>
                    </div>
                    {depositAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Seña (30%):</span>
                        <span>-${depositAmount.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200/80 pt-1 text-gray-700 font-bold">
                      <span>Saldo restante:</span>
                      <span>${remainingBalance.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </div>

                {/* Fila Inferior: Acciones */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                  <div className="text-[11px] text-gray-400">
                    {res.status === 'confirmed' && (
                      <span>Cancelable hasta 24 hs antes del inicio del turno.</span>
                    )}
                    {res.status === 'pending' && (
                      <span className="text-amber-600 font-semibold">
                        Aboná la seña para asegurar el turno y evitar su liberación.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botón Abonar Seña si está pendiente */}
                    {res.status === 'pending' && res.payment_status === 'unpaid' && (
                      <button
                        type="button"
                        disabled={payingReservationId === res.id}
                        onClick={() => handlePayPendingDeposit(res.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
                      >
                        {payingReservationId === res.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Abonar Seña (30%)</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Botón Cancelar Reserva */}
                    {res.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancelError('');
                          setCancelModalReservation(res);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50/50 hover:bg-red-50 px-3.5 py-2 rounded-xl transition"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancelar Turno</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmación de Cancelación */}
      {cancelModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                ¿Cancelar Reserva #{cancelModalReservation.id}?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Estás por cancelar el turno de <strong>{cancelModalReservation.court?.name}</strong> para el día{' '}
                <strong>{cancelModalReservation.reservation_date}</strong>.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
              <p className="font-bold">Política de Cancelación:</p>
              <p>Las reservas deben cancelarse con un mínimo de 24 horas de anticipación a la hora pactada del turno.</p>
            </div>

            {cancelError && <Alert type="error" message={cancelError} />}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelModalReservation(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                No cancelar
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelando...</span>
                  </>
                ) : (
                  <span>Confirmar Cancelación</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
