import api from './client';

export const reservationsApi = {
  // Lista las reservas del usuario autenticado
  getReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  // Obtiene el detalle de una reserva específica
  getReservation: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  // Crea una nueva reserva en estado inicial :pending
  createReservation: async ({ court_id, reservation_date, start_time, end_time }) => {
    const response = await api.post('/reservations', {
      reservation: {
        court_id,
        reservation_date,
        start_time,
        end_time,
      },
    });
    return response.data;
  },

  // Cancela una reserva existente
  cancelReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },

  // Genera la preferencia para el pago de la seña (30%)
  createDeposit: async (reservationId) => {
    const response = await api.post('/deposits', {
      reservation_id: reservationId,
    });
    return response.data;
  },

  // Simula el webhook de confirmación de pago de seña
  confirmDepositWebhook: async (reservationId) => {
    const response = await api.post('/deposits/webhook', {
      reservation_id: reservationId,
    });
    return response.data;
  },
};

