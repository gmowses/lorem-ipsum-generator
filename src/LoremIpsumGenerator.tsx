import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, Sun, Moon, Languages, Type, RefreshCw } from 'lucide-react'

// ── i18n ─────────────────────────────────────────────────────────────────────
const translations = {
  en: {
    title: 'Lorem Ipsum Generator',
    subtitle: 'Generate placeholder text in classic, hipster, or tech flavors. Client-side only.',
    mode: 'Text Mode',
    classic: 'Lorem Ipsum',
    hipster: 'Hipster',
    tech: 'Tech',
    unit: 'Generate',
    paragraphs: 'Paragraphs',
    sentences: 'Sentences',
    words: 'Words',
    count: 'Count',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied!',
    builtBy: 'Built by',
    result: 'Generated Text',
  },
  pt: {
    title: 'Gerador Lorem Ipsum',
    subtitle: 'Gere texto de preenchimento no estilo classico, hipster ou tech. Tudo no navegador.',
    mode: 'Modo de Texto',
    classic: 'Lorem Ipsum',
    hipster: 'Hipster',
    tech: 'Tech',
    unit: 'Gerar',
    paragraphs: 'Paragrafos',
    sentences: 'Frases',
    words: 'Palavras',
    count: 'Quantidade',
    generate: 'Gerar',
    copy: 'Copiar',
    copied: 'Copiado!',
    builtBy: 'Criado por',
    result: 'Texto Gerado',
  }
} as const
type Lang = keyof typeof translations

// ── Word banks ────────────────────────────────────────────────────────────────
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const HIPSTER_WORDS = 'artisan organic kale chips literally viral authentic hashtag selvage small-batch craft beer fixie normcore twee seitan skateboard messenger bag lomo humblebrag synth fingerstache chicharrones cray ugh lo-fi tousled disrupt gastropub letterpress typewriter marfa ennui butcher mixtape plaid quinoa ethical truffaut semiotics tumblr gluten-free sustainable locavore cold-pressed poutine activated charcoal kombucha gentrify pickled bitters brooklyn williamsburg vegan cardigan retro flannel asymmetrical dreamcatcher bicycle rights tattooed helvetica tofu listicle swag occupy pork belly wolf mumblecore pour-over blue bottle affogato stumptown narwhal meggings portland'.split(' ')

const TECH_WORDS = 'kubernetes microservices containerization orchestration deployment pipeline infrastructure scalability observability telemetry distributed consensus eventual consistency idempotency throughput latency pagination caching invalidation authentication authorization JWT OAuth RBAC CICD DevOps SRE MLOps terraform ansible helm argocd prometheus grafana elasticsearch kafka redis postgresql mongodb serverless lambda edge computing WebAssembly TypeScript React GraphQL REST gRPC protobuf monorepo trunk-based refactoring abstraction interface polymorphism dependency injection SOLID principles clean code technical debt backlog sprint retrospective velocity stakeholder alignment roadmap OKR KPI SLA SLO SLI incident postmortem runbook on-call escalation circuit-breaker retry exponential-backoff load-balancer CDN WAF DDoS encryption TLS mTLS zero-trust'.split(' ')

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function capitalizeFirst(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1) }

function makeSentence(words: string[], minW = 5, maxW = 15): string {
  const len = minW + Math.floor(Math.random() * (maxW - minW))
  const ws = Array.from({ length: len }, () => pick(words))
  return capitalizeFirst(ws.join(' ')) + '.'
}

function makeParagraph(words: string[], minS = 3, maxS = 7): string {
  const count = minS + Math.floor(Math.random() * (maxS - minS))
  return Array.from({ length: count }, () => makeSentence(words)).join(' ')
}

function generate(mode: 'classic' | 'hipster' | 'tech', unit: 'paragraphs' | 'sentences' | 'words', count: number): string {
  const words = mode === 'classic' ? LOREM_WORDS : mode === 'hipster' ? HIPSTER_WORDS : TECH_WORDS

  if (unit === 'words') {
    return capitalizeFirst(Array.from({ length: count }, () => pick(words)).join(' ')) + '.'
  }
  if (unit === 'sentences') {
    return Array.from({ length: count }, () => makeSentence(words)).join(' ')
  }
  // paragraphs
  return Array.from({ length: count }, () => makeParagraph(words)).join('\n\n')
}

export default function LoremIpsumGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [mode, setMode] = useState<'classic' | 'hipster' | 'tech'>('classic')
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const t = translations[lang]
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const handleGenerate = useCallback(() => {
    setOutput(generate(mode, unit, count))
  }, [mode, unit, count])

  useEffect(() => { handleGenerate() }, [handleGenerate])

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const maxCount = unit === 'paragraphs' ? 20 : unit === 'sentences' ? 100 : 500

  const accentColors = {
    classic: 'bg-purple-500',
    hipster: 'bg-pink-500',
    tech: 'bg-cyan-500',
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${accentColors[mode]} rounded-lg flex items-center justify-center transition-colors`}>
              <Type size={18} className="text-white" />
            </div>
            <span className="font-semibold">Lorem Ipsum Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/lorem-ipsum-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-6">
            {/* Mode */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.mode}</p>
              <div className="flex gap-2 flex-wrap">
                {(['classic', 'hipster', 'tech'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      mode === m
                        ? m === 'classic' ? 'bg-purple-500 border-purple-500 text-white'
                          : m === 'hipster' ? 'bg-pink-500 border-pink-500 text-white'
                          : 'bg-cyan-500 border-cyan-500 text-white'
                        : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {m === 'classic' ? t.classic : m === 'hipster' ? t.hipster : t.tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.unit}</p>
              <div className="flex gap-2">
                {(['paragraphs', 'sentences', 'words'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => { setUnit(u); setCount(u === 'paragraphs' ? 3 : u === 'sentences' ? 5 : 50) }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      unit === u ? 'bg-purple-500 border-purple-500 text-white' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {u === 'paragraphs' ? t.paragraphs : u === 'sentences' ? t.sentences : t.words}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t.count}</label>
                <span className="text-sm font-bold text-purple-500 tabular-nums">{count}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setCount(c => Math.max(1, c - 1))} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">-</button>
                <input type="range" min={1} max={maxCount} value={count} onChange={e => setCount(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-purple-500" />
                <button onClick={() => setCount(c => Math.min(maxCount, c + 1))} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleGenerate} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition-colors">
                <RefreshCw size={15} />{t.generate}
              </button>
              <button onClick={copy} disabled={!output} className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40">
                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{t.result}</h2>
                <span className="text-xs text-zinc-400">{output.split(/\s+/).filter(Boolean).length} {t.words.toLowerCase()}</span>
              </div>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
                {output}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-purple-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
