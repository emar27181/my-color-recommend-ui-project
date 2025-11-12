import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  en: {
    translation: en
  },
  ja: {
    translation: ja
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // デフォルト言語を日本語に設定
    fallbackLng: 'ja',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'], // localStorageのみを検出（ブラウザ言語は無視）
      caches: ['localStorage'],
    }
  });

export default i18n;