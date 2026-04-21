import { useLang } from '../../contexts/LanguageContext'
import type { Lang } from '../../i18n'

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div
      className="flex items-center rounded-full p-0.5 gap-0.5 flex-shrink-0"
      style={{
        background: 'var(--bg-surface)',
        border: '0.5px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {(['en', 'ru'] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="rounded-full uppercase transition-all duration-200"
          style={{
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.05em',
            background: lang === l ? 'var(--text-primary)' : 'transparent',
            color: lang === l ? '#fff' : 'var(--text-hint)',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
