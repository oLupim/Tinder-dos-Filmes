'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Heart, X, Star, Users, ChevronDown, ChevronUp } from 'lucide-react'

// Mock — depois vem do backend Go
const FILMES_MOCK = [
  {
    id: 1,
    titulo: 'Inception',
    ano: 2010,
    nota: 8.8,
    generos: ['Sci-Fi', 'Action', 'Thriller'],
    streaming: 'Netflix',
    sinopse: 'Um ladrão especializado em roubar segredos do subconsciente durante o sono recebe a missão inversa: plantar uma ideia na mente de um executivo.',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
  },
  {
    id: 2,
    titulo: 'The Dark Knight',
    ano: 2008,
    nota: 9.0,
    generos: ['Action', 'Drama'],
    streaming: 'Max',
    sinopse: 'Batman enfrenta o Coringa, um criminoso que semeia o caos em Gotham City e o força a questionar tudo em que acredita.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
  },
  {
    id: 3,
    titulo: 'Interstellar',
    ano: 2014,
    nota: 8.6,
    generos: ['Sci-Fi', 'Drama'],
    streaming: 'Prime',
    sinopse: 'Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
  },
]

const TOTAL_JOGADORES = 3

export default function Votar({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)

  const [index, setIndex] = useState(0)
  const [votados, setVotados] = useState<{ id: number, voto: 'like' | 'dislike' }[]>([])
  const [sinopseAberta, setSinopseAberta] = useState(false)
  const [match, setMatch] = useState<typeof FILMES_MOCK[0] | null>(null)
  const [jogadoresVotaram, setJogadoresVotaram] = useState(1) // simulando

  const filme = FILMES_MOCK[index]

  // Motion values para o swipe
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, -20], [1, 0])

  function votar(voto: 'like' | 'dislike') {
    const novosVotados = [...votados, { id: filme.id, voto }]
    setVotados(novosVotados)

    // Simula match se der like (para testar visualmente)
    if (voto === 'like' && index === 1) {
      setTimeout(() => setMatch(filme), 300)
      return
    }

    setTimeout(() => {
      setSinopseAberta(false)
      if (index + 1 < FILMES_MOCK.length) {
        setIndex(index + 1)
        setJogadoresVotaram(Math.floor(Math.random() * TOTAL_JOGADORES) + 1)
      }
      x.set(0)
    }, 300)
  }

  function handleDragEnd(_: never, info: { offset: { x: number } }) {
    if (info.offset.x > 100) votar('like')
    else if (info.offset.x < -100) votar('dislike')
    else x.set(0)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Sala #{id.toUpperCase()}
          </p>
          <p style={{ fontSize: 13, color: '#F0F0F0', margin: 0, fontWeight: 600, marginTop: 2 }}>
            Filme {index + 1} de {FILMES_MOCK.length}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          background: '#1E1E2E', borderRadius: 20, padding: '6px 12px', border: '1px solid #2D2D44' }}>
          <Users size={13} color="#A855F7" />
          <span style={{ fontSize: 12, color: '#A855F7', fontWeight: 600 }}>
            {jogadoresVotaram}/{TOTAL_JOGADORES}
          </span>
        </div>
      </div>

      {/* Card do filme */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={filme.id}
            style={{
              x, rotate,
              width: '100%', maxWidth: 340,
              borderRadius: 24, overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              cursor: 'grab', position: 'relative',
              border: '1px solid #2D2D44'
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {/* Poster */}
            <div style={{ position: 'relative', height: 380 }}>
              <img src={filme.poster} alt={filme.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />

              {/* Overlay gradiente */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                background: 'linear-gradient(to top, #0D0D1A, transparent)'
              }} />

              {/* LIKE overlay */}
              <motion.div style={{ opacity: likeOpacity, position: 'absolute', top: 20, left: 20 }}>
                <div style={{ border: '3px solid #34D399', borderRadius: 8, padding: '4px 12px' }}>
                  <span style={{ color: '#34D399', fontWeight: 800, fontSize: 22 }}>LIKE</span>
                </div>
              </motion.div>

              {/* NOPE overlay */}
              <motion.div style={{ opacity: dislikeOpacity, position: 'absolute', top: 20, right: 20 }}>
                <div style={{ border: '3px solid #F87171', borderRadius: 8, padding: '4px 12px' }}>
                  <span style={{ color: '#F87171', fontWeight: 800, fontSize: 22 }}>NOPE</span>
                </div>
              </motion.div>

              {/* Info sobre o poster */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#fff' }}>{filme.titulo}</h2>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: '2px 0 0' }}>{filme.ano}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4,
                    background: '#7C3AED', borderRadius: 20, padding: '4px 10px' }}>
                    <Star size={12} color="#FCD34D" fill="#FCD34D" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{filme.nota}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info abaixo do poster */}
            <div style={{ background: '#1A1A2E', padding: '14px 16px' }}>

              {/* Gêneros e streaming */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {filme.generos.map(g => (
                    <span key={g} style={{
                      fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                      background: '#7C3AED22', border: '1px solid #7C3AED44', color: '#A855F7'
                    }}>{g}</span>
                  ))}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                  background: '#2D2D44', padding: '3px 8px', borderRadius: 999, flexShrink: 0 }}>
                  {filme.streaming}
                </span>
              </div>

              {/* Sinopse colapsável */}
              <button onClick={() => setSinopseAberta(!sinopseAberta)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
                <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}>
                  {sinopseAberta ? 'Ocultar sinopse' : 'Ver sinopse'}
                </span>
                {sinopseAberta ? <ChevronUp size={14} color="#6B7280" /> : <ChevronDown size={14} color="#6B7280" />}
              </button>

              <AnimatePresence>
                {sinopseAberta && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6, margin: '8px 0 0', overflow: 'hidden' }}>
                    {filme.sinopse}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Botões Like / Dislike */}
      <div style={{ padding: '16px 20px 32px', display: 'flex', justifyContent: 'center', gap: 32, flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => votar('dislike')} style={{
          width: 64, height: 64, borderRadius: '50%', border: '2px solid #F87171',
          background: '#F8717122', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <X size={28} color="#F87171" />
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => votar('like')} style={{
          width: 64, height: 64, borderRadius: '50%', border: '2px solid #34D399',
          background: '#34D39922', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Heart size={28} color="#34D399" />
        </motion.button>
      </div>

      {/* ── POPOUT DE MATCH ── */}
      <AnimatePresence>
        {match && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }} transition={{ type: 'spring', damping: 15 }}
              style={{
                background: '#1E1E2E', borderRadius: 24, overflow: 'hidden',
                width: '100%', maxWidth: 340, border: '1px solid #7C3AED'
              }}>

              {/* Poster */}
              <div style={{ position: 'relative', height: 280 }}>
                <img src={match.poster} alt={match.titulo}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, #1E1E2E 10%, transparent 60%)'
                }} />
                <motion.div
                  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                    borderRadius: 999, padding: '8px 24px'
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                      🎉 MATCH!
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 20px 24px' }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{match.titulo}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{match.ano}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} color="#FCD34D" fill="#FCD34D" />
                    <span style={{ fontSize: 12, color: '#FCD34D', fontWeight: 700 }}>{match.nota}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>•</span>
                  <span style={{ fontSize: 12, fontWeight: 600,
                    background: '#7C3AED22', color: '#A855F7', padding: '2px 8px', borderRadius: 999 }}>
                    {match.streaming}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {match.sinopse}
                </p>

                {/* Botões */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={() => { setMatch(null); setIndex(index + 1) }} style={{
                    width: '100%', padding: '14px', borderRadius: 14, border: '1px solid #2D2D44',
                    background: '#2D2D44', color: '#E5E7EB', fontWeight: 700,
                    fontSize: 14, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                  }}>
                    Continuar vendo filmes
                  </button>
                  <button onClick={() => router.push('/')} style={{
                    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Voltar ao início
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}