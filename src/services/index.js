import api from './api'

export const produtosService = {
  listar: (params) => api.get('/produtos', { params }),
  buscar: (id) => api.get(`/produtos/${id}`),
  criar:  (data) => api.post('/produtos', data),
  atualizar: (id, data) => api.put(`/produtos/${id}`, data),
  deletar: (id) => api.delete(`/produtos/${id}`),

  // ✅ Envia multipart/form-data corretamente
  // O backend recebe @RequestParam("imagem") MultipartFile
  // e retorna ProdutoDTO.Response com imagemUrl preenchida
  uploadImagem: (id, file) => {
    const form = new FormData()
    form.append('imagem', file)
    // Não definir Content-Type manualmente — o browser define com boundary correto
    return api.post(`/produtos/${id}/imagem`, form)
  },

  categorias: () => api.get('/produtos/categorias'),
}

export const pedidosService = {
  criar: (data) => api.post('/pedidos', data),
  listar: (params) => api.get('/pedidos', { params }),
  buscar: (id) => api.get(`/pedidos/${id}`),
  atualizarStatus: (id, status) => api.patch(`/pedidos/${id}/status`, { status }),
  meusPedidos: () => api.get('/pedidos/meus'),
}

export const dashboardService = {
  metricas:    () => api.get('/dashboard/metricas'),
  vendasPorDia: () => api.get('/dashboard/vendas-por-dia'),
  maisVendidos: () => api.get('/dashboard/mais-vendidos'),
}

export const authService = {
  login:    (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me:       () => api.get('/auth/me'),
}
