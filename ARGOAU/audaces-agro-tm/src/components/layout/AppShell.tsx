import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Layers, Settings, HelpCircle, User, Bell } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { FieldMap } from '../map/FieldMap'
import { WeatherWidget } from '../dashboard/WeatherWidget'
import { CropProductionPanel } from '../dashboard/CropProductionPanel'
import { CodeRedPanel } from '../dashboard/CodeRedPanel'
import { CodeWallPanel } from '../dashboard/CodeWallPanel'
import { DigitalBreedingModule } from '../dashboard/DigitalBreedingModule'
import { MetricCard } from '../ui/MetricCard'
import { NavGlassIcon } from '../ui/NavGlassIcon'
import { LanguageToggle } from '../ui/LanguageToggle'
import { SmartSuggestion } from '../ui/SmartSuggestion'
import { useFieldData } from '../../hooks/useFieldData'
import { useLang } from '../../contexts/LanguageContext'

// Pages
import { SettingsPage } from '../../pages/SettingsPage'
import { ProfilePage } from '../../pages/ProfilePage'
import { HelpCenterPage } from '../../pages/HelpCenterPage'
import { CodeRedFullPage } from '../../pages/CodeRedFullPage'
import { FinancePage } from '../../pages/FinancePage'
import { ResourcesPage } from '../../pages/ResourcesPage'
import { FieldAnalysisPage } from '../../pages/FieldAnalysisPage'

type SideNav = 'home' | 'layers' | 'settings' | 'help' | 'profile'
type TopTab  = 'crop' | 'finance' | 'resources' | 'fieldanalysis' | 'laser'

const DEMO_TABS: TopTab[] = ['crop', 'laser', 'finance']

function HomeDashboard({ activeTab, selectedRegion, onRegionSelect }: { activeTab: TopTab; selectedRegion: string | null; onRegionSelect: (id: string) => void }) {
  const { t } = useLang()
  const { fields, selectedField, selectField, activeLayer, setActiveLayer } = useFieldData()

  if (activeTab === 'laser')         return <FullPageLayout><CodeRedFullPage /></FullPageLayout>
  if (activeTab === 'finance')       return <FullPageLayout><FinancePage region={selectedRegion} /></FullPageLayout>
  if (activeTab === 'resources')     return <FullPageLayout><ResourcesPage /></FullPageLayout>
  if (activeTab === 'fieldanalysis') return <FullPageLayout><FieldAnalysisPage /></FullPageLayout>

  return (
    <div className="flex flex-1 gap-3 p-3 overflow-hidden" style={{ minWidth: 0 }}>
      <Sidebar />
      <div className="flex flex-col flex-1 gap-3 overflow-hidden min-w-0">
        <FieldMap
          fields={fields}
          selectedId={selectedField?.id ?? null}
          activeLayer={activeLayer}
          onSelect={selectField}
          onLayerChange={setActiveLayer}
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
        />
        <div className="flex gap-3 flex-shrink-0">
          <WeatherWidget />
          <CropProductionPanel
            fields={fields}
            selectedId={selectedField?.id ?? null}
            onSelect={selectField}
          />
        </div>
      </div>
      <div
        className="flex flex-col gap-3 overflow-y-auto flex-shrink-0"
        style={{ width: 288, scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}
      >
        <div className="grid grid-cols-2 gap-2 flex-shrink-0">
          <MetricCard label={t.metrics.area}  value="1,446" unit="ha"     icon="🌍" sub={`7 ${t.metrics.fieldsActive}`} trend="up"   trendValue="+3%" />
          <MetricCard label={t.metrics.tasks} value="7"     unit={t.metrics.active} icon="🤖" sub={`2 ${t.metrics.critical}`} accent="var(--accent-orange)" trend="down" trendValue="-1" />
        </div>
        <CodeRedPanel />
        <CodeWallPanel />
        <DigitalBreedingModule />
      </div>
    </div>
  )
}

function FullPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 p-4 overflow-hidden" style={{ minWidth: 0 }}>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  )
}

export function AppShell() {
  const { t } = useLang()
  const [sideNav, setSideNav] = useState<SideNav>('home')
  const [activeTab, setActiveTab] = useState<TopTab>('crop')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const isDemoMode = window.location.hash === '#demo'

  useEffect(() => {
    if (!isDemoMode) return
    let i = 0
    const id = setInterval(() => { i = (i + 1) % DEMO_TABS.length; setActiveTab(DEMO_TABS[i]) }, 8000)
    return () => clearInterval(id)
  }, [isDemoMode])

  function handleRegionSelect(id: string) {
    setSelectedRegion(id === '' ? null : id)
  }

  const isRu = t.systemBar.includes('АГРО')

  const sideNavItems = [
    { icon: Home,       id: 'home'     as SideNav, label: t.nav.dashboard                    },
    { icon: Layers,     id: 'layers'   as SideNav, label: t.nav.fields                       },
    { icon: HelpCircle, id: 'help'     as SideNav, label: isRu ? 'Справка'    : 'Help'       },
    { icon: User,       id: 'profile'  as SideNav, label: isRu ? 'Профиль'    : 'Profile'    },
    { icon: Settings,   id: 'settings' as SideNav, label: isRu ? 'Настройки'  : 'Settings'   },
  ]

  const topTabs = [
    { id: 'crop'          as TopTab, label: t.topFilters[0] },
    { id: 'finance'       as TopTab, label: t.topFilters[1] },
    { id: 'resources'     as TopTab, label: t.topFilters[2] },
    { id: 'fieldanalysis' as TopTab, label: t.topFilters[3] },
    { id: 'laser'         as TopTab, label: isRu ? '🎯 Лазер' : '🎯 Code Red' },
  ]

  function renderContent() {
    if (sideNav === 'settings') return <FullPageLayout><SettingsPage /></FullPageLayout>
    if (sideNav === 'profile')  return <FullPageLayout><ProfilePage /></FullPageLayout>
    if (sideNav === 'help')     return <FullPageLayout><HelpCenterPage region={selectedRegion} /></FullPageLayout>
    if (sideNav === 'layers')   return <FullPageLayout><FieldAnalysisPage /></FullPageLayout>
    return <HomeDashboard activeTab={activeTab} selectedRegion={selectedRegion} onRegionSelect={handleRegionSelect} />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(145deg,#E4EAF4 0%,#EEF1F8 40%,#E8EDF5 100%)', minWidth: 1280 }}>

      {/* System bar */}
      <div
        className="flex items-center justify-center gap-3 px-6 flex-shrink-0"
        style={{ height: 34, background: '#1C1C1E' }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 status-blink" style={{ background: '#34C759' }} />
        <span className="text-white uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', opacity: 0.8 }}>
          {t.systemBar}
        </span>
        {isDemoMode && (
          <span className="ml-3 px-2 py-0.5 rounded-full text-[9px] font-700 uppercase" style={{ background: 'var(--accent-lime)', color: '#1C1C1E' }}>
            DEMO
          </span>
        )}
      </div>

      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          height: 46,
          background: 'rgba(255,255,255,0.68)',
          backdropFilter: 'saturate(200%) blur(48px)',
          WebkitBackdropFilter: 'saturate(200%) blur(48px)',
          borderBottom: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center gap-2 mr-2 flex-shrink-0">
          <div
            className="w-7 h-7 rounded-[9px] flex items-center justify-center text-[15px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#C5FF4A,#6EC6FF)', borderRadius: 5 }}
          >
            🌿
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-800 tracking-tight text-[var(--text-primary)]">ARGOAU</div>
            <div className="text-[9px] font-500 uppercase tracking-widest" style={{ color: 'var(--text-hint)' }}>Turkmenistan</div>
          </div>
        </div>

        {/* Top tabs — only visible on home/layers nav */}
        {(sideNav === 'home') && (
          <nav className="flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {topTabs.map(tab => (
              <button
                key={tab.id}
                className={`pill-btn text-[11px] py-1 px-3 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
        {sideNav !== 'home' && <div className="flex-1" />}

        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageToggle />
          <button className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-surface)]">
            <Bell size={14} style={{ color: 'var(--text-secondary)' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full pest-pulse" style={{ background: 'var(--accent-orange)' }} />
          </button>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-700 flex-shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#C5FF4A,#22d3ee)', color: '#1a4a00' }}
            onClick={() => setSideNav('profile')}
          >
            MS
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Icon side nav */}
        <nav
          className="flex flex-col items-center py-2.5 gap-0.5 flex-shrink-0"
          style={{
            width: 44,
            background: 'rgba(255,255,255,0.60)',
            backdropFilter: 'saturate(200%) blur(48px)',
            WebkitBackdropFilter: 'saturate(200%) blur(48px)',
            borderRight: '1px solid rgba(255,255,255,0.50)',
          }}
        >
          {sideNavItems.map(({ icon: Icon, id, label }) => (
            <button
              key={id}
              title={label}
              className="transition-all duration-200"
              onClick={() => setSideNav(id)}
            >
              <NavGlassIcon icon={Icon} active={sideNav === id} />
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={sideNav === 'home' ? `home-${activeTab}` : sideNav}
            className="flex flex-1 overflow-hidden min-w-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <SmartSuggestion />
    </div>
  )
}
