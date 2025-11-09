import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ToastContainer } from '@/components/ToastContainer';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { ConditionBadge } from '@/components/ConditionBadge';
import { ConditionSelector } from '@/components/ConditionSelector';
import { useExperimentCondition } from '@/hooks/useExperimentCondition';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {
  // URLクエリから実験条件を初期化
  useExperimentCondition();

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
              </div>
              <div className="flex items-center gap-3">
                <ConditionSelector />
                <LanguageToggle />
                <div className="relative">
                  <NavigationMenu />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 実験条件バッジ（ヘッダーの直下に配置） */}
      <ConditionBadge />

      {children}
      
      <ToastContainer />
      <TutorialOverlay />
    </div>
  );
};