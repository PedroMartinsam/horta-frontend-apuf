import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, Package } from 'lucide-react'
import { produtosService } from '../../services'

const MOCK = [
  { id:1, nome:'Alface Crespa', categoria:'VERDURAS', estoque:20 },
  { id:2, nome:'Couve Manteiga', categoria:'VERDURAS', estoque:4 },
  { id:3, nome:'Cenoura', categoria:'LEGUMES', estoque:15 },
  { id:4, nome:'Tomate Italiano', categoria:'LEGUMES', estoque:2 },
  { id:5, nome:'Laranja Pera', categoria:'FRUTAS', estoque:0 },
  { id:6, nome:'Kit Verde Semana', categoria:'KITS', estoque:8 },
]

export default function Estoque() {
  const [produtos, setProdutos] = useState(MOCK)
  const [editing, setEditing] = useState({})

  useEffect(() => {
    produtosService.listar().then(({ data }) => setProdutos(data)).catch(() => {})
  }, [])

  const updateEstoque = async (id, novoEstoque) => {
    const val = parseInt(novoEstoque)
    if (isNaN(val) || val < 0) return
    try {
      await produtosService.atualizar(id, { estoque: val })
    } catch {}
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, estoque: val } : p))
    setEditing(prev => { const n = {...prev}; delete n[id]; return n })
  }

  const esgotados = produtos.filter(p => p.estoque === 0).length
  const baixos = produtos.filter(p => p.estoque > 0 && p.estoque <= 5).length

  return (
    <div>
      <h1 className="page-title mb-2">Controle de Estoque</h1>
      <p className="text-apuf-muted text-sm mb-6">Gerencie a disponibilidade dos produtos</p>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 flex items-center gap-3 border-l-4 border-red-400">
          <Package size={20} className="text-red-500"/>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase">Esgotados</div>
            <div className="font-extrabold text-xl text-red-600">{esgotados}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3 border-l-4 border-amber-400">
          <AlertTriangle size={20} className="text-amber-500"/>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase">Estoque Baixo</div>
            <div className="font-extrabold text-xl text-amber-600">{baixos}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3 border-l-4 border-green-400">
          <TrendingDown size={20} className="text-green-600"/>
          <div>
            <div className="text-xs text-apuf-muted font-bold uppercase">Normal</div>
            <div className="font-extrabold text-xl text-green-600">{produtos.length - esgotados - baixos}</div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-bold text-apuf-muted uppercase tracking-wide">Produto</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-apuf-muted uppercase tracking-wide hidden sm:table-cell">Categoria</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-apuf-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-apuf-muted uppercase tracking-wide">Qtd</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-apuf-muted uppercase tracking-wide">Atualizar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {produtos.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.estoque === 0 ? 'bg-red-50/50' : p.estoque <= 5 ? 'bg-amber-50/50' : ''}`}>
                <td className="px-5 py-4 font-semibold text-apuf-text">{p.nome}</td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="badge bg-gray-100 text-apuf-muted text-xs">{p.categoria}</span>
                </td>
                <td className="px-5 py-4">
                  {p.estoque === 0
                    ? <span className="badge bg-red-100 text-red-600">Esgotado</span>
                    : p.estoque <= 5
                    ? <span className="badge bg-amber-100 text-amber-600">⚠ Baixo</span>
                    : <span className="badge bg-green-100 text-green-700">Normal</span>
                  }
                </td>
                <td className="px-5 py-4 font-bold text-apuf-text">{p.estoque}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder={p.estoque}
                      value={editing[p.id] ?? ''}
                      onChange={e => setEditing(prev => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-center focus:outline-none focus:border-apuf-blue transition-colors"
                    />
                    {editing[p.id] !== undefined && (
                      <button
                        onClick={() => updateEstoque(p.id, editing[p.id])}
                        className="px-3 py-1.5 bg-apuf-green text-white text-xs font-bold rounded-lg hover:bg-apuf-green-light transition-colors"
                      >
                        Salvar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
