"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { translations, type TranslationKey } from "./translations"

export type Lang = "ar" | "en"

export type Localized = { ar: string; en: string }
export type LocalizedArr = { ar: string[]; en: string[] }

type LanguageContextValue = {
  lang: Lang
  dir: "rtl" | "ltr"
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** Translate a UI dictionary key */
  t: (key: TranslationKey) => string
  /** Resolve a localized value coming from data ({ ar, en }) */
  tr: <T extends string | string[]>(value: { ar: T; en: T }) => T
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "leapai-lang"

export function LanguageProvider({
  children,
  defaultLanguage = "ar",
}: {
  children: React.ReactNode
  defaultLanguage?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(defaultLanguage)

  // Load saved preference after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) as Lang | null
    if (saved === "ar" || saved === "en") {
      setLangState(saved)
    } else if (defaultLanguage === "ar" || defaultLanguage === "en") {
      setLangState(defaultLanguage)
    }
  }, [defaultLanguage])

  // Reflect language + direction on <html>
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar")
  }, [lang, setLang])

  const t = useCallback(
    (key: TranslationKey) => {
      const entry = translations[key]
      if (!entry) return key
      return entry[lang]
    },
    [lang],
  )

  const tr = useCallback(
    (<T extends string | string[]>(value: { ar: T; en: T }) => (value ? value[lang] : value)) as LanguageContextValue["tr"],
    [lang],
  )

  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t, tr }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
