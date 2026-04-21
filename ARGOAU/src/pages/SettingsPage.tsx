import { AppleToggle } from '../components/ui/AppleToggle'
import { useLang } from '../contexts/LanguageContext'
import { Bell, Monitor, Database, User, LogOut } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Notifications', ru: 'Уведомления', Icon: Bell,
    rows: [
      { label: 'Pest alerts',           ru: 'Тревоги вредителей',     on: true,  color: '#FF3B30' },
      { label: 'Smart Suggestions',     ru: 'Умные подсказки',         on: true,  color: '#34C759' },
      { label: 'Laser mission updates', ru: 'Обновления лазера',       on: true,  color: '#FF8C42' },
      { label: 'Weather warnings',      ru: 'Погодные предупреждения', on: false, color: '#5AC8FA' },
      { label: 'Weekly reports',        ru: 'Еженедельные отчёты',     on: true,  color: '#5856D6' },
    ],
  },
  {
    title: 'Display', ru: 'Экран', Icon: Monitor,
    rows: [
      { label: 'Dark mode',        ru: 'Тёмная тема',         on: false, color: '#1C1C1E' },
      { label: 'Metric units',     ru: 'Метрические единицы', on: true,  color: '#007AFF' },
      { label: 'Map labels',       ru: 'Метки на карте',       on: false, color: '#34C759' },
    ],
  },
  {
    title: 'Data & Sync', ru: 'Данные и синхронизация', Icon: Database,
    rows: [
      { label: 'Auto-sync Sentinel-2', ru: 'Авто-синхр. Sentinel-2', on: true,  color: '#007AFF' },
      { label: 'Offline mode',         ru: 'Офлайн режим',            on: false, color: '#FF8C42' },
      { label: 'Share analytics',      ru: 'Делиться аналитикой',     on: false, color: '#5AC8FA' },
    ],
  },
]

export function SettingsPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowY: 'auto', scrollbarWidth: 'none', flex: 1, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ paddingTop: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {isRu ? 'Настройки' : 'Settings'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 3, fontFamily: "'SF Mono',monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ARGOAU v2.4.1
          </div>
        </div>

        {/* Account card */}
        <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 5, flexShrink: 0,
            background: 'linear-gradient(145deg,#C5FF4A,#6EC6FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: '#1a3a00',
          }}>MS</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Maxim Svklepan</div>
            <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 2, fontFamily: "'SF Mono',monospace" }}>LEAD AGRONOMIST · PRO PLAN</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <User size={11} style={{ color: 'var(--text-hint)' }} />
          </div>
        </div>

        {/* Subscription info */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {[
            { label: isRu ? 'Тарифный план' : 'Subscription', value: 'Pro · Unlimited', accent: '#C5FF4A', textColor: '#1a3a00' },
            { label: isRu ? 'Хранилище' : 'Data Storage',     value: '24.8 / 100 GB',  accent: '#6EC6FF', textColor: '#002d5a' },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 16px',
              borderBottom: i === 0 ? '0.5px solid var(--border)' : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{row.label}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 3,
                background: row.accent, color: row.textColor, letterSpacing: '0.03em',
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Settings sections */}
        {SECTIONS.map(section => (
          <div key={section.title}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingLeft: 2 }}>
              <section.Icon size={10} style={{ color: 'var(--text-hint)' }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                {isRu ? section.ru : section.title}
              </span>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {section.rows.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px',
                    borderBottom: i < section.rows.length - 1 ? '0.5px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                      background: `${row.color}14`, border: `0.5px solid ${row.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: 1, background: row.color }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {isRu ? row.ru : row.label}
                    </span>
                  </div>
                  <AppleToggle defaultOn={row.on} color={row.color} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button style={{
          width: '100%', borderRadius: 5, padding: '12px', fontSize: 13, fontWeight: 700,
          background: 'rgba(255,59,48,0.06)', color: '#FF3B30',
          border: '1px solid rgba(255,59,48,0.18)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          transition: 'all 0.2s',
        }}>
          <LogOut size={13} />
          {isRu ? 'Выйти из аккаунта' : 'Sign Out'}
        </button>

      </div>
    </div>
  )
}
