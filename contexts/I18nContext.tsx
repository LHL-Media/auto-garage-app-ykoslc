
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n, { initializeI18n, changeLanguage as changeI18nLanguage, getCurrentLanguage } from '@/i18n/config';

interface I18nContextType {
  t: (key: string) => string;
  locale: string;
  changeLanguage: (locale: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(getCurrentLanguage());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeI18n();
      setLocale(getCurrentLanguage());
      setInitialized(true);
    };
    init();
  }, []);

  const changeLanguage = async (newLocale: string) => {
    await changeI18nLanguage(newLocale);
    setLocale(newLocale);
  };

  const t = (key: string) => {
    return i18n.t(key);
  };

  if (!initialized) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ t, locale, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
