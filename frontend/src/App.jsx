import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import UserList from './pages/UserList'
import UserCreate from './pages/UserCreate'
import UserDetail from './pages/UserDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route element={<Layout />}>
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserCreate />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
