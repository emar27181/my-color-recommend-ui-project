import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ToastContainer } from '@/components/ToastContainer';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-background text-foreground h-screen flex flex-col">
      {showHeader && (
        <header className="border-b border-border bg-background flex-shrink-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center relative">
              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="ホームページ"
                >
                  <Home className="w-5 h-5 text-foreground" />
                </Link>
                <div className="text-xs text-muted-foreground opacity-80">
                  {t('common.madeWithClaudeCode')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <div className="relative">
                  <NavigationMenu />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      {children}
      
      <ToastContainer />
      <TutorialOverlay />
    </div>
  );
};