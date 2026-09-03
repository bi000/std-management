import api from './api';

async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data; // { token, user }
}

async function logout() {
  await api.post('/auth/logout');
}

async function getMe() {
  const { data } = await api.get('/auth/me');
  return data.data; // user
}

export default { login, logout, getMe };
