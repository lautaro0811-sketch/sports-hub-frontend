import api from './client';

export const courtsApi = {
  // Obtiene catálogo de deportes para los filtros
  getSports: async () => {
    const response = await api.get('/sports');
    return response.data;
  },

  // Lista canchas aplicando filtros opcionales (deporte, fecha, hora)
  getCourts: async (params = {}) => {
    const response = await api.get('/courts', { params });
    return response.data;
  },

  // Obtiene el detalle de una cancha con sus turnos calculados para una fecha específica
  getCourt: async (id, date) => {
    const params = date ? { date } : {};
    const response = await api.get(`/courts/${id}`, { params });
    return response.data;
  },
};
