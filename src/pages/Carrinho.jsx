import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { abrirWhatsApp } from '../services/whatsapp'
import { pedidosService } from '../services'

const CAT_EMOJI = { VERDURAS:'🥬', LEGUMES:'🥕' }

function ClienteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ nome:'', telefone:'', rua:'', numero:'', bairro:'', referencia:'' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome'
    if (!form.telefone.trim()) e.telefone = 'Informe seu telefone'
    if (!form.rua.trim()) e.rua = 'Informe a rua'
    if (!form.numero.trim()) e.numero = 'Informe o número'
    if (!form.bairro.trim()) e.bairro = 'Informe o bairro'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  const field = (key, label, placeholder, type='text') => (
    <div>
      <label className="block text-xs font-bold text-apuf-muted mb-1 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={`input ${errors[key] ? 'border-red-400' : ''}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="font-display text-lg text-apuf-text mb-5">Seus dados para entrega</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('nome', 'Nome completo', 'Seu nome')}
        {field('telefone', 'WhatsApp', '(17) 9 9999-9999', 'tel')}
        <div className="sm:col-span-2">{field('rua', 'Rua', 'Nome da rua')}</div>
        {field('numero', 'Número', '123')}
        {field('bairro', 'Bairro', 'Seu bairro')}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-apuf-muted mb-1 uppercase tracking-wide">Referência (opcional)</label>
          <input type="text" placeholder="Ex: Próximo à farmácia..." value={form.referencia} onChange={e => setForm(p=>({...p, referencia:e.target.value}))} className="input"/>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-wpp mt-6">
        <MessageCircle size={22}/>
        {loading ? 'Processando...' : 'Finalizar Pedido via WhatsApp'}
      </button>
      <p className="text-center text-xs text-apuf-muted mt-3">
        Você será redirecionado para o WhatsApp para confirmar o pedido
      </p>
    </form>
  )
}

export default function Carrinho() {
  const { items, removeItem, updateQty, total, clearCart, count } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFinalizar = async (cliente) => {
    setLoading(true)
    try {
      // Try to save order in backend
      await pedidosService.criar({
        itens: items.map(i => ({ produtoId: i.id, quantidade: i.quantity, precoUnitario: i.preco })),
        cliente,
        total,
      })
    } catch {
      // If backend not available, continue with WhatsApp only
    }
    abrirWhatsApp(items, total, cliente)
    clearCart()
    setLoading(false)
  }

  if (count === 0 && !loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="font-display text-2xl text-apuf-text mb-3">Seu carrinho está vazio</h2>
      <p className="text-apuf-muted mb-8">Que tal explorar nossa feira e adicionar produtos fresquinhos?</p>
      <Link to="/produtos" className="btn-primary inline-flex items-center gap-2">
        <ShoppingBag size={16}/> Ver produtos
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/produtos" className="text-apuf-muted hover:text-apuf-blue transition-colors">
          <ArrowLeft size={20}/>
        </Link>
        <div>
          <h1 className="page-title mb-0">Meu Carrinho</h1>
          <p className="text-apuf-muted text-sm">{count} item{count !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gray-50 shrink-0">
                {item.imagemUrl
                  ? <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover rounded-xl"/>
                  : CAT_EMOJI[item.categoria] || '🌿'
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-apuf-text truncate">{item.nome}</div>
                <div className="text-apuf-muted text-xs">{item.unidade}</div>
                <div className="text-apuf-blue font-extrabold text-base mt-1">
                  R$ {(item.preco * item.quantity).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-apuf-blue flex items-center justify-center transition-colors">
                  <Minus size={14}/>
                </button>
                <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, Math.min(item.quantity + 1, item.estoque))} disabled={item.quantity >= item.estoque} className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-apuf-blue flex items-center justify-center transition-colors disabled:opacity-40">
                  <Plus size={14}/>
                </button>
                <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors ml-1">
                  <Trash2 size={15}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + Checkout */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-apuf-text mb-4">Resumo do pedido</h3>
            <div className="space-y-2 text-sm">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-apuf-muted">
                  <span className="truncate">{i.nome} ×{i.quantity}</span>
                  <span className="font-semibold shrink-0 ml-2">R$ {(i.preco * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-extrabold text-lg text-apuf-blue">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            {!checkout && (
              <button onClick={() => setCheckout(true)} className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-2">
                Continuar <ArrowLeft size={14} className="rotate-180"/>
              </button>
            )}
          </div>

          {checkout && <ClienteForm onSubmit={handleFinalizar} loading={loading}/>}
        </div>
      </div>
    </div>
  )
}
