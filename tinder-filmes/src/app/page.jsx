'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tv2, Play, CheckCircle2 } from 'lucide-react'

const STREAMINGS = [
  { id: 'netflix',  nome: 'NETFLIX'  },
  { id: 'prime',    nome: 'PRIME'    },
  { id: 'disney',   nome: 'DISNEY+'  },
  { id: 'max',      nome: 'MAX'      },
  { id: 'apple',    nome: 'APPLE TV' },
  { id: 'globo',    nome: 'GLOBOPLAY'},
  { id: 'paramount',nome: 'PARAMOUNT'},
  { id: 'mubi',     nome: 'MUBI'     },
]

const GENEROS = [
  'Action', 'Comedy', 'Romance', 'Horror',
  'Sci-Fi', 'Drama', 'Thriller', 'Animation',
  'Documentary', 'Fantasy',
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' }
  })
}

export default function Home() {
  const router = useRouter()
  const [tela, setTela] = useState('inicio') // 'inicio' | 'criar' | 'entrar'
  const [apelido, setApelido] = useState('')
  const [codigoSala, setCodigoSala] = useState('')
  const [streamings, setStreamings] = useState([])
  const [generos, setGeneros] = useState([])
  const [erro, setErro] = useState('')

  function toggleItem(lista, setLista, item) {
    setLista(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  function criarSala() {
    if (!apelido.trim()) return setErro('Digite seu apelido')
    if (streamings.length === 0) return setErro('Selecione pelo menos um streaming')
    if (generos.length === 0) return setErro('Selecione pelo menos um gênero')
    setErro('')
    router.push('/sala/teste123')
  }

  function entrarSala() {
    if (!apelido.trim()) return setErro('Digite seu apelido')
    if (!codigoSala.trim()) return setErro('Digite o código da sala')
    setErro('')
    router.push(`/sala/${codigoSala.trim().toLowerCase()}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #2D1B69 0%, #1A0F3C 35%, #0D0D1A 70%)'
      }}>

      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Logo */}
        <motion.div variants={fadeUp} initial="hidden" animate="show"
          custom={0} className="flex flex-col items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
            <Tv2 size={32} color="white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold">
              <span style={{ color: '#FFFFFF' }}>Tinder dos </span>
              <span style={{ color: '#A855F7' }}>Filmes</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
              Match de filmes com amigos
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── TELA INICIAL ── */}
          {tela === 'inicio' && (
            <motion.div key="inicio"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
              className="flex flex-col gap-3">

              <button onClick={() => setTela('criar')}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff' }}>
                <Tv2 size={18} />
                Criar Sala
              </button>

              <button onClick={() => setTela('entrar')}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-95"
                style={{ background: '#1E1E2E', color: '#E5E7EB', border: '1px solid #2D2D44' }}>
                <Play size={18} />
                Entrar em Sala
              </button>

              {/* Gêneros (preview) */}
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#9CA3AF' }}>Escolha os Gêneros</p>
                <div className="flex flex-wrap gap-2">
                  {GENEROS.map((g, i) => (
                    <motion.button key={g} variants={fadeUp} initial="hidden"
                      animate="show" custom={i * 0.5}
                      onClick={() => toggleItem(generos, setGeneros, g)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                      style={{
                        background: generos.includes(g) ? '#7C3AED22' : '#1E1E2E',
                        border: `1px solid ${generos.includes(g) ? '#A855F7' : '#2D2D44'}`,
                        color: generos.includes(g) ? '#A855F7' : '#9CA3AF',
                      }}>
                      {g}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Streamings (preview) */}
              <div className="mt-2">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#9CA3AF' }}>Streaming</p>
                <div className="grid grid-cols-4 gap-2">
                  {STREAMINGS.map((s, i) => (
                    <motion.button key={s.id} variants={fadeUp} initial="hidden"
                      animate="show" custom={i * 0.3}
                      onClick={() => toggleItem(streamings, setStreamings, s.id)}
                      className="py-3 rounded-xl text-xs font-bold transition-all relative"
                      style={{
                        background: streamings.includes(s.id) ? '#7C3AED22' : '#1E1E2E',
                        border: `1px solid ${streamings.includes(s.id) ? '#A855F7' : '#2D2D44'}`,
                        color: streamings.includes(s.id) ? '#A855F7' : '#9CA3AF',
                      }}>
                      {streamings.includes(s.id) && (
                        <CheckCircle2 size={10} className="absolute top-1 right-1"
                          style={{ color: '#A855F7' }} />
                      )}
                      {s.nome}
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs mt-4" style={{ color: '#4B5563' }}>
                Inspirado por Tinder &amp; Twitch
              </p>
            </motion.div>
          )}

          {/* ── TELA CRIAR SALA ── */}
          {tela === 'criar' && (
            <motion.div key="criar"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
              className="flex flex-col gap-5">

              <button onClick={() => { setTela('inicio'); setErro('') }}
                className="text-sm self-start flex items-center gap-1"
                style={{ color: '#9CA3AF' }}>
                ← Voltar
              </button>

              <h2 className="text-xl font-bold">Criar nova sala</h2>

              {/* Apelido */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: '#9CA3AF' }}>Seu apelido</label>
                <input type="text" placeholder="Como quer ser chamado?"
                  value={apelido} onChange={e => setApelido(e.target.value)}
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#1E1E2E', border: '1px solid #2D2D44', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#A855F7'}
                  onBlur={e => e.target.style.borderColor = '#2D2D44'}
                />
              </div>

              {/* Gêneros */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: '#9CA3AF' }}>Gêneros</label>
                <div className="flex flex-wrap gap-2">
                  {GENEROS.map(g => (
                    <button key={g} onClick={() => toggleItem(generos, setGeneros, g)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: generos.includes(g) ? '#7C3AED22' : '#1E1E2E',
                        border: `1px solid ${generos.includes(g) ? '#A855F7' : '#2D2D44'}`,
                        color: generos.includes(g) ? '#A855F7' : '#9CA3AF',
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streamings */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: '#9CA3AF' }}>Streaming</label>
                <div className="grid grid-cols-4 gap-2">
                  {STREAMINGS.map(s => (
                    <button key={s.id} onClick={() => toggleItem(streamings, setStreamings, s.id)}
                      className="py-3 rounded-xl text-xs font-bold transition-all relative"
                      style={{
                        background: streamings.includes(s.id) ? '#7C3AED22' : '#1E1E2E',
                        border: `1px solid ${streamings.includes(s.id) ? '#A855F7' : '#2D2D44'}`,
                        color: streamings.includes(s.id) ? '#A855F7' : '#9CA3AF',
                      }}>
                      {streamings.includes(s.id) && (
                        <CheckCircle2 size={10} className="absolute top-1 right-1"
                          style={{ color: '#A855F7' }} />
                      )}
                      {s.nome}
                    </button>
                  ))}
                </div>
              </div>

              {erro && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-center" style={{ color: '#F87171' }}>
                  ⚠️ {erro}
                </motion.p>
              )}

              <button onClick={criarSala}
                className="w-full py-4 rounded-2xl font-bold text-base transition-transform active:scale-95 mt-1"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff' }}>
                Criar Sala →
              </button>
            </motion.div>
          )}

          {/* ── TELA ENTRAR ── */}
          {tela === 'entrar' && (
            <motion.div key="entrar"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
              className="flex flex-col gap-5">

              <button onClick={() => { setTela('inicio'); setErro('') }}
                className="text-sm self-start flex items-center gap-1"
                style={{ color: '#9CA3AF' }}>
                ← Voltar
              </button>

              <h2 className="text-xl font-bold">Entrar em sala</h2>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: '#9CA3AF' }}>Seu apelido</label>
                <input type="text" placeholder="Como quer ser chamado?"
                  value={apelido} onChange={e => setApelido(e.target.value)}
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#1E1E2E', border: '1px solid #2D2D44', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#A855F7'}
                  onBlur={e => e.target.style.borderColor = '#2D2D44'}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: '#9CA3AF' }}>Código da sala</label>
                <input type="text" placeholder="Ex: XKTZ91"
                  value={codigoSala} onChange={e => setCodigoSala(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none uppercase tracking-widest"
                  style={{ background: '#1E1E2E', border: '1px solid #2D2D44', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#A855F7'}
                  onBlur={e => e.target.style.borderColor = '#2D2D44'}
                />
              </div>

              {erro && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-center" style={{ color: '#F87171' }}>
                  ⚠️ {erro}
                </motion.p>
              )}

              <button onClick={entrarSala}
                className="w-full py-4 rounded-2xl font-bold text-base transition-transform active:scale-95 mt-1"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff' }}>
                Entrar na Sala →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}