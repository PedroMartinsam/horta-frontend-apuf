import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'ADMIN') navigate('/admin')
      else setError('Acesso negado. Apenas administradores.')
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou senha incorretos')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-apuf-blue to-apuf-blue-dark px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="font-display text-2xl text-white font-bold">Painel APUF</h1>
          <p className="text-white/60 text-sm mt-1">Acesso restrito a administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                  type="email"
                  required
                  placeholder="admin@apuf.com.br"
                  value={form.email}
                  onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  className="input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="Sua senha"
                  value={form.password}
                  onChange={e => setForm(p => ({...p, password: e.target.value}))}
                  className="input pl-9 pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  )
}
