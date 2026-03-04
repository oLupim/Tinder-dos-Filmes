// URL do backend Go — muda para a URL real quando estiver no ar
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ── CRIAR SALA ──
export async function criarSala(generos: string[], streamings: string[]) {
  const res = await fetch(`${API_URL}/api/sala`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ generos, streamings })
  })

  if (!res.ok) throw new Error('Erro ao criar sala')

  const data = await res.json()
  // Espera receber: { salaId: "XKTZ91" }
  return data as { salaId: string }
}

// ── BUSCAR DADOS DA SALA ──
export async function buscarSala(salaId: string) {
  const res = await fetch(`${API_URL}/api/sala/${salaId}`)

  if (!res.ok) throw new Error('Sala não encontrada')

  const data = await res.json()
  // Espera receber: { id, filtros, participantes, status }
  return data
}

// ── ENTRAR NA SALA ──
export async function entrarSala(salaId: string) {
  const res = await fetch(`${API_URL}/api/sala/${salaId}/entrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) throw new Error('Erro ao entrar na sala')

  const data = await res.json()
  // Espera receber: { userId, token }
  return data as { userId: string, token: string }
}