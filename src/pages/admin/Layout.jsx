import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Boxes, LogOut, Menu, X, BarChart2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin',           icon: <LayoutDashboard size={18}/>, label: 'Dashboard',  end: true },
  { to: '/admin/produtos',  icon: <Package size={18}/>,         label: 'Produtos' },
  { to: '/admin/pedidos',   icon: <ShoppingBag size={18}/>,     label: 'Pedidos' },
  { to: '/admin/estoque',   icon: <Boxes size={18}/>,           label: 'Estoque' },
  { to: '/admin/relatorios',icon: <BarChart2 size={18}/>,       label: 'Relatórios' },
]

export default function AdminLayout() {
  const { isAdmin, logout, user } = useAuth()
  const [sideOpen, setSideOpen] = useState(false)

  if (!isAdmin) return <Navigate to="/admin/login" replace/>

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link to="/" className="block">
          <div className="font-display font-bold text-apuf-blue text-lg">APUF Admin</div>
          <div className="text-apuf-muted text-xs mt-0.5 truncate">{user?.email}</div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive ? 'bg-apuf-blue text-white shadow-sm' : 'text-apuf-muted hover:bg-gray-100 hover:text-apuf-text'
              }`
            }
            onClick={() => setSideOpen(false)}
          >
            {icon}{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-apuf-muted hover:bg-gray-100 transition-colors">
          🌿 Ver loja
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-red-400 hover:bg-red-50 transition-colors">
          <LogOut size={16}/> Sair
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r border-gray-100 sticky top-0 h-screen shrink-0">
        <SidebarContent/>
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSideOpen(false)}/>
          <aside className="absolute left-0 top-0 w-56 h-full bg-white shadow-2xl">
            <SidebarContent/>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3 sticky top-0 z-40">
          <button onClick={() => setSideOpen(true)} className="text-apuf-muted p-1">
            <Menu size={22}/>
          </button>
          <span className="font-display font-bold text-apuf-blue">APUF Admin</span>
          <div className="flex-1"/>
          <button onClick={logout} className="text-red-400 p-1">
            <LogOut size={18}/>
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
