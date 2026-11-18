import api from './client';

export const complexesApi = {
  // Obtiene el listado de todos los complejos deportivos disponibles
  getComplexes: async () => {
    const response = await api.get('/sports_complexes');
    return response.data;
  },

  // Obtiene el detalle de un complejo específico por su ID
  getComplex: async (id) => {
    const response = await api.get(`/sports_complexes/${id}`);
    return response.data;
  },
};
