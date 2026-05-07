import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser } from '../api/users'

function Field({ label, value }) {
  return (
    <div className="py-4 border-b border-wood-200 last:border-b-0 flex">
      <span className="w-24 text-sm text-wood-700 shrink-0">{label}</span>
      <span className="text-sm">{value || '—'}</span>
    </div>
  )
}

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getUser(id)
      .then(setUser)
      .catch(() => setError('用户不存在或加载失败'))
  }, [id])

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!user)  return <p className="text-wood-700 text-sm">加载中…</p>

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-wood-700 hover:text-accent text-sm transition-colors"
        >
          ← 返回列表
        </button>
        <h1 className="text-2xl font-semibold tracking-wide">用户详情</h1>
      </div>

      <div className="bg-white rounded-lg border border-wood-200 px-6">
        <Field label="ID" value={user.id} />
        <Field label="姓名" value={user.name} />
        <Field label="邮箱" value={user.email} />
        <Field label="电话" value={user.phone} />
        <Field
          label="创建时间"
          value={new Date(user.created_at).toLocaleString('zh-CN')}
        />
        {user.updated_at && (
          <Field
            label="更新时间"
            value={new Date(user.updated_at).toLocaleString('zh-CN')}
          />
        )}
      </div>
    </div>
  )
}
