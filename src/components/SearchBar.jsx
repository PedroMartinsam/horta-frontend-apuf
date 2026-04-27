import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { produtosService } from '../services'
import { useDebounce } from '../hooks'

const CAT_EMOJI = { VERDURAS: '🥬', LEGUMES: '🥕' }

const MOCK_PRODUTOS = [
  { id:1, nome:'Alface Crespa', categoria:'VERDURAS', preco:3.50 },
  { id:2, nome:'Couve Manteiga', categoria:'VERDURAS', preco:4.00 },
  { id:5, nome:'Cenoura', categoria:'LEGUMES', preco:4.90 },
  { id:9, nome:'Laranja Pera', categoria:'FRUTAS', preco:5.50 },
  { id:12, nome:'Kit Verde Semana', categoria:'KITS', preco:35.00 },
  { id:13, nome:'Kit Salada Completa', categoria:'KITS', preco:28.00 },
  { id:6, nome:'Tomate Italiano', categoria:'LEGUMES', preco:6.00 },
  { id:3, nome:'Rúcula', categoria:'VERDURAS', preco:3.00 },
]

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return }

    const search = async () => {
      setLoading(true)
      try {
        const { data } = await produtosService.listar({ busca: debouncedQuery, ativo: true })
        setResults(data.slice(0, 6))
      } catch {
        // Fallback mock search
        const filtered = MOCK_PRODUTOS.filter(p =>
          p.nome.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).slice(0, 6)
        setResults(filtered)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery])

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar produtos frescos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 border-2 border-apuf-blue rounded-xl text-sm font-semibold focus:outline-none bg-white shadow-lift"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lift border border-gray-100 z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-apuf-muted text-sm">Buscando...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-apuf-muted text-sm">
              Nenhum produto encontrado para "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-apuf-muted uppercase tracking-wide border-b border-gray-100">
                {results.length} resultado{results.length !== 1 ? 's' : ''}
              </div>
              {results.map(p => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-2xl w-8 text-center">{CAT_EMOJI[p.categoria] || '🌿'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-apuf-text truncate">{p.nome}</div>
                    <div className="text-xs text-apuf-muted">{p.categoria}</div>
                  </div>
                  <div className="font-extrabold text-apuf-blue text-sm shrink-0">
                    R$ {p.preco.toFixed(2)}
                  </div>
                </Link>
              ))}
              <Link
                to={`/produtos?busca=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block px-4 py-3 text-center text-apuf-blue text-sm font-bold bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Ver todos os resultados →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
