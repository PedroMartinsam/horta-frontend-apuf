import { useState, useEffect } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import { pedidosService } from '../../services'

const STATUS_OPTIONS = ['PENDENTE', 'PAGO', 'ENVIADO', 'ENTREGUE']
const STATUS_COLORS = {
  PENDENTE: 'bg-amber-100 text-amber-700 border-amber-200',
  PAGO:     'bg-blue-100 text-blue-700 border-blue-200',
  ENVIADO:  'bg-purple-100 text-purple-700 border-purple-200',
  ENTREGUE: 'bg-green-100 text-green-700 border-green-200',
}

const MOCK_PEDIDOS = [
  { id:1, numeroPedido:'#001', cliente:{ nome:'Ana Silva', telefone:'17999990001' }, total:38.50, status:'PENDENTE', createdAt:'2025-01-15T10:30:00', itens:[{nome:'Alface',quantidade:2,precoUnitario:3.50},{nome:'Cenoura',quantidade:2,precoUnitario:4.90}] },
  { id:2, numeroPedido:'#002', cliente:{ nome:'João Oliveira', telefone:'17999990002' }, total:55.00, status:'ENTREGUE', createdAt:'2025-01-15T09:15:00', itens:[{nome:'Kit Verde Semana',quantidade:1,precoUnitario:35.00}] },
  { id:3, numeroPedido:'#003', cliente:{ nome:'Maria Santos', telefone:'17999990003' }, total:28.90, status:'ENVIADO', createdAt:'2025-01-15T08:45:00', itens:[] },
]

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    pedidosService.listar().then(({ data }) => setPedidos(data)).catch(() => {})
  }, [])

  const atualizarStatus = async (id, status) => {
    try {
      await pedidosService.atualizarStatus(id, status)
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    } catch {
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    }
  }

  const filtered = selectedStatus ? pedidos.filter(p => p.status === selectedStatus) : pedidos

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title mb-0">Pedidos</h1>
          <p className="text-apuf-muted text-sm">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <select className="input w-auto text-sm" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(pedido => (
          <div key={pedido.id} className="card overflow-hidden">
            <div
              className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === pedido.id ? null : pedido.id)}
            >
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className="font-mono font-bold text-apuf-blue text-sm shrink-0">{pedido.numeroPedido || `#${pedido.id}`}</span>
                <div className="min-w-0">
                  <div className="font-bold text-apuf-text truncate">{pedido.cliente?.nome}</div>
                  <div className="text-apuf-muted text-xs">{new Date(pedido.createdAt).toLocaleString('pt-BR')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-extrabold text-apuf-green">R$ {(pedido.total || 0).toFixed(2)}</span>
                <select
                  value={pedido.status}
                  onChange={e => { e.stopPropagation(); atualizarStatus(pedido.id, e.target.value) }}
                  className={`text-xs font-bold border rounded-lg px-2 py-1.5 cursor-pointer ${STATUS_COLORS[pedido.status] || 'bg-gray-100 text-gray-600'}`}
                  onClick={e => e.stopPropagation()}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === pedido.id ? 'rotate-180' : ''}`}/>
              </div>
            </div>

            {expanded === pedido.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-bold text-apuf-muted uppercase tracking-wide mb-2">Cliente</div>
                    <div className="text-sm font-semibold">{pedido.cliente?.nome}</div>
                    <div className="text-sm text-apuf-muted">{pedido.cliente?.telefone}</div>
                    {pedido.cliente?.rua && (
                      <div className="text-sm text-apuf-muted mt-1">
                        {pedido.cliente.rua}, {pedido.cliente.numero} – {pedido.cliente.bairro}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-apuf-muted uppercase tracking-wide mb-2">Itens do pedido</div>
                    {(pedido.itens || []).length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {pedido.itens.map((item, i) => (
                          <li key={i} className="flex justify-between">
                            <span className="text-apuf-muted">{item.nome} ×{item.quantidade}</span>
                            <span className="font-semibold">R$ {((item.precoUnitario || 0) * item.quantidade).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-apuf-muted">Sem detalhes dos itens</p>
                    )}
                  </div>
                </div>
                {pedido.cliente?.telefone && (
                  <a
                    href={`https://wa.me/55${pedido.cliente.telefone.replace(/\D/g,'')}?text=Olá ${pedido.cliente.nome}! Sobre seu pedido ${pedido.numeroPedido}...`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#22c55e] transition-colors"
                  >
                    💬 Contatar via WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
