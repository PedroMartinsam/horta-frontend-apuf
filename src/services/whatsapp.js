const ADMIN_PHONE = import.meta.env.VITE_WHATSAPP_ADMIN || '5517991324217'

export function gerarMensagemPedido(items, total, cliente) {
  const linhas = items.map(i =>
    `• ${i.nome} (${i.quantity}x) – R$ ${(i.preco * i.quantity).toFixed(2)}`
  ).join('\n')

  const msg = `
🌿 *Novo Pedido – APUF Feira Digital*

*Cliente:* ${cliente.nome}
*Telefone:* ${cliente.telefone}
*Endereço:* ${cliente.rua}, ${cliente.numero} – ${cliente.bairro}
${cliente.referencia ? `*Referência:* ${cliente.referencia}` : ''}

*Itens do Pedido:*
${linhas}

*Total:* R$ ${total.toFixed(2)}

_Pedido realizado em ${new Date().toLocaleString('pt-BR')}_
  `.trim()

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${ADMIN_PHONE}?text=${encoded}`
}

export function abrirWhatsApp(items, total, cliente) {
  const url = gerarMensagemPedido(items, total, cliente)
  window.open(url, '_blank')
}
