import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

// ─── LOGIN ──────────────────────────────────────────────────
export function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Bem-vindo, ${user.nome?.split(' ')[0]}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="font-display text-2xl text-apuf-text">Entrar na sua conta</h1>
          <p className="text-apuf-muted text-sm mt-1">Acompanhe seus pedidos e histórico</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">E-mail</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="email" required
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">Senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type={showPwd ? 'text' : 'password'} required
                placeholder="Sua senha"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input pl-9 pr-10"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-apuf-muted">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-apuf-blue font-bold hover:underline">Cadastre-se</Link>
          </p>
        </form>

        <p className="text-center text-xs text-apuf-muted mt-4">
          <Link to="/admin/login" className="hover:text-apuf-blue transition-colors">Acesso administrador →</Link>
        </p>
      </div>
    </div>
  )
}

// ─── REGISTER ───────────────────────────────────────────────
export function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', password: '', confirmPassword: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome'
    if (!form.email.includes('@')) e.email = 'E-mail inválido'
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'As senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { authService } = await import('../services')
      await authService.register({ nome: form.nome, email: form.email, telefone: form.telefone, password: form.password })
      await login(form.email, form.password)
      toast.success('Conta criada com sucesso!')
      navigate('/meus-pedidos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type, placeholder, icon) => (
    <div>
      <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type} placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className={`input pl-9 ${errors[key] ? 'border-red-400' : ''}`}
        />
        {key === 'password' && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌱</div>
          <h1 className="font-display text-2xl text-apuf-text">Criar sua conta</h1>
          <p className="text-apuf-muted text-sm mt-1">Acompanhe seus pedidos e histórico de compras</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-4">
          {field('nome', 'Nome completo', 'text', 'Seu nome', <User size={15}/>)}
          {field('email', 'E-mail', 'email', 'seu@email.com', <Mail size={15}/>)}
          {field('telefone', 'WhatsApp (opcional)', 'tel', '(17) 9 9999-9999', <Phone size={15}/>)}
          {field('password', 'Senha', showPwd ? 'text' : 'password', 'Mínimo 6 caracteres', <Lock size={15}/>)}

          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">Confirmar senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type={showPwd ? 'text' : 'password'} placeholder="Repita a senha"
                value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className={`input pl-9 ${errors.confirmPassword ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-apuf-muted">
            Já tem conta?{' '}
            <Link to="/login" className="text-apuf-blue font-bold hover:underline">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
