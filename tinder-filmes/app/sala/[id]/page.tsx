'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, Users, Crown } from 'lucide-react'
import React from 'react'
import { buscarSala } from '../../services/api'

// Tipos
type Participante = {
  id: string
  nome: string
  dono: boolean
  online: boolean
}

type Sala = {
  id: string
  filtros: {
    generos: string[]
    streamings: string[]
  }
  participantes: Participante[]
  status: string
}

// Mock usado enquanto backend não está pronto
const SALA_MOCK: Sala = {
  id: 'XKTZ91',
  filtros: {
    generos: ['Action', 'Comedy'],
    streamings: ['Netflix', 'Prime'],
  },
  participantes: [
    { id: '1', nome: 'Jogador 1', dono: true,  online: true  },
    { id: '2', nome: 'Jogador 2', dono: false, online: true  },
    { id: '3', nome: 'Jogador 3', dono: false, online: false },
  ],
  status: 'lobby'
}

export default function Lobby({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const salaId = id.toUpperCase()
  const link = `${window.location.origin}/sala/${salaId}`

  const [sala, setSala] = useState<Sala | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [copiouCodigo, setCopiouCodigo] = useState(false)
  const [copiouLink, setCopiouLink] = useState(false)

  // Busca dados da sala — usa mock se backend não responder
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarSala(salaId)
        setSala(dados)
      } catch {
        console.warn('Backend indisponível, usando mock')
        setSala({ ...SALA_MOCK, id: salaId })
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [salaId])

  function copiar(texto: string, tipo: 'codigo' | 'link') {
    navigator.clipboard.writeText(texto)
    if (tipo === 'codigo') {
      setCopiouCodigo(true)
      setTimeout(() => setCopiouCodigo(false), 2000)
    } else {
      setCopiouLink(true)
      setTimeout(() => setCopiouLink(false), 2000)
    }
  }

  function iniciarSessao() {
    router.push(`/sala/${salaId}/party`)
  }

  // Tela de carregando
  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #2D2D44', borderTop: '3px solid #A855F7',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>Carregando sala...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!sala) return null

  return (
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100vh' }}>

      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 4 }}>Sala criada com sucesso 🎬</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Aguardando jogadores</h1>
      </motion.div>

      {/* Código da sala */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#1E1E2E', borderRadius: 16, padding: '20px', border: '1px solid #2D2D44' }}>

        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Código da sala
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '0.2em', color: '#A855F7' }}>
            {salaId}
          </span>
          <button onClick={() => copiar(salaId, 'codigo')} style={{
            background: copiouCodigo ? '#7C3AED22' : '#2D2D44',
            border: `1px solid ${copiouCodigo ? '#A855F7' : '#3D3D54'}`,
            borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: copiouCodigo ? '#A855F7' : '#9CA3AF', fontSize: 12,
            fontFamily: 'Poppins, sans-serif', fontWeight: 500,
            transition: 'all 0.2s'
          }}>
            {copiouCodigo ? <Check size={14} /> : <Copy size={14} />}
            {copiouCodigo ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0D0D1A', borderRadius: 10, padding: '10px 14px', border: '1px solid #2D2D44' }}>
          <span style={{ color: '#6B7280', fontSize: 12, fontFamily: 'monospace' }}>{link}</span>
          <button onClick={() => copiar(link, 'link')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: copiouLink ? '#A855F7' : '#6B7280',
            transition: 'color 0.2s'
          }}>
            {copiouLink ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: '#1E1E2E', borderRadius: 16, padding: '16px 20px', border: '1px solid #2D2D44' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Filtros
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[...sala.filtros.generos, ...sala.filtros.streamings].map(tag => (
            <span key={tag} style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500,
              background: '#7C3AED22', border: '1px solid #7C3AED44', color: '#A855F7'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Participantes */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: '#1E1E2E', borderRadius: 16, padding: '16px 20px', border: '1px solid #2D2D44' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Users size={14} color="#9CA3AF" />
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            Participantes ({sala.participantes.length})
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sala.participantes.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0
              }}>
                {p.nome.charAt(p.nome.length - 1)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F0' }}>{p.nome}</span>
                  {p.dono && <Crown size={12} color="#F59E0B" />}
                </div>
                <span style={{ fontSize: 11, color: p.online ? '#34D399' : '#6B7280' }}>
                  {p.online ? '● Online' : '○ Aguardando...'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Botão iniciar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <button onClick={iniciarSessao} style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Iniciar Sessão 🎬
        </button>
        <p style={{ textAlign: 'center', color: '#4B5563', fontSize: 12, marginTop: 10 }}>
          Apenas o dono da sala pode iniciar
        </p>
      </motion.div>

    </div>
  )
}