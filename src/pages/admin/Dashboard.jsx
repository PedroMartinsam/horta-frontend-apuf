import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Package, AlertTriangle, DollarSign } from 'lucide-react'
import { dashboardService, pedidosService } from '../../services'

const STATUS_COLORS = {
  PENDENTE:  'bg-amber-100 text-amber-700',
  PAGO:      'bg-blue-100 text-blue-700',
  ENVIADO:   'bg-purple-100 text-purple-700',
  ENTREGUE:  'bg-green-100 text-green-700',
}

const MOCK_METRICS = {
  totalVendido: 1250.80,
  pedidosHoje: 8,
  produtosAtivos: 14,
  estoqueAlerta: 3,
}

const MOCK_PEDIDOS = [
  { id:'#001', cliente:'Ana Silva', total:38.50, status:'PENDENTE', createdAt:'2025-01-15T10:30:00' },
  { id:'#002', cliente:'João Oliveira', total:55.00, status:'ENTREGUE', createdAt:'2025-01-15T09:15:00' },
  { id:'#003', cliente:'Maria Santos', total:28.90, status:'ENVIADO', createdAt:'2025-01-15T08:45:00' },
  { id:'#004', cliente:'Pedro Costa', total:35.00, status:'PAGO', createdAt:'2025-01-14T17:20:00' },
]

export default function Dashboard() {
  const [metrics, setMetrics] = useState(MOCK_METRICS)
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [{ data: m }, { data: p }] = await Promise.all([
          dashboardService.metricas(),
          pedidosService.listar({ limit: 5 }),
        ])
        setMetrics(m)
        setPedidos(p)
      } catch { /* use mock */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const MetricCard = ({ icon, label, value, color }) => (
    <div className={`card p-5 flex items-center gap-4 border-l-4 ${color}`}>
      <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
      <div>
        <div className="text-apuf-muted text-xs font-bold uppercase tracking-wide">{label}</div>
        <div className="font-extrabold text-2xl text-apuf-text mt-0.5">{value}</div>
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="page-title mb-2">Dashboard</h1>
      <p className="text-apuf-muted text-sm mb-8">Visão geral da APUF hoje</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={<DollarSign size={22} className="text-green-600"/>} label="Total Vendido" value={`R$ ${metrics.totalVendido.toFixed(2)}`} color="border-green-400"/>
        <MetricCard icon={<ShoppingBag size={22} className="text-blue-600"/>} label="Pedidos Hoje" value={metrics.pedidosHoje} color="border-blue-400"/>
        <MetricCard icon={<Package size={22} className="text-apuf-blue"/>} label="Produtos Ativos" value={metrics.produtosAtivos} color="border-apuf-blue"/>
        <MetricCard icon={<AlertTriangle size={22} className="text-amber-500"/>} label="Alerta Estoque" value={metrics.estoqueAlerta} color="border-amber-400"/>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-apuf-text">Pedidos Recentes</h2>
          <a href="/admin/pedidos" className="text-apuf-blue text-sm font-bold hover:underline">Ver todos</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Pedido</th>
                <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Cliente</th>
                <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-apuf-blue">{p.id}</td>
                  <td className="px-5 py-4 font-semibold">{p.cliente?.nome || p.cliente}</td>
                  <td className="px-5 py-4 font-bold text-apuf-green">R$ {(p.total || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4 text-apuf-muted text-xs">
                    {new Date(p.createdAt).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
