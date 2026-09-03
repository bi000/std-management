import api from './api';

async function getAll(params) {
  const { data } = await api.get('/users', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/users/${id}`);
  return data.data;
}

async function create(payload) {
  const { data } = await api.post('/users', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data.data;
}

async function remove(id) {
  await api.delete(`/users/${id}`);
}

export default { getAll, getById, create, update, remove };
