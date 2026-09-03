import api from './api';

async function getAll(params) {
  const { data } = await api.get('/departments', { params });
  return data; // { data: rows, pagination }
}

async function getById(id) {
  const { data } = await api.get(`/departments/${id}`);
  return data.data;
}

async function create(payload) {
  const { data } = await api.post('/departments', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.put(`/departments/${id}`, payload);
  return data.data;
}

async function remove(id) {
  await api.delete(`/departments/${id}`);
}

export default { getAll, getById, create, update, remove };
