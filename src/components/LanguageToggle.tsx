import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-foreground bg-transparent border-transparent hover:bg-transparent hover:border-transparent"
      title={i18n.language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">
        {i18n.language === 'ja' ? 'EN' : 'JP'}
      </span>
    </Button>
  );
};