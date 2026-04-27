import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, RotateCcw, ChevronDown, Lock } from 'lucide-react'
import { pedidosService } from '../services'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { PageLoader } from '../components/Loading'

const STATUS_CONFIG = {
  PENDENTE:  { label: 'Aguardando confirmação', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
  PAGO:      { label: 'Pagamento confirmado',   color: 'bg-blue-100 text-blue-700',   icon: '✅' },
  ENVIADO:   { label: 'A caminho',              color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  ENTREGUE:  { label: 'Entregue',               color: 'bg-green-100 text-green-700',  icon: '🎉' },
  CANCELADO: { label: 'Cancelado',              color: 'bg-red-100 text-red-600',      icon: '❌' },
}

function PedidoCard({ pedido }) {
  const [open, setOpen] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const status = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.PENDENTE

  const repetirPedido = () => {
    pedido.itens?.forEach(item => {
      addItem({
        id: item.produtoId || item.id,
        nome: item.nome,
        preco: item.precoUnitario,
        estoque: 99,
        categoria: item.categoria || 'VERDURAS',
      }, item.quantidade)
    })
    toast.success('Itens adicionados ao carrinho!')
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div
        className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono font-bold text-apuf-blue text-sm">{pedido.numeroPedido}</span>
            <span className={`badge ${status.color}`}>{status.icon} {status.label}</span>
          </div>
          <div className="text-apuf-muted text-xs mt-1">
            {new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="font-extrabold text-apuf-green text-lg">
              R$ {(pedido.total || 0).toFixed(2)}
            </div>
            <div className="text-apuf-muted text-xs">
              {pedido.itens?.length || 0} item{pedido.itens?.length !== 1 ? 's' : ''}
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Expandable details */}
      {open && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          {/* Items list */}
          {pedido.itens && pedido.itens.length > 0 ? (
            <div className="mb-4">
              <div className="text-xs font-bold text-apuf-muted uppercase tracking-wide mb-3">Itens do pedido</div>
              <div className="space-y-2">
                {pedido.itens.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌿</span>
                      <span className="font-semibold text-apuf-text">{item.nome}</span>
                      <span className="text-apuf-muted">×{item.quantidade}</span>
                    </div>
                    <span className="font-bold text-apuf-blue">
                      R$ {((item.precoUnitario || 0) * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-extrabold text-apuf-blue">
                <span>Total</span>
                <span>R$ {(pedido.total || 0).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-apuf-muted mb-4">Detalhes do pedido indisponíveis</p>
          )}

          {/* Delivery info */}
          {pedido.cliente && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 text-sm">
              <div className="text-xs font-bold text-apuf-muted uppercase tracking-wide mb-2">Entrega</div>
              <div className="text-apuf-text font-semibold">{pedido.cliente.nome}</div>
              {pedido.cliente.rua && (
                <div className="text-apuf-muted">
                  {pedido.cliente.rua}, {pedido.cliente.numero} – {pedido.cliente.bairro}
                </div>
              )}
            </div>
          )}

          {/* Action */}
          <button
            onClick={repetirPedido}
            className="flex items-center gap-2 px-4 py-2 bg-apuf-blue text-white rounded-xl text-sm font-bold hover:bg-apuf-blue-mid transition-colors"
          >
            <RotateCcw size={14}/> Repetir pedido
          </button>
        </div>
      )}
    </div>
  )
}

const MOCK_PEDIDOS = [
  {
    id: 1,
    numeroPedido: '#00042',
    status: 'ENTREGUE',
    total: 38.50,
    createdAt: '2025-01-10T10:30:00',
    cliente: { nome: 'Cliente Exemplo', rua: 'Rua das Flores', numero: '123', bairro: 'Centro' },
    itens: [
      { nome: 'Alface Crespa', quantidade: 2, precoUnitario: 3.50 },
      { nome: 'Cenoura', quantidade: 2, precoUnitario: 4.90 },
      { nome: 'Kit Verde Semana', quantidade: 1, precoUnitario: 21.70 },
    ]
  },
  {
    id: 2,
    numeroPedido: '#00038',
    status: 'ENTREGUE',
    total: 35.00,
    createdAt: '2025-01-03T14:20:00',
    cliente: { nome: 'Cliente Exemplo', rua: 'Rua das Flores', numero: '123', bairro: 'Centro' },
    itens: [
      { nome: 'Kit Verde Semana', quantidade: 1, precoUnitario: 35.00 },
    ]
  },
]

export default function MeusPedidos() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const carregar = async () => {
      try {
        const { data } = await pedidosService.meusPedidos()
        setPedidos(data)
      } catch {
        setPedidos(MOCK_PEDIDOS)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [user])

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-5">🔒</div>
      <h2 className="font-display text-2xl text-apuf-text mb-3">Faça login para ver seus pedidos</h2>
      <p className="text-apuf-muted mb-8">
        Crie uma conta ou faça login para acompanhar seus pedidos e ter acesso ao histórico de compras.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/login" className="btn-primary flex items-center gap-2">
          <Lock size={16}/> Entrar
        </Link>
        <Link to="/cadastro" className="btn-secondary">
          Criar conta
        </Link>
      </div>
    </div>
  )

  if (loading) return <PageLoader />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-0">Meus Pedidos</h1>
          <p className="text-apuf-muted text-sm mt-1">
            Olá, <strong>{user.nome?.split(' ')[0]}</strong>! Aqui estão seus pedidos.
          </p>
        </div>
        <Link to="/produtos" className="btn-primary text-sm flex items-center gap-2">
          <ShoppingBag size={15}/> Nova compra
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">📦</div>
          <h3 className="font-display text-xl text-apuf-text mb-3">Nenhum pedido ainda</h3>
          <p className="text-apuf-muted mb-6">Explore nossa feira e faça seu primeiro pedido!</p>
          <Link to="/produtos" className="btn-primary">Ver produtos</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map(p => <PedidoCard key={p.id} pedido={p}/>)}
        </div>
      )}
    </div>
  )
}
