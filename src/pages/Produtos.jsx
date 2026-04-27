import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { produtosService } from '../services'
import { useDebounce } from '../hooks'

const CATEGORIAS = [
  
]

// Mock data for when API isn't connected
const MOCK_PRODUTOS = [
  { id:1, nome:'Alface Crespa', categoria:'VERDURAS', preco:3.50, descricao:'Fresca e crocante, colhida hoje cedo', estoque:20, unidade:'por pé' },
  { id:2, nome:'Couve Manteiga', categoria:'VERDURAS', preco:4.00, descricao:'Folhas largas e macias, ideal para refogado', estoque:15, unidade:'maço' },
  { id:3, nome:'Rúcula', categoria:'VERDURAS', preco:3.00, descricao:'Picante e aromática, ótima para saladas', estoque:8, unidade:'maço' },
  { id:4, nome:'Espinafre', categoria:'VERDURAS', preco:3.50, descricao:'Rico em ferro e muito saboroso', estoque:5, unidade:'maço' },
  { id:5, nome:'Cenoura', categoria:'LEGUMES', preco:4.90, descricao:'Cenouras grandes e doces da horta', estoque:30, unidade:'500g' },
  { id:6, nome:'Tomate Italiano', categoria:'LEGUMES', preco:6.00, descricao:'Carnudo e adocicado, perfeito para molhos', estoque:3, unidade:'kg' },
  { id:7, nome:'Pimentão Vermelho', categoria:'LEGUMES', preco:7.50, descricao:'Doce e crocante, colhido no ponto certo', estoque:12, unidade:'unidade' },
  { id:8, nome:'Pepino Caipira', categoria:'LEGUMES', preco:2.50, descricao:'Crocante e refrescante', estoque:0, unidade:'unidade' },
  { id:9, nome:'Laranja Pera', categoria:'FRUTAS', preco:5.50, descricao:'Suculenta e adocicada, ótima para suco', estoque:25, unidade:'kg' },
  { id:10, nome:'Mamão Formosa', categoria:'FRUTAS', preco:8.00, descricao:'Maduro no ponto, doce e macio', estoque:7, unidade:'unidade' },
  { id:11, nome:'Banana Prata', categoria:'FRUTAS', preco:4.50, descricao:'Doce e nutritiva, do produtor local', estoque:20, unidade:'kg' },
  { id:12, nome:'Kit Verde Semana', categoria:'KITS', preco:35.00, descricao:'Alface, couve, espinafre, rúcula, cebolinha e salsinha. Ideal para a semana!', estoque:10, unidade:'kit' },
  { id:13, nome:'Kit Salada Completa', categoria:'KITS', preco:28.00, descricao:'Alface, tomate, pepino, cenoura e rúcula. Tudo pra montar a salada perfeita!', estoque:8, unidade:'kit' },
  { id:14, nome:'Kit Família', categoria:'KITS', preco:55.00, descricao:'Seleção completa de verduras, legumes e frutas para uma semana saudável em família', estoque:5, unidade:'kit' },
]

export default function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')
  const [ordenacao, setOrdenacao] = useState('nome')
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  const buscaDebounced = useDebounce(busca)

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true)
      try {
        const { data } = await produtosService.listar({
          busca: buscaDebounced || undefined,
          categoria: categoria || undefined,
          ativo: true,
        })
        setProdutos(data)
      } catch {
        // Use mock data
        let filtered = MOCK_PRODUTOS
        if (categoria) filtered = filtered.filter(p => p.categoria === categoria)
        if (buscaDebounced) filtered = filtered.filter(p =>
          p.nome.toLowerCase().includes(buscaDebounced.toLowerCase()) ||
          p.descricao.toLowerCase().includes(buscaDebounced.toLowerCase())
        )
        setProdutos(filtered)
      } finally { setLoading(false) }
    }
    fetchProdutos()
  }, [buscaDebounced, categoria])

  const handleCategoria = (key) => {
    setCategoria(key)
    if (key) setSearchParams({ categoria: key })
    else setSearchParams({})
  }

  const sorted = [...produtos].sort((a, b) => {
    if (ordenacao === 'preco_asc') return a.preco - b.preco
    if (ordenacao === 'preco_desc') return b.preco - a.preco
    return a.nome.localeCompare(b.nome)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Nossa Feira</h1>
        <p className="text-apuf-muted text-sm">Produtos frescos dos produtores de Fernandópolis</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-apuf-muted shrink-0"/>
          <select
            value={ordenacao}
            onChange={e => setOrdenacao(e.target.value)}
            className="input w-auto"
          >
            <option value="nome">A - Z</option>
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoria(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
              categoria === cat.key
                ? 'bg-apuf-green border-apuf-green text-white'
                : 'bg-white border-gray-200 text-apuf-muted hover:border-apuf-green hover:text-apuf-green'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-apuf-muted text-sm mb-4">
          {sorted.length} produto{sorted.length !== 1 ? 's' : ''} encontrado{sorted.length !== 1 ? 's' : ''}
          {categoria && ` em ${CATEGORIAS.find(c => c.key === categoria)?.label}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100"/>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 text-apuf-muted">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-bold">Nenhum produto encontrado</p>
          <p className="text-sm mt-1">Tente buscar por outro termo ou categoria</p>
          <button onClick={() => { setBusca(''); setCategoria('') }} className="btn-primary mt-4 text-sm">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map(p => <ProductCard key={p.id} produto={p}/>)}
        </div>
      )}
    </div>
  )
}
