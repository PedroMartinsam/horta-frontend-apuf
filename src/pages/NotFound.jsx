import { Link } from 'react-router-dom'
import { Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌿</div>
        <h1 className="font-display text-6xl text-apuf-blue font-bold mb-2">404</h1>
        <h2 className="font-display text-2xl text-apuf-text mb-4">Página não encontrada</h2>
        <p className="text-apuf-muted leading-relaxed mb-8">
          Parece que esta página saiu da feira! Que tal voltar para o início ou dar uma olhada nos nossos produtos fresquinhos?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home size={16}/> Voltar ao início
          </Link>
          <Link to="/produtos" className="btn-secondary flex items-center gap-2">
            <ShoppingBag size={16}/> Ver produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
