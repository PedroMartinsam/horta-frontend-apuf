import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Upload, X, Check, Image, AlertCircle } from 'lucide-react'
import { produtosService } from '../../services'

const CATEGORIAS = ['VERDURAS', 'LEGUMES', 'FRUTAS', 'KITS']
const CAT_EMOJI   = { VERDURAS:'🥬', LEGUMES:'🥕'}

const EMPTY_FORM = {
  nome:'', descricao:'', preco:'', categoria:'VERDURAS',
  estoque:'', unidade:'kg', ativo:true, imagemUrl:''
}

// ─── Upload de imagem ────────────────────────────────────────────────────────
// Estratégia corrigida:
//  1. Usuário escolhe arquivo → gera preview local (base64) imediatamente
//  2. Ao salvar, se o produto já existir: envia multipart via /imagem endpoint
//     Se for produto NOVO: salva o produto primeiro, depois envia a imagem
//  3. A imagemUrl retornada pelo backend é salva no estado
// ─────────────────────────────────────────────────────────────────────────────

function ProdutoModal({ produto, onSave, onClose }) {
  const [form, setForm]           = useState(
    produto
      ? { ...produto, preco: String(produto.preco), estoque: String(produto.estoque) }
      : EMPTY_FORM
  )
  const [imgPreview, setImgPreview] = useState(produto?.imagemUrl || '')
  const [imgFile, setImgFile]       = useState(null)   // arquivo pendente
  const [loading, setLoading]       = useState(false)
  const [imgStatus, setImgStatus]   = useState('')      // '', 'uploading', 'ok', 'error'
  const fileInputRef                = useRef(null)

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  // Seleciona arquivo → mostra preview imediatamente, guarda File para upload posterior
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Valida tamanho (máx 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5 MB.')
      return
    }

    setImgFile(file)
    setImgStatus('')

    // Preview local imediato
    const reader = new FileReader()
    reader.onload = ev => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // Envia imagem para o backend e retorna a URL do Cloudinary
  const enviarImagem = async (produtoId, file) => {
    setImgStatus('uploading')
    try {
      const { data } = await produtosService.uploadImagem(produtoId, file)
      // O backend retorna ProdutoDTO.Response que tem imagemUrl
      const url = data.imagemUrl || data.url || ''
      setImgPreview(url)
      setImgStatus('ok')
      return url
    } catch (err) {
      console.error('Erro no upload da imagem:', err)
      setImgStatus('error')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        preco:   parseFloat(form.preco),
        estoque: parseInt(form.estoque),
        // Mantém imagemUrl atual no payload (não apaga imagem ao editar)
        imagemUrl: form.imagemUrl || produto?.imagemUrl || ''
      }

      let produtoSalvo

      if (produto?.id) {
        // ── EDITAR produto existente ──────────────────────────────────────
        const { data } = await produtosService.atualizar(produto.id, payload)
        produtoSalvo = data

        // Se selecionou imagem nova, envia agora
        if (imgFile) {
          const novaUrl = await enviarImagem(produto.id, imgFile)
          if (novaUrl) produtoSalvo.imagemUrl = novaUrl
        }

      } else {
        // ── CRIAR produto novo ────────────────────────────────────────────
        const { data } = await produtosService.criar(payload)
        produtoSalvo = data

        // Produto criado → agora envia a imagem com o ID real
        if (imgFile && produtoSalvo.id) {
          const novaUrl = await enviarImagem(produtoSalvo.id, imgFile)
          if (novaUrl) produtoSalvo.imagemUrl = novaUrl
        }
      }

      onSave(produtoSalvo)
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-display text-xl text-apuf-text">
            {produto ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── Área de imagem ── */}
          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-2 uppercase tracking-wide">
              Imagem do Produto
            </label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-apuf-blue transition-colors flex-shrink-0 group relative"
              >
                {imgPreview ? (
                  <>
                    <img
                      src={imgPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImgPreview('')}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={18} className="text-white"/>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Image size={24} className="text-gray-300 mx-auto mb-1"/>
                    <span className="text-[10px] text-gray-400 font-semibold">Clique para<br/>adicionar</span>
                  </div>
                )}
              </div>

              {/* Info + botão */}
              <div className="flex flex-col gap-2 justify-center flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors w-full justify-center"
                >
                  <Upload size={15}/>
                  {imgFile ? 'Trocar imagem' : 'Escolher imagem'}
                </button>

                {imgFile && (
                  <div className="text-xs text-apuf-muted font-semibold truncate px-1">
                    📎 {imgFile.name}
                  </div>
                )}

                {/* Status do upload */}
                {imgStatus === 'uploading' && (
                  <div className="flex items-center gap-1.5 text-xs text-apuf-blue font-semibold px-1">
                    <span className="animate-spin">⏳</span> Enviando imagem...
                  </div>
                )}
                {imgStatus === 'ok' && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold px-1">
                    <Check size={12}/> Imagem salva com sucesso!
                  </div>
                )}
                {imgStatus === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold px-1">
                    <AlertCircle size={12}/> Erro no upload. Verifique o Cloudinary.
                  </div>
                )}

                <p className="text-[11px] text-gray-400 px-1">
                  JPG, PNG ou WEBP · máx. 5 MB
                </p>
              </div>
            </div>

            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* ── Nome ── */}
          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
              Nome do Produto *
            </label>
            <input
              required
              className="input"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Ex: Alface Crespa"
            />
          </div>

          {/* ── Descrição ── */}
          <div>
            <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
              Descrição
            </label>
            <textarea
              rows={3}
              className="input resize-none"
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Breve descrição do produto..."
            />
          </div>

          {/* ── Preço + Unidade ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
                Preço (R$) *
              </label>
              <input
                required type="number" step="0.01" min="0.01"
                className="input"
                value={form.preco}
                onChange={e => set('preco', e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
                Unidade
              </label>
              <input
                className="input"
                value={form.unidade}
                onChange={e => set('unidade', e.target.value)}
                placeholder="kg, maço, unid..."
              />
            </div>
          </div>

          {/* ── Categoria + Estoque ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
                Categoria *
              </label>
              <select
                required className="input"
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-apuf-muted mb-1.5 uppercase tracking-wide">
                Estoque *
              </label>
              <input
                required type="number" min="0"
                className="input"
                value={form.estoque}
                onChange={e => set('estoque', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* ── Toggle ativo ── */}
          <div className="flex items-center gap-3 py-1">
            <button
              type="button"
              onClick={() => set('ativo', !form.ativo)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.ativo ? 'bg-apuf-green' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.ativo ? 'left-6' : 'left-1'}`}/>
            </button>
            <span className="text-sm font-semibold text-apuf-muted">
              {form.ativo ? '✅ Produto visível na loja' : '🚫 Produto oculto na loja'}
            </span>
          </div>

          {/* ── Botões ── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary text-sm py-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary text-sm py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {imgFile ? 'Salvando e enviando imagem...' : 'Salvando...'}
                </>
              ) : (
                <><Check size={15}/> Salvar Produto</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Tabela principal ────────────────────────────────────────────────────────

const MOCK_PRODUTOS = [
  { id:1, nome:'Alface Crespa',    categoria:'VERDURAS', preco:3.50,  estoque:20, ativo:true, unidade:'por pé', imagemUrl:'' },
  { id:2, nome:'Cenoura',          categoria:'LEGUMES',  preco:4.90,  estoque:15, ativo:true, unidade:'500g',   imagemUrl:'' },
  { id:3, nome:'Laranja Pera',     categoria:'FRUTAS',   preco:5.50,  estoque:0,  ativo:true, unidade:'kg',     imagemUrl:'' },
  { id:4, nome:'Kit Verde Semana', categoria:'KITS',     preco:35.00, estoque:8,  ativo:true, unidade:'kit',    imagemUrl:'' },
]

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState(MOCK_PRODUTOS)
  const [modal, setModal]       = useState(null)   // null | 'new' | produto
  const [busca, setBusca]       = useState('')

  useEffect(() => {
    produtosService.listar()
      .then(({ data }) => setProdutos(data))
      .catch(() => {})
  }, [])

  const deletar = async (id) => {
    if (!confirm('Remover este produto permanentemente?')) return
    try {
      await produtosService.deletar(id)
      setProdutos(p => p.filter(x => x.id !== id))
    } catch {
      alert('Erro ao remover produto')
    }
  }

  // Atualiza lista sem recarregar tudo do servidor
  // (garante que a imagemUrl nova apareça imediatamente na tabela)
  const handleSave = (produtoAtualizado) => {
    setProdutos(prev => {
      const existe = prev.find(p => p.id === produtoAtualizado?.id)
      if (existe) {
        return prev.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p)
      } else {
        return produtoAtualizado ? [...prev, produtoAtualizado] : prev
      }
    })
    // Recarrega do servidor para garantir consistência
    produtosService.listar()
      .then(({ data }) => setProdutos(data))
      .catch(() => {})
    setModal(null)
  }

  const filtrados = busca
    ? produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : produtos

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="page-title mb-0">Produtos</h1>
          <p className="text-apuf-muted text-sm mt-0.5">
            {produtos.length} produto{produtos.length !== 1 ? 's' : ''} cadastrado{produtos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="input w-48 text-sm py-2"
          />
          <button
            onClick={() => setModal('new')}
            className="btn-primary flex items-center gap-2 text-sm py-2.5"
          >
            <Plus size={15}/> Novo Produto
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Produto</th>
              <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide hidden sm:table-cell">Categoria</th>
              <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Preço</th>
              <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide">Estoque</th>
              <th className="px-5 py-3 text-xs font-bold text-apuf-muted uppercase tracking-wide hidden md:table-cell">Status</th>
              <th className="px-5 py-3"/>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrados.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {/* Miniatura da imagem real ou emoji */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {p.imagemUrl
                        ? <img src={p.imagemUrl} alt={p.nome} className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }}/>
                        : CAT_EMOJI[p.categoria] || '🌿'
                      }
                    </div>
                    <span className="font-semibold text-apuf-text">{p.nome}</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="badge bg-gray-100 text-apuf-muted text-xs">{p.categoria}</span>
                </td>
                <td className="px-5 py-4 font-bold text-apuf-green">
                  R$ {p.preco.toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <span className={`badge ${
                    p.estoque === 0   ? 'bg-red-100 text-red-600' :
                    p.estoque <= 5    ? 'bg-amber-100 text-amber-600' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {p.estoque} un
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`badge ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setModal(p)}
                      className="p-2 text-gray-400 hover:text-apuf-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15}/>
                    </button>
                    <button
                      onClick={() => deletar(p.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="py-16 text-center text-apuf-muted">
            <div className="text-4xl mb-3">🌿</div>
            <p className="font-semibold">Nenhum produto encontrado</p>
            {busca && (
              <button onClick={() => setBusca('')} className="mt-2 text-apuf-blue text-sm font-bold hover:underline">
                Limpar busca
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProdutoModal
          produto={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
