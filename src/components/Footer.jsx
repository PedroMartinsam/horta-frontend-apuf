import { Link } from 'react-router-dom'
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react'

// Responsabilidade Social Seal (based on uploaded image)
function SeloResponsabilidade() {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/src/assets/cert.png"   coloque sua imagem aqui
        alt="Selo de responsabilidade"
        className="w-40 h-auto object-contain"
      />
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="font-display font-bold text-xl mb-2 text-white">APUF</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Associação dos Produtores Urbanos de Fernandópolis - SP
          </p>
          <p className="text-gray-500 text-xs italic">“O Senhor é o meu pastor; nada me faltará.”</p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com/apuf.10823/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Navegação</h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Início' },
              { to: '/produtos', label: 'Produtos' },
              { to: '/sobre', label: 'Sobre a APUF' },
              { to: '/certificacao', label: 'Certificação Social' },
              { to: '/contato', label: 'Contato' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Contato</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-gray-400 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-apuf-orange" />
              Fernandópolis – SP
            </li>
            <li className="flex items-start gap-2 text-gray-400 text-sm">
              <Phone size={16} className="mt-0.5 shrink-0 text-apuf-orange" />
              (17) 99132-6851
            </li>
          </ul>
        </div>

        {/* Seal */}
        <div className="flex flex-col items-center md:items-end">
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 self-start md:self-end">Certificação</h4>
          <SeloResponsabilidade />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-600 text-xs">
          <span>© {new Date().getFullYear()} APUF – Todos os direitos reservados</span>
         
        </div>
      </div>
    </footer>
  )
}
