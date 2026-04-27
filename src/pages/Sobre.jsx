import { Link } from 'react-router-dom'
import { Leaf, Users, Award, Heart } from 'lucide-react'


export default function Sobre() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-apuf-blue py-16 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-4">Sobre a APUF</h1>
          <p className="text-white/80 text-lg leading-relaxed italic">
            “Da terra para a mesa, com responsabilidade, qualidade e orgulho de nossas raízes.”
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Mission */}
        <section className="mb-14">
          <h2 className="font-display text-2xl text-apuf-blue mb-4">Nossa Missão</h2>
          <p className="text-apuf-muted leading-relaxed text-lg mb-4">
            A <strong className="text-apuf-text">APUF – Associação dos Produtores Urbanos de Fernandópolis</strong> foi criada
            com o propósito de unir produtores locais, fortalecer a agricultura urbana e levar alimentos frescos
            e saudáveis para as famílias de Fernandópolis - SP.
          </p>
          <p className="text-apuf-muted leading-relaxed">
            Acreditamos que encurtar o caminho entre quem produz e quem consome é um ato de responsabilidade social,
            que beneficia produtores, consumidores e toda a comunidade.
          </p>
        </section>

        {/* Values */}
        <section className="mb-14">
          <h2 className="font-display text-2xl text-apuf-blue mb-6">Nossos Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: <Leaf size={24}/>, title: 'Sustentabilidade', color: 'bg-green-50 text-green-600' },
              { icon: <Users size={24}/>, title: 'Comunidade', color: 'bg-blue-50 text-blue-600' },
              { icon: <Award size={24}/>, title: 'Qualidade', color: 'bg-amber-50 text-amber-600' },
              { icon: <Heart size={24}/>, title: 'Comprometimento', color: 'bg-red-50 text-red-500' },
            ].map((v, i) => (
              <div key={i} className={`${v.color} rounded-2xl p-5 flex flex-col items-center text-center gap-3`}>
                {v.icon}
                <span className="font-bold text-sm">{v.title}</span>
              </div>
            ))}
          </div>
        </section>

       {/* Social Responsibility Seal */}
<section className="bg-apuf-blue rounded-2xl p-8 text-white text-center">
  <h2 className="font-display text-2xl mb-3">
    Empresa Socialmente Responsável
  </h2>

  <p className="text-white/80 leading-relaxed max-w-xl mx-auto mb-6">
    A APUF é certificada como Empresa Socialmente Responsável 2025/2026,
    reafirmando nosso compromisso com o desenvolvimento humano, econômico
    e ambiental de Fernandópolis.
  </p>

  {/* 👇 IMAGEM AQUI */}
  <img
    src="/src/assets/cert.png"  // ou o caminho correto
    alt="Selo de responsabilidade"
    className="mx-auto w-auto h-auto object-contain"
  />
</section>

        {/* Back */}
        <div className="mt-12 flex justify-center">
          <Link to="/produtos" className="flex items-center gap-2 text-apuf-muted hover:text-apuf-blue transition-colors font-semibold text-sm">
            Voltar para Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
