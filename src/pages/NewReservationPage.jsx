import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { reservationsApi } from '../api/reservations';
import Alert from '../components/Alert';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function NewReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Datos pasados por la navegación desde CourtDetailPage
  const { court, slot, date } = location.state || {};

  const [step, setStep] = useState(1); // 1: Confirmar Datos, 2: Checkout Seña, 3: Éxito
  const [createdReservation, setCreatedReservation] = useState(null);
  const [depositData, setDepositData] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!court || !slot || !date) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          No se seleccionó ningún turno para reservar
        </h2>
        <p className="text-xs text-gray-500">
          Por favor, seleccioná una cancha y un horario disponible desde el catálogo para iniciar una reserva.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir al catálogo de canchas</span>
        </Link>
      </div>
    );
  }

  const totalPrice = slot.pricing?.final_price || court.base_price;
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100;
  const remainingAmount = Math.round((totalPrice - depositAmount) * 100) / 100;

  // Paso 1: Crear la reserva inicial en Rails
  const handleConfirmReservation = async () => {
    setSubmitting(true);
    setError('');

    try {
      const startDateTime = `${date} ${slot.start_time}:00`;
      const endDateTime = `${date} ${slot.end_time}:00`;

      const reservation = await reservationsApi.createReservation({
        court_id: court.id,
        reservation_date: date,
        start_time: startDateTime,
        end_time: endDateTime,
      });

      setCreatedReservation(reservation);

      // Inmediatamente generamos la preferencia de seña del 30%
      const deposit = await reservationsApi.createDeposit(reservation.id);
      setDepositData(deposit);

      setStep(2);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.error ||
        'No fue posible concretar la reserva. El horario puede haber sido ocupado recientemente.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Paso 2: Simulación de pago del 30% vía Webhook
  const handleSimulatePayment = async () => {
    if (!createdReservation) return;

    setSubmitting(true);
    setError('');

    try {
      await reservationsApi.confirmDepositWebhook(createdReservation.id);
      setStep(3);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Ocurrió un error al procesar el pago de la seña. Intente nuevamente.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Botón Volver */}
      {step === 1 && (
        <Link
          to={`/courts/${court.id}?date=${date}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cambiar horario o cancha</span>
        </Link>
      )}

      {/* Indicador de Pasos */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            1
          </div>
          <span className={`text-xs font-bold ${step === 1 ? 'text-gray-900' : 'text-gray-500'}`}>
            Revisión
          </span>
        </div>

        <div className="h-0.5 w-12 bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-500'}`}>
            Pago de Seña
          </span>
        </div>

        <div className="h-0.5 w-12 bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            3
          </div>
          <span className={`text-xs font-bold ${step === 3 ? 'text-gray-900' : 'text-gray-500'}`}>
            Confirmada
          </span>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* ================= PASO 1: REVISIÓN DE DETALLES ================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Confirmar Reserva de Cancha
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Verificá la información del turno antes de generar la reserva.
            </p>
          </div>

          {/* Tarjeta de Resumen */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-200/80 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  {court.sport?.name} • {court.surface_type}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-0.5">{court.name}</h3>
                {court.sports_complex && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {court.sports_complex.name} ({court.sports_complex.address})
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Fecha</span>
                  <span className="font-bold text-gray-800">
                    {new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Horario</span>
                  <span className="font-bold text-gray-800">
                    {slot.start_time} a {slot.end_time} hs ({slot.duration_in_hours || 1} hr)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desglose de Tarifas y Seña */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase text-gray-700 tracking-wider">
              Detalle de Facturación
            </h4>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Valor total del turno</span>
                <span className="font-bold text-gray-900">${totalPrice?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/60 p-2 rounded-xl">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Seña a abonar ahora (30%)
                </span>
                <span>${depositAmount?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-gray-500 pt-1">
                <span>Saldo a cancelar en el complejo (70%)</span>
                <span>${remainingAmount?.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          {/* Botón de Creación */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmReservation}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando reserva...</span>
                </>
              ) : (
                <>
                  <span>Confirmar y proceder al pago de seña</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 2: CHECKOUT SEÑA (MOCK GATEWAY) ================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Abonar Seña de Reserva
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Tu turno fue pre-reservado con el identificador{' '}
              <strong className="text-gray-800">#{createdReservation?.id}</strong>. Para confirmar
              definitivamente la reserva, se requiere el abono de la seña.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">
              Monto de la Seña
            </span>
            <div className="text-3xl font-black text-emerald-700">
              ${depositData?.deposit_amount?.toLocaleString('es-AR') || depositAmount}
            </div>
            <p className="text-[11px] text-emerald-600">
              Corresponde al 30% del valor total (${depositData?.total_price || totalPrice}).
            </p>
          </div>

          {/* Pasarela Mock */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulación de Pasarela de Pagos </span>
            </div>
            <p className="text-xs text-gray-500">
              Esta pasarela interactiva para simular la confirmación Mercado Pago o tarjeta para aprobar la seña
            </p>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSimulatePayment}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirmando pago de seña...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Simular Pago Exitoso (${depositData?.deposit_amount || depositAmount})</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/reservations')}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 underline"
            >
              Pagar más tarde (la reserva quedará como pendiente)
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 3: ÉXITO Y COMPROBANTE ================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              ¡Operación Exitosa!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Reserva Confirmada
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              La seña fue acreditada correctamente y enviamos el comprobante de confirmación a tu correo.
            </p>
          </div>

          {/* Voucher / Comprobante */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-left text-xs space-y-3 max-w-md mx-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-500">Reserva ID</span>
              <span className="font-black text-gray-900">#{createdReservation?.id}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-500">Cancha</span>
              <span className="font-bold text-gray-800">{court.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-500">Fecha y Turno</span>
              <span className="font-bold text-gray-800">
                {date} ({slot.start_time} - {slot.end_time} hs)
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-500">Estado Reserva</span>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
                Confirmada
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-gray-500">Seña Abonada</span>
              <span className="font-black text-emerald-700 text-sm">
                ${depositData?.deposit_amount || depositAmount}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/reservations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl transition shadow-sm"
            >
              <span>Ver mis reservas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

