import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../api/users'
import ConfirmModal from '../components/ConfirmModal'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState({ open: false, userId: null, name: '' })
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getUsers()
      .then(setUsers)
      .catch(() => setError('加载失败，请检查后端服务是否启动'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    await deleteUser(modal.userId)
    setModal({ open: false, userId: null, name: '' })
    load()
  }

  if (loading) return <p className="text-wood-700 text-sm">加载中…</p>
  if (error)   return <p className="text-red-600 text-sm">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">用户列表</h1>
        <button
          onClick={() => navigate('/users/new')}
          className="px-4 py-2 bg-accent text-white text-sm rounded hover:bg-accent/90 transition-colors"
        >
          新增用户
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-wood-700 text-sm">暂无用户，点击右上角新增。</p>
      ) : (
        <div className="bg-white rounded-lg border border-wood-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-wood-100 text-wood-700 text-left">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">姓名</th>
                <th className="px-5 py-3 font-medium">邮箱</th>
                <th className="px-5 py-3 font-medium">电话</th>
                <th className="px-5 py-3 font-medium">创建时间</th>
                <th className="px-5 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-t border-wood-200 ${i % 2 === 1 ? 'bg-wood-50' : ''}`}
                >
                  <td className="px-5 py-3 text-wood-700">{u.id}</td>
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3 text-wood-700">{u.email}</td>
                  <td className="px-5 py-3 text-wood-700">{u.phone || '—'}</td>
                  <td className="px-5 py-3 text-wood-700">
                    {new Date(u.created_at).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      onClick={() => navigate(`/users/${u.id}`)}
                      className="text-accent hover:underline"
                    >
                      详情
                    </button>
                    <button
                      onClick={() => setModal({ open: true, userId: u.id, name: u.name })}
                      className="text-red-600 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={modal.open}
        message={`确定要删除用户「${modal.name}」吗？此操作不可恢复。`}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, userId: null, name: '' })}
      />
    </div>
  )
}
