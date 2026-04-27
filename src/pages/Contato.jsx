import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react'

export default function Contato() {
  const ADMIN_PHONE = import.meta.env.VITE_WHATSAPP_ADMIN || '5517991326851'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="page-title mb-1">Fale Conosco</h1>
      <p className="text-apuf-muted text-sm mb-10">Entre em contato com a APUF</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[
            { icon: <MapPin size={20} className="text-apuf-orange"/>, title: 'Localização', text: 'Fernandópolis – SP' },
            { icon: <Phone size={20} className="text-apuf-orange"/>, title: 'Telefone', text: '(17) 99132-6851' },
            { icon: <Clock size={20} className="text-apuf-orange"/>, title: 'Atendimento', text: 'Seg a Sáb, 7h às 18h' },
          ].map((c, i) => (
            <div key={i} className="flex gap-4 p-5 card">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">{c.icon}</div>
              <div>
                <div className="font-bold text-sm text-apuf-text">{c.title}</div>
                <div className="text-apuf-muted text-sm mt-0.5">{c.text}</div>
              </div>
            </div>
          ))}

          <a
            href={`https://wa.me/${ADMIN_PHONE}?text=Olá! Vim pelo site da APUF e gostaria de mais informações.`}
            target="_blank"
            rel="noreferrer"
            className="btn-wpp"
          >
            <MessageCircle size={20}/>
            Falar no WhatsApp
          </a>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg mb-4 text-apuf-text">Envie uma mensagem</h3>
          <div className="space-y-3">
            <input className="input" type="text" placeholder="Seu nome"/>
            <input className="input" type="email" placeholder="Seu e-mail"/>
            <input className="input" type="tel" placeholder="Seu WhatsApp"/>
            <textarea className="input resize-none" rows={4} placeholder="Sua mensagem..."/>
            <button className="btn-primary w-full">Enviar Mensagem</button>
          </div>
        </div>
      </div>
    </div>
  )
}
