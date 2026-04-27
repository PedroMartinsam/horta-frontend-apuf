import { Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'

const CRITERIOS = [
  { titulo: 'Produção Local Sustentável', desc: 'Cultivo sem agrotóxicos excessivos, uso consciente da água e da terra urbana de Fernandópolis.' },
  { titulo: 'Geração de Renda Local', desc: 'Valorização dos produtores urbanos, garantindo preço justo e escoamento direto da produção.' },
  { titulo: 'Segurança Alimentar', desc: 'Fornecimento de alimentos frescos, saudáveis e acessíveis à comunidade local.' },
  { titulo: 'Educação e Conscientização', desc: 'Promoção de práticas de alimentação saudável e agricultura urbana para escolas e famílias.' },
  { titulo: 'Responsabilidade Ambiental', desc: 'Redução do desperdício, uso de embalagens reutilizáveis e incentivo à compostagem.' },
  { titulo: 'Inclusão Social', desc: 'Integração de pequenos produtores, idosos, pessoas com deficiência e grupos vulneráveis.' },
]

// SVG do Selo de Responsabilidade Social (fiel ao original)
function SeloGrande() {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 300" className="w-72 h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Triângulo externo */}
        <polygon points="160,8 312,290 8,290" fill="#1a3fa0"/>
        {/* Triângulo interno branco */}
        <polygon points="160,40 278,265 42,265" fill="white"/>

        {/* Textos nas laterais do triângulo */}
        <defs>
          <path id="side-left"  d="M160,15 L18,282"/>
          <path id="side-right" d="M160,15 L302,282"/>
        </defs>
        <text fontFamily="'Playfair Display', Georgia, serif" fontWeight="800" fontSize="13" fill="white" letterSpacing="0.5">
          <textPath href="#side-left" startOffset="5%">Empresa Socialmente</textPath>
        </text>
        <text fontFamily="'Playfair Display', Georgia, serif" fontWeight="800" fontSize="13" fill="white" letterSpacing="0.5">
          <textPath href="#side-right" startOffset="5%">Responsável</textPath>
        </text>

        {/* Círculo do logo */}
        <circle cx="160" cy="148" r="42" fill="#1a3fa0" stroke="#e65100" strokeWidth="4"/>

        {/* Sol estilizado */}
        <ellipse cx="160" cy="148" rx="16" ry="13" fill="#e65100"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
          <line key={i}
            x1={160 + 16 * Math.cos((deg - 90) * Math.PI / 180)}
            y1={148 + 13 * Math.sin((deg - 90) * Math.PI / 180)}
            x2={160 + 26 * Math.cos((deg - 90) * Math.PI / 180)}
            y2={148 + 26 * Math.sin((deg - 90) * Math.PI / 180)}
            stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"
          />
        ))}
        <path d="M125 158 Q160 150 195 158" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M129 163 Q160 156 191 163" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Texto APUF */}
        <text x="160" y="172" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="12" fill="white">APUF</text>

        {/* Texto interno */}
        <text x="160" y="210" textAnchor="middle" fontFamily="'Nunito', Arial" fontWeight="700" fontSize="9" fill="#1a3fa0">Associação dos Produtores Urbanos</text>
        <text x="160" y="222" textAnchor="middle" fontFamily="'Nunito', Arial" fontWeight="700" fontSize="9" fill="#1a3fa0">Fernandópolis - SP</text>
        <text x="160" y="234" textAnchor="middle" fontFamily="'Nunito', Arial" fontWeight="600" fontSize="8.5" fill="#5a6a7a">"Saudade de minha terra"</text>
        <text x="160" y="252" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="14" fill="#1a3fa0">2025/2026</text>
      </svg>

      {/* Placa inferior */}
      <div className="bg-apuf-blue rounded-xl px-8 py-4 text-center -mt-3 shadow-xl max-w-xs w-full">
        <div className="text-white font-extrabold text-base tracking-widest uppercase leading-tight">Responsabilidade</div>
        <div className="text-white font-extrabold text-base tracking-widest uppercase leading-tight">Social das Empresas</div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-px bg-white/30 flex-1"/>
          <span className="text-blue-200 text-xs font-semibold">certificação · APUF</span>
          <div className="h-px bg-white/30 flex-1"/>
        </div>
      </div>
    </div>
  )
}

export default function Certificacao() {
  return null
}
