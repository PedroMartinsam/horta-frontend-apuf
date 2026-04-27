import { ShoppingCart, AlertTriangle, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'
import { useState } from 'react'

const CAT_EMOJI = { VERDURAS: '🥬', LEGUMES: '🥕' }
const CAT_COLORS = {
  VERDURAS: 'bg-green-100 text-green-700',
  LEGUMES: 'bg-orange-100 text-orange-700',
}

function StockBadge({ estoque }) {
  if (estoque === 0) {
    return <span className="badge bg-red-100 text-red-700">Esgotado</span>
  }

  if (estoque <= 5) {
    return (
      <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
        <AlertTriangle size={10} /> Últimas unidades
      </span>
    )
  }

  return null
}

export default function ProductCard({ produto }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const [added, setAdded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false) // ✅ CORREÇÃO

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(produto)
    toast.success(`${produto.nome} adicionado!`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const esgotado = produto.estoque === 0

  const hasImage = !!produto.imagemUrl
  const imageSrc = produto.imagemUrl

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="card flex flex-col hover:-translate-y-1 transition-all duration-200 hover:shadow-lift group"
    >
      {/* IMAGE */}
      <div
        className={`relative h-40 flex items-center justify-center text-5xl overflow-hidden ${esgotado ? 'opacity-60' : ''
          }`}
        style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}
      >
        {hasImage && !imgError ? (
          <>
            {!imgLoaded && (
  <div className="absolute inset-0 bg-green-100" />
)}
            <img
  src={produto.imagemUrl}
  alt={produto.nome}
  
  onLoad={() => setImgLoaded(true)}   // 👈 ISSO FALTAVA
  onError={() => setImgError(true)}
  className="w-full h-full object-cover"
/>
          </>
        ) : (
          <span className="group-hover:scale-110 transition-transform duration-200">
            {CAT_EMOJI[produto.categoria] || '🌿'}
          </span>
        )}

        {/* CATEGORIA */}
        <span
          className={`absolute top-2 left-2 badge text-[10px] font-bold ${CAT_COLORS[produto.categoria] || 'bg-gray-100 text-gray-600'
            }`}
        >
          {produto.categoria}
        </span>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="bg-white/90 text-apuf-blue text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Eye size={12} /> Ver detalhes
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-4">
        <StockBadge estoque={produto.estoque} />

        <h3 className="font-bold text-apuf-text text-base mt-1 leading-tight">
          {produto.nome}
        </h3>

        <p className="text-apuf-muted text-xs mt-1 leading-relaxed line-clamp-2 flex-1">
          {produto.descricao}
        </p>

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <div className="text-apuf-blue font-extrabold text-xl">
              R$ {produto.preco.toFixed(2)}
            </div>
            <div className="text-gray-400 text-[11px] font-semibold">
              {produto.unidade || 'por unidade'}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={esgotado}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${added
                ? 'bg-green-500 text-white scale-95'
                : esgotado
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-apuf-blue hover:bg-apuf-blue-mid text-white hover:-translate-y-0.5'
              }`}
          >
            <ShoppingCart size={14} />
            {added ? '✓' : esgotado ? '—' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  )
}