import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, User, ClipboardList, Search } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'

function ApufLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#1a3fa0" stroke="#e65100" strokeWidth="4"/>
      <ellipse cx="50" cy="50" rx="16" ry="13" fill="#e65100"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line key={i}
          x1={50 + 16 * Math.cos((deg - 90) * Math.PI / 180)}
          y1={50 + 13 * Math.sin((deg - 90) * Math.PI / 180)}
          x2={50 + 26 * Math.cos((deg - 90) * Math.PI / 180)}
          y2={50 + 26 * Math.sin((deg - 90) * Math.PI / 180)}
          stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
        />
      ))}
      <path d="M18 63 Q50 55 82 63" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M22 68 Q50 60 78 68" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const { count } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="bg-apuf-blue sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <ApufLogo size={38} />
            <div className="hidden sm:block">
              <div className="text-white font-display font-bold text-lg leading-tight">APUF</div>
              <div className="text-blue-200 text-[10px] font-semibold tracking-wide leading-tight">Associação dos Produtores Urbanos de Fernandópolis - SP</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
                }>{label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(s => !s)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
              title="Buscar produtos"
            >
              <Search size={18} />
            </button>

            {/* Admin */}
            {isAdmin && (
              <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-bold transition-all">
                <LayoutDashboard size={15} /> Admin
              </Link>
            )}

            {/* Client orders */}
            {user && !isAdmin && (
              <Link to="/meus-pedidos" className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-bold transition-all">
                <ClipboardList size={15} /> Pedidos
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <button onClick={logout} className="hidden md:flex items-center gap-1.5 text-white/60 hover:text-white text-sm px-2 py-2 rounded-lg transition-all" title="Sair">
                <LogOut size={16} />
              </button>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-bold transition-all">
                <User size={15} /> Entrar
              </Link>
            )}

            {/* Cart */}
            <Link to="/carrinho" className="relative flex items-center gap-2 bg-apuf-orange hover:bg-apuf-orange-light text-white px-3 py-2 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Carrinho</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-apuf-orange text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="bg-apuf-blue border-t border-white/10 px-4 py-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1" style={{ background: '#142f7a' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/80'}`
                }>{label}</NavLink>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  {!isAdmin && <Link to="/meus-pedidos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white/80"><ClipboardList size={15}/> Meus pedidos</Link>}
                  {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white/80"><LayoutDashboard size={15}/> Painel Admin</Link>}
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-300"><LogOut size={15}/> Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white/80"><User size={15}/> Entrar</Link>
                  <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white/80">🌱 Criar conta</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
