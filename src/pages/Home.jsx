import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Truck, ShieldCheck, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { produtosService } from '../services'

const CATEGORIES = [
]

const DIFERENCIAIS = [
  { icon: <Leaf size={28}/>, title: 'Produção Local', desc: 'Direto dos produtores urbanos de Fernandópolis' },
  { icon: <Truck size={28}/>, title: 'Entrega Rápida', desc: 'Produtos frescos na sua porta' },
  { icon: <ShieldCheck size={28}/>, title: 'Qualidade Garantida', desc: 'Selecionados com cuidado e carinho' },
  { icon: <Star size={28}/>, title: 'Preço Justo', desc: 'Sem intermediários, mais valor para você' },
]

export default function Home() {
  const [kitSemana, setKitSemana] = useState(null)
  const [destaques, setDestaques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const { data } = await produtosService.listar({ ativo: true, limit: 8 })
        const kits = data.filter(p => p.categoria === 'KITS')
        if (kits.length > 0) setKitSemana(kits[0])
        setDestaques(data.filter(p => p.categoria !== 'KITS').slice(0, 4))
      } catch {
        // fallback mock
        
        setKitSemana({ id:5, nome:'Kit Verde Semana', categoria:'KITS', preco:35.00, descricao:'Alface, couve, espinafre, rúcula, cebolinha e salsinha. Tudo fresquinho pra semana!', estoque:10, unidade:'kit semanal' })
      } finally { setLoading(false) }
    }
    carregarDados()
    
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a3fa0 0%, #1e50c8 45%, #1b5e20 100%)',
        minHeight: '400px',
      }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5"/>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5"/>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
              🌿 Horta Delivery · Fernandópolis - SP
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Do produtor<br/>
              <span className="text-amber-300">para a sua mesa</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
              Cultivado com carinho pelos produtores urbanos de Fernandópolis. Peça agora e receba em casa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/produtos" className="btn-primary flex items-center gap-2">
                Ver Produtos <ArrowRight size={16}/>
              </Link>
              <Link to="/sobre" className="btn-secondary">
                Conheça a APUF
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {[
              
            ].map((s, i) => (
              <div key={i} className="bg-white/15 border border-white/20 rounded-2xl p-4 text-center text-white">
                <div className="font-display font-bold text-2xl">{s.val}</div>
                <div className="text-white/70 text-xs mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.key}
                to={`/produtos?categoria=${cat.key}`}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-gradient-to-br ${cat.color} text-white font-bold text-sm hover:scale-105 transition-transform shadow-card`}
              >
                <span className="text-4xl">{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-apuf-text">Destaques da Semana</h2>
            <p className="text-apuf-muted text-sm mt-1">Fresquinhos, colhidos pra você</p>
          </div>
          <Link to="/produtos" className="text-apuf-blue font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ArrowRight size={14}/>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-gray-100"/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destaques.map(p => <ProductCard key={p.id} produto={p}/>)}
          </div>
        )}
      </section>

      {/* Diferenciais */}
      <section className="bg-apuf-blue py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-2xl text-white text-center mb-10">Por que comprar da APUF?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DIFERENCIAIS.map((d, i) => (
              <div key={i} className="flex flex-col items-center text-center text-white">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-3 text-amber-300">
                  {d.icon}
                </div>
                <div className="font-bold mb-1">{d.title}</div>
                <div className="text-white/70 text-sm">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
