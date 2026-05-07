import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../api/users'

export default function UserCreate() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await createUser({ ...form, phone: form.phone || null })
      navigate('/users')
    } catch (err) {
      const msg = err.response?.data?.detail
      setError(typeof msg === 'string' ? msg : '提交失败，请检查输入')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-wide mb-6">新增用户</h1>

      <div className="bg-white rounded-lg border border-wood-200 p-6">
        {error && (
          <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-wood-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="请输入姓名"
              className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-wood-700 mb-1">
              邮箱 <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="请输入邮箱"
              className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-wood-700 mb-1">电话</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="请输入电话（选填）"
              className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-accent text-white text-sm rounded hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {submitting ? '提交中…' : '确认新增'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-5 py-2 border border-wood-200 text-wood-700 text-sm rounded hover:bg-wood-100 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
