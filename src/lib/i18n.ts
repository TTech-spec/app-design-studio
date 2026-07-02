import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES } from "./agricon-data";

export type LocaleCode = (typeof LANGUAGES)[number]["code"];

const LOCALE_KEY = "agricon_locale";
const DEFAULT_LOCALE: LocaleCode = "en";

function readStoredLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const raw = window.localStorage.getItem(LOCALE_KEY);
  return (LANGUAGES.some((l) => l.code === raw) ? raw : DEFAULT_LOCALE) as LocaleCode;
}

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    window.localStorage.setItem(LOCALE_KEY, code);
  }, []);

  return createElement(LocaleContext.Provider, { value: { locale, setLocale } }, children);
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
