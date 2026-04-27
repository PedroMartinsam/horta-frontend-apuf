import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Public pages
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import Produto from './pages/Produto'
import Carrinho from './pages/Carrinho'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import MeusPedidos from './pages/MeusPedidos'
import NotFound from './pages/NotFound'
import { Login, Cadastro } from './pages/Auth'

// Admin pages
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AdminProdutos from './pages/admin/Produtos'
import AdminPedidos from './pages/admin/Pedidos'
import Estoque from './pages/admin/Estoque'
import Relatorios from './pages/admin/Relatorios'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/produtos" element={<PublicLayout><Produtos /></PublicLayout>} />
            <Route path="/produto/:id" element={<PublicLayout><Produto /></PublicLayout>} />
            <Route path="/carrinho" element={<PublicLayout><Carrinho /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><Sobre /></PublicLayout>} />
            <Route path="/contato" element={<PublicLayout><Contato /></PublicLayout>} />
            <Route path="/meus-pedidos" element={<PublicLayout><MeusPedidos /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/cadastro" element={<PublicLayout><Cadastro /></PublicLayout>} />

            {/* ── Admin ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<AdminProdutos />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="estoque" element={<Estoque />} />
              <Route path="relatorios" element={<Relatorios />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
