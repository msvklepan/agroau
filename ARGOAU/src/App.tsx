import { AppShell } from './components/layout/AppShell'
import { LanguageProvider } from './contexts/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
