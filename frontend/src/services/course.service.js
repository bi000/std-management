import api from './api';

async function getAll(params) {
  const { data } = await api.get('/courses', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/courses/${id}`);
  return data.data;
}

async function create(payload) {
  const { data } = await api.post('/courses', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.put(`/courses/${id}`, payload);
  return data.data;
}

async function remove(id) {
  await api.delete(`/courses/${id}`);
}

export default { getAll, getById, create, update, remove };
