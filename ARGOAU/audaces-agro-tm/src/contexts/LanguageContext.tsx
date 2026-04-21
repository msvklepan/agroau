import { createContext, useContext, useState, type ReactNode } from 'react'
import { T, type Lang } from '../i18n'

type Translations = typeof T[Lang]

interface LangCtx {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  t: T.en,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LanguageContext.Provider value={{ lang, t: T[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
