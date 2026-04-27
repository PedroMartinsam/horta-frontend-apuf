import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Plus, Minus, AlertTriangle, Share2 } from 'lucide-react'
import { produtosService } from '../services'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { PageLoader } from '../components/Loading'

const CAT_EMOJI = { VERDURAS: '🥬', LEGUMES: '🥕' }
const CAT_COLORS = {
  VERDURAS: 'bg-green-100 text-green-700',
  LEGUMES:  'bg-orange-100 text-orange-700',
}

// Mock fallback
const MOCK_PRODUTOS = [
  { id:1, nome:'Alface Crespa', categoria:'VERDURAS', preco:3.50, descricao:'Fresca e crocante, colhida hoje cedo pelos nossos produtores. Rica em fibras, vitaminas A e C. Ideal para saladas, sanduíches e sucos verdes.', estoque:20, unidade:'por pé' },
  { id:2, nome:'Couve Manteiga', categoria:'VERDURAS', preco:4.00, descricao:'Folhas largas e macias, perfeitas para refogado, vitamina e chips. Rica em cálcio e ferro.', estoque:15, unidade:'maço' },
  { id:5, nome:'Cenoura', categoria:'LEGUMES', preco:4.90, descricao:'Cenouras grandes e doces da horta local. Fonte de betacaroteno. Ótima crua, cozida ou no suco.', estoque:30, unidade:'500g' },
  { id:12, nome:'Kit Verde Semana', categoria:'KITS', preco:35.00, descricao:'O kit perfeito para a semana! Inclui: 1 pé de alface, 1 maço de couve, 1 maço de espinafre, 1 maço de rúcula, 1 maço de cebolinha e 1 maço de salsinha. Tudo fresquinho colhido na semana.', estoque:10, unidade:'kit' },
]

export default function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items } = useCart()
  const { toast } = useToast()
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [relacionados, setRelacionados] = useState([])

  const noCarrinho = items.find(i => i.id === produto?.id)

  useEffect(() => {
    const carregar = async () => {
      setLoading(true)
      try {
        const { data } = await produtosService.buscar(id)
        // Verifica se a imagem é válida
        if (!data.imagemUrl || data.imagemUrl.trim() === '') {
          data.imagemUrl = null // Define como null para usar o fallback
        }
        setProduto(data)
        // Load related products
        const { data: todos } = await produtosService.listar({ ativo: true })
        setRelacionados(todos.filter(p => p.categoria === data.categoria && p.id !== data.id).slice(0, 3))
      } catch {
        const mock = MOCK_PRODUTOS.find(p => p.id === Number(id))
        if (mock) {
          if (!mock.imagemUrl || mock.imagemUrl.trim() === '') {
            mock.imagemUrl = null // Define como null para usar o fallback
          }
          setProduto(mock)
          setRelacionados(MOCK_PRODUTOS.filter(p => p.categoria === mock.categoria && p.id !== mock.id).slice(0, 3))
        } else {
          navigate('/produtos')
        }
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id])

  const handleAdd = () => {
    addItem(produto, quantidade)
    toast.success(`${produto.nome} adicionado ao carrinho!`)
    setQuantidade(1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: produto.nome, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Link copiado!')
    }
  }

  if (loading) return <PageLoader />

  if (!produto) return null

  const esgotado = produto.estoque === 0
  const estoqueMaximo = Math.min(quantidade, produto.estoque)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-apuf-muted mb-6">
        <Link to="/" className="hover:text-apuf-blue transition-colors">Início</Link>
        <span>/</span>
        <Link to="/produtos" className="hover:text-apuf-blue transition-colors">Produtos</Link>
        <span>/</span>
        <span className="text-apuf-text font-semibold truncate">{produto.nome}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {/* Image */}
        <div>
          <div className="card overflow-hidden">
            <div
              className="h-72 md:h-96 flex items-center justify-center text-8xl"
              style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}
            >
              {produto.imagemUrl ? (
                <img
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = CAT_EMOJI[produto.categoria] || '🌿'; }}
                />
              ) : (
                <span>{CAT_EMOJI[produto.categoria] || '🌿'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className={`badge ${CAT_COLORS[produto.categoria] || 'bg-gray-100 text-gray-600'} w-fit mb-3`}>
            {CAT_EMOJI[produto.categoria]} {produto.categoria}
          </span>

          <h1 className="font-display text-3xl text-apuf-text mb-2">{produto.nome}</h1>

          {/* Stock status */}
          {esgotado ? (
            <div className="flex items-center gap-2 text-red-500 text-sm font-bold mb-3">
              <AlertTriangle size={16} /> Produto esgotado no momento
            </div>
          ) : produto.estoque <= 5 ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm font-bold mb-3">
              <AlertTriangle size={16} /> Últimas {produto.estoque} unidades disponíveis!
            </div>
          ) : (
            <div className="text-green-600 text-sm font-bold mb-3">
              ✓ Em estoque ({produto.estoque} disponíveis)
            </div>
          )}

          {/* Price */}
          <div className="mb-5">
            <div className="text-4xl font-extrabold text-apuf-blue">
              R$ {produto.preco.toFixed(2)}
            </div>
            <div className="text-apuf-muted text-sm mt-1">{produto.unidade}</div>
          </div>

          {/* Description */}
          <p className="text-apuf-muted leading-relaxed mb-6">{produto.descricao}</p>

          {/* Quantity selector */}
          {!esgotado && (
            <div className="mb-5">
              <label className="block text-xs font-bold text-apuf-muted uppercase tracking-wide mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-apuf-blue flex items-center justify-center transition-colors font-bold"
                >
                  <Minus size={16}/>
                </button>
                <span className="w-12 text-center font-bold text-xl">{quantidade}</span>
                <button
                  onClick={() => setQuantidade(q => Math.min(produto.estoque, q + 1))}
                  disabled={quantidade >= produto.estoque}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-apuf-blue flex items-center justify-center transition-colors font-bold disabled:opacity-40"
                >
                  <Plus size={16}/>
                </button>
                <span className="text-apuf-muted text-sm ml-1">
                  Subtotal: <strong className="text-apuf-blue">R$ {(produto.preco * quantidade).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAdd}
              disabled={esgotado}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all ${
                esgotado
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-apuf-blue hover:bg-apuf-blue-mid text-white hover:-translate-y-0.5 hover:shadow-lift'
              }`}
            >
              <ShoppingCart size={18}/>
              {esgotado ? 'Esgotado' : noCarrinho ? 'Adicionar mais' : 'Adicionar ao carrinho'}
            </button>

            <button
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-apuf-blue text-apuf-muted hover:text-apuf-blue transition-all"
              title="Compartilhar"
            >
              <Share2 size={16}/>
            </button>
          </div>

          {noCarrinho && (
            <Link
              to="/carrinho"
              className="mt-3 text-center text-sm text-apuf-green font-bold hover:underline"
            >
              ✓ {noCarrinho.quantity}x no carrinho — Ver carrinho →
            </Link>
          )}
        </div>
      </div>

      {/* Related products */}
      {relacionados.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-apuf-text mb-6">
            Mais {produto.categoria === 'KITS' ? 'Kits' : 'da mesma categoria'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relacionados.map(p => (
              <Link
                key={p.id}
                to={`/produto/${p.id}`}
                className="card p-4 hover:-translate-y-1 transition-all hover:shadow-lift"
              >
                <div className="h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-xl mb-3">
                  {p.imagemUrl
                    ? <img src={p.imagemUrl} alt={p.nome} className="w-full h-full object-cover rounded-xl"/>
                    : CAT_EMOJI[p.categoria]
                  }
                </div>
                <div className="font-bold text-sm text-apuf-text">{p.nome}</div>
                <div className="text-apuf-blue font-extrabold mt-1">R$ {p.preco.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="mt-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-apuf-muted hover:text-apuf-blue transition-colors font-semibold text-sm">
          <ArrowLeft size={16}/> Voltar para produtos
        </button>
      </div>
    </div>
  )
}
