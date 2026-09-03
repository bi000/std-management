import api from './api';

async function getAll(params) {
  const { data } = await api.get('/enrollments', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/enrollments/${id}`);
  return data.data;
}

async function create(payload) {
  const { data } = await api.post('/enrollments', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.put(`/enrollments/${id}`, payload);
  return data.data;
}

async function remove(id) {
  await api.delete(`/enrollments/${id}`);
}

export default { getAll, getById, create, update, remove };
