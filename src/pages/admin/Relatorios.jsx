import { useState, useEffect } from 'react'
import { TrendingUp, Package, DollarSign } from 'lucide-react'
import { dashboardService } from '../../services'

const MOCK_VENDAS = [
  { dia: '19/01', total: 185.50 },
  { dia: '20/01', total: 220.00 },
  { dia: '21/01', total: 145.00 },
  { dia: '22/01', total: 310.80 },
  { dia: '23/01', total: 280.50 },
  { dia: '24/01', total: 195.00 },
  { dia: '25/01', total: 350.90 },
]

const MOCK_MAIS_VENDIDOS = [
  { nome: 'Alface Crespa', quantidade: 48 },
  { nome: 'Kit Verde Semana', quantidade: 35 },
  { nome: 'Cenoura', quantidade: 29 },
  { nome: 'Couve Manteiga', quantidade: 22 },
  { nome: 'Laranja Pera', quantidade: 18 },
]

function BarChart({ data }) {
  if (!data || data.length === 0) return <div className="text-center text-apuf-muted py-10 text-sm">Sem dados disponíveis</div>

  const maxVal = Math.max(...data.map(d => d.total))

  return (
    <div className="flex items-end gap-2 h-48 pt-4">
      {data.map((d, i) => {
        const height = Math.max(6, (d.total / maxVal) * 100)
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1 group">
            <div className="text-[10px] text-apuf-muted font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              R${d.total.toFixed(0)}
            </div>
            <div
              className="w-full bg-apuf-blue hover:bg-apuf-blue-mid rounded-t-lg transition-all duration-200 cursor-pointer"
              style={{ height: `${height}%` }}
              title={`${d.dia}: R$ ${d.total.toFixed(2)}`}
            />
            <div className="text-[10px] text-apuf-muted font-semibold">{d.dia}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Relatorios() {
  const [vendas, setVendas] = useState(MOCK_VENDAS)
  const [maisVendidos, setMaisVendidos] = useState(MOCK_MAIS_VENDIDOS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [{ data: v }, { data: mv }] = await Promise.all([
          dashboardService.vendasPorDia(),
          dashboardService.maisVendidos(),
        ])
        if (v.length > 0) setVendas(v)
        if (mv.length > 0) setMaisVendidos(mv)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const totalPeriodo = vendas.reduce((acc, d) => acc + d.total, 0)
  const mediadiaria = totalPeriodo / (vendas.length || 1)
  const melhorDia = vendas.reduce((best, d) => d.total > best.total ? d : best, vendas[0] || { dia: '-', total: 0 })

  return (
    <div>
      <h1 className="page-title mb-2">Relatórios</h1>
      <p className="text-apuf-muted text-sm mb-8">Análise de vendas dos últimos 30 dias</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 border-l-4 border-apuf-green flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl"><DollarSign size={22} className="text-apuf-green"/></div>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase tracking-wide">Total no período</div>
            <div className="font-extrabold text-2xl text-apuf-text mt-0.5">R$ {totalPeriodo.toFixed(2)}</div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-apuf-blue flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><TrendingUp size={22} className="text-apuf-blue"/></div>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase tracking-wide">Média diária</div>
            <div className="font-extrabold text-2xl text-apuf-text mt-0.5">R$ {mediadiaria.toFixed(2)}</div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-apuf-orange flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl"><Package size={22} className="text-apuf-orange"/></div>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase tracking-wide">Melhor dia</div>
            <div className="font-extrabold text-xl text-apuf-text mt-0.5">{melhorDia.dia}</div>
            <div className="text-apuf-muted text-xs">R$ {melhorDia.total?.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vendas chart */}
        <div className="card p-6">
          <h2 className="font-bold text-apuf-text mb-1">Vendas por Dia</h2>
          <p className="text-apuf-muted text-xs mb-4">Últimos {vendas.length} dias</p>
          <BarChart data={vendas}/>
        </div>

        {/* Mais vendidos */}
        <div className="card p-6">
          <h2 className="font-bold text-apuf-text mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-3">
            {maisVendidos.map((p, i) => {
              const maxQtd = maisVendidos[0]?.quantidade || 1
              const pct = Math.round((p.quantidade / maxQtd) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-apuf-text flex items-center gap-2">
                      <span className="text-apuf-muted text-xs w-4">#{i + 1}</span>
                      {p.nome}
                    </span>
                    <span className="font-bold text-apuf-blue">{p.quantidade} un</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-apuf-blue rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
