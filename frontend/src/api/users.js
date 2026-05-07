import axios from 'axios'

const http = axios.create({ baseURL: '' })

export const getUsers = (skip = 0, limit = 20) =>
  http.get('/api/users', { params: { skip, limit } }).then(r => r.data)

export const getUser = (id) =>
  http.get(`/api/users/${id}`).then(r => r.data)

export const createUser = (data) =>
  http.post('/api/users', data).then(r => r.data)

export const deleteUser = (id) =>
  http.delete(`/api/users/${id}`)
