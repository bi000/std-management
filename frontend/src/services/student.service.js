import api from './api';

async function getAll(params) {
  const { data } = await api.get('/students', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/students/${id}`);
  return data.data;
}

async function create(payload) {
  const { data } = await api.post('/students', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.put(`/students/${id}`, payload);
  return data.data;
}

async function remove(id) {
  await api.delete(`/students/${id}`);
}

export default { getAll, getById, create, update, remove };
