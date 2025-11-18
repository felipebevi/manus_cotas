import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'it' | 'ja';

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

interface I18nStore {
  language: Language;
  translations: Record<string, string>;
  setLanguage: (lang: Language) => void;
  setTranslations: (translations: Record<string, string>) => void;
  t: (key: string, fallback?: string) => string;
}

// Detect browser language
function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLangs: Language[] = ['pt', 'en', 'es', 'fr', 'it', 'ja'];
  
  if (supportedLangs.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'pt'; // Default to Portuguese
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      language: detectBrowserLanguage(),
      translations: {},
      setLanguage: (lang: Language) => set({ language: lang }),
      setTranslations: (translations: Record<string, string>) => set({ translations }),
      t: (key: string, fallback?: string) => {
        const { translations } = get();
        return translations[key] || fallback || key;
      },
    }),
    {
      name: 'i18n-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
