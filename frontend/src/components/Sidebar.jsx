import { NavLink } from 'react-router-dom'

const links = [
  { to: '/users', label: '用户列表' },
  { to: '/users/new', label: '新增用户' },
]

export default function Sidebar() {
  return (
    <aside className="w-[220px] min-h-full bg-wood-100 border-r border-wood-200 flex flex-col py-8">
      <div className="px-6 mb-8">
        <span className="text-xl font-semibold tracking-widest text-wood-700">
          MyApp
        </span>
        <p className="text-xs text-wood-700 mt-1 tracking-wider">管理后台</p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/users'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-l-4 border-accent text-accent bg-white pl-3'
                  : 'text-wood-700 hover:bg-wood-200'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
