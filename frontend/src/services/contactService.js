import api from './api';

export const contactService = {
  submitMessage: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  }
};
