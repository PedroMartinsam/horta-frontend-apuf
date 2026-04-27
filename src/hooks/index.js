import { useState, useEffect, useCallback } from 'react'
import { produtosService } from '../services'

export function useProdutos(filtros = {}) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await produtosService.listar(filtros)
      setProdutos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => { carregar() }, [carregar])

  return { produtos, loading, error, recarregar: carregar }
}

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function usePaginacao(total, porPagina = 12) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.ceil(total / porPagina)
  const irPara = (p) => setPagina(Math.max(1, Math.min(p, totalPaginas)))
  return { pagina, totalPaginas, irPara, setPagina }
}
